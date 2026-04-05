import { NextRequest, NextResponse } from 'next/server';
import { calculateRisks } from '@/lib/riskEngine';
import { getSimulationNarrative } from '@/lib/claudeService';
import { AnyPatientInput, SimulateRequest, SimulateResponse, PatientInput, AthleteInput } from '@/types/patient';

export async function POST(req: NextRequest) {
  try {
    const { patient, scenario, modifiedPatient }: SimulateRequest = await req.json();

    if (!patient || !scenario) {
      return NextResponse.json({ error: 'Patient and scenario are required' }, { status: 400 });
    }

    let modifiedPatientFinal: AnyPatientInput;

    if (scenario === 'custom' && modifiedPatient) {
      modifiedPatientFinal = modifiedPatient;
    } else {
      modifiedPatientFinal = JSON.parse(JSON.stringify(patient));
      if (patient.mode === 'patient') {
        const p = modifiedPatientFinal as PatientInput;
        switch (scenario) {
          case 'exercise':
            p.exercise = 'moderate';
            p.weight = (p.weight || 70) * 0.97;
            break;
          case 'diet':
            if (p.glucose) p.glucose = p.glucose * 0.88;
            if (p.cholesterol_total) p.cholesterol_total = p.cholesterol_total * 0.92;
            if (p.triglycerides) p.triglycerides = p.triglycerides * 0.85;
            break;
          case 'quit_smoking':
            p.smoking = false;
            if (p.systolic_bp) p.systolic_bp = p.systolic_bp - 6;
            break;
          case 'medication':
            if (p.systolic_bp) p.systolic_bp = p.systolic_bp * 0.88;
            if (p.diastolic_bp) p.diastolic_bp = p.diastolic_bp * 0.88;
            if (p.glucose) p.glucose = p.glucose * 0.85;
            break;
        }
      } else {
        const a = modifiedPatientFinal as AthleteInput;
        switch (scenario) {
          case 'reduce_dose':
            a.compounds = (a.compounds || []).map(c => ({ ...c, dose_mg: c.dose_mg * 0.5 }));
            break;
          case 'add_organ_support':
            if (a.alt) a.alt *= 0.75;
            if (a.ast) a.ast *= 0.75;
            break;
          case 'start_pct':
            a.pct_active = true;
            if (a.lh) a.lh *= 1.8;
            if (a.fsh) a.fsh *= 1.8;
            break;
          case 'cycle_off':
            a.compounds = [];
            a.pct_active = true;
            if (a.lh) a.lh = a.lh * 2.5; else a.lh = 2.0;
            if (a.fsh) a.fsh = a.fsh * 2.5; else a.fsh = 1.8;
            break;
        }
      }
    }

    const original_risks = calculateRisks(patient);
    const projected_risks = calculateRisks(modifiedPatientFinal);

    // Calculate Delta
    const delta: Record<string, number> = {};
    const risksToCompare = patient.mode === 'patient' 
      ? ['diabetes', 'cardiac', 'hypertension'] 
      : ['cardiovascular', 'hepatotoxicity', 'endocrine_suppression', 'hematological'];

    risksToCompare.forEach(key => {
      // @ts-ignore (safe property access on RiskFactor)
      delta[key] = projected_risks[key].score - original_risks[key].score;
    });

    const timeframes: Record<string, string> = {
      exercise: '3-6 months', diet: '2-3 months',
      quit_smoking: '6-12 months', medication: '4-8 weeks',
      reduce_dose: '4-6 weeks', add_organ_support: '2-4 weeks',
      start_pct: '4-8 weeks', cycle_off: '3-6 months'
    };
    const timeframe = timeframes[scenario] || '8 weeks';

    const narrative = await getSimulationNarrative(scenario, delta, timeframe);

    const response: SimulateResponse = {
      original_risks,
      projected_risks,
      delta,
      narrative,
      timeframe
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Simulate Error:', error);
    return NextResponse.json({ error: 'Simulation failed' }, { status: 500 });
  }
}
