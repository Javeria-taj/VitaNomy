'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface SimulatorBodyProps {
  type: 'baseline' | 'simulated'
  vitals: {
    bp: string
    glucose: number
    hr: number
    bmi: number
  }
}

const STROKE = '#F4F2E9'
const STROKE_DIM = 'rgba(244,242,233,0.3)'
const GOLD = '#C9A84C'
const GREEN = '#7EC8A0'
const RED = '#E07A5F'

// Harsh blink: instant opacity cut, no easing
const blinkTransition = { duration: 0.6, repeat: Infinity, ease: 'linear' as const }

export function SimulatorBody({ type, vitals }: SimulatorBodyProps) {
  const isSim = type === 'simulated'

  const getBpColor = () => parseInt(vitals.bp.split('/')[0]) > 130 ? RED : GREEN
  const getGlColor = () => vitals.glucose > 110 ? RED : GREEN
  const getHrColor = () => vitals.hr > 75 ? GOLD : GREEN
  const getBmiColor = () => vitals.bmi > 29 ? GOLD : GREEN

  const bpCol = getBpColor()
  const glCol = getGlColor()
  const hrCol = getHrColor()
  const bmiCol = getBmiColor()

  return (
    <div className="relative flex items-center justify-center h-[310px] w-[180px]">

      {/* LEFT ANNOTATION — BP */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="absolute right-[calc(100%-8px)] top-[38px] flex items-center gap-[4px] pointer-events-none z-10"
      >
        <div
          className="text-[9px] font-black font-mono px-2 py-1 border-[2px] border-black whitespace-nowrap"
          style={{ backgroundColor: bpCol, color: '#000', boxShadow: '2px 2px 0px #000' }}
        >
          {vitals.bp}
        </div>
        <div className="w-6 h-[2px] bg-[#F4F2E9]" />
      </motion.div>

      {/* LEFT ANNOTATION — Glucose */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute right-[calc(100%-8px)] top-[105px] flex items-center gap-[4px] pointer-events-none z-10"
      >
        <div
          className="text-[9px] font-black font-mono px-2 py-1 border-[2px] border-black whitespace-nowrap"
          style={{ backgroundColor: glCol, color: '#000', boxShadow: '2px 2px 0px #000' }}
        >
          {vitals.glucose} mg/dL
        </div>
        <div className="w-6 h-[2px] bg-[#F4F2E9]" />
      </motion.div>

      {/* BODY SVG — Abstract Geometric Wireframe */}
      <motion.div
        animate={{
          y: isSim ? [-3, 3, -3] : [-5, 5, -5],
        }}
        transition={{ duration: isSim ? 7 : 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="110" height="290" viewBox="0 0 110 290" fill="none" xmlns="http://www.w3.org/2000/svg">

          {/* ── HEAD: hexagonal abstraction ── */}
          <polygon
            points="55,5 72,14 72,34 55,43 38,34 38,14"
            stroke={STROKE}
            strokeWidth="3"
            fill="none"
          />
          {/* Center crosshair on head */}
          <line x1="55" y1="14" x2="55" y2="34" stroke={STROKE_DIM} strokeWidth="1.5" />
          <line x1="44" y1="24" x2="66" y2="24" stroke={STROKE_DIM} strokeWidth="1.5" />

          {/* ── NECK ── */}
          <rect x="49" y="43" width="12" height="10" stroke={STROKE} strokeWidth="2.5" fill="none" />

          {/* ── TORSO: blocky rectangle ── */}
          <rect x="30" y="53" width="50" height="65" rx="0" stroke={STROKE} strokeWidth="3" fill="none" />
          {/* Torso internal division line */}
          <line x1="30" y1="85" x2="80" y2="85" stroke={STROKE_DIM} strokeWidth="1.5" strokeDasharray="4 4" />

          {/* ── HEART NODE (chest center) ── */}
          <motion.circle
            cx="55" cy="72" r="6"
            stroke={hrCol}
            strokeWidth="3"
            fill="none"
            animate={{ opacity: [1, 0, 1, 0, 1] }}
            transition={blinkTransition}
          />
          <motion.circle
            cx="55" cy="72" r="2"
            fill={hrCol}
            animate={{ opacity: [1, 0, 1, 0, 1] }}
            transition={{ ...blinkTransition, delay: 0.05 }}
          />

          {/* ── ECG trace in torso ── */}
          <polyline
            points="34,95 37,95 40,86 44,104 48,81 52,98 56,98 60,95 64,95"
            stroke={hrCol}
            strokeWidth="2"
            fill="none"
            strokeLinecap="square"
          />

          {/* ── SHOULDER joints ── */}
          <rect x="21" y="53" width="9" height="9" stroke={STROKE} strokeWidth="2.5" fill="none" />
          <rect x="80" y="53" width="9" height="9" stroke={STROKE} strokeWidth="2.5" fill="none" />

          {/* ── ARMS: geometric bars ── */}
          {/* Left arm */}
          <line x1="25" y1="62" x2="16" y2="100" stroke={STROKE} strokeWidth="3" />
          <rect x="11" y="100" width="10" height="8" stroke={STROKE} strokeWidth="2.5" fill="none" />
          {/* Right arm */}
          <line x1="85" y1="62" x2="94" y2="100" stroke={STROKE} strokeWidth="3" />
          <rect x="89" y="100" width="10" height="8" stroke={STROKE} strokeWidth="2.5" fill="none" />

          {/* ── PELVIS block ── */}
          <rect x="33" y="118" width="44" height="14" stroke={STROKE} strokeWidth="3" fill="none" />

          {/* ── LEGS ── */}
          {/* Left upper leg */}
          <rect x="33" y="132" width="18" height="44" stroke={STROKE} strokeWidth="2.5" fill="none" />
          {/* Right upper leg */}
          <rect x="59" y="132" width="18" height="44" stroke={STROKE} strokeWidth="2.5" fill="none" />
          {/* Knee joints */}
          <rect x="35" y="174" width="14" height="8" stroke={STROKE} strokeWidth="2.5" fill="none" />
          <rect x="61" y="174" width="14" height="8" stroke={STROKE} strokeWidth="2.5" fill="none" />
          {/* Lower legs */}
          <rect x="35" y="182" width="14" height="40" stroke={STROKE} strokeWidth="2.5" fill="none" />
          <rect x="61" y="182" width="14" height="40" stroke={STROKE} strokeWidth="2.5" fill="none" />
          {/* Feet */}
          <rect x="31" y="222" width="22" height="7" stroke={STROKE} strokeWidth="2.5" fill="none" />
          <rect x="57" y="222" width="22" height="7" stroke={STROKE} strokeWidth="2.5" fill="none" />

          {/* ── RISK NODES ── */}
          {/* Glucose node (abdomen) */}
          <motion.rect
            x="48" y="88" width="14" height="14"
            stroke={glCol}
            strokeWidth="2.5"
            fill="none"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ ...blinkTransition, duration: 0.9 }}
          />
          {/* BP node (neck/head connect) */}
          <motion.circle
            cx="55" cy="47" r="4"
            stroke={bpCol}
            strokeWidth="2.5"
            fill="none"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ ...blinkTransition, duration: 0.75, delay: 0.1 }}
          />
          {/* BMI node (pelvis) */}
          <motion.circle
            cx="55" cy="140" r="5"
            stroke={bmiCol}
            strokeWidth="2.5"
            fill={bmiCol + '33'}
            animate={{ opacity: [1, 0, 1] }}
            transition={{ ...blinkTransition, duration: 1.1, delay: 0.2 }}
          />

        </svg>
      </motion.div>

      {/* RIGHT ANNOTATION — HR */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 }}
        className="absolute left-[calc(100%-8px)] top-[52px] flex items-center gap-[4px] pointer-events-none z-10"
      >
        <div className="w-6 h-[2px] bg-[#F4F2E9]" />
        <div
          className="text-[9px] font-black font-mono px-2 py-1 border-[2px] border-black whitespace-nowrap"
          style={{ backgroundColor: hrCol, color: '#000', boxShadow: '2px 2px 0px #000' }}
        >
          {vitals.hr} bpm
        </div>
      </motion.div>

      {/* RIGHT ANNOTATION — BMI */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.25 }}
        className="absolute left-[calc(100%-8px)] top-[125px] flex items-center gap-[4px] pointer-events-none z-10"
      >
        <div className="w-6 h-[2px] bg-[#F4F2E9]" />
        <div
          className="text-[9px] font-black font-mono px-2 py-1 border-[2px] border-black whitespace-nowrap"
          style={{ backgroundColor: bmiCol, color: '#000', boxShadow: '2px 2px 0px #000' }}
        >
          BMI {vitals.bmi}
        </div>
      </motion.div>

    </div>
  )
}
