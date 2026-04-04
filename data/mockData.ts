import type { AnalyzeResponse, SimulateResponse, PatientInput, AthleteInput, ExtractResponse } from '@/types/patient'

// ─── DEMO PATIENT (Patient mode) ─────────────────────────────────────────────
export const DEMO_PATIENT: PatientInput = {
  mode: 'patient',
  name: 'Alex Morgan',
  age: 45,
  gender: 'male',
  weight: 92,
  height: 175,
  systolic_bp: 138,
  diastolic_bp: 88,
  glucose: 118,
  cholesterol_total: 242,
  cholesterol: 242,        // legacy shorthand alias used by dashboard
  cholesterol_hdl: 38,
  cholesterol_ldl: 158,
  triglycerides: 210,
  smoking: true,
  alcohol: 'moderate',
  exercise: 'none',
  family_history: true,
  existing_conditions: ['prediabetes'],
  current_medications: []
}

// ─── DEMO ATHLETE ─────────────────────────────────────────────────────────────
export const DEMO_ATHLETE: AthleteInput = {
  mode: 'athlete',
  name: 'Marcus Reed',
  age: 28,
  gender: 'male',
  weight: 102,
  height: 182,
  body_fat_percent: 9,
  systolic_bp: 148,
  diastolic_bp: 92,
  glucose: 94,
  cholesterol_total: 238,
  cholesterol_hdl: 28,
  cholesterol_ldl: 172,
  triglycerides: 190,
  hematocrit: 51,
  hemoglobin: 17.2,
  rbc: 6.1,
  alt: 68,
  ast: 52,
  testosterone_total: 1850,
  testosterone_free: 38,
  estradiol: 52,
  lh: 0.4,
  fsh: 0.8,
  creatinine: 1.1,
  compounds: [
    {
      name: 'Testosterone Enanthate',
      compound_type: 'anabolic_steroid',
      dose_mg: 500,
      frequency: 'twice_weekly',
      route: 'injectable',
      cycle_week_current: 8,
      cycle_week_total: 12,
      is_pct: false
    },
    {
      name: 'Anadrol',
      compound_type: 'anabolic_steroid',
      dose_mg: 50,
      frequency: 'daily',
      route: 'oral',
      cycle_week_current: 8,
      cycle_week_total: 6,
      is_pct: false
    },
    {
      name: 'Anastrozole',
      compound_type: 'supplement',
      dose_mg: 0.5,
      frequency: 'eod',
      route: 'oral',
      cycle_week_current: 8,
      cycle_week_total: 12,
      is_pct: false
    }
  ],
  training_years: 6,
  competition_prep: true,
  pct_active: false
}

// ─── MOCK ANALYSIS (Patient) ──────────────────────────────────────────────────
export const MOCK_ANALYSIS: AnalyzeResponse = {
  patient_id: 'alex-morgan-mock',
  mode: 'patient',
  overall_risk: 'HIGH',
  risk_scores: {
    mode: 'patient',
    diabetes: { score: 72, confidence: 'high', confidence_interval: [69, 79], primary_drivers: ['Fasting glucose elevated at 118 mg/dL', 'Sedentary lifestyle combined with overweight BMI'] },
    cardiac: { score: 58, confidence: 'high', confidence_interval: [56, 66], primary_drivers: ['Active smoking combined with cholesterol at 242 mg/dL', 'HDL critically low at 38 mg/dL'] },
    hypertension: { score: 81, confidence: 'high', confidence_interval: [74, 84], primary_drivers: ['BP reading 138/88 — Stage 1 hypertension', 'Smoking and sedentary lifestyle compounding vascular stress'] },
    overall_risk: 'HIGH'
  },
  insights: [
    'Fasting glucose is significantly elevated — early marker for Type 2 diabetes.',
    'Combined cholesterol and low activity are compounding cardiac risk.',
    'Blood pressure readings indicate Stage 1 hypertension.'
  ],
  recommendations: [
    '30 minutes of moderate cardio, 5 days a week.',
    'Reduce sodium intake below 2,300mg/day.',
    'Schedule a full lipid panel within 30 days.'
  ],
  data_completeness: 92
}

// ─── MOCK ANALYSIS (Athlete) ──────────────────────────────────────────────────
export const MOCK_ATHLETE_ANALYSIS: AnalyzeResponse = {
  patient_id: 'marcus-reed-mock',
  mode: 'athlete',
  overall_risk: 'CRITICAL',
  risk_scores: {
    mode: 'athlete',
    cardiovascular: { score: 68, confidence: 'high', confidence_interval: [63, 73], primary_drivers: ['HDL severely suppressed at 28 mg/dL', 'Hematocrit at 51% — elevated clot risk'] },
    hepatotoxicity: { score: 72, confidence: 'high', confidence_interval: [67, 77], primary_drivers: ['ALT at 68 U/L — 1.7x upper normal limit', 'Oral Anadrol at week 8 of 6-week cycle'] },
    endocrine_suppression: { score: 88, confidence: 'high', confidence_interval: [83, 93], primary_drivers: ['LH at 0.4 and FSH at 0.8 — full HPTA shutdown', 'No PCT active during cycle'] },
    hematological: { score: 55, confidence: 'high', confidence_interval: [50, 60], primary_drivers: ['Hematocrit 51% with injectable testosterone', 'RBC at 6.1 — mildly elevated'] },
    overall_risk: 'CRITICAL'
  },
  insights: [
    'LH at 0.4 and FSH at 0.8 indicate complete HPTA shutdown.',
    'Anadrol cycle has exceeded recommended 6-week limit — ALT elevation confirms hepatic stress.',
    'HDL at 28 mg/dL is severely compound-suppressed — cardiovascular risk elevated.'
  ],
  recommendations: [
    'Discontinue oral Anadrol immediately — cycle has exceeded safe duration.',
    'Begin liver support protocol: TUDCA 500mg/day.',
    'Plan PCT to begin 2 weeks post-cycle: Nolvadex 40/40/20/20.'
  ],
  causation_flags: [
    'ALT elevation (68 U/L) causally linked to oral Anadrol.',
    'HDL suppression to 28 mg/dL consistent with anabolic steroid use.',
    'Full LH/FSH suppression expected given exogenous testosterone dose.'
  ],
  data_completeness: 96
}

// ─── MOCK SIMULATION ─────────────────────────────────────────────────────────
export const MOCK_SIMULATION: SimulateResponse = {
  original_risks: { diabetes: 72, cardiac: 58, hypertension: 81 },
  projected_risks: { diabetes: 51, cardiac: 39, hypertension: 62 },
  delta: { diabetes: -21, cardiac: -19, hypertension: -19 },
  narrative: 'Starting moderate exercise 5x/week could reduce diabetes risk by 21 points over 6 months.',
  timeframe: '6 months'
}

// ─── MOCK EXTRACT ─────────────────────────────────────────────────────────────
export const MOCK_EXTRACT_RESPONSE: ExtractResponse = {
  mode: 'patient',
  extracted_fields: {
    glucose: 118,
    cholesterol_total: 242,
    cholesterol_hdl: 38,
    cholesterol_ldl: 158,
    triglycerides: 210,
    systolic_bp: 138,
    diastolic_bp: 88
  },
  unreadable_fields: ['weight', 'height'],
  confidence: 'high'
}

// Legacy alias
export const DEMO_PATIENT_ANALYSIS = MOCK_ANALYSIS
