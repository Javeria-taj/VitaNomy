'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="min-h-screen grid lg:grid-cols-[5fr_7fr]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── LEFT PANEL: Green Billboard ────────────────────────────────── */}
      <div
        className="relative overflow-hidden flex flex-col justify-between p-10 lg:p-12"
        style={{ backgroundColor: '#113826', minHeight: '100vh' }}
      >
        {/* CSS Grid Pattern Overlay */}
        <div
          className="absolute inset-0 pointer-events-none animate-grid-drift"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, rgba(100,200,140,0.07) 0px, rgba(100,200,140,0.07) 1px, transparent 1px, transparent 48px),
              repeating-linear-gradient(90deg, rgba(100,200,140,0.07) 0px, rgba(100,200,140,0.07) 1px, transparent 1px, transparent 48px)
            `,
            opacity: 0.8
          }}
        />

        {/* "VN" Watermark SVG — bottom half, background presence */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[55%] overflow-hidden pointer-events-none flex items-end justify-center"
          animate={{
            y: [0, -15, 0],
            rotate: [-12, -10, -12]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg
            viewBox="0 0 400 260"
            className="w-full max-w-[520px] opacity-[0.08]"
            style={{ transform: 'translateY(40px)' }}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text
              x="0"
              y="220"
              fontSize="300"
              fontWeight="900"
              stroke="white"
              strokeWidth="8"
              fill="none"
              letterSpacing="-10"
              fontFamily="Inter, system-ui, sans-serif"
            >
              VN
            </text>
          </svg>
        </motion.div>

        {/* Top of panel — Logo */}
        <div className="relative z-10">
          <div
            className="inline-block text-[22px] font-black tracking-tight px-3 py-1 rounded-lg border-[3px] border-black"
            style={{
              backgroundColor: '#F4F2E9',
              color: '#113826',
              boxShadow: '4px 4px 0px #000000',
            }}
          >
            VitaNomy
          </div>
        </div>

        {/* Middle — Headline + Feature Cards */}
        <div className="relative z-10 flex flex-col gap-8">
          <h1
            className="text-5xl font-black leading-[1.05] tracking-tight"
            style={{ color: '#F4F2E9' }}
          >
            Your health,<br />
            <span style={{ color: '#C9A84C' }}>mirrored<br />precisely.</span>
          </h1>

          <div className="flex flex-col gap-3">
            {[
              { dot: '#7EC8A0', text: '3 conditions tracked simultaneously with AI precision' },
              { dot: '#C9A84C', text: 'Simulate scenarios — see how choices change your future' },
              { dot: '#A89BEE', text: 'PDF health reports — shareable, printable, yours forever' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border-[3px] border-black px-4 py-3"
                style={{
                  backgroundColor: '#F4F2E9',
                  boxShadow: '5px 5px 0px #000000',
                }}
              >
                <div
                  className="w-3.5 h-3.5 rounded-full flex-shrink-0 border-2 border-black animate-pulse-dot"
                  style={{ backgroundColor: item.dot }}
                />
                <span className="text-[13px] font-bold text-black leading-snug">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tag */}
        <div className="relative z-10 text-[11px] font-bold tracking-widest uppercase" style={{ color: 'rgba(244,242,233,0.35)' }}>
          AI Health Intelligence Platform
        </div>
      </div>

      {/* ── RIGHT PANEL: Beige Form ─────────────────────────────────────── */}
      <div
        className="flex flex-col min-h-screen"
        style={{ backgroundColor: '#F4F2E9' }}
      >
        {/* Minimal Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b-[3px] border-black">
          <Link href="/" className="text-[20px] font-black text-black tracking-tight hover:opacity-80 transition-opacity">
            VitaNomy
          </Link>
          <Link
            href="/register"
            className="text-[13px] font-black text-black hover:underline underline-offset-4 decoration-2 transition-all"
          >
            New? Create an account →
          </Link>
        </div>

        {/* Centered Form */}
        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-md flex flex-col gap-6">

            {/* Heading */}
            <div>
              <h1 className="text-4xl font-black text-black tracking-tight leading-tight mb-1">
                Sign in to<br />VitaNomy.
              </h1>
              <p className="text-[13px] font-semibold text-black/50">
                Access your AI-powered digital twin.
              </p>
            </div>

            {/* Google Button */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-white rounded-xl border-[3px] border-black px-5 py-3 text-[14px] font-black text-black transition-all"
              style={{
                boxShadow: '5px 5px 0px #000000',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '7px 7px 0px #000000'
                e.currentTarget.style.transform = 'translate(-1px, -1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '5px 5px 0px #000000'
                e.currentTarget.style.transform = 'translate(0, 0)'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 border-t-2 border-black" />
              <span className="text-[12px] font-black text-black uppercase tracking-widest whitespace-nowrap">
                or sign in with email
              </span>
              <div className="flex-1 border-t-2 border-black" />
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-4">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-black text-black uppercase tracking-widest">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white rounded-lg border-[3px] border-black px-4 py-3 text-[14px] font-semibold text-black placeholder:text-black/30 outline-none transition-all"
                  style={{ boxShadow: '3px 3px 0px #000000' }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = '5px 5px 0px #000000'
                    e.target.style.transform = 'translate(-1px, -1px)'
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = '3px 3px 0px #000000'
                    e.target.style.transform = 'translate(0, 0)'
                  }}
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-black text-black uppercase tracking-widest">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    className="w-full bg-white rounded-lg border-[3px] border-black px-4 py-3 pr-12 text-[14px] font-semibold text-black placeholder:text-black/30 outline-none transition-all"
                    style={{ boxShadow: '3px 3px 0px #000000' }}
                    onFocus={(e) => {
                      e.target.style.boxShadow = '5px 5px 0px #000000'
                      e.target.style.transform = 'translate(-1px, -1px)'
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '3px 3px 0px #000000'
                      e.target.style.transform = 'translate(0, 0)'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[12px] font-black text-black/50 hover:text-black transition-colors select-none"
                  >
                    {showPassword ? 'HIDE' : 'SHOW'}
                  </button>
                </div>

                {/* Forgot Password */}
                <div className="text-right mt-1">
                  <Link
                    href="#"
                    className="text-[12px] font-black text-black underline underline-offset-4 decoration-2 hover:opacity-70 transition-opacity"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <motion.button
              whileHover="hover"
              type="button"
              className="w-full flex items-center justify-between rounded-xl border-[3px] border-black px-6 py-4 text-[15px] font-black text-white transition-all group"
              style={{
                backgroundColor: '#113826',
                boxShadow: '5px 5px 0px #000000',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '7px 7px 0px #000000'
                e.currentTarget.style.transform = 'translate(-1px, -1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '5px 5px 0px #000000'
                e.currentTarget.style.transform = 'translate(0, 0)'
              }}
            >
              <span>Sign In to VitaNomy</span>
              <motion.span 
                variants={{ hover: { x: 5 } }}
                className="text-[18px] leading-none"
              >
                →
              </motion.span>
            </motion.button>

            {/* Security Note */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <div className="w-1.5 h-1.5 rounded-full bg-black/30" />
              <span className="text-[11px] font-bold text-black/40 tracking-wide uppercase">
                256-bit encrypted · HIPAA-compliant
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-black/30" />
            </div>

          </div>
        </div>
      </div>

    </div>
  )
}
