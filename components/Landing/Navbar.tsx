'use client'

import React from 'react'
import Link from 'next/link'

export function Navbar() {
  return (
    <>
      <div className="bg-em-2">
        <div className="max-w-7xl mx-auto px-7 py-1.5 flex justify-between items-center text-[10px]">
          <span className="text-white/45">Multilingual health intelligence</span>
          <div className="flex gap-1">
            <span className="px-2 py-1 rounded bg-gd text-ink font-medium">EN</span>
            <span className="px-2 py-1 rounded text-white/55">हि</span>
            <span className="px-2 py-1 rounded text-white/55">த</span>
            <span className="px-2 py-1 rounded text-white/55">తె</span>
            <span className="px-2 py-1 rounded text-white/55">ಕ</span>
          </div>
        </div>
      </div>

      <nav className="border-b-4 border-black bg-cr">
        <div className="max-w-7xl mx-auto px-7 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="text-2xl font-bold tracking-tight text-em-2">VitaNomy</div>
          </Link>
          
          <div className="hidden md:flex gap-6 text-[15px] font-bold text-black border-2 border-black rounded-xl px-5 py-2 shadow-[4px_4px_0px_#000000] bg-white">
            <a href="#features" className="hover:text-em-2 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-em-2 transition-colors">How It Works</a>
            <a href="#features" className="hover:text-em-2 transition-colors">Conditions</a>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/onboarding" className="text-[14px] px-6 py-2.5 border-[3px] border-black rounded-xl bg-white shadow-[4px_4px_0px_#000000] font-bold text-black hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000000] transition-all">Log in</Link>
            <Link href="/onboarding" className="text-[14px] px-6 py-2.5 border-[3px] border-black rounded-xl bg-em-2 text-white shadow-[4px_4px_0px_#000000] font-bold hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000000] transition-all">Get Started &rarr;</Link>
          </div>
        </div>
      </nav>
    </>
  )
}
