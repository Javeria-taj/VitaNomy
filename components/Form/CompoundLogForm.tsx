'use client'

import React, { useState } from 'react'
import { Compound } from '@/types/patient'

interface CompoundLogFormProps {
  compounds: Compound[]
  setCompounds: (compounds: Compound[]) => void
}

export function CompoundLogForm({ compounds, setCompounds }: CompoundLogFormProps) {
  const [name, setName] = useState('')
  const [doseMg, setDoseMg] = useState('100')
  const [frequency, setFrequency] = useState('daily')

  const addCompound = () => {
    if (!name || !doseMg) return
    const newCompound: Compound = {
      name,
      dose_mg: Number(doseMg),
      frequency,
      compound_type: 'performance',
      route: 'oral',
      cycle_week_current: 1,
      cycle_week_total: 12,
      is_pct: false
    }
    setCompounds([...compounds, newCompound])
    setName('')
  }

  const removeCompound = (index: number) => {
    setCompounds(compounds.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-3">
      {/* List */}
      {compounds.length > 0 && (
        <div className="space-y-1.5 max-h-[150px] overflow-y-auto mb-2 pr-1 custom-scrollbar">
          {compounds.map((c, i) => (
            <div key={i} className="flex items-center justify-between p-2 border-[2px] border-black bg-beige/30 text-[11px]">
              <div className="font-black uppercase truncate mr-2">
                 {c.name} <span className="opacity-40">{c.dose_mg}mg</span>
              </div>
              <button onClick={() => removeCompound(i)} className="text-red-600 font-bold hover:scale-110 transition-transform px-1">✕</button>
            </div>
          ))}
        </div>
      )}

      {/* Input Grid */}
      <div className="grid grid-cols-1 gap-2">
         <input 
           placeholder="Compound (e.g. Test E)" 
           value={name} 
           onChange={e => setName(e.target.value)}
           className="w-full bg-white border-[2px] border-black px-2.5 py-1.5 text-[11px] font-bold outline-none placeholder:text-black/30"
         />
         <div className="flex gap-2">
           <input 
             placeholder="mg" 
             type="number"
             value={doseMg} 
             onChange={e => setDoseMg(e.target.value)}
             className="w-20 bg-white border-[2px] border-black px-2.5 py-1.5 text-[11px] font-bold outline-none"
           />
           <select 
             value={frequency} 
             onChange={e => setFrequency(e.target.value)}
             className="bg-white border-[2px] border-black px-2 py-1.5 text-[10px] font-black uppercase outline-none flex-1"
           >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="eod">EOD</option>
           </select>
         </div>
      </div>
      
      <button 
        onClick={addCompound}
        className="w-full py-2 border-[2px] border-black bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#C9A84C] hover:text-black transition-all shadow-[2px_2px_0px_#000]"
      >
        + Add to Protocol
      </button>
    </div>
  )
}
