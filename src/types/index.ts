export interface User {
  _id: string;
  email: string;
  role: 'OWNER' | 'MANAGER' | 'EXECUTOR' | 'CREATIVE';
  projects_access: string[];
  name: string;
}

export interface Project {
  _id: string;
  title: string;
  producer_id: string;
  budget_total: number;
  ai_risk_score: number;
  predicted_overrun_crores: number;
  start_date: string;
  expected_end_date: string;
  status: 'PLANNING' | 'PRODUCTION' | 'POST_PRODUCTION' | 'COMPLETED';
}

export interface DailyReport {
  _id: string;
  project_id: string;
  date: string;
  scenes_shot_actual: number;
  scenes_shot_expected: number;
  delay_hours: number;
  cost_variance_pct: number;
  receipt_image_url?: string;
  notes: string;
  weather_conditions: string;
  crew_attendance: number;
}

export interface Vendor {
  _id: string;
  name: string;
  service_category: string;
  base_price_avg: number;
  lvr_score: number;
  reliability_history: Array<{
    project_id: string;
    delay_minutes: number;
    rating: number;
  }>;
  contact_info: {
    phone: string;
    email: string;
  };
}

export interface RiskPredictionInput {
  days_behind: number;
  cost_variance_pct: number;
  star_delay_factor: number;
  weather_impact: number;
  crew_efficiency: number;
}

export interface ScriptBreakdown {
  locations: string[];
  characters: string[];
  location_count: number;
  character_count: number;
  estimated_shoot_days: number;
  complexity_score: number;
}