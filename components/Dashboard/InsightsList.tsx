'use client'

import React from 'react'
import { usePatientStore } from '@/store/patientStore'

export function InsightsList() {
  const { analysis } = usePatientStore()
  
  if (!analysis) return null

  return (
    <div className="p-4 rounded-xl border-[0.5px] border-border-tertiary bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="text-[13px] font-medium mb-3.5 text-text-secondary">AI insights</div>
      
      {analysis.insights.map((insight, idx) => {
        // Determine dot color based on content (simple mock logic)
        const isCritical = insight.toLowerCase().includes('hypertension') || insight.toLowerCase().includes('critical')
        const dotColor = isCritical ? 'bg-crimson' : 'bg-coral'
        
        return (
          <div key={idx} className="flex gap-2.5 py-2.5 border-b-[0.5px] border-border-tertiary text-[13px] leading-[1.5] text-text-primary last:border-b-0">
            <div className={`w-[7px] h-[7px] rounded-full shrink-0 mt-1.5 ${dotColor}`}></div>
            <span>{insight}</span>
          </div>
        )
      })}
      
      {analysis.recommendations.length > 0 && (
        <div className="mt-3.5 p-2.5 rounded-md border-[0.5px] border-[#f2cc8f] bg-[#fdf6ee]">
          <div className="text-[11px] font-medium text-[#7a5c1e] mb-1">Top recommendation</div>
          <div className="text-[12px] text-[#a0522d]">{analysis.recommendations[0]}</div>
        </div>
      )}
    </div>
  )
}
