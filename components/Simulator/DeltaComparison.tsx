'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { usePatientStore } from '@/store/patientStore'
import { MOCK_SIMULATION } from '@/data/mockData'

// Simplified visual delta bar
function DeltaBar({ name, original, projected, deltaLabel }: { name: string, original: number, projected: number, deltaLabel: string }) {
  // Use framer motion for bar width animation
  return (
    <div className="mb-3.5 last:mb-0">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[12px] text-text-secondary">{name}</span>
        <span className="text-[11px] font-medium text-[#3b6d11] bg-[#c0dd97] px-2 py-0.5 rounded-full">{deltaLabel}</span>
      </div>
      
      <div className="h-2 bg-bg-secondary rounded-full overflow-hidden relative">
        <div className="absolute top-0 left-0 h-full bg-[#d3d1c7] rounded-full" style={{ width: `${original}%` }}></div>
        <motion.div 
          className="absolute top-0 left-0 h-full bg-sage rounded-full" 
          initial={{ width: `${original}%` }}
          animate={{ width: `${projected}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        ></motion.div>
      </div>
      
      <div className="flex justify-between mt-1 text-[11px] text-text-secondary">
        <span>Now: {original}</span>
        <span>Projected: {projected}</span>
      </div>
    </div>
  )
}

export function DeltaComparison() {
  const simulation = MOCK_SIMULATION // Eventually comes from API/Store based on selection

  return (
    <div className="p-[18px] bg-[#f7faf8] rounded-xl border-[0.5px] border-[#c0dd97]">
      <div className="text-[13px] font-medium text-[#3b6d11] mb-3.5">
        Projected impact — Exercise scenario (6 months)
      </div>
      
      <DeltaBar 
        name="Diabetes risk" 
        original={simulation.original_risks.diabetes} 
        projected={simulation.projected_risks.diabetes} 
        deltaLabel="↓ 21 points" 
      />
      
      <DeltaBar 
        name="Cardiac risk" 
        original={simulation.original_risks.cardiac} 
        projected={simulation.projected_risks.cardiac} 
        deltaLabel="↓ 19 points" 
      />
      
      <DeltaBar 
        name="Hypertension risk" 
        original={simulation.original_risks.hypertension} 
        projected={simulation.projected_risks.hypertension} 
        deltaLabel="↓ 19 points" 
      />
      
      <div className="mt-3.5 text-[12px] text-[#3b6d11] p-2.5 bg-white rounded-md border-[0.5px] border-[#c0dd97] leading-relaxed">
        {simulation.narrative}
      </div>
    </div>
  )
}
