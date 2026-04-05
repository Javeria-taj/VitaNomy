'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCredentialLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (res?.error) {
      setError('Invalid email or password.')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[5fr_7fr]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── LEFT PANEL: Green Billboard ─────────────────────────────────────── */}
      <div className="relative overflow-hidden flex flex-col justify-between p-10 lg:p-12"
        style={{ backgroundColor: '#113826', minHeight: '100vh' }}>

        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `repeating-linear-gradient(0deg,rgba(100,200,140,0.07) 0px,rgba(100,200,140,0.07) 1px,transparent 1px,transparent 48px),repeating-linear-gradient(90deg,rgba(100,200,140,0.07) 0px,rgba(100,200,140,0.07) 1px,transparent 1px,transparent 48px)`,
          opacity: 0.8
        }} />

        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[55%] overflow-hidden pointer-events-none flex items-end justify-center"
          animate={{ y: [0, -15, 0], rotate: [-12, -10, -12] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg viewBox="0 0 400 260" className="w-full max-w-[520px] opacity-[0.08]"
            style={{ transform: 'translateY(40px)' }} fill="none">
            <text x="0" y="220" fontSize="300" fontWeight="900" stroke="white" strokeWidth="8"
              fill="none" letterSpacing="-10" fontFamily="Inter, system-ui, sans-serif">VN</text>
          </svg>
        </motion.div>

        <div className="relative z-10">
          <div className="inline-block text-[22px] font-black tracking-tight px-3 py-1 rounded-lg border-[3px] border-black"
            style={{ backgroundColor: '#F4F2E9', color: '#113826', boxShadow: '4px 4px 0px #000000' }}>
            VitaNomy
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-8">
          <h1 className="text-5xl font-black leading-[1.05] tracking-tight" style={{ color: '#F4F2E9' }}>
            Your health,<br />
            <span style={{ color: '#C9A84C' }}>mirrored<br />precisely.</span>
          </h1>
          <div className="flex flex-col gap-3">
            {[
              { dot: '#7EC8A0', text: '3 conditions tracked simultaneously with AI precision' },
              { dot: '#C9A84C', text: 'Simulate scenarios — see how choices change your future' },
              { dot: '#A89BEE', text: 'PDF health reports — shareable, printable, yours forever' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border-[3px] border-black px-4 py-3"
                style={{ backgroundColor: '#F4F2E9', boxShadow: '5px 5px 0px #000000' }}>
                <div className="w-3.5 h-3.5 rounded-full flex-shrink-0 border-2 border-black"
                  style={{ backgroundColor: item.dot }} />
                <span className="text-[13px] font-bold text-black leading-snug">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-[11px] font-bold tracking-widest uppercase"
          style={{ color: 'rgba(244,242,233,0.35)' }}>
          AI Health Intelligence Platform
        </div>
      </div>

      {/* ── RIGHT PANEL: Beige Form ──────────────────────────────────────────── */}
      <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#F4F2E9' }}>
        <div className="flex items-center justify-between px-8 py-5 border-b-[3px] border-black">
          <Link href="/" className="text-[20px] font-black text-black tracking-tight hover:opacity-80 transition-opacity">
            VitaNomy
          </Link>
          <Link href="/register" className="text-[13px] font-black text-black hover:underline underline-offset-4 decoration-2 transition-all">
            New? Create an account →
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-md flex flex-col gap-6">
            <div>
              <h1 className="text-4xl font-black text-black tracking-tight leading-tight mb-1">
                Sign in to<br />VitaNomy.
              </h1>
              <p className="text-[13px] font-semibold text-black/50">Access your AI-powered digital twin.</p>
            </div>

            {/* Credential form */}

            {/* Credential form */}
            <form onSubmit={handleCredentialLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-black text-black uppercase tracking-widest">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white rounded-lg border-[3px] border-black px-4 py-3 text-[14px] font-semibold text-black placeholder:text-black/30 outline-none"
                  style={{ boxShadow: '3px 3px 0px #000000' }}
                  onFocus={e => { e.target.style.boxShadow = '5px 5px 0px #000000'; e.target.style.transform = 'translate(-1px,-1px)' }}
                  onBlur={e => { e.target.style.boxShadow = '3px 3px 0px #000000'; e.target.style.transform = 'translate(0,0)' }} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-black text-black uppercase tracking-widest">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)} placeholder="••••••••••"
                    className="w-full bg-white rounded-lg border-[3px] border-black px-4 py-3 pr-12 text-[14px] font-semibold text-black placeholder:text-black/30 outline-none"
                    style={{ boxShadow: '3px 3px 0px #000000' }}
                    onFocus={e => { e.target.style.boxShadow = '5px 5px 0px #000000'; e.target.style.transform = 'translate(-1px,-1px)' }}
                    onBlur={e => { e.target.style.boxShadow = '3px 3px 0px #000000'; e.target.style.transform = 'translate(0,0)' }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[12px] font-black text-black/50 hover:text-black">
                    {showPassword ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
                <div className="text-right mt-1">
                  <Link href="#" className="text-[12px] font-black text-black underline underline-offset-4 decoration-2 hover:opacity-70">
                    Forgot password?
                  </Link>
                </div>
              </div>

              {error && (
                <div className="text-[12px] font-black text-red-600 border-[2px] border-red-400 px-3 py-2 bg-red-50 rounded-lg">
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-between rounded-xl border-[3px] border-black px-6 py-4 text-[15px] font-black text-white transition-all disabled:opacity-60"
                style={{ backgroundColor: '#113826', boxShadow: '5px 5px 0px #000000' }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.boxShadow = '7px 7px 0px #000000'; e.currentTarget.style.transform = 'translate(-1px,-1px)' } }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '5px 5px 0px #000000'; e.currentTarget.style.transform = 'translate(0,0)' }}>
                <span>{loading ? 'Signing in…' : 'Sign In to VitaNomy'}</span>
                <span className="text-[18px] leading-none">→</span>
              </button>
            </form>

            {/* Security Note */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <div className="w-1.5 h-1.5 rounded-full bg-black/30" />
              <span className="text-[11px] font-bold text-black/40 tracking-wide uppercase">256-bit encrypted · HIPAA-compliant</span>
              <div className="w-1.5 h-1.5 rounded-full bg-black/30" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
