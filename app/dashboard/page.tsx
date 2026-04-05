'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePatientStore } from '@/store/patientStore'
import { useTranslation } from '@/hooks/useTranslation'
import { DEMO_PATIENT, MOCK_ANALYSIS } from '@/data/mockData'
import { AnyPatientInput, AnalyzeResponse, PatientInput, ExtractResponse, AthleteInput } from '@/types/patient'
import { Loader2, History as HistoryIcon, FileText, Share2, Download, Zap, Heart, ShieldCheck, BrainCircuit, Target, Clock, AlertTriangle, Upload, Sparkles } from 'lucide-react'
import { Topbar } from '@/components/Layout/Topbar'

// ─── Color tokens ─────────────────────────────────────────────────────────────
const C = {
  beige: '#F8F5EE', beige2: '#EDE7D8', beige3: '#E4DDD0',
  green: '#1B5E3B', green2: '#0D3D26', green3: '#2E7D52',
  greenPale: '#E4F0EA', gold: '#C9A84C', goldPale: '#F7EDD0',
  ink: '#0A0F0D', tx: '#1A2520', mu: '#5C7268',
  danger: '#C0392B', warn: '#D35400', ok: '#27AE60',
}

// ─── Neobrutalist Badge ───────────────────────────────────────────────────────
function NBadge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span className="text-[9.5px] font-black px-2 py-0.5 border-[1.5px] border-black uppercase tracking-wider"
      style={{ color, backgroundColor: bg }}>{label}</span>
  )
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ icon, title, badge }: { icon: any; title: string; badge?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3 pb-2 border-b-[1.5px] border-black/10">
      <div className="w-5 h-5 border-[1.5px] border-black flex items-center justify-center text-[10px] shadow-[1px_1px_0px_#000]"
        style={{ backgroundColor: C.greenPale }}>{icon}</div>
      <span className="text-[10px] font-black uppercase tracking-[0.1em]" style={{ color: C.mu }}>{title}</span>
      {badge && <span className="ml-auto">{badge}</span>}
    </div>
  )
}

// ─── Field Row ────────────────────────────────────────────────────────────────
function FieldRow({
  label,
  value,
  placeholder,
  onChange,
  type = 'text',
  disabled
}: {
  label: string;
  value?: string | number;
  placeholder?: string;
  onChange?: (val: string) => void;
  type?: 'text' | 'number';
  disabled?: boolean;
}) {
  return (
    <div className={`mb-2 transition-opacity ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="text-[9.5px] font-black uppercase tracking-[0.05em] mb-1" style={{ color: C.mu }}>{label}</div>
      <input
        type={type}
        value={value ?? ''}
        placeholder={placeholder || '—'}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full px-3 py-2 border-[2px] border-black text-[12.5px] font-bold shadow-[2px_2px_0px_#000] focus:outline-none focus:shadow-none focus:translate-x-0.5 focus:translate-y-0.5 transition-all outline-none"
        style={{
          backgroundColor: value ? C.greenPale : 'white',
          color: value ? C.tx : C.mu,
        }}
      />
    </div>
  )
}

// ─── Body SVG (Input) ─────────────────────────────────────────────────────────
function BodySVGInput({ age, systolic, diastolic, cholesterol, glucose, bmi }: {
  age: number; systolic: number; diastolic: number; cholesterol: number; glucose: number; bmi: string
}) {
  return (
    <svg viewBox="0 0 510 502" width="90%" style={{ maxHeight: 460, animation: 'vf 7s ease-in-out infinite' }}>
      <style>{`@keyframes vf{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes dash{to{stroke-dashoffset:-22}}
        .zb{animation:blink 1.4s step-end infinite}
        .dl{animation:dash 1.6s linear infinite}`}</style>
      <polygon points="255,10 285,25 285,55 255,70 225,55 225,25" fill="none" stroke="#F4F2E9" strokeWidth="3" />
      <rect x="243" y="70" width="24" height="22" fill="none" stroke="#F4F2E9" strokeWidth="2.5" />
      <path d="M210 92 L300 92 L295 205 L215 205 Z" fill="none" stroke="#F4F2E9" strokeWidth="3" />
      <line x1="235" y1="92" x2="255" y2="108" stroke={C.gold} strokeWidth="1.5" strokeDasharray="3,3" />
      <line x1="275" y1="92" x2="255" y2="108" stroke={C.gold} strokeWidth="1.5" strokeDasharray="3,3" />
      <path d="M210 100 L175 110 L170 195 L185 200 L192 120 L220 108" fill="none" stroke="#F4F2E9" strokeWidth="2.5" />
      <path d="M300 100 L335 110 L340 195 L325 200 L318 120 L290 108" fill="none" stroke="#F4F2E9" strokeWidth="2.5" />
      <rect x="162" y="195" width="18" height="22" fill="none" stroke="#F4F2E9" strokeWidth="2" />
      <rect x="330" y="195" width="18" height="22" fill="none" stroke="#F4F2E9" strokeWidth="2" />
      <path d="M215 205 L200 250 L218 268 L255 272 L292 268 L310 250 L295 205 Z" fill="none" stroke="#F4F2E9" strokeWidth="2.5" />
      <rect x="220" y="268" width="30" height="160" fill="none" stroke="#F4F2E9" strokeWidth="2.5" />
      <rect x="260" y="268" width="30" height="160" fill="none" stroke="#F4F2E9" strokeWidth="2.5" />
      <rect x="213" y="424" width="44" height="16" fill="none" stroke="#F4F2E9" strokeWidth="2" />
      <rect x="253" y="424" width="44" height="16" fill="none" stroke="#F4F2E9" strokeWidth="2" />
      <g className="zb" style={{ transformOrigin: '255px 38px' }}>
        <rect x="241" y="24" width="28" height="28" fill="none" stroke={C.gold} strokeWidth="2.5" />
      </g>
      <circle cx="255" cy="38" r="5" fill={C.gold} />
      <line x1="145" y1="38" x2="240" y2="38" stroke={C.gold} strokeWidth="1.3" strokeDasharray="5,4" className="dl" />
      <rect x="5" y="22" width="136" height="30" fill="white" stroke={C.gold} strokeWidth="2" />
      <rect x="5" y="22" width="5" height="30" fill={C.gold} />
      <text x="16" y="34" fontSize="9" fontWeight="700" fill={C.mu}>AGE · GENDER</text>
      <rect x="94" y="26" width="44" height="22" fill={C.goldPale} stroke={C.gold} strokeWidth="1.5" />
      <text x="116" y="40" textAnchor="middle" fontSize="10" fontWeight="700" fill="#8B6522">{age} yr</text>
    </svg>
  )
}

// ─── Body SVG (Results) ───────────────────────────────────────────────────────
function BodySVGResults({ cardiac, diabetes, hypertension }: { cardiac: number; diabetes: number; hypertension: number }) {
  return (
    <svg viewBox="0 0 240 280" width="100%" filter="drop-shadow(3px 3px 0px rgba(0,0,0,0.1))">
      <polygon points="120,5 135,12 135,32 120,40 105,32 105,12" fill={C.beige} stroke="black" strokeWidth="2" />
      <rect x="114" y="40" width="12" height="10" fill={C.beige} stroke="black" strokeWidth="1.5" />
      <rect x="95" y="50" width="50" height="65" fill={C.beige} stroke="black" strokeWidth="2" />
      <circle cx="120" cy="75" r={5 + (cardiac / 20)} fill={C.danger} style={{ opacity: 0.8 + (cardiac / 500) }} />
      <circle cx="120" cy="125" r={8 + (diabetes / 15)} fill={C.gold} style={{ opacity: 0.8 + (diabetes / 500) }} />
    </svg>
  )
}

// ─── Arc Gauge ────────────────────────────────────────────────────────────────
function ArcGauge({ label, score, color, bg, status }: { label: string; score: number; color: string; bg: string; status: string }) {
  return (
    <div className="border-[2.5px] border-black bg-white p-3 shadow-[3px_3px_0px_#000]">
      <div className="text-[10px] font-black uppercase tracking-wider mb-2" style={{ color: C.mu }}>{label}</div>
      <div className="flex items-end gap-1.5 mb-2">
        <span className="text-[26px] font-black leading-none" style={{ color }}>{score}%</span>
        <span className="text-[9px] font-bold mb-1 opacity-60">SCORE</span>
      </div>
      <div className="h-4 border-[2px] border-black bg-white relative overflow-hidden">
        <div className="h-full transition-all duration-1000 ease-out" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <div className="mt-2 text-[9px] font-black px-1.5 py-0.5 border-[1px] border-black inline-block uppercase"
        style={{ color, backgroundColor: bg }}>{status}</div>
    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getScore = (val: any): number => typeof val === 'number' ? val : (val?.score || 0)

// ─── Dashboard Page ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { 
    patient, analysis, simulation, setMode, 
    setPatient, setAnalysis, setLoading, 
    loadingAnalyze, loadingExtract 
  } = usePatientStore()
  const { t } = useTranslation()
  const [view, setView] = useState<'input' | 'results' | 'history'>('results')
  const [history, setHistory] = useState<any[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  const [extracting, setExtracting] = useState(false)
  const [extractNotice, setExtractNotice] = useState<{ msg: string, type: 'high' | 'medium' | 'low' } | null>(null)

  const p = patient
  const a = analysis
  const s = simulation

  const reAnalyze = async () => {
    if (!p) return
    setLoading('analyze', true)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient: p })
      })
      if (!res.ok) throw new Error('Analysis failed')
      const data = await res.json()
      setAnalysis(data)
      setExtractNotice({ msg: 'Twin recalibrated successfully', type: 'high' })
      setTimeout(() => setExtractNotice(null), 3000)
    } catch (err) {
      console.error(err)
      setExtractNotice({ msg: 'Calibration failed. Check inputs.', type: 'low' })
    } finally {
      setLoading('analyze', false)
    }
  }

  const handlePDFUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !p) return

    setExtracting(true)
    setExtractNotice({ msg: 'Processing clinical document...', type: 'medium' })
    
    try {
      const reader = new FileReader()
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1]
        const res = await fetch('/api/extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pdf_base64: base64,
            mode: p.mode || 'patient'
          })
        })

        if (!res.ok) throw new Error('Extraction failed')
        const data = await res.json()
        
        // Update local twin with extracted data
        setPatient({ ...p, ...data.extracted_fields })
        setExtractNotice({ msg: 'Data extracted. Review & re-analyze.', type: 'high' })
      }
      reader.readAsDataURL(file)
    } catch (err) {
      console.error(err)
      setExtractNotice({ msg: 'Extraction failed. Try again.', type: 'low' })
    } finally {
      setExtracting(false)
    }
  }

  const isProjected = !!s
  const rs = s ? s.projected_risks : a?.risk_scores
  const insights = s?.narrative ? [s.narrative, ...(a?.insights || [])] : (a?.insights || [])

  useEffect(() => {
    if (p?.name && view === 'history') {
      const fetchHistory = async () => {
        setLoadingHistory(true)
        try {
          const res = await fetch(`/api/history?patientId=${encodeURIComponent(p.name)}`)
          const data = await res.json()
          setHistory(data.sessions || [])
        } catch (err) {
          console.error(err)
        } finally {
          setLoadingHistory(false)
        }
      }
      fetchHistory()
    }
  }, [p?.name, view])

  if (!p || !a) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.beige, fontFamily: 'Inter, sans-serif' }}>
        <Topbar />
        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
          <div className="w-24 h-24 border-[4px] border-black flex items-center justify-center text-[40px] mb-8 shadow-[8px_8px_0px_#000]"
            style={{ backgroundColor: C.goldPale }}>
            🧬
          </div>
          <h1 className="text-[32px] font-black uppercase tracking-tighter mb-4" style={{ color: C.ink }}>{t.dashboard.noTwin}</h1>
          <p className="max-w-md text-[14px] font-bold leading-relaxed mb-10" style={{ color: C.mu }}>
            {t.dashboard.noTwinDesc}
          </p>
          <Link href="/dashboard"
            className="px-10 py-5 border-[4px] border-black bg-green text-white font-black text-[18px] uppercase tracking-widest shadow-[8px_8px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center">
            {t.dashboard.beginIntake} &rarr;
          </Link>
        </div>
      </div>
    )
  }

  const bmi = p.height > 0 ? (p.weight / ((p.height / 100) ** 2)).toFixed(1) : '—'
  const initials = p.name ? p.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'AM'

  const getStatus = (s: number) => s > 70 ? 'HIGH RISK' : s > 40 ? 'MODERATE' : 'LOW RISK'
  const getColor = (s: number) => s > 70 ? C.danger : s > 40 ? C.warn : C.ok
  const getBg = (s: number) => s > 70 ? '#FDE8E8' : s > 40 ? '#FEF0E5' : '#E8F5EE'

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.beige, fontFamily: 'Inter, system-ui, sans-serif' }}>

      <Topbar />

      <div className="px-6 py-4 border-b-[2px] border-black flex items-center justify-between gap-4 bg-beige shrink-0">
        <div className="flex gap-4">
          {(['input', 'results', 'history'] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className="text-[12px] font-black uppercase tracking-widest pb-1 border-b-[3px] transition-all"
              style={view === v ? { color: C.green, borderColor: C.green } : { color: C.mu, borderColor: 'transparent' }}>
              {v === 'input' ? t.dashboard.builder : v === 'results' ? t.dashboard.analysis : t.dashboard.history}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'input' ? (
          <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 grid lg:grid-cols-[320px_1fr_280px] overflow-hidden">

            {/* Sidebar Left: Clinical Profile */}
            <div className="p-5 border-r-[2px] border-black bg-white overflow-y-auto">
              <SectionHeader icon="👤" title={t.dashboard.profile} />

              <div className="mb-6 p-4 border-[2px] border-black bg-[#EDE7D8] shadow-[3px_3px_0px_#000]">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-black uppercase">Bloodwork PDF</span>
                  <label className="cursor-pointer px-3 py-1 bg-black text-white text-[9px] font-black uppercase hover:bg-emerald-800 transition-colors">
                    {extracting ? 'EXTRACTING...' : 'UPLOAD & EXTRACT'}
                    <input type="file" accept=".pdf" className="hidden" onChange={handlePDFUpload} disabled={extracting} />
                  </label>
                </div>
                {extractNotice && (
                  <div className={`text-[9px] font-bold p-2 border-[1.5px] border-black uppercase text-center ${extractNotice.type === 'high' ? 'bg-emerald-100 text-emerald-800' :
                      extractNotice.type === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {extractNotice.msg}
                  </div>
                )}
              </div>

              <FieldRow label="Legal Name" value={p.name} onChange={(v) => setPatient({ ...p, name: v })} disabled={loadingAnalyze} />
              <div className="grid grid-cols-2 gap-2">
                <FieldRow label="Age" value={p.age} type="number" onChange={(v) => setPatient({ ...p, age: parseInt(v) || 0 })} disabled={loadingAnalyze} />
                <FieldRow label="Gender" value={p.gender} onChange={(v) => setPatient({ ...p, gender: v as any })} disabled={loadingAnalyze} />
              </div>

              <div className="mb-6 mt-6">
                <SectionHeader icon="❤️" title={t.dashboard.cardiac} />
                <div className="grid grid-cols-2 gap-2">
                  <FieldRow label="BP Systolic" value={p.systolic_bp} type="number" onChange={(v) => setPatient({ ...p, systolic_bp: parseInt(v) || 0 })} disabled={loadingAnalyze} />
                  <FieldRow label="BP Diastolic" value={p.diastolic_bp} type="number" onChange={(v) => setPatient({ ...p, diastolic_bp: parseInt(v) || 0 })} disabled={loadingAnalyze} />
                </div>
                <FieldRow label="Total Cholesterol" value={p.cholesterol_total} type="number" onChange={(v) => setPatient({ ...p, cholesterol_total: parseInt(v) || 0 })} disabled={loadingAnalyze} />
              </div>

              <div className="mb-6">
                <SectionHeader icon="⏱" title={t.dashboard.metabolic} />
                <FieldRow label="Glucose" value={p.glucose} type="number" onChange={(v) => setPatient({ ...p, glucose: parseInt(v) || 0 })} disabled={loadingAnalyze} />
                <div className="grid grid-cols-2 gap-2">
                  <FieldRow label="Weight (kg)" value={p.weight} type="number" onChange={(v) => setPatient({ ...p, weight: parseInt(v) || 0 })} disabled={loadingAnalyze} />
                  <FieldRow label="Height (cm)" value={p.height} type="number" onChange={(v) => setPatient({ ...p, height: parseInt(v) || 0 })} disabled={loadingAnalyze} />
                </div>
              </div>

              <div className="mb-8">
                <SectionHeader icon="🏃" title={t.dashboard.lifestyle} />
                <FieldRow label="Activity" value={p.exercise} onChange={(v) => setPatient({ ...p, exercise: v as any })} disabled={loadingAnalyze} />
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase cursor-pointer">
                    <input type="checkbox" checked={p.smoking} onChange={(e) => setPatient({ ...p, smoking: e.target.checked })} className="w-3 h-3 accent-emerald-800" />
                    Smoking
                  </label>
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase cursor-pointer">
                    <input type="checkbox" checked={p.family_history} onChange={(e) => setPatient({ ...p, family_history: e.target.checked })} className="w-3 h-3 accent-emerald-800" />
                    Family History
                  </label>
                </div>
              </div>

              <button
                onClick={reAnalyze}
                disabled={loadingAnalyze}
                className={`w-full py-4 border-[3px] border-black font-black text-[14px] uppercase tracking-widest shadow-[4px_4px_0px_#000] transition-all flex items-center justify-center gap-2 ${extractNotice ? 'animate-pulse border-emerald-600 bg-emerald-50' : 'bg-white'
                  } hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:opacity-50`}
              >
                {loadingAnalyze ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {loadingAnalyze ? 'ANALYZING...' : 'RE-ANALYZE TWIN'}
              </button>
            </div>

            {/* Center: Digital Twin Projection */}
            <div className="flex flex-col items-center p-4 border-r-[2px] border-black bg-[#113826]">
              <div className="w-full max-w-sm border-[2px] border-yellow-400/40 px-4 py-2 text-center text-[11px] font-black mb-4 text-[#C9A84C]"
                style={{ backgroundColor: 'rgba(201,168,76,0.12)' }}>
                ◈ LIVE BIOMETRIC PROJECTION
              </div>
              <div className="flex-1 flex items-center justify-center w-full">
                <BodySVGInput age={p.age || 0} systolic={Number(p.systolic_bp) || 0}
                  diastolic={Number(p.diastolic_bp) || 0} cholesterol={Number(p.cholesterol_total) || 0}
                  glucose={p.glucose || 0} bmi={bmi} />
              </div>
            </div>

            {/* Sidebar Right: Telemetry Status */}
            <div className="p-5 overflow-y-auto bg-white border-l-[2px] border-black">
              <SectionHeader icon="⚡" title="Telemetry Status" />
              <div className="p-4 border-[2px] border-black shadow-[3px_3px_0px_#000] bg-[#F7EDD0]">
                <div className="text-[12px] font-black uppercase">Twin Synchronized</div>
                <div className="text-[10px] mt-1 font-bold text-black/50">All clinical fields verified</div>
              </div>
            </div>
          </motion.div>

        ) : view === 'results' ? (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 grid lg:grid-cols-[300px_1fr] overflow-hidden">

            {/* Left Column: Risk Map */}
            <div className="border-r-[2px] border-black p-5 flex flex-col items-center" style={{ backgroundColor: '#113826' }}>
              <div className="flex justify-between items-center w-full mb-4">
                <div className="flex flex-col">
                  <span className="text-[12px] font-black uppercase tracking-widest text-white">{t.dashboard.riskMap}</span>
                  {isProjected && (
                    <span className="text-[9px] font-black text-amber-600 animate-pulse">◈ PROJECTED STATE</span>
                  )}
                </div>
                <span className="text-[10px] px-2 py-0.5 border-[1.5px] border-black bg-[#EDE7D8] font-black">
                  {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                </span>
              </div>
              <BodySVGResults cardiac={getScore(rs?.cardiac)} diabetes={getScore(rs?.diabetes)} hypertension={getScore(rs?.hypertension)} />

              <div className="w-full flex flex-col gap-2 mt-6">
                {[
                  { label: 'Cardiac', score: getScore(rs?.cardiac) },
                  { label: 'Diabetes', score: getScore(rs?.diabetes) },
                  { label: 'Hypertension', score: getScore(rs?.hypertension) },
                ].map(r => (
                  <div key={r.label} className="flex items-center gap-2 p-3 border-[2px] border-black bg-white shadow-[2px_2px_0px_#000]">
                    <div className="w-3 h-3 shrink-0" style={{ backgroundColor: getColor(r.score) }} />
                    <span className="text-[11px] font-black flex-1 uppercase">{r.label}</span>
                    <span className="text-[10px] font-black px-2 py-0.5 border-[1.5px] border-black"
                      style={{ color: getColor(r.score), backgroundColor: getBg(r.score) }}>
                      {r.score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Detailed Analysis */}
            <div className="p-8 flex flex-col gap-6 overflow-y-auto bg-white">
              <div className="flex items-center gap-4 p-4 border-[3px] border-black shadow-[4px_4px_0px_#000] bg-[#F8F5EE]">
                <div className="w-12 h-12 flex items-center justify-center text-white font-black text-lg bg-[#1B5E3B] border-[2px] border-black">{initials}</div>
                <div className="flex-1">
                  <div className="font-black text-xl uppercase tracking-tighter">{p.name}</div>
                  <div className="text-[11px] font-bold text-black/50 uppercase">
                    Clinical Intelligence Twin {isProjected ? '· Projection mode' : '· Profile V1.4'}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <NBadge label={p.gender || 'Unknown'} color="#000" bg="#FFF" />
                  <NBadge label={((a.overall_risk ?? 'MODERATE')) + " RISK"} color="#FFF" bg={getColor(getScore(rs?.cardiac))} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <ArcGauge label="Cardiac" score={getScore(rs?.cardiac)} color={getColor(getScore(rs?.cardiac))} bg={getBg(getScore(rs?.cardiac))} status={getStatus(getScore(rs?.cardiac))} />
                <ArcGauge label="Diabetes" score={getScore(rs?.diabetes)} color={getColor(getScore(rs?.diabetes))} bg={getBg(getScore(rs?.diabetes))} status={getStatus(getScore(rs?.diabetes))} />
                <ArcGauge label="Hypertension" score={getScore(rs?.hypertension)} color={getColor(getScore(rs?.hypertension))} bg={getBg(getScore(rs?.hypertension))} status={getStatus(getScore(rs?.hypertension))} />
              </div>

              <div className="border-[3px] border-black bg-white shadow-[6px_6px_0px_#000]">
                <div className="flex items-center gap-3 p-4 border-b-[2px] border-black bg-[#F7EDD0]">
                  <Zap className="w-5 h-5 text-[#C9A84C]" fill="#C9A84C" />
                  <span className="text-[14px] font-black uppercase tracking-tight">AI Twin Intelligence Findings {isProjected ? '(PROJECTED)' : ''}</span>
                </div>
                <div className="p-6 space-y-4">
                  {insights.map((ins, i) => (
                    <div key={i} className={`flex gap-4 p-4 border-[2px] transition-colors ${i === 0 && isProjected ? 'border-amber-400 bg-amber-50/50' : 'border-black/10 hover:border-black'}`}>
                      <div className={`w-2 h-2 mt-1.5 shrink-0 ${i === 0 && isProjected ? 'bg-amber-500' : 'bg-[#1B5E3B]'}`} />
                      <p className={`text-[13px] leading-relaxed font-bold italic ${i === 0 && isProjected ? 'text-amber-900' : 'text-black/80'}`}>{ins}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="history" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="flex-1 p-8 overflow-y-auto bg-[#F8F5EE]">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-end justify-between mb-8 border-b-[4px] border-black pb-4">
                <div>
                  <h2 className="text-[32px] font-black uppercase tracking-tighter">Clinical History</h2>
                  <p className="text-[12px] font-black uppercase tracking-widest opacity-40">Temporal Twin Telemetry Log</p>
                </div>
                <div className="text-[11px] font-black px-3 py-1 border-[2px] border-black bg-white shadow-[2px_2px_0px_#000]">
                  {history.length} Sessions Synchronized
                </div>
              </div>

              {loadingHistory ? (
                <div className="py-20 text-center font-black uppercase tracking-widest animate-pulse">Retrieving encrypted clinical records...</div>
              ) : history.length === 0 ? (
                <div className="py-20 text-center border-[4px] border-dashed border-black/10">
                  <div className="text-[40px] mb-4">🗂</div>
                  <div className="font-black uppercase tracking-wider text-black/20">No archived clinical sessions found</div>
                </div>
              ) : (
                <div className="grid gap-6">
                  {history.map((sess, i) => (
                    <div key={sess.id} className="border-[3px] border-black bg-white p-6 shadow-[8px_8px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 text-black/40">
                            {new Date(sess.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                          </div>
                          <div className="text-[20px] font-black uppercase tracking-tight">{sess.mode || 'CLINICAL'} TELEMETRY SYNC</div>
                        </div>
                        <div className="px-4 py-2 border-[2.5px] border-black text-[12px] font-black uppercase bg-[#1B5E3B] text-white shadow-[3px_3px_0px_#000]">
                          {sess.overall_risk || 'MODERATE'} RISK
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        {['cardiac', 'diabetes', 'hypertension'].map(k => (
                          <div key={k} className="border-[2px] border-black p-4 bg-[#F8F5EE]">
                            <div className="text-[9px] font-black uppercase opacity-40 mb-1 tracking-wider">{k}</div>
                            <div className="text-[24px] font-black" style={{ color: getColor(getScore(sess.risk_scores?.[k] || 0)) }}>
                              {getScore(sess.risk_scores?.[k] || 0)}<span className="text-xs ml-0.5">%</span>
                            </div>
                          </div>
                        ))}
                        <div className="border-[2px] border-black p-4 bg-[#F7EDD0]">
                          <div className="text-[9px] font-black uppercase opacity-40 mb-1 tracking-wider">Sync State</div>
                          <div className="text-[24px] font-black">{(sess.data_completeness * 100).toFixed(0)}<span className="text-xs ml-0.5">%</span></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Interaction Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t-[3px] border-black bg-[#EDE7D8] shrink-0">
        <div className="flex gap-3">
          <button onClick={() => window.print()}
            className="px-6 py-3 border-[3px] border-black bg-white text-black font-black text-[12px] uppercase tracking-widest shadow-[4px_4px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2 no-print">
            <Download className="w-4 h-4" /> Export clinical dossier
          </button>
          <button onClick={() => setView(view === 'results' ? 'history' : view === 'history' ? 'input' : 'results')}
            className="px-6 py-3 border-[3px] border-black bg-black text-white font-black text-[12px] uppercase tracking-widest shadow-[4px_4px_0px_#C9A84C] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all no-print">
            {view === 'results' ? 'Access Longitudinal History →' : view === 'history' ? '← Review Intake Profile' : 'Launch Analysis Dashboard →'}
          </button>
        </div>
        <div className="flex items-center gap-6 no-print">
          <span className="text-[10px] font-black opacity-30 uppercase tracking-[0.3em]">VitaNomy Clinical Edition </span>
          <div className="h-4 w-[2px] bg-black/10" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#27AE60]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#27AE60]">Status: Live</span>
          </div>
        </div>
      </div>

      {/* --- Clinical Report (Print Only) --- */}
      <div className="print-only clinical-report">
        <div className="border-[10px] border-black p-10">
          <div className="flex justify-between items-start border-b-[5px] border-black pb-8 mb-10">
            <div>
              <h1 className="text-[60px] font-black uppercase tracking-tighter leading-none mb-2">Clinical Dossier</h1>
              <p className="text-[14px] font-black uppercase tracking-[0.4em] opacity-40">VitaNomy Digital Twin Report · V1.4</p>
            </div>
            <div className="text-right">
              <div className="text-[24px] font-black uppercase">CONFIDENTIAL</div>
              <div className="text-[14px] font-bold">DATE: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 mb-10">
            <div className="p-6 border-[4px] border-black bg-[#F8F5EE]">
              <h2 className="text-[18px] font-black uppercase mb-4 border-b-[2px] border-black pb-2">Patient Profile</h2>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="font-black opacity-40 uppercase text-[10px]">Name</span><span className="font-bold">{p.name}</span></div>
                <div className="flex justify-between"><span className="font-black opacity-40 uppercase text-[10px]">Age / Gender</span><span className="font-bold">{p.age} yr / {p.gender}</span></div>
                <div className="flex justify-between"><span className="font-black opacity-40 uppercase text-[10px]">BMI</span><span className="font-bold">{bmi} kg/m²</span></div>
              </div>
            </div>
            <div className="p-6 border-[4px] border-black bg-[#F7EDD0]">
              <h2 className="text-[18px] font-black uppercase mb-4 border-b-[2px] border-black pb-2">Risk Stratification</h2>
              <div className="space-y-3">
                {['cardiac', 'diabetes', 'hypertension'].map(k => (
                  <div key={k} className="flex justify-between items-center">
                    <span className="font-black opacity-40 uppercase text-[10px]">{k}</span>
                    <span className="font-black text-[20px]" style={{ color: getColor(getScore(rs?.[k])) }}>{getScore(rs?.[k])}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-[18px] font-black uppercase mb-4 border-b-[3px] border-black pb-2">Clinical Intelligence Summary</h2>
            <div className="space-y-4">
              {insights.map((ins, i) => (
                <div key={i} className="flex gap-4 p-4 border-[2px] border-black bg-white">
                  <div className="w-2 h-2 mt-1.5 bg-black" />
                  <p className="text-[14px] leading-relaxed italic">{ins}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 border-[4px] border-black bg-black text-white text-center mt-20">
            <p className="text-[12px] font-black uppercase tracking-[0.2em] mb-2 opacity-50">Authorized Clinical Copy · Do not distribute</p>
            <p className="text-[14px] font-bold italic opacity-80">"Synchronizing human physiology with clinical intelligence for high-fidelity longevity."</p>
          </div>
        </div>
      </div>
    </div>
  )
}
