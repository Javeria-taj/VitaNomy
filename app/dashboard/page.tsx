'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { usePatientStore } from '@/store/patientStore'
import { DEMO_PATIENT, MOCK_ANALYSIS } from '@/data/mockData'

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
      {/* Abstract wireframe figure — white strokes on dark bg */}
      {/* Head */}
      <polygon points="255,10 285,25 285,55 255,70 225,55 225,25" fill="none" stroke="#F4F2E9" strokeWidth="3" />
      {/* Neck */}
      <rect x="243" y="70" width="24" height="22" fill="none" stroke="#F4F2E9" strokeWidth="2.5" />
      {/* Torso */}
      <path d="M210 92 L300 92 L295 205 L215 205 Z" fill="none" stroke="#F4F2E9" strokeWidth="3" />
      {/* Collar line */}
      <line x1="235" y1="92" x2="255" y2="108" stroke={C.gold} strokeWidth="1.5" strokeDasharray="3,3" />
      <line x1="275" y1="92" x2="255" y2="108" stroke={C.gold} strokeWidth="1.5" strokeDasharray="3,3" />
      {/* Arms */}
      <path d="M210 100 L175 110 L170 195 L185 200 L192 120 L220 108" fill="none" stroke="#F4F2E9" strokeWidth="2.5" />
      <path d="M300 100 L335 110 L340 195 L325 200 L318 120 L290 108" fill="none" stroke="#F4F2E9" strokeWidth="2.5" />
      {/* Hands */}
      <rect x="162" y="195" width="18" height="22" fill="none" stroke="#F4F2E9" strokeWidth="2" />
      <rect x="330" y="195" width="18" height="22" fill="none" stroke="#F4F2E9" strokeWidth="2" />
      {/* Hips */}
      <path d="M215 205 L200 250 L218 268 L255 272 L292 268 L310 250 L295 205 Z" fill="none" stroke="#F4F2E9" strokeWidth="2.5" />
      {/* Legs */}
      <rect x="220" y="268" width="30" height="160" fill="none" stroke="#F4F2E9" strokeWidth="2.5" />
      <rect x="260" y="268" width="30" height="160" fill="none" stroke="#F4F2E9" strokeWidth="2.5" />
      {/* Feet */}
      <rect x="213" y="424" width="44" height="16" fill="none" stroke="#F4F2E9" strokeWidth="2" />
      <rect x="253" y="424" width="44" height="16" fill="none" stroke="#F4F2E9" strokeWidth="2" />

      {/* === ZONE 1: HEAD — Age/Gender (gold) === */}
      <g className="zb" style={{ transformOrigin: '255px 38px' }}>
        <rect x="241" y="24" width="28" height="28" fill="none" stroke={C.gold} strokeWidth="2.5" />
      </g>
      <circle cx="255" cy="38" r="5" fill={C.gold} />
      <line x1="145" y1="38" x2="240" y2="38" stroke={C.gold} strokeWidth="1.3" strokeDasharray="5,4" className="dl" />
      {/* Label card */}
      <rect x="5" y="22" width="136" height="30" fill="white" stroke={C.gold} strokeWidth="2" />
      <rect x="5" y="22" width="5" height="30" fill={C.gold} />
      <text x="16" y="34" fontSize="9" fontWeight="700" fill={C.mu}>AGE · GENDER</text>
      <rect x="94" y="26" width="44" height="22" fill={C.goldPale} stroke={C.gold} strokeWidth="1.5" />
      <text x="116" y="40" textAnchor="middle" fontSize="10" fontWeight="700" fill="#8B6522">{age} yr</text>

      {/* === ZONE 2: HEART — BP ACTIVE (red) === */}
      <g className="zb" style={{ transformOrigin: '238px 140px', animationDuration: '1s' }}>
        <line x1="224" y1="126" x2="252" y2="126" stroke={C.danger} strokeWidth="2" />
        <line x1="224" y1="154" x2="252" y2="154" stroke={C.danger} strokeWidth="2" />
        <line x1="224" y1="126" x2="224" y2="154" stroke={C.danger} strokeWidth="2" />
        <line x1="252" y1="126" x2="252" y2="154" stroke={C.danger} strokeWidth="2" />
      </g>
      <circle cx="238" cy="140" r="5" fill={C.danger} />
      {/* ECG */}
      <path d="M200 140 L213 140 L218 126 L223 154 L228 112 L233 158 L238 136 L244 140 L270 140" stroke={C.danger} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.9" />
      <line x1="160" y1="140" x2="222" y2="140" stroke={C.danger} strokeWidth="1.5" strokeDasharray="5,3" className="dl" />
      {/* BP label (ACTIVE) */}
      <rect x="3" y="120" width="154" height="40" fill="#FDE8E8" stroke={C.danger} strokeWidth="2.5" />
      <rect x="3" y="120" width="6" height="40" fill={C.danger} />
      <text x="16" y="134" fontSize="9" fontWeight="700" fill={C.danger}>← ENTERING NOW</text>
      <text x="16" y="150" fontSize="11" fontWeight="700" fill={C.ink}>Blood Pressure</text>
      <rect x="112" y="124" width="42" height="32" fill={C.danger} />
      <text x="133" y="138" textAnchor="middle" fontSize="10" fontWeight="700" fill="white">{systolic}</text>
      <text x="133" y="150" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.8)">/ {diastolic}</text>

      {/* === ZONE 3: ABDOMEN — Glucose/BMI (amber) === */}
      <g className="zb" style={{ transformOrigin: '255px 190px', animationDelay: '0.5s', animationDuration: '1.8s' }}>
        <line x1="240" y1="178" x2="270" y2="178" stroke={C.warn} strokeWidth="2" />
        <line x1="240" y1="202" x2="270" y2="202" stroke={C.warn} strokeWidth="2" />
        <line x1="240" y1="178" x2="240" y2="202" stroke={C.warn} strokeWidth="2" />
        <line x1="270" y1="178" x2="270" y2="202" stroke={C.warn} strokeWidth="2" />
      </g>
      <circle cx="255" cy="190" r="4" fill={C.warn} />
      <line x1="270" y1="190" x2="352" y2="190" stroke={C.warn} strokeWidth="1.3" strokeDasharray="5,4" className="dl" />
      {/* Glucose label */}
      <rect x="352" y="176" width="150" height="28" fill="white" stroke={C.warn} strokeWidth="2" />
      <text x="362" y="186" fontSize="9.5" fontWeight="600" fill={C.mu}>Glucose · BMI</text>
      <rect x="434" y="180" width="62" height="20" fill="rgba(211,84,0,0.08)" stroke={C.warn} strokeWidth="1.5" />
      <text x="465" y="193" textAnchor="middle" fontSize="9.5" fill={C.warn}>{glucose} mg/dL</text>

      {/* === ZONE 4: Cholesterol/HR (green) === */}
      <g className="zb" style={{ transformOrigin: '278px 118px', animationDelay: '0.9s', animationDuration: '2s' }}>
        <line x1="265" y1="107" x2="291" y2="107" stroke={C.green3} strokeWidth="2" />
        <line x1="265" y1="129" x2="291" y2="129" stroke={C.green3} strokeWidth="2" />
        <line x1="265" y1="107" x2="265" y2="129" stroke={C.green3} strokeWidth="2" />
        <line x1="291" y1="107" x2="291" y2="129" stroke={C.green3} strokeWidth="2" />
      </g>
      <circle cx="278" cy="118" r="4" fill={C.green3} />
      <line x1="292" y1="118" x2="350" y2="118" stroke={C.green3} strokeWidth="1.3" strokeDasharray="5,4" className="dl" />
      <rect x="350" y="104" width="152" height="28" fill="white" stroke={C.green3} strokeWidth="2" />
      <text x="360" y="114" fontSize="9.5" fontWeight="600" fill={C.mu}>Cholesterol · HR</text>
      <rect x="434" y="108" width="62" height="20" fill="rgba(46,125,82,0.1)" stroke={C.green3} strokeWidth="1.5" />
      <text x="465" y="121" textAnchor="middle" fontSize="9.5" fill={C.green3}>{cholesterol} mg/dL</text>
    </svg>
  )
}

// ─── SVG Body (Results State) ──────────────────────────────────────────────────
function BodySVGResults({ cardiac, diabetes, hypertension }: { cardiac: number; diabetes: number; hypertension: number }) {
  return (
    <svg viewBox="0 0 272 490" width="100%" style={{ maxHeight: 380 }}>
      <style>{`@keyframes glow{0%,100%{opacity:.3}50%{opacity:.8}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        .gr{animation:glow 2s ease-in-out infinite}
        .zb{animation:blink 1.2s step-end infinite}`}</style>

      {/* Abstract Wireframe Figure */}
      <polygon points="136,8 162,20 162,46 136,58 110,46 110,20" fill="none" stroke="#2E7D52" strokeWidth="2.5" />
      <rect x="125" y="58" width="22" height="20" fill="none" stroke="#2E7D52" strokeWidth="2" />
      <path d="M104 78 L168 78 L163 182 L109 182 Z" fill="none" stroke="#2E7D52" strokeWidth="2.5" />
      <path d="M104 86 L72 96 L70 178 L82 182 L86 112 L112 90" fill="none" stroke="#2E7D52" strokeWidth="2" />
      <path d="M168 86 L200 96 L202 178 L190 182 L186 112 L160 90" fill="none" stroke="#2E7D52" strokeWidth="2" />
      <rect x="62" y="178" width="16" height="20" fill="none" stroke="#2E7D52" strokeWidth="1.8" />
      <rect x="194" y="178" width="16" height="20" fill="none" stroke="#2E7D52" strokeWidth="1.8" />
      <path d="M109 182 L98 224 L110 240 L136 244 L162 240 L174 224 L163 182 Z" fill="none" stroke="#2E7D52" strokeWidth="2" />
      <rect x="110" y="240" width="22" height="140" fill="none" stroke="#2E7D52" strokeWidth="2" />
      <rect x="140" y="240" width="22" height="140" fill="none" stroke="#2E7D52" strokeWidth="2" />
      <rect x="104" y="378" width="32" height="14" fill="none" stroke="#2E7D52" strokeWidth="1.8" />
      <rect x="136" y="378" width="32" height="14" fill="none" stroke="#2E7D52" strokeWidth="1.8" />

      {/* CARDIAC risk zone */}
      {cardiac > 60 && (
        <rect x="110" y="108" width="52" height="46" fill={C.danger} opacity="0.25" className="gr" />
      )}
      <g className="zb" style={{ animationDuration: cardiac > 60 ? '0.8s' : '2s' }}>
        <rect x="116" y="114" width="40" height="34" fill="none" stroke={C.danger} strokeWidth="2" />
      </g>
      <path d="M100 130 L108 130 L112 120 L117 142 L121 108 L126 146 L130 126 L136 130 L158 130"
        stroke={C.danger} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.9" />
      <rect x="163" y="118" width="64" height="20" fill="#FDE8E8" stroke={C.danger} strokeWidth="2" />
      <text x="195" y="131" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={C.danger}>
        {cardiac > 70 ? 'HIGH RISK' : cardiac > 40 ? 'MODERATE' : 'LOW RISK'}
      </text>
      <line x1="163" y1="128" x2="156" y2="128" stroke={C.danger} strokeWidth="1.5" strokeDasharray="3,2" />

      {/* DIABETES risk zone */}
      {diabetes > 50 && (
        <rect x="118" y="158" width="36" height="28" fill={C.warn} opacity="0.25" className="gr" style={{ animationDelay: '0.4s' }} />
      )}
      <g className="zb" style={{ animationDelay: '0.5s', animationDuration: diabetes > 60 ? '1.2s' : '2.5s' }}>
        <rect x="121" y="162" width="30" height="20" fill="none" stroke={C.warn} strokeWidth="2" />
      </g>
      <rect x="163" y="166" width="64" height="20" fill="#FEF0E5" stroke={C.warn} strokeWidth="2" />
      <text x="195" y="179" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={C.warn}>
        {diabetes > 70 ? 'HIGH RISK' : diabetes > 40 ? 'MODERATE' : 'LOW RISK'}
      </text>
      <line x1="163" y1="176" x2="153" y2="176" stroke={C.warn} strokeWidth="1.5" strokeDasharray="3,2" />

      {/* HYPERTENSION zone on head */}
      <rect x="96" y="4" width="80" height="64" fill="none" stroke={C.gold} strokeWidth="1.5" strokeDasharray="4,3"
        className="gr" style={{ animationDelay: '1s' }} />
      {/* Hypertension LOW RISK callout — LEFT of head */}
      <rect x="3" y="10" width="78" height="30" fill="white" stroke={C.gold} strokeWidth="2" />
      <rect x="3" y="10" width="5" height="30" fill={C.gold} />
      <text x="13" y="22" fontSize="8.5" fontWeight="700" fill={C.mu}>HYPERTENSION</text>
      <text x="13" y="34" fontSize="9.5" fontWeight="700" fill="#8B6522">
        {hypertension < 30 ? 'LOW RISK' : hypertension < 60 ? 'MOD' : 'HIGH'} · {hypertension}%
      </text>
      <line x1="81" y1="25" x2="98" y2="30" stroke={C.gold} strokeWidth="1.2" strokeDasharray="3,2" />
    </svg>
  )
}

// ─── Arc Gauge with countUp animation ─────────────────────────────────────────
function ArcGauge({ label, score, color, bg, status }: {
  label: string; score: number; color: string; bg: string; status: string
}) {
  const [displayed, setDisplayed] = useState(0)
  const intervalRef = useRef<any>(null)

  useEffect(() => {
    setDisplayed(0)
    const duration = 1600
    const steps = 40
    const stepTime = duration / steps
    let current = 0
    intervalRef.current = setInterval(() => {
      current += Math.ceil(score / steps)
      if (current >= score) {
        setDisplayed(score)
        if (intervalRef.current) clearInterval(intervalRef.current)
      } else {
        setDisplayed(current)
      }
    }, stepTime)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [score])

  const arc = 135
  const offset = (arc * (1 - score / 100)).toFixed(1)
  return (
    <div className="border-[3px] border-black bg-white shadow-[4px_4px_0px_#000] flex flex-col items-center p-4 gap-2">
      <div className="text-[10px] font-black uppercase tracking-[0.08em]" style={{ color }}>{label} Risk</div>
      <svg viewBox="0 0 110 72" width="110" height="72">
        <path d="M12 65 A43 43 0 0 1 98 65" fill="none" stroke={bg} strokeWidth="10" strokeLinecap="round" />
        <path d="M12 65 A43 43 0 0 1 98 65" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray="135" strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(.2,.8,.3,1)' }} />
        <text x="55" y="52" textAnchor="middle" fontSize="24" fontWeight="900" fill={C.ink}
          fontFamily="Inter, sans-serif">{displayed}</text>
        <text x="55" y="64" textAnchor="middle" fontSize="9" fill={C.mu}>/ 100</text>
      </svg>
      <div className="text-[10px] font-black px-3 py-1 border-[2px] border-black uppercase tracking-wider"
        style={{ backgroundColor: bg, color }}>
        {status}
      </div>
    </div>
  )
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { patient, analysis, setMode, setPatient, setAnalysis } = usePatientStore()
  const [view, setView] = useState<'input' | 'results'>('input')

  useEffect(() => {
    setMode('dashboard')
  }, [setMode])

  // Load demo data if none
  useEffect(() => {
    if (!patient) setPatient(DEMO_PATIENT)
    if (!analysis) setAnalysis(MOCK_ANALYSIS)
  }, [patient, analysis, setPatient, setAnalysis])

  const p = patient || DEMO_PATIENT
  const a = analysis || MOCK_ANALYSIS
  const bmi = (p.weight / ((p.height / 100) ** 2)).toFixed(1)
  const initials = p.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
  const rs = a.risk_scores

  const getStatus = (score: number) => score > 70 ? 'HIGH RISK' : score > 40 ? 'MODERATE' : 'LOW RISK'
  const getColor = (score: number) => score > 70 ? C.danger : score > 40 ? C.warn : C.ok
  const getBg = (score: number) => score > 70 ? '#FDE8E8' : score > 40 ? '#FEF0E5' : '#E8F5EE'

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.beige, fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── LANG STRIP ── */}
      <div className="flex items-center justify-between px-5 py-1.5" style={{ backgroundColor: C.green2 }}>
        <span className="text-[10px] text-white/40">VitaNomy — Your Digital Health Twin</span>
        <div className="flex gap-1">
          {['EN', 'हि', 'தமி', 'తె'].map((l, i) => (
            <span key={l} className="text-[10px] px-2 py-0.5"
              style={i === 0 ? { backgroundColor: C.gold, color: C.ink, fontWeight: 700 } : { color: 'rgba(255,255,255,0.4)' }}>
              {l}
            </span>
          ))}
        </div>
      </div>

      {/* ── NAV ── */}
      <nav className="flex items-center justify-between px-5 py-2.5 border-b-[2.5px] border-black" style={{ backgroundColor: C.beige }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 border-[2px] border-black flex items-center justify-center shadow-[2px_2px_0px_#000]"
            style={{ backgroundColor: C.green }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1C4.2 1 2 3.2 2 6C2 9 5 12 7 13C9 12 12 9 12 6C12 3.2 9.8 1 7 1Z" fill="white" opacity=".9" />
            </svg>
          </div>
          <span className="text-[17px] font-black tracking-tight" style={{ color: C.tx }}>Vita<span style={{ color: C.gold }}>Nomy</span></span>
        </div>
        <div className="flex gap-0">
          {[
            { label: 'Dashboard', href: '/dashboard', active: true },
            { label: 'Simulator', href: '/simulator', active: false },
            { label: 'AI Chat', href: '/chat', active: false },
            { label: 'Report', href: '#', active: false },
          ].map(item => (
            <Link key={item.label} href={item.href}
              className="text-[12px] font-black px-4 py-1.5 border-b-[2.5px] transition-all"
              style={item.active
                ? { color: C.green, borderColor: C.green }
                : { color: C.mu, borderColor: 'transparent' }}>
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 border-[2px] border-black shadow-[2px_2px_0px_#000] bg-white">
          <div className="w-6 h-6 border-[2px] border-black flex items-center justify-center text-[10px] font-black text-white"
            style={{ backgroundColor: C.green }}>{initials}</div>
          <span className="text-[12px] font-bold" style={{ color: C.tx }}>{p.name.split(' ')[0]}</span>
        </div>
      </nav>

      {/* ── SUB-NAV ── */}
      <div className="flex items-center justify-between px-5 border-b-[2px] border-black" style={{ backgroundColor: C.beige2 }}>
        <div className="flex">
          {(['input', 'results'] as const).map((v) => (
            <button key={v} onClick={() => setView(v)}
              className="text-[12px] font-black px-4 py-2.5 border-b-[3px] transition-all"
              style={view === v
                ? { color: C.green, borderColor: C.green }
                : { color: C.mu, borderColor: 'transparent' }}>
              {v === 'input' ? 'Build Your Twin' : 'Results'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-[11px]" style={{ color: C.mu }}>
          <div className="w-2 h-2" style={{ backgroundColor: C.ok }} />
          Model ready
        </div>
      </div>

      {/* ── STATES ── */}
      <AnimatePresence mode="wait">
        {view === 'input' ? (
          <React.Fragment key="input-view">
            <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 grid border-b-[2px] border-black"
            style={{ gridTemplateColumns: '240px 1fr 190px', minHeight: 540, overflow: 'hidden' }}>

            {/* LEFT: Form Fields */}
            <div className="border-r-[2px] border-black p-4 overflow-y-auto" style={{ backgroundColor: C.beige }}>

              {/* Personal */}
              <div className="mb-5">
                <SectionHeader icon="👤" title="Personal"
                  badge={<NBadge label="✓ Done" color={C.green} bg={C.greenPale} />} />
                <div className="text-[9px] font-black uppercase mb-1" style={{ color: C.gold }}>→ Head zone</div>
                <FieldRow label="Age" value={`${p.age} years`} />
                <div className="grid grid-cols-2 gap-2">
                  <FieldRow label="Height" value={`${p.height} cm`} />
                  <FieldRow label="Weight" value={`${p.weight} kg`} />
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
                <FieldRow label="Physical Activity" value={p.exercise.charAt(0).toUpperCase() + p.exercise.slice(1) + ' active'} />
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
                  age={p.age}
                  systolic={p.systolic_bp}
                  diastolic={p.diastolic_bp}
                  cholesterol={p.cholesterol}
                  glucose={p.glucose}
                  bmi={bmi}
                />
              </div>
            </div>

            {/* RIGHT: Progress Guide */}
            <div className="p-4 flex flex-col gap-4" style={{ backgroundColor: C.beige2 }}>
              <div>
                <div className="text-[10px] font-black uppercase tracking-wider mb-1.5" style={{ color: C.mu }}>Completion</div>
                <div className="flex justify-between text-[11px] mb-1" style={{ color: C.mu }}>
                  <span>3 of 5 sections</span>
                  <span className="font-black" style={{ color: C.green }}>60%</span>
                </div>
                <div className="h-2 border-[2px] border-black overflow-hidden" style={{ backgroundColor: C.beige3 }}>
                  <div className="h-full transition-all duration-700" style={{ width: '60%', backgroundColor: C.green }} />
                </div>
              </div>

              <div>
                <div className="text-[10px] font-black uppercase tracking-wider mb-2" style={{ color: C.mu }}>Sections</div>
                <div className="flex flex-col gap-1.5">
                  {[
                    { label: 'Personal info', done: true },
                    { label: 'Blood pressure', done: true },
                    { label: 'Heart rate & lipids', active: true },
                    { label: 'Glucose & metabolic', done: false },
                    { label: 'Lifestyle factors', done: false },
                  ].map(s => (
                    <div key={s.label} className="flex items-center gap-2 p-2 border-[1.5px] border-black"
                      style={{ backgroundColor: s.done ? C.greenPale : s.active ? C.goldPale : 'white' }}>
                      <div className="w-5 h-5 border-[1.5px] border-black flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: s.done ? C.green : s.active ? C.gold : C.beige2 }}>
                        {s.done && <svg width="9" height="9" viewBox="0 0 9 9"><path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>}
                        {s.active && <div className="w-2 h-2 bg-white" />}
                      </div>
                      <span className="text-[11px] font-bold" style={{ color: s.done || s.active ? C.tx : C.mu }}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* BMI Preview */}
              <div className="border-[2px] border-black p-3 shadow-[2px_2px_0px_#000] bg-white">
                <div className="text-[9px] font-black uppercase tracking-wider mb-1" style={{ color: C.mu }}>BMI Preview</div>
                <div className="text-[30px] font-black leading-none" style={{ color: C.green }}>{bmi}</div>
                <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 border-[1.5px] border-black text-[10px] font-black"
                  style={{ backgroundColor: C.greenPale, color: C.green }}>✓ Normal range</div>
              </div>

              <div className="border-[1.5px] p-3" style={{ borderColor: 'rgba(27,94,59,0.2)', backgroundColor: 'rgba(27,94,59,0.04)' }}>
                <div className="text-[10px] font-black mb-1" style={{ color: C.green }}>Profile Active</div>
                <p className="text-[11px] leading-relaxed" style={{ color: C.mu }}>
                  VitaNomy auto-calibrates risk scores to your <strong style={{ color: C.green }}>individual baselines</strong> based on age, gender, and family history.
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── ANALYSE CTA BAR (Input state only) ── */}
          <div className="border-t-[2px] border-black px-5 py-3.5 flex items-center gap-4"
            style={{ backgroundColor: C.beige2 }}>
            <button
              onClick={() => setView('results')}
              className="flex-1 flex items-center justify-center gap-3 py-3.5 border-[2.5px] border-black font-black text-[14px] shadow-[4px_4px_0px_#000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#000]"
              style={{ backgroundColor: C.green, color: 'white' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.6" strokeDasharray="4 2"/>
                <path d="M8 5V8.5L10 10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Analyse My Digital Twin
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8H13M9 4L13 8L9 12" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="text-[11px] text-right leading-relaxed" style={{ color: C.mu }}>
              3 / 5 sections<br />
              <strong style={{ color: C.tx }}>ready to run</strong>
            </div>
          </div>
        </React.Fragment>
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

              <BodySVGResults cardiac={rs.cardiac} diabetes={rs.diabetes} hypertension={rs.hypertension} />

              {/* Risk legend */}
              <div className="w-full flex flex-col gap-1.5 mt-3">
                {[
                  { label: 'Cardiac', score: rs.cardiac },
                  { label: 'Diabetes', score: rs.diabetes },
                  { label: 'Hypertension', score: rs.hypertension },
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

            {/* RIGHT: Results dashboard */}
            <div className="p-5 flex flex-col gap-4 overflow-y-auto" style={{ backgroundColor: C.beige2 }}>

              {/* Patient bar */}
              <div className="flex items-center gap-3 p-3 border-[2.5px] border-black bg-white shadow-[3px_3px_0px_#000]">
                <div className="w-10 h-10 border-[2px] border-black flex items-center justify-center text-[14px] font-black text-white"
                  style={{ backgroundColor: C.green }}>{initials}</div>
                <div>
                  <div className="text-[14px] font-black" style={{ color: C.tx }}>{p.name}</div>
                  <div className="text-[11px] font-bold" style={{ color: C.mu }}>
                    {p.age} yrs · BMI {bmi} · {p.smoking ? 'Smoker' : 'Non-smoker'}
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
                    style={{ color: getColor(rs.cardiac), backgroundColor: getBg(rs.cardiac) }}>
                    {a.overall_risk} RISK
                  </span>
                </div>
              </div>

              {/* 3 Arc Gauges */}
              <div className="grid grid-cols-3 gap-3">
                <ArcGauge label="Cardiac" score={rs.cardiac} color={getColor(rs.cardiac)} bg={getBg(rs.cardiac)} status={getStatus(rs.cardiac)} />
                <ArcGauge label="Diabetes" score={rs.diabetes} color={getColor(rs.diabetes)} bg={getBg(rs.diabetes)} status={getStatus(rs.diabetes)} />
                <ArcGauge label="Hypertension" score={rs.hypertension} color={getColor(rs.hypertension)} bg={getBg(rs.hypertension)} status={getStatus(rs.hypertension)} />
              </div>

              {/* AI Insights */}
              <div className="border-[2.5px] border-black bg-white shadow-[3px_3px_0px_#000]">
                {/* Header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b-[2px] border-black">
                  <div className="w-7 h-7 border-[1.5px] border-black flex items-center justify-center"
                    style={{ backgroundColor: C.goldPale }}>
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                      <path d="M7 1L9 5.5H13.5L9.8 8.2L11.3 13L7 10.3L2.7 13L4.2 8.2L0.5 5.5H5Z" fill={C.gold} stroke={C.gold} strokeWidth="0.5"/>
                    </svg>
                  </div>
                  <span className="text-[13px] font-black flex-1" style={{ color: C.tx }}>AI Insights — {p.gender.charAt(0).toUpperCase() + p.gender.slice(1)} Profile</span>
                  <span className="text-[10px] font-black px-2 py-0.5 border-[1.5px] border-black"
                    style={{ backgroundColor: C.greenPale, color: C.green }}>
                    {a.insights.length} findings
                  </span>
                </div>
                {/* Insight rows — per-index icon/color mapping */}
                {a.insights.map((insight, i) => {
                  const configs = [
                    { bg: '#FDE8E8', icon: <path d="M6.5 11C6.5 11 2 8 2 5C2 3.3 3.2 2 5 2C5.7 2 6.2 2.3 6.5 3C6.8 2.3 7.3 2 8 2C9.8 2 11 3.3 11 5C11 8 6.5 11 6.5 11Z" fill={C.danger} opacity=".8"/> },
                    { bg: '#FEF0E5', icon: <><circle cx="6.5" cy="6.5" r="4.8" stroke={C.warn} strokeWidth="1.4" fill="none"/><path d="M6.5 3.5V6.8L8.5 8" stroke={C.warn} strokeWidth="1.3" strokeLinecap="round"/></> },
                    { bg: C.greenPale, icon: <path d="M2 6.5L4.5 9L11 3.5" stroke={C.green} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/> },
                  ]
                  const cfg = configs[i] ?? configs[2]
                  return (
                    <div key={i} className="flex gap-3 px-4 py-3 border-b-[1px] border-black/10 last:border-0">
                      <div className="w-7 h-7 border-[1.5px] border-black flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: cfg.bg }}>
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">{cfg.icon}</svg>
                      </div>
                      <p className="text-[12px] leading-relaxed" style={{ color: C.tx }}>
                        <strong style={{ color: C.green }}>{insight.split('.')[0]}.</strong>{insight.split('.').slice(1).join('.')}
                      </p>
                    </div>
                  )
                })}
                {/* All recommendations */}
                {a.recommendations.length > 0 && (
                  <div className="border-t-[2px] border-black">
                    <div className="px-4 py-2 text-[10px] font-black uppercase tracking-wider" style={{ color: C.mu, backgroundColor: C.beige2 }}>
                      Top Recommendations
                    </div>
                    {a.recommendations.map((rec, i) => (
                      <div key={i} className="flex gap-3 px-4 py-2.5 border-b-[1px] border-black/10 last:border-0">
                        <div className="w-5 h-5 border-[1.5px] border-black flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: C.greenPale }}>
                          <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                            <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke={C.green} strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        </div>
                        <p className="text-[12px] font-bold leading-relaxed" style={{ color: C.green }}>{rec}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-3 px-4 border-[2.5px] border-black font-black text-[13px] shadow-[3px_3px_0px_#000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000]"
                  style={{ backgroundColor: C.green, color: 'white' }}>
                  📄 Download PDF ↗
                </button>
                <Link href="/simulator"
                  className="flex items-center justify-center gap-2 py-3 px-4 border-[2.5px] border-black font-black text-[13px] shadow-[3px_3px_0px_#000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000]"
                  style={{ backgroundColor: C.goldPale, color: C.ink }}>
                  📈 Run Simulator →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── BOTTOM BAR ── */}
      <div className="flex items-center justify-between px-5 py-3 border-t-[2px] border-black"
        style={{ backgroundColor: view === 'results' ? C.green2 : C.beige2 }}>
        <button onClick={() => setView(view === 'results' ? 'input' : 'results')}
          className="flex items-center gap-2 px-4 py-2 border-[2px] font-black text-[12px] transition-all"
          style={{ borderColor: view === 'results' ? 'rgba(255,255,255,0.25)' : C.ink, color: view === 'results' ? 'rgba(255,255,255,0.8)' : C.ink, backgroundColor: 'transparent' }}>
          {view === 'results' ? '← Back to Twin Builder' : 'View Results →'}
        </button>
        <span className="text-[11px] italic opacity-40" style={{ color: view === 'results' ? 'white' : C.mu }}>
          Mock early. Integrate late. Polish always.
        </span>
        <span className="text-[11px]" style={{ color: view === 'results' ? 'rgba(255,255,255,0.45)' : C.mu }}>
          Powered by VitaTwin V1.4
        </span>
      </div>
    </div>
  )
}
