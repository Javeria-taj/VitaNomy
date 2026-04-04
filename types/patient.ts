
// ─── MODE ───────────────────────────────────────────────
export type PlatformMode = 'patient' | 'athlete' | 'dashboard' | 'simulator'

// ─── PATIENT MODE INPUT ──────────────────────────────────
export interface PatientInput {
  mode?: 'patient' | 'dashboard'
  name: string
  age: number
  gender: 'male' | 'female' | 'other' | string
  weight: number
  height: number
  systolic_bp?: number
  diastolic_bp?: number
  glucose?: number
  cholesterol?: number        // legacy shorthand
  cholesterol_total?: number
  cholesterol_hdl?: number
  cholesterol_ldl?: number
  triglycerides?: number
  smoking?: boolean
  alcohol?: 'none' | 'light' | 'moderate' | 'heavy' | string
  exercise?: 'none' | 'light' | 'moderate' | 'heavy' | string
  family_history?: boolean
  existing_conditions?: string[]
  current_medications?: string[]
}

// ─── ATHLETE MODE INPUT ──────────────────────────────────
export interface Compound {
  name: string
  compound_type: string
  dose_mg: number
  frequency: string
  route: 'oral' | 'injectable' | 'topical' | 'other'
  cycle_week_current: number
  cycle_week_total: number
  is_pct: boolean
}

export interface AthleteInput extends Omit<PatientInput, 'mode'> {
  mode: 'athlete'
  body_fat_percent?: number
  hematocrit?: number
  hemoglobin?: number
  rbc?: number
  alt?: number
  ast?: number
  testosterone_total?: number
  testosterone_free?: number
  estradiol?: number
  lh?: number
  fsh?: number
  creatinine?: number
  compounds?: Compound[]
  training_years?: number
  competition_prep?: boolean
  pct_active?: boolean
}

// ─── UNION TYPE — what the engine receives ───────────────
export type AnyPatientInput = PatientInput | AthleteInput

// ─── SHARED RISK OUTPUT ──────────────────────────────────
export interface RiskFactor {
  score: number
  confidence?: 'low' | 'medium' | 'high'
  confidence_interval?: [number, number]
  primary_drivers?: string[]
}

export interface PatientRiskScores {
  mode?: 'patient'
  diabetes?: RiskFactor | number
  cardiac?: RiskFactor | number
  hypertension?: RiskFactor | number
  overall_risk?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | string
}

export interface AthleteRiskScores {
  mode?: 'athlete'
  cardiovascular?: RiskFactor | number
  hepatotoxicity?: RiskFactor | number
  endocrine_suppression?: RiskFactor | number
  hematological?: RiskFactor | number
  overall_risk?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | string
}

// Flexible intersection that works for both patient and athlete
export type AnyRiskScores = (PatientRiskScores | AthleteRiskScores) & Record<string, any>

// ─── ANALYZE RESPONSE ────────────────────────────────────
export interface AnalyzeResponse {
  patient_id: string
  mode: PlatformMode
  risk_scores: AnyRiskScores
  overall_risk?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | string  // convenience alias
  insights: string[]
  recommendations: string[]
  causation_flags?: string[]
  data_completeness?: number
}

// ─── EXTRACT RESPONSE (PDF → structured) ─────────────────
export interface ExtractResponse {
  mode: PlatformMode
  extracted_fields: Partial<PatientInput> | Partial<AthleteInput>
  unreadable_fields: string[]
  confidence: 'low' | 'medium' | 'high'
}

// ─── SIMULATE ────────────────────────────────────────────
export type PatientScenario = 'exercise' | 'diet' | 'quit_smoking' | 'medication'
export type AthleteScenario = 'reduce_dose' | 'add_organ_support' | 'start_pct' | 'cycle_off'

export interface SimulateRequest {
  patient: AnyPatientInput
  scenario: PatientScenario | AthleteScenario
}

export interface SimulateResponse {
  original_risks: AnyRiskScores
  projected_risks: AnyRiskScores
  delta: Record<string, number>
  narrative: string
  timeframe?: string
}

// ─── CHAT ─────────────────────────────────────────────────
export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  time?: string
  qr?: string[]
  contextSnippet?: {
    title: string
    items: { l: string; v: string }[]
  }
}

export interface ChatRequest {
  patient: AnyPatientInput
  analysis: AnalyzeResponse
  history: ChatMessage[]
  message: string
}

export interface ChatResponse {
  reply: string
}