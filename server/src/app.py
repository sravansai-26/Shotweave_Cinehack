from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from pymongo import MongoClient
from bson import ObjectId
import os
import datetime
from .ai_service import get_script_breakdown, get_budget_risk 

load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# --- Database Connection (MongoDB) ---
# FIX 1: We default to localhost for native execution (which is what you are running now).
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/shotweave")
client = MongoClient(MONGO_URI)

# FIX 2: Explicitly connect to the 'shotweave' database name
DB = client['shotweave'] 

# Mock Data (Synced with FE mockData.ts)
MOCK_PROJECT_ID = "6513e9a5c8e31b6e4e5d6d34" 
MOCK_USERS = {
    "producer@shotweave.com": {"id": "U001", "name": "Sarah Chen", "role": "Owner"},
    "manager@shotweave.com": {"id": "U002", "name": "Mike Rodriguez", "role": "Manager"},
    "executor@shotweave.com": {"id": "U003", "name": "Alex Kumar", "role": "Executor"},
    "creative@shotweave.com": {"id": "U004", "name": "Emma Thompson", "role": "Creative"},
}
MOCK_PASSWORD = "demo123" 

def map_project_for_response(project):
    return {
        "_id": project.get("_id", MOCK_PROJECT_ID),
        "title": project.get("title", "Mangalam: The Final Cut"),
        "budget_total": project.get("budget_total", 50.0),
        "status": project.get("status", "PRODUCTION"),
        "ai_risk_score": project.get("ai_risk_score", 70), 
        "predicted_overrun_crores": project.get("predicted_overrun_crores", 2.5),
        "current_spend_pct": project.get("current_spend_pct", 65.0)
    }

# --- MongoDB Connection Test Function (FOR TERMINAL OUTPUT) ---
def check_db_connection():
    try:
        # Check connection by running a simple admin command
        client.admin.command('ismaster') 
        print("-" * 50)
        print("🚀 MongoDB CONNECTION SUCCESSFUL: Database is ready.")
        print("-" * 50)
    except Exception as e:
        print("-" * 50)
        print(f"❌ MongoDB CONNECTION FAILED: {e}")
        print("Please ensure your local MongoDB service is running on port 27017.")
        print("-" * 50)

# --- 1. AUTHENTICATION ENDPOINT ---

@app.route('/api/auth/login', methods=['POST'])
def login_route():
    """Handles user login and returns the assigned role for RBAC routing."""
    data = request.get_json()
    email = data.get('email', '').lower()
    password = data.get('password')

    if email in MOCK_USERS and password == MOCK_PASSWORD:
        user_info = MOCK_USERS[email]
        return jsonify({
            "success": True,
            "message": "Authentication successful.",
            "user": {
                "id": user_info["id"],
                "name": user_info["name"],
                "email": email,
                "role": user_info["role"], 
                "project_id": MOCK_PROJECT_ID 
            }
        })
    else:
        return jsonify({"success": False, "error": "Invalid credentials."}), 401

# --- 2. CORE AI/ML ENDPOINTS ---

@app.route('/api/breakdown', methods=['POST'])
def script_breakdown_route():
    """ENDPOINT: Calls the NLP service to perform script breakdown."""
    data = request.get_json()
    script_text = data.get('script', '')
    
    if not script_text:
        return jsonify({"error": "No script text provided."}), 400
    
    breakdown_data = get_script_breakdown(script_text)
    return jsonify({"success": True, "breakdown": breakdown_data})

@app.route('/api/predict-risk', methods=['POST'])
def predict_risk_route():
    """ENDPOINT: Calls the Scikit-learn service for risk prediction."""
    data = request.get_json()
    
    try:
        days_behind = float(data.get('days_behind', 0))
        cost_variance_pct = float(data.get('cost_variance_pct', 0))
        star_delay_factor = float(data.get('star_delay_factor', 1.0))
        crew_efficiency = float(data.get('crew_efficiency', 95.0))
    except ValueError:
        return jsonify({"error": "Invalid numerical data for risk prediction."}), 400

    prediction_result = get_budget_risk(days_behind, cost_variance_pct, star_delay_factor, crew_efficiency)
    return jsonify({"success": True, **prediction_result})

# --- 3. OPERATIONAL ENDPOINTS (Data Input & Fetch) ---

@app.route('/api/dpr/submit', methods=['POST'])
def submit_dpr_route():
    """ENDPOINT: Accepts and stores the Daily Production Report (DPR) data."""
    data = request.get_json()
    
    try:
        delay_hours = float(data.get('delay_hours', 0))
        cost_variance_pct = float(data.get('cost_variance_pct', 0))
    except ValueError:
        return jsonify({"error": "Delay/Variance must be a number."}), 400

    dpr_record = {
        "project_id": ObjectId(MOCK_PROJECT_ID),
        "date": datetime.datetime.now(),
        "scenes_shot_actual": data.get("scenes_shot_actual"),
        "delay_hours": delay_hours,
        "cost_variance_pct": cost_variance_pct,
        "status": "Pending Manager Review" 
    }
    
    # Insert record into the 'daily_reports' collection
    result = DB.daily_reports.insert_one(dpr_record)
    
    # Check for success and return a clean, serializable JSON response
    return jsonify({
        "success": True,
        "message": "DPR submitted for review. AI risk score will update shortly.",
        "id": str(result.inserted_id) # CRITICAL: Ensure ObjectId is converted to string
    })

@app.route('/api/vendors', methods=['GET'])
def get_vendors_route():
    """ENDPOINT: Fetches the list of vendors with pre-calculated LVR scores."""
    # Mock Vendor Data synced with FE mockData.ts
    mock_vendors_data = [
        {"_id": "V1", "name": "Babu Lights & Rigging", "service_category": "Lighting", 
         "base_price_avg": 75000, "lvr_score": 92, "contact_info": {"phone": "98471-XXXXX", "email": "babu@lights.in"},
         "reliability_history": [{"project_id": "P1", "rating": 5, "delay_minutes": 0}, {"project_id": "P2", "rating": 4, "delay_minutes": 15}]},
        
        {"_id": "V2", "name": "Cochin Camera Crew", "service_category": "Camera", 
         "base_price_avg": 120000, "lvr_score": 78, "contact_info": {"phone": "94460-XXXXX", "email": "cochin@cam.in"},
         "reliability_history": [{"project_id": "P1", "rating": 3, "delay_minutes": 60}, {"project_id": "P3", "rating": 4, "delay_minutes": 10}]},

        {"_id": "V3", "name": "Hyd Meal Express", "service_category": "Catering", 
         "base_price_avg": 15000, "lvr_score": 95, "contact_info": {"phone": "99887-XXXXX", "email": "hydmeal@in"},
         "reliability_history": [{"project_id": "P4", "rating": 5, "delay_minutes": 0}, {"project_id": "P5", "rating": 5, "delay_minutes": 0}]},
    ]

    return jsonify({"success": True, "vendors": mock_vendors_data})


if __name__ == '__main__':
    check_db_connection() # Run the DB check first
    app.run(port=5000, debug=True)