import {
  PatientInput,
  AthleteInput,
  AnalyzeResponse,
  ExtractResponse,
  SimulateResponse,
  PatientRiskScores,
  RiskFactor
} from '@/types/patient'

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

export const MOCK_PATIENT_ANALYSIS: AnalyzeResponse = {
  patient_id: 'alex-morgan-mock',
  mode: 'patient',
  risk_scores: {
    mode: 'patient',
    diabetes: {
      score: 74,
      confidence: 'high',
      confidence_interval: [69, 79],
      primary_drivers: [
        'Fasting glucose elevated at 118 mg/dL — prediabetic range',
        'Sedentary lifestyle combined with overweight BMI'
      ]
    },
    cardiac: {
      score: 61,
      confidence: 'high',
      confidence_interval: [56, 66],
      primary_drivers: [
        'Active smoking combined with cholesterol at 242 mg/dL',
        'HDL critically low at 38 mg/dL — protective factor absent'
      ]
    },
    hypertension: {
      score: 79,
      confidence: 'high',
      confidence_interval: [74, 84],
      primary_drivers: [
        'BP reading 138/88 — Stage 1 hypertension',
        'Smoking and sedentary lifestyle compounding vascular stress'
      ]
    },
    overall_risk: 'CRITICAL'
  },
  insights: [
    'Fasting glucose at 118 mg/dL places [NAME] firmly in prediabetic range.',
    'HDL at 38 mg/dL is critically low — smoking is the primary driver.',
    'BP of 138/88 combined with zero exercise is accelerating hypertension.'
  ],
  recommendations: [
    '30 minutes moderate cardio 5x per week reduces all three risk scores.',
    'Smoking cessation is the single highest-impact intervention available.',
    'Reduce sodium below 2,300mg/day for BP management.'
  ],
  data_completeness: 92
}

export const MOCK_ATHLETE_ANALYSIS: AnalyzeResponse = {
  patient_id: 'marcus-reed-mock',
  mode: 'athlete',
  risk_scores: {
    mode: 'athlete',
    cardiovascular: {
      score: 68,
      confidence: 'high',
      confidence_interval: [63, 73],
      primary_drivers: [
        'HDL severely suppressed at 28 mg/dL — compound-driven',
        'Hematocrit at 51% — elevated clot risk'
      ]
    },
    hepatotoxicity: {
      score: 72,
      confidence: 'high',
      confidence_interval: [67, 77],
      primary_drivers: [
        'ALT at 68 U/L — 1.7x upper normal limit',
        'Oral Anadrol at week 8 of 6-week cycle — extended hepatic exposure'
      ]
    },
    endocrine_suppression: {
      score: 88,
      confidence: 'high',
      confidence_interval: [83, 93],
      primary_drivers: [
        'LH at 0.4 and FSH at 0.8 — full HPTA shutdown',
        'No PCT active during cycle'
      ]
    },
    hematological: {
      score: 55,
      confidence: 'high',
      confidence_interval: [50, 60],
      primary_drivers: [
        'Hematocrit 51% with injectable testosterone driving erythropoiesis',
        'RBC at 6.1 — mildly elevated'
      ]
    },
    overall_risk: 'CRITICAL'
  },
  insights: [
    'LH at 0.4 and FSH at 0.8 indicate complete HPTA shutdown.',
    'Anadrol cycle has exceeded recommended 6-week limit — ALT elevation confirms [NAME]\'s hepatic stress.',
    'HDL at 28 mg/dL is severely compound-suppressed — cardiovascular risk elevated.'
  ],
  recommendations: [
    'Discontinue oral Anadrol immediately — cycle has exceeded safe duration.',
    'Begin liver support protocol: TUDCA 500mg/day.',
    'Plan PCT to begin 2 weeks post-cycle: Nolvadex 40/40/20/20.'
  ],
  causation_flags: [
    'ALT elevation (68 U/L) causally linked to oral Anadrol at current cycle length.',
    'HDL suppression to 28 mg/dL consistent with anabolic steroid use pattern.',
    'Full LH/FSH suppression expected given exogenous testosterone dose.'
  ],
  data_completeness: 96
}

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

export const MOCK_ANALYSIS = MOCK_PATIENT_ANALYSIS

const patientScores = MOCK_PATIENT_ANALYSIS.risk_scores as PatientRiskScores

export const MOCK_SIMULATION: SimulateResponse = {
  original_risks: patientScores,
  projected_risks: {
    ...patientScores,
    diabetes: { ...(patientScores.diabetes as RiskFactor), score: 53 },
    cardiac: { ...(patientScores.cardiac as RiskFactor), score: 42 },
    hypertension: { ...(patientScores.hypertension as RiskFactor), score: 60 }
  } as PatientRiskScores,
  delta: {
    diabetes: -21,
    cardiac: -19,
    hypertension: -19
  },
  narrative: "Increasing cardiovascular activity to 150 minutes per week is projected to significantly lower mean arterial pressure and glucose sensitivity, translating to a ~20% systemic risk reduction across all metabolic biomarkers.",
  timeframe: "6 months"
}



// Legacy alias
export const DEMO_PATIENT_ANALYSIS = MOCK_ANALYSIS
