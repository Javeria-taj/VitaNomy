'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { usePatientStore } from '@/store/patientStore'
import { DEMO_PATIENT, MOCK_ANALYSIS } from '@/data/mockData'
import { PatientInput, PatientRiskScores } from '@/types/patient'

// ─── Color tokens ──────────────────────────────────────────────────────────────
const C = {
  beige: '#F8F5EE', beige2: '#EDE7D8', beige3: '#E4DDD0',
  green: '#1B5E3B', green2: '#0D3D26', green3: '#2E7D52',
  greenPale: '#E4F0EA', gold: '#C9A84C', goldPale: '#F7EDD0',
  ink: '#0A0F0D', tx: '#1A2520', mu: '#5C7268',
  danger: '#C0392B', warn: '#D35400', ok: '#27AE60',
}

// ─── Neobrutalist Badge ────────────────────────────────────────────────────────
function NBadge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span className="text-[9.5px] font-black px-2 py-0.5 border-[1.5px] border-black uppercase tracking-wider"
      style={{ color, backgroundColor: bg }}>
      {label}
    </span>
  )
}

// ─── Section header ────────────────────────────────────────────────────────────
function SectionHeader({ icon, title, badge }: { icon: string; title: string; badge?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3 pb-2 border-b-[1.5px] border-black/10">
      <div className="w-5 h-5 border-[1.5px] border-black flex items-center justify-center text-[10px] shadow-[1px_1px_0px_#000]"
        style={{ backgroundColor: C.greenPale }}>{icon}</div>
      <span className="text-[10px] font-black uppercase tracking-[0.1em]" style={{ color: C.mu }}>{title}</span>
      {badge && <span className="ml-auto">{badge}</span>}
    </div>
  )
}

// ─── Field row ─────────────────────────────────────────────────────────────────
function FieldRow({ label, value, placeholder }: { label: string; value?: string; placeholder?: string }) {
  return (
    <div className="mb-2">
      <div className="text-[9.5px] font-black uppercase tracking-[0.05em] mb-1" style={{ color: C.mu }}>{label}</div>
      <div className="w-full px-3 py-2 border-[2px] border-black text-[12.5px] font-bold shadow-[2px_2px_0px_#000]"
        style={{ backgroundColor: value ? C.greenPale : 'white', color: value ? C.tx : C.mu }}>
        {value || placeholder || '—'}
      </div>
    </div>
  )
}

// ─── SVG Body (Input State) ────────────────────────────────────────────────────
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

// ─── SVG Results (After analysis) ───────────────────────────────────────────────
function BodySVGResults({ cardiac, diabetes, hypertension }: { cardiac: number, diabetes: number, hypertension: number }) {
  return (
    <svg viewBox="0 0 240 280" width="100%" filter="drop-shadow(3px 3px 0px rgba(0,0,0,0.1))">
      <polygon points="120,5 135,12 135,32 120,40 105,32 105,12" fill="white" stroke="black" strokeWidth="2" />
      <rect x="114" y="40" width="12" height="10" fill="white" stroke="black" strokeWidth="1.5" />
      <rect x="95" y="50" width="50" height="65" fill="white" stroke="black" strokeWidth="2" />
      <rect x="50" y="50" width="20" height="15" fill={cardiac > 60 ? C.danger : C.gold} stroke="black" strokeWidth="1.5" />
      <rect x="45" y="75" width="30" height="20" fill={diabetes > 60 ? C.danger : C.gold} stroke="black" strokeWidth="1.5" />
    </svg>
  )
}

// ─── Arc Gauge Component ───────────────────────────────────────────────────────
function ArcGauge({ label, score, color, bg, status }: { label: string, score: number, color: string, bg: string, status: string }) {
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
      <div className="mt-2 text-[9px] font-black px-1.5 py-0.5 border-[1px] border-black inline-block uppercase" style={{ color, backgroundColor: bg }}>
        {status}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { patient, analysis, setMode } = usePatientStore()
  const [view, setView] = useState<'input' | 'results'>('input')

  const p = patient || DEMO_PATIENT
  const a = analysis || MOCK_ANALYSIS
  const rs = a.risk_scores
  const bmi = (p.weight / ((p.height / 100) ** 2)).toFixed(1)
  const initials = p.name.split(' ').map(n => n[0]).join('').toUpperCase()

  useEffect(() => {
    setMode('patient') 
    if (analysis) setView('results')
  }, [analysis, setMode])

  const getColor = (s: number) => s > 75 ? C.danger : s > 35 ? C.warn : C.ok
  const getBg = (s: number) => s > 75 ? '#FDE8E8' : s > 35 ? '#FFF4E5' : '#E4F0EA'
  const getStatus = (s: number) => s > 75 ? 'HIGH RISK' : s > 35 ? 'MODERATE' : 'OPTIMAL'

  return (
    <div className="h-screen w-screen flex flex-col bg-white overflow-hidden font-mono" style={{ color: C.ink }}>
      <nav className="flex items-center justify-between px-6 py-3 border-b-[3px] border-black bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-black bg-green flex items-center justify-center shadow-[3px_3px_0px_#000]">
            <span className="text-white font-black text-xl">V</span>
          </div>
          <span className="text-[20px] font-black tracking-tighter">Vita<span style={{ color: C.green }}>Nomy</span></span>
        </div>
        <div className="hidden md:flex gap-1">
          {['Dashboard', 'Simulator', 'Chat AI'].map(tab => (
            <Link key={tab} href={tab === 'Dashboard' ? '#' : `/${tab.toLowerCase().split(' ')[0]}`}
              className={`px-4 py-1.5 text-[12px] font-black border-[3px] transition-all
                ${tab === 'Dashboard' ? 'bg-green text-white border-black shadow-[3px_3px_0px_#000]' : 'bg-transparent border-transparent hover:bg-black/5'}`}>
              {tab}
            </Link>
          ))}
        </div>
      </nav>

      <div className="px-6 py-4 border-b-[2px] border-black flex items-center justify-between gap-4 bg-beige shrink-0">
        <div className="flex gap-4">
          {['input', 'results'].map(v => (
            <button key={v} onClick={() => setView(v as any)}
              className="text-[12px] font-black uppercase tracking-widest pb-1 border-b-[3px] transition-all"
              style={view === v 
                ? { color: C.green, borderColor: C.green }
                : { color: C.mu, borderColor: 'transparent' }}>
              {v === 'input' ? 'Builder' : 'Analysis'}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'input' ? (
          <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 grid border-b-[2px] border-black lg:grid-cols-[280px_1fr_240px] overflow-hidden">
            <div className="p-5 border-r-[2px] border-black bg-white overflow-y-auto">
              <div>
                <SectionHeader icon="👤" title="Profile Details" />
                <FieldRow label="Legal Name" value={p.name} />
                <div className="grid grid-cols-2 gap-2">
                  <FieldRow label="Age" value={`${p.age} yr`} />
                  <FieldRow label="Gender" value={p.gender} />
                </div>
              </div>
              <div className="mt-6">
                <SectionHeader icon="🩸" title="Metabolic Health" />
                <FieldRow label="Blood Glucose" value={`${p.glucose} mg/dL`} />
                <FieldRow label="Total Cholesterol" value={`${p.cholesterol_total} mg/dL`} />
              </div>
            </div>
              <div className="flex flex-col items-center p-4 border-r-[2px] border-black bg-green2">
                 <BodySVGInput 
                   age={p.age} 
                   systolic={(p as PatientInput).systolic_bp || 120} 
                   diastolic={(p as PatientInput).diastolic_bp || 80} 
                   cholesterol={(p as PatientInput).cholesterol_total || 200} 
                   glucose={(p as PatientInput).glucose || 100} 
                   bmi={bmi} 
                 />
              </div>
            <div className="p-5 overflow-y-auto">
              <SectionHeader icon="⚡" title="Status" />
              <div className="p-4 border-[2px] border-black bg-goldPale shadow-[3px_3px_0px_#000]">
                <div className="text-[12px] font-black">TWIN READY</div>
                <div className="text-[10px] mt-1">Metabolic sync verified</div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 grid border-b-[2px] border-black lg:grid-cols-[280px_1fr_400px] overflow-hidden">
            <div className="p-4 border-r-[2px] border-black bg-beige flex flex-col items-center">
              <div className="text-[14px] font-black mb-3">Risk Topology</div>
              {rs.mode === 'patient' && (
                <BodySVGResults 
                  cardiac={(rs as PatientRiskScores).cardiac.score} 
                  diabetes={(rs as PatientRiskScores).diabetes.score} 
                  hypertension={(rs as PatientRiskScores).hypertension.score} 
                />
              )}
            </div>
            <div className="p-5 flex flex-col gap-4 overflow-y-auto bg-beige2">
              <div className="flex items-center gap-3 p-3 border-[2.5px] border-black bg-white shadow-[3px_3px_0px_#000]">
                <div className="w-10 h-10 bg-green flex items-center justify-center text-white font-black">{initials}</div>
                <div>
                  <div className="font-black">{p.name}</div>
                  <div className="text-[11px] font-bold opacity-60">
                    Age {p.age} · BMI {bmi} · {p.mode === 'patient' && p.smoking ? 'Smoker' : 'Non-smoker'}
                  </div>
                </div>
              </div>
              {rs.mode === 'patient' && (
                <div className="grid grid-cols-3 gap-3">
                  <ArcGauge label="Cardiac" score={(rs as PatientRiskScores).cardiac.score} color={getColor((rs as PatientRiskScores).cardiac.score)} bg={getBg((rs as PatientRiskScores).cardiac.score)} status={getStatus((rs as PatientRiskScores).cardiac.score)} />
                  <ArcGauge label="Diabetes" score={(rs as PatientRiskScores).diabetes.score} color={getColor((rs as PatientRiskScores).diabetes.score)} bg={getBg((rs as PatientRiskScores).diabetes.score)} status={getStatus((rs as PatientRiskScores).diabetes.score)} />
                  <ArcGauge label="Hypertension" score={(rs as PatientRiskScores).hypertension.score} color={getColor((rs as PatientRiskScores).hypertension.score)} bg={getBg((rs as PatientRiskScores).hypertension.score)} status={getStatus((rs as PatientRiskScores).hypertension.score)} />
                </div>
              )}
              {rs.mode === 'athlete' && (
                <div className="bg-white border-[3px] border-black p-6 shadow-[5px_5px_0px_#000]">
                  <h3 className="font-black text-lg mb-2">Athlete Mode Active</h3>
                  <p className="text-sm opacity-70">Switch back to patient mode or check the simulator for deep performance metrics.</p>
                </div>
              )}
              <div className="bg-white border-[2.5px] border-black shadow-[3px_3px_0px_#000] p-4">
                 <div className="text-[12px] font-black border-b-[1px] border-black/10 pb-2 mb-3 tracking-wider">✦ AI TWIN INSIGHTS</div>
                 <div className="space-y-4">
                   {a.insights.map((ins, i) => (
                     <div key={i} className="flex gap-3">
                        <div className="w-2 h-2 mt-1.5 shrink-0 bg-green" />
                        <p className="text-[12px] leading-relaxed font-bold">{ins}</p>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between px-5 py-3 border-t-[2px] border-black bg-beige2 shrink-0">
        <button onClick={() => setView(view === 'results' ? 'input' : 'results')}
          className="px-4 py-2 border-[2px] border-black font-black text-[11px] hover:bg-black hover:text-white transition-all">
          {view === 'results' ? '← PROFILE BUILDER' : 'ANALYSIS DASHBOARD →'}
        </button>
        <span className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em]">Clinical Digital Twin Edition</span>
      </div>
    </div>
  )
}
