import { AnalyzeResponse, SimulateResponse, PatientInput } from '@/types/patient'

export const DEMO_PATIENT: PatientInput = {
  name: 'Alex Morgan', age: 45, gender: 'male',
  weight: 92, height: 175, systolic_bp: 138,
  diastolic_bp: 88, glucose: 118, cholesterol: 242,
  smoking: true, exercise: 'none', family_history: true
}

export const MOCK_ANALYSIS: AnalyzeResponse = {
  patient_id: 'demo-001',
  risk_scores: { diabetes: 72, cardiac: 58, hypertension: 81 },
  overall_risk: 'HIGH',
  insights: [
    'Fasting glucose is significantly elevated — early marker for Type 2 diabetes.',
    'Combined cholesterol and low activity are compounding cardiac risk.',
    'Blood pressure readings indicate Stage 1 hypertension.'
  ],
  recommendations: [
    '30 minutes of moderate cardio, 5 days a week.',
    'Reduce sodium intake below 2,300mg/day.',
    'Schedule a full lipid panel within 30 days.'
  ]
}

export const MOCK_SIMULATION: SimulateResponse = {
  original_risks: { diabetes: 72, cardiac: 58, hypertension: 81 },
  projected_risks: { diabetes: 51, cardiac: 39, hypertension: 62 },
  delta: { diabetes: -21, cardiac: -19, hypertension: -19 },
  narrative: 'Starting moderate exercise 5x/week could reduce diabetes risk by 21 points over 6 months.'
}
