import React from 'react'
import { usePatientStore } from '@/store/patientStore'
import { DigitalTwin } from '@/components/Visuals/DigitalTwin'
import { PatientRiskScores, AthleteRiskScores, AthleteInput } from '@/types/patient'

export function BodyHeatmap() {
  const { analysis, mode, patient } = usePatientStore()

  if (!analysis || !patient) return null

  const scores = analysis.risk_scores
  const isAthlete = mode === 'athlete'

  // Calculate BMI and format BP from patient data
  const bmi = patient.height > 0 ? patient.weight / ((patient.height / 100) ** 2) : 24.2
  const bpString = (patient.systolic_bp && patient.diastolic_bp) 
    ? `${patient.systolic_bp}/${patient.diastolic_bp}` 
    : '120/80'

  // Map analysis data to DigitalTwin vitals format
  const twinVitals = {
    bp: bpString,
    glucose: patient.glucose || 94,
    hr: 72, // Default HR as it's not collected in the form
    bmi: Number(bmi.toFixed(1)),
    alt: isAthlete ? (patient as AthleteInput).alt : undefined,
    gfr: undefined // GFR is not currently collected or calculated
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
