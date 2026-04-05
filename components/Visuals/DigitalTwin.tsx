'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ZoneStat {
  l: string
  v: string
  c: 'ok' | 'warn' | 'crit'
}

interface ZoneInfo {
  name: string
  status: 'healthy' | 'warning' | 'critical'
  stats: ZoneStat[]
  risk: number
  alert: string | null
}

interface Props {
  vitals?: {
    bp?: string
    glucose?: number
    hr?: number
    bmi?: number
    alt?: number
    gfr?: number
  }
  mode?: 'patient' | 'athlete'
  interactive?: boolean
  showBadges?: boolean
  className?: string
  scale?: number
  highlightZones?: string[]
}

const zoneData: Record<string, ZoneInfo> = {
  head: {
    name: 'Brain & Cognitive',
    status: 'healthy',
    stats: [
      { l: 'Cognitive', v: '94/100', c: 'ok' },
      { l: 'Sleep', v: '78%', c: 'ok' },
      { l: 'Stress', v: '32/100', c: 'ok' },
      { l: 'Neural', v: 'Normal', c: 'ok' }
    ],
    risk: 12,
    alert: null
  },
  chest: {
    name: 'Heart & Lungs',
    status: 'warning',
    stats: [
      { l: 'Heart Rate', v: '88 bpm', c: 'warn' },
      { l: 'Blood Pr.', v: '142/91', c: 'crit' },
      { l: 'SpO₂', v: '97%', c: 'ok' },
      { l: 'HRV', v: '38 ms', c: 'warn' }
    ],
    risk: 62,
    alert: 'Elevated cardiac strain. Potential hypertension trajectory detected.'
  },
  abdomen: {
    name: 'Metabolic & Organ',
    status: 'critical',
    stats: [
      { l: 'ALT', v: '72 U/L', c: 'crit' },
      { l: 'AST', v: '58 U/L', c: 'warn' },
      { l: 'Glucose', v: '118 mg/dL', c: 'warn' },
      { l: 'GFR', v: '68 mL/m', c: 'warn' }
    ],
    risk: 78,
    alert: 'Significant liver stress detected. High probability of NAFLD progression.'
  }
}

export function DigitalTwin({
  vitals,
  mode = 'patient',
  interactive = true,
  showBadges = true,
  className = '',
  scale = 1,
  highlightZones = []
}: Props) {
  const [activeZone, setActiveZone] = useState<string | null>(null)

  const handleZoneClick = (zone: string) => {
    if (!interactive) return
    setActiveZone(activeZone === zone ? null : zone)
  }

  return (
    <div 
      className={`relative flex items-center justify-center bg-[#f5f0e8] overflow-hidden ${className}`}
      style={{ 
        fontFamily: "'DM Sans', sans-serif",
        color: '#1a3a2a',
        width: '100%',
        height: '100%',
        minHeight: '600px'
      }}
    >
      {/* Scan Line Animation */}
      <motion.div 
        animate={{ top: ['5%', '92%', '5%'] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-[20px] right-[20px] h-[1px] bg-emerald-500/20 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, #2d5a42, transparent)' }}
      />

      {/* SVG Mannequin */}
      <div className="relative" style={{ width: 320 * scale, height: 680 * scale }}>
        <svg 
          viewBox="0 0 320 680" 
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="segGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(26,58,42,0.06)"/>
              <stop offset="100%" stopColor="rgba(26,58,42,0.02)"/>
            </linearGradient>
          </defs>

          {/* Wireframe Grid */}
          <g opacity="0.3">
            {[130, 145, 160, 175, 190].map(x => (
              <line key={x} x1={x} y1="130" x2={x} y2="340" stroke="#1a3a2a" strokeWidth="0.5" strokeOpacity="0.1" />
            ))}
            {[160, 190, 220, 250, 280, 310].map(y => (
              <line key={y} x1="110" y1={y} x2="210" y2={y} stroke="#1a3a2a" strokeWidth="0.5" strokeOpacity="0.1" />
            ))}
          </g>

          {/* HEAD */}
          <g 
            className={`cursor-pointer transition-all ${activeZone === 'head' ? 'active' : ''}`}
            onClick={() => handleZoneClick('head')}
          >
            <motion.ellipse 
              cx="160" cy="52" rx="30" ry="38"
              fill={highlightZones.includes('head') ? 'rgba(192, 57, 43, 0.1)' : 'url(#segGrad)'} 
              stroke={highlightZones.includes('head') ? '#c0392b' : activeZone === 'head' ? '#b8960c' : '#1a3a2a'} 
              strokeWidth={highlightZones.includes('head') ? 3 : activeZone === 'head' ? 2.5 : 1.5}
              animate={highlightZones.includes('head') ? {
                strokeWidth: [3, 5, 3],
                opacity: [0.8, 1, 0.8]
              } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </g>

          {/* NECK */}
          <rect x="149" y="88" width="22" height="24" rx="6" fill="url(#segGrad)" stroke="#1a3a2a" strokeWidth="1.2" />

          {/* TORSO / CHEST */}
          <g 
            className={`cursor-pointer transition-all ${activeZone === 'chest' ? 'active' : ''}`}
            onClick={() => handleZoneClick('chest')}
          >
            <motion.path 
              d="M118 118 Q115 120 112 145 L108 200 L108 230 Q110 235 118 238 L160 244 L202 238 Q210 235 212 230 L212 200 L208 145 Q205 120 202 118 L185 112 Q160 108 135 112 Z"
              fill={highlightZones.includes('chest') ? 'rgba(192, 57, 43, 0.15)' : 'url(#segGrad)'} 
              stroke={highlightZones.includes('chest') ? '#c0392b' : activeZone === 'chest' ? '#b8960c' : '#1a3a2a'} 
              strokeWidth={highlightZones.includes('chest') ? 3.5 : activeZone === 'chest' ? 2.5 : 1.5}
              animate={highlightZones.includes('chest') ? {
                strokeWidth: [3.5, 6, 3.5],
                opacity: [0.7, 1, 0.7]
              } : {}}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          </g>

          {/* ABDOMEN */}
          <g 
            className={`cursor-pointer transition-all ${activeZone === 'abdomen' ? 'active' : ''}`}
            onClick={() => handleZoneClick('abdomen')}
          >
            <motion.path 
              d="M118 238 L160 244 L202 238 L205 270 Q205 290 200 310 L192 330 Q175 342 160 344 Q145 342 128 330 L120 310 Q115 290 115 270 Z"
              fill={highlightZones.includes('abdomen') ? 'rgba(192, 57, 43, 0.15)' : activeZone === 'abdomen' ? 'rgba(192, 57, 43, 0.05)' : 'url(#segGrad)'}
              stroke={highlightZones.includes('abdomen') ? '#c0392b' : activeZone === 'abdomen' ? '#c0392b' : '#1a3a2a'}
              strokeWidth={highlightZones.includes('abdomen') ? 3.5 : activeZone === 'abdomen' ? 2.5 : 1.5}
              animate={highlightZones.includes('abdomen') ? {
                strokeWidth: [3.5, 6, 3.5],
                opacity: [0.7, 1, 0.7]
              } : {}}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
            />
          </g>

          {/* ARMS & LEGS (Simplified for React translation) */}
          {/* Left Arm */}
          <path d="M104 130 Q92 138 85 165 L78 210 Q76 220 80 225 L90 222 Q96 210 100 185 L108 155 Q112 138 110 130 Z" stroke="#1a3a2a" strokeWidth="1.3" fill="url(#segGrad)" />
          <path d="M74 230 Q68 258 64 290 L60 320 Q58 328 62 332 L72 330 Q76 322 80 295 L84 260 Q86 240 86 230 Z" stroke="#1a3a2a" strokeWidth="1.3" fill="url(#segGrad)" />
          
          {/* Right Arm */}
          <path d="M216 130 Q228 138 235 165 L242 210 Q244 220 240 225 L230 222 Q224 210 220 185 L212 155 Q208 138 210 130 Z" stroke="#1a3a2a" strokeWidth="1.3" fill="url(#segGrad)" />
          <path d="M246 230 Q252 258 256 290 L260 320 Q262 328 258 332 L248 330 Q244 322 240 295 L236 260 Q234 240 234 230 Z" stroke="#1a3a2a" strokeWidth="1.3" fill="url(#segGrad)" />

          {/* Legs */}
          <path d="M118 348 Q112 370 108 400 L105 440 Q103 455 107 462 L125 460 Q129 450 129 430 L130 400 Q131 370 134 348 Z" stroke="#1a3a2a" strokeWidth="1.3" fill="url(#segGrad)" />
          <path d="M202 348 Q208 370 212 400 L215 440 Q217 455 213 462 L195 460 Q191 450 191 430 L190 400 Q189 370 186 348 Z" stroke="#1a3a2a" strokeWidth="1.3" fill="url(#segGrad)" />
          
          {/* Join points */}
          {[
            {cx: 112, cy: 124, r: 4}, {cx: 208, cy: 124, r: 4}, // shoulders
            {cx: 160, cy: 88, r: 3}, // neck
            {cx: 128, cy: 340, r: 5}, {cx: 192, cy: 340, r: 5}, // hips
            {cx: 116, cy: 468, r: 4}, {cx: 204, cy: 468, r: 4}  // knees
          ].map((j, i) => (
            <circle key={i} cx={j.cx} cy={j.cy} r={j.r} stroke="#1a3a2a" strokeWidth="1.5" fill="#f5f0e8" />
          ))}

          {/* BASE */}
          <ellipse cx="150" cy="640" rx="55" ry="10" fill="none" stroke="#1a3a2a" strokeWidth="1" strokeDasharray="3,3" opacity="0.3" />
        </svg>

        {/* Floating Vitals Badges */}
        {showBadges && vitals && (
          <div className="absolute inset-0 pointer-events-none">
            {/* HR Badge */}
            <div className={`absolute transition-all duration-500`} style={{ left: -140, top: 120 }}>
               <Badge label="HR" value={vitals.hr || 78} unit="BPM" status="warn" side="left" />
            </div>
            {/* BP Badge */}
            <div className={`absolute transition-all duration-500`} style={{ right: -150, top: 180 }}>
               <Badge label="BP" value={vitals.bp || '120/80'} unit="" status="crit" side="right" />
            </div>
            {/* Glucose Badge */}
            <div className={`absolute transition-all duration-500`} style={{ right: -140, top: 260 }}>
               <Badge label="GLU" value={vitals.glucose || 94} unit="mg/dL" status="warn" side="right" />
            </div>
             {/* BMI Badge */}
             <div className={`absolute transition-all duration-500`} style={{ right: -130, top: 380 }}>
               <Badge label="BMI" value={vitals.bmi || 24.2} unit="" status="ok" side="right" />
            </div>
            {/* ALT Badge (Athlete Mode) */}
            {mode === 'athlete' && vitals.alt && (
              <div className={`absolute transition-all duration-500`} style={{ left: -140, top: 300 }}>
                <Badge label="ALT" value={vitals.alt} unit="U/L" status="crit" side="left" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detail Card Overlay */}
      <AnimatePresence>
        {activeZone && zoneData[activeZone] && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-8 top-1/2 -translate-y-1/2 w-72 bg-[#f5f0e8] border-[2px] border-[#1a3a2a] p-6 shadow-[8px_8px_0px_#1a3a2a] z-50 pointer-events-auto"
          >
            <button 
              onClick={() => setActiveZone(null)}
              className="absolute top-3 right-3 text-[14px] font-black border-[1px] border-black/20 w-6 h-6 flex items-center justify-center hover:bg-black hover:text-white"
            >✕</button>
            
            <h3 className="text-[20px] font-serif font-black mb-1">{zoneData[activeZone].name}</h3>
            <div className={`inline-block px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border-[1.5px] mb-4 
              ${zoneData[activeZone].status === 'healthy' ? 'text-green-600 border-green-600 bg-green-50' : 
                zoneData[activeZone].status === 'warning' ? 'text-amber-600 border-amber-600 bg-amber-50' : 
                'text-red-600 border-red-600 bg-red-50'}`}>
              {zoneData[activeZone].status}
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {zoneData[activeZone].stats.map((s, i) => (
                <div key={i} className="bg-black/5 p-2 rounded-sm border-[1px] border-black/5">
                   <div className="text-[8px] uppercase tracking-wider text-black/40 mb-1">{s.l}</div>
                   <div className={`text-[14px] font-black font-mono ${s.c === 'crit' ? 'text-red-600' : s.c === 'warn' ? 'text-amber-600' : 'text-green-700'}`}>{s.v}</div>
                </div>
              ))}
            </div>

            <div className="mb-2">
              <div className="flex justify-between text-[9px] font-black uppercase mb-1">
                <span>System Risk Score</span>
                <span>{zoneData[activeZone].risk}%</span>
              </div>
              <div className="h-1.5 bg-black/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${zoneData[activeZone].risk}%` }}
                  className={`h-full ${zoneData[activeZone].risk > 70 ? 'bg-red-600' : zoneData[activeZone].risk > 40 ? 'bg-amber-500' : 'bg-green-600'}`} 
                />
              </div>
            </div>

            {zoneData[activeZone].alert && (
              <div className={`p-2 border-l-3 text-[10px] leading-relaxed italic
                ${zoneData[activeZone].status === 'warning' ? 'border-amber-500 bg-amber-50/50' : 'border-red-600 bg-red-50/50'}`}>
                {zoneData[activeZone].alert}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Badge({ label, value, unit, status, side }: { label: string, value: any, unit: string, status: 'ok' | 'warn' | 'crit', side: 'left' | 'right' }) {
  const statusColor = status === 'ok' ? '#27ae60' : status === 'warn' ? '#d4a017' : '#c0392b'
  
  return (
    <div className={`flex items-center gap-2 bg-[#f5f0e8] border-[1.5px] border-[#1a3a2a] p-1.5 shadow-[4px_4px_0px_rgba(26,58,42,0.1)] relative`}>
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor }} />
      <span className="text-[10px] font-black font-mono whitespace-nowrap">
        {label}: {value}<span className="text-[8px] opacity-50 ml-0.5">{unit}</span>
      </span>
      {/* Connector pointer line pseudo-element would be here */}
    </div>
  )
}
