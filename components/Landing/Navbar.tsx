'use client'

import React from 'react'
import Link from 'next/link'

export function Navbar() {
  return (
    <>
      <div className="bg-em-2 border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-7 py-1.5 flex justify-between items-center text-[10px] font-mono">
          <span className="text-white/45 uppercase tracking-widest">Clinical Digital Twin Platform — v2.0</span>
          <div className="flex gap-2">
            <span className="px-2 py-0.5 border border-black bg-gd text-ink font-bold">EN</span>
            <span className="px-2 py-0.5 text-white/55">हि</span>
            <span className="px-2 py-0.5 text-white/55">த</span>
            <span className="px-2 py-0.5 text-white/55">తె</span>
            <span className="px-2 py-0.5 text-white/55">ಕ</span>
          </div>
        </div>
      </div>

      <nav className="border-b-[4px] border-black bg-cr sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-7 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="text-3xl font-display uppercase tracking-tight text-em-2">VitaNomy</div>
          </Link>

          <div className="hidden md:flex gap-6 text-[13px] font-mono font-bold text-black border-[3px] border-black px-6 py-2 shadow-[4px_4px_0px_#000000] bg-white">
            <a href="#features" className="hover:text-em tracking-tighter uppercase">Features</a>
            <a href="#how-it-works" className="hover:text-em tracking-tighter uppercase">Protocol</a>
            <a href="#features" className="hover:text-em tracking-tighter uppercase">Clinical</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[13px] font-mono font-bold px-6 py-2.5 border-[3px] border-black bg-white shadow-[4px_4px_0px_#000000] text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all uppercase">Log in</Link>
            <Link href="/register" className="text-[13px] font-mono font-bold px-6 py-2.5 border-[3px] border-black bg-em text-white shadow-[4px_4px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all uppercase tracking-wide">Build Twin &rarr;</Link>
          </div>
        </div>
      </nav>
    </>
  )
}
