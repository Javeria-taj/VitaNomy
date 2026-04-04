'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { usePatientStore } from '@/store/patientStore'
import { Topbar } from '@/components/Layout/Topbar'
import { TypoAvatar } from '@/components/Common/TypoAvatar'

// ─── Clinical Neobrutalist Color Tokens ───────────────────────────────────────
const C = {
  beige:     '#F8F5EE',
  beige2:    '#F0EBE0',
  white:     '#FFFFFF',
  green:     '#1B5E3B',
  green2:    '#0D3D26',
  gold:      '#C9A84C',
  goldPale:  '#F7EDD0',
  black:     '#0A0F0D',
  ink:       '#1A2520',
  mu:        '#5C7268',
  red:       '#C0392B',
  redPale:   '#FDE8E8',
}

type TabKey = 'profile' | 'metrics' | 'reports' | 'preferences' | 'notifications' | 'devices' | 'privacy' | 'plan'



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
        {checked && <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 13L9 17L19 7" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </div>
    </div>
  )
}

// ─── Nav Item ────────────────────────────────────────────────────────────────
function NavItem({ icon, label, t, activeTab, setActiveTab }:
  { icon: string; label: string; t: TabKey; activeTab: TabKey; setActiveTab: (t: TabKey) => void }) {
  const isActive = activeTab === t
  return (
    <div onClick={() => setActiveTab(t)} className="flex items-center gap-3 px-4 py-3 font-black text-[13px] uppercase cursor-pointer transition-all border-b-[1px] border-black/5 hover:bg-black/5"
      style={{
        borderLeft: isActive ? `6px solid ${C.green}` : `4px solid transparent`,
        backgroundColor: isActive ? C.white : 'transparent',
        color: isActive ? C.ink : C.mu,
        boxShadow: isActive ? '4px 4px 0px #000' : 'none',
        transform: isActive ? 'translateX(2px)' : 'none',
        zIndex: isActive ? 10 : 'auto',
      }}>
      <span style={{ fontSize: 16 }}>{icon}</span> {label}
    </div>
  )
}

// ─── Panel Header ─────────────────────────────────────────────────────────────
function PanelHeader({ title, sub, action }: { title: string; sub: string; action?: { label: string; primary?: boolean } }) {
  return (
    <div className="flex items-start justify-between pb-5 mb-6 border-b-[4px] border-black">
      <div>
        <h2 className="text-[24px] font-black tracking-tighter uppercase" style={{ color: C.ink }}>{title}</h2>
        <p className="text-[11px] font-bold tracking-widest uppercase mt-1" style={{ color: C.mu }}>{sub}</p>
      </div>
      {action && (
        <button className="px-5 py-2.5 border-[3px] border-black font-black uppercase text-[11px] transition-all hover:translate-x-0.5 hover:translate-y-0.5"
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
function InputField({ label, val, type = 'text', hint }: { label: string; val: string; type?: string; hint?: string }) {
  return (
    <div className="flex flex-col">
      <label className="text-[11px] font-black uppercase mb-1.5" style={{ color: C.ink }}>{label}</label>
      <input type={type} defaultValue={val}
        className="px-4 py-3 border-[3px] border-black text-[14px] font-bold focus:outline-none transition-all"
        style={{ backgroundColor: C.white, boxShadow: '4px 4px 0px #000' }}
        onFocus={e => {e.target.style.backgroundColor = C.beige; e.target.style.boxShadow = '2px 2px 0px #000'}}
        onBlur={e => {e.target.style.backgroundColor = C.white; e.target.style.boxShadow = '4px 4px 0px #000'}}
      />
      {hint && <span className="text-[9px] font-bold mt-1 uppercase tracking-widest" style={{ color: C.mu }}>{hint}</span>}
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AccountPage() {
  const { patient } = usePatientStore()
  const p = patient || { name: 'Alex Morgan', gender: 'male', age: 34, weight: 92, height: 175 }

  const [activeTab, setActiveTab] = useState<TabKey>('profile')
  const [genderMode, setGenderMode] = useState<'m' | 'f'>('m')

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden" style={{ backgroundColor: C.beige, color: C.ink, fontFamily: "'Inter', sans-serif" }}>

      <Topbar />

      <main className="flex-1 flex flex-col overflow-hidden relative z-10">

        {/* ── HERO BAND ── */}
        <section className="border-b-[4px] border-black shrink-0 relative overflow-hidden"
          style={{ backgroundColor: C.white }}>
          {/* Brutalist grid overlay */}
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
                    style={{ backgroundColor: C.white, color: C.ink }}>♂ Male · {p.age}y</span>
                  <span className="px-2 py-1 border-[2.5px] border-black text-[10px] font-black uppercase shadow-[2px_2px_0px_#000]"
                    style={{ backgroundColor: C.white, color: C.ink }}>📍 Bangalore, IN</span>
                </div>
                <div className="text-[11px] font-bold uppercase tracking-widest" style={{ color: C.mu }}>
                  Twin ID: VN-8823-M · Member Since 2025
                </div>
              </div>
            </div>

            {/* Brutalist Health Score Block */}
            <div className="border-[4px] border-black p-4 flex flex-col items-center shadow-[6px_6px_0px_#000]"
              style={{ backgroundColor: C.white }}>
              <span className="text-[48px] font-black leading-none tracking-tighter" style={{ color: C.gold }}>72</span>
              <span className="text-[12px] font-black uppercase tracking-[0.2em] mt-1" style={{ color: C.ink }}>Health Score</span>
            </div>
          </div>

          {/* Quick Tabs Bar */}
          <div className="flex border-t-[3px] border-black" style={{ backgroundColor: C.beige2 }}>
            {[
              { id: 'profile', l: '👤 Profile' }, { id: 'metrics', l: '📊 Metrics' },
              { id: 'reports', l: '📄 Reports' }, { id: 'preferences', l: '⚙️ Settings' }
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as TabKey)}
                className="flex-1 py-3 border-r-[3px] border-black text-[12px] font-black uppercase tracking-wider transition-all"
                style={{
                  backgroundColor: activeTab === tab.id ? C.gold : 'transparent',
                  color: activeTab === tab.id ? C.ink : C.mu,
                  boxShadow: activeTab === tab.id ? 'inset 0px -4px 0px #000' : 'none',
                }}>
                {tab.l}
              </button>
            ))}
          </div>
        </section>

        {/* ── SPLIT BODY ── */}
        <div className="flex-1 flex overflow-hidden">

          {/* Sidebar Nav */}
          <aside className="w-[260px] border-r-[4px] border-black shrink-0 overflow-y-auto hidden md:block"
            style={{ backgroundColor: '#F0EBE0' }}>
            <div className="py-4">
              <div className="px-5 mb-2 text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: C.mu }}>Account</div>
              <NavItem icon="👤" label="Personal Info" t="profile" activeTab={activeTab} setActiveTab={setActiveTab} />
              <NavItem icon="📊" label="Health Metrics" t="metrics" activeTab={activeTab} setActiveTab={setActiveTab} />
              <NavItem icon="📄" label="PDF Reports" t="reports" activeTab={activeTab} setActiveTab={setActiveTab} />

              <div className="my-4 border-t-[3px] border-black/10" />
              <div className="px-5 mb-2 text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: C.mu }}>Settings</div>
              <NavItem icon="🌐" label="Language & AI" t="preferences" activeTab={activeTab} setActiveTab={setActiveTab} />
              <NavItem icon="🔔" label="Notifications" t="notifications" activeTab={activeTab} setActiveTab={setActiveTab} />
              <NavItem icon="⌚" label="Devices" t="devices" activeTab={activeTab} setActiveTab={setActiveTab} />
              <NavItem icon="🔒" label="Privacy & Data" t="privacy" activeTab={activeTab} setActiveTab={setActiveTab} />

              <div className="my-4 border-t-[3px] border-black/10" />
              <div className="px-5 mb-2 text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: C.mu }}>Billing</div>
              <NavItem icon="💳" label="Plan & Usage" t="plan" activeTab={activeTab} setActiveTab={setActiveTab} />

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

          {/* Content Area */}
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

                {/* ── PANEL 1: PROFILE ── */}
                {activeTab === 'profile' && (
                  <div>
                    <PanelHeader title="Personal Information" sub="Core demographics and baseline data" action={{ label: 'Save Changes', primary: true }} />

                    <div className="mb-8">
                      <label className="text-[12px] font-black uppercase mb-3 block" style={{ color: C.ink }}>
                        Biological Sex <span className="text-[10px]" style={{ color: C.mu }}>(AI Calibration)</span>
                      </label>
                      <div className="flex gap-4">
                        {[
                          { val: 'm', icon: '♂', label: 'Male' },
                          { val: 'f', icon: '♀', label: 'Female' },
                        ].map(opt => (
                          <button key={opt.val} onClick={() => setGenderMode(opt.val as 'm' | 'f')}
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
                      <div className="text-[10px] font-black p-3 mt-4 inline-block shadow-[2px_2px_0px_#000] border-[2px] border-black"
                        style={{ backgroundColor: `${C.gold}33`, color: C.ink }}>
                        ⚠️ CHANGING THIS RECALIBRATES YOUR AI TWIN AND FUTURE SCORES.
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <InputField label="First Name" val={p.name.split(' ')[0]} />
                      <InputField label="Last Name" val={p.name.split(' ')[1] || ''} />
                    </div>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <InputField label="Email Address" val="alex@vitanomy.health" hint="✓ VERIFIED" />
                      <InputField label="Phone Number" val="+91 98765 43210" type="tel" />
                    </div>
                    <div className="grid grid-cols-3 gap-6 mb-6">
                      <InputField label="Age" val={String(p.age)} type="number" />
                      <InputField label="Height (cm)" val={String(p.height || 175)} type="number" />
                      <InputField label="Weight (kg)" val={String(p.weight || 92)} type="number" />
                    </div>

                    <div className="mb-6">
                      <label className="text-[11px] font-black uppercase mb-1.5 block" style={{ color: C.ink }}>Medical Notes</label>
                      <textarea className="w-full h-32 px-4 py-3 border-[3px] border-black text-[14px] font-bold focus:outline-none resize-none"
                        style={{ backgroundColor: C.white, boxShadow: '4px 4px 0px #000', color: C.ink }}
                        defaultValue="Pre-diabetic risk flagged. Family history of hypertension." />
                    </div>
                  </div>
                )}

                {/* ── PANEL 2: METRICS ── */}
                {activeTab === 'metrics' && (
                  <div>
                    <PanelHeader title="Health Metrics" sub="Twin live readings and assessments" action={{ label: '+ Log Fasting Reading' }} />

                    <div className="grid grid-cols-3 gap-5 mb-8">
                      {[
                        { l: 'Fasting Glucose', v: '118', u: 'mg/dL', s: 'Pre-diabetic', i: '🩸', w: true },
                        { l: 'Blood Pressure', v: '138/88', u: 'mmHg', s: 'Stage 1 HTN', i: '🫀', w: true },
                        { l: 'Heart Rate', v: '76', u: 'bpm', s: 'Normal', i: '❤️', w: false },
                        { l: 'Estimated HbA1c', v: '5.8%', u: '3-mo avg', s: 'Borderline', i: '🧪', w: true },
                        { l: 'BMI', v: '30.1', u: 'kg/m²', s: 'Obese Class I', i: '⚖️', w: true },
                        { l: 'Avg Sleep', v: '6.2h', u: 'last 7 days', s: 'Below 7h', i: '😴', w: true },
                      ].map(m => (
                        <div key={m.l} className="border-[3px] border-black p-4 flex flex-col shadow-[5px_5px_0px_#000]"
                          style={{ backgroundColor: C.white }}>
                          <div className="text-[20px] mb-2">{m.i}</div>
                          <div className="text-[10px] font-black uppercase tracking-wider" style={{ color: C.mu }}>{m.l}</div>
                          <div className="text-[28px] font-black tracking-tighter mt-1" style={{ color: C.ink }}>{m.v}</div>
                          <div className="text-[10px] font-bold uppercase mt-1" style={{ color: C.mu }}>{m.u}</div>
                          <div className="mt-auto pt-4 flex">
                            <span className="px-2 py-1 border-[2px] border-black text-[9px] font-black uppercase shadow-[2px_2px_0px_#000]"
                              style={{ backgroundColor: m.w ? C.red : C.green, color: C.white }}>
                              {m.s}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-[4px] border-black p-6 shadow-[6px_6px_0px_#000]" style={{ backgroundColor: C.white }}>
                      <div className="text-[14px] font-black uppercase tracking-wider mb-6 flex justify-between items-center" style={{ color: C.ink }}>
                        30-Day Glucose Trend
                        <span className="text-[10px] px-2 py-1 border-[2px] border-black" style={{ backgroundColor: C.gold, color: C.ink }}>DOWNWARD TRAJECTORY</span>
                      </div>
                      <div className="flex items-end gap-2 h-40 border-b-[3px] border-black pb-1">
                        {[60, 55, 65, 70, 75, 80, 78, 65, 60, 58, 55, 50, 48, 45, 42].map((h, i) => (
                          <div key={i} className="flex-1 border-[2px] border-black transition-all cursor-crosshair min-w-4"
                            style={{ height: `${h}%`, backgroundColor: C.ink }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = C.gold)}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = C.ink)} />
                        ))}
                      </div>
                      <div className="flex justify-between mt-3 text-[10px] font-black uppercase" style={{ color: C.mu }}>
                        <span>Mar 5</span> <span>Today, Apr 4</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── PANEL 3: REPORTS ── */}
                {activeTab === 'reports' && (
                  <div>
                    <PanelHeader title="PDF Health Reports" sub="Shareable AI-generated clinical documents" action={{ label: '+ Generate New', primary: true }} />

                    <div className="grid grid-cols-2 gap-6">
                      {[
                        { t: 'Full Health Assessment', d: 'Apr 1', i: '📋', tag: 'Full Analysis', col: C.gold },
                        { t: 'Clean Living Simulation', d: 'Apr 4', i: '⚡', tag: '1-Month Forecast', col: C.green },
                        { t: 'Chat Report: Glucose', d: 'Apr 4', i: '💬', tag: 'Diet Plan', col: C.white },
                        { t: '30-Day Progress', d: 'Apr 1', i: '📈', tag: 'Trend Report', col: C.white },
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

                {/* ── PANELS 4 & 5: SETTINGS & NOTIFS ── */}
                {(activeTab === 'preferences' || activeTab === 'notifications') && (
                  <div>
                    <PanelHeader
                      title={activeTab === 'preferences' ? "Language & AI" : "Notifications"}
                      sub={activeTab === 'preferences' ? "Calibrate Dr. Vita's processing" : "Alert thresholds"}
                    />

                    {activeTab === 'preferences' && (
                      <>
                        <div className="border-[4px] border-black shadow-[6px_6px_0px_#000] mb-8" style={{ backgroundColor: C.white }}>
                          <div className="p-4 border-b-[3px] border-black flex gap-3 items-center" style={{ backgroundColor: C.beige2 }}>
                            <span className="text-[18px]">🌐</span>
                            <span className="font-black uppercase tracking-wider text-[13px]" style={{ color: C.ink }}>Language Output</span>
                          </div>
                          <div className="p-4 grid grid-cols-4 gap-4">
                            {['🇬🇧 English', '🇮🇳 Hindi', '🇮🇳 Tamil', '🇮🇳 Telugu'].map((l, i) => (
                              <button key={l} className="p-3 border-[3px] border-black font-black uppercase text-[11px] transition-all"
                                style={{
                                  backgroundColor: i === 0 ? C.gold : C.white,
                                  color: C.ink,
                                  boxShadow: i === 0 ? '3px 3px 0px #000' : 'none',
                                }}>
                                {l}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="border-[4px] border-black shadow-[6px_6px_0px_#000] mb-8" style={{ backgroundColor: C.white }}>
                          <div className="p-4 border-b-[3px] border-black flex gap-3 items-center" style={{ backgroundColor: C.beige2 }}>
                            <span className="text-[18px]">🤖</span>
                            <span className="font-black uppercase tracking-wider text-[13px]" style={{ color: C.ink }}>AI Parameters</span>
                          </div>
                          <BToggle label="Gender-Aware Responses" sub="Calibrate using selected metabolic sex" checked={true} onChange={() => {}} />
                          <BToggle label="Research Citations" sub="Include medical references" checked={true} onChange={() => {}} />
                          <BToggle label="Aggressive Goal Tracking" sub="Stricter tone when missing targets" checked={false} onChange={() => {}} />
                        </div>
                      </>
                    )}

                    {activeTab === 'notifications' && (
                      <div className="border-[4px] border-black shadow-[6px_6px_0px_#000]" style={{ backgroundColor: C.white }}>
                        <div className="p-4 border-b-[3px] border-black flex gap-3 items-center" style={{ backgroundColor: C.beige2 }}>
                          <span className="text-[18px]">⚠️</span>
                          <span className="font-black uppercase tracking-wider text-[13px]" style={{ color: C.ink }}>System Alerts</span>
                        </div>
                        <BToggle label="Weekly Health Digest" sub="Monday Morning PDF dispatch" checked={true} onChange={() => {}} />
                        <BToggle label="Risk Score Fluctuations" sub="Alert on ±10% shift" checked={true} onChange={() => {}} />
                        <BToggle label="Daily Log Reminder" sub="Push notification at 08:00 AM" checked={true} onChange={() => {}} />
                        <BToggle label="Simulation Results" sub="Email complete output" checked={false} onChange={() => {}} />
                      </div>
                    )}
                  </div>
                )}

                {/* ── PANEL 6: DEVICES ── */}
                {activeTab === 'devices' && (
                  <div>
                    <PanelHeader title="Connected Hardware" sub="Sync wearables via API" action={{ label: '+ Connect Device', primary: true }} />

                    <div className="space-y-4">
                      {[
                        { n: 'Apple Watch Series 9', t: 'Heart rate, Steps', i: '⌚', a: true },
                        { n: 'Omron BP Monitor', t: 'Blood pressure sync', i: '📊', a: true },
                        { n: 'Fitbit Charge 6', t: 'Disconnected', i: '🏃', a: false }
                      ].map(d => (
                        <div key={d.n} className="border-[4px] border-black p-4 flex items-center gap-4 shadow-[5px_5px_0px_#000]"
                          style={{ backgroundColor: C.white }}>
                          <div className="w-12 h-12 border-[3px] border-black flex items-center justify-center text-[20px] shadow-[2px_2px_0px_#000]"
                            style={{ backgroundColor: d.a ? C.gold : 'transparent', opacity: d.a ? 1 : 0.4 }}>
                            {d.i}
                          </div>
                          <div className="flex-1">
                            <div className="font-black text-[15px] uppercase" style={{ color: C.ink }}>{d.n}</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: C.mu }}>{d.t}</div>
                          </div>
                          <div>
                            {d.a
                              ? <button className="px-4 py-2 border-[2.5px] font-black text-[10px] uppercase transition-all hover:text-white"
                                  style={{ borderColor: C.red, color: C.red }}
                                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = C.red; (e.currentTarget as HTMLButtonElement).style.color = C.white }}
                                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = C.red }}>
                                  Remove
                                </button>
                              : <button className="px-4 py-2 border-[2.5px] border-black font-black text-[10px] uppercase"
                                  style={{ backgroundColor: C.ink, color: C.white }}>
                                  Reconnect
                                </button>
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── PANEL 7: PRIVACY ── */}
                {activeTab === 'privacy' && (
                  <div>
                    <PanelHeader title="Privacy Architecture" sub="You securely own all twin telemetry" />
                    <div className="border-[4px] border-black shadow-[6px_6px_0px_#000] mb-8" style={{ backgroundColor: C.white }}>
                      <BToggle label="Store Chat History" sub="Allow AI contextual memory" checked={true} onChange={() => {}} />
                      <BToggle label="Research Telemetry" sub="Share anonymized metrics" checked={false} onChange={() => {}} />
                      <div className="p-4 border-t-[3px] border-black flex gap-3 text-[11px] font-black uppercase"
                        style={{ backgroundColor: C.beige2, color: C.green }}>
                        ✓ AES-256 ENCRYPTION ACTIVE
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button className="px-6 py-4 border-[4px] border-black font-black uppercase transition-all hover:translate-x-1 hover:translate-y-1"
                        style={{ backgroundColor: C.gold, color: C.ink, boxShadow: '4px 4px 0px #000' }}
                        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0px 0px 0px #000')}
                        onMouseLeave={e => (e.currentTarget.style.boxShadow = '4px 4px 0px #000')}>
                        📦 Export Full Data Payload
                      </button>
                      <button className="px-6 py-4 border-[4px] border-black font-black uppercase transition-all hover:translate-x-1 hover:translate-y-1"
                        style={{ backgroundColor: C.white, color: C.red, boxShadow: '4px 4px 0px #000' }}
                        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0px 0px 0px #000')}
                        onMouseLeave={e => (e.currentTarget.style.boxShadow = '4px 4px 0px #000')}>
                        🗑 Initiate Account Purge
                      </button>
                    </div>
                  </div>
                )}

                {/* ── PANEL 8: PLAN ── */}
                {activeTab === 'plan' && (
                  <div>
                    <PanelHeader title="Billing & Subscription" sub="Review limits and access" />

                    <div className="border-[5px] border-black p-8 relative overflow-hidden mb-6 shadow-[8px_8px_0px_#000]"
                      style={{ backgroundColor: C.green, color: C.white }}>
                      {/* Decorative circle — kept as-is */}
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
    </div>
  )
}
