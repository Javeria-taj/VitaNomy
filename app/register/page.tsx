'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

// ─── Shared style constants ───────────────────────────────────────────────────
const INPUT_BASE = "w-full bg-white rounded-lg border-[3px] border-black px-4 py-3 text-[14px] font-semibold text-black placeholder:text-black/30 outline-none transition-all"
const BTN_PRIMARY = "w-full flex items-center justify-between rounded-xl border-[3px] border-black px-6 py-4 text-[15px] font-black text-white transition-all"
const BTN_BACK = "flex items-center gap-2 rounded-xl border-[3px] border-black px-5 py-4 text-[14px] font-black text-black bg-white transition-all"
const CARD_INACTIVE = "border-[3px] border-black rounded-xl cursor-pointer transition-all"
const CARD_ACTIVE_BG = "#113826"

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
  const bars: { label: string; icon: string; badge: string; badgeColor: string; fill: string; fillColor: string }[] = [
    { label: 'Diabetes Risk', icon: '🩸', badge: 'Low Risk', badgeColor: '#7EC8A0', fill: '32%', fillColor: '#2E7D52' },
    { label: 'Cardiac Health', icon: '❤️', badge: 'Moderate', badgeColor: '#C9A84C', fill: '54%', fillColor: '#C9A84C' },
    { label: 'Hypertension', icon: '🫀', badge: 'Controlled', badgeColor: '#7EC8A0', fill: '28%', fillColor: '#2E7D52' },
  ]

  return (
    <div
      className="relative overflow-hidden flex flex-col justify-between p-10 lg:p-12 min-h-screen"
      style={{ backgroundColor: '#113826' }}
    >
      {/* CSS Grid Texture */}
      <div className="absolute inset-0 pointer-events-none animate-grid-drift" style={{
        backgroundImage: `repeating-linear-gradient(0deg,rgba(100,200,140,0.07) 0px,rgba(100,200,140,0.07) 1px,transparent 1px,transparent 48px),repeating-linear-gradient(90deg,rgba(100,200,140,0.07) 0px,rgba(100,200,140,0.07) 1px,transparent 1px,transparent 48px)`,
        opacity: 0.8
      }} />

      {/* "VN" Watermark */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[50%] overflow-hidden pointer-events-none flex items-end justify-center"
        animate={{
          y: [0, -12, 0],
          rotate: [-12, -10, -12]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg viewBox="0 0 400 260" className="w-full max-w-[500px] opacity-[0.08]" style={{ transform: 'translateY(40px)' }} fill="none">
          <text x="0" y="220" fontSize="290" fontWeight="900" stroke="white" strokeWidth="8" fill="none" letterSpacing="-8" fontFamily="Inter, system-ui, sans-serif">VN</text>
        </svg>
      </motion.div>

      {/* Top — Logo badge */}
      <div className="relative z-10">
        <div className="inline-block text-[20px] font-black tracking-tight px-3 py-1 rounded-lg border-[3px] border-black" style={{ backgroundColor: '#F4F2E9', color: '#113826', boxShadow: '4px 4px 0px #000000' }}>
          VitaNomy
        </div>
      </div>

      {/* Middle — Heading + Condition Bars */}
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
              {/* Blocky progress bar */}
              <div className="w-full h-4 bg-white border-[2px] border-black rounded-sm overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: b.fill }}
                  transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
                  className="h-full" 
                  style={{ backgroundColor: b.fillColor }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom tag */}
      <div className="relative z-10 text-[11px] font-bold tracking-widest uppercase" style={{ color: 'rgba(244,242,233,0.3)' }}>
        AI Health Intelligence Platform
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [gender, setGender] = useState('male')
  const [activity, setActivity] = useState('Sedentary')
  const [lang, setLang] = useState('English')
  const [conditions, setConditions] = useState<string[]>(['Diabetes'])

  const toggleCondition = (c: string) =>
    setConditions(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])

  // Password strength
  const strength = password.length === 0 ? null : password.length < 6 ? 'weak' : password.length < 10 ? 'fair' : 'strong'
  const strengthColors = { weak: '#E07A5F', fair: '#C9A84C', strong: '#2E7D52' }

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

      {/* ── RIGHT PANEL ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#F4F2E9' }}>

        {/* Minimal Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b-[3px] border-black">
          <Link href="/" className="text-[20px] font-black text-black tracking-tight hover:opacity-80 transition-opacity">
            VitaNomy
          </Link>
          <Link href="/login" className="text-[13px] font-black text-black hover:underline underline-offset-4 decoration-2 transition-all">
            Already have an account? Sign in →
          </Link>
        </div>

        {/* Step Stepper */}
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

        {/* Form Area */}
        <div className="flex-1 flex items-center justify-center px-8 py-8">
          <div className="w-full max-w-md">
            <AnimatePresence mode="wait">

              {/* ── STEP 1: ACCOUNT ──────────────────────────────────────── */}
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }} className="flex flex-col gap-5">
                  <div>
                    <div className="inline-block text-[11px] font-black uppercase tracking-widest px-3 py-1 border-[3px] border-black rounded-full mb-4" style={{ backgroundColor: '#C9A84C', boxShadow: '3px 3px 0px #000000' }}>Step 1 of 3</div>
                    <h2 className="text-4xl font-black text-black tracking-tight leading-tight">Create your<br />account.</h2>
                  </div>

                  {/* Google */}
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 bg-white rounded-xl border-[3px] border-black px-5 py-3 text-[14px] font-black text-black"
                    style={{ boxShadow: '5px 5px 0px #000000' }}
                    onMouseEnter={e => hoverLift(e, '7px 7px 0px #000000')}
                    onMouseLeave={e => hoverReset(e, '5px 5px 0px #000000')}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    Continue with Google
                  </button>

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 border-t-[3px] border-black" />
                    <span className="text-[11px] font-black uppercase tracking-widest whitespace-nowrap">or with email</span>
                    <div className="flex-1 border-t-[3px] border-black" />
                  </div>

                  {/* Name row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-black uppercase tracking-wider text-black">First name</label>
                      <NeoInput placeholder="Priya" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-black uppercase tracking-wider text-black">Last name</label>
                      <NeoInput placeholder="Sharma" />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-black uppercase tracking-wider text-black">Email address</label>
                    <NeoInput type="email" placeholder="priya@email.com" />
                  </div>

                  {/* Password */}
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
                        {showPw ? 'HIDE' : 'SHOW'}
                      </button>
                    </div>
                    {/* Strength bars */}
                    {password.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-1">
                        {(['weak','fair','strong'] as const).map((lvl, i) => {
                          const active = (strength === 'weak' && i === 0) || (strength === 'fair' && i <= 1) || (strength === 'strong')
                          return <div key={lvl} className="flex-1 h-2 rounded-sm border border-black" style={{ backgroundColor: active && strength ? strengthColors[strength] : 'white' }} />
                        })}
                        <span className="text-[10px] font-black uppercase ml-1 text-black/60">{strength}</span>
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className={BTN_PRIMARY}
                    style={{ backgroundColor: '#113826', boxShadow: '5px 5px 0px #000000' }}
                    onMouseEnter={e => hoverLift(e, '7px 7px 0px #000000')}
                    onMouseLeave={e => hoverReset(e, '5px 5px 0px #000000')}
                  >
                    <span>Continue to Profile</span>
                    <span className="text-[18px]">→</span>
                  </button>

                  <p className="text-center text-[11px] font-bold text-black/40">
                    By continuing, you agree to our{' '}
                    <span className="text-black underline underline-offset-2 cursor-pointer">Terms</span> &{' '}
                    <span className="text-black underline underline-offset-2 cursor-pointer">Privacy Policy</span>
                  </p>
                </motion.div>
              )}

              {/* ── STEP 2: PROFILE ──────────────────────────────────────── */}
              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }} className="flex flex-col gap-5">
                  <div>
                    <div className="inline-block text-[11px] font-black uppercase tracking-widest px-3 py-1 border-[3px] border-black rounded-full mb-4" style={{ backgroundColor: '#C9A84C', boxShadow: '3px 3px 0px #000000' }}>Step 2 of 3</div>
                    <h2 className="text-4xl font-black text-black tracking-tight leading-tight">Your health<br />profile.</h2>
                    <p className="text-[13px] font-semibold text-black/50 mt-1">This shapes your AI twin and chatbot responses.</p>
                  </div>

                  {/* Gender */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-black uppercase tracking-wider text-black">Biological Sex <span className="font-bold normal-case text-black/40">(affects AI analysis)</span></label>
                    <div className="grid grid-cols-2 gap-3">
                      {[{ val: 'male', icon: '♂', label: 'Male' }, { val: 'female', icon: '♀', label: 'Female' }].map(g => {
                        const active = gender === g.val
                        return (
                          <button
                            key={g.val}
                            type="button"
                            onClick={() => setGender(g.val)}
                            className={`${CARD_INACTIVE} py-5 px-3 text-center`}
                            style={active
                              ? { backgroundColor: CARD_ACTIVE_BG, color: 'white', boxShadow: '2px 2px 0px #000000' }
                              : { backgroundColor: 'white', color: '#000', boxShadow: '5px 5px 0px #000000' }
                            }
                          >
                            <div className="text-3xl mb-2">{g.icon}</div>
                            <div className="text-[14px] font-black">{g.label}</div>
                            <div className="text-[11px] font-bold mt-0.5 opacity-70">Tailored risk models</div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Age / Height / Weight */}
                  <div className="grid grid-cols-3 gap-3">
                    {[{ label: 'Age', placeholder: '32' }, { label: 'Height (cm)', placeholder: '165' }, { label: 'Weight (kg)', placeholder: '65' }].map(f => (
                      <div key={f.label} className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-black uppercase tracking-wider text-black">{f.label}</label>
                        <NeoInput type="number" placeholder={f.placeholder} />
                      </div>
                    ))}
                  </div>

                  {/* Activity */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-black uppercase tracking-wider text-black">Activity Level</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Sedentary', 'Light', 'Moderate', 'Very Active'].map(a => {
                        const active = activity === a
                        return (
                          <button
                            key={a}
                            type="button"
                            onClick={() => setActivity(a)}
                            className="rounded-xl border-[3px] border-black px-3 py-2.5 text-[13px] font-black transition-all"
                            style={active
                              ? { backgroundColor: CARD_ACTIVE_BG, color: 'white', boxShadow: '2px 2px 0px #000000' }
                              : { backgroundColor: 'white', color: '#000', boxShadow: '4px 4px 0px #000000' }
                            }
                          >
                            {a}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Nav */}
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(1)} className={BTN_BACK} style={{ boxShadow: '4px 4px 0px #000000' }}
                      onMouseEnter={e => hoverLift(e, '6px 6px 0px #000000')} onMouseLeave={e => hoverReset(e, '4px 4px 0px #000000')}>
                      ← Back
                    </button>
                    <button type="button" onClick={() => setStep(3)} className={`${BTN_PRIMARY} flex-1`} style={{ backgroundColor: '#113826', boxShadow: '5px 5px 0px #000000' }}
                      onMouseEnter={e => hoverLift(e, '7px 7px 0px #000000')} onMouseLeave={e => hoverReset(e, '5px 5px 0px #000000')}>
                      <span>Continue to Preferences</span>
                      <span className="text-[18px]">→</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 3: PREFERENCES ───────────────────────────────────── */}
              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }} className="flex flex-col gap-5">
                  <div>
                    <div className="inline-block text-[11px] font-black uppercase tracking-widest px-3 py-1 border-[3px] border-black rounded-full mb-4" style={{ backgroundColor: '#C9A84C', boxShadow: '3px 3px 0px #000000' }}>Step 3 of 3</div>
                    <h2 className="text-4xl font-black text-black tracking-tight leading-tight">Your<br />preferences.</h2>
                  </div>

                  {/* Language */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-black uppercase tracking-wider text-black">Preferred Language</label>
                    <div className="flex flex-wrap gap-2">
                      {['English', 'हिंदी', 'தமிழ்', 'తెలుగు', 'ಕನ್ನಡ'].map(l => {
                        const active = lang === l
                        return (
                          <button
                            key={l}
                            type="button"
                            onClick={() => setLang(l)}
                            className="rounded-xl border-[3px] border-black px-4 py-2.5 text-[13px] font-black transition-all"
                            style={active
                              ? { backgroundColor: CARD_ACTIVE_BG, color: 'white', boxShadow: '2px 2px 0px #000000' }
                              : { backgroundColor: 'white', color: '#000', boxShadow: '4px 4px 0px #000000' }
                            }
                          >
                            {l}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Conditions */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-black uppercase tracking-wider text-black">
                      Conditions that concern you <span className="font-bold normal-case text-black/40">(select all that apply)</span>
                    </label>
                    {[
                      { id: 'Diabetes', icon: '🩸', sub: 'Blood glucose, insulin resistance tracking' },
                      { id: 'Cardiac', icon: '❤️', sub: 'Heart rate, cholesterol, cardiovascular risk' },
                      { id: 'Hypertension', icon: '🫀', sub: 'Blood pressure monitoring & stress analysis' },
                    ].map(c => {
                      const active = conditions.includes(c.id)
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => toggleCondition(c.id)}
                          className={`${CARD_INACTIVE} flex items-center gap-4 px-4 py-3 text-left`}
                          style={active
                            ? { backgroundColor: CARD_ACTIVE_BG, color: 'white', boxShadow: '2px 2px 0px #000000' }
                            : { backgroundColor: 'white', color: '#000', boxShadow: '5px 5px 0px #000000' }
                          }
                        >
                          <span className="text-2xl">{c.icon}</span>
                          <div className="flex-1">
                            <div className="text-[14px] font-black">{c.id}</div>
                            <div className={`text-[11px] font-bold mt-0.5 ${active ? 'text-white/60' : 'text-black/40'}`}>{c.sub}</div>
                          </div>
                          <div className="w-6 h-6 rounded-full border-[3px] border-black flex items-center justify-center text-[11px] font-black flex-shrink-0"
                            style={active ? { backgroundColor: 'white', color: '#113826' } : { backgroundColor: 'transparent', color: 'transparent' }}>
                            ✓
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {/* Email digest toggle */}
                  <div className="flex items-start gap-3 p-3 rounded-xl border-[3px] border-black bg-white" style={{ boxShadow: '3px 3px 0px #000000' }}>
                    <div className="w-5 h-5 rounded border-[3px] border-black bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[10px] font-black text-black">✓</span>
                    </div>
                    <span className="text-[12px] font-bold text-black leading-relaxed">Send me weekly health digest emails with my twin's latest readings</span>
                  </div>

                  {/* Nav */}
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(2)} className={BTN_BACK} style={{ boxShadow: '4px 4px 0px #000000' }}
                      onMouseEnter={e => hoverLift(e, '6px 6px 0px #000000')} onMouseLeave={e => hoverReset(e, '4px 4px 0px #000000')}>
                      ← Back
                    </button>
                    <motion.button
                      whileHover="hover"
                      type="button"
                      onClick={() => setStep(4)}
                      className={`${BTN_PRIMARY.replace('text-white', 'text-black')} flex-1 group`}
                      style={{ backgroundColor: '#C9A84C', boxShadow: '6px 6px 0px #000000' }}
                      onMouseEnter={e => hoverLift(e, '8px 8px 0px #000000')}
                      onMouseLeave={e => hoverReset(e, '6px 6px 0px #000000')}
                    >
                      <span>🎉 Build My Twin</span>
                      <motion.span 
                        variants={{ hover: { x: 5 } }}
                        className="text-[18px]"
                      >
                        →
                      </motion.span>
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 4: SUCCESS ───────────────────────────────────────── */}
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
                    href="/onboarding"
                    className="flex items-center justify-between w-full max-w-xs rounded-xl border-[3px] border-black px-6 py-4 text-[15px] font-black text-white"
                    style={{ backgroundColor: '#113826', boxShadow: '5px 5px 0px #000000' }}
                  >
                    <span>Open My Dashboard</span>
                    <span className="text-[18px]">→</span>
                  </Link>
                  <p className="text-[11px] font-bold text-black/40">Your health data is encrypted and private</p>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
