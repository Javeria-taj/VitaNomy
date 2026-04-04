'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { usePatientStore } from '@/store/patientStore'
import { TypoAvatar } from '@/components/Common/TypoAvatar'

const C = {
  beige:         '#F8F5EE',
  white:         '#FFFFFF',
  darkGreen:     '#1B5E3B',
  black:         '#0A0F0D',
  electricYellow:'#C9A84C', // Gold accent
  mu:            '#5C7268',  // muted text
}

export function Topbar() {
  const pathname = usePathname()
  const { patient } = usePatientStore()
  
  const name = patient?.name || ''
  const isGuest = !patient

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Simulator', path: '/simulator' },
    { name: 'Chat AI', path: '/chat' },
    { name: 'Account', path: '/account' },
  ]

  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b-[3px] border-black shrink-0 relative z-50"
      style={{ backgroundColor: C.beige }}>
      
      {/* ── LOGO ── */}
      <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
        <div className="w-10 h-10 border-[3px] border-black flex items-center justify-center shadow-[3px_3px_0px_#000]"
          style={{ backgroundColor: C.darkGreen }}>
          <span className="font-black text-xl font-mono" style={{ color: C.electricYellow }}>V</span>
        </div>
        <span className="text-[22px] font-black tracking-tighter uppercase" style={{ color: C.black }}>
          Vita<span style={{ color: C.darkGreen }}>Nomy</span>
        </span>
      </Link>

      {/* ── NAV ITEMS ── */}
      <div className="flex gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.path
          return (
            <Link 
              key={item.name} 
              href={item.path}
              className="px-5 py-2 text-[13px] font-black border-[3px] transition-all uppercase tracking-wider"
              style={isActive
                ? { backgroundColor: C.darkGreen, color: C.white, borderColor: C.black, boxShadow: '3px 3px 0px #000' }
                : { backgroundColor: 'transparent', borderColor: 'transparent', color: C.mu }}>
              {item.name}
            </Link>
          )
        })}
      </div>

      {/* ── USER PROFILE ── */}
      <Link href="/onboarding" className="flex items-center gap-3 px-4 py-2 border-[3px] border-black bg-white shadow-[3px_3px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#000] transition-all cursor-pointer">
        <TypoAvatar name={isGuest ? '?' : name} />
        <span className="text-[14px] font-black uppercase tracking-tight" style={{ color: C.black }}>
          {isGuest ? 'Initialize Twin' : name}
        </span>
      </Link>
    </nav>
  )
}
