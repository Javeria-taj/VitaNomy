'use client'

import React from 'react'

export function SuggestedChips({ onSelect }: { onSelect: (q: string) => void }) {
  const chips = [
    "What's causing my hypertension risk?",
    "How does my weight impact my heart?",
    "If I start a statin, what happens?"
  ]

  return (
    <div className="flex gap-2 p-2.5 overflow-x-auto bg-[#fafafa] border-b-[0.5px] border-border-tertiary">
      {chips.map(chip => (
        <button 
          key={chip}
          onClick={() => onSelect(chip)}
          className="shrink-0 px-3 py-1.5 rounded-full border-[0.5px] border-border-tertiary bg-white text-[12px] text-text-secondary shadow-sm hover:border-gray-300 transition-colors"
        >
          {chip}
        </button>
      ))}
    </div>
  )
}
