'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Box, Cpu, Activity, FileText } from 'lucide-react'

export function Features() {
  return (
    <section id="features" className="bg-cr px-7 py-20 flex justify-center">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-16">
          <div className="inline-block bg-white border-[3px] border-black rounded-full px-5 py-2 text-[14px] font-bold text-black mb-4 shadow-[4px_4px_0px_#000000]">
            Everything you need
          </div>
          <h2 className="text-5xl font-bold tracking-tight leading-[1.1] text-black">
            One platform, <span className="text-em-2 line-through decoration-em-2 decoration-4">complete health intelligence</span>
          </h2>
        </div>

        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* Feature 1 */}
          <Link href="/onboarding" className="block outline-none h-full">
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-em-2 border-[4px] border-black rounded-2xl p-8 shadow-[6px_6px_0px_#000000] hover:-translate-y-2 hover:-translate-x-1 hover:shadow-[10px_10px_0px_#000000] transition-all duration-200 h-full flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-white border-[3px] border-black rounded-xl flex items-center justify-center mb-6 shadow-[3px_3px_0px_#000000]">
                   <Box className="w-7 h-7 text-black" strokeWidth={3} />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">3D Body Digital Twin</h3>
                <p className="text-[16px] text-white/80 leading-relaxed font-medium">
                  Gender-aware 3D model with interactive input zones. Tap body regions to enter measurements. Risk zones highlight in real time.
                </p>
              </div>
            </motion.div>
          </Link>

          {/* Feature 2 */}
          <Link href="/dashboard" className="block outline-none h-full">
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-em-2 border-[4px] border-black rounded-2xl p-8 shadow-[6px_6px_0px_#000000] hover:-translate-y-2 hover:-translate-x-1 hover:shadow-[10px_10px_0px_#000000] transition-all duration-200 h-full flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-white border-[3px] border-black rounded-xl flex items-center justify-center mb-6 shadow-[3px_3px_0px_#000000]">
                  <Cpu className="w-7 h-7 text-black" strokeWidth={3} />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">AI Risk Intelligence</h3>
                <p className="text-[16px] text-white/80 leading-relaxed font-medium">
                  Claude-powered analysis scores diabetes, cardiac, and hypertension risk. Personalised insights updated in real time.
                </p>
              </div>
            </motion.div>
          </Link>

          {/* Feature 3 */}
          <Link href="/simulator" className="block outline-none h-full">
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-em-2 border-[4px] border-black rounded-2xl p-8 shadow-[6px_6px_0px_#000000] hover:-translate-y-2 hover:-translate-x-1 hover:shadow-[10px_10px_0px_#000000] transition-all duration-200 h-full flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-white border-[3px] border-black rounded-xl flex items-center justify-center mb-6 shadow-[3px_3px_0px_#000000]">
                   <Activity className="w-7 h-7 text-black" strokeWidth={3} />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">What-If Simulator</h3>
                <p className="text-[16px] text-white/80 leading-relaxed font-medium">
                  Simulate exercise, diet changes, medication or quitting smoking. See exact projected risk reduction over 6 months.
                </p>
              </div>
            </motion.div>
          </Link>

          {/* Feature 4 */}
          <Link href="/dashboard" className="block outline-none h-full">
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-em-2 border-[4px] border-black rounded-2xl p-8 shadow-[6px_6px_0px_#000000] hover:-translate-y-2 hover:-translate-x-1 hover:shadow-[10px_10px_0px_#000000] transition-all duration-200 h-full flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-white border-[3px] border-black rounded-xl flex items-center justify-center mb-6 shadow-[3px_3px_0px_#000000]">
                   <FileText className="w-7 h-7 text-black" strokeWidth={3} />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">PDF Health Reports</h3>
                <p className="text-[16px] text-white/80 leading-relaxed font-medium">
                  Download a clinical-grade report of your entire twin analysis. Share with your doctor or track progress over time.
                </p>
              </div>
            </motion.div>
          </Link>

        </motion.div>
      </div>
    </section>
  )
}
