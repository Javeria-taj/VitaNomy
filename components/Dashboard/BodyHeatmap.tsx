import React from 'react'
import { usePatientStore } from '@/store/patientStore'
import { DigitalTwin } from '@/components/Visuals/DigitalTwin'
import { PatientRiskScores, AthleteRiskScores } from '@/types/patient'

export function BodyHeatmap() {
  const { analysis, mode } = usePatientStore()
  
  if (!analysis) return null
  
  const scores = analysis.risk_scores
  const isAthlete = mode === 'athlete'

  // Map analysis data to DigitalTwin vitals format
  const twinVitals = {
    bp: analysis.raw_data?.vitals?.bp || '120/80',
    glucose: analysis.raw_data?.vitals?.glucose || 94,
    hr: analysis.raw_data?.vitals?.hr || 72,
    bmi: analysis.raw_data?.vitals?.bmi || 24.2,
    alt: isAthlete ? (scores as AthleteRiskScores).hepatotoxicity.score : undefined,
    gfr: isAthlete ? (scores as AthleteRiskScores).hematological.score : undefined
  }

  return (
    <div className="p-0 border-[3px] border-black bg-[#f5f0e8] shadow-[8px_8px_0px_#000000] overflow-hidden relative group h-[480px]">
      <div className="p-5 border-b-[3px] border-black bg-[#113826]">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C9A84C]">
          Anatomical High-Fidelity Twin
        </div>
      </div>
      
      <div className="relative h-[410px]">
        <DigitalTwin 
          vitals={twinVitals}
          mode={isAthlete ? 'athlete' : 'patient'}
          interactive={true}
          showBadges={true}
          scale={0.6}
        />
      </div>
    </div>
  )
}
