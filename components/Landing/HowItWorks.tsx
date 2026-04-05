'use client'

import React from 'react'
import { motion } from 'framer-motion'

export function HowItWorks() {
  return (
    <>
      <section id="how-it-works" className="bg-em-2 px-7 py-24 text-white flex justify-center border-b-[6px] border-black">
        <div className="max-w-7xl w-full">
          <div className="text-center mb-16 flex flex-col items-center">
            <div className="inline-block bg-gd border-[3px] border-black px-6 py-2 text-[12px] font-mono font-black text-black mb-6 shadow-[4px_4px_0_#000] uppercase tracking-widest">
              Deployment Protocol
            </div>
            <h2 className="text-7xl font-display tracking-tight leading-[0.9] text-white uppercase max-w-4xl">
              Launch your twin in <span className="text-gd underline decoration-[10px] underline-offset-[8px]">3 phases</span>
            </h2>
          </div>

          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
            className="grid md:grid-cols-3 gap-10 mt-12"
          >
            {/* Step 1 */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-white/5 border-[3px] border-white/20 p-8 shadow-[8px_8px_0px_rgba(255,255,255,0.05)]">
              <div className="text-7xl font-display text-gd mb-6 leading-none tracking-tighter">01</div>
              <h3 className="text-2xl font-display text-white mb-4 uppercase tracking-wide">Sync Health Data</h3>
              <p className="text-[14px] text-white/50 leading-relaxed font-mono uppercase font-bold">
                Input your vitals via the 3D body zone interface. Clinical accuracy achieved in under 3 minutes.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-white/5 border-[3px] border-white/20 p-8 shadow-[8px_8px_0px_rgba(255,255,255,0.05)]">
              <div className="text-7xl font-display text-gd mb-6 leading-none tracking-tighter">02</div>
              <h3 className="text-2xl font-display text-white mb-4 uppercase tracking-wide">Neural Synthesis</h3>
              <p className="text-[14px] text-white/50 leading-relaxed font-mono uppercase font-bold">
                Our engine builds your baseline profile, scoring risk factors and generating Claude-powered insights.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-white/5 border-[3px] border-white/20 p-8 shadow-[8px_8px_0px_rgba(255,255,255,0.05)]">
              <div className="text-7xl font-display text-gd mb-6 leading-none tracking-tighter">03</div>
              <h3 className="text-2xl font-display text-white mb-4 uppercase tracking-wide">Simulate Future</h3>
              <p className="text-[14px] text-white/50 leading-relaxed font-mono uppercase font-bold">
                Run what-if projections, iterate on lifestyle choices, and finalize your clinical-grade PDF report.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats row */}
      <div className="bg-cr border-b-[6px] border-black flex justify-center">
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-50px" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="max-w-7xl w-full grid grid-cols-2 md:grid-cols-4 gap-0 px-0 py-0"
        >
          {[
            { val: "3", label: "Conditions monitored" },
            { val: "5+", label: "Languages supported" },
            { val: "AI", label: "Claude-powered" },
            { val: "∞", label: "Simulations to run" }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} 
              className="bg-white border-r-[4px] border-black last:border-r-0 p-12 text-center flex flex-col items-center justify-center transition-all hover:bg-gd/10"
            >
              <div className="text-8xl font-display text-em leading-none mb-4">{stat.val}</div>
              <div className="text-[12px] font-mono font-black uppercase text-mu tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  )
}
