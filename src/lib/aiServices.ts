import { RiskPredictionInput, ScriptBreakdown, RiskPredictionOutput } from '../types';

// The API base URL is relative, relying on Vite proxy to reach the Flask backend
const API_BASE_URL = '/api'; 

// --- 1. NLP Script Breakdown (Connecting to /api/breakdown) ---
export async function processScriptBreakdown(scriptText: string): Promise<ScriptBreakdown> {
    // NOTE: The original complex simulation logic is replaced by the API call
    try {
        const response = await fetch(`${API_BASE_URL}/breakdown`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ script: scriptText }),
        });

        if (!response.ok) {
            throw new Error('NLP API failed to process script.');
        }

        const data = await response.json();
        return data.breakdown as ScriptBreakdown;

    } catch (error) {
        console.error("Error connecting to NLP API. Returning mock data:", error);
        // Fallback mock data structure for demo stability
        return {
            location_count: 5,
            character_count: 10,
            estimated_shoot_days: 15,
            complexity_score: 80,
            locations: ['Kochi Harbour', 'Studio Set B', 'Paddy Field'],
            characters: ['Raj', 'Priya', 'Inspector John'],
        } as ScriptBreakdown;
    }
}


// --- 2. Risk Prediction (Connecting to /api/predict-risk) ---
export async function predictBudgetRisk(inputMetrics: RiskPredictionInput): Promise<RiskPredictionOutput> {
    try {
        const response = await fetch(`${API_BASE_URL}/predict-risk`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inputMetrics),
        });

        if (!response.ok) {
            throw new Error('Risk prediction API failed.');
        }

        const data = await response.json();
        return data as RiskPredictionOutput;

    } catch (error) {
        console.error("Error during risk prediction. Returning mock data:", error);
        // CRITICAL FALLBACK: Simple logic for local demo stability
        const mockOverrun = (inputMetrics.days_behind * 0.5) + (inputMetrics.cost_variance_pct * 0.1);
        const mockScore = Math.min(99, Math.max(20, 50 + mockOverrun * 5));
        
        return {
            risk_score: Math.round(mockScore),
            predicted_overrun_crores: parseFloat(mockOverrun.toFixed(2)),
        };
    }
}


// --- 3. DPR Submission (Connecting to /api/dpr/submit) ---
export async function submitDPR(formData: any): Promise<boolean> {
    // formData must contain fields like: scenes_shot_actual, delay_hours, cost_variance_pct, etc.
    try {
        const response = await fetch(`${API_BASE_URL}/dpr/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        // The Flask server is expected to return success: true/false
        if (!response.ok) {
            throw new Error('Server returned error status: ' + response.status);
        }

        const data = await response.json();
        return data.success; // Should return true if insert was successful

    } catch (error) {
        console.error("Failed to submit DPR and write to MongoDB:", error);
        // Fail gracefully, but alert the user that the write failed
        return false;
    }
}


// --- 4. LVR Calculation (Client-Side Logic) ---
// This remains client-side as it's a simple weighted algorithm, useful for client-side sorting/display.
export function calculateLVR(
    priceScore: number, 
    reliabilityScore: number, 
    qualityScore: number
): number {
    return Math.floor(
        (0.40 * priceScore) + 
        (0.30 * reliabilityScore) + 
        (0.30 * qualityScore)
    );
}