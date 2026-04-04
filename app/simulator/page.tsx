'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SimulatorBody } from '@/components/Simulator/SimulatorBody'
import { RiskGauge } from '@/components/Simulator/RiskGauge'
import Link from 'next/link'
import { usePatientStore } from '@/store/patientStore'

// ─── STYLE CONSTANTS ──────────────────────────────────────────────────────────
const SECTION_LABEL = "text-[10px] font-black uppercase tracking-[0.18em] text-black/40 mb-3 block"
const NEO_LABEL = "text-[11px] font-black uppercase tracking-wider text-black"

// ─── Chunky Neobrutalist Slider ───────────────────────────────────────────────
function NeoSlider({
  label, value, min, max, step = 1, unit, onChange, warn = false
}: {
  label: string; value: number; min: number; max: number
  step?: number; unit: string; onChange: (v: number) => void; warn?: boolean
}) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className={NEO_LABEL}>{label}</span>
        <span
          className="text-[11px] font-black font-mono px-2 py-0.5 border-[2px] border-black"
          style={{
            backgroundColor: warn ? '#E07A5F' : '#C9A84C',
            color: '#000',
            boxShadow: '2px 2px 0px #000000'
          }}
        >
          {value}{unit}
        </span>
      </div>
      <div className="relative h-5 flex items-center">
        {/* Track */}
        <div className="absolute w-full h-3 border-[3px] border-black bg-white" />
        {/* Fill */}
        <div
          className="absolute h-3 border-y-[3px] border-l-[3px] border-black"
          style={{
            width: `${((value - min) / (max - min)) * 100}%`,
            backgroundColor: warn ? '#E07A5F' : '#2E7D52'
          }}
        />
        {/* Input overlay */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute w-full opacity-0 cursor-pointer h-5 z-10"
        />
        {/* Thumb indicator — positioned by value */}
        <div
          className="absolute w-4 h-6 border-[3px] border-black pointer-events-none"
          style={{
            left: `calc(${((value - min) / (max - min)) * 100}% - 8px)`,
            backgroundColor: warn ? '#E07A5F' : '#C9A84C',
            boxShadow: '2px 2px 0px #000000'
          }}
        />
      </div>
    </div>
  )
}

// ─── Physical Toggle Button Group ────────────────────────────────────────────
function NeoToggleGroup({
  label, options, value, onChange
}: {
  label: string
  options: { val: number | string; label: string }[]
  value: number | string
  onChange: (v: number | string) => void
}) {
  return (
    <div className="mb-4">
      <span className={NEO_LABEL + ' block mb-2'}>{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map(opt => {
          const active = opt.val === value
          return (
            <button
              key={String(opt.val)}
              type="button"
              onClick={() => onChange(opt.val)}
              className="text-[11px] font-black px-3 py-1.5 border-[3px] border-black transition-all"
              style={active
                ? { backgroundColor: '#113826', color: 'white', boxShadow: '2px 2px 0px #000000' }
                : { backgroundColor: 'white', color: '#000', boxShadow: '3px 3px 0px #000000' }
              }
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Physical On/Off Toggle ───────────────────────────────────────────────────
function NeoSwitch({ label, value, onChange, danger = false }: {
  label: string; value: boolean; onChange: (v: boolean) => void; danger?: boolean
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b-[2px] border-black/10 last:border-0">
      <span className={NEO_LABEL}>{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className="w-12 h-7 border-[3px] border-black relative flex-shrink-0 transition-all"
        style={{
          backgroundColor: value ? (danger ? '#E07A5F' : '#2E7D52') : 'white',
          boxShadow: value ? '1px 1px 0px #000000' : '3px 3px 0px #000000',
          transform: value ? 'translate(1px, 1px)' : 'translate(0,0)'
        }}
      >
        <div
          className="absolute top-[2px] w-4 h-4 border-[2px] border-black bg-white transition-all"
          style={{ left: value ? 'calc(100% - 20px)' : '2px' }}
        />
      </button>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SimulatorPage() {
  const [cal, setCal] = useState(1800)
  const [carb, setCarb] = useState(180)
  const [sodium, setSodium] = useState(1500)
  const [exercise, setExercise] = useState(4)
  const [sleep, setSleep] = useState(7.5)
  const [stress, setStress] = useState(3)
  const [isSmoker, setIsSmoker] = useState(false)
  const [isMeds, setIsMeds] = useState(true)
  const [timeline, setTimeline] = useState('1M')
  const [isSimulating, setIsSimulating] = useState(false)

  const { patient, analysis, setMode } = usePatientStore()

  // --- BASELINE (From Store or Default) ---
  const baseline = (analysis && patient) ? {
    vitals: { 
      bp: `${patient.systolic_bp}/${patient.diastolic_bp}`, 
      glucose: patient.glucose, 
      hr: 75, 
      bmi: parseFloat((patient.weight / ((patient.height / 100) ** 2)).toFixed(1))
    },
    risks: analysis.risk_scores,
    score: 82 // Mock overall health score
  } : {
    vitals: { bp: '138/88', glucose: 118, hr: 78, bmi: 30.1 },
    risks: { diabetes: 44, cardiac: 55, hypertension: 49 },
    score: 72
  }

  const [sim, setSim] = useState(baseline)

  // Sync initial state with patient data
  useEffect(() => {
    setMode('simulator')
    if (patient) {
      setCal(2000)
      setCarb(patient.exercise === 'none' ? 250 : 180)
      setSodium(patient.systolic_bp > 130 ? 1500 : 2300)
      setExercise(patient.exercise === 'none' ? 0 : patient.exercise === 'light' ? 2 : 4)
      setIsSmoker(patient.smoking)
    }
  }, [patient, setMode])

  const runSimulation = () => {
    setIsSimulating(true)
    setTimeout(() => {
      // Logic using baseline and adjustments
      const newBpSys = Math.max(110, (patient?.systolic_bp || 138) - (exercise * 2) - (isMeds ? 10 : 0) + (sodium > 3000 ? 8 : 0) + (stress > 7 ? 6 : 0))
      const newBpDia = Math.max(70, (patient?.diastolic_bp || 88) - (exercise * 1) - (isMeds ? 5 : 0) + (sodium > 3000 ? 4 : 0))
      const newGlucose = Math.max(85, (patient?.glucose || 118) - (carb < 100 ? 15 : 0) - (exercise * 3) + (cal > 2500 ? 10 : 0))
      const newHr = Math.max(60, 78 - (exercise * 2) - (sleep > 7 ? 4 : 0) + (stress > 7 ? 8 : 0))
      const newBmi = Math.max(22, (baseline.vitals.bmi) - (exercise * 0.5) - (cal < 1500 ? 1.5 : 0) + (cal > 2500 ? 1 : 0))
      
      const newDiabRisk = Math.max(5, (baseline.risks.diabetes) - (newGlucose < 100 ? 15 : 0) - (exercise * 5))
      const newCardRisk = Math.max(8, (baseline.risks.cardiac) - (exercise * 6) - (isSmoker ? -15 : 0) - (isMeds ? 10 : 0))
      const newHyperRisk = Math.max(10, (baseline.risks.hypertension) - (newBpSys < 125 ? 20 : 0) - (sodium < 1500 ? 10 : 0))
      const newScore = Math.min(98, (baseline.score) + (exercise > 3 ? 10 : 0) + (sleep > 7 ? 5 : 0) - (isSmoker ? 12 : 0))

      setSim({
        vitals: { bp: `${Math.round(newBpSys)}/${Math.round(newBpDia)}`, glucose: Math.round(newGlucose), hr: Math.round(newHr), bmi: parseFloat(newBmi.toFixed(1)) },
        risks: { diabetes: Math.round(newDiabRisk), cardiac: Math.round(newCardRisk), hypertension: Math.round(newHyperRisk) },
        score: Math.round(newScore)
      })
      setIsSimulating(false)
    }, 800)
  }

  const applyScenario = (type: string) => {
    if (type === 'clean') { setCal(1800); setCarb(120); setSodium(1500); setExercise(5); setSleep(8); setStress(2); setIsSmoker(false) }
    else if (type === 'keto') { setCal(2000); setCarb(40); setSodium(2000); setExercise(4); setSleep(7.5) }
    else if (type === 'stress') { setCal(2500); setCarb(300); setSodium(3500); setExercise(0); setSleep(4); setStress(9) }
  }

  useEffect(() => { runSimulation() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const scoreDelta = sim.score - baseline.score

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#F4F2E9', fontFamily: 'Inter, system-ui, sans-serif' }}
    >

      {/* ── TOP NAV ─────────────────────────────────────────────────────────── */}
      <nav className="flex items-center justify-between px-6 py-4 border-b-[3px] border-black" style={{ backgroundColor: '#F4F2E9' }}>
        <Link href="/" className="text-[20px] font-black text-black tracking-tight">
          VitaNomy
        </Link>
        <div className="hidden md:flex gap-1">
          {[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Simulator', href: '/simulator' },
            { label: 'Chat AI', href: '/chat' },
          ].map(item => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[12px] font-black px-3 py-1.5 border-[2px] border-black transition-all"
              style={item.label === 'Simulator'
                ? { backgroundColor: '#113826', color: 'white', boxShadow: '3px 3px 0px #000000' }
                : { backgroundColor: 'white', color: '#000' }
              }
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div
          className="flex items-center gap-2 border-[3px] border-black px-3 py-1.5 text-[12px] font-black"
          style={{ backgroundColor: 'white', boxShadow: '3px 3px 0px #000000' }}
        >
          <div className="w-5 h-5 border-[2px] border-black flex items-center justify-center text-[9px] font-black text-white"
            style={{ backgroundColor: '#113826' }}>{patient?.name[0] || 'A'}</div>
          <span className="hidden sm:inline">{patient?.name || 'Guest'}</span>
        </div>
      </nav>

      {/* ── PAGE HEADER ──────────────────────────────────────────────────────── */}
      <div className="px-6 py-5 border-b-[3px] border-black flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ backgroundColor: '#F4F2E9' }}>
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-1">
            Dashboard › What-If Simulator
          </div>
          <h1 className="text-[28px] font-black text-black tracking-tight leading-tight">
            Simulate your <span style={{ color: '#2E7D52' }}>health future</span>
          </h1>
          <p className="text-[12px] font-bold text-black/50 mt-1">
            Adjust lifestyle variables. Your AI twin recalculates instantly.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 border-[3px] border-black px-3 py-2 text-[11px] font-black"
            style={{ backgroundColor: '#2E7D52', color: 'white', boxShadow: '3px 3px 0px #000000' }}
          >
            <div className="w-2 h-2 bg-[#7EC8A0]" style={{ animation: 'pulse 2s infinite' }} />
            Twin Active · {patient?.name.split(' ')[0] || 'User'}
          </div>
          <button
            onClick={() => { setCal(1800); setCarb(180); setSodium(1500); setExercise(4); runSimulation() }}
            className="border-[3px] border-black px-3 py-2 text-[11px] font-black bg-white transition-all"
            style={{ boxShadow: '3px 3px 0px #000000' }}
          >
            ↺ Reset All
          </button>
        </div>
      </div>

      {/* ── PRESET SCENARIOS ─────────────────────────────────────────────────── */}
      <div className="px-6 py-4 border-b-[3px] border-black flex items-center gap-3 overflow-x-auto" style={{ backgroundColor: '#EDE9DC' }}>
        <span className="text-[10px] font-black uppercase tracking-widest text-black/40 shrink-0">Presets ↓</span>
        {[
          { id: 'clean', icon: '🥗', name: 'Clean Living', desc: 'Diet + exercise + sleep' },
          { id: 'keto', icon: '🥩', name: 'Keto Protocol', desc: 'Low carb, high fat' },
          { id: 'stress', icon: '😰', name: 'High Stress', desc: 'Work overload, poor sleep' },
        ].map(p => (
          <button
            key={p.id}
            type="button"
            onClick={() => applyScenario(p.id)}
            className="border-[3px] border-black px-4 py-2.5 flex items-center gap-3 flex-shrink-0 text-left transition-all"
            style={{ backgroundColor: 'white', boxShadow: '4px 4px 0px #000000' }}
          >
            <span className="text-xl">{p.icon}</span>
            <div>
              <div className="text-[12px] font-black text-black">{p.name}</div>
              <div className="text-[10px] font-bold text-black/50">{p.desc}</div>
            </div>
          </button>
        ))}
      </div>

      {/* ── MAIN 3-COL LAYOUT ────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-[260px_1fr_300px]">

        {/* ── LEFT: CONTROLS ───────────────────────────────────────────────── */}
        <div
          className="border-r-[3px] border-black p-5 flex flex-col gap-2 overflow-y-auto"
          style={{ backgroundColor: '#F4F2E9' }}
        >
          {/* Diet section */}
          <div className="mb-2">
            <span className={SECTION_LABEL}>Diet & Nutrition</span>
            <NeoSlider label="Daily Calories" value={cal} min={1200} max={3500} unit=" kcal" onChange={setCal} />
            <NeoSlider label="Carb Intake" value={carb} min={20} max={400} unit="g" onChange={setCarb} />
            <NeoSlider label="Sodium" value={sodium} min={500} max={5000} unit="mg" onChange={setSodium} warn={sodium > 2400} />
          </div>

          {/* Activity section */}
          <div className="mb-2 pt-2 border-t-[2px] border-black/10">
            <span className={SECTION_LABEL}>Activity</span>
            <NeoToggleGroup
              label="Exercise / Week"
              options={[
                { val: 0, label: 'None' },
                { val: 2, label: '2×' },
                { val: 4, label: '4×' },
                { val: 7, label: 'Daily' },
              ]}
              value={exercise}
              onChange={v => setExercise(v as number)}
            />
            <NeoSlider label="Sleep" value={sleep} min={4} max={10} step={0.5} unit="h" onChange={setSleep} />
            <NeoSlider label="Stress Level" value={stress} min={1} max={10} unit="/10" onChange={setStress} warn={stress > 7} />
          </div>

          {/* Lifestyle toggles */}
          <div className="mb-2 pt-2 border-t-[2px] border-black/10">
            <span className={SECTION_LABEL}>Lifestyle</span>
            <NeoSwitch label="Smoker" value={isSmoker} onChange={setIsSmoker} danger />
            <NeoSwitch label="Medication" value={isMeds} onChange={setIsMeds} />
          </div>

          {/* Run button */}
          <motion.button
            whileHover={{ boxShadow: '6px 6px 0px #000000', x: -1, y: -1 }}
            onClick={runSimulation}
            disabled={isSimulating}
            type="button"
            className="w-full border-[3px] border-black py-4 text-[14px] font-black mt-2 disabled:opacity-50 disabled:cursor-wait transition-all"
            style={{ backgroundColor: '#C9A84C', boxShadow: '4px 4px 0px #000000' }}
          >
            {isSimulating ? '⟳ Recalculating...' : 'Run Simulation →'}
          </motion.button>
        </div>

        {/* ── CENTER: BODY SCANNER ─────────────────────────────────────────── */}
        <div
          className="flex flex-col border-r-[3px] border-black"
          style={{ backgroundColor: '#113826' }}
        >
          {/* Timeline bar */}
          <div className="px-5 py-3 border-b-[3px] border-black flex items-center justify-between" style={{ borderColor: 'rgba(244,242,233,0.2)' }}>
            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'rgba(244,242,233,0.5)' }}>
              Comparison Mode
            </span>
            <div className="flex gap-1.5">
              {['1M', '3M', '6M', '1Y'].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setTimeline(m)}
                  className="px-2.5 py-1 text-[10px] font-black border-[2px] transition-all"
                  style={timeline === m
                    ? { backgroundColor: '#C9A84C', color: '#000', borderColor: '#000', boxShadow: '2px 2px 0px #000' }
                    : { backgroundColor: 'transparent', color: 'rgba(244,242,233,0.6)', borderColor: 'rgba(244,242,233,0.3)' }
                  }
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Body canvas */}
          <div className="flex-1 relative flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4 p-6 overflow-hidden">
            {/* CSS grid texture on green */}
            <div
              className="absolute inset-0 pointer-events-none animate-grid-drift"
              style={{
                backgroundImage: `repeating-linear-gradient(0deg,rgba(244,242,233,0.04) 0px,rgba(244,242,233,0.04) 1px,transparent 1px,transparent 48px),repeating-linear-gradient(90deg,rgba(244,242,233,0.04) 0px,rgba(244,242,233,0.04) 1px,transparent 1px,transparent 48px)`
              }}
            />

            {/* Baseline */}
            <div className="flex flex-col items-center gap-4 flex-1 relative z-10">
              <div
                className="text-[9px] font-black uppercase tracking-widest px-3 py-1 border-[2px]"
                style={{ borderColor: 'rgba(244,242,233,0.4)', color: 'rgba(244,242,233,0.6)', backgroundColor: 'transparent' }}
              >
                BASELINE
              </div>
              <SimulatorBody type="baseline" vitals={baseline.vitals} />
            </div>

            {/* VS divider */}
            <div className="flex md:flex-col items-center gap-2 shrink-0 relative z-10">
              <div className="h-[2px] w-12 md:w-[2px] md:h-16" style={{ backgroundColor: 'rgba(244,242,233,0.3)' }} />
              <div
                className="w-9 h-9 border-[3px] border-black flex items-center justify-center text-[11px] font-black"
                style={{ backgroundColor: '#C9A84C', color: '#000', boxShadow: '2px 2px 0px #000' }}
              >VS</div>
              <div className="h-[2px] w-12 md:w-[2px] md:h-16" style={{ backgroundColor: 'rgba(244,242,233,0.3)' }} />
            </div>

            {/* Simulated */}
            <div className="flex flex-col items-center gap-4 flex-1 relative z-10">
              <div
                className="text-[9px] font-black uppercase tracking-widest px-3 py-1 border-[2px]"
                style={{ borderColor: '#C9A84C', color: '#C9A84C', backgroundColor: 'transparent' }}
              >
                SIMULATED · {timeline}
              </div>
              <AnimatePresence mode="wait">
                {!isSimulating ? (
                  <motion.div key="sim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <SimulatorBody type="simulated" vitals={sim.vitals} />
                  </motion.div>
                ) : (
                  <div key="loader" className="h-[310px] w-[180px] flex flex-col items-center justify-center gap-3">
                    <div
                      className="text-[10px] font-black uppercase tracking-widest"
                      style={{ color: 'rgba(244,242,233,0.5)' }}
                    >
                      Recalculating
                    </div>
                    <motion.div
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
                      className="w-12 h-12 border-[3px]"
                      style={{ borderColor: '#C9A84C' }}
                    />
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ── RIGHT: RESULTS ───────────────────────────────────────────────── */}
        <div
          className="p-5 flex flex-col gap-4 overflow-y-auto"
          style={{ backgroundColor: '#F4F2E9' }}
        >
          <span className={SECTION_LABEL}>Risk Score Shift</span>

          {/* Risk bars */}
          <div className="flex flex-col gap-3">
            <RiskGauge
              label="Diabetes" icon="🩸"
              currentScore={sim.risks.diabetes} baselineScore={baseline.risks.diabetes}
              unit="mg/dL" status={sim.risks.diabetes < 30 ? 'LOW RISK' : 'MODERATE'} color="#2E7D52"
            />
            <RiskGauge
              label="Cardiac" icon="❤️"
              currentScore={sim.risks.cardiac} baselineScore={baseline.risks.cardiac}
              unit="bpm" status={sim.risks.cardiac < 45 ? 'MODERATE' : 'HIGH'} color="#C9A84C"
            />
            <RiskGauge
              label="Hypertension" icon="🫀"
              currentScore={sim.risks.hypertension} baselineScore={baseline.risks.hypertension}
              unit="mmHg" status={sim.risks.hypertension < 30 ? 'CONTROLLED' : 'MODERATE'} color="#2E7D52"
            />
          </div>

          {/* Overall score change */}
          <div
            className="border-[3px] border-black p-4 flex items-center gap-4"
            style={{ backgroundColor: 'white', boxShadow: '4px 4px 0px #000000' }}
          >
            <div className="text-center shrink-0">
              <div className="text-[10px] font-black text-black/40 line-through font-mono">{baseline.score}</div>
              <div className="text-[42px] font-black leading-none text-black font-mono">{sim.score}</div>
              <div className="text-[9px] font-black uppercase tracking-widest text-black/40 mt-0.5">Twin Score</div>
            </div>
            <div>
              <div
                className="text-[13px] font-black"
                style={{ color: scoreDelta >= 0 ? '#2E7D52' : '#E07A5F' }}
              >
                {scoreDelta >= 0 ? '+' : ''}{scoreDelta}pt change
              </div>
              <div className="text-[10px] font-bold text-black/50 leading-relaxed mt-1">
                Projected improvement based on lifestyle variables.
              </div>
            </div>
          </div>

          {/* AI Insight card */}
          <div
            className="border-[3px] border-black p-4 relative"
            style={{ backgroundColor: '#113826', boxShadow: '4px 4px 0px #000000' }}
          >
            <div className="text-[9px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: '#C9A84C' }}>
              ✦ AI Twin Insight
            </div>
            <div className="flex flex-col gap-2.5">
              <div
                className="text-[11px] font-bold leading-relaxed pl-3"
                style={{ color: 'rgba(244,242,233,0.8)', borderLeft: '2px solid #C9A84C' }}
              >
                Reducing sodium to <b className="text-white">1,500mg</b> has the highest BP impact for {patient?.name.split(' ')[0] || 'your'} profile.
              </div>
              <div
                className="text-[11px] font-bold leading-relaxed pl-3"
                style={{ color: 'rgba(244,242,233,0.8)', borderLeft: '2px solid #C9A84C' }}
              >
                Glucose normalizes within <b className="text-white">3 weeks</b> on this carb-restricted protocol.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── STATUS BAR ───────────────────────────────────────────────────────── */}
      <div
        className="border-t-[3px] border-black px-6 py-2.5 flex items-center justify-between text-[10px] font-black"
        style={{ backgroundColor: '#113826', color: 'rgba(244,242,233,0.5)' }}
      >
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 inline-block" style={{ backgroundColor: '#7EC8A0' }} />
            <b style={{ color: 'rgba(244,242,233,0.8)' }}>Live Compute</b>
          </span>
          <span className="hidden sm:inline">Engine: <b style={{ color: 'rgba(244,242,233,0.8)' }}>VitaTwin V1.4</b></span>
        </div>
        <span className="text-[9px] opacity-40 italic">Clinical Digital Twin • Neobrutalist Edition</span>
      </div>

    </div>
  )
}
