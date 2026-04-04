'use client'

import React from 'react'
import { usePatientStore } from '@/store/patientStore'
import { PatientInput } from '@/types/patient'


export function PatientBanner() {
  const { patient, analysis } = usePatientStore()
  
  if (!patient) return (
    <div className="p-8 text-center border-2 border-dashed border-border-tertiary rounded-xl mb-5">
      <p className="text-[14px] text-text-secondary">Please complete the patient intake form to generate your digital twin.</p>
    </div>
  )
  
  const bmi = (patient.weight / ((patient.height / 100) ** 2)).toFixed(1)
  const initials = patient.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const riskColor = analysis?.risk_scores.overall_risk === 'CRITICAL' ? 'bg-red-50 text-red-600 border-red-200' : 
                    analysis?.risk_scores.overall_risk === 'HIGH' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                    analysis?.risk_scores.overall_risk === 'MEDIUM' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                    'bg-green-50 text-green-600 border-green-200'

  return (
    <div className="flex items-center gap-3.5 p-4 rounded-xl bg-bg-secondary border-[0.5px] border-border-tertiary mb-5 shadow-sm">
      <div className="w-11 h-11 rounded-full bg-coral/10 border-[1.5px] border-coral flex items-center justify-center text-[15px] font-bold text-coral shrink-0">
        {initials}
      </div>
      <div>
        <div className="text-[16px] font-bold">{patient.name}</div>
        <div className="text-[12px] text-text-secondary mt-0.5 font-medium">
          {patient.age} yr · {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)} · BMI {bmi} {patient.mode === 'patient' ? ` · ${(patient as PatientInput).smoking ? 'Smoker' : 'Non-smoker'} · ${(patient as PatientInput).exercise.charAt(0).toUpperCase() + (patient as PatientInput).exercise.slice(1)} exercise` : ''}
        </div>
      </div>
      {analysis && (
        <div className={`ml-auto px-3 py-1 rounded-full text-[11px] font-bold border-[1px] uppercase tracking-wider ${riskColor}`}>
          {analysis.risk_scores.overall_risk} RISK
        </div>
      )}
    </div>
  )
}
