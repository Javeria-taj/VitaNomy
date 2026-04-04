MODE: Fast mode

CONTEXT:
refer types/patient.ts


TASK:
Build /store/patientStore.ts — global state for the entire platform.

import { create } from 'zustand'
import type {
  AnyPatientInput, AnalyzeResponse, SimulateResponse,
  ChatMessage, PlatformMode, ExtractResponse
} from '@/types/patient'

interface PatientStore {
  // mode
  mode: PlatformMode | null
  setMode: (m: PlatformMode) => void

  // patient data
  patient: AnyPatientInput | null
  setPatient: (p: AnyPatientInput) => void

  // extract state
  extractResult: ExtractResponse | null
  setExtractResult: (e: ExtractResponse) => void

  // analysis
  analysis: AnalyzeResponse | null
  setAnalysis: (a: AnalyzeResponse) => void

  // simulation
  simulation: SimulateResponse | null
  setSimulation: (s: SimulateResponse) => void

  // chat
  chatHistory: ChatMessage[]
  addChatMessage: (m: ChatMessage) => void
  clearChat: () => void

  // loading states — one per async operation
  loadingExtract: boolean
  loadingAnalyze: boolean
  loadingSimulate: boolean
  loadingChat: boolean
  setLoading: (key: 'extract'|'analyze'|'simulate'|'chat', v: boolean) => void

  // error state
  error: string | null
  setError: (e: string | null) => void

  // reset
  reset: () => void
}

Implement with create<PatientStore>().
reset() must return all fields to initial null/false/[] values.
setLoading must use the key to set the correct loading flag only.

VERIFY:
TypeScript compiles with zero errors.