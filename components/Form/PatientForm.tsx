'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { usePatientStore } from '@/store/patientStore'
import { PatientInput } from '@/types/patient'
import { MOCK_PATIENT_ANALYSIS } from '@/data/mockData'
import { ProgressBar } from '@/components/Form/ProgressBar'

// ─── Initial form state (matches PatientInput exactly) ────────────────────────
const INITIAL_STATE: PatientInput = {
  mode: 'patient',
  name: '',
  age: 0,
  gender: 'male',
  weight: 0,
  height: 0,
  systolic_bp: 0,
  diastolic_bp: 0,
  glucose: 0,
  cholesterol_total: 0,
  smoking: false,
  alcohol: 'none',
  exercise: 'none',
  family_history: false,
  existing_conditions: [],
  current_medications: [],
}


// ─── Reusable styled input component ─────────────────────────────────────────
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">{label}</label>
      {children}
      {hint && <span className="text-[11px] font-bold text-black/30 italic">{hint}</span>}
    </div>
  )
}

function TextInput({ value, onChange, placeholder, type = 'text' }: {
  value: string | number; onChange: (v: string) => void; placeholder?: string; type?: string
}) {
  return (
    <input
      type={type}
      value={value === 0 ? '' : value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full text-[14px] font-bold px-4 py-3 border-[3px] border-black rounded-none bg-white text-black outline-none transition-all placeholder:text-black/20 focus:shadow-[4px_4px_0px_#000000] focus:-translate-x-1 focus:-translate-y-1"
    />
  )
}

// ─── Chip selector: single select ────────────────────────────────────────────
function ChipSelect<T extends string>({ options, value, onChange }: {
  options: { value: T; label: string }[]; value: T; onChange: (v: T) => void
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`px-5 py-2.5 rounded-none text-[12px] font-black uppercase tracking-widest border-[3px] border-black transition-all ${
            value === opt.value
              ? 'bg-[#113826] text-white shadow-[4px_4px_0px_#000000] -translate-x-1 -translate-y-1'
              : 'bg-white text-black hover:bg-[#F4F2E9]'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

// ─── Toggle: boolean yes/no ───────────────────────────────────────────────────
function ToggleField({ value, onChange, yesLabel = 'Yes', noLabel = 'No' }: {
  value: boolean; onChange: (v: boolean) => void; yesLabel?: string; noLabel?: string
}) {
  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`flex-1 px-4 py-3 rounded-none text-[12px] font-black uppercase tracking-widest border-[3px] border-black transition-all ${
          value ? 'bg-[#C9A84C] text-black shadow-[4px_4px_0px_#000000] -translate-x-1 -translate-y-1' : 'bg-white text-black'
        }`}
      >
        {yesLabel}
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`flex-1 px-4 py-3 rounded-none text-[12px] font-black uppercase tracking-widest border-[3px] border-black transition-all ${
          !value ? 'bg-[#C9A84C] text-black shadow-[4px_4px_0px_#000000] -translate-x-1 -translate-y-1' : 'bg-white text-black'
        }`}
      >
        {noLabel}
      </button>
    </div>
  )
}

// ─── Computed BMI badge ────────────────────────────────────────────────────────
function BmiDisplay({ weight, height }: { weight: number; height: number }) {
  if (!weight || !height) return null
  const bmi = weight / ((height / 100) ** 2)
  const category =
    bmi < 18.5 ? { label: 'Underweight', color: 'text-blue-500' } :
    bmi < 25   ? { label: 'Normal',       color: 'text-sage' } :
    bmi < 30   ? { label: 'Overweight',   color: 'text-amber-500' } :
                 { label: 'Obese',        color: 'text-coral' }

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-bg-secondary border-[0.5px] border-border-tertiary rounded-lg">
      <span className="text-[12px] text-text-secondary">BMI</span>
      <span className={`text-[14px] font-medium tabular-nums ${category.color}`}>{bmi.toFixed(1)}</span>
      <span className={`text-[11px] font-medium ${category.color}`}>— {category.label}</span>
    </div>
  )
}

// ─── STEP PANELS ─────────────────────────────────────────────────────────────
function Step1({ data, update }: { data: PatientInput; update: (d: Partial<PatientInput>) => void }) {
  return (
    <div className="flex flex-col gap-5">
      <Field label="Full Name">
        <TextInput value={data.name} onChange={(v) => update({ name: v })} placeholder="e.g. Alex Morgan" />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Age" hint="Years">
          <TextInput type="number" value={data.age} onChange={(v) => update({ age: Number(v) })} placeholder="e.g. 45" />
        </Field>
        <Field label="Gender">
          <ChipSelect
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'other', label: 'Other' },
            ]}
            value={data.gender}
            onChange={(v) => update({ gender: v })}
          />
        </Field>
      </div>
    </div>
  )
}

function Step2({ data, update }: { data: PatientInput; update: (d: Partial<PatientInput>) => void }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Weight" hint="Kilograms (kg)">
          <TextInput type="number" value={data.weight} onChange={(v) => update({ weight: Number(v) })} placeholder="e.g. 82" />
        </Field>
        <Field label="Height" hint="Centimetres (cm)">
          <TextInput type="number" value={data.height} onChange={(v) => update({ height: Number(v) })} placeholder="e.g. 175" />
        </Field>
      </div>
      <BmiDisplay weight={data.weight} height={data.height} />
      <div className="bg-bg-secondary rounded-lg p-3 border-[0.5px] border-border-tertiary">
        <p className="text-[11px] text-text-secondary leading-relaxed">
          Your body metrics help VitaNomy calibrate your digital twin. Weight and height are used to compute BMI, a key factor in diabetes and hypertension risk scoring.
        </p>
      </div>
    </div>
  )
}

function Step3({ data, update }: { data: PatientInput; update: (d: Partial<PatientInput>) => void }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Systolic BP" hint="Upper number, mmHg (e.g. 120)">
          <TextInput type="number" value={data.systolic_bp} onChange={(v) => update({ systolic_bp: Number(v) })} placeholder="e.g. 138" />
        </Field>
        <Field label="Diastolic BP" hint="Lower number, mmHg (e.g. 80)">
          <TextInput type="number" value={data.diastolic_bp} onChange={(v) => update({ diastolic_bp: Number(v) })} placeholder="e.g. 88" />
        </Field>
      </div>
      {data.systolic_bp > 0 && data.diastolic_bp > 0 && (
        <div className={`text-[12px] px-3 py-1.5 rounded-md inline-flex items-center gap-2 font-medium ${
          data.systolic_bp >= 140 || data.diastolic_bp >= 90
            ? 'bg-red-50 text-red-600 border border-red-200'
            : data.systolic_bp >= 130 || data.diastolic_bp >= 80
            ? 'bg-amber-50 text-amber-600 border border-amber-200'
            : 'bg-green-50 text-green-600 border border-green-200'
        }`}>
          <div className="w-1.5 h-1.5 rounded-full bg-current" />
          {data.systolic_bp >= 140 || data.diastolic_bp >= 90
            ? 'Stage 2 Hypertension'
            : data.systolic_bp >= 130 || data.diastolic_bp >= 80
            ? 'Stage 1 Hypertension / Elevated'
            : 'Normal Range'}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Fasting Glucose" hint="mg/dL — taken after 8+ hrs fast">
          <TextInput type="number" value={data.glucose} onChange={(v) => update({ glucose: Number(v) })} placeholder="e.g. 118" />
        </Field>
        <Field label="Total Cholesterol" hint="mg/dL — full lipid panel">
          <TextInput type="number" value={data.cholesterol_total || 0} onChange={(v) => update({ cholesterol_total: Number(v) })} placeholder="e.g. 242" />
        </Field>
      </div>
    </div>
  )
}

function Step4({ data, update }: { data: PatientInput; update: (d: Partial<PatientInput>) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <Field label="Do you currently smoke?">
        <ToggleField value={data.smoking} onChange={(v) => update({ smoking: v })} yesLabel="Yes, I smoke" noLabel="No / Quit" />
      </Field>

      <Field label="Exercise Level" hint="How often do you exercise per week?">
        <ChipSelect
          options={[
            { value: 'none', label: '🛋 None' },
            { value: 'light', label: '🚶 Light' },
            { value: 'moderate', label: '🚴 Moderate' },
            { value: 'heavy', label: '🏋 Heavy' },
          ]}
          value={data.exercise}
          onChange={(v) => update({ exercise: v })}
        />
        <span className="text-[11px] text-text-secondary mt-1">
          Light = 1–2x/wk • Moderate = 3–4x/wk • Heavy = 5+ x/wk
        </span>
      </Field>

      <Field label="Family history of heart disease or diabetes?">
        <ToggleField
          value={data.family_history}
          onChange={(v) => update({ family_history: v })}
          yesLabel="Yes, family history"
          noLabel="No history"
        />
      </Field>
    </div>
  )
}

// ─── Validation per step ──────────────────────────────────────────────────────
function validate(step: number, data: PatientInput): string | null {
  if (step === 1) {
    if (!data.name.trim()) return 'Please enter your name.'
    if (!data.age || data.age < 1 || data.age > 120) return 'Please enter a valid age.'
  }
  if (step === 2) {
    if (!data.weight || data.weight < 20) return 'Please enter a valid weight (kg).'
    if (!data.height || data.height < 50) return 'Please enter a valid height (cm).'
  }
  if (step === 3) {
    if (!data.systolic_bp || data.systolic_bp < 60) return 'Please enter a valid systolic BP.'
    if (!data.diastolic_bp || data.diastolic_bp < 40) return 'Please enter a valid diastolic BP.'
    if (!data.glucose || data.glucose < 30) return 'Please enter a valid glucose reading.'
    if (!data.cholesterol_total || data.cholesterol_total < 50) return 'Please enter a valid cholesterol reading.'
  }
  return null
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function PatientForm() {
  const router = useRouter()
  const { setPatient, setAnalysis, setLoading, loadingAnalyze } = usePatientStore()
  const [step, setStep] = useState(1)
  const [data, setData] = useState<PatientInput>(INITIAL_STATE)
  const [error, setError] = useState<string | null>(null)
  const [direction, setDirection] = useState(1) // 1 = forward, -1 = backward

  const update = (partial: Partial<PatientInput>) => {
    setData((prev) => ({ ...prev, ...partial }))
    setError(null)
  }

  const goNext = () => {
    const err = validate(step, data)
    if (err) { setError(err); return }
    setDirection(1)
    setStep((s) => s + 1)
    setError(null)
  }

  const goBack = () => {
    setDirection(-1)
    setStep((s) => s - 1)
    setError(null)
  }

  const handleSubmit = async () => {
    setLoading('analyze', true)
    try {
      // Try the real API endpoint
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        const analysisResult = await res.json()
        setPatient(data)
        setAnalysis(analysisResult)
      } else {
        throw new Error('API unavailable')
      }
    } catch {
      // Fall back to mock data for demo/hackathon
      setPatient(data)
      setAnalysis(MOCK_PATIENT_ANALYSIS)
    } finally {
      setLoading('analyze', false)
      router.push('/dashboard')
    }
  }

  const steps: Record<number, React.ReactNode> = {
    1: <Step1 data={data} update={update} />,
    2: <Step2 data={data} update={update} />,
    3: <Step3 data={data} update={update} />,
    4: <Step4 data={data} update={update} />,
  }

  const stepTitles = {
    1: { title: 'Tell us about yourself', sub: 'Your identity powers gender-aware AI personalisation.' },
    2: { title: 'Body metrics', sub: 'Used to calculate BMI and calibrate your digital twin.' },
    3: { title: 'Vitals & lab results', sub: 'Enter your most recent readings. Use approximates if needed.' },
    4: { title: 'Lifestyle factors', sub: 'These have the highest impact on your long-term risk profile.' },
  }

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
  }

  return (
    <div className="p-7">
      {/* Progress Indicator */}
      <div className="mb-6">
        <ProgressBar currentStep={step} />
      </div>

      {/* Step Header */}
      <div className="mb-6">
        <h2 className="text-[18px] font-medium mb-1">{stepTitles[step as keyof typeof stepTitles].title}</h2>
        <p className="text-[13px] text-text-secondary">{stepTitles[step as keyof typeof stepTitles].sub}</p>
      </div>

      {/* Animated Step Content */}
      <div className="relative min-h-[220px] overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          >
            {steps[step]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-[12px] text-red-600 font-medium"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
          {error}
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center mt-7 pt-5 border-t-[0.5px] border-border-tertiary">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 1}
          className="text-[13px] text-text-secondary px-4 py-2 border-[0.5px] border-border-tertiary rounded-md bg-transparent hover:border-coral/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Back
        </button>

        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s === step ? 'w-5 bg-coral' : s < step ? 'w-1.5 bg-sage' : 'w-1.5 bg-border-tertiary'
              }`}
            />
          ))}
        </div>

        {step < 4 ? (
          <button
            type="button"
            onClick={goNext}
            className="text-[13px] text-white px-5 py-2.5 rounded-md bg-coral font-medium border-none shadow-sm hover:brightness-105 active:scale-95 transition-all"
          >
            Continue →
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loadingAnalyze}
            className="text-[13px] text-white px-5 py-2.5 rounded-md bg-coral font-medium border-none shadow-sm hover:brightness-105 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loadingAnalyze ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analysing...
              </>
            ) : (
              'Build My Twin →'
            )}
          </button>
        )}
      </div>
    </div>
  )
}
