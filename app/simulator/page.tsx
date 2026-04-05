'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SimulatorBody } from '@/components/Simulator/SimulatorBody'
import { RiskGauge } from '@/components/Simulator/RiskGauge'
import Link from 'next/link'
import { usePatientStore } from '@/store/patientStore'
import { useTranslation } from '@/hooks/useTranslation'
import { AnyPatientInput, AnalyzeResponse, PatientInput, AthleteInput, Compound } from '@/types/patient'
import { Topbar } from '@/components/Layout/Topbar'
import { CompoundLogForm } from '@/components/Form/CompoundLogForm'
import { Zap, Info, Loader2 } from 'lucide-react'

const getScore = (val: any): number => typeof val === 'number' ? val : (val?.score ?? 0)

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
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute w-full opacity-0 cursor-pointer h-5 z-10"
        />
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

  const { patient, analysis, mode, setMode, setSimulation, setLoading, loadingSimulate } = usePatientStore()
  const { t } = useTranslation()

  const [simAlt, setSimAlt] = useState(40)
  const [simHematocrit, setSimHematocrit] = useState(45)
  const [simCompounds, setSimCompounds] = useState<Compound[]>([])
  const [isPct, setIsPct] = useState(false)

  const baseline = useMemo(() => (analysis && patient) ? {
    vitals: {
      bp: `${patient.systolic_bp || 120}/${patient.diastolic_bp || 80}`,
      glucose: patient.glucose || 100,
      hr: 75,
      bmi: parseFloat((patient.weight / ((patient.height / 100) ** 2)).toFixed(1))
    },
    risks: {
      diabetes: getScore(analysis.risk_scores.diabetes),
      cardiac: getScore(analysis.risk_scores.cardiac),
      hypertension: getScore(analysis.risk_scores.hypertension),
      cardiovascular: getScore(analysis.risk_scores.cardiovascular || analysis.risk_scores.cardiac),
      hepatotoxicity: getScore(analysis.risk_scores.hepatotoxicity || 0),
      endocrine_suppression: getScore(analysis.risk_scores.endocrine_suppression || 0),
      hematological: getScore(analysis.risk_scores.hematological || 0)
    },
    score: analysis.risk_scores.overall_score || 72
  } : null, [analysis, patient])

  const [sim, setSim] = useState(baseline || { vitals: { bp: '0/0', glucose: 0, hr: 0, bmi: 0 }, risks: { diabetes: 0, cardiac: 0, hypertension: 0, cardiovascular: 0, hepatotoxicity: 0, endocrine_suppression: 0, hematological: 0 }, score: 0 })
  const [narrative, setNarrative] = useState<string | null>(null)

  useEffect(() => {
    if (baseline) setSim(baseline)
  }, [baseline])

  useEffect(() => {
    if (patient && !mode) {
      setMode(patient.mode || 'patient')
    }
  }, [patient, mode, setMode])

  const runSimulation = async () => {
    if (!baseline || !patient) return
    setIsSimulating(true)
    setLoading('simulate', true)

    try {
      let modifiedPatient: AnyPatientInput;
      if (mode === 'athlete') {
        modifiedPatient = {
          ...(patient as AthleteInput),
          mode: 'athlete',
          alt: simAlt,
          hematocrit: simHematocrit,
          compounds: simCompounds,
          pct_active: isPct
        }
      } else {
        modifiedPatient = {
          ...patient,
          mode: 'patient',
          weight: patient.weight - (exercise * 0.1),
          exercise: exercise >= 4 ? 'heavy' : exercise >= 2 ? 'moderate' : 'none',
          smoking: isSmoker,
          glucose: (patient.glucose || 100) - (carb < 100 ? 10 : 0),
          systolic_bp: (patient.systolic_bp || 120) - (isMeds ? 10 : 0) - (sodium < 2000 ? 5 : 0)
        }
      }

      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient: patient,
          scenario: 'custom',
          modifiedPatient: modifiedPatient
        })
      })

      if (!res.ok) throw new Error('Simulation failed')
      const data = await res.json()
      
      const pRisk = data.projected_risks
      if (mode === 'athlete') {
        setSim({
          vitals: { 
            bp: baseline.vitals.bp,
            glucose: baseline.vitals.glucose,
            hr: baseline.vitals.hr,
            bmi: baseline.vitals.bmi 
          },
          risks: { 
            cardiovascular: getScore(pRisk.cardiovascular), 
            hepatotoxicity: getScore(pRisk.hepatotoxicity), 
            endocrine_suppression: getScore(pRisk.endocrine_suppression),
            hematological: getScore(pRisk.hematological)
          } as any,
          score: Math.round(pRisk.overall_score || baseline.score)
        })
      } else {
        setSim({
          vitals: { 
            bp: `${Math.round((modifiedPatient as PatientInput).systolic_bp || 120)}/${Math.round(patient.diastolic_bp || 80)}`, 
            glucose: Math.round((modifiedPatient as PatientInput).glucose || 100), 
            hr: 72, 
            bmi: baseline.vitals.bmi 
          },
          risks: { 
            diabetes: getScore(pRisk.diabetes), 
            cardiac: getScore(pRisk.cardiac), 
            hypertension: getScore(pRisk.hypertension) 
          } as any,
          score: Math.round(pRisk.overall_score || baseline.score + 5)
        })
      }
      setNarrative(data.narrative)
      setSimulation(data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSimulating(false)
      setLoading('simulate', false)
    }
  }

  const applyScenario = (type: string) => {
    if (type === 'clean') { setCal(1800); setCarb(120); setSodium(1500); setExercise(5); setSleep(8); setStress(2); setIsSmoker(false) }
    else if (type === 'keto') { setCal(2000); setCarb(40); setSodium(2000); setExercise(4); setSleep(7.5) }
    else if (type === 'stress') { setCal(2500); setCarb(300); setSodium(3500); setExercise(0); setSleep(4); setStress(9) }
  }

  useEffect(() => { runSimulation() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!patient || !analysis || !baseline) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F4F2E9', fontFamily: 'Inter, sans-serif' }}>
        <Topbar />
        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
          <div className="w-24 h-24 border-[4px] border-black flex items-center justify-center text-[40px] mb-8 shadow-[8px_8px_0px_#000]"
            style={{ backgroundColor: '#F7EDD0' }}>
            ⚡
          </div>
          <h1 className="text-[32px] font-black uppercase tracking-tighter mb-4">{t.simulator.locked}</h1>
          <p className="max-w-md text-[14px] font-bold leading-relaxed mb-10 text-black/50">
            {t.simulator.lockedDesc}
          </p>
          <Link href="/onboarding" 
            className="px-10 py-5 border-[4px] border-black bg-[#1B5E3B] text-white font-black text-[18px] uppercase tracking-widest shadow-[8px_8px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center">
            {t.chat.initTwin} &rarr;
          </Link>
        </div>
      </div>
    )
  }

  const scoreDelta = sim.score - (baseline?.score || 0)

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F4F2E9', fontFamily: 'Inter, system-ui, sans-serif' }}>

      <Topbar />

      <div className="px-6 py-5 border-b-[3px] border-black flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ backgroundColor: '#F4F2E9' }}>
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-1">
            Dashboard › What-If Simulator
          </div>
          <h1 className="text-[28px] font-black text-black tracking-tight leading-tight">
             {t.simulator.title.split('health future')[0]} <span style={{ color: '#2E7D52' }}>{t.simulator.title.includes('health future') ? 'health future' : ''}</span>
          </h1>
          <p className="text-[12px] font-bold text-black/50 mt-1">
            {t.simulator.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border-[3px] border-black px-3 py-2 text-[11px] font-black"
            style={{ backgroundColor: '#2E7D52', color: 'white', boxShadow: '3px 3px 0px #000000' }}>
            <div className="w-2 h-2 bg-[#7EC8A0] animate-pulse" />
            Twin Active · {patient.name?.split(' ')[0]}
          </div>
          <button onClick={() => { setCal(1800); setCarb(180); setSodium(1500); setExercise(4); runSimulation() }}
            className="border-[3px] border-black px-3 py-2 text-[11px] font-black bg-white transition-all shadow-[3px_3px_0px_#000000]">
            ↺ {t.simulator.reset}
          </button>
        </div>
      </div>

      <div className="px-6 py-4 border-b-[3px] border-black flex items-center gap-3 overflow-x-auto" style={{ backgroundColor: '#EDE9DC' }}>
        <span className="text-[10px] font-black uppercase tracking-widest text-black/40 shrink-0">{t.simulator.presets} ↓</span>
        {[
          { id: 'clean', icon: '🥗', name: t.simulator.cleanLiving, desc: 'Diet + exercise + sleep' },
          { id: 'keto', icon: '🥩', name: t.simulator.keto, desc: 'Low carb, high fat' },
          { id: 'stress', icon: '😰', name: t.simulator.stress, desc: 'Work overload, poor sleep' },
        ].map(p => (
          <button key={p.id} type="button" onClick={() => applyScenario(p.id)}
            className="border-[3px] border-black px-4 py-2.5 flex items-center gap-3 flex-shrink-0 text-left transition-all bg-white shadow-[4px_4px_0px_#000000]">
            <span className="text-xl">{p.icon}</span>
            <div>
              <div className="text-[12px] font-black text-black">{p.name}</div>
              <div className="text-[10px] font-bold text-black/50">{p.desc}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-[320px_1fr_300px]">

        <div className="border-r-[3px] border-black p-5 flex flex-col gap-2 overflow-y-auto bg-[#F4F2E9]">
          {mode === 'patient' ? (
            <>
              <div className="mb-2">
                <span className={SECTION_LABEL}>{t.simulator.diet}</span>
                <NeoSlider label="Daily Calories" value={cal} min={1200} max={3500} unit=" kcal" onChange={setCal} />
                <NeoSlider label="Carb Intake" value={carb} min={20} max={400} unit="g" onChange={setCarb} />
                <NeoSlider label="Sodium" value={sodium} min={500} max={5000} unit="mg" onChange={setSodium} warn={sodium > 2400} />
              </div>
              <div className="mb-2 pt-2 border-t-[2px] border-black/10">
                <span className={SECTION_LABEL}>{t.simulator.activity}</span>
                <NeoToggleGroup label="Exercise / Week" options={[{ val: 0, label: 'None' }, { val: 2, label: '2×' }, { val: 4, label: '4×' }, { val: 7, label: 'Daily' }]} value={exercise} onChange={v => setExercise(v as number)} />
                <NeoSlider label="Sleep" value={sleep} min={4} max={10} step={0.5} unit="h" onChange={setSleep} />
                <NeoSlider label="Stress Level" value={stress} min={1} max={10} unit="/10" onChange={setStress} warn={stress > 7} />
              </div>
              <div className="mb-2 pt-2 border-t-[2px] border-black/10">
                <span className={SECTION_LABEL}>Lifestyle</span>
                <NeoSwitch label="Smoker" value={isSmoker} onChange={setIsSmoker} danger />
                <NeoSwitch label="Medication" value={isMeds} onChange={setIsMeds} />
              </div>
            </>
          ) : (
            <div className="mb-2">
              <span className={SECTION_LABEL}>Performance Protocol</span>
              <div className="bg-white border-[2.5px] border-black p-3 mb-4 shadow-[3px_3px_0px_#000]">
                <div className="text-[11px] font-black uppercase mb-3 flex items-center gap-2">
                  <Zap className="w-3 h-3 text-[#C9A84C]" /> Compound Log
                </div>
                <CompoundLogForm compounds={simCompounds} setCompounds={setSimCompounds} />
              </div>
              <NeoSlider label="Liver Stress (ALT)" value={simAlt} min={10} max={200} unit=" U/L" onChange={setSimAlt} warn={simAlt > 50} />
              <NeoSlider label="Hematocrit" value={simHematocrit} min={35} max={65} unit="%" onChange={setSimHematocrit} warn={simHematocrit > 52} />
              <div className="pt-2 border-t-[2px] border-black/10">
                <NeoSwitch label="Active PCT Mode" value={isPct} onChange={setIsPct} />
              </div>
            </div>
          )}

          <motion.button onClick={runSimulation} disabled={loadingSimulate} type="button"
            className="w-full border-[3px] border-black py-4 text-[14px] font-black mt-2 bg-gold text-black uppercase shadow-[4px_4px_0px_#000000] disabled:opacity-50">
            {loadingSimulate ? '⟳ Recalculating...' : (t.simulator.run || 'Run Simulation →')}
          </motion.button>
        </div>

        <div className="flex flex-col border-r-[3px] border-black bg-[#113826]">
          <div className="px-5 py-3 border-b-[3px] border-black flex items-center justify-between" style={{ borderColor: 'rgba(244,242,233,0.2)' }}>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#F4F2E9]/50">Comparison Mode</span>
            <div className="flex gap-1.5">
              {['1M', '3M', '6M', '1Y'].map(m => (
                <button key={m} type="button" onClick={() => setTimeline(m)} className="px-2.5 py-1 text-[10px] font-black border-[2px] transition-all"
                  style={timeline === m ? { backgroundColor: '#C9A84C', color: '#000', borderColor: '#000', boxShadow: '2px 2px 0px #000' } : { backgroundColor: 'transparent', color: '#F4F2E9/60', borderColor: '#F4F2E9/30' }}>{m}</button>
              ))}
            </div>
          </div>

          <div className="flex-1 relative flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4 p-6 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `repeating-linear-gradient(0deg,rgba(244,242,233,0.04) 0px,rgba(244,242,233,0.04) 1px,transparent 1px,transparent 48px),repeating-linear-gradient(90deg,rgba(244,242,233,0.04) 0px,rgba(244,242,233,0.04) 1px,transparent 1px,transparent 48px)` }} />
            <div className="flex flex-col items-center gap-4 flex-1 relative z-10">
              <div className="text-[9px] font-black uppercase tracking-widest px-3 py-1 border-[2px] border-[#F4F2E9]/40 text-[#F4F2E9]/60">BASELINE</div>
              <SimulatorBody type="baseline" vitals={baseline.vitals} />
            </div>
            <div className="flex md:flex-col items-center gap-2 shrink-0 relative z-10">
              <div className="h-[2px] w-12 md:w-[2px] md:h-16 bg-[#F4F2E9]/30" />
              <div className="w-9 h-9 border-[3px] border-black flex items-center justify-center text-[11px] font-black bg-[#C9A84C] text-black shadow-[2px_2px_0px_#000]">VS</div>
              <div className="h-[2px] w-12 md:w-[2px] md:h-16 bg-[#F4F2E9]/30" />
            </div>
            <div className="flex flex-col items-center gap-4 flex-1 relative z-10">
              <div className="text-[9px] font-black uppercase tracking-widest px-3 py-1 border-[2px] border-[#C9A84C] text-[#C9A84C]">SIMULATED · {timeline}</div>
              <AnimatePresence mode="wait">
                {!isSimulating ? (
                  <motion.div key="sim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <SimulatorBody type="simulated" vitals={sim.vitals} />
                  </motion.div>
                ) : (
                  <div key="loader" className="h-[310px] w-[180px] flex flex-col items-center justify-center gap-3">
                    <div className="text-[10px] font-black uppercase tracking-widest text-[#F4F2E9]/50">Recalculating</div>
                    <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.5, repeat: Infinity }} className="w-12 h-12 border-[3px] border-[#C9A84C]" />
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-4 overflow-y-auto bg-[#F4F2E9]">
          <span className={SECTION_LABEL}>Risk Score Shift</span>
          <div className="flex flex-col gap-3">
            {mode === 'patient' ? (
              <>
                <RiskGauge label="Diabetes" icon="🩸" currentScore={sim.risks.diabetes} baselineScore={baseline.risks.diabetes} unit="%" status={sim.risks.diabetes < 30 ? 'LOW RISK' : 'MODERATE'} color="#2E7D52" />
                <RiskGauge label="Cardiac" icon="❤️" currentScore={sim.risks.cardiac} baselineScore={baseline.risks.cardiac} unit="%" status={sim.risks.cardiac < 45 ? 'MODERATE' : 'HIGH'} color="#C9A84C" />
                <RiskGauge label="Hypertension" icon="🫀" currentScore={sim.risks.hypertension} baselineScore={baseline.risks.hypertension} unit="%" status={sim.risks.hypertension < 30 ? 'CONTROLLED' : 'MODERATE'} color="#2E7D52" />
              </>
            ) : (
              <>
                <RiskGauge label="Hepatotoxicity" icon="🧪" currentScore={sim.risks.hepatotoxicity} baselineScore={baseline.risks.hepatotoxicity} unit="%" status={sim.risks.hepatotoxicity < 30 ? 'NORMAL' : 'ELELVATED'} color="#E07A5F" />
                <RiskGauge label="Endocrine Suppression" icon="⚖️" currentScore={sim.risks.endocrine_suppression} baselineScore={baseline.risks.endocrine_suppression} unit="%" status={sim.risks.endocrine_suppression < 40 ? 'STABLE' : 'CRITICAL'} color="#C9A84C" />
                <RiskGauge label="Cardiovascular" icon="❤️" currentScore={sim.risks.cardiovascular} baselineScore={baseline.risks.cardiovascular} unit="%" status={sim.risks.cardiovascular < 30 ? 'MODERATE' : 'HIGH'} color="#2E7D52" />
                <RiskGauge label="Hematological" icon="🩸" currentScore={sim.risks.hematological} baselineScore={baseline.risks.hematological} unit="%" status={sim.risks.hematological < 30 ? 'NORMAL' : 'STRESSED'} color="#113826" />
              </>
            )}
          </div>

          <div className="border-[3px] border-black p-4 flex items-center gap-4 bg-white shadow-[4px_4px_0px_#000000]">
            <div className="text-center shrink-0">
              <div className="text-[10px] font-black text-black/40 line-through font-mono">{baseline.score}</div>
              <div className="text-[42px] font-black leading-none text-black font-mono">{sim.score}</div>
              <div className="text-[9px] font-black uppercase tracking-widest text-black/40 mt-0.5">Twin Score</div>
            </div>
            <div>
              <div className="text-[13px] font-black" style={{ color: scoreDelta >= 0 ? '#2E7D52' : '#E07A5F' }}>{scoreDelta >= 0 ? '+' : ''}{scoreDelta}pt change</div>
              <div className="text-[10px] font-bold text-black/50 mt-1 uppercase">Projected improvement</div>
            </div>
          </div>

          <div className="border-[3px] border-black p-4 bg-[#113826] shadow-[4px_4px_0px_#000000]">
            <div className="text-[9px] font-black uppercase tracking-[0.2em] mb-3 text-[#C9A84C]">✦ AI Twin Insight</div>
            <div className="flex flex-col gap-2.5">
              {narrative ? (
                 <div className="text-[11px] font-bold leading-relaxed pl-3 whitespace-pre-wrap text-[#F4F2E9]/80 border-l-[2px] border-[#C9A84C]">{narrative}</div>
              ) : (
                <div className="text-[11px] font-bold text-white/40 animate-pulse">Waiting for simulation narrative...</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t-[3px] border-black px-6 py-2.5 flex items-center justify-between text-[10px] font-black bg-[#113826] text-[#F4F2E9]/50">
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2" style={{ backgroundColor: '#7EC8A0' }} />
            <b>Live Compute</b>
          </span>
          <span className="hidden sm:inline">Engine: <b>VitaTwin V1.4</b></span>
        </div>
        <span className="text-[9px] opacity-40 italic">Clinical Digital Twin V2.0</span>
      </div>
    </div>
  )
}
