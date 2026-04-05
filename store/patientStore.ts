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
  setLoading: (key: 'extract' | 'analyze' | 'simulate' | 'chat', v: boolean) => void

  // error state
  error: string | null
  setError: (e: string | null) => void

  // reset
  reset: () => void

  // language
  language: 'en' | 'hi' | 'ta' | 'te'
  setLanguage: (l: 'en' | 'hi' | 'ta' | 'te') => void
}

export const usePatientStore = create<PatientStore>((set) => ({
  mode: null,
  patient: null,
  extractResult: null,
  analysis: null,
  simulation: null,
  chatHistory: [],
  loadingExtract: false,
  loadingAnalyze: false,
  loadingSimulate: false,
  loadingChat: false,
  error: null,
  language: 'en',

  setMode: (mode) => set({ mode }),
  setPatient: (patient) => set({ patient }),
  setExtractResult: (extractResult) => set({ extractResult }),
  setAnalysis: (analysis) => set({ analysis }),
  setSimulation: (simulation) => set({ simulation }),
  addChatMessage: (m) => set((s) => ({ chatHistory: [...s.chatHistory, m] })),
  clearChat: () => set({ chatHistory: [] }),
  setLoading: (key, v) => set((s) => {
    if (key === 'extract') return { loadingExtract: v }
    if (key === 'analyze') return { loadingAnalyze: v }
    if (key === 'simulate') return { loadingSimulate: v }
    if (key === 'chat') return { loadingChat: v }
    return s
  }),
  setError: (error) => set({ error }),
  setLanguage: (language) => set({ language }),
  reset: () => set({
    mode: null,
    patient: null,
    extractResult: null,
    analysis: null,
    simulation: null,
    chatHistory: [],
    loadingExtract: false,
    loadingAnalyze: false,
    loadingSimulate: false,
    loadingChat: false,
    error: null,
    language: 'en'
  })
}))
