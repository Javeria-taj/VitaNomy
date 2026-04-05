'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { usePatientStore } from '@/store/patientStore'
import { useTranslation } from '@/hooks/useTranslation'
import { ChatMessage } from '@/types/patient'
import { Topbar } from '@/components/Layout/Topbar'
import { TypoAvatar } from '@/components/Common/TypoAvatar'

// ─── Brulatist Color Tokens ────────────────────────────────────────────────────
const C = {
  beige: '#F8F5EE',
  beige2: '#F0EBE0',
  white: '#FFFFFF',
  darkGreen: '#1B5E3B',
  black: '#0A0F0D',
  electricYellow: '#C9A84C',
  red: '#C0392B',
  mu: '#5C7268',
  goldPale: '#F7EDD0',
}

// ─── Brutalist Silhouette Twin ────────────────────────────────────────────────
function SiliconTwin() {
  return (
    <div className="relative w-full aspect-[2/3] max-h-[170px] flex items-center justify-center py-4 bg-darkGreen/10 border-[3px] border-black shadow-[4px_4px_0px_#000] overflow-hidden"
      style={{ backgroundColor: C.darkGreen }}>
      <div className="absolute inset-0 opacity-[0.1]" style={{
        backgroundImage: 'repeating-linear-gradient(0deg,rgba(255,255,255,.2) 0,rgba(255,255,255,.2) 1px,transparent 1px,transparent 20px),repeating-linear-gradient(90deg,rgba(255,255,255,.2) 0,rgba(255,255,255,.2) 1px,transparent 1px,transparent 20px)'
      }} />

      <svg viewBox="0 0 72 170" width="80" height="150" className="relative z-10 transition-transform hover:scale-105 duration-500">
        <style>{`
          @keyframes instantBlink { 0%, 45%, 55%, 100% { opacity: 1 } 50% { opacity: 0 } }
          .blink { animation: instantBlink 1.2s step-end infinite }
        `}</style>
        <circle cx="36" cy="20" r="14" fill={C.beige} stroke="black" strokeWidth="2.5" />
        <path d="M22 36 L50 36 L48 80 L24 80 Z" fill={C.beige} stroke="black" strokeWidth="2.5" />
        <path d="M22 40 L12 70 L20 74 L25 45" fill={C.beige} stroke="black" strokeWidth="2" />
        <path d="M50 40 L60 70 L52 74 L47 45" fill={C.beige} stroke="black" strokeWidth="2" />
        <rect x="24" y="80" width="10" height="70" fill={C.beige} stroke="black" strokeWidth="2" />
        <rect x="38" y="80" width="10" height="70" fill={C.beige} stroke="black" strokeWidth="2" />
        <circle cx="36" cy="50" r="5" fill={C.electricYellow} className="blink" stroke="black" strokeWidth="1.5" />
        <line x1="15" y1="50" x2="31" y2="50" stroke={C.electricYellow} strokeWidth="2" strokeDasharray="3,2" className="blink" />
      </svg>
    </div>
  )
}

const renderFormattedText = (text: string, p: any, bmi: string) => {
  if (!text) return null
  const parsed = text
    .replace(/\[NAME\]/g, p.name?.split(' ')[0] || 'Patient')
    .replace(/\[GLUCOSE\]/g, String(p.glucose || 0))
    .replace(/\[BP\]/g, `${p.systolic_bp || 0}/${p.diastolic_bp || 0}`)
    .replace(/\[BMI\]/g, bmi)
    .replace(/\[GENDER\]/g, p.gender === 'male' ? 'men' : p.gender === 'female' ? 'women' : 'people')
    .replace(/\[GENDER_SPECIFIC_NOTE\]/g, p.gender === 'male' ?
      `Men in your age group with this profile respond very well to targeted aerobic exercise.`
      : `Women in your age group with this profile often have hormone-linked BP variability.`)

  const lines = parsed.split('\n')
  return lines.map((line, li) => (
    <React.Fragment key={li}>
      {line.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className="font-black">{part}</strong> : <span key={i}>{part}</span>)}
      {li < lines.length - 1 && <br />}
    </React.Fragment>
  ))
}

const getScore = (val: any): number => typeof val === 'number' ? val : (val?.score ?? 0);

export default function ChatPage() {
  const { patient, analysis, chatHistory, addChatMessage, setLoading, loadingChat } = usePatientStore()
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const p = patient
  const bmi = p ? (p.weight / ((p.height / 100) ** 2)).toFixed(1) : '0'

  const combinedChat: ChatMessage[] = chatHistory.length > 0 ? chatHistory : (p ? [
    {
      role: 'assistant',
      content: `Hello, ${p.name?.split(' ')[0] || 'Patient'}. I've localized your clinical twin. Your **glucose of ${p.glucose} mg/dL** and **BP of ${p.systolic_bp}/${p.diastolic_bp}** are our primary focus. How can I help you optimize these today?`,
      qr: ['Why is my glucose elevated?', 'How to lower my BP?', 'Run a risk simulation'],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ] : [])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [combinedChat])

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim()
    if (!messageText || loadingChat || !p || !analysis) return

    const userMsg: ChatMessage = {
      role: 'user',
      content: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    addChatMessage(userMsg)
    setInput('')

    setLoading('chat', true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient: p,
          analysis: analysis,
          history: chatHistory.slice(-10),
          message: messageText
        })
      })

      if (!res.ok) throw new Error('Dr. Vita is currently unavailable.')

      const data = await res.json()
      addChatMessage({
        role: 'assistant',
        content: data.reply || 'I could not process that. Please try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })
    } catch (err: any) {
      addChatMessage({
        role: 'assistant',
        content: 'Connection issue. Please try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })
    } finally {
      setLoading('chat', false)
    }
  }

  if (!patient || !analysis) {
    return (
      <div className="h-screen w-screen flex flex-col" style={{ backgroundColor: C.beige, color: C.black, fontFamily: "'Inter', sans-serif" }}>
        <Topbar />
        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
          <div className="w-24 h-24 border-[4px] border-black flex items-center justify-center text-[40px] mb-8 shadow-[8px_8px_0px_#000]"
            style={{ backgroundColor: C.goldPale }}>
            💬
          </div>
          <h1 className="text-[32px] font-black uppercase tracking-tighter mb-4">{t.chat.locked}</h1>
          <p className="max-w-md text-[14px] font-bold leading-relaxed mb-10 text-mu">
            {t.chat.lockedDesc}
          </p>
          <Link href="/chat"
            className="px-10 py-5 border-[4px] border-black bg-darkGreen text-white font-black text-[18px] uppercase tracking-widest shadow-[8px_8px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center">
            {t.chat.initTwin} &rarr;
          </Link>
        </div>
      </div>
    )
  }

  const p = patient
  const bmi = (p.weight / ((p.height / 100) ** 2)).toFixed(1)

  const combinedChat: ChatMessage[] = chatHistory.length > 0 ? chatHistory : [
    {
      role: 'assistant',
      content: `Hello, ${p.name?.split(' ')[0] || 'Patient'}. I've localized your clinical twin. Your **glucose of ${p.glucose} mg/dL** and **BP of ${p.systolic_bp}/${p.diastolic_bp}** are our primary focus. How can I help you optimize these today?`,
      qr: ['Why is my glucose elevated?', 'How to lower my BP?', 'Run a risk simulation'],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [combinedChat])

  const handleSend = async () => {
    if (!input.trim() || loadingChat) return
    const userMsg = input.trim()

    const userChatMessage: ChatMessage = {
      role: 'user',
      content: userMsg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    addChatMessage(userChatMessage)
    setInput('')

    setLoading('chat', true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient: p,
          analysis: analysis,
          message: userMsg,
          history: chatHistory
        })
      })

      if (!res.ok) {
        throw new Error('Dr. Vita is currently unavailable. Please try again.')
      }

      const data = await res.json()
      addChatMessage({
        role: 'assistant',
        content: data.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })
    } catch (err: any) {
      addChatMessage({
        role: 'assistant',
        content: `⚠ Error: ${err.message || 'Connection lost.'}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })
    } finally {
      setLoading('chat', false)
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden leading-tight" style={{ backgroundColor: C.beige, color: C.black, fontFamily: "'Inter', sans-serif" }}>
      <Topbar />

      <main className="flex-1 flex overflow-hidden">
        <aside className="w-[300px] border-r-[3px] border-black flex flex-col bg-transparent shrink-0 overflow-y-auto">
          <div className="p-5 border-b-[3px] border-black">
            <div className="text-[12px] font-black uppercase tracking-[0.1em] mb-4 text-mu">Patient Profile</div>

            <div className="flex flex-col items-center p-5 border-[3px] border-black shadow-[4px_4px_0px_#000] mb-5"
              style={{ backgroundColor: C.white }}>
              <TypoAvatar name={p.name} size="lg" />
              <div className="text-[18px] font-black mt-4 uppercase tracking-tighter" style={{ color: C.black }}>{p.name}</div>
              <div className="flex gap-2 mt-2">
                <span className="px-3 py-1 border-[2.5px] border-black text-[10px] font-black uppercase"
                  style={{ backgroundColor: C.darkGreen, color: C.white }}>{p.gender}</span>
                <span className="px-3 py-1 border-[2.5px] border-black text-[10px] font-black uppercase"
                  style={{ backgroundColor: C.beige, color: C.black }}>{p.age} Yrs</span>
              </div>
            </div>

            <div className="space-y-2">
              {[
                { l: 'BP', v: `${p.systolic_bp || 0}/${p.diastolic_bp || 0}` },
                { l: 'Glucose', v: `${p.glucose || 0} mg/dL` },
                { l: 'Heart Rate', v: `76 bpm` },
                { l: 'HbA1c', v: `5.8%` },
              ].map(stat => (
                <div key={stat.l} className="flex justify-between items-center px-4 py-2.5 border-[3px] border-black bg-white shadow-[2px_2px_0px_#000]">
                  <span className="text-[11px] font-black text-mu uppercase">{stat.l}</span>
                  <span className="text-[14px] font-black">{stat.v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 p-5">
            <div className="text-[12px] font-black uppercase tracking-[0.1em] mb-4 text-mu">Activity History</div>
            <div className="space-y-3">
              {[
                { title: 'Cardiac risk & diet', meta: 'Today · 14 msgs', active: true },
                { title: 'Sleep & hypertension', meta: 'Yesterday', active: false },
                { title: 'Keto diet impact', meta: '2 days ago', active: false },
                { title: 'Exercise recommendations', meta: 'Apr 1', active: false },
                { title: 'Understanding HbA1c', meta: 'Mar 28', active: false },
              ].map((item) => (
                <div key={item.title}
                  className="p-4 border-[3px] border-black shadow-[4px_4px_0px_#000] cursor-pointer transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                  style={{ backgroundColor: item.active ? C.white : 'transparent', opacity: item.active ? 1 : 0.6 }}>
                  <div className="text-[13px] font-black uppercase leading-tight" style={{ color: C.black }}>{item.title}</div>
                  <div className="text-[10px] font-bold mt-2 uppercase" style={{ color: C.mu }}>
                    {item.meta}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="m-5 p-4 border-[3px] border-black font-black text-[13px] uppercase tracking-wider transition-all hover:translate-x-1 hover:translate-y-1"
            style={{ backgroundColor: C.electricYellow, color: C.black, boxShadow: '4px 4px 0px #000' }}>
            + New Chat Thread
          </button>
        </aside>

        <section className="flex-1 flex flex-col bg-transparent overflow-hidden relative">
          <div className="px-6 py-4 border-b-[3px] border-black flex justify-between items-center z-10 shadow-[0px_4px_0px_#000] shrink-0"
            style={{ backgroundColor: C.beige }}>
            <div>
              <div className="text-[16px] font-black uppercase flex items-center gap-2" style={{ color: C.black }}>
                <span className="w-2.5 h-2.5 bg-green-500 border-[2px] border-black rounded-full animate-pulse" />
                VitaNomy AI · Dr. Vita
              </div>
              <div className="text-[11px] font-bold tracking-wide uppercase mt-1" style={{ color: C.mu }}>Analysing {p.name?.split(' ')[0] || 'Patient'}'s twin · Gender-calibrated</div>
            </div>
            <div className="flex gap-3">
              <span className="px-3 py-1.5 border-[2px] border-black text-[10px] font-black uppercase shadow-[2px_2px_0px_#000]"
                style={{ backgroundColor: C.white, color: C.black }}>{p.gender} Calibration</span>
              <span className="px-3 py-1.5 border-[2px] border-black text-[10px] font-black uppercase shadow-[2px_2px_0px_#000]"
                style={{ backgroundColor: C.electricYellow, color: C.black }}>Claude 3.5</span>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-10 scroll-smooth">
            <div className="flex justify-center mb-6">
              <span className="text-[11px] font-black px-5 py-2 border-[3px] border-black bg-beige shadow-[3px_3px_0px_#000] uppercase tracking-widest text-mu">
                Today, {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <AnimatePresence initial={false}>
              {combinedChat.map((m, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-4 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <TypoAvatar name={m.role === 'user' ? p.name : 'V'} bg={m.role === 'user' ? C.darkGreen : C.white} size="md" />

                    <div className="flex flex-col">
                      <div className="relative border-[3px] border-black p-5 shadow-[6px_6px_0px_#000] transition-all"
                        style={{ backgroundColor: m.role === 'user' ? C.darkGreen : C.white, color: m.role === 'user' ? C.white : C.black }}>

                        {m.role === 'assistant' && (
                          <div className="mb-3 text-[10px] font-black">
                            <span className="border-[2px] border-black px-2 py-1 uppercase tracking-tighter shadow-[1.5px_1.5px_0px_#000]"
                              style={{ backgroundColor: C.beige, color: C.darkGreen }}>
                              {p.gender?.toUpperCase()}-Calibrated Response
                            </span>
                          </div>
                        )}

                        <div className="text-[15px] leading-relaxed font-medium">
                          {renderFormattedText(m.content, p, bmi)}
                        </div>

                        {m.contextSnippet && (
                          <div className="mt-5 p-4 border-[3px] border-black shadow-[4px_4px_0px_#000]"
                            style={{ backgroundColor: C.electricYellow, color: C.black }}>
                            <div className="text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                              <span className="w-2 h-2 border-[1.5px] border-black bg-white rounded-full" />
                              {m.contextSnippet.title}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              {m.contextSnippet.items.map((item: any, id: number) => (
                                <div key={id} className="flex flex-col border-[2.5px] border-black p-2.5 shadow-[2.5px_2.5px_0px_#000]"
                                  style={{ backgroundColor: C.white }}>
                                  <span className="text-[10px] font-black uppercase mb-0.5" style={{ color: C.mu }}>{item.l}</span>
                                  <span className="text-[13px] font-black whitespace-nowrap" style={{ color: C.black }}>{item.v?.replace(/\[GLUCOSE\]/, String(p.glucose || 0))}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {m.qr && (
                          <div className="flex flex-wrap gap-2.5 mt-5">
                            {m.qr.map((q: string) => (
                              <button key={q} onClick={() => handleSend(q)}
                                className="px-3 py-2 border-[2.5px] border-black text-[11px] font-black uppercase transition-all text-left leading-tight bg-beige text-black shadow-[3px_3px_0px_#000] hover:bg-darkGreen hover:text-white hover:shadow-[1px_1px_0px_#000]">
                                {q}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className={`text-[10px] font-black mt-3 uppercase tracking-wider ${m.role === 'user' ? 'text-right' : ''}`}
                        style={{ color: C.mu }}>
                        {m.role === 'assistant'
                          ? <span className="border-[1.5px] border-black px-1.5 py-0.5 mr-2" style={{ backgroundColor: C.beige, color: C.black }}>Claude-Sonnet</span>
                          : ''}
                        {m.time || new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {loadingChat && (
              <div className="flex justify-start">
                <div className="flex gap-4 max-w-[85%]">
                  <TypoAvatar name="V" bg={C.white} size="md" />
                  <div className="border-[3px] border-black bg-white px-5 py-4 shadow-[6px_6px_0px_#000] flex gap-2 items-center rounded-md">
                    <span className="w-2.5 h-2.5 bg-black rounded-sm animate-pulse"></span>
                    <span className="w-2.5 h-2.5 bg-black rounded-sm animate-pulse delay-100"></span>
                    <span className="w-2.5 h-2.5 bg-black rounded-sm animate-pulse delay-200"></span>
                  </div>
                </div>
              </div>
            )}
            <div className="h-6 w-full shrink-0"></div>
          </div>

          <div className="p-6 border-t-[3px] border-black z-10 shrink-0" style={{ backgroundColor: C.beige }}>
            <div className="flex justify-between items-end gap-5">
              <div className="flex-1 flex flex-col gap-3">
                <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                  <button className="px-3 py-1.5 border-[2.5px] border-black bg-white text-[11px] font-black uppercase shadow-[2px_2px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[0px_0px_0px_#000]">
                    🧬 Twin Baseline
                  </button>
                  <button className="px-3 py-1.5 border-[2.5px] border-black bg-white text-[11px] font-black uppercase shadow-[2px_2px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[0px_0px_0px_#000]">
                    ⚡ Simulator Link
                  </button>
                </div>

                <div className="relative border-[4px] border-black bg-white shadow-[6px_6px_0px_#000] flex items-end min-h-[72px] focus-within:shadow-[3px_3px_0px_#000] focus-within:translate-x-[3px] focus-within:translate-y-[3px] transition-all">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                    placeholder={t.chat.inputPlaceholder}
                    disabled={loadingChat}
                    className="w-full bg-transparent p-4 pb-4 pr-24 text-[15px] font-bold focus:outline-none resize-none align-bottom h-full disabled:opacity-30"
                    rows={1}
                  />
                  <div className="absolute right-3 bottom-3 flex gap-2">
                    <button className="w-8 h-8 border-[2.5px] border-black bg-beige flex items-center justify-center font-black hover:bg-darkGreen hover:text-white transition-colors">🎤</button>
                    <button className="w-8 h-8 border-[2.5px] border-black bg-beige flex items-center justify-center font-black hover:bg-darkGreen hover:text-white transition-colors">📎</button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleSend()}
                disabled={loadingChat || !input.trim()}
                className="h-[72px] px-8 border-[4px] border-black flex items-center justify-center transition-all group shrink-0 mt-auto disabled:opacity-50"
                style={{ backgroundColor: C.electricYellow, boxShadow: '6px 6px 0px #000' }}
              >
                <span className="font-black text-[18px] uppercase tracking-widest mr-2 group-hover:mr-4 transition-all" style={{ color: C.black }}>Send</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:translate-x-1">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <div className="text-center mt-4 text-[10px] font-black uppercase tracking-[0.1em]" style={{ color: C.mu }}>
              Dr. Vita is AI-powered and not a substitute for professional medical advice. Always consult your doctor.
            </div>
          </div>
        </section>

        <aside className="w-[300px] border-l-[3px] border-black bg-transparent shrink-0 overflow-y-auto">
          <div className="p-5 border-b-[3px] border-black" style={{ backgroundColor: C.beige2 }}>
            <div className="flex justify-between items-center mb-4">
              <span className="text-[12px] font-black uppercase tracking-[0.1em]" style={{ color: C.mu }}>Live Twin</span>
              <span className="px-2 py-0.5 border-[2px] border-black text-[10px] font-black uppercase shadow-[2px_2px_0px_#000] bg-electricYellow text-black">Active</span>
            </div>

            <SiliconTwin />

            <div className="mt-5 space-y-3">
              {[
                { l: 'Glucose', v: `${p.glucose || 0} mg/dL`, w: `${Math.min(100, (p.glucose || 0) / 2)}%`, bg: C.electricYellow },
                { l: 'BP Systolic', v: `${p.systolic_bp || 0} mmHg`, w: `${Math.min(100, (p.systolic_bp || 0) / 2)}%`, bg: C.electricYellow },
                { l: 'Heart Rate', v: '76 bpm', w: '38%', bg: '#7EC8A0' }
              ].map(v => (
                <div key={v.l} className="flex flex-col gap-1">
                  <div className="flex justify-between text-[11px] font-black">
                    <span className="text-mu uppercase">{v.l}</span>
                    <span>{v.v}</span>
                  </div>
                  <div className="h-2 border-[2px] border-black" style={{ backgroundColor: C.beige }}>
                    <div className="h-full border-r-[2px] border-black" style={{ width: v.w, backgroundColor: v.bg }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 border-b-[3px] border-black bg-transparent">
            <div className="text-[12px] font-black uppercase tracking-[0.1em] mb-4 text-mu">Risk Snapshot</div>
            <div className="space-y-4">
              {[
                { label: 'Diabetes', score: getScore(analysis.risk_scores.diabetes), icon: '🩸', col: '#FACC15' },
                { label: 'Cardiac', score: getScore(analysis.risk_scores.cardiac), icon: '❤️', col: C.red },
                { label: 'Hypertension', score: getScore(analysis.risk_scores.hypertension), icon: '🫀', col: '#FACC15' }
              ].map(risk => (
                <div key={risk.label} className="p-4 border-[3px] border-black shadow-[4px_4px_0px_#000]" style={{ backgroundColor: C.white }}>
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-[13px] font-black uppercase flex items-center gap-2" style={{ color: C.black }}><span>{risk.icon}</span>{risk.label}</span>
                    <span className="text-[18px] font-black" style={{ color: risk.score > 50 ? C.red : C.black }}>{risk.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5">
            <div className="text-[12px] font-black uppercase tracking-[0.1em] mb-4 text-mu">Ask About</div>
            <div className="flex flex-wrap gap-2.5">
              {[
                'Diet for pre-diabetes', 'Exercise plan', 'Reduce BP naturally', 'Medication side effects', 'Sleep & blood sugar', 'Interpret my HbA1c'
              ].map(q => (
                <button key={q} onClick={() => handleSend(q)}
                  className="px-3 py-1.5 border-[2.5px] border-black text-[11px] font-black uppercase transition-all text-left bg-white text-black shadow-[2.5px_2.5px_0px_#000] hover:bg-darkGreen hover:text-white">
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 border-t-[3px] border-black text-white text-center" style={{ backgroundColor: C.darkGreen }}>
            <div className="font-black text-[14px] uppercase tracking-widest mb-1.5 opacity-80">"Clinical Chat"</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/50">VitaTwin Intelligence V1.4</div>
          </div>
        </aside>
      </main>
    </div>
  )
}
