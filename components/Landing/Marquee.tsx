'use client'

import React from 'react'

export function Marquee() {
  return (
    <div className="bg-em border-y-2 border-ink py-3 overflow-hidden relative flex">
      <div className="flex animate-[ms_24s_linear_infinite] w-max" style={{ animationTimingFunction: 'linear' }}>
        {/* Render twice for endless loop */}
        {[...Array(2)].map((_, i) => (
          <React.Fragment key={i}>
            <div className="flex items-center gap-2.5 px-5.5 text-[12.5px] font-medium text-white/90 whitespace-nowrap">
              <span className="text-gd text-[15px]">◆</span>3D Body Digital Twin
            </div>
            <div className="flex items-center gap-2.5 px-5.5 text-[12.5px] font-medium text-white/90 whitespace-nowrap">
              <span className="text-gd text-[15px]">◆</span>AI Risk Prediction
            </div>
            <div className="flex items-center gap-2.5 px-5.5 text-[12.5px] font-medium text-white/90 whitespace-nowrap">
              <span className="text-gd text-[15px]">◆</span>What-If Simulator
            </div>
            <div className="flex items-center gap-2.5 px-5.5 text-[12.5px] font-medium text-white/90 whitespace-nowrap">
              <span className="text-gd text-[15px]">◆</span>Gender-Aware Insights
            </div>
            <div className="flex items-center gap-2.5 px-5.5 text-[12.5px] font-medium text-white/90 whitespace-nowrap">
              <span className="text-gd text-[15px]">◆</span>PDF Health Reports
            </div>
            <div className="flex items-center gap-2.5 px-5.5 text-[12.5px] font-medium text-white/90 whitespace-nowrap">
              <span className="text-gd text-[15px]">◆</span>Cardiac Monitoring
            </div>
            <div className="flex items-center gap-2.5 px-5.5 text-[12.5px] font-medium text-white/90 whitespace-nowrap">
              <span className="text-gd text-[15px]">◆</span>Diabetes Risk
            </div>
            <div className="flex items-center gap-2.5 px-5.5 text-[12.5px] font-medium text-white/90 whitespace-nowrap">
              <span className="text-gd text-[15px]">◆</span>Hypertension Tracking
            </div>
            <div className="flex items-center gap-2.5 px-5.5 text-[12.5px] font-medium text-white/90 whitespace-nowrap">
              <span className="text-gd text-[15px]">◆</span>5 Languages
            </div>
          </React.Fragment>
        ))}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes ms {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </div>
  )
}
