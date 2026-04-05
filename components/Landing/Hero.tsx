'use client'

import React from 'react'
import Link from 'next/link'
import { DataTwin } from './DataTwin'

export function Hero() {
  return (
    <section className="bg-cr px-7 py-16 md:py-24 flex justify-center overflow-hidden border-b-[6px] border-black relative">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #000 0px, #000 1px, transparent 1px, transparent 40px)`
      }} />

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        
        {/* Left Side (Typography - col-span-5) */}
        <div className="lg:col-span-6 flex flex-col items-start">
          <div className="inline-flex items-center gap-3 bg-gd border-[3px] border-black px-5 py-2 text-[12px] font-mono font-black mb-8 shadow-[4px_4px_0px_#000000] uppercase tracking-tighter">
            <span className="w-3 h-3 bg-em-2 border-2 border-black animate-pulse" />
            VITA-OS V2.4: ENGINE ACTIVE
          </div>
          
          <h1 className="text-7xl md:text-8xl font-display leading-[0.9] tracking-tighter mb-6 text-black uppercase">
            Know your body.<br/>
            Before it <span className="text-em underline decoration-[8px] underline-offset-[12px]">speaks</span>.
          </h1>
          
          <p className="text-[18px] text-tx leading-relaxed mb-10 font-bold max-w-lg font-mono uppercase tracking-tight">
            VitaNomy builds a high-fidelity AI digital twin — predicting diabetes, cardiac risk, and hypertension. Real-time simulation of your clinical future.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
            <Link href="/register" className="px-10 py-5 border-[4px] border-black text-[18px] font-display uppercase tracking-widest shadow-[8px_8px_0px_#000000] bg-em text-white hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all text-center">
              Build My Twin &rarr;
            </Link>
            <a href="#how-it-works" className="px-10 py-5 border-[4px] border-black text-[18px] font-display uppercase tracking-widest shadow-[8px_8px_0px_#000000] bg-white text-black hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all text-center">
              View Protocol
            </a>
          </div>
        </div>

        {/* Right Side (3D Canvas - col-span-6) */}
        <div className="lg:col-span-6 w-full h-[500px] lg:h-[650px] relative border-[6px] border-black bg-em-2 shadow-[20px_20px_0px_rgba(17,56,38,0.2)]">
          <DataTwin />
          {/* Subtle Overlay Label */}
          <div className="absolute bottom-6 right-6 px-4 py-2 bg-gd border-[3px] border-black font-mono text-[11px] font-black uppercase text-black">
            Twin-Telemetry-Stream: OK
          </div>
        </div>
        
      </div>
    </section>
  )
}
