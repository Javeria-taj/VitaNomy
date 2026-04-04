import Anthropic from '@anthropic-ai/sdk';
import { 
  AnyPatientInput, 
  AnyRiskScores, 
  AnalyzeResponse, 
  ChatMessage,
  PatientInput,
  AthleteInput,
  PatientRiskScores,
  AthleteRiskScores
} from '@/types/patient';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const MODEL_NAME = 'claude-sonnet-4-20250514';

export const FALLBACK_PATIENT_INSIGHTS = {
  insights: [
    'Risk factors identified across cardiovascular and metabolic markers.',
    'Lifestyle factors are significantly contributing to your risk profile.',
    'Early intervention could meaningfully reduce your risk scores.'
  ],
  recommendations: [
    'Schedule a follow-up with your physician within 30 days.',
    'Begin moderate physical activity — 30 minutes 5x per week.',
    'Review dietary sodium and cholesterol intake.'
  ]
};

export const FALLBACK_ATHLETE_INSIGHTS = {
  insights: [
    'Biomarker patterns indicate active compound influence on key systems.',
    'Hepatic and hematological markers warrant close monitoring.',
    'Endocrine suppression markers are present.'
  ],
  recommendations: [
    'Schedule bloodwork review with a sports medicine physician.',
    'Ensure liver support protocol is active during oral compound use.',
    'PCT planning should begin before cycle end.'
  ],
  causation_flags: [
    'Elevated liver enzymes consistent with oral anabolic compound use.',
    'HDL suppression pattern consistent with anabolic steroid use.',
    'LH/FSH suppression expected with exogenous androgen administration.'
  ]
};

function stripMarkdownJSON(text: string): string {
  return text.replace(/```json|```/gi, '').trim();
}

function calculateBMI(weight: number, height: number): number {
  if (!weight || !height) return 0;
  const hM = height / 100;
  return Number((weight / (hM * hM)).toFixed(1));
}

export async function getInsights(
  patient: AnyPatientInput,
  scores: AnyRiskScores
): Promise<{
  insights: string[]
  recommendations: string[]
  causation_flags?: string[]
}> {
  try {
    let prompt = '';

    if (patient.mode === 'patient') {
      const p = patient as PatientInput;
      const s = scores as PatientRiskScores;
      const bmi = calculateBMI(p.weight, p.height);
      const overall = scores.overall_risk;
      
      prompt = `You are a clinical AI assistant analyzing a patient health profile.
Patient: ${p.age}yr ${p.gender}, BMI: ${bmi}
Vitals: BP ${p.systolic_bp || 0}/${p.diastolic_bp || 0}, Glucose ${p.glucose || 0} mg/dL,
Total Cholesterol ${p.cholesterol_total || 0} mg/dL, HDL ${p.cholesterol_hdl || 0} mg/dL
Lifestyle: Smoking=${p.smoking}, Exercise=${p.exercise}, Alcohol=${p.alcohol}
Risk Scores with confidence:
- Diabetes: ${s.diabetes.score} (${s.diabetes.confidence_interval[0]}–${s.diabetes.confidence_interval[1]}, ${s.diabetes.confidence})
  Drivers: ${s.diabetes.primary_drivers.join(', ')}
- Cardiac: ${s.cardiac.score} (${s.cardiac.confidence_interval[0]}–${s.cardiac.confidence_interval[1]}, ${s.cardiac.confidence})
  Drivers: ${s.cardiac.primary_drivers.join(', ')}
- Hypertension: ${s.hypertension.score} (${s.hypertension.confidence_interval[0]}–${s.hypertension.confidence_interval[1]}, ${s.hypertension.confidence})
  Drivers: ${s.hypertension.primary_drivers.join(', ')}
Overall risk: ${overall}
Return ONLY valid JSON, no markdown, no backticks:
{"insights":[3-5 specific clinical observations],
"recommendations":[3-5 actionable items ranked by impact]}`;

    } else {
      const a = patient as AthleteInput;
      const s = scores as AthleteRiskScores;
      const overall = scores.overall_risk;
      
      const compoundsStr = (a.compounds || []).map(c => 
        `- ${c.name}: ${c.dose_mg}mg ${c.frequency} (${c.route}),
   week ${c.cycle_week_current} of ${c.cycle_week_total}${c.is_pct ? ' [PCT]' : ''}`
      ).join('\n');

      prompt = `You are a sports medicine AI assistant specializing in
performance-enhancing compound analysis and harm reduction.
Athlete: ${a.age}yr ${a.gender}, ${a.weight}kg, ${a.body_fat_percent || 0}% BF
Bloodwork: Hematocrit ${a.hematocrit || 0}%, ALT ${a.alt || 0} U/L, AST ${a.ast || 0} U/L,
HDL ${a.cholesterol_hdl || 0} mg/dL, Total Cholesterol ${a.cholesterol_total || 0} mg/dL,
LH ${a.lh || 0} IU/L, FSH ${a.fsh || 0} IU/L, Estradiol ${a.estradiol || 0} pg/mL,
Testosterone Total ${a.testosterone_total || 0} ng/dL
Current compounds:
${compoundsStr}
Risk Scores: 
- Cardiovascular: ${s.cardiovascular.score} (${s.cardiovascular.confidence_interval[0]}–${s.cardiovascular.confidence_interval[1]}, ${s.cardiovascular.confidence})
  Drivers: ${s.cardiovascular.primary_drivers.join(', ')}
- Hepatotoxicity: ${s.hepatotoxicity.score} (${s.hepatotoxicity.confidence_interval[0]}–${s.hepatotoxicity.confidence_interval[1]}, ${s.hepatotoxicity.confidence})
  Drivers: ${s.hepatotoxicity.primary_drivers.join(', ')}
- Endocrine Suppression: ${s.endocrine_suppression.score} (${s.endocrine_suppression.confidence_interval[0]}–${s.endocrine_suppression.confidence_interval[1]}, ${s.endocrine_suppression.confidence})
  Drivers: ${s.endocrine_suppression.primary_drivers.join(', ')}
- Hematological: ${s.hematological.score} (${s.hematological.confidence_interval[0]}–${s.hematological.confidence_interval[1]}, ${s.hematological.confidence})
  Drivers: ${s.hematological.primary_drivers.join(', ')}
Overall risk: ${overall}
Do not moralize about compound use. Focus on harm reduction,
biomarker interpretation, and clinical observations.
Return ONLY valid JSON, no markdown, no backticks:
{"insights":[3-5 biomarker observations],
"recommendations":[3-5 harm reduction actions],
"causation_flags":[2-4 specific compound-to-biomarker causal observations]}`;
    }

    const message = await anthropic.messages.create({
      model: MODEL_NAME,
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }]
    });

    // @ts-ignore (handling API response shape safely)
    const textContent = message.content[0]?.text || '';
    const cleanJSON = stripMarkdownJSON(textContent);
    return JSON.parse(cleanJSON);

  } catch (error) {
    console.error('Claude API Error (Insights):', error);
    return patient.mode === 'athlete' ? FALLBACK_ATHLETE_INSIGHTS : FALLBACK_PATIENT_INSIGHTS;
  }
}


export async function getSimulationNarrative(
  scenario: string,
  delta: Record<string, number>,
  timeframe: string
): Promise<string> {
  try {
    const deltaStr = Object.entries(delta)
      .map(([k, v]) => `${k}: ${v > 0 ? '+' : ''}${v} points`)
      .join(', ');

    const prompt = `In one concise paragraph, explain what the ${scenario} intervention
means for this patient's health outcomes. The risk changes are:
${deltaStr}
Timeframe: ${timeframe}
Be specific about which changes matter most. Do not use bullet points.`;

    const message = await anthropic.messages.create({
      model: MODEL_NAME,
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }]
    });

    // @ts-ignore
    return (message.content[0]?.text || '').trim();
  } catch (error) {
    console.error('Claude API Error (Simulation):', error);
    return `The ${scenario} intervention is projected to result in the following changes over ${timeframe}: ${Object.entries(delta).map(([k, v]) => `${k} changes by ${v > 0 ? '+' : ''}${v} points`).join(', ')}.`;
  }
}


export async function chatWithTwin(
  patient: AnyPatientInput,
  analysis: AnalyzeResponse,
  history: ChatMessage[],
  message: string
): Promise<string> {
  try {
    const overallRisk = analysis.risk_scores.overall_risk;
    const topInsights = (analysis.insights || []).slice(0, 2).join(' ');

    let systemPrompt = '';
    if (patient.mode === 'patient') {
      systemPrompt = `You are a compassionate AI health assistant for ${patient.name}'s
digital health twin. Overall risk: ${overallRisk}.
Key findings: ${topInsights}
Never diagnose. Never prescribe. Be concise. Maximum 3 sentences.`;
    } else {
      systemPrompt = `You are a sports medicine AI assistant for ${patient.name}'s
health monitoring. Overall risk: ${overallRisk}.
Key findings: ${topInsights}
Never moralize about compound use. Focus on harm reduction.
Never prescribe. Be concise. Maximum 3 sentences.`;
    }

    const messages = history.map(msg => ({
      role: (msg.role === 'assistant' ? 'assistant' : 'user') as 'assistant' | 'user',
      content: msg.content
    }));
    messages.push({ role: 'user', content: message });

    const response = await anthropic.messages.create({
      model: MODEL_NAME,
      max_tokens: 400,
      system: systemPrompt,
      messages: messages
    });

    // @ts-ignore
    return (response.content[0]?.text || '').trim();
  } catch (error) {
    console.error('Claude API Error (Chat):', error);
    return "I'm having trouble connecting to my analysis core right now. Please consult with your physician regarding your data.";
  }
}
