import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.linear_model import LinearRegression
import random
from duckduckgo_search import DDGS

class FinancialMLEngine:
    def __init__(self):
        # 1. Initialize Anomaly Detection Model (Isolation Forest)
        self.anomaly_detector = IsolationForest(contamination=0.05, random_state=42)
        self._train_anomaly_model()

        # 2. Initialize Forecasting Model (Linear Regression for Time-Series)
        self.forecaster = LinearRegression()
        self._train_forecaster()

    def _train_anomaly_model(self):
        # Simulating training on historical "Kaggle" financial transactions
        # Features: [Amount, Category_Code, Is_Weekend]
        normal_data = np.random.normal(loc=[500, 2, 0], scale=[100, 1, 0.2], size=(500, 3))
        # High value anomalies
        outlier_data = np.random.normal(loc=[5000, 5, 1], scale=[500, 1, 0.1], size=(20, 3))
        
        X_train = np.vstack([normal_data, outlier_data])
        self.anomaly_detector.fit(X_train)

    def _train_forecaster(self):
        # Simulate last 24 months of revenue data
        X_time = np.arange(1, 25).reshape(-1, 1)
        # Base revenue 1.0M + 0.05M per month + noise
        y_rev = 1.0 + X_time.ravel() * 0.05 + np.random.normal(0, 0.1, 24)
        self.forecaster.fit(X_time, y_rev)

    def analyze_transaction(self, amount: float, category: int, is_weekend: int) -> dict:
        """Runs the deep anomaly detection model on real-time data."""
        X_new = np.array([[amount, category, is_weekend]])
        prediction = self.anomaly_detector.predict(X_new)[0]
        confidence = self.anomaly_detector.decision_function(X_new)[0]
        
        is_anomaly = True if prediction == -1 else False
        return {
            "amount": amount,
            "is_anomaly": is_anomaly,
            "anomaly_score": round(abs(confidence), 3),
            "status": "FLAGGED (High Risk)" if is_anomaly else "CLEARED"
        }

    def forecast_cashflow(self, months_ahead: int = 3) -> dict:
        """Projects future cashflow using trained regression model."""
        future_months = np.array([24 + i for i in range(1, months_ahead + 1)]).reshape(-1, 1)
        predictions = self.forecaster.predict(future_months)
        return {
            "proj_revenue_m3": round(predictions[-1], 2),
            "trend": "Positive" if predictions[-1] > predictions[0] else "Negative"
        }

class DeepSearchAgent:
    def search_market_data(self, query: str):
        try:
            with DDGS() as ddgs:
                results = list(ddgs.text(query, max_results=1))
                if results:
                    return f"Deep Search Index: {results[0]['title']} - {results[0]['snippet']}"
                return "Data not found in public indices."
        except Exception:
            return "Web research capabilities restricted."

ml_core = FinancialMLEngine()
research_agent = DeepSearchAgent()
