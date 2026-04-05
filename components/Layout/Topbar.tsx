import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { usePatientStore } from '@/store/patientStore'
import { useTranslation } from '@/hooks/useTranslation'
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
  const router = useRouter()
  const { patient, reset } = usePatientStore()
  const { t } = useTranslation()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  
  const name = patient?.name || ''
  const isGuest = !patient

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = () => {
    reset()
    setShowDropdown(false)
    router.push('/')
  }

  const navItems = [
    { name: t.nav.dashboard, path: '/dashboard' },
    { name: t.nav.simulator, path: '/simulator' },
    { name: t.nav.chat, path: '/chat' },
    { name: t.nav.account, path: '/account' },
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
              key={item.path}
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

      {/* ── USER PROFILE DROPDOWN ── */}
      <div className="relative" ref={dropdownRef}>
        <div 
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-3 px-4 py-2 border-[3px] border-black bg-white shadow-[3px_3px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#000] transition-all cursor-pointer group select-none"
        >
          <TypoAvatar name={isGuest ? '?' : name} />
          <span className="text-[14px] font-black uppercase tracking-tight" style={{ color: C.black }}>
            {isGuest ? t.nav.initTwin : name}
          </span>
          <span className={`text-[10px] transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`}>▼</span>
        </div>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div 
            className="absolute right-0 mt-3 w-56 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000] z-[60] overflow-hidden"
            style={{ animation: 'dropdownIn 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards' }}
          >
            <style jsx>{`
              @keyframes dropdownIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>
            
            {!isGuest ? (
              <>
                <Link 
                  href="/account" 
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-3 p-4 hover:bg-beige transition-colors border-b-[2px] border-black"
                >
                  <span className="text-lg">👤</span>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-black uppercase tracking-tight">Clinical Profile</span>
                    <span className="text-[9px] font-extrabold text-mu uppercase">Manage Telemetry</span>
                  </div>
                </Link>
                
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 p-4 hover:bg-red-50 text-red-600 transition-colors"
                >
                  <span className="text-lg">↪</span>
                  <div className="flex flex-col text-left">
                    <span className="text-[12px] font-black uppercase tracking-tight">Sign Out</span>
                    <span className="text-[9px] font-extrabold opacity-60 uppercase">Flush Session Data</span>
                  </div>
                </button>
              </>
            ) : (
              <Link 
                href="/account"
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-3 p-4 hover:bg-beige transition-colors"
              >
                <span className="text-lg">⚡</span>
                <div className="flex flex-col">
                  <span className="text-[12px] font-black uppercase tracking-tight">Initialize Twin</span>
                  <span className="text-[9px] font-extrabold text-mu uppercase">Begin Medical Intake</span>
                </div>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
