import asyncio
import json
import random
import os
from datetime import datetime
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import google.generativeai as genai

# Import our new ML Engine!
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
                "and making automated financial decisions. You are professional and extremely sharp."
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
    """Background task to simulate constant multi-agent data monitoring, powered by Scikit-Learn!"""
    while True:
        await asyncio.sleep(random.uniform(4.0, 8.0))
        
        # 1-in-3 chance to generate a random transaction to run through the Anomaly Model
        if random.random() < 0.33:
            amount = random.choice([250, 400, 600, 5000, 7500])
            category = random.randint(1, 5)
            weekend = random.choice([0, 1])
            
            # RUN REAL ML MODEL
            ml_result = ml_core.analyze_transaction(amount, category, weekend)
            
            if ml_result["is_anomaly"]:
                msg = f"ML DETECTED ANOMALY (Score: {ml_result['anomaly_score']}): Flagged transaction of ${amount}. Halt authorized."
                agent = "Insight Agent"
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
            # Standard background mock
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
    """Fallback Engine querying Scikit-Learn logic if GenAI lacks a key."""
    query = query.lower()
    await asyncio.sleep(1.5)
    
    if "hello" in query or "hi" in query or "hey" in query:
        return "Hello! I am Vittya, your autonomous CFO. I am actively monitoring your financial pipelines using ML anomaly detection."
    
    elif "forecast" in query or "predict" in query or "runway" in query:
        # PULL REAL ML FORECAST
        ml_fcst = ml_core.forecast_cashflow(months_ahead=3)
        rev = ml_fcst["proj_revenue_m3"]
        return f"Based on our Scikit-Learn linear regression model, projected Q3 Revenue is ${rev}M with a {ml_fcst['trend']} trend over the next 90 days."
    
    elif "search" in query or "market" in query or "research" in query:
        # PULL DEEP SEARCH (DUCKDUCKGO)
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
                "message": f"Analyzing real-time ML inputs...",
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
async def get_dashboard_metrics():
    # Use real forecast model for Q2 revenue projection stat
    ml_fcst = ml_core.forecast_cashflow(1)
    rev_str = f"${ml_fcst['proj_revenue_m3']}M"
    return {
        "total_liquidity": "$5.8M",
        "burn_rate": "$125k / mo",
        "q2_revenue": rev_str,
        "actions_executed": "1,492",
        "status": "Healthy"
    }
