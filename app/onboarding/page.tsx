import { Topbar } from '@/components/Layout/Topbar'
import { PatientForm } from '@/components/Form/PatientForm'

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-bg-secondary text-text-primary font-sans flex flex-col md:p-8">
      <div className="max-w-[900px] w-full mx-auto flex flex-col h-full">
        <div className="text-[11px] font-medium tracking-widest uppercase text-text-secondary mt-10 mb-3 flex items-center gap-2">
          Page 1 — patient intake form
          <div className="flex-1 h-[0.5px] bg-border-tertiary ml-2"></div>
        </div>
        
        <div className="bg-bg-primary border-[0.5px] border-border-tertiary rounded-xl overflow-hidden shadow-sm flex flex-col">
          <Topbar />
          <PatientForm />
        </div>
      </div>
    </main>
  )
}
