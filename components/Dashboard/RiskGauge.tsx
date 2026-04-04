
'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface RiskGaugeProps {
  label: string
  score: number
  color: string
  subLabel: string
}

export function RiskGauge({ label, score, color, subLabel }: RiskGaugeProps) {
  const isHigh = score > 70
  const isModerate = score > 40
  
  // Custom Neobrutalist colors for the container shadow/glow if needed
  const shadowColor = isHigh ? '#E07A5F' : isModerate ? '#C9A84C' : '#2E7D52'

  return (
    <div 
      className="p-5 border-[3px] border-black bg-white shadow-[4px_4px_0px_#000000] flex flex-col transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000000]"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-black/40">{label}</span>
        <div 
          className="text-[9px] font-black px-2 py-0.5 border-[2px] border-black uppercase tracking-widest"
          style={{ backgroundColor: color, color: '#000' }}
        >
          {subLabel}
        </div>
      </div>
      
      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-5xl font-black tracking-tighter" style={{ color: color === '#113826' ? '#2E7D52' : color }}>
          {score}
        </span>
        <span className="text-xl font-black text-black/20">%</span>
      </div>

      {/* Chunky progress bar */}
      <div className="w-full h-8 border-[3px] border-black bg-white relative overflow-hidden">
        <motion.div 
          className="h-full"
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
          style={{ backgroundColor: color === '#113826' ? '#2E7D52' : color }}
        />
        {/* Zebra stripe overlay for extra neobrutalist texture */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)' , backgroundSize: '10px 10px'}}
        />
      </div>
      
      <div className="mt-3 text-[10px] font-bold text-black/50 leading-tight">
        Relative risk based on your physiological profile.
      </div>
    </div>
  )
}
