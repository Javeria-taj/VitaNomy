'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { usePatientStore } from '@/store/patientStore'
import { DEMO_PATIENT, MOCK_ANALYSIS } from '@/data/mockData'

// ─── Brulatist Color Tokens ────────────────────────────────────────────────────
const C = {
  beige: '#F8F5EE',
  white: '#FFFFFF',
  darkGreen: '#113826',
  black: '#0A0F0D',
  electricYellow: '#BAFF39', // Neon aggressive yellow
  mu: '#5C7268',
  mu2: '#8AA090',
  gridScale: 'rgba(17,56,38,0.05)',
}

// ─── Typographic Avatar ───────────────────────────────────────────────────────
function TypoAvatar({ name, size = 'sm', bg = C.darkGreen, color = C.white }: { 
  name: string; size?: 'sm' | 'md' | 'lg'; bg?: string; color?: string 
}) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const dimensions = size === 'sm' ? 'w-8 h-8 text-[11px]' : size === 'md' ? 'w-10 h-10 text-[13px]' : 'w-14 h-14 text-[22px]'
  return (
    <div className={`${dimensions} border-[2.5px] border-black flex items-center justify-center font-black shadow-[2.5px_2.5px_0px_#000] z-10 shrink-0`}
      style={{ backgroundColor: bg, color }}>
      {initials}
    </div>
  )
}

// ─── Brutalist Silhouette Twin ────────────────────────────────────────────────
function SiliconTwin() {
  return (
    <div className="relative w-full aspect-[2/3] max-h-[180px] flex items-center justify-center py-4 bg-darkGreen/10 border-[3px] border-black shadow-[3px_3px_0px_#000] overflow-hidden"
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
        <circle cx="36" cy="50" r="5" fill="red" className="blink" />
        <line x1="15" y1="50" x2="31" y2="50" stroke="red" strokeWidth="1.5" strokeDasharray="3,2" className="blink" />
      </svg>
    </div>
  )
}

// ─── Main Chat Component ───────────────────────────────────────────────────────
export default function ChatPage() {
  const { patient, analysis, chatHistory, addChatMessage, setLoading, loadingChat } = usePatientStore()
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const p = patient || DEMO_PATIENT
  const a = analysis || MOCK_ANALYSIS
  const bmi = (p.weight / ((p.height / 100) ** 2)).toFixed(1)

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [chatHistory])

  const handleSend = async () => {
    if (!input.trim() || loadingChat) return
    const userMsg = input.trim()
    addChatMessage({ role: 'user', content: userMsg })
    setInput('')
    
    // Simulate AI response
    setLoading('chat', true)
    setTimeout(() => {
      addChatMessage({ 
        role: 'assistant', 
        content: `Acknowledged. Based on your current clinical data (BP: ${p.systolic_bp}/${p.diastolic_bp} mmHg, Glucose: ${p.glucose} mg/dL), your twin suggests a high sensitivity to sodium. Men aged ${p.age} with this profile typically see an 8% risk reduction after 14 days of potassium-rich dietary integration.` 
      })
      setLoading('chat', false)
    }, 1500)
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden" style={{ backgroundColor: C.beige, color: C.black, fontFamily: "'Inter', sans-serif" }}>
      
      {/* ── TOP NAVIGATION ── */}
      <nav className="flex items-center justify-between px-6 py-3 border-b-[3px] border-black bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-black bg-darkGreen flex items-center justify-center shadow-[2.5px_2.5px_0px_#000]">
            <span className="text-white font-black text-lg font-mono">V</span>
          </div>
          <span className="text-[20px] font-black tracking-tight">Vita<span className="text-darkGreen">Nomy</span></span>
        </div>
        
        <div className="flex gap-1">
          {['Dashboard', 'Simulator', 'Chat AI', 'Reports'].map((tab, idx) => (
            <Link key={tab} href={tab === 'Chat AI' ? '#' : `/${tab.toLowerCase().split(' ')[0]}`}
              className={`px-4 py-1.5 text-[13px] font-black border-[3px] transition-all hover:-translate-y-0.5
                ${tab === 'Chat AI' ? 'bg-darkGreen text-white border-black shadow-[3px_3px_0px_#000]' : 'bg-transparent border-transparent text-mu hover:bg-black/5'}`}>
              {tab}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3 px-4 py-2 border-[3px] border-black bg-white shadow-[3.5px_3.5px_0px_#000]">
          <TypoAvatar name={p.name} />
          <span className="text-[13px] font-black">{p.name || 'Alex Morgan'}</span>
        </div>
      </nav>

      {/* ── MAIN 3-COLUMN LAYOUT ── */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* LEFT COLUMN: Patient Context */}
        <aside className="w-[260px] border-r-[3px] border-black flex flex-col bg-white shrink-0">
          <div className="p-5 border-b-[3px] border-black bg-beige">
            <div className="text-[10px] font-black uppercase tracking-[0.15em] mb-4 text-mu">Active Patient</div>
            <div className="flex flex-col items-center p-4 border-[3px] border-black bg-white shadow-[4px_4px_0px_#000] mb-4">
              <TypoAvatar name={p.name} size="lg" />
              <div className="text-[15px] font-black mt-3">{p.name}</div>
              <div className="flex gap-2 mt-1">
                <span className="px-2 py-0.5 border-[1.5px] border-black text-[9px] font-black bg-darkGreen text-white uppercase">{p.gender}</span>
                <span className="px-2 py-0.5 border-[1.5px] border-black text-[9px] font-black bg-beige text-darkGreen uppercase">{p.age} Yrs</span>
              </div>
            </div>
            
            <div className="space-y-1.5">
              {[
                { l: 'BP', v: `${p.systolic_bp}/${p.diastolic_bp}`, col: 'red' },
                { l: 'Glucose', v: `${p.glucose}`, col: 'amber' },
                { l: 'BMI', v: bmi, col: 'green' }
              ].map(stat => (
                <div key={stat.l} className="flex justify-between items-center px-3 py-1.5 border-[2px] border-black bg-white">
                  <span className="text-[10px] font-black text-mu">{stat.l}</span>
                  <span className="text-[11px] font-black">{stat.v}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5">
            <div className="text-[10px] font-black uppercase tracking-[0.15em] mb-3 text-mu">Recent Logs</div>
            <div className="space-y-2">
              {['Cardiac Stability', 'Metabolic Switch', 'Diet Projection'].map((log, i) => (
                <div key={log} className={`p-3 border-[2.5px] border-black shadow-[2px_2px_0px_#000] cursor-pointer transition-all hover:bg-beige
                  ${i === 0 ? 'bg-white font-black' : 'bg-transparent filter grayscale'}`}>
                  <div className="text-[12px]">{log}</div>
                  <div className="text-[9px] text-mu mt-1">Apr 4 · 1.4k Context Tokens</div>
                </div>
              ))}
            </div>
          </div>

          <button className="m-5 px-4 py-3 border-[3px] border-black font-black text-[13px] bg-white shadow-[4px_4px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#000] transition-all">
            + New Clinical Thread
          </button>
        </aside>

        {/* CENTER COLUMN: Chat Hub */}
        <section className="flex-1 flex flex-col bg-beige overflow-hidden">
          
          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8">
            <div className="flex justify-center">
              <span className="text-[10px] font-black px-4 py-1 border-[2px] border-black bg-white shadow-[2px_2px_0px_#000] uppercase">
                Beginning of encrypted conversation
              </span>
            </div>

            {chatHistory.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto opacity-40">
                <div className="w-16 h-16 border-[4px] border-black rounded-full flex items-center justify-center text-3xl font-black mb-4">?</div>
                <div className="text-xl font-black uppercase">Clinical Assistant Idle</div>
                <div className="text-[13px] font-bold mt-2">Query your Digital Twin regarding dietary projections, risk mitigations, or medication mapping.</div>
              </div>
            )}

            <AnimatePresence initial={false}>
              {chatHistory.map((m, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <TypoAvatar name={m.role === 'user' ? p.name : 'V'} bg={m.role === 'user' ? C.darkGreen : C.white} />
                    <div>
                      <div className={`relative border-[3px] border-black p-4 shadow-[6px_6px_0px_#000] rounded-md transition-all
                        ${m.role === 'user' ? 'bg-darkGreen text-white' : 'bg-white text-black'}`}>
                        
                        {/* Typographic Badge for Mode */}
                        <div className={`absolute -top-3 ${m.role === 'user' ? 'right-2' : 'left-2'}`}>
                          <span className={`text-[8.5px] font-black border-[1.5px] border-black px-2 py-0.5 uppercase tracking-tighter
                            ${m.role === 'user' ? 'bg-white text-black' : 'bg-electricYellow text-black'}`}>
                            {m.role === 'user' ? 'User Query' : 'AI Analysis'}
                          </span>
                        </div>

                        <div className="text-[14px] leading-relaxed font-medium">
                          {m.content}
                        </div>

                        {/* Context Snippet (AI only) */}
                        {m.role === 'assistant' && i === 1 && (
                          <div className="mt-4 p-3 border-[2.5px] border-black bg-electricYellow text-black shadow-[3px_3px_0px_#000] animate-pulse">
                            <div className="text-[9px] font-black uppercase mb-1 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-black rounded-full"></span> 
                              Twin Constraint Snippet
                            </div>
                            <div className="text-[11px] font-bold flex justify-between">
                              <span>Na+ Sensitivity</span>
                              <span>HIGH</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className={`text-[9px] font-black text-mu mt-2 uppercase ${m.role === 'user' ? 'text-right' : ''}`}>
                        {m.role === 'assistant' ? 'Claude 3.5 Sonnet' : 'Verified Profile'} · 10:42 AM
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {loadingChat && (
              <div className="flex justify-start">
                <div className="flex gap-3">
                  <div className="w-8 h-8 border-[3px] border-black bg-white flex items-center justify-center animate-spin">
                    <span className="font-black text-xs">V</span>
                  </div>
                  <div className="border-[3px] border-black bg-white p-3 shadow-[4px_4px_0px_#000] flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce delay-0"></span>
                    <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce delay-100"></span>
                    <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* INPUT AREA */}
          <div className="p-6 border-t-[3px] border-black bg-white">
            <div className="flex gap-6 items-center mb-4 overflow-x-auto pb-2 scrollbar-hide">
              {['🧬 Twin Baseline', '⚡ Risk Simulation', '📄 Evidence Citations'].map((chip, i) => (
                <button key={chip} className={`whitespace-nowrap px-3 py-1.5 border-[2px] border-black text-[10px] font-black shadow-[2px_2px_0px_#000] transition-all hover:translate-x-0.5 hover:translate-y-0.5
                  ${i === 0 ? 'bg-electricYellow' : 'bg-white'}`}>
                  {chip}
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <div className="flex-1 relative">
                <textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                  placeholder="Enter clinical query or simulator scenario..."
                  className="w-full bg-white border-[3px] border-black p-4 text-[15px] font-bold shadow-[5px_5px_0px_#000] focus:outline-none focus:shadow-[2px_2px_0px_#000] transition-all min-h-[56px] max-h-32 resize-none"
                />
              </div>
              <button 
                onClick={handleSend}
                disabled={loadingChat || !input.trim()}
                className="w-16 h-16 border-[3px] border-black bg-electricYellow flex items-center justify-center shadow-[6px_6px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[0px_0px_0px_#000] disabled:opacity-50 disabled:translate-x-0 disabled:translate-y-0 transition-all group"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:rotate-12">
                  <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <div className="text-center mt-4 text-[9.5px] font-black text-mu uppercase tracking-widest">
              CAUTION: AI-generated guidance. Cross-reference with clinical records.
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Twins & Metrics */}
        <aside className="w-[260px] border-l-[3px] border-black bg-white shrink-0 overflow-y-auto">
          
          <div className="p-5 border-b-[3px] border-black">
            <div className="text-[10px] font-black uppercase tracking-[0.15em] mb-4 text-mu">Silicon Model</div>
            <SiliconTwin />
            <div className="mt-4 flex flex-col gap-2">
              <div className="flex justify-between items-center text-[11px] font-black">
                <span className="text-mu">Sync Status</span>
                <span className="text-darkGreen">VERIFIED</span>
              </div>
              <div className="h-2 border-[2px] border-black bg-beige">
                <div className="h-full bg-darkGreen w-[92%]"></div>
              </div>
            </div>
          </div>

          <div className="p-5 border-b-[3px] border-black bg-beige/30">
            <div className="text-[10px] font-black uppercase tracking-[0.15em] mb-4 text-mu">Risk Projection</div>
            <div className="space-y-3">
              {[
                { label: 'Diabetes', score: 44, col: '#FACC15' },
                { label: 'Cardiac', score: 72, col: '#C0392B' },
                { label: 'Hypertension', score: 49, col: '#FACC15' }
              ].map(risk => (
                <div key={risk.label} className="p-3 border-[2.5px] border-black bg-white shadow-[2px_2px_0px_#000]">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[11px] font-black uppercase">{risk.label}</span>
                    <span className="text-[12px] font-black" style={{ color: risk.col }}>{risk.score}%</span>
                  </div>
                  <div className="h-2.5 border-[2px] border-black bg-white">
                    <div className="h-full" style={{ width: `${risk.score}%`, backgroundColor: risk.col }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5">
            <div className="text-[10px] font-black uppercase tracking-[0.15em] mb-3 text-mu">Suggested Queries</div>
            <div className="flex flex-wrap gap-2">
              {[
                'Intermittent Fasting?', 'BP & Coffee Link', 'Sodium Thresholds', 'Simulator Test'
              ].map(q => (
                <button key={q} className="px-3 py-1.5 border-[2px] border-black bg-white text-[10px] font-black hover:bg-darkGreen hover:text-white transition-colors">
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto p-5 border-t-[3px] border-black bg-darkGreen/5 italic text-[10px] text-mu leading-relaxed">
            "Mock early. Integrate late. Polish always. Clinical Neobrutalism V2.0"
          </div>
        </aside>
      </main>
    </div>
  )
}
