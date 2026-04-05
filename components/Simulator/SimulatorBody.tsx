'use client'

import React from 'react'
import { DigitalTwin } from '@/components/Visuals/DigitalTwin'

interface SimulatorBodyProps {
  type: 'baseline' | 'simulated'
  mode?: 'patient' | 'athlete'
  vitals: {
    bp: string
    glucose: number
    hr: number
    bmi: number
    alt?: number
  }
  issues?: string[]
}

export function SimulatorBody({ type, mode = 'patient', vitals, issues = [] }: SimulatorBodyProps) {
  return (
    <div className="w-[300px] h-[520px] border-[3px] border-black bg-[#f5f0e8] shadow-[8px_8px_0px_#000] overflow-hidden relative">
      <DigitalTwin 
        vitals={vitals}
        mode={mode}
        interactive={true}
        showBadges={true}
        scale={0.75}
        highlightZones={issues}
      />
      
      {/* Simulation Overlay Label */}
      <div className="absolute top-2 left-2 z-20">
        <div className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border-[1.5px] border-black shadow-[2px_2px_0px_#000]
          ${type === 'simulated' ? 'bg-[#C9A84C]' : 'bg-[#7EC8A0]'}`}>
          {type === 'simulated' ? 'Simulated' : 'Baseline'}
        </div>
      </div>
    </div>
  )
}
