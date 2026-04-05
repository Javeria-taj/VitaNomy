'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { usePatientStore } from '@/store/patientStore'
import { PatientInput, AthleteInput, Compound } from '@/types/patient'
import { CompoundLogForm } from './CompoundLogForm'

// ─── Style Tokens ─────────────────────────────────────────────────────────────
const INPUT_BASE = "w-full bg-white rounded-lg border-[3px] border-black px-4 py-3 text-[14px] font-semibold text-black placeholder:text-black/30 outline-none transition-all"
const BTN_PRIMARY = "w-full flex items-center justify-between rounded-xl border-[3px] border-black px-6 py-4 text-[15px] font-black transition-all"
const BTN_BACK = "flex items-center gap-2 rounded-xl border-[3px] border-black px-5 py-4 text-[14px] font-black text-black bg-white transition-all shadow-[4px_4px_0px_#000]"
const CARD_INACTIVE = "border-[3px] border-black rounded-xl cursor-pointer transition-all bg-white text-black shadow-[5px_5px_0px_#000]"
const CARD_ACTIVE_BG = "#113826"

interface PatientFormProps {
  mode: 'patient' | 'athlete'
}

export function PatientForm({ mode }: PatientFormProps) {
  const router = useRouter()
  const { setPatient, setAnalysis, setLoading, loadingAnalyze, setError, error } = usePatientStore()

  const [step, setStep] = useState(1)
  
  // State
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [age, setAge] = useState('32')
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male')
  const [weight, setWeight] = useState('75')
  const [height, setHeight] = useState('175')
  
  // Clinical
  const [systolic, setSystolic] = useState('120')
  const [diastolic, setDiastolic] = useState('80')
  const [glucose, setGlucose] = useState('95')
  const [cholesterol, setCholesterol] = useState('190')

  // Athlete Specific
  const [compounds, setCompounds] = useState<Compound[]>([])
  const [alt, setAlt] = useState('')
  const [ast, setAst] = useState('')
  const [hematocrit, setHematocrit] = useState('')
  const [testoTotal, setTestoTotal] = useState('')

  // Lifestyle
  const [activity, setActivity] = useState('Moderate')
  const [smoking, setSmoking] = useState(false)
  const [stressLevel, setStressLevel] = useState('3')
  
  const handleComplete = async () => {
    setLoading('analyze', true)
    setError(null)

    const baseData = {
      name: `${firstName} ${lastName}`.trim() || 'Anonymous User',
      age: Number(age),
      gender,
      weight: Number(weight),
      height: Number(height),
      systolic_bp: Number(systolic),
      diastolic_bp: Number(diastolic),
      glucose: Number(glucose),
      cholesterol_total: Number(cholesterol),
      exercise: activity.toLowerCase() as any,
      smoking,
      stress_level: Number(stressLevel),
    }

    let finalData: PatientInput | AthleteInput;

    if (mode === 'athlete') {
      finalData = {
        ...baseData,
        mode: 'athlete',
        compounds,
        alt: alt ? Number(alt) : undefined,
        ast: ast ? Number(ast) : undefined,
        hematocrit: hematocrit ? Number(hematocrit) : undefined,
        testosterone_total: testoTotal ? Number(testoTotal) : undefined,
      } as AthleteInput
    } else {
      finalData = {
        ...baseData,
        mode: 'patient'
      } as PatientInput
    }

    try {
      setPatient(finalData)
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData)
      })

      if (!res.ok) throw new Error('Analysis failed')

      const result = await res.json()
      setAnalysis(result)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading('analyze', false)
    }
  }

  const hoverLift = (e: React.MouseEvent<HTMLElement>, shadow: string = '7px 7px 0px #000000') => {
    e.currentTarget.style.boxShadow = shadow
    e.currentTarget.style.transform = 'translate(-1px,-1px)'
  }
  const hoverReset = (e: React.MouseEvent<HTMLElement>, shadow: string = '5px 5px 0px #000000') => {
    e.currentTarget.style.boxShadow = shadow
    e.currentTarget.style.transform = 'translate(0,0)'
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        
        {/* STEP 1: DEMOGRAPHICS */}
        {step === 1 && (
          <motion.div key="st1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-5">
            <div>
              <div className="inline-block text-[11px] font-black uppercase tracking-widest px-3 py-1 border-[3px] border-black rounded-full mb-4" style={{ backgroundColor: '#C9A84C', boxShadow: '3px 3px 0px #000000' }}>Biometric Sync</div>
              <h2 className="text-4xl font-black text-black tracking-tight leading-tight">Patient<br />Demographics.</h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
               <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider">First Name</label>
                  <input className={INPUT_BASE} style={{ boxShadow: '3px 3px 0px #000' }} value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Rafi" />
               </div>
               <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider">Last Name</label>
                  <input className={INPUT_BASE} style={{ boxShadow: '3px 3px 0px #000' }} value={lastName} onChange={e => setLastName(e.target.value)} placeholder="S." />
               </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
               <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider">Age</label>
                  <input type="number" className={INPUT_BASE} style={{ boxShadow: '3px 3px 0px #000' }} value={age} onChange={e => setAge(e.target.value)} />
               </div>
               <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider">Height (cm)</label>
                  <input type="number" className={INPUT_BASE} style={{ boxShadow: '3px 3px 0px #000' }} value={height} onChange={e => setHeight(e.target.value)} />
               </div>
               <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider">Weight (kg)</label>
                  <input type="number" className={INPUT_BASE} style={{ boxShadow: '3px 3px 0px #000' }} value={weight} onChange={e => setWeight(e.target.value)} />
               </div>
            </div>

            <button onClick={() => setStep(2)} className={BTN_PRIMARY} style={{ backgroundColor: '#113826', color: 'white', boxShadow: '5px 5px 0px #000' }}
              onMouseEnter={e => hoverLift(e)} onMouseLeave={e => hoverReset(e)}>
              <span>Clinical Baseline</span> <span>→</span>
            </button>
          </motion.div>
        )}

        {/* STEP 2: CLINICAL VITALS */}
        {step === 2 && (
          <motion.div key="st2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-5">
            <div>
              <div className="inline-block text-[11px] font-black uppercase tracking-widest px-3 py-1 border-[3px] border-black rounded-full mb-4" style={{ backgroundColor: '#C9A84C', boxShadow: '3px 3px 0px #000000' }}>Vitals</div>
              <h2 className="text-4xl font-black text-black tracking-tight leading-tight">Clinical<br />Readings.</h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
               <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider">BP (Systolic)</label>
                  <input type="number" className={INPUT_BASE} style={{ boxShadow: '3px 3px 0px #000' }} value={systolic} onChange={e => setSystolic(e.target.value)} />
               </div>
               <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider">BP (Diastolic)</label>
                  <input type="number" className={INPUT_BASE} style={{ boxShadow: '3px 3px 0px #000' }} value={diastolic} onChange={e => setDiastolic(e.target.value)} />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
               <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider">Glucose (mg/dL)</label>
                  <input type="number" className={INPUT_BASE} style={{ boxShadow: '3px 3px 0px #000' }} value={glucose} onChange={e => setGlucose(e.target.value)} />
               </div>
               <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider">Cholesterol</label>
                  <input type="number" className={INPUT_BASE} style={{ boxShadow: '3px 3px 0px #000' }} value={cholesterol} onChange={e => setCholesterol(e.target.value)} />
               </div>
            </div>

            <div className="flex gap-3">
               <button onClick={() => setStep(1)} className={BTN_BACK}>← Back</button>
               <button onClick={() => setStep(3)} className={BTN_PRIMARY} style={{ backgroundColor: '#113826', color: 'white', boxShadow: '5px 5px 0px #000', flex: 1 }}
                 onMouseEnter={e => hoverLift(e)} onMouseLeave={e => hoverReset(e)}>
                 <span>{mode === 'athlete' ? 'Compound Logging' : 'Final Analysis'}</span> <span>→</span>
               </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: ATHLETE SPECIFIC OR LIFESTYLE */}
        {step === 3 && mode === 'athlete' && (
          <motion.div key="st3a" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
            <div>
              <div className="inline-block text-[11px] font-black uppercase tracking-widest px-3 py-1 border-[3px] border-black rounded-full mb-4" style={{ backgroundColor: '#FACC15', boxShadow: '3px 3px 0px #000000' }}>Performance</div>
              <h2 className="text-4xl font-black text-black tracking-tight leading-tight">Performance<br />Protocol.</h2>
            </div>

            {/* Biomarkers */}
            <div className="grid grid-cols-2 gap-3">
               <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider">ALT (Liver)</label>
                  <input type="number" className={INPUT_BASE} style={{ boxShadow: '3px 3px 0px #000' }} value={alt} onChange={e => setAlt(e.target.value)} placeholder="0" />
               </div>
               <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider">Hematocrit (%)</label>
                  <input type="number" className={INPUT_BASE} style={{ boxShadow: '3px 3px 0px #000' }} value={hematocrit} onChange={e => setHematocrit(e.target.value)} placeholder="45" />
               </div>
            </div>

            {/* Compound Log */}
            <div className="border-[3px] border-black p-4 bg-white shadow-[4px_4px_0px_#000]">
               <div className="text-[11px] font-black uppercase mb-3 flex items-center justify-between">
                  <span>Cycle Compounds</span>
                  <span className="text-black/40">{compounds.length} Active</span>
               </div>
               <CompoundLogForm compounds={compounds} setCompounds={setCompounds} />
            </div>

            <div className="flex gap-3">
               <button onClick={() => setStep(2)} className={BTN_BACK}>← Back</button>
               <button onClick={handleComplete} disabled={loadingAnalyze} className={BTN_PRIMARY} style={{ backgroundColor: '#C9A84C', color: 'black', boxShadow: '5px 5px 0px #000', flex: 1 }}
                 onMouseEnter={e => hoverLift(e)} onMouseLeave={e => hoverReset(e)}>
                 <span>{loadingAnalyze ? 'Processing Twin...' : 'Analyze Athlete Data'}</span> <span>→</span>
               </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3 (Patient) / STEP 4 (Athlete) SUMMARY/LIFESTYLE */}
        {( (step === 3 && mode === 'patient') ) && (
          <motion.div key="st3p" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-5">
             <div>
              <div className="inline-block text-[11px] font-black uppercase tracking-widest px-3 py-1 border-[3px] border-black rounded-full mb-4" style={{ backgroundColor: '#C9A84C', boxShadow: '3px 3px 0px #000000' }}>Lifestyle</div>
              <h2 className="text-4xl font-black text-black tracking-tight leading-tight">Optimization<br />Variables.</h2>
            </div>

            <div className="flex flex-col gap-2">
               <label className="text-[11px] font-black uppercase tracking-wider">Activity Level</label>
               <div className="flex flex-wrap gap-2">
                  {['None', 'Light', 'Moderate', 'Intense'].map(a => (
                    <button key={a} onClick={() => setActivity(a)} 
                      className="px-4 py-2 border-[2.5px] border-black font-black text-[12px] uppercase transition-all"
                      style={activity === a ? { backgroundColor: '#113826', color: 'white', boxShadow: '2px 2px 0px #000' } : { backgroundColor: 'white', color: '#000', boxShadow: '2px 2px 0px #000' }}>
                      {a}
                    </button>
                  ))}
               </div>
            </div>

            <div className="flex items-center gap-3 p-4 border-[3px] border-black bg-white shadow-[4px_4px_0px_#000]">
               <input type="checkbox" checked={smoking} onChange={() => setSmoking(!smoking)} className="w-5 h-5 border-[3px] border-black cursor-pointer" />
               <span className="text-[13px] font-black uppercase">Active Smoker</span>
            </div>

            <div className="flex flex-col gap-2 p-4 border-[3px] border-black bg-white shadow-[4px_4px_0px_#000]">
               <div className="flex justify-between items-center">
                  <label className="text-[11px] font-black uppercase tracking-wider">Baseline Stress Level</label>
                  <span className="text-[12px] font-black px-2 py-0.5 border-[2px] border-black bg-[#C9A84C]">{stressLevel}/10</span>
               </div>
               <input type="range" min="1" max="10" value={stressLevel} onChange={e => setStressLevel(e.target.value)} className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer accent-black" />
            </div>

            <div className="flex gap-3">
               <button onClick={() => setStep(2)} className={BTN_BACK}>← Back</button>
               <button onClick={handleComplete} disabled={loadingAnalyze} className={BTN_PRIMARY} style={{ backgroundColor: '#C9A84C', color: 'black', boxShadow: '5px 5px 0px #000', flex: 1 }}
                 onMouseEnter={e => hoverLift(e)} onMouseLeave={e => hoverReset(e)}>
                 <span>{loadingAnalyze ? 'Synthesizing...' : 'Build My Digital Twin'}</span> <span>🏁</span>
               </button>
            </div>
            {error && <div className="p-3 border-[2px] border-black bg-red-100 text-red-600 font-black text-[11px] uppercase shadow-[2px_2px_0px_#000]">{error}</div>}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
