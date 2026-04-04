'use client'

import React from 'react'
import Link from 'next/link'
import { DataTwin } from './DataTwin'

export function Hero() {
  return (
    <section className="bg-cr px-7 py-16 md:py-24 flex justify-center overflow-hidden border-b-4 border-black">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left Side (Typography - col-span-5) */}
        <div className="z-10 relative lg:col-span-5 flex flex-col items-start">
          <div className="inline-flex items-center gap-2 bg-white border-[3px] border-black rounded-full px-4 py-2 text-[14px] font-bold mb-8 shadow-[4px_4px_0px_#000000]">
            <div className="w-2.5 h-2.5 rounded-full bg-em-2 border-2 border-black"></div>
            AI-Powered Health Intelligence
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-6 text-black">
            Know your body.<br/>
            Before it <em className="not-italic text-em-2 underline decoration-[4px] underline-offset-8">speaks</em>.
          </h1>
          
          <p className="text-lg text-gray-700 leading-relaxed mb-10 font-medium">
            VitaNomy builds a real-time AI digital twin of you — tracking diabetes, cardiac risk, and hypertension — then simulates how your choices change your future health.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5">
            <Link href="/register" className="px-8 py-3.5 border-[3px] border-black rounded-xl text-[16px] font-bold shadow-[6px_6px_0px_#000000] bg-em-2 text-white hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000000] transition-all text-center">
              Build My Twin &rarr;
            </Link>
            <a href="#how-it-works" className="px-8 py-3.5 border-[3px] border-black rounded-xl text-[16px] font-bold shadow-[6px_6px_0px_#000000] bg-cr text-black hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000000] transition-all text-center">
              See How It Works
            </a>
          </div>
        </div>

        {/* Right Side (3D Canvas - col-span-7) */}
        <div className="lg:col-span-7 w-full h-[500px] lg:h-[650px] relative">
          <DataTwin />
        </div>
        
      </div>
    </section>
  )
}
