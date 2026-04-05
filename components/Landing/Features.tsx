'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Box, Cpu, Activity, FileText } from 'lucide-react'

export function Features() {
  return (
    <section id="features" className="bg-cr px-7 py-24 flex justify-center border-b-[6px] border-black">
      <div className="max-w-7xl w-full">
        <div className="text-center mb-20 flex flex-col items-center">
          <div className="inline-block bg-gd border-[3px] border-black px-6 py-2 text-[12px] font-mono font-black text-black mb-6 shadow-[4px_4px_0px_#000000] uppercase tracking-widest">
            Capabilities Matrix
          </div>
          <h2 className="text-7xl font-display tracking-tight leading-[0.9] text-black uppercase max-w-4xl">
            One platform, <span className="text-em underline decoration-[10px] underline-offset-[8px]">complete health intelligence</span>
          </h2>
        </div>

        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {/* Feature 1 */}
          <Link href="/register" className="block outline-none h-full">
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-em-2 border-[5px] border-black p-8 shadow-[8px_8px_0px_#000000] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-200 h-full flex flex-col items-start text-left">
                <div className="w-16 h-16 bg-white border-[3px] border-black flex items-center justify-center mb-8 shadow-[4px_4px_0px_#000000]">
                   <Box className="w-8 h-8 text-black" strokeWidth={3} />
                </div>
                <h3 className="text-3xl font-display mb-4 text-white uppercase leading-none tracking-wide">3D Body Twin</h3>
                <p className="text-[14px] text-white/70 leading-relaxed font-mono uppercase font-bold">
                  Gender-aware 3D model with interactive input zones. Real-time visual risk highlighting.
                </p>
            </motion.div>
          </Link>

          {/* Feature 2 */}
          <Link href="/dashboard" className="block outline-none h-full">
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-em-2 border-[5px] border-black p-8 shadow-[8px_8px_0px_#000000] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-200 h-full flex flex-col items-start text-left">
                <div className="w-16 h-16 bg-white border-[3px] border-black flex items-center justify-center mb-8 shadow-[4px_4px_0px_#000000]">
                  <Cpu className="w-8 h-8 text-black" strokeWidth={3} />
                </div>
                <h3 className="text-3xl font-display mb-4 text-white uppercase leading-none tracking-wide">AI Risk Intel</h3>
                <p className="text-[14px] text-white/70 leading-relaxed font-mono uppercase font-bold">
                  Claude-powered analysis for diabetes, cardiac, and hypertension risk profiles.
                </p>
            </motion.div>
          </Link>

          {/* Feature 3 */}
          <Link href="/simulator" className="block outline-none h-full">
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-em-2 border-[5px] border-black p-8 shadow-[8px_8px_0px_#000000] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-200 h-full flex flex-col items-start text-left">
                <div className="w-16 h-16 bg-white border-[3px] border-black flex items-center justify-center mb-8 shadow-[4px_4px_0px_#000000]">
                   <Activity className="w-8 h-8 text-black" strokeWidth={3} />
                </div>
                <h3 className="text-3xl font-display mb-4 text-white uppercase leading-none tracking-wide">What-If Simulation</h3>
                <p className="text-[14px] text-white/70 leading-relaxed font-mono uppercase font-bold">
                  Predict how exercise, diet, and medication changes impact your risk over time.
                </p>
            </motion.div>
          </Link>

          {/* Feature 4 */}
          <Link href="/dashboard" className="block outline-none h-full">
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-em-2 border-[5px] border-black p-8 shadow-[8px_8px_0px_#000000] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-200 h-full flex flex-col items-start text-left">
                <div className="w-16 h-16 bg-white border-[3px] border-black flex items-center justify-center mb-8 shadow-[4px_4px_0px_#000000]">
                   <FileText className="w-8 h-8 text-black" strokeWidth={3} />
                </div>
                <h3 className="text-3xl font-display mb-4 text-white uppercase leading-none tracking-wide">Clinical Reports</h3>
                <p className="text-[14px] text-white/70 leading-relaxed font-mono uppercase font-bold">
                  Download professional PDF health reports to share with your medical team.
                </p>
            </motion.div>
          </Link>

        </motion.div>
      </div>
    </section>
  )
}
