'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface RiskGaugeProps {
  label: string
  icon: string
  currentScore: number
  baselineScore: number
  unit: string
  status: 'LOW RISK' | 'MODERATE' | 'HIGH' | 'CONTROLLED' | 'NORMAL' | 'ELEVATED' | 'STABLE' | 'CRITICAL' | 'STRESSED'
  color: string
}

export function RiskGauge({ label, icon, currentScore, baselineScore, status }: RiskGaugeProps) {
  const getStatusStyle = (): React.CSSProperties => {
    const green = ['LOW RISK', 'CONTROLLED', 'NORMAL', 'STABLE']
    const yellow = ['MODERATE', 'ELEVATED', 'STRESSED']
    
    if (green.includes(status))
      return { backgroundColor: '#7EC8A0', color: '#000' }
    if (yellow.includes(status))
      return { backgroundColor: '#C9A84C', color: '#000' }
    return { backgroundColor: '#E07A5F', color: '#000' }
  }

  const getBarColor = (): string => {
    const green = ['LOW RISK', 'CONTROLLED', 'NORMAL', 'STABLE']
    const yellow = ['MODERATE', 'ELEVATED', 'STRESSED']

    if (green.includes(status)) return '#2E7D52'
    if (yellow.includes(status)) return '#C9A84C'
    return '#E07A5F'
  }

  const delta = currentScore - baselineScore
  const isImprovement = delta < 0

  return (
    <div
      className="rounded-none border-[3px] border-black p-3 bg-white"
      style={{ boxShadow: '4px 4px 0px #000000' }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[16px]">{icon}</span>
          <span className="text-[12px] font-black uppercase tracking-wider text-black">{label}</span>
        </div>
        <div
          className="text-[9px] font-black px-2 py-0.5 border-[2px] border-black uppercase tracking-widest"
          style={getStatusStyle()}
        >
          {status}
        </div>
      </div>

      {/* Score row */}
      <div className="flex items-end justify-between mb-3">
        <div
          className="text-5xl font-black leading-none tracking-tight"
          style={{ color: getBarColor() }}
        >
          {currentScore}%
        </div>
        <div className="text-right">
          <div className="text-[10px] font-black text-black/40 line-through font-mono">{baselineScore}%</div>
          <div
            className="text-[11px] font-black"
            style={{ color: isImprovement ? '#2E7D52' : '#E07A5F' }}
          >
            {isImprovement ? '↓' : '↑'}{Math.abs(delta)}pt
          </div>
        </div>
      </div>

      {/* Brutalist progress bar track */}
      <div className="w-full h-8 border-[3px] border-black bg-white relative overflow-hidden">
        {/* Baseline ghost marker */}
        <div
          className="absolute top-0 bottom-0 w-[3px] bg-black/20 z-10"
          style={{ left: `${baselineScore}%` }}
        />
        {/* Current fill */}
        <motion.div
          className="h-full absolute top-0 left-0"
          initial={{ width: 0 }}
          animate={{ width: `${currentScore}%` }}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          style={{ backgroundColor: getBarColor() }}
        />
      </div>
    </div>
  )
}
