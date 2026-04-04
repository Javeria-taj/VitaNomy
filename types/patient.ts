
// ─── MODE ───────────────────────────────────────────────
export type PlatformMode = 'patient' | 'athlete'

// ─── PATIENT MODE INPUT ──────────────────────────────────
export interface PatientInput {
  mode: 'patient'
  // identity
  name: string
  age: number
  gender: 'male' | 'female' | 'other'
  // biometrics (from form OR extracted from PDF)
  weight: number           // kg
  height: number           // cm
  // vitals
  systolic_bp: number      // mmHg
  diastolic_bp: number     // mmHg
  glucose: number          // mg/dL fasting
  cholesterol_total: number // mg/dL
  cholesterol_hdl?: number  // mg/dL optional — if available in PDF
  cholesterol_ldl?: number  // mg/dL optional
  triglycerides?: number    // mg/dL optional
  // lifestyle (form only — not in bloodwork)
  smoking: boolean
  alcohol: 'none' | 'light' | 'moderate' | 'heavy'
  exercise: 'none' | 'light' | 'moderate' | 'heavy'
  // history (form only)
  family_history: boolean
  existing_conditions: string[]  // e.g. ['type2_diabetes', 'hypertension']
  current_medications: string[]  // e.g. ['metformin', 'lisinopril']
}

// ─── ATHLETE MODE INPUT ──────────────────────────────────
export interface Compound {
  name: string             // brand name e.g. "TestoMax" or generic "Testosterone Enanthate"
  compound_type: string    // e.g. "anabolic_steroid" | "peptide" | "sarm" | "supplement"
  dose_mg: number          // per administration
  frequency: string        // e.g. "twice_weekly" | "daily" | "eod"
  route: 'oral' | 'injectable' | 'topical' | 'other'
  cycle_week_current: number   // which week of cycle they're in
  cycle_week_total: number     // total planned cycle length
  is_pct: boolean          // is this a PCT compound
}

export interface AthleteInput {
  mode: 'athlete'
  // identity
  name: string
  age: number
  gender: 'male' | 'female' | 'other'
  // biometrics
  weight: number           // kg
  height: number           // cm
  body_fat_percent?: number // if available
  // bloodwork (extracted from PDF — extended panel for athletes)
  systolic_bp?: number
  diastolic_bp?: number
  glucose?: number
  cholesterol_total?: number
  cholesterol_hdl?: number
  cholesterol_ldl?: number
  triglycerides?: number
  hematocrit?: number      // % — key for steroid users
  hemoglobin?: number      // g/dL
  rbc?: number             // red blood cell count
  alt?: number             // liver enzyme — hepatotoxicity marker
  ast?: number             // liver enzyme
  testosterone_total?: number   // ng/dL
  testosterone_free?: number    // pg/mL
  estradiol?: number       // pg/mL — key for aromatization
  lh?: number              // LH — suppression marker
  fsh?: number             // FSH — suppression marker
  creatinine?: number      // kidney function
  // compound log (form only)
  compounds: Compound[]
  // context
  training_years: number
  competition_prep: boolean
  pct_active: boolean
}

// ─── UNION TYPE — what the engine receives ───────────────
export type AnyPatientInput = PatientInput | AthleteInput

// ─── SHARED RISK OUTPUT ──────────────────────────────────
export interface RiskFactor {
  score: number            // 0–100
  confidence: 'low' | 'medium' | 'high'
  confidence_interval: [number, number]  // e.g. [62, 78]
  primary_drivers: string[] // top 2-3 factors driving this score
}

export interface PatientRiskScores {
  mode: 'patient'
  diabetes: RiskFactor
  cardiac: RiskFactor
  hypertension: RiskFactor
  overall_risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

export interface AthleteRiskScores {
  mode: 'athlete'
  cardiovascular: RiskFactor    // cardiac + BP combined for athletes
  hepatotoxicity: RiskFactor    // liver stress
  endocrine_suppression: RiskFactor  // HPTA suppression
  hematological: RiskFactor    // hematocrit/clot risk
  overall_risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

export type AnyRiskScores = PatientRiskScores | AthleteRiskScores

// ─── ANALYZE RESPONSE ────────────────────────────────────
export interface AnalyzeResponse {
  patient_id: string
  mode: PlatformMode
  risk_scores: AnyRiskScores
  insights: string[]           // 3–5 Claude-generated findings
  recommendations: string[]    // 3–5 actionable items
  causation_flags?: string[]   // athlete only — compound-specific signals
  data_completeness: number    // 0–100, how much of the schema was populated
}

// ─── EXTRACT RESPONSE (PDF → structured) ─────────────────
export interface ExtractResponse {
  mode: PlatformMode
  extracted_fields: Partial<PatientInput> | Partial<AthleteInput>
  unreadable_fields: string[]  // fields Claude couldn't find in the PDF
  confidence: 'low' | 'medium' | 'high'  // overall extraction quality
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
  delta: Record<string, number>   // key = risk name, value = point change
  narrative: string
  timeframe: string               // e.g. "projected over 8 weeks"
}

// ─── CHAT ─────────────────────────────────────────────────
export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
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