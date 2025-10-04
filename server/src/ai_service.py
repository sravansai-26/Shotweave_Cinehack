import spacy
import numpy as np
import pandas as pd
from sklearn.linear_model import Ridge
import pickle
import os
import random

# --- File Paths ---
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'ai_models')
MODEL_PATH = os.path.join(MODEL_DIR, 'budget_risk_model.pkl')

# --- 1. NLP Setup (SpaCy) ---
try:
    NLP_MODEL = spacy.load("en_core_web_sm")
except OSError:
    NLP_MODEL = None

def get_script_breakdown(script_text: str):
    """Analyzes script text using SpaCy NER."""
    if not NLP_MODEL:
        return {}
    
    doc = NLP_MODEL(script_text)
    locations = set()
    characters = set()
    
    for ent in doc.ents:
        if ent.label_ in ['GPE', 'LOC', 'FAC']:
            locations.add(ent.text)
        elif ent.label_ == 'PERSON':
            characters.add(ent.text)

    # Mock Estimation Logic based on complexity
    loc_count = len(locations) + random.randint(1, 3) 
    char_count = len(characters) + random.randint(2, 5)

    estimated_shoot_days = round((loc_count * 2.5) + (char_count * 1.0) + (len(script_text) / 5000), 0)
    complexity_score = min(100, int((loc_count * 5 + char_count * 3) * 1.5))

    return {
        "location_count": loc_count,
        "character_count": char_count,
        "estimated_shoot_days": int(estimated_shoot_days),
        "complexity_score": int(complexity_score),
        "locations": sorted(list(locations)),
        "characters": sorted(list(characters))
    }

# --- 2. AI Prediction Setup (Scikit-learn) ---

def train_and_save_mock_model():
    """TRAINING FUNCTION: Creates a mock predictive model for the Hackathon demo."""
    data = {
        'Days_Behind': [0, 1, 3, 5, 2, 0, 4, 1, 6, 7],
        'Cost_Variance_PCT': [0.0, 5.0, 10.0, 15.0, 8.0, 2.0, 12.0, 7.0, 20.0, 25.0],
        'Star_Delay_Factor': [1.0, 1.2, 1.5, 2.0, 1.1, 1.0, 1.8, 1.3, 2.5, 3.0],
        'Crew_Efficiency': [95, 90, 80, 70, 88, 98, 75, 86, 65, 60],
        'Overrun_Cr': [0.5, 1.2, 2.5, 4.0, 1.8, 0.3, 3.5, 1.5, 5.5, 6.8] 
    }
    df = pd.DataFrame(data)
    
    X = df[['Days_Behind', 'Cost_Variance_PCT', 'Star_Delay_Factor', 'Crew_Efficiency']]
    y = df['Overrun_Cr']
    
    model = Ridge(alpha=1.0)
    model.fit(X, y)
    
    os.makedirs(MODEL_DIR, exist_ok=True)
    with open(MODEL_PATH, 'wb') as file:
        pickle.dump(model, file)
    print("Mock AI Model trained and saved.")
    return model

# Load the model upon server start
try:
    if not os.path.exists(MODEL_PATH):
        RISK_MODEL = train_and_save_mock_model()
    else:
        with open(MODEL_PATH, 'rb') as file:
            RISK_MODEL = pickle.load(file)
except Exception:
    RISK_MODEL = None # Safety fallback

def get_budget_risk(days_behind, cost_variance_pct, star_delay_factor, crew_efficiency):
    """Predicts the financial risk based on live operational data."""
    if RISK_MODEL is None:
        return {"risk_score": 75, "predicted_overrun_crores": 3.0}

    input_data = np.array([[days_behind, cost_variance_pct, star_delay_factor, crew_efficiency]])
    predicted_overrun = RISK_MODEL.predict(input_data)[0]
    
    risk_score_raw = 50 + (predicted_overrun * 8) 
    risk_score = int(np.clip(risk_score_raw, 0, 100))

    return {
        "risk_score": risk_score,
        "predicted_overrun_crores": round(float(predicted_overrun), 2)
    }