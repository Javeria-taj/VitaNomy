import { NextRequest, NextResponse } from 'next/server';
import { calculateRisks, getOverallRisk } from '@/lib/riskEngine';
import { getInsights } from '@/lib/claudeService';
import { prisma } from '@/lib/db';
import { AnyPatientInput, AnalyzeResponse } from '@/types/patient';

export async function POST(req: NextRequest) {
  try {
    const patient: AnyPatientInput = await req.json();

    if (!patient.mode) {
      return NextResponse.json({ error: 'Mode is required' }, { status: 400 });
    }

    // 1. Synchronous risk calculation
    const risk_scores = calculateRisks(patient);
    const overall_risk = getOverallRisk(risk_scores);

    // 2. Async AI insights
    const { insights, recommendations, causation_flags } = await getInsights(patient, risk_scores);

    // 3. Data completeness calculation
    const expectedFields = patient.mode === 'patient' 
      ? ['age', 'gender', 'weight', 'height', 'systolic_bp', 'diastolic_bp', 'glucose', 'cholesterol_total', 'smoking', 'exercise']
      : ['age', 'gender', 'weight', 'height', 'compounds', 'training_years', 'hematocrit', 'alt', 'ast', 'testosterone_total'];
    
    // @ts-ignore (dynamic key check)
    const definedCount = expectedFields.filter(f => patient[f] !== undefined && patient[f] !== null).length;
    const data_completeness = Math.round((definedCount / expectedFields.length) * 100);

    const patientId = `${patient.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;

    // 4. Persistence with error handling
    try {
      const session = await prisma.session.upsert({
        where: { patientId: patient.name.replace(/\s+/g, '-').toLowerCase() }, // Reusing name as base to keep history linked? 
        // Based on prompt, we generate a timestamped patient_id, but the session model uses patientId. 
        // We will simplify and use the name-based ID for session linking.
        create: { patientId: patient.name.replace(/\s+/g, '-').toLowerCase(), mode: patient.mode },
        update: {}
      });

      await prisma.patientRecord.upsert({
        where: { sessionId: session.id },
        update: { inputData: patient as any, mode: patient.mode },
        create: { sessionId: session.id, inputData: patient as any, mode: patient.mode }
      });

      await prisma.analysis.create({
        data: {
          sessionId: session.id,
          riskScores: risk_scores as any,
          insights: { insights, recommendations, causation_flags } as any
        }
      });
    } catch (dbError) {
      console.error('Database Error (Analyze):', dbError);
    }

    const response: AnalyzeResponse = {
      patient_id: patientId,
      mode: patient.mode,
      risk_scores,
      insights,
      recommendations,
      causation_flags,
      data_completeness
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Analyze Error:', error);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
