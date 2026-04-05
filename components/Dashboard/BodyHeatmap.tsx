import React from 'react'
import { usePatientStore } from '@/store/patientStore'
import { motion } from 'framer-motion'
import { PatientRiskScores, AthleteRiskScores, RiskFactor } from '@/types/patient'

export function BodyHeatmap() {
  const { analysis } = usePatientStore()
  
  if (!analysis) return null
  
  const scores = analysis.risk_scores

  return (
    <div className="p-5 border-[3px] border-black bg-[#113826] shadow-[4px_4px_0px_#000000] overflow-hidden relative group">
      {/* Background texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, #F4F2E9 0px, #F4F2E9 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, #F4F2E9 0px, #F4F2E9 1px, transparent 1px, transparent 20px)' }}
      />

      <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-5 text-[#C9A84C]">
        Anatomical Risk Map
      </div>
      
      <div className="relative flex justify-center items-center h-[240px]">
        <svg width="140" height="240" viewBox="0 0 120 210" className="relative z-10 transition-transform group-hover:scale-105 duration-500">
          {/* Abstract Wireframe Figure */}
          
          {/* Head (Hexagonal) */}
          <path d="M60 5 L75 12 L75 28 L60 35 L45 28 L45 12 Z" fill="none" stroke="#F4F2E9" strokeWidth="2.5" />
          
          {/* Torso (Geometric) */}
          <rect x="35" y="40" width="50" height="65" fill="none" stroke="#F4F2E9" strokeWidth="2.5" />
          <line x1="35" y1="55" x2="85" y2="55" stroke="#F4F2E9" strokeWidth="1" strokeDasharray="4 4" />
          
          {/* Risk Zones - Pulsing */}
          {/* Cardiac */}
          <motion.rect 
            x="50" y="50" width="20" height="15" 
            fill={(() => {
              const s = scores.mode === 'patient'
                ? (typeof (scores as PatientRiskScores).cardiac === 'object' ? ((scores as PatientRiskScores).cardiac as RiskFactor)?.score ?? 0 : ((scores as PatientRiskScores).cardiac as number) ?? 0)
                : (typeof (scores as AthleteRiskScores).cardiovascular === 'object' ? ((scores as AthleteRiskScores).cardiovascular as RiskFactor)?.score ?? 0 : ((scores as AthleteRiskScores).cardiovascular as number) ?? 0)
              return s > 60 ? '#E07A5F' : '#C9A84C'
            })()}
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.2, repeat: Infinity, repeatType: "reverse" }}
          />
          
          {/* Abdominal/Diabetes */}
          <motion.rect 
            x="45" y="75" width="30" height="20" 
            fill={(() => {
              const s = scores.mode === 'patient'
                ? (typeof (scores as PatientRiskScores).diabetes === 'object' ? ((scores as PatientRiskScores).diabetes as RiskFactor)?.score ?? 0 : ((scores as PatientRiskScores).diabetes as number) ?? 0)
                : (typeof (scores as AthleteRiskScores).hepatotoxicity === 'object' ? ((scores as AthleteRiskScores).hepatotoxicity as RiskFactor)?.score ?? 0 : ((scores as AthleteRiskScores).hepatotoxicity as number) ?? 0)
              return s > 60 ? '#E07A5F' : '#C9A84C'
            })()}
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.35, repeat: Infinity, repeatType: "reverse", delay: 0.1 }}
          />

          {/* Arms (Rectangular) */}
          <path d="M35 45 L15 45 L15 95" fill="none" stroke="#F4F2E9" strokeWidth="2.5" />
          <path d="M85 45 L105 45 L105 95" fill="none" stroke="#F4F2E9" strokeWidth="2.5" />

          {/* Legs (Geometric) */}
          <path d="M45 105 L45 190 L30 190" fill="none" stroke="#F4F2E9" strokeWidth="2.5" />
          <path d="M75 105 L75 190 L90 190" fill="none" stroke="#F4F2E9" strokeWidth="2.5" />

          {/* Annotations */}
          <text x="60" y="61" textAnchor="middle" fontSize="6" fontWeight="900" fill="white">CVR: {scores.mode === 'patient'
            ? (typeof (scores as PatientRiskScores).cardiac === 'object' ? ((scores as PatientRiskScores).cardiac as RiskFactor)?.score ?? 0 : ((scores as PatientRiskScores).cardiac as number) ?? 0)
            : (typeof (scores as AthleteRiskScores).cardiovascular === 'object' ? ((scores as AthleteRiskScores).cardiovascular as RiskFactor)?.score ?? 0 : ((scores as AthleteRiskScores).cardiovascular as number) ?? 0)}%</text>
          <text x="60" y="87" textAnchor="middle" fontSize="6" fontWeight="900" fill="white">T2D: {scores.mode === 'patient'
            ? (typeof (scores as PatientRiskScores).diabetes === 'object' ? ((scores as PatientRiskScores).diabetes as RiskFactor)?.score ?? 0 : ((scores as PatientRiskScores).diabetes as number) ?? 0)
            : (typeof (scores as AthleteRiskScores).hepatotoxicity === 'object' ? ((scores as AthleteRiskScores).hepatotoxicity as RiskFactor)?.score ?? 0 : ((scores as AthleteRiskScores).hepatotoxicity as number) ?? 0)}%</text>
        </svg>
      </div>
      
      <div className="mt-4 pt-4 border-t-[1px] border-white/10 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-black uppercase text-white/40">Cardiac Node</span>
          <span className="text-[10px] font-black text-[#E07A5F]">PULSATING</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-black uppercase text-white/40">Metabolic Node</span>
          <span className="text-[10px] font-black text-[#C9A84C]">STRESS_LEVEL_HIGH</span>
        </div>
      </div>
    </div>
  )
}
