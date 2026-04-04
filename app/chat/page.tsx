'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { usePatientStore } from '@/store/patientStore'
import { DEMO_PATIENT, MOCK_ANALYSIS } from '@/data/mockData'
import { Topbar } from '@/components/Layout/Topbar'
import { TypoAvatar } from '@/components/Common/TypoAvatar'

// ─── Brulatist Color Tokens ────────────────────────────────────────────────────
const C = {
  beige:         '#F8F5EE',
  beige2:        '#F0EBE0',  // slightly darker cream for sidebar/panel accents
  white:         '#FFFFFF',
  darkGreen:     '#1B5E3B',
  black:         '#0A0F0D',
  electricYellow:'#C9A84C', // Gold accent — matches website palette
  red:           '#C0392B',
  mu:            '#5C7268',  // muted text
}



// ─── Brutalist Silhouette Twin ────────────────────────────────────────────────
function SiliconTwin() {
  return (
    <div className="relative w-full aspect-[2/3] max-h-[170px] flex items-center justify-center py-4 bg-darkGreen/10 border-[3px] border-black shadow-[4px_4px_0px_#000] overflow-hidden"
      style={{ backgroundColor: C.darkGreen }}>
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.1]" style={{
        backgroundImage: 'repeating-linear-gradient(0deg,rgba(255,255,255,.2) 0,rgba(255,255,255,.2) 1px,transparent 1px,transparent 20px),repeating-linear-gradient(90deg,rgba(255,255,255,.2) 0,rgba(255,255,255,.2) 1px,transparent 1px,transparent 20px)'
      }} />
      
      {/* Stark Silhouette */}
      <svg viewBox="0 0 72 170" width="80" height="150" className="relative z-10 transition-transform hover:scale-105 duration-500">
        <style>{`
          @keyframes instantBlink { 0%, 45%, 55%, 100% { opacity: 1 } 50% { opacity: 0 } }
          .blink { animation: instantBlink 1.2s step-end infinite }
        `}</style>
        {/* Head */}
        <circle cx="36" cy="20" r="14" fill={C.beige} stroke="black" strokeWidth="2.5" />
        {/* Torso */}
        <path d="M22 36 L50 36 L48 80 L24 80 Z" fill={C.beige} stroke="black" strokeWidth="2.5" />
        {/* Arms */}
        <path d="M22 40 L12 70 L20 74 L25 45" fill={C.beige} stroke="black" strokeWidth="2" />
        <path d="M50 40 L60 70 L52 74 L47 45" fill={C.beige} stroke="black" strokeWidth="2" />
        {/* Legs */}
        <rect x="24" y="80" width="10" height="70" fill={C.beige} stroke="black" strokeWidth="2" />
        <rect x="38" y="80" width="10" height="70" fill={C.beige} stroke="black" strokeWidth="2" />
        
        {/* Heart Blink Zone */}
        <circle cx="36" cy="50" r="5" fill={C.electricYellow} className="blink" stroke="black" strokeWidth="1.5" />
        <line x1="15" y1="50" x2="31" y2="50" stroke={C.electricYellow} strokeWidth="2" strokeDasharray="3,2" className="blink" />
      </svg>
    </div>
  )
}

// ─── Markdown / Data Injector Helper ──────────────────────────────────────────
const renderFormattedText = (text: string, p: any, bmi: string) => {
  const parsed = text
    .replace(/\[NAME\]/g, p.name.split(' ')[0])
    .replace(/\[GLUCOSE\]/g, String(p.glucose))
    .replace(/\[BP\]/g, `${p.systolic_bp}/${p.diastolic_bp}`)
    .replace(/\[BMI\]/g, bmi)
    .replace(/\[GENDER\]/g, p.gender === 'male' ? 'men' : p.gender === 'female' ? 'women' : 'people')
    .replace(/\[GENDER_SPECIFIC_NOTE\]/g, p.gender === 'male' ? 
      `Men in your age group (30–40) with this profile respond very well to targeted aerobic exercise combined with reduced sodium. Your cardiac risk score dropped 15 points in the simulator when you hit 4× weekly cardio.` 
      : `Women in your age group (30–40) with this profile often have hormone-linked BP variability. Moderate-intensity resistance training dropped your cardiac risk by 12 points in the simulator.`)
  
  const lines = parsed.split('\n')
  return lines.map((line, li) => (
    <React.Fragment key={li}>
      {line.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className="font-black">{part}</strong> : <span key={i}>{part}</span>)}
      {li < lines.length - 1 && <br />}
    </React.Fragment>
  ))
}

// ─── Main Chat Component ───────────────────────────────────────────────────────
export default function ChatPage() {
  const { patient, analysis, chatHistory, addChatMessage, setLoading, loadingChat } = usePatientStore()
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const p = patient || DEMO_PATIENT
  const bmi = (p.weight / ((p.height / 100) ** 2)).toFixed(1)

  // MOCK CHAT DATA
  const MOCK_CHAT: any[] = [
    {
      role: 'assistant',
      content: `Hello, [NAME]. I've reviewed your latest twin data. A few things stand out — your **fasting glucose at [GLUCOSE] mg/dL** puts you in the pre-diabetic range, and your **BP of [BP]** is Stage 1 hypertension territory.\n\n[GENDER_SPECIFIC_NOTE]\n\nWhat would you like to explore today?`,
      qr: ['Why is my glucose elevated?', 'Best foods for my BP', 'Exercise plan for men 34', 'Explain my HbA1c'],
      time: '10:40 AM'
    },
    { role: 'user', content: "Why is my glucose elevated even though I don't eat that much sugar?", time: '10:42 AM' },
    {
      role: 'assistant',
      content: `Great question, [NAME]. Blood glucose isn't just about direct sugar intake — it's more complex, especially for [GENDER] in their 30s.\n\nBased on your twin data, the most likely contributors are:\n\n**1. Insulin resistance** — Your BMI of [BMI] combined with a sedentary work lifestyle creates systemic insulin resistance. Even complex carbs spike glucose hard.\n\n**2. Cortisol spikes** — Your stress score (7/10 in last session) triggers gluconeogenesis — your liver literally makes glucose from non-sugar sources overnight.\n\n**3. Sleep quality** — People who sleep under 7 hours see a 15–20% rise in morning glucose. Your twin clocked 6.2hrs average last week.`,
      contextSnippet: { 
        title: 'Twin Baseline Constraints', 
        items: [
          { l: 'Your glucose', v: '[GLUCOSE] mg/dL ⚠️' },
          { l: 'Normal range', v: '< 100 mg/dL' },
          { l: 'Your sleep avg', v: '6.2 hrs / night' },
          { l: 'Stress score', v: '7 / 10' }
        ] 
      },
      qr: ['How to lower cortisol?', 'Sleep tips for glucose', 'Foods that spike insulin'],
      time: '10:42 AM'
    },
    { role: 'user', content: "What's a realistic diet change I can actually stick to?", time: '10:45 AM' },
    {
      role: 'assistant',
      content: `I'll keep this practical, [NAME]. Based on your profile and the **Clean Living simulation** that dropped your glucose to 98 mg/dL, here's what actually moved the needle:\n\n**The 3 changes with the highest impact:**\n\n🥗 **Swap white rice → bajra / oats** — Cuts your post-meal glucose spike by ~30%. Easy win for Indian meals.\n\n🧂 **Sodium under 1,500mg/day** — Your BP drops 8–12 points within 2 weeks. Read labels; bread is the #1 hidden source.\n\n☕ **No carbs in the first hour after waking** — Your cortisol is highest at 7–9am. Protein-first breakfast (eggs, paneer) blunts the glucose rise.\n\nThese three changes alone gave your twin a **+14 point health score** in the 1-month simulation.`,
      qr: ['Protein-first breakfast ideas', 'What\'s a good sodium count?', 'Run a new simulation →'],
      time: '10:46 AM'
    }
  ]

  // Combine mock chat with user history
  const combinedChat = [...MOCK_CHAT, ...chatHistory]

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [combinedChat])

  const handleSend = () => {
    if (!input.trim() || loadingChat) return
    const userMsg = input.trim()
    addChatMessage({ role: 'user', content: userMsg })
    setInput('')
    
    setLoading('chat', true)
    setTimeout(() => {
      addChatMessage({ 
        role: 'assistant', 
        content: `Acknowledged. Based on your current clinical data (BP: ${p.systolic_bp}/${p.diastolic_bp} mmHg, Glucose: ${p.glucose} mg/dL), your twin suggests a high sensitivity to cortisol triggers. Running a complete simulation now...` 
      })
      setLoading('chat', false)
    }, 1500)
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden leading-tight" style={{ backgroundColor: C.beige, color: C.black, fontFamily: "'Inter', sans-serif" }}>
      
      {/* ── TOP NAVIGATION ── */}
      <Topbar />

      {/* ── MAIN 3-COLUMN LAYOUT ── */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* LEFT COLUMN: Patient Context */}
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
                { l: 'BP', v: `${p.systolic_bp}/${p.diastolic_bp}` },
                { l: 'Glucose', v: `${p.glucose} mg/dL` },
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
            style={{ backgroundColor: C.electricYellow, color: C.black, boxShadow: '4px 4px 0px #000' }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0px 0px 0px #000')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = '4px 4px 0px #000')}>
            + New Chat Thread
          </button>
        </aside>

        {/* CENTER COLUMN: Chat Hub */}
        <section className="flex-1 flex flex-col bg-transparent overflow-hidden relative">
          
          {/* Chat Top Bar */}
          <div className="px-6 py-4 border-b-[3px] border-black flex justify-between items-center z-10 shadow-[0px_4px_0px_#000] shrink-0"
            style={{ backgroundColor: C.beige }}>
            <div>
              <div className="text-[16px] font-black uppercase flex items-center gap-2" style={{ color: C.black }}>
                <span className="w-2.5 h-2.5 bg-green-500 border-[2px] border-black rounded-full animate-pulse" />
                VitaNomy AI · Dr. Vita
              </div>
              <div className="text-[11px] font-bold tracking-wide uppercase mt-1" style={{ color: C.mu }}>Analysing {p.name.split(' ')[0]}'s twin · Gender-calibrated</div>
            </div>
            <div className="flex gap-3">
              <span className="px-3 py-1.5 border-[2px] border-black text-[10px] font-black uppercase shadow-[2px_2px_0px_#000]"
                style={{ backgroundColor: C.white, color: C.black }}>{p.gender} Calibration</span>
              <span className="px-3 py-1.5 border-[2px] border-black text-[10px] font-black uppercase shadow-[2px_2px_0px_#000]"
                style={{ backgroundColor: C.electricYellow, color: C.black }}>Claude 3.5</span>
            </div>
          </div>

          {/* Messages Area */}
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
                        
                        {/* Typographic Badge for Mode (AI only) */}
                        {m.role === 'assistant' && (
                          <div className="mb-3 text-[10px] font-black">
                            <span className="border-[2px] border-black px-2 py-1 uppercase tracking-tighter shadow-[1.5px_1.5px_0px_#000]"
                              style={{ backgroundColor: C.beige, color: C.darkGreen }}>
                              {p.gender.toUpperCase()}-Calibrated Response
                            </span>
                          </div>
                        )}

                        {/* Message Content */}
                        <div className="text-[15px] leading-relaxed font-medium">
                          {renderFormattedText(m.content, p, bmi)}
                        </div>

                        {/* Specific Context Snippet */}
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
                                  <span className="text-[13px] font-black whitespace-nowrap" style={{ color: C.black }}>{item.v.replace(/\[GLUCOSE\]/, String(p.glucose))}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Quick Replies */}
                        {m.qr && (
                          <div className="flex flex-wrap gap-2.5 mt-5">
                            {m.qr.map((q: string) => (
                              <button key={q} onClick={() => setInput(q)}
                                className="px-3 py-2 border-[2.5px] border-black text-[11px] font-black uppercase transition-all text-left leading-tight"
                                style={{ backgroundColor: C.beige, color: C.black, boxShadow: '3px 3px 0px #000' }}
                                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = C.darkGreen; (e.currentTarget as HTMLButtonElement).style.color = C.white; (e.currentTarget as HTMLButtonElement).style.boxShadow = '1px 1px 0px #000' }}
                                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = C.beige; (e.currentTarget as HTMLButtonElement).style.color = C.black; (e.currentTarget as HTMLButtonElement).style.boxShadow = '3px 3px 0px #000' }}>
                                {q}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Meta Footer */}
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
                    <span className="w-2.5 h-2.5 bg-black rounded-sm animate-pulse delay-0"></span>
                    <span className="w-2.5 h-2.5 bg-black rounded-sm animate-pulse delay-100"></span>
                    <span className="w-2.5 h-2.5 bg-black rounded-sm animate-pulse delay-200"></span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Empty space block for scroll bottom */}
            <div className="h-6 w-full shrink-0"></div>
          </div>

          {/* INPUT AREA */}
          <div className="p-6 border-t-[3px] border-black z-10 shrink-0" style={{ backgroundColor: C.beige }}>
            <div className="flex justify-between items-end gap-5">
              
              <div className="flex-1 flex flex-col gap-3">
                 <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                    <select className="px-3 py-1.5 border-[2.5px] border-black text-[11px] font-black uppercase shadow-[2px_2px_0px_#000] bg-white cursor-pointer focus:outline-none">
                      <option>🌐 English</option>
                      <option>हिं हिंदी</option>
                      <option>த தமிழ்</option>
                    </select>
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
                      placeholder="Ask Dr. Vita about your health, diet, medication, or simulate a scenario..."
                      className="w-full bg-transparent p-4 pb-4 pr-24 text-[15px] font-bold focus:outline-none resize-none align-bottom h-full"
                      rows={1}
                    />
                    <div className="absolute right-3 bottom-3 flex gap-2">
                       <button className="w-8 h-8 border-[2.5px] border-black bg-beige flex items-center justify-center font-black hover:bg-darkGreen hover:text-white transition-colors" title="Voice Input">🎤</button>
                       <button className="w-8 h-8 border-[2.5px] border-black bg-beige flex items-center justify-center font-black hover:bg-darkGreen hover:text-white transition-colors" title="Attach Report">📎</button>
                    </div>
                 </div>
              </div>
              
              <button 
                onClick={handleSend}
                disabled={loadingChat || !input.trim()}
                className="h-[72px] px-8 border-[4px] border-black flex items-center justify-center transition-all group shrink-0 mt-auto disabled:opacity-50"
                style={{ backgroundColor: C.electricYellow, boxShadow: '6px 6px 0px #000' }}
                onMouseEnter={e => { if (!(e.currentTarget as HTMLButtonElement).disabled) { (e.currentTarget as HTMLButtonElement).style.transform = 'translate(1.5px,1.5px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0px 0px 0px #000' }}}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translate(0,0)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '6px 6px 0px #000' }}
              >
                <span className="font-black text-[18px] uppercase tracking-widest mr-2 group-hover:mr-4 transition-all" style={{ color: C.black }}>Send</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:translate-x-1">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="text-center mt-4 text-[10px] font-black uppercase tracking-[0.1em]" style={{ color: C.mu }}>
              Dr. Vita is AI-powered and not a substitute for professional medical advice. Always consult your doctor.
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Twins & Metrics */}
        <aside className="w-[300px] border-l-[3px] border-black bg-transparent shrink-0 overflow-y-auto">
          
          <div className="p-5 border-b-[3px] border-black" style={{ backgroundColor: C.beige2 }}>
            <div className="flex justify-between items-center mb-4">
              <span className="text-[12px] font-black uppercase tracking-[0.1em]" style={{ color: C.mu }}>Live Twin</span>
              <span className="px-2 py-0.5 border-[2px] border-black text-[10px] font-black uppercase shadow-[2px_2px_0px_#000]"
                style={{ backgroundColor: C.electricYellow, color: C.black }}>Active</span>
            </div>
            
            <SiliconTwin />
            
            <div className="mt-5 space-y-3">
               {[
                { l: 'Glucose', v: '118 mg/dL', w: '59%', bg: C.electricYellow },
                { l: 'BP Systolic', v: '138 mmHg', w: '69%', bg: C.electricYellow },
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
                { label: 'Diabetes', score: 44, icon: '🩸', col: '#FACC15' },
                { label: 'Cardiac', score: 55, icon: '❤️', col: C.red },
                { label: 'Hypertension', score: 49, icon: '🫀', col: '#FACC15' }
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
                <button key={q} onClick={() => setInput(q)}
                  className="px-3 py-1.5 border-[2.5px] border-black text-[11px] font-black uppercase transition-all text-left"
                  style={{ backgroundColor: C.white, boxShadow: '2.5px 2.5px 0px #000', color: C.black }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = C.darkGreen; (e.currentTarget as HTMLButtonElement).style.color = C.white }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = C.white; (e.currentTarget as HTMLButtonElement).style.color = C.black }}>
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 border-t-[3px] border-black text-white text-center" style={{ backgroundColor: C.darkGreen }}>
             <div className="font-black text-[14px] uppercase tracking-widest mb-1.5 opacity-80">"Mock Early"</div>
             <div className="text-[10px] font-bold uppercase tracking-wider text-white/50">Clinical Neobrutalism V2.0</div>
          </div>
        </aside>
      </main>
    </div>
  )
}
