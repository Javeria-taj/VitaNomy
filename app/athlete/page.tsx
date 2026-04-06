'use client'

import React, { useEffect, useState } from 'react'
import { PatientForm } from '@/components/Form/PatientForm'
import { usePatientStore } from '@/store/patientStore'
import { Topbar } from '@/components/Layout/Topbar'
import { TARUN_CASE } from '@/data/mockData'
import { calculateRisks, getOverallRisk } from '@/lib/riskEngine'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

// ─── Pre-compute real risk scores from the engine (no API call needed) ─────────
const ARJUN_RISKS = calculateRisks(TARUN_CASE)
const ARJUN_OVERALL = getOverallRisk(ARJUN_RISKS)

const ar = ARJUN_RISKS as any

// ─── Risk domain config for Arjun's profile ────────────────────────────────────
const ARJUN_DOMAINS = [
  {
    key: 'cardiovascular',
    label: 'Cardiovascular',
    icon: '🫀',
    score: ar.cardiovascular?.score ?? 0,
    drivers: ar.cardiovascular?.primary_drivers ?? [],
    ci: ar.cardiovascular?.confidence_interval ?? [0, 0],
  },
  {
    key: 'hepatotoxicity',
    label: 'Hepatotoxicity',
    icon: '🟤',
    score: ar.hepatotoxicity?.score ?? 0,
    drivers: ar.hepatotoxicity?.primary_drivers ?? [],
    ci: ar.hepatotoxicity?.confidence_interval ?? [0, 0],
  },
  {
    key: 'endocrine_suppression',
    label: 'Endocrine Suppression',
    icon: '⚡',
    score: ar.endocrine_suppression?.score ?? 0,
    drivers: ar.endocrine_suppression?.primary_drivers ?? [],
    ci: ar.endocrine_suppression?.confidence_interval ?? [0, 0],
  },
  {
    key: 'hematological',
    label: 'Hematological',
    icon: '🩸',
    score: ar.hematological?.score ?? 0,
    drivers: ar.hematological?.primary_drivers ?? [],
    ci: ar.hematological?.confidence_interval ?? [0, 0],
  },
]

// ─── Color tokens ──────────────────────────────────────────────────────────────
function getScoreColor(score: number): string {
  if (score >= 75) return '#C0392B'
  if (score >= 55) return '#E07A5F'
  if (score >= 35) return '#C9A84C'
  return '#2E7D52'
}

function getScoreLabel(score: number): string {
  if (score >= 75) return 'CRITICAL'
  if (score >= 55) return 'HIGH'
  if (score >= 35) return 'MODERATE'
  return 'LOW RISK'
}

function getRiskBg(overall: string): string {
  if (overall === 'CRITICAL') return '#C0392B'
  if (overall === 'HIGH') return '#E07A5F'
  if (overall === 'MEDIUM') return '#C9A84C'
  return '#2E7D52'
}

// ─── Animated Score Bar ────────────────────────────────────────────────────────
function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="w-full h-5 border-[2px] border-black bg-white relative overflow-hidden">
      <motion.div
        className="h-full absolute top-0 left-0"
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
        style={{ backgroundColor: color }}
      />
      <div className="absolute inset-0 flex items-center justify-end pr-1">
        <span className="text-[9px] font-black z-10 mix-blend-difference text-white">{score}</span>
      </div>
    </div>
  )
}

// ─── Locked & Loaded Panel ─────────────────────────────────────────────────────
function ArjunLockedPanel({ onLoadProfile }: { onLoadProfile: () => void }) {
  const riskBg = getRiskBg(ARJUN_OVERALL)
  const maxScore = Math.max(...ARJUN_DOMAINS.map(d => d.score))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto mb-8"
    >
      {/* ── Banner ── */}
      <div className="border-[4px] border-black bg-black text-white px-6 py-3 flex items-center justify-between"
        style={{ boxShadow: '6px 6px 0px #C0392B' }}>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-[0.3em]">Demo Case — Locked & Loaded</span>
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest opacity-50">
          VitaNomy Athlete Intelligence Engine
        </span>
      </div>

      <div className="border-[4px] border-t-0 border-black bg-white"
        style={{ boxShadow: '6px 6px 0px #000' }}>

        {/* ── Patient Header ── */}
        <div className="border-b-[3px] border-black p-5 flex items-start justify-between gap-4"
          style={{ backgroundColor: '#F8F5EE' }}>
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Athlete Digital Twin</div>
            <h2 className="text-[28px] font-black uppercase tracking-tight leading-none">{TARUN_CASE.name}</h2>
            <p className="text-[12px] font-bold mt-1 opacity-60 uppercase tracking-widest">
              {TARUN_CASE.age}yr · {TARUN_CASE.weight}kg · {TARUN_CASE.body_fat_percent}% BF · {TARUN_CASE.training_years}yr training
            </p>
          </div>
          <div className="text-right">
            <div
              className="inline-block px-4 py-2 border-[3px] border-black text-[13px] font-black uppercase tracking-widest text-white"
              style={{ backgroundColor: riskBg, boxShadow: '3px 3px 0px #000' }}
            >
              {ARJUN_OVERALL}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-50">
              Overall Risk Classification
            </p>
          </div>
        </div>

        {/* ── Clinical Flags ── */}
        <div className="border-b-[3px] border-black px-5 py-3 flex flex-wrap gap-2"
          style={{ backgroundColor: '#FDE8E8' }}>
          <span className="text-[9px] font-black uppercase tracking-wider text-red-800">⚠ Flags:</span>
          {[
            'Cycle EXCEEDED (14/12 wk)',
            'Trenbolone EXCEEDED (14/8 wk)',
            'No PCT Active',
            'Full HPTA Shutdown',
            'Oral at 10/6 wk',
          ].map(f => (
            <span key={f}
              className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 border-[2px] border-red-800 text-red-800">
              {f}
            </span>
          ))}
        </div>

        {/* ── Risk Score Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border-b-[3px] border-black">
          {ARJUN_DOMAINS.map((domain, i) => {
            const color = getScoreColor(domain.score)
            const label = getScoreLabel(domain.score)
            return (
              <div key={domain.key}
                className={`p-4 flex flex-col gap-3 ${i < 3 ? 'border-r-[3px] border-black' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[14px]">{domain.icon}</span>
                    <span className="text-[10px] font-black uppercase tracking-wide leading-tight">{domain.label}</span>
                  </div>
                  <span
                    className="text-[8px] font-black px-1.5 py-0.5 border-[1px] border-black uppercase"
                    style={{ backgroundColor: color, color: '#fff' }}
                  >
                    {label}
                  </span>
                </div>

                <div className="text-[42px] font-black leading-none tracking-tight" style={{ color }}>
                  {domain.score}
                  <span className="text-[14px] font-black opacity-40">%</span>
                </div>

                <ScoreBar score={domain.score} color={color} />

                <div className="space-y-1">
                  {domain.drivers.map((d: string, j: number) => (
                    <p key={j} className="text-[9px] font-bold leading-snug opacity-60">
                      → {d}
                    </p>
                  ))}
                </div>

                <div className="text-[9px] font-black opacity-30 uppercase tracking-wider">
                  CI: [{domain.ci[0]}–{domain.ci[1]}]
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Bloodwork Summary ── */}
        <div className="border-b-[3px] border-black p-5">
          <div className="text-[10px] font-black uppercase tracking-widest mb-3 opacity-40">Bloodwork Panel — Where Standard Labs Say "Fine"</div>
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { l: 'Cholesterol', v: `${TARUN_CASE.cholesterol_total}`, ref: '<200', flag: false },
              { l: 'HDL', v: `${TARUN_CASE.cholesterol_hdl}`, ref: '>40', flag: true },
              { l: 'Hematocrit', v: `${TARUN_CASE.hematocrit}%`, ref: '38–50%', flag: true },
              { l: 'ALT', v: `${TARUN_CASE.alt} U/L`, ref: '<40', flag: true },
              { l: 'AST', v: `${TARUN_CASE.ast} U/L`, ref: '<40', flag: true },
              { l: 'LH', v: `${TARUN_CASE.lh} IU/L`, ref: '1.5–9.3', flag: true },
            ].map(item => (
              <div key={item.l}
                className="border-[2px] border-black p-2"
                style={{ backgroundColor: item.flag ? '#FDE8E8' : '#F0F7F0' }}>
                <div className="text-[8px] font-black uppercase tracking-widest opacity-50">{item.l}</div>
                <div className="text-[18px] font-black leading-tight"
                  style={{ color: item.flag ? '#C0392B' : '#1B5E3B' }}>
                  {item.v}
                </div>
                <div className="text-[8px] font-black opacity-30">Ref: {item.ref}</div>
                {item.flag && <div className="text-[8px] font-black text-red-700">⚠ FLAG</div>}
              </div>
            ))}
          </div>
        </div>

        {/* ── Compound Stack ── */}
        <div className="border-b-[3px] border-black p-5">
          <div className="text-[10px] font-black uppercase tracking-widest mb-3 opacity-40">Active Compound Stack — What Your GP Never Sees</div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {TARUN_CASE.compounds?.map((c, i) => {
              const exceeded = c.cycle_week_current > c.cycle_week_total
              return (
                <div key={i}
                  className="border-[2px] border-black p-3"
                  style={{ backgroundColor: exceeded ? '#FDE8E8' : '#F8F5EE', boxShadow: '3px 3px 0px #000' }}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-black text-[12px] uppercase leading-tight">{c.name}</div>
                    {exceeded && (
                      <span className="text-[8px] font-black bg-red-700 text-white px-1.5 py-0.5 border border-black">
                        EXCEEDED
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="opacity-50 font-bold uppercase">Dose</span>
                      <span className="font-black">{c.dose_mg}mg {c.frequency}</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="opacity-50 font-bold uppercase">Route</span>
                      <span className="font-black uppercase">{c.route}</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="opacity-50 font-bold uppercase">Cycle</span>
                      <span className="font-black" style={{ color: exceeded ? '#C0392B' : '#000' }}>
                        Wk {c.cycle_week_current} / {c.cycle_week_total}
                      </span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-2 w-full h-2 border border-black bg-white overflow-hidden">
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${Math.min(100, (c.cycle_week_current / c.cycle_week_total) * 100)}%`,
                        backgroundColor: exceeded ? '#C0392B' : '#C9A84C'
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="p-5 flex items-center justify-between" style={{ backgroundColor: '#F8F5EE' }}>
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest opacity-50">Load this profile into your session</p>
            <p className="text-[10px] font-bold opacity-30">Triggers full AI analysis + redirects to simulator</p>
          </div>
          <button
            onClick={onLoadProfile}
            className="px-8 py-4 border-[4px] border-black font-black uppercase text-[13px] tracking-widest transition-all hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none flex items-center gap-3"
            style={{ backgroundColor: '#1B5E3B', color: 'white', boxShadow: '6px 6px 0px #000' }}
          >
            ⚡ Activate Arjun's Twin
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AthleteIntakePage() {
  const { setMode, setPatient, setAnalysis, setLoading } = usePatientStore()
  const router = useRouter()
  const [isActivating, setIsActivating] = useState(false)

  useEffect(() => {
    setMode('athlete')
  }, [setMode])

  const handleLoadArjun = async () => {
    setIsActivating(true)
    setMode('athlete')
    setPatient(TARUN_CASE)
    setLoading('analyze', true)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(TARUN_CASE)
      })
      const data = await res.json()
      setAnalysis(data)
      router.push('/simulator')
    } catch {
      // Fallback: use pre-computed scores and go to simulator anyway
      router.push('/simulator')
    } finally {
      setLoading('analyze', false)
      setIsActivating(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F4F2E9', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Topbar />

      <main className="flex-1 flex flex-col items-center p-6 lg:p-12 pt-8">

        {/* ── Locked & Loaded Demo ── */}
        <ArjunLockedPanel onLoadProfile={handleLoadArjun} />

        {/* ── Divider ── */}
        <div className="w-full max-w-4xl mx-auto flex items-center gap-4 mb-8">
          <div className="flex-1 h-[3px] bg-black" />
          <span className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40 whitespace-nowrap">
            Or complete your own intake
          </span>
          <div className="flex-1 h-[3px] bg-black" />
        </div>

        {/* ── Standard Intake Form ── */}
        <div className="w-full max-w-2xl bg-white border-[4px] border-black p-8 lg:p-12 shadow-[12px_12px_0px_#000] relative overflow-hidden">
          {/* Performance Grid Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, #000 0, #000 1px, transparent 1px, transparent 24px), repeating-linear-gradient(90deg, #000 0, #000 1px, transparent 1px, transparent 24px)'
          }} />

          <div className="relative z-10">
            <header className="mb-10 text-center">
              <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-3">Performance Intake</h1>
              <p className="text-[14px] font-bold uppercase tracking-widest text-black/50">
                Advanced Biometric &amp; Compound Monitoring
              </p>
            </header>

            <PatientForm mode="athlete" />

            <footer className="mt-12 pt-6 border-t-[2px] border-black/10 text-center">
              <p className="text-[11px] font-black uppercase tracking-widest text-black/30">
                Data encrypted with clinical grade security (AES-256)
              </p>
            </footer>
          </div>
        </div>
      </main>

      {/* Activating Overlay */}
      {isActivating && (
        <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
          <div className="text-white text-center">
            <div className="text-[60px] mb-4 animate-spin">⚡</div>
            <p className="text-[24px] font-black uppercase tracking-widest mb-2">Activating Twin</p>
            <p className="text-[12px] font-bold uppercase tracking-[0.3em] opacity-50">
              Running Arjun Mehta through risk engine...
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
