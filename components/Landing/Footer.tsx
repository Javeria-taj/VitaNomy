'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <>
      <div className="flex justify-center mb-16 px-7">
        <div className="bg-em border-[5px] border-black p-12 flex flex-col md:flex-row items-center justify-between shadow-[12px_12px_0_#000] gap-8 max-w-7xl w-full">
          <div>
            <h2 className="text-5xl font-display text-white mb-4 uppercase tracking-wide leading-none">Start building your <span className="text-gd underline decoration-8 underline-offset-8">digital twin</span> today.</h2>
            <p className="text-[14px] font-mono font-bold text-white/50 uppercase">Free to try. No hardware. No wearables. Real-time inference.</p>
          </div>
          <Link href="/register" className="px-10 py-5 bg-gd text-ink border-[4px] border-black text-[18px] font-display uppercase tracking-widest shadow-[6px_6px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all whitespace-nowrap">
            Build My Twin &rarr;
          </Link>
        </div>
      </div>

      <footer className="border-t-[4px] border-black py-8 px-7 bg-white flex justify-center">
        <div className="max-w-7xl w-full flex flex-col sm:flex-row items-center justify-between flex-wrap gap-6">
          <div className="text-3xl font-display uppercase tracking-tight text-em">VitaNomy</div>
          
          <div className="flex gap-8 font-mono text-[12px] font-black uppercase text-mu">
            <span className="cursor-pointer hover:text-black">Privacy-Protocol</span>
            <span className="cursor-pointer hover:text-black">Terms-of-Service</span>
            <span className="cursor-pointer hover:text-black">Clinical-Doc</span>
            <span className="cursor-pointer hover:text-black">Support-Intel</span>
          </div>

          <div className="text-[11px] font-mono text-mu uppercase font-bold tracking-widest opacity-60">© 2026 VITANOMY — ALL SYSTEMS NOMINAL</div>
        </div>
      </footer>
    </>
  )
}
