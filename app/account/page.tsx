'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { usePatientStore } from '@/store/patientStore'
import { useTranslation } from '@/hooks/useTranslation'
import { Topbar } from '@/components/Layout/Topbar'
import { TypoAvatar } from '@/components/Common/TypoAvatar'
import { AnyPatientInput } from '@/types/patient'
import { Download } from 'lucide-react'

// ─── Clinical Neobrutalist Color Tokens ───────────────────────────────────────
const C = {
  beige: '#F8F5EE',
  beige2: '#F0EBE0',
  white: '#FFFFFF',
  green: '#1B5E3B',
  green2: '#0D3D26',
  gold: '#C9A84C',
  goldPale: '#F7EDD0',
  black: '#0A0F0D',
  ink: '#1A2520',
  mu: '#5C7268',
  red: '#C0392B',
  redPale: '#FDE8E8',
}

// ─── Brutalist Toggle ─────────────────────────────────────────────────────────
function BToggle({ label, sub, checked, onChange }: { label: string; sub?: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between py-3 px-2 border-b-[2.5px] border-black cursor-pointer hover:opacity-80 transition-all" onClick={onChange}>
      <div>
        <div className="font-black text-[13px]" style={{ color: C.ink }}>{label}</div>
        {sub && <div className="font-bold text-[10px] mt-1 uppercase tracking-wide" style={{ color: C.mu }}>{sub}</div>}
      </div>
      <div className="w-8 h-8 border-[3px] border-black flex items-center justify-center transition-all"
        style={{ backgroundColor: checked ? C.green : C.white, boxShadow: checked ? '2px 2px 0px #000' : 'inset 2px 2px 0px rgba(0,0,0,0.1)' }}>
        {checked && <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 13L9 17L19 7" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </div>
    </div>
  )
}

// ─── Nav Item ────────────────────────────────────────────────────────────────
function NavItem({ icon, label, id, activeTab, setActiveTab }: { icon: string; label: string; id: TabId; activeTab: TabId; setActiveTab: (s: TabId) => void }) {
  const isActive = activeTab === id
  return (
    <button onClick={() => setActiveTab(id)}
      className="flex items-center gap-3 px-4 py-3 font-black text-[13px] uppercase cursor-pointer transition-all border-b-[1px] border-black/5 hover:bg-black/5 w-full"
      style={{
        borderLeft: isActive ? `6px solid ${C.green}` : `4px solid transparent`,
        backgroundColor: isActive ? C.white : 'transparent',
        color: isActive ? C.ink : C.mu,
        boxShadow: isActive ? '4px 4px 0px #000' : 'none',
        transform: isActive ? 'translateX(2px)' : 'none',
        zIndex: isActive ? 10 : 'auto',
      }}>
      <span style={{ fontSize: 16 }}>{icon}</span> {label}
    </button>
  )
}

// ─── Panel Header ─────────────────────────────────────────────────────────────
function PanelHeader({ title, sub, action, onClick }: { title: string; sub: string; action?: { label: string; primary?: boolean }, onClick?: () => void }) {
  return (
    <div className="flex items-start justify-between pb-5 mb-6 border-b-[4px] border-black">
      <div>
        <h2 className="text-[24px] font-black tracking-tighter uppercase" style={{ color: C.ink }}>{title}</h2>
        <p className="text-[11px] font-bold tracking-widest uppercase mt-1" style={{ color: C.mu }}>{sub}</p>
      </div>
      {action && (
        <button
          onClick={onClick}
          className="px-5 py-2.5 border-[3px] border-black font-black uppercase text-[11px] transition-all hover:translate-x-0.5 hover:translate-y-0.5"
          style={{
            backgroundColor: action.primary ? C.green : C.white,
            color: action.primary ? C.white : C.ink,
            boxShadow: '4px 4px 0px #000',
          }}>
          {action.label}
        </button>
      )}
    </div>
  )
}

// ─── Input Field ──────────────────────────────────────────────────────────────
function InputField({ label, value, onChange, type = 'text', hint }: { label: string; value: string; onChange: (v: string) => void; type?: string; hint?: string }) {
  return (
    <div className="flex flex-col">
      <label className="text-[11px] font-black uppercase mb-1.5" style={{ color: C.ink }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        className="px-4 py-3 border-[3px] border-black text-[14px] font-bold focus:outline-none transition-all"
        style={{ backgroundColor: C.white, boxShadow: '4px 4px 0px #000' }}
        onFocus={e => { e.target.style.backgroundColor = C.beige; e.target.style.boxShadow = '2px 2px 0px #000' }}
        onBlur={e => { e.target.style.backgroundColor = C.white; e.target.style.boxShadow = '4px 4px 0px #000' }}
      />
      {hint && <span className="text-[9px] font-bold mt-1 uppercase tracking-widest" style={{ color: C.mu }}>{hint}</span>}
    </div>
  )
}

type TabId = 'profile' | 'metrics' | 'reports' | 'settings' | 'notifications' | 'devices' | 'privacy' | 'billing'

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AccountPage() {
  const { patient, analysis, setPatient, updatePatient, language, setLanguage } = usePatientStore()
  const { t } = useTranslation()
  const p = patient
  const a = analysis

  const [activeTab, setActiveTab] = useState<TabId>('profile')
  const [genderMode, setGenderMode] = useState<'male' | 'female'>('male')
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractStatus, setExtractStatus] = useState<string | null>(null)

  // Local form state
  const [formData, setFormData] = useState({
    firstName: p?.name?.split(' ')[0] || '',
    lastName: p?.name?.split(' ')[1] || '',
    age: p?.age || 25,
    height: p?.height || 175,
    weight: p?.weight || 75
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (p?.gender) {
      setGenderMode(p.gender as 'male' | 'female')
    }
    if (p) {
      setFormData({
        firstName: p.name?.split(' ')[0] || '',
        lastName: p.name?.split(' ')[1] || '',
        age: p.age || 25,
        height: p.height || 175,
        weight: p.weight || 75
      })
    }
  }, [p])

  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus('Saving...')

    try {
      updatePatient({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        age: Number(formData.age),
        height: Number(formData.height),
        weight: Number(formData.weight),
        gender: genderMode
      })
      setSaveStatus('Saved!')
      setTimeout(() => setSaveStatus(null), 2000)
    } catch (err) {
      console.error(err)
      setSaveStatus('Error saving')
    } finally {
      setIsSaving(false)
    }
  }

  const menuItems: { id: TabId; label: string; icon: string }[] = [
    { id: 'profile', label: t.account.title, icon: '👤' },
    { id: 'metrics', label: t.account.metrics, icon: '📊' },
    { id: 'reports', label: t.account.reports, icon: '📄' },
    { id: 'settings', label: t.account.settings, icon: '⚙️' },
    { id: 'notifications', label: t.account.notifications, icon: '🔔' },
    { id: 'devices', label: t.account.devices, icon: '⌚' },
    { id: 'privacy', label: t.account.privacy, icon: '🔒' },
    { id: 'billing', label: t.account.billing, icon: '💳' },
  ]

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !p) return

    setIsExtracting(true)
    setExtractStatus('Reading PDF...')

    try {
      const reader = new FileReader()
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1]
        setExtractStatus('AI Extraction...')
        const res = await fetch('/api/extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pdf_base64: base64,
            mode: p.mode || 'patient'
          })
        })

        if (!res.ok) throw new Error('Extraction failed')
        const data = await res.json()
        setPatient({ ...p, ...data.extracted_fields } as AnyPatientInput)
        setExtractStatus('Success! Twin updated.')

        setTimeout(() => {
          setExtractStatus(null)
          setIsExtracting(false)
        }, 2000)
      }
      reader.readAsDataURL(file)
    } catch (err) {
      console.error(err)
      setExtractStatus('Error extracting data.')
      setTimeout(() => {
        setExtractStatus(null)
        setIsExtracting(false)
      }, 3000)
    }
  }

  if (!p || !a) {
    return (
      <div className="h-screen w-screen flex flex-col" style={{ backgroundColor: C.beige, color: C.ink, fontFamily: "'Inter', sans-serif" }}>
        <Topbar />
        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
          <div className="w-24 h-24 border-[4px] border-black flex items-center justify-center text-[40px] mb-8 shadow-[8px_8px_0px_#000]"
            style={{ backgroundColor: C.goldPale }}>
            👤
          </div>
          <h1 className="text-[32px] font-black uppercase tracking-tighter mb-4">Account Locked</h1>
          <p className="max-w-md text-[14px] font-bold leading-relaxed mb-10 text-mu">
            Your clinical account and twin telemetry are initialized during the medical intake process. Please complete your profile to unlock account management.
          </p>
          <Link href="/register"
            className="px-10 py-5 border-[4px] border-black bg-green text-white font-black text-[18px] uppercase tracking-widest shadow-[8px_8px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center">
            {t.dashboard.beginIntake} &rarr;
          </Link>
        </div>
      </div>
    )
  }

  const initials = p.name ? p.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'AM'
  const bmi = (p.weight / ((p.height / 100) ** 2)).toFixed(1)

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden" style={{ backgroundColor: C.beige, color: C.ink, fontFamily: "'Inter', sans-serif" }}>

      <Topbar />

      <main className="flex-1 flex flex-col overflow-hidden relative z-10">

        {/* ── HERO BAND ── */}
        <section className="border-b-[4px] border-black shrink-0 relative overflow-hidden"
          style={{ backgroundColor: C.white }}>
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, #000 0, #000 2px, transparent 2px, transparent 32px), repeating-linear-gradient(90deg, #000 0, #000 2px, transparent 2px, transparent 32px)'
          }} />

          <div className="px-8 py-8 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-8">
              <TypoAvatar name={p.name} size="xl" bg={C.gold} color={C.ink} />
              <div>
                <h1 className="text-[32px] font-black uppercase tracking-tighter mb-2" style={{ color: C.ink }}>{p.name}</h1>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-1 border-[2.5px] border-black text-[10px] font-black uppercase shadow-[2px_2px_0px_#000]"
                    style={{ backgroundColor: C.green, color: C.white }}>Pro Plan</span>
                  <span className="px-2 py-1 border-[2.5px] border-black text-[10px] font-black uppercase shadow-[2px_2px_0px_#000]"
                    style={{ backgroundColor: C.white, color: C.ink }}>{p.gender === 'male' ? '♂' : '♀'} {p.gender ? (p.gender.charAt(0).toUpperCase() + p.gender.slice(1)) : ''} · {p.age}y</span>
                  <span className="px-2 py-1 border-[2.5px] border-black text-[10px] font-black uppercase shadow-[2px_2px_0px_#000]"
                    style={{ backgroundColor: C.white, color: C.ink }}>📍 Global Presence</span>
                </div>
                <div className="text-[11px] font-bold uppercase tracking-widest" style={{ color: C.mu }}>
                  Twin ID: VN-{Math.floor(1000 + Math.random() * 9000)}-{p.name.charAt(0)} · Member Since 2025
                </div>
              </div>
            </div>

            <div className="border-[4px] border-black p-4 flex flex-col items-center shadow-[6px_6px_0px_#000]"
              style={{ backgroundColor: C.white }}>
              <span className="text-[48px] font-black leading-none tracking-tighter" style={{ color: C.gold }}>72</span>
              <span className="text-[12px] font-black uppercase tracking-[0.2em] mt-1" style={{ color: C.ink }}>Health Score</span>
            </div>
          </div>

          <div className="flex border-t-[3px] border-black" style={{ backgroundColor: C.beige2 }}>
            {menuItems.slice(0, 4).map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="flex-1 py-3 border-r-[3px] border-black text-[12px] font-black uppercase tracking-wider transition-all"
                style={{
                  backgroundColor: activeTab === tab.id ? C.gold : 'transparent',
                  color: activeTab === tab.id ? C.ink : C.mu,
                  boxShadow: activeTab === tab.id ? 'inset 0px -4px 0px #000' : 'none',
                }}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </section>

        <div className="flex-1 flex overflow-hidden">

          <aside className="w-[260px] border-r-[4px] border-black shrink-0 overflow-y-auto hidden md:block"
            style={{ backgroundColor: '#F0EBE0' }}>
            <div className="py-4">
              {menuItems.map(item => (
                <NavItem key={item.id} icon={item.icon} label={item.label} id={item.id} activeTab={activeTab} setActiveTab={setActiveTab} />
              ))}

              <div className="my-4 border-t-[3px] border-black/10" />
              <div className="px-4">
                <button className="w-full text-left px-4 py-3 font-black text-[13px] uppercase transition-all hover:bg-red-50 border-l-[4px] border-transparent"
                  style={{ color: C.red }}>
                  ↪ Sign Out
                </button>
                <button className="w-full text-left px-4 py-3 font-black text-[13px] uppercase transition-all hover:bg-red-50 border-l-[4px] border-transparent mt-1"
                  style={{ color: C.red }}>
                  🗑 Delete Account
                </button>
              </div>
            </div>
          </aside>

          <div className="flex-1 overflow-y-auto relative" style={{ backgroundColor: C.beige }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="p-8 max-w-4xl mx-auto"
              >

                {activeTab === 'profile' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="mb-8 pb-6 border-b-[2px] border-black/5">
                      <h2 className="text-[20px] font-black uppercase tracking-tight text-ink mb-1">{t.account.title}</h2>
                      <p className="text-[12px] font-bold text-mu">{t.account.subtitle}</p>
                    </div>

                    <div className="mb-8">
                      <label className="text-[12px] font-black uppercase mb-3 block" style={{ color: C.ink }}>
                        Biological Sex <span className="text-[10px]" style={{ color: C.mu }}>(AI Calibration)</span>
                      </label>
                      <div className="flex gap-4">
                        {[
                          { val: 'male', icon: '♂', label: 'Male' },
                          { val: 'female', icon: '♀', label: 'Female' },
                        ].map(opt => (
                          <button key={opt.val} onClick={() => setGenderMode(opt.val as 'male' | 'female')}
                            className="flex-1 border-[3px] border-black p-5 flex flex-col items-center justify-center transition-all"
                            style={{
                              backgroundColor: genderMode === opt.val ? `${C.green}10` : C.white,
                              borderColor: genderMode === opt.val ? C.green : C.black,
                              boxShadow: '4px 4px 0px #000',
                            }}>
                            <span className="text-[32px] mb-2 leading-none">{opt.icon}</span>
                            <span className="font-black text-[14px] uppercase" style={{ color: C.ink }}>{opt.label}</span>
                            <span className="text-[10px] font-bold uppercase mt-1" style={{ color: C.mu }}>Metabolic Model</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <InputField label="First Name" value={formData.firstName} onChange={v => setFormData(s => ({ ...s, firstName: v }))} />
                      <InputField label="Last Name" value={formData.lastName} onChange={v => setFormData(s => ({ ...s, lastName: v }))} />
                    </div>
                    <div className="grid grid-cols-3 gap-6 mb-8">
                      <InputField label="Age" value={String(formData.age)} onChange={v => setFormData(s => ({ ...s, age: Number(v) }))} type="number" />
                      <InputField label="Height (cm)" value={String(formData.height)} onChange={v => setFormData(s => ({ ...s, height: Number(v) }))} type="number" />
                      <InputField label="Weight (kg)" value={String(formData.weight)} onChange={v => setFormData(s => ({ ...s, weight: Number(v) }))} type="number" />
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-10 py-4 border-[4px] border-black font-black uppercase text-[14px] transition-all flex items-center gap-3 relative overflow-hidden"
                        style={{
                          backgroundColor: saveStatus === 'Saved!' ? C.green : C.gold,
                          color: saveStatus === 'Saved!' ? C.white : C.ink,
                          boxShadow: '6px 6px 0px #000',
                          transform: isSaving ? 'translate(2px, 2px)' : 'none'
                        }}
                      >
                        {isSaving ? (
                          <>
                            <span className="animate-spin text-[18px]">⚡</span>
                            SAVING...
                          </>
                        ) : saveStatus === 'Saved!' ? (
                          <>
                            <span>✓</span>
                            CHANGES PERSISTED
                          </>
                        ) : (
                          <>
                            <span>💾</span>
                            SAVE CLINICAL CHANGES
                          </>
                        )}

                        {/* Zebra progress overlay for saving state */}
                        {isSaving && (
                          <motion.div
                            className="absolute inset-x-0 bottom-0 h-1 bg-black/20"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                          />
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'metrics' && (
                  <div>
                    <PanelHeader title="Health Metrics" sub="Twin live readings and assessments" action={{ label: '+ Log Fasting Reading' }} />

                    <div className="grid grid-cols-3 gap-5 mb-8">
                      {[
                        { l: 'Fasting Glucose', v: String(p.glucose || 0), u: 'mg/dL', s: (p.glucose || 0) > 100 ? 'Pre-diabetic' : 'Normal', i: '🩸', w: (p.glucose || 0) > 100 },
                        { l: 'Blood Pressure', v: `${p.systolic_bp || 0}/${p.diastolic_bp || 0}`, u: 'mmHg', s: (p.systolic_bp || 0) > 130 ? 'Stage 1 HTN' : 'Normal', i: '🫀', w: (p.systolic_bp || 0) > 130 },
                        { l: 'Heart Rate', v: '76', u: 'bpm', s: 'Normal', i: '❤️', w: false },
                      ].map(m => (
                        <div key={m.l} className="border-[3px] border-black p-4 flex flex-col shadow-[5px_5px_0px_#000]"
                          style={{ backgroundColor: C.white }}>
                          <div className="text-[20px] mb-2">{m.i}</div>
                          <div className="text-[10px] font-black uppercase tracking-wider" style={{ color: C.mu }}>{m.l}</div>
                          <div className="text-[28px] font-black tracking-tighter mt-1" style={{ color: C.ink }}>{m.v}</div>
                          <div className="text-[10px] font-bold uppercase mt-1" style={{ color: C.mu }}>{m.u}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'reports' && (
                  <div>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="application/pdf" className="hidden" />
                    <div className="flex justify-between items-start pb-5 mb-6 border-b-[4px] border-black">
                      <div>
                        <h2 className="text-[20px] font-black uppercase tracking-tight text-ink mb-1">PDF Health Reports</h2>
                        <p className="text-[12px] font-bold text-mu">Shareable AI-generated clinical documents</p>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => window.print()}
                          className="px-5 py-2.5 border-[3px] border-black bg-white text-black font-black uppercase text-[11px] transition-all hover:translate-x-0.5 hover:translate-y-0.5 shadow-[4px_4px_0px_#000] flex items-center gap-2">
                          <Download className="w-3 h-3" /> Export Clinical Dossier
                        </button>
                        <button onClick={handleFileSelect}
                          className="px-5 py-2.5 border-[3px] border-black bg-green text-white font-black uppercase text-[11px] transition-all hover:translate-x-0.5 hover:translate-y-0.5 shadow-[4px_4px_0px_#000]">
                          + Scan/Upload New PDF
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="border-[4px] border-black p-5 flex flex-col shadow-[6px_6px_0px_#000] cursor-pointer"
                        style={{ backgroundColor: C.beige2 }} onClick={handleFileSelect}>
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 border-[3px] border-black flex items-center justify-center text-[20px] shadow-[3px_3px_0px_#000]"
                            style={{ backgroundColor: C.white }}>
                            {isExtracting ? '⏳' : '📎'}
                          </div>
                          <div>
                            <div className="font-black text-[14px] uppercase leading-tight mb-1" style={{ color: C.ink }}>
                              {isExtracting ? extractStatus : 'Upload Medical Record'}
                            </div>
                            <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: C.mu }}>
                              {isExtracting ? 'Mapping to Twin...' : 'Synchronize new lab data'}
                            </div>
                          </div>
                        </div>
                        <div className="mt-auto">
                          <div className="w-full h-2 border-[2px] border-black bg-white overflow-hidden">
                            {isExtracting && <motion.div className="h-full bg-gold" animate={{ x: ['-100%', '100%'] }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }} />}
                          </div>
                        </div>
                      </div>

                      {[
                        { t: 'Full Health Assessment', d: 'Apr 1', i: '📋', tag: 'Full Analysis', col: C.gold },
                        { t: 'Clean Living Simulation', d: 'Apr 4', i: '⚡', tag: '1-Month Forecast', col: C.green },
                      ].map(r => (
                        <div key={r.t} className="border-[4px] border-black p-5 flex flex-col shadow-[6px_6px_0px_#000]"
                          style={{ backgroundColor: C.white }}>
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 border-[3px] border-black flex items-center justify-center text-[20px] shadow-[3px_3px_0px_#000]"
                              style={{ backgroundColor: r.col }}>
                              {r.i}
                            </div>
                            <div>
                              <div className="font-black text-[14px] uppercase leading-tight mb-1" style={{ color: C.ink }}>{r.t}</div>
                              <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: C.mu }}>{r.d} · PDF Document</div>
                            </div>
                          </div>
                          <div className="mt-auto flex gap-3">
                            <button className="flex-1 py-2.5 border-[3px] border-black text-[11px] font-black uppercase transition-all hover:translate-x-0.5 hover:translate-y-0.5"
                              style={{ backgroundColor: C.green, color: C.white, boxShadow: '3px 3px 0px #000' }}>
                              Download
                            </button>
                            <button className="flex-1 py-2.5 border-[3px] border-black text-[11px] font-black uppercase transition-all hover:translate-x-0.5 hover:translate-y-0.5"
                              style={{ backgroundColor: C.white, color: C.ink, boxShadow: '3px 3px 0px #000' }}>
                              Preview
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="mb-8 pb-6 border-b-[2px] border-black/5">
                      <h2 className="text-[20px] font-black uppercase tracking-tight text-ink mb-1">{t.account.settings}</h2>
                      <p className="text-[12px] font-bold text-mu">Localize your platform instance and calibrate twin intelligence.</p>
                    </div>

                    <div className="grid gap-6">
                      <div className="border-[3px] border-black bg-white shadow-[4px_4px_0px_#000]">
                        <div className="px-5 py-3 border-b-[3px] border-black bg-beige flex justify-between items-center">
                          <span className="text-[11px] font-black uppercase tracking-wider">{t.account.langTitle}</span>
                        </div>
                        <div className="p-4 grid grid-cols-4 gap-4">
                          {[
                            { id: 'en', label: '🇬🇧 English' },
                            { id: 'hi', label: '🇮🇳 Hindi' },
                            { id: 'ta', label: '🇮🇳 Tamil' },
                            { id: 'te', label: '🇮🇳 Telugu' }
                          ].map((l) => (
                            <button
                              key={l.id}
                              onClick={() => setLanguage(l.id as any)}
                              className="p-3 border-[3px] border-black font-black uppercase text-[11px] transition-all"
                              style={{
                                backgroundColor: language === l.id ? C.gold : C.white,
                                color: C.ink,
                                boxShadow: language === l.id ? '3px 3px 0px #000' : 'none',
                                transform: language === l.id ? 'translate(-1px, -1px)' : 'none'
                              }}>
                              {l.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="border-[3px] border-black bg-white shadow-[4px_4px_0px_#000]">
                        <div className="px-5 py-3 border-b-[3px] border-black bg-beige flex justify-between items-center">
                          <span className="text-[11px] font-black uppercase tracking-wider">{t.account.aiParams}</span>
                        </div>
                        <BToggle label="Gender-Aware Responses" sub="Calibrate using selected metabolic sex" checked={true} onChange={() => { }} />
                        <BToggle label="Research Citations" sub="Include medical references" checked={true} onChange={() => { }} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'billing' && (
                  <div>
                    <PanelHeader title="Billing & Subscription" sub="Review limits and access" />
                    <div className="border-[5px] border-black p-8 relative overflow-hidden mb-6 shadow-[8px_8px_0px_#000]"
                      style={{ backgroundColor: C.green, color: C.white }}>
                      <div className="absolute -right-10 -top-10 w-40 h-40 border-[8px] border-black rounded-full opacity-20"
                        style={{ backgroundColor: C.gold }} />
                      <div className="relative z-10">
                        <div className="inline-block px-3 py-1 font-black text-[10px] uppercase border-[2px] border-black shadow-[2px_2px_0px_#000] mb-4"
                          style={{ backgroundColor: C.gold, color: C.ink }}>
                          ACTIVE LICENSE
                        </div>
                        <h3 className="text-[36px] font-black uppercase tracking-tighter leading-none mb-1">VitaNomy Pro</h3>
                        <p className="text-[12px] font-bold opacity-80 uppercase tracking-widest mb-8">₹499 / Month · Annual Billing</p>
                        <div className="grid grid-cols-2 gap-y-3 gap-x-8 text-[12px] font-black uppercase tracking-wide">
                          {['Unlimited Twin Analysis', 'Unlimited Simulations', 'Full PDF Pipelines', 'All Modules Unlocked'].map(f => (
                            <div key={f} className="flex items-center gap-2">
                              <span className="text-[16px]" style={{ color: C.gold }}>✓</span> {f}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] font-black uppercase tracking-[0.1em] text-center" style={{ color: C.mu }}>
                      License auto-renews on April 4, 2026. Manage via secure portal.
                    </p>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
      {/* --- Clinical Report (Print Only) --- */}
      <div className="print-only clinical-report" style={{ backgroundColor: 'white', color: 'black' }}>
        <div className="border-[10px] border-black p-10">
          <div className="flex justify-between items-start border-b-[5px] border-black pb-8 mb-10">
            <div>
              <h1 className="text-[60px] font-black uppercase tracking-tighter leading-none mb-2">Clinical Dossier</h1>
              <p className="text-[14px] font-black uppercase tracking-[0.4em] opacity-40">VitaNomy Digital Twin Report · V1.4</p>
            </div>
            <div className="text-right">
              <div className="text-[24px] font-black uppercase">CONFIDENTIAL</div>
              <div className="text-[14px] font-bold text-black">DATE: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 mb-10">
            <div className="p-6 border-[4px] border-black bg-[#F8F5EE]">
              <h2 className="text-[18px] font-black uppercase mb-4 border-b-[2px] border-black pb-2 text-black">Patient Profile</h2>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="font-black opacity-40 uppercase text-[10px]">Name</span><span className="font-bold text-black">{p.name}</span></div>
                <div className="flex justify-between"><span className="font-black opacity-40 uppercase text-[10px]">Age / Gender</span><span className="font-bold text-black">{p.age} yr / {p.gender}</span></div>
                <div className="flex justify-between"><span className="font-black opacity-40 uppercase text-[10px]">BMI</span><span className="font-bold text-black">{bmi} kg/m²</span></div>
              </div>
            </div>
            <div className="p-6 border-[4px] border-black bg-[#F7EDD0]">
              <h2 className="text-[18px] font-black uppercase mb-4 border-b-[2px] border-black pb-2 text-black">Risk Stratification</h2>
              <div className="space-y-3">
                {['cardiac', 'diabetes', 'hypertension'].map(k => {
                  const score = typeof (a.risk_scores as any)[k] === 'number' ? (a.risk_scores as any)[k] : ((a.risk_scores as any)[k]?.score || 0)
                  return (
                    <div key={k} className="flex justify-between items-center">
                      <span className="font-black opacity-40 uppercase text-[10px]">{k}</span>
                      <span className="font-black text-[20px]" style={{ color: score > 60 ? '#C0392B' : score > 30 ? '#C9A84C' : '#1B5E3B' }}>{score}%</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="mb-10 text-black">
            <h2 className="text-[18px] font-black uppercase mb-4 border-b-[3px] border-black pb-2 text-black">Clinical Intelligence Summary</h2>
            <div className="space-y-4">
              {(a.insights || []).slice(0, 3).map((ins, i) => (
                <div key={i} className="flex gap-4 p-4 border-[2px] border-black bg-white">
                  <div className="w-2 h-2 mt-1.5 bg-black" />
                  <p className="text-[14px] leading-relaxed italic text-black">{ins}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 border-[4px] border-black bg-black text-white text-center mt-20">
            <p className="text-[12px] font-black uppercase tracking-[0.2em] mb-2 opacity-50">Authorized Clinical Copy · Do not distribute</p>
            <p className="text-[14px] font-bold italic opacity-80">"Synchronizing human physiology with clinical intelligence for high-fidelity longevity."</p>
          </div>
        </div>
      </div>
    </div>
  )
}
