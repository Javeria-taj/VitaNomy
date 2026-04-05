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
}

export function SimulatorBody({ type, mode = 'patient', vitals }: SimulatorBodyProps) {
  return (
    <div className="w-full h-full border-[3px] border-black bg-[#f5f0e8] shadow-[8px_8px_0px_#000] overflow-hidden">
      <DigitalTwin 
        vitals={vitals}
        mode={mode}
        interactive={true}
        showBadges={true}
        scale={0.85}
      />
      
      {/* Simulation Overlay Label */}
      <div className="absolute top-4 left-4 z-20">
        <div className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest border-[2px] border-black shadow-[3px_3px_0px_#000]
          ${type === 'simulated' ? 'bg-[#C9A84C]' : 'bg-[#7EC8A0]'}`}>
          {type === 'simulated' ? 'Provisional Projection' : 'Baseline Twin'}
        </div>
      </div>
    </div>
  )
}
