'use client'

import React, { useEffect } from 'react'
import { PatientForm } from '@/components/Form/PatientForm'
import { usePatientStore } from '@/store/patientStore'
import { Topbar } from '@/components/Layout/Topbar'

export default function AthleteIntakePage() {
  const { setMode } = usePatientStore()

  useEffect(() => {
    setMode('athlete')
  }, [setMode])

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F4F2E9', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Topbar />
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-2xl bg-white border-[4px] border-black p-8 lg:p-12 shadow-[12px_12px_0px_#000] relative overflow-hidden">
          {/* Performance Grid Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, #000 0, #000 1px, transparent 1px, transparent 24px), repeating-linear-gradient(90deg, #000 0, #000 1px, transparent 1px, transparent 24px)'
          }} />
          
          <div className="relative z-10">
            <header className="mb-10 text-center">
              <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-3">Performance Intake</h1>
              <p className="text-[14px] font-bold uppercase tracking-widest text-black/50">
                Advanced Biometric & Compound Monitoring
              </p>
            </header>

            <PatientForm mode="athlete" />

            <footer className="mt-12 pt-6 border-t-[2px] border-black/10 text-center">
               <p className="text-[11px] font-black uppercase tracking-widest text-black/30">
                  Data encrypted with clinical grade security (AES-256)
               </p>
            </footer>
          </div>
        </div>
      </main>
    </div>
  )
}
