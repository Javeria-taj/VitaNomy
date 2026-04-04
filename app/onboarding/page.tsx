import { Topbar } from '@/components/Layout/Topbar'
import { PatientForm } from '@/components/Form/PatientForm'

export default function OnboardingPage() {
  return (
    <main className="min-h-screen font-sans flex flex-col md:p-8" style={{ backgroundColor: '#F8F5EE' }}>
      <div className="max-w-[900px] w-full mx-auto flex flex-col h-full">
        <div className="text-[11px] font-black tracking-widest uppercase mt-10 mb-3 flex items-center gap-2" style={{ color: '#5C7268' }}>
          Page 1 — patient intake form
          <div className="flex-1 h-[2px] bg-black/10 ml-2"></div>
        </div>
        
        <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_#000] overflow-hidden flex flex-col">
          <Topbar />
          <PatientForm />
        </div>
      </div>
    </main>
  )
}
