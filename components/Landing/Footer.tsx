'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <>
      <div className="flex justify-center mb-12">
        <div className="mx-7 bg-em border-[3px] border-ink rounded-xl p-8 flex flex-col md:flex-row items-center justify-between shadow-[6px_6px_0_var(--color-ink)] gap-6 max-w-7xl w-full">
          <div>
            <h2 className="text-[22px] font-medium text-white mb-1.5 tracking-tight">Start building your digital twin today.</h2>
            <p className="text-[12px] text-white/50">Free to try. No hardware. No wearables. Just you and your data.</p>
          </div>
          <Link href="/register" className="px-6 py-3 bg-gd text-ink border-[2.5px] border-ink rounded-lg text-[13px] font-medium shadow-[4px_4px_0_var(--color-ink)] whitespace-nowrap hover:translate-y-px hover:shadow-[3px_3px_0_var(--color-ink)] transition-all">
            Build My Twin &rarr;
          </Link>
        </div>
      </div>

      <footer className="border-t-2 border-ink py-5 px-7 bg-cr-2 flex justify-center rounded-b-xl">
        <div className="max-w-7xl w-full flex flex-col sm:flex-row items-center justify-between flex-wrap gap-2.5">
          <div className="text-[15px] font-medium tracking-tight text-ink">Vita<b className="font-medium text-gd">Nomy</b></div>
          
          <div className="flex gap-4">
            <span className="text-[11px] text-mu cursor-pointer hover:text-ink">Privacy</span>
            <span className="text-[11px] text-mu cursor-pointer hover:text-ink">Terms</span>
            <span className="text-[11px] text-mu cursor-pointer hover:text-ink">About</span>
            <span className="text-[11px] text-mu cursor-pointer hover:text-ink">Support</span>
          </div>

          <div className="text-[10.5px] text-mu italic tracking-wide">Mock early. Integrate late. Polish always.</div>
        </div>
      </footer>
    </>
  )
}
