'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { usePatientStore } from '@/store/patientStore'
import { DEMO_PATIENT, MOCK_ANALYSIS } from '@/data/mockData'
import { Topbar } from '@/components/Layout/Topbar'
import { TypoAvatar } from '@/components/Common/TypoAvatar'

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

// ─── Main Dashboard ────────────────────────────────────────────────────────────

const getScore = (val: any): number => typeof val === 'number' ? val : (val?.score || 0);

export default function DashboardPage() {
  const { patient, analysis, setMode } = usePatientStore()
  const [view, setView] = useState<'input' | 'results'>('input')

  const p = patient
  const a = analysis
  
  if (!p || !a) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.beige, fontFamily: 'Inter, sans-serif' }}>
        <Topbar />
        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
          <div className="w-24 h-24 border-[4px] border-black flex items-center justify-center text-[40px] mb-8 shadow-[8px_8px_0px_#000]"
            style={{ backgroundColor: C.goldPale }}>
            🧬
          </div>
          <h1 className="text-[32px] font-black uppercase tracking-tighter mb-4" style={{ color: C.ink }}>No Twin Detected</h1>
          <p className="max-w-md text-[14px] font-bold leading-relaxed mb-10" style={{ color: C.mu }}>
            You haven't synchronized your clinical data yet. To generate your digital twin and see real-time health analysis, please complete the medical intake.
          </p>
          <Link href="/onboarding" 
            className="px-10 py-5 border-[4px] border-black bg-green text-white font-black text-[18px] uppercase tracking-widest shadow-[8px_8px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
            Begin Clinical Intake &rarr;
          </Link>
        </div>
      </div>
    )
  }

  const rs = a.risk_scores
  const bmi = (p.weight / ((p.height / 100) ** 2)).toFixed(1)
  const initials = p.name ? p.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'AM'

  const getStatus = (score: number) => score > 70 ? 'HIGH RISK' : score > 40 ? 'MODERATE' : 'LOW RISK'
  const getColor = (score: number) => score > 70 ? C.danger : score > 40 ? C.warn : C.ok
  const getBg = (score: number) => score > 70 ? '#FDE8E8' : score > 40 ? '#FEF0E5' : '#E8F5EE'

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.beige, fontFamily: 'Inter, system-ui, sans-serif' }}>

      <Topbar />

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

              {/* Cardiac — ACTIVE */}
              <div className="mb-5 border-[2.5px] p-2 -mx-1" style={{ borderColor: C.danger, backgroundColor: '#FFF5F5' }}>
                <SectionHeader icon="❤️" title="Cardiac"
                  badge={<NBadge label="● Active" color={C.danger} bg="#FDE8E8" />} />
                <div className="text-[9px] font-black uppercase mb-2" style={{ color: C.danger }}>→ Chest zone — entering now</div>
                <div className="grid grid-cols-2 gap-2">
                  <FieldRow label="BP Systolic" value={`${p.systolic_bp} sys`} />
                  <FieldRow label="BP Diastolic" value={`${p.diastolic_bp} dia`} />
                </div>
                <FieldRow label="Cholesterol (LDL)" value={`${p.cholesterol} mg/dL`} />
              </div>

              {/* Metabolic */}
              <div className="mb-5">
                <SectionHeader icon="⏱" title="Metabolic" />
                <div className="text-[9px] font-black uppercase mb-2" style={{ color: C.warn }}>→ Abdomen zone</div>
                <FieldRow label="Fasting Blood Glucose" value={`${p.glucose} mg/dL`} />
                <div className="grid grid-cols-2 gap-2">
                  <FieldRow label="BMI" value={bmi} />
                  <FieldRow label="HbA1c" placeholder="optional" />
                </div>
              </div>

              {/* Lifestyle */}
              <div>
                <SectionHeader icon="🏃" title="Lifestyle" />
                <FieldRow label="Physical Activity" value={(p.exercise || 'none').charAt(0).toUpperCase() + (p.exercise || 'none').slice(1) + ' active'} />
                <FieldRow label="Smoking Status" value={p.smoking ? 'Smoker' : 'Non-smoker'} />
                <FieldRow label="Family History" value={p.family_history ? 'Yes — known conditions' : 'None known'} />
              </div>
            </div>

            {/* CENTER: Body Model */}
            <div className="flex flex-col items-center p-4 border-r-[2px] border-black" style={{ backgroundColor: C.green2 }}>
              <div className="w-full max-w-sm border-[2px] border-yellow-400/40 px-4 py-2 text-center text-[11px] font-bold mb-4 flex items-center justify-center gap-2"
                style={{ backgroundColor: 'rgba(201,168,76,0.12)', color: C.gold }}>
                <span>◈</span> Tap glowing body zones — or fill the sidebar fields
              </div>
              <div className="flex-1 flex items-center justify-center w-full relative">
                <div className="absolute inset-0 opacity-[0.04]" style={{
                  backgroundImage: 'repeating-linear-gradient(0deg,#F4F2E9 0,#F4F2E9 1px,transparent 1px,transparent 28px),repeating-linear-gradient(90deg,#F4F2E9 0,#F4F2E9 1px,transparent 1px,transparent 28px)'
                }} />
                <BodySVGInput
                  age={p.age || 0}
                  systolic={Number(p.systolic_bp) || 0}
                  diastolic={Number(p.diastolic_bp) || 0}
                  cholesterol={Number(p.cholesterol || p.cholesterol_total) || 0}
                  glucose={p.glucose || 0}
                  bmi={bmi}
                />
              </div>
            </div>

            {/* Column 3: Status Tracking */}
            <div className="p-5 overflow-y-auto bg-white">
              <SectionHeader icon="⚡" title="Status" />
              <div className="p-4 border-[2px] border-black bg-goldPale shadow-[3px_3px_0px_#000]">
                <div className="text-[12px] font-black">TWIN READY</div>
                <div className="text-[10px] mt-1">Metabolic sync verified</div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 grid border-b-[2px] border-black"
            style={{ gridTemplateColumns: '270px 1fr', minHeight: 540 }}>

            {/* LEFT: Risk Map */}
            <div className="border-r-[2px] border-black p-4 flex flex-col items-center" style={{ backgroundColor: C.beige }}>
              <div className="flex justify-between items-center w-full mb-3">
                <span className="text-[12px] font-black" style={{ color: C.tx }}>Risk Map</span>
                <span className="text-[10px] px-2 py-0.5 border-[1.5px] border-black"
                  style={{ backgroundColor: C.beige2, color: C.mu }}>
                  {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>

              <BodySVGResults cardiac={getScore(rs.cardiac)} diabetes={getScore(rs.diabetes)} hypertension={getScore(rs.hypertension)} />

              {/* Risk legend */}
              <div className="w-full flex flex-col gap-1.5 mt-3">
                {[
                  { label: 'Cardiac', score: getScore(rs.cardiac) },
                  { label: 'Diabetes', score: getScore(rs.diabetes) },
                  { label: 'Hypertension', score: getScore(rs.hypertension) },
                ].map(r => (
                  <div key={r.label} className="flex items-center gap-2 px-3 py-2 border-[2px] border-black bg-white shadow-[2px_2px_0px_#000]">
                    <div className="w-3 h-3 flex-shrink-0" style={{ backgroundColor: getColor(r.score) }} />
                    <span className="text-[11px] font-black flex-1">{r.label}</span>
                    <span className="text-[10px] font-black px-2 py-0.5 border-[1.5px] border-black"
                      style={{ color: getColor(r.score), backgroundColor: getBg(r.score) }}>
                      {r.score}% {getStatus(r.score).split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
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
                <div className="ml-auto flex items-center gap-2">
                  {/* Gender badge */}
                  <span className="text-[10px] font-black px-2 py-1 border-[2px] border-black"
                    style={p.gender === 'female'
                      ? { backgroundColor: '#FDE8F0', color: '#C2185B', borderColor: '#F8BBD0' }
                      : { backgroundColor: '#E8F0FE', color: '#1565C0', borderColor: '#BBDEFB' }}>
                    {p.gender === 'female' ? '♀ Female' : p.gender === 'male' ? '♂ Male' : '⚧ Other'}
                  </span>
                  <span className="text-[10px] font-black px-2 py-1 border-[2px] border-black"
                    style={{ color: getColor(getScore(rs.cardiac)), backgroundColor: getBg(getScore(rs.cardiac)) }}>
                    {(a.overall_risk ?? a.risk_scores.overall_risk ?? 'HIGH')} RISK
                  </span>
                </div>
              </div>

              {/* 3 Arc Gauges */}
              <div className="grid grid-cols-3 gap-3">
                <ArcGauge label="Cardiac" score={getScore(rs.cardiac)} color={getColor(getScore(rs.cardiac))} bg={getBg(getScore(rs.cardiac))} status={getStatus(getScore(rs.cardiac))} />
                <ArcGauge label="Diabetes" score={getScore(rs.diabetes)} color={getColor(getScore(rs.diabetes))} bg={getBg(getScore(rs.diabetes))} status={getStatus(getScore(rs.diabetes))} />
                <ArcGauge label="Hypertension" score={getScore(rs.hypertension)} color={getColor(getScore(rs.hypertension))} bg={getBg(getScore(rs.hypertension))} status={getStatus(getScore(rs.hypertension))} />
              </div>

              {/* AI Insights */}
              <div className="border-[2.5px] border-black bg-white shadow-[3px_3px_0px_#000]">
                {/* Header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b-[2px] border-black">
                  <div className="w-7 h-7 border-[1.5px] border-black flex items-center justify-center"
                    style={{ backgroundColor: C.goldPale }}>
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                      <path d="M7 1L9 5.5H13.5L9.8 8.2L11.3 13L7 10.3L2.7 13L4.2 8.2L0.5 5.5H5Z" fill={C.gold} stroke={C.gold} strokeWidth="0.5" />
                    </svg>
                  </div>
                  <span className="text-[13px] font-black flex-1" style={{ color: C.tx }}>AI Insights — {p.gender.charAt(0).toUpperCase() + p.gender.slice(1)} Profile</span>
                  <span className="text-[10px] font-black px-2 py-0.5 border-[1.5px] border-black"
                    style={{ backgroundColor: C.greenPale, color: C.green }}>
                    {a.insights.length} findings
                  </span>
                </div>

                <div className="p-4">
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
