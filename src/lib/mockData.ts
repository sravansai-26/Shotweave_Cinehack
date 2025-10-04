import { User, Project, DailyReport, Vendor } from '../types';

export const mockUsers: User[] = [
  {
    _id: '1',
    email: 'producer@shotweave.com',
    role: 'OWNER',
    projects_access: ['proj1', 'proj2', 'proj3'],
    name: 'Sarah Chen'
  },
  {
    _id: '2',
    email: 'manager@shotweave.com',
    role: 'MANAGER',
    projects_access: ['proj1', 'proj2'],
    name: 'Mike Rodriguez'
  },
  {
    _id: '3',
    email: 'executor@shotweave.com',
    role: 'EXECUTOR',
    projects_access: ['proj1'],
    name: 'Alex Kumar'
  },
  {
    _id: '4',
    email: 'creative@shotweave.com',
    role: 'CREATIVE',
    projects_access: ['proj1', 'proj2'],
    name: 'Emma Thompson'
  }
];

export const mockProjects: Project[] = [
  {
    _id: 'proj1',
    title: 'Neon Horizon',
    producer_id: '1',
    budget_total: 25.5,
    ai_risk_score: 75,
    predicted_overrun_crores: 2.3,
    start_date: '2024-01-15',
    expected_end_date: '2024-06-30',
    status: 'PRODUCTION'
  },
  {
    _id: 'proj2',
    title: 'Digital Dreams',
    producer_id: '1',
    budget_total: 18.2,
    ai_risk_score: 42,
    predicted_overrun_crores: 0.8,
    start_date: '2024-03-01',
    expected_end_date: '2024-08-15',
    status: 'PLANNING'
  },
  {
    _id: 'proj3',
    title: 'Cyber Noir',
    producer_id: '1',
    budget_total: 32.1,
    ai_risk_score: 88,
    predicted_overrun_crores: 4.2,
    start_date: '2024-02-10',
    expected_end_date: '2024-09-30',
    status: 'PRODUCTION'
  }
];

export const mockDailyReports: DailyReport[] = [
  {
    _id: 'dr1',
    project_id: 'proj1',
    date: '2024-10-03',
    scenes_shot_actual: 8,
    scenes_shot_expected: 12,
    delay_hours: 4,
    cost_variance_pct: 15.2,
    notes: 'Weather delays in outdoor sequences',
    weather_conditions: 'Heavy Rain',
    crew_attendance: 94
  },
  {
    _id: 'dr2',
    project_id: 'proj1',
    date: '2024-10-02',
    scenes_shot_actual: 15,
    scenes_shot_expected: 14,
    delay_hours: -1,
    cost_variance_pct: -2.3,
    notes: 'Ahead of schedule, excellent crew performance',
    weather_conditions: 'Clear',
    crew_attendance: 100
  }
];

export const mockVendors: Vendor[] = [
  {
    _id: 'v1',
    name: 'CineCraft Equipment',
    service_category: 'Camera & Lighting',
    base_price_avg: 25000,
    lvr_score: 92,
    reliability_history: [
      { project_id: 'proj1', delay_minutes: 15, rating: 5 },
      { project_id: 'proj2', delay_minutes: 0, rating: 5 }
    ],
    contact_info: {
      phone: '+91-9876543210',
      email: 'contact@cinecraft.com'
    }
  },
  {
    _id: 'v2',
    name: 'Mumbai Sound Studios',
    service_category: 'Audio Production',
    base_price_avg: 18000,
    lvr_score: 87,
    reliability_history: [
      { project_id: 'proj1', delay_minutes: 30, rating: 4 },
      { project_id: 'proj3', delay_minutes: 0, rating: 5 }
    ],
    contact_info: {
      phone: '+91-9876543211',
      email: 'booking@mumbaisound.com'
    }
  },
  {
    _id: 'v3',
    name: 'VFX Nexus',
    service_category: 'Visual Effects',
    base_price_avg: 45000,
    lvr_score: 78,
    reliability_history: [
      { project_id: 'proj2', delay_minutes: 120, rating: 3 },
      { project_id: 'proj3', delay_minutes: 60, rating: 4 }
    ],
    contact_info: {
      phone: '+91-9876543212',
      email: 'projects@vfxnexus.com'
    }
  }
];