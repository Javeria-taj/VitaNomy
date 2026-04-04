'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { usePatientStore } from '@/store/patientStore'
import { MOCK_SIMULATION } from '@/data/mockData'

interface ScenarioCardProps {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  iconBg: string
  isSelected: boolean
  onClick: (id: string) => void
}

export function ScenarioCard({ id, title, description, icon, iconBg, isSelected, onClick }: ScenarioCardProps) {
  return (
    <div 
      onClick={() => onClick(id)}
      className={`p-4 rounded-xl border-[0.5px] cursor-pointer transition-all hover:shadow-sm
        ${isSelected 
          ? 'bg-[#f0f7f3] border-sage border-[1.5px]' 
          : 'bg-bg-secondary border-border-tertiary hover:border-gray-300'
        }`}
    >
      <div className={`w-8 h-8 rounded-md flex items-center justify-center mb-2`} style={{ backgroundColor: iconBg }}>
        {icon}
      </div>
      <div className="text-[13px] font-medium mb-0.5 text-text-primary">{title}</div>
      <div className="text-[11px] text-text-secondary leading-snug">{description}</div>
    </div>
  )
}
