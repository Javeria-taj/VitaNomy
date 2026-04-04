'use client'

import React from 'react'
import { motion } from 'framer-motion'

export function HowItWorks() {
  return (
    <>
      <section id="how-it-works" className="bg-em-2 px-7 py-12 pt-14 text-white flex justify-center">
        <div className="max-w-7xl w-full">
        <div className="text-center mb-8">
          <div className="inline-block bg-[rgba(201,168,76,0.15)] border-2 border-gd rounded-full px-3.5 py-1 text-[11px] font-medium text-gd-2 mb-2.5 shadow-[2px_2px_0_var(--color-gd)]">
            Simple to start
          </div>
          <h2 className="text-[27px] font-medium tracking-tight leading-[1.15]">
            Your twin in <span className="text-gd-2 line-through decoration-transparent">3 steps</span>
          </h2>
        </div>

        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          className="grid md:grid-cols-3 gap-3.5 mt-8"
        >
          {/* Step 1 */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-white/5 border-[1.5px] border-white/15 rounded-xl p-5 backdrop-blur-sm">
            <div className="text-[46px] font-medium text-gd opacity-45 leading-none tracking-tight mb-2.5">01</div>
            <h3 className="text-[14px] font-medium text-white mb-2">Enter your health data</h3>
            <p className="text-[12px] text-white/50 leading-[1.65]">
              Use the interactive 3D model to input vitals — touch body zones for each measurement. Takes under 3 minutes.
            </p>
            <div className="inline-block mt-2.5 bg-[rgba(201,168,76,0.2)] border border-[rgba(201,168,76,0.3)] rounded flex-none px-2 py-1 text-[10px] text-gd-2">
              3D Body Input
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-white/5 border-[1.5px] border-white/15 rounded-xl p-5 backdrop-blur-sm">
            <div className="text-[46px] font-medium text-gd opacity-45 leading-none tracking-tight mb-2.5">02</div>
            <h3 className="text-[14px] font-medium text-white mb-2">AI builds your twin</h3>
            <p className="text-[12px] text-white/50 leading-[1.65]">
              VitaNomy scores your risks, generates personalised Claude-powered insights, and highlights zones on your 3D model.
            </p>
            <div className="inline-block mt-2.5 bg-[rgba(201,168,76,0.2)] border border-[rgba(201,168,76,0.3)] rounded flex-none px-2 py-1 text-[10px] text-gd-2">
              Instant Analysis
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-white/5 border-[1.5px] border-white/15 rounded-xl p-5 backdrop-blur-sm">
            <div className="text-[46px] font-medium text-gd opacity-45 leading-none tracking-tight mb-2.5">03</div>
            <h3 className="text-[14px] font-medium text-white mb-2">Simulate and improve</h3>
            <p className="text-[12px] text-white/50 leading-[1.65]">
              Run what-if scenarios, chat with your AI health assistant, and download your full PDF report.
            </p>
            <div className="inline-block mt-2.5 bg-[rgba(201,168,76,0.2)] border border-[rgba(201,168,76,0.3)] rounded flex-none px-2 py-1 text-[10px] text-gd-2">
              PDF Report Included
            </div>
          </motion.div>
        </motion.div>
        </div>
      </section>

      {/* Stats row integrated right under */}
      <div className="bg-cr-2 flex justify-center">
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-50px" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="max-w-7xl w-full grid grid-cols-2 md:grid-cols-4 gap-3.5 px-7 py-11"
        >
        <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }} className="bg-white border-[2.5px] border-ink rounded-xl p-5 text-center shadow-[4px_4px_0_var(--color-ink)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-ink)] duration-200">
          <div className="text-[30px] font-medium text-em tracking-tight mb-1">3</div>
          <div className="text-[11px] text-mu">Conditions monitored</div>
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }} className="bg-white border-[2.5px] border-ink rounded-xl p-5 text-center shadow-[4px_4px_0_var(--color-ink)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-ink)] duration-200">
          <div className="text-[30px] font-medium text-em tracking-tight mb-1">5+</div>
          <div className="text-[11px] text-mu">Languages supported</div>
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }} className="bg-white border-[2.5px] border-ink rounded-xl p-5 text-center shadow-[4px_4px_0_var(--color-ink)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-ink)] duration-200">
          <div className="text-[30px] font-medium text-em tracking-tight mb-1">AI</div>
          <div className="text-[11px] text-mu">Claude-powered</div>
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }} className="bg-white border-[2.5px] border-ink rounded-xl p-5 text-center shadow-[4px_4px_0_var(--color-ink)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-ink)] duration-200">
          <div className="text-[30px] font-medium text-em tracking-tight mb-1">&infin;</div>
          <div className="text-[11px] text-mu">Simulations to run</div>
        </motion.div>
        </motion.div>
      </div>
    </>
  )
}
