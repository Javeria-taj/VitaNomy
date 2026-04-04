'use client'

import React from 'react'

export function ProgressBar({ currentStep = 2 }: { currentStep?: number }) {
  const steps = [
    { num: 1, label: 'Identity' },
    { num: 2, label: 'Body' },
    { num: 3, label: 'Vitals' },
    { num: 4, label: 'Lifestyle' },
  ]
  
  return (
    <div className="flex items-center gap-2 mb-7">
      {steps.map((step, i) => {
        const isDone = step.num < currentStep
        const isActive = step.num === currentStep
        
        return (
          <React.Fragment key={step.num}>
            <div className="flex items-center gap-1.5 text-[12px] text-text-secondary">
              <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center text-[10px] font-medium border-[0.5px] ${
                isDone ? 'bg-sage border-sage text-white' : 
                isActive ? 'bg-coral border-coral text-white' : 
                'bg-bg-secondary border-border-tertiary text-text-secondary'
              }`}>
                {isDone ? '✓' : step.num}
              </div>
              <span className={isActive ? 'text-text-primary font-medium' : ''}>{step.label}</span>
            </div>
            {i < steps.length - 1 && <div className="flex-1 h-[0.5px] bg-border-tertiary mx-1 block"></div>}
          </React.Fragment>
        )
      })}
    </div>
  )
}
