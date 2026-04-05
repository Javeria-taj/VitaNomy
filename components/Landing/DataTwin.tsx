'use client'

import React from 'react'
import { DigitalTwin } from '@/components/Visuals/DigitalTwin'

export function DataTwin() {
  return (
    <div className="w-full h-full min-h-[500px] relative bg-[#f5f0e8] flex items-center justify-center overflow-hidden">
      <DigitalTwin 
        vitals={{
          bp: '138/88',
          glucose: 118,
          hr: 78,
          bmi: 30.1
        }}
        mode="patient"
        interactive={true}
        showBadges={true}
        scale={0.9}
      />
      
      {/* Branding Overlay for Hero */}
      <div className="absolute top-6 left-6 z-20">
        <div className="px-3 py-1 bg-[#1a3a2a] text-[#C9A84C] text-[9px] font-black uppercase tracking-tighter shadow-[4px_4px_0px_#000]">
          Biometric-Entity-01
        </div>
      </div>
    </div>
  )
}
