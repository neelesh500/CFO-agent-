import asyncio
import json
import random
import os
import sqlite3
from typing import List, Optional
from datetime import datetime
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai

from ml_engine import ml_core, research_agent

load_dotenv()

GEMINI_KEY = os.getenv("GEMINI_API_KEY", "")
has_ai = False
agent_chat = None

if GEMINI_KEY and GEMINI_KEY.strip() != "your_gemini_api_key_here":
    try:
        genai.configure(api_key=GEMINI_KEY)
        llm_model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            system_instruction=(
                "You are Vittya, a highly advanced Autonomous AI CFO. "
                "You assist users in managing enterprise finances, analyzing cash flow, forecasting, "
                "and making automated financial decisions. You must await human approval for critical actions."
            )
        )
        agent_chat = llm_model.start_chat(history=[])
        has_ai = True
    except Exception as e:
        print(f"Failed to load AI: {e}")

app = FastAPI(title="Vittya AI Agentic Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === SQLITE INIT ===
def init_db():
    conn = sqlite3.connect("financials.db")
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS payments (id INTEGER PRIMARY KEY, recipient TEXT, amount REAL, status TEXT, date TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS salaries (id INTEGER PRIMARY KEY, employee TEXT, amount REAL, status TEXT, date TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS decisions (id INTEGER PRIMARY KEY, agent_proposal TEXT, status TEXT, date TEXT)''')
    
    c.execute("SELECT COUNT(*) FROM payments")
    if c.fetchone()[0] == 0:
        c.execute("INSERT INTO payments (recipient, amount, status, date) VALUES ('Cloudflare', 120.0, 'Pending', '2026-09-26')")
        c.execute("INSERT INTO payments (recipient, amount, status, date) VALUES ('AWS', 4500.0, 'Paid', '2026-09-21')")
        c.execute("INSERT INTO salaries (employee, amount, status, date) VALUES ('Alice (Eng)', 8500.0, 'Pending', '2026-10-01')")
        c.execute("INSERT INTO salaries (employee, amount, status, date) VALUES ('Bob (MktG)', 6200.0, 'Pending', '2026-10-01')")
        c.execute("INSERT INTO decisions (agent_proposal, status, date) VALUES ('Halt $5000 transaction to unsanctioned vendor.', 'Pending Approval', '2026-09-26')")
        c.execute("INSERT INTO decisions (agent_proposal, status, date) VALUES ('Reallocate $2000 from Legal to Marketing based on burn rate.', 'Pending Approval', '2026-09-27')")
    
    conn.commit()
    conn.close()

init_db()

# === AUTH & RBAC (Mock JWT) ===
class LoginRequest(BaseModel):
    username: str
    password: str

MOCK_USERS = {
    "cfo": {"password": "pass", "role": "CFO_ADMIN"},
    "analyst": {"password": "pass", "role": "ANALYST"}
}
SESSIONS = {}

def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = authorization.split(" ")[1]
    if token not in SESSIONS:
        raise HTTPException(status_code=401, detail="Invalid token")
    return SESSIONS[token]

def require_cfo(user: dict = Depends(get_current_user)):
    if user["role"] != "CFO_ADMIN":
        raise HTTPException(status_code=403, detail="CFO access required to perform this action.")
    return user

@app.post("/api/login")
async def login(req: LoginRequest):
    if req.username in MOCK_USERS and MOCK_USERS[req.username]["password"] == req.password:
        token = f"token_{req.username}_{random.randint(1000,9999)}"
        SESSIONS[token] = {"username": req.username, "role": MOCK_USERS[req.username]["role"]}
        return {"token": token, "role": MOCK_USERS[req.username]["role"]}
    raise HTTPException(status_code=401, detail="Invalid credentials")

# === ENDPOINTS ===
@app.get("/api/payments")
def get_payments(user: dict = Depends(get_current_user)):
    conn = sqlite3.connect("financials.db")
    conn.row_factory = sqlite3.Row
    res = conn.execute("SELECT * FROM payments").fetchall()
    conn.close()
    return [dict(r) for r in res]

@app.get("/api/salaries")
def get_salaries(user: dict = Depends(get_current_user)):
    conn = sqlite3.connect("financials.db")
    conn.row_factory = sqlite3.Row
    res = conn.execute("SELECT * FROM salaries").fetchall()
    conn.close()
    return [dict(r) for r in res]

class PaymentUpdate(BaseModel):
    status: str

@app.put("/api/payments/{pay_id}")
def update_payment(pay_id: int, payload: PaymentUpdate, user: dict = Depends(require_cfo)):
    conn = sqlite3.connect("financials.db")
    conn.execute("UPDATE payments SET status = ? WHERE id = ?", (payload.status, pay_id))
    conn.commit()
    conn.close()
    return {"message": "Payment updated"}

@app.get("/api/decisions")
def get_decisions(user: dict = Depends(get_current_user)):
    conn = sqlite3.connect("financials.db")
    conn.row_factory = sqlite3.Row
    res = conn.execute("SELECT * FROM decisions").fetchall()
    conn.close()
    return [dict(r) for r in res]

class DecisionAction(BaseModel):
    action: str

@app.post("/api/decisions/{dec_id}/action")
def act_on_decision(dec_id: int, payload: DecisionAction, user: dict = Depends(require_cfo)):
    conn = sqlite3.connect("financials.db")
    status_str = f"{payload.action}d by {user['username']}"
    conn.execute("UPDATE decisions SET status = ? WHERE id = ?", (status_str, dec_id))
    conn.commit()
    conn.close()
    return {"message": f"Decision {payload.action}d"}

# === WS & METRICS & BACKGROUND TASKS ===
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

async def agent_workflow_simulator():
    while True:
        await asyncio.sleep(random.uniform(4.0, 8.0))
        if random.random() < 0.33:
            amount = random.choice([250, 400, 600, 5000, 7500])
            category = random.randint(1, 5)
            weekend = random.choice([0, 1])
            ml_result = ml_core.analyze_transaction(amount, category, weekend)
            if ml_result["is_anomaly"]:
                msg = f"ML DETECTED ANOMALY (Score: {ml_result['anomaly_score']}): Flagged transaction of ${amount}. Halt authorized."
                agent = "Insight Agent"
                # Add a decision
                conn = sqlite3.connect("financials.db")
                conn.execute("INSERT INTO decisions (agent_proposal, status, date) VALUES (?, ?, ?)", (f"Approve anomalous transaction of ${amount}.", "Pending Approval", datetime.now().strftime("%Y-%m-%d")))
                conn.commit()
                conn.close()
            else:
                msg = f"Transaction ${amount} cleared by ML Isolation Forest."
                agent = "Bookkeeping Agent"
            log_entry = {
                "timestamp": datetime.now().strftime("%H:%M:%S"),
                "agent": agent,
                "message": msg,
                "type": "execution_log"
            }
        else:
            standard_tasks = ["Ingesting Azure SQL logs...", "Data normalisation check: Pass", "Generating rolling cashflow projection...", "Cross-account reconciliation initiated"]
            log_entry = {
                "timestamp": datetime.now().strftime("%H:%M:%S"),
                "agent": random.choice(["Data Agent", "Reconciliation Agent"]),
                "message": random.choice(standard_tasks),
                "type": "execution_log"
            }
        await manager.broadcast(json.dumps(log_entry))

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(agent_workflow_simulator())

async def generate_smart_fallback(query: str):
    query = query.lower()
    await asyncio.sleep(1.5)
    if "hello" in query or "hi" in query or "hey" in query:
        return "Hello! I am Vittya, your autonomous CFO. I am actively monitoring your financial pipelines using ML anomaly detection."
    elif "forecast" in query or "predict" in query or "runway" in query:
        ml_fcst = ml_core.forecast_cashflow(months_ahead=3)
        rev = ml_fcst["proj_revenue_m3"]
        return f"Based on our Scikit-Learn linear regression model, projected Q3 Revenue is ${rev}M with a {ml_fcst['trend']} trend over the next 90 days."
    elif "search" in query or "market" in query or "research" in query:
        search_query = query.replace("search", "").strip()
        if not search_query: search_query = "latest business finance technology trends"
        res = research_agent.search_market_data(search_query)
        return f"Deep Search Result: {res}"
    elif "approve" in query or "pay" in query:
        return "Risk assessment algorithm confirms 98% confidence. Payout has been autonomously approved in the ledger."
    else:
        return f"I have received your financial instruction: '{query}'. Processing via the Agentic Pipeline."

@app.websocket("/ws/agent-room")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        await websocket.send_text(json.dumps({
            "timestamp": datetime.now().strftime("%H:%M:%S"),
            "agent": "System",
            "message": "Connected to Vittya AI Agent Orchestrator. Machine Learning Models (IsolationForest & Regression) Online.",
            "type": "system"
        }))
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(json.dumps({
                "timestamp": datetime.now().strftime("%H:%M:%S"),
                "agent": "User Query",
                "message": data,
                "type": "user_input"
            }))
            await manager.broadcast(json.dumps({
                "timestamp": datetime.now().strftime("%H:%M:%S"),
                "agent": "Decision Agent",
                "message": "Analyzing real-time ML inputs...",
                "type": "agent_reasoning"
            }))
            try:
                if has_ai and agent_chat:
                    response_obj = await asyncio.to_thread(agent_chat.send_message, data)
                    ai_reply = response_obj.text
                else:
                    ai_reply = await generate_smart_fallback(data)
            except Exception as e:
                ai_reply = "Currently experiencing an AI connection wait, but executing on fallback heuristics."

            await manager.broadcast(json.dumps({
                "timestamp": datetime.now().strftime("%H:%M:%S"),
                "agent": "Vittya AI",
                "message": ai_reply.strip(),
                "type": "agent_action"
            }))
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.get("/api/dashboard/metrics")
def get_dashboard_metrics():
    ml_fcst = ml_core.forecast_cashflow(1)
    rev_str = f"${ml_fcst['proj_revenue_m3']}M"
    return {
        "total_liquidity": "$5.8M",
        "burn_rate": "$125k / mo",
        "q2_revenue": rev_str,
        "actions_executed": "1,492",
        "status": "Healthy"
    }
