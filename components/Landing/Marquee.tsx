'use client'

import React from 'react'

export function Marquee() {
  return (
    <div className="bg-em border-y-2 border-ink py-3 overflow-hidden relative flex">
      <div className="flex animate-[ms_20s_linear_infinite] w-max font-display text-[22px] uppercase tracking-[0.1em] py-1" style={{ animationTimingFunction: 'linear' }}>
        {/* Render twice for endless loop */}
        {[...Array(2)].map((_, i) => (
          <React.Fragment key={i}>
            {[
              "3D Body Digital Twin",
              "AI Risk Prediction",
              "What-If Simulator",
              "Gender-Aware Insights",
              "PDF Health Reports",
              "Cardiac Monitoring",
              "Diabetes Protocol",
              "Hypertension Tracking",
              "5 Languages Supported"
            ].map((text, idx) => (
              <div key={idx} className="flex items-center gap-6 px-8 text-white whitespace-nowrap">
                <span className="text-gd text-[24px]">⬢</span>
                {text}
              </div>
            ))}
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
