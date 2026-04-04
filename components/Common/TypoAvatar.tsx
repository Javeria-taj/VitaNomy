'use client'

import React from 'react'

const C = {
  darkGreen: '#1B5E3B',
  white: '#FFFFFF',
}

interface TypoAvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  bg?: string
  color?: string
}

export function TypoAvatar({ name, size = 'sm', bg = C.darkGreen, color = C.white }: TypoAvatarProps) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  
  const sizes = {
    sm: 'w-8 h-8 text-[11px]',
    md: 'w-10 h-10 text-[13px]',
    lg: 'w-14 h-14 text-[22px]',
    xl: 'w-20 h-20 text-[32px] border-[4px] shadow-[6px_6px_0px_#000]'
  }
  
  const borderSize = size === 'xl' ? 'border-[4px]' : 'border-[3px]'
  const shadowSize = size === 'xl' ? 'shadow-[6px_6px_0px_#000]' : 'shadow-[3px_3px_0px_#000]'

  return (
    <div className={`${sizes[size]} ${borderSize} border-black flex items-center justify-center font-black ${size !== 'xl' ? shadowSize : ''} shrink-0 uppercase tracking-tighter`}
      style={{ backgroundColor: bg, color }}>
      {initials}
    </div>
  )
}
