
export interface PatientInput {
  name: string
  age: number
  gender: 'male' | 'female' | 'other'
  weight: number        // kg
  height: number        // cm
  systolic_bp: number   // e.g. 120
  diastolic_bp: number  // e.g. 80
  glucose: number       // mg/dL fasting
  cholesterol: number   // mg/dL total
  smoking: boolean
  exercise: 'none' | 'light' | 'moderate' | 'heavy'
  family_history: boolean
}

export type AnyPatientInput = PatientInput

export type PlatformMode = 'onboarding' | 'dashboard' | 'simulator' | 'chat'

export interface ExtractResponse {
  patient_name?: string
  extracted_vitals: Partial<PatientInput>
  confidence: number
  raw_text?: string
}

export interface RiskScores {
  diabetes: number      // 0–100
  cardiac: number       // 0–100
  hypertension: number  // 0–100
}

export interface AnalyzeResponse {
  patient_id: string
  risk_scores: RiskScores
  overall_risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  insights: string[]
  recommendations: string[]
}

export interface SimulateRequest {
  patient: PatientInput
  scenario: 'exercise' | 'diet' | 'quit_smoking' | 'medication'
}

export interface SimulateResponse {
  original_risks: RiskScores
  projected_risks: RiskScores
  delta: RiskScores        // projected - original (negative = improvement)
  narrative: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatRequest {
  patient: PatientInput
  analysis: AnalyzeResponse
  history: ChatMessage[]
  message: string
}

export interface ChatResponse {
  reply: string
}
