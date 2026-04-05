'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { PatientForm } from '@/components/Form/PatientForm'
import { usePatientStore } from '@/store/patientStore'

// ─── Shared style constants ───────────────────────────────────────────────────
const INPUT_BASE = "w-full bg-white rounded-lg border-[3px] border-black px-4 py-3 text-[14px] font-semibold text-black placeholder:text-black/30 outline-none transition-all"
const BTN_PRIMARY = "w-full flex items-center justify-between rounded-xl border-[3px] border-black px-6 py-4 text-[15px] font-black text-white transition-all"
const BTN_BACK = "flex items-center gap-2 rounded-xl border-[3px] border-black px-5 py-4 text-[14px] font-black text-black bg-white transition-all"

// ─── Input with focus lift ────────────────────────────────────────────────────
function NeoInput({ type = 'text', placeholder, value, onChange }: {
  type?: string; placeholder?: string; value?: string | number; onChange?: (v: string) => void
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange?.(e.target.value)}
      className={INPUT_BASE}
      style={{ boxShadow: '3px 3px 0px #000000' }}
      onFocus={e => { e.target.style.boxShadow = '5px 5px 0px #000000'; e.target.style.transform = 'translate(-1px,-1px)' }}
      onBlur={e => { e.target.style.boxShadow = '3px 3px 0px #000000'; e.target.style.transform = 'translate(0,0)' }}
    />
  )
}

// ─── Step connector line ──────────────────────────────────────────────────────
function StepLine({ done }: { done: boolean }) {
  return (
    <div className="flex-1 mx-2 relative" style={{ height: 3 }}>
      <div className="absolute inset-0 border-t-[3px] border-black" />
      {done && <div className="absolute inset-0 border-t-[3px]" style={{ borderColor: '#113826' }} />}
    </div>
  )
}

// ─── Step circle ──────────────────────────────────────────────────────────────
function StepCircle({ num, state }: { num: number; state: 'done' | 'active' | 'pending' }) {
  const base = "w-9 h-9 rounded-full border-[3px] border-black flex items-center justify-center text-[13px] font-black flex-shrink-0 transition-all"
  if (state === 'done') return (
    <div className={base} style={{ backgroundColor: '#113826', color: 'white', boxShadow: '3px 3px 0px #000000' }}>✓</div>
  )
  if (state === 'active') return (
    <div className={base} style={{ backgroundColor: '#C9A84C', color: '#000', boxShadow: '3px 3px 0px #000000' }}>{num}</div>
  )
  return <div className={base} style={{ backgroundColor: 'white', color: '#000' }}>{num}</div>
}

// ─── Left Panel ───────────────────────────────────────────────────────────────
function LeftPanel() {
  const bars = [
    { label: 'Diabetes Risk', icon: '🩸', badge: 'Low Risk', badgeColor: '#7EC8A0', fill: '32%', fillColor: '#2E7D52' },
    { label: 'Cardiac Health', icon: '❤️', badge: 'Moderate', badgeColor: '#C9A84C', fill: '54%', fillColor: '#C9A84C' },
    { label: 'Hypertension', icon: '🫀', badge: 'Controlled', badgeColor: '#7EC8A0', fill: '28%', fillColor: '#2E7D52' },
  ]

  return (
    <div
      className="relative overflow-hidden flex flex-col justify-between p-10 lg:p-12 min-h-screen"
      style={{ backgroundColor: '#113826' }}
    >
      <div className="absolute inset-0 pointer-events-none animate-grid-drift" style={{
        backgroundImage: `repeating-linear-gradient(0deg,rgba(100,200,140,0.07) 0px,rgba(100,200,140,0.07) 1px,transparent 1px,transparent 48px),repeating-linear-gradient(90deg,rgba(100,200,140,0.07) 0px,rgba(100,200,140,0.07) 1px,transparent 1px,transparent 48px)`,
        opacity: 0.8
      }} />

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[50%] overflow-hidden pointer-events-none flex items-end justify-center"
        animate={{ y: [0, -12, 0], rotate: [-12, -10, -12] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 400 260" className="w-full max-w-[500px] opacity-[0.08]" style={{ transform: 'translateY(40px)' }} fill="none">
          <text x="0" y="220" fontSize="290" fontWeight="900" stroke="white" strokeWidth="8" fill="none" letterSpacing="-8" fontFamily="Inter, system-ui, sans-serif">VN</text>
        </svg>
      </motion.div>

      <div className="relative z-10">
        <div className="inline-block text-[20px] font-black tracking-tight px-3 py-1 rounded-lg border-[3px] border-black" style={{ backgroundColor: '#F4F2E9', color: '#113826', boxShadow: '4px 4px 0px #000000' }}>
          VitaNomy
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-8">
        <div>
          <h1 className="text-5xl font-black leading-[1.05] tracking-tight mb-3" style={{ color: '#F4F2E9' }}>
            Build your<br /><span style={{ color: '#C9A84C' }}>digital twin</span><br />today.
          </h1>
          <p className="text-[14px] font-bold" style={{ color: 'rgba(244,242,233,0.5)' }}>
            Setup takes under 2 minutes.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="text-[11px] font-black uppercase tracking-widest mb-1" style={{ color: 'rgba(244,242,233,0.4)' }}>Your twin will track</div>
          {bars.map((b) => (
            <div key={b.label} className="rounded-xl border-[3px] border-black p-4" style={{ backgroundColor: '#F4F2E9', boxShadow: '5px 5px 0px #000000' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="text-[13px] font-black text-black flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full border border-black animate-pulse-dot" style={{ backgroundColor: b.fillColor }} />
                  {b.label}
                </div>
                <div className="text-[10px] font-black px-2 py-0.5 rounded border-[2px] border-black" style={{ backgroundColor: b.badgeColor, color: '#000' }}>
                  {b.badge}
                </div>
              </div>
              <div className="w-full h-4 bg-white border-[2px] border-black rounded-sm overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: b.fill }} transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
                  className="h-full" style={{ backgroundColor: b.fillColor }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 text-[11px] font-bold tracking-widest uppercase" style={{ color: 'rgba(244,242,233,0.3)' }}>
        AI Health Intelligence Platform
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [regLoading, setRegLoading] = useState(false)
  const [regError, setRegError] = useState('')
  const { isAthlete, setIsAthlete, mode, setPatient } = usePatientStore()
  
  async function handleRegister() {
    setRegLoading(true)
    setRegError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `${firstName} ${lastName}`.trim(), email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setRegError(data.error || 'Registration failed.')
        setRegLoading(false)
        return
      }
      await signIn('credentials', { email, password, redirect: false })
      
      // Update store immediately so Topbar and Account know the name
      setPatient({
        name: `${firstName} ${lastName}`.trim(),
        age: 32,
        gender: 'male',
        weight: 75,
        height: 175,
        systolic_bp: 120,
        diastolic_bp: 80,
        glucose: 95,
        mode: isAthlete ? 'athlete' : 'patient',
        exercise: 'moderate',
        smoking: false,
        stress_level: 3
      } as any)

      setStep(2)
    } catch {
      setRegError('Network error. Please try again.')
    } finally {
      setRegLoading(false)
    }
  }

  const hoverLift = (e: React.MouseEvent<HTMLElement>, shadow: string) => {
    (e.currentTarget as HTMLElement).style.boxShadow = shadow;
    (e.currentTarget as HTMLElement).style.transform = 'translate(-1px,-1px)'
  }
  const hoverReset = (e: React.MouseEvent<HTMLElement>, shadow: string) => {
    (e.currentTarget as HTMLElement).style.boxShadow = shadow;
    (e.currentTarget as HTMLElement).style.transform = 'translate(0,0)'
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[5fr_7fr]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <LeftPanel />

      <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#F4F2E9' }}>
        <div className="flex items-center justify-between px-8 py-5 border-b-[3px] border-black">
          <Link href="/" className="text-[20px] font-black text-black tracking-tight hover:opacity-80 transition-opacity">
            VitaNomy
          </Link>
          <Link href="/login" className="text-[13px] font-black text-black hover:underline underline-offset-4 decoration-2 transition-all">
            Already have an account? Sign in →
          </Link>
        </div>

        {step < 4 && (
          <div className="flex items-center px-8 pt-6 pb-2 gap-1">
            {[
              { num: 1, label: 'Account' },
              { num: 2, label: 'Profile' },
              { num: 3, label: 'Preferences' },
            ].map((s, i) => (
              <React.Fragment key={s.num}>
                <div className="flex items-center gap-2">
                  <StepCircle num={s.num} state={step > s.num ? 'done' : step === s.num ? 'active' : 'pending'} />
                  <span className={`text-[12px] whitespace-nowrap font-black ${step === s.num ? 'text-black' : 'text-black/40'}`}>{s.label}</span>
                </div>
                {i < 2 && <StepLine done={step > s.num + 0} />}
              </React.Fragment>
            ))}
          </div>
        )}

        <div className="flex-1 flex items-center justify-center px-8 py-8">
          <div className="w-full max-w-md">
            <AnimatePresence mode="wait">

              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="flex flex-col gap-5">
                  <div>
                    <div className="inline-block text-[11px] font-black uppercase tracking-widest px-3 py-1 border-[3px] border-black rounded-full mb-4" style={{ backgroundColor: '#C9A84C', boxShadow: '3px 3px 0px #000000' }}>Step 1 of 3</div>
                    <h2 className="text-4xl font-black text-black tracking-tight leading-tight">Create your<br />account.</h2>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-black uppercase tracking-wider text-black">First name</label>
                      <NeoInput placeholder="Priya" value={firstName} onChange={setFirstName} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-black uppercase tracking-wider text-black">Last name</label>
                      <NeoInput placeholder="Sharma" value={lastName} onChange={setLastName} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-black uppercase tracking-wider text-black">Email address</label>
                    <NeoInput type="email" placeholder="priya@email.com" value={email} onChange={setEmail} />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-black uppercase tracking-wider text-black">Password</label>
                    <div className="relative">
                      <input
                        type={showPw ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Min. 8 characters"
                        className={INPUT_BASE + ' pr-16'}
                        style={{ boxShadow: '3px 3px 0px #000000' }}
                        onFocus={e => { e.target.style.boxShadow = '5px 5px 0px #000000'; e.target.style.transform = 'translate(-1px,-1px)' }}
                        onBlur={e => { e.target.style.boxShadow = '3px 3px 0px #000000'; e.target.style.transform = 'translate(0,0)' }}
                      />
                      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-black text-black/50 hover:text-black">
                      </button>
                    </div>
                  </div>

                  <div className="p-4 border-[3px] border-black rounded-xl bg-white shadow-[4px_4px_0px_#000] flex items-center justify-between pointer-events-auto cursor-pointer"
                    onClick={() => setIsAthlete(!isAthlete)}>
                    <div>
                      <div className="text-[12px] font-black uppercase tracking-tight">Performance Enhanced</div>
                      <div className="text-[10px] font-bold text-black/40">Are you an athlete using supplements?</div>
                    </div>
                    <div className={`w-12 h-6 rounded-full border-[2.5px] border-black relative transition-all ${isAthlete ? 'bg-[#113826]' : 'bg-white'}`}>
                      <motion.div 
                        animate={{ x: isAthlete ? 24 : 2 }}
                        className="absolute top-1 w-3 h-3 rounded-full bg-black"
                      />
                    </div>
                  </div>

                  {regError && (
                    <div className="text-[12px] font-black text-red-600 border-[2px] border-red-400 px-3 py-2 bg-red-50 rounded-lg">
                      {regError}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleRegister}
                    disabled={regLoading}
                    className={BTN_PRIMARY}
                    style={{ backgroundColor: '#113826', color: 'white', boxShadow: '5px 5px 0px #000000' }}
                    onMouseEnter={e => hoverLift(e, '7px 7px 0px #000000')}
                    onMouseLeave={e => hoverReset(e, '5px 5px 0px #000000')}
                  >
                    <span>{regLoading ? 'Creating account…' : 'Continue to Profile'}</span>
                    <span className="text-[18px]">→</span>
                  </button>
                </motion.div>
              )}

              {step >= 2 && step < 4 && (
                <motion.div key="s-form" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="w-full">
                   <PatientForm 
                      mode={mode === 'athlete' ? 'athlete' : 'patient'} 
                      firstName={firstName}
                      lastName={lastName}
                   />
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="s4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="flex flex-col items-center text-center gap-6 py-8">
                  <div className="w-20 h-20 rounded-full border-[4px] border-black flex items-center justify-center text-white text-[32px] font-black" style={{ backgroundColor: '#113826', boxShadow: '6px 6px 0px #000000' }}>
                    ✓
                  </div>
                  <div>
                    <h2 className="text-4xl font-black text-black tracking-tight mb-2">Your twin<br />is ready.</h2>
                    <p className="text-[14px] font-semibold text-black/50 max-w-xs mx-auto leading-relaxed">
                      VitaNomy has created your AI digital health twin. Head to your dashboard to see your first risk assessment.
                    </p>
                  </div>
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-between w-full max-w-xs rounded-xl border-[3px] border-black px-6 py-4 text-[15px] font-black text-white"
                    style={{ backgroundColor: '#113826', boxShadow: '5px 5px 0px #000000' }}
                  >
                    <span>Open My Dashboard</span>
                    <span className="text-[18px]">→</span>
                  </Link>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
