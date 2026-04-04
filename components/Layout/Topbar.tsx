'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Topbar() {
  const pathname = usePathname()
  
  const navItems = [
    { name: 'Form', path: '/onboarding' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Simulator', path: '/simulator' },
    { name: 'Chat', path: '/chat' },
  ]
  
  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-b-[0.5px] border-border-tertiary bg-bg-secondary shrink-0">
      <div className="text-[15px] font-medium flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-coral"></div>
        HealthTwin
      </div>
      
      <div className="flex gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.path
          return (
            <Link 
              key={item.name}
              href={item.path}
              className={`text-[12px] px-3 py-1.5 rounded-full border-[0.5px] transition-colors ${
                isActive 
                  ? 'bg-coral text-white border-coral' 
                  : 'bg-bg-primary border-border-tertiary text-text-secondary hover:border-coral/50'
              }`}
            >
              {item.name}
            </Link>
          )
        })}
      </div>
      
      <div className="w-[30px] h-[30px] rounded-full bg-[#f2cc8f] flex items-center justify-center text-[11px] font-medium text-[#7a5c1e]">
        AM
      </div>
    </div>
  )
}
