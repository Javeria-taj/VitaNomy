
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { usePatientStore } from '@/store/patientStore'
import { ChatMessage } from '@/types/patient'
import { motion, AnimatePresence } from 'framer-motion'

export function ChatBox() {
  const { patient, analysis, chatHistory, addChatMessage, loadingChat, setLoading } = usePatientStore()
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [chatHistory, loadingChat])

  const initials = patient?.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'PT'

  const handleSend = () => {
    if (!input.trim() || loadingChat) return
    
    const userMsg: ChatMessage = { role: 'user', content: input }
    addChatMessage(userMsg)
    setInput('')
    
    // Simulate AI response logic
    setLoading('chat', true)
    setTimeout(() => {
      setLoading('chat', false)
      addChatMessage({ 
        role: 'assistant', 
        content: `Based on your profile (Age ${patient?.age}, BP ${patient?.mode === 'patient' ? patient.systolic_bp : 0}/${patient?.mode === 'patient' ? patient.diastolic_bp : 0}), this specific intervention would likely shift your ${analysis?.risk_scores.overall_risk.toLowerCase()} risk profile. Historical simulations show a 12% improvement in cardiac strain for similar cohorts.`
      })
    }, 1200)
  }

  return (
    <div className="flex flex-col h-full bg-[#F4F2E9] border-[3px] border-black">
      {/* Dynamic Context Header */}
      <div className="px-4 py-2 bg-[#113826] border-b-[3px] border-black flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#C9A84C] animate-pulse rounded-full" />
          <span className="text-[10px] font-black text-[#F4F2E9] uppercase tracking-[0.2em]">
            Twin Context Active: {patient?.name || 'Anonymous'}
          </span>
        </div>
        <div className="text-[10px] font-black text-[#C9A84C] uppercase tracking-widest">
          {analysis?.risk_scores.overall_risk || 'NO'} RISK PROFILE
        </div>
      </div>

      {/* Chat Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-black scrollbar-track-transparent"
      >
        <AnimatePresence initial={false}>
          {chatHistory.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div 
                className="w-10 h-10 border-[3px] border-black flex shrink-0 items-center justify-center text-[12px] font-black shadow-[2px_2px_0px_#000000]"
                style={{ backgroundColor: msg.role === 'assistant' ? '#113826' : '#C9A84C', color: msg.role === 'assistant' ? 'white' : 'black' }}
              >
                {msg.role === 'assistant' ? 'AI' : initials}
              </div>
              
              <div 
                className="p-4 border-[3px] border-black text-[13px] font-bold leading-relaxed shadow-[4px_4px_0px_#000000]"
                style={{ backgroundColor: msg.role === 'assistant' ? 'white' : '#EDE9DC', color: 'black' }}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loadingChat && (
          <div className="flex gap-3">
             <div className="w-10 h-10 border-[3px] border-black bg-[#113826] flex shrink-0 items-center justify-center text-[12px] font-black text-white shadow-[2px_2px_0px_#000000]">
               AI
             </div>
             <div className="p-4 border-[3px] border-black bg-white shadow-[4px_4px_0px_#000000] flex gap-1 items-center">
               <div className="w-2 h-2 bg-black animate-bounce [animation-delay:-0.3s]" />
               <div className="w-2 h-2 bg-black animate-bounce [animation-delay:-0.15s]" />
               <div className="w-2 h-2 bg-black animate-bounce" />
             </div>
          </div>
        )}
      </div>

      {/* Input Console */}
      <div className="p-4 border-t-[3px] border-black bg-[#EDE9DC]">
        <div 
          className="flex border-[3px] border-black bg-white p-1 transition-all focus-within:shadow-[6px_6px_0px_#000000] focus-within:-translate-x-1 focus-within:-translate-y-1"
          style={{ boxShadow: '4px 4px 0px #000000' }}
        >
          <input 
            type="text" 
            placeholder="Interrogate the digital twin..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={loadingChat}
            className="flex-1 bg-transparent border-none text-[13px] font-bold px-3 py-2 outline-none text-black placeholder:text-black/30 placeholder:uppercase placeholder:tracking-tighter"
          />
          <button 
            onClick={handleSend}
            disabled={loadingChat || !input.trim()}
            className="px-5 bg-black text-white text-[12px] font-black uppercase tracking-widest hover:bg-[#113826] transition-colors disabled:opacity-20"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
