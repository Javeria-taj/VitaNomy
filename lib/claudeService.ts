import { GoogleGenerativeAI } from '@google/generative-ai';
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

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || ''
);

const MODEL_NAME = 'gemini-3-pro-preview';

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

function getReferenceFlag(value: number, low: number, high: number): string {
  if (value < low) return '⚠ LOW'
  if (value > high) return '⚠ HIGH'
  return '✓ NORMAL'
}

function formatCycleStatus(currentWeek: number, totalWeeks: number): string {
  if (currentWeek > totalWeeks) return '⚠ EXCEEDED PLANNED DURATION'
  if (currentWeek / totalWeeks >= 0.8) return '⚠ NEAR END OF CYCLE'
  return `Week ${currentWeek}/${totalWeeks}`
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sp = s as any;
      const bmi = calculateBMI(p.weight, p.height);
      const overall = scores.overall_risk;

      prompt = `CLINICAL CASE SUMMARY
━━━━━━━━━━━━━━━━━━━━
Patient: ${p.age}yr ${p.gender}, BMI: ${bmi} ${getReferenceFlag(bmi, 18.5, 24.9)}
Presentation: Metabolic and cardiovascular risk assessment

LABORATORY FINDINGS
━━━━━━━━━━━━━━━━━━━━
Metabolic Panel:
  Fasting Glucose:      ${p.glucose ?? 'N/A'} mg/dL      [Ref: 70–99]   ${p.glucose ? getReferenceFlag(p.glucose, 70, 99) : ''}
  Total Cholesterol:    ${p.cholesterol_total ?? 'N/A'} mg/dL   [Ref: <200]    ${p.cholesterol_total ? getReferenceFlag(p.cholesterol_total, 0, 199) : ''}
  HDL Cholesterol:      ${p.cholesterol_hdl ?? 'N/A'} mg/dL      [Ref: >60]     ${p.cholesterol_hdl ? getReferenceFlag(p.cholesterol_hdl, 60, 999) : ''}
  LDL Cholesterol:      ${p.cholesterol_ldl ?? 'N/A'} mg/dL      [Ref: <100]    ${p.cholesterol_ldl ? getReferenceFlag(p.cholesterol_ldl, 0, 99) : ''}
  Triglycerides:        ${p.triglycerides ?? 'N/A'} mg/dL      [Ref: <150]    ${p.triglycerides ? getReferenceFlag(p.triglycerides, 0, 149) : ''}

Cardiovascular:
  Blood Pressure:       ${p.systolic_bp ?? 'N/A'}/${p.diastolic_bp ?? 'N/A'} mmHg   [Ref: <120/80]  ${p.systolic_bp ? getReferenceFlag(p.systolic_bp, 0, 119) : ''}
  BMI:                  ${bmi} kg/m²          [Ref: 18.5–24.9]

Lifestyle Factors:
  Smoking:              ${p.smoking ? '⚠ YES — active smoker' : '✓ Non-smoker'}
  Exercise:             ${p.exercise} ${p.exercise === 'none' ? '⚠ SEDENTARY' : ''}
  Alcohol:              ${p.alcohol} ${p.alcohol === 'heavy' ? '⚠ HEAVY USE' : ''}
  Family History:       ${p.family_history ? '⚠ POSITIVE' : '✓ Negative'}

Existing Conditions:    ${p.existing_conditions?.length ? p.existing_conditions.join(', ') : 'None reported'}
Current Medications:    ${p.current_medications?.length ? p.current_medications.join(', ') : 'None reported'}

RISK STRATIFICATION
━━━━━━━━━━━━━━━━━━━━
Diabetes:       ${sp.diabetes.score}/100  CI: [${sp.diabetes.confidence_interval[0]}–${sp.diabetes.confidence_interval[1]}]  Confidence: ${sp.diabetes.confidence}
  Drivers: ${sp.diabetes.primary_drivers.join(' | ')}

Cardiac:        ${sp.cardiac.score}/100  CI: [${sp.cardiac.confidence_interval[0]}–${sp.cardiac.confidence_interval[1]}]  Confidence: ${sp.cardiac.confidence}
  Drivers: ${sp.cardiac.primary_drivers.join(' | ')}

Hypertension:   ${sp.hypertension.score}/100  CI: [${sp.hypertension.confidence_interval[0]}–${sp.hypertension.confidence_interval[1]}]  Confidence: ${sp.hypertension.confidence}
  Drivers: ${sp.hypertension.primary_drivers.join(' | ')}

Overall Risk:   ${overall}

CLINICAL TASK
━━━━━━━━━━━━━━━━━━━━
Analyze the interaction between risk factors — not just individual values.
Identify which findings are urgent vs long-term concerns.
Provide specific, measurable interventions ranked by impact.

You are a clinical AI. Never diagnose. Never prescribe medications.
Return ONLY valid JSON, no markdown, no backticks:
{"insights":["3-5 specific clinical observations referencing actual values"],
"recommendations":["3-5 actionable items, specific and measurable"]}`;

    } else {
      const a = patient as AthleteInput;
      const s = scores as AthleteRiskScores;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sa = s as any;
      const overall = scores.overall_risk;

      const compoundsStr = (a.compounds || []).map(c =>
        `  ${c.name} (${c.compound_type})
    Dose:         ${c.dose_mg}mg ${c.frequency} via ${c.route}
    Cycle status: ${formatCycleStatus(c.cycle_week_current, c.cycle_week_total)}
    PCT compound: ${c.is_pct ? 'Yes' : 'No'}`
      ).join('\n\n')

      prompt = `ATHLETE HEALTH MONITORING REPORT
━━━━━━━━━━━━━━━━━━━━
Athlete: ${a.age}yr ${a.gender}, ${a.weight}kg${a.body_fat_percent ? `, ${a.body_fat_percent}% BF` : ''}
Context: ${a.competition_prep ? '⚠ COMPETITION PREP ACTIVE' : 'Off-season'}
PCT Active: ${a.pct_active ? '✓ YES' : '⚠ NO'}
Training Experience: ${a.training_years} years

BLOODWORK PANEL
━━━━━━━━━━━━━━━━━━━━
Liver Enzymes:
  ALT:                  ${a.alt ?? 'N/A'} U/L          [Ref: <40]     ${a.alt ? getReferenceFlag(a.alt, 0, 40) : ''}
  AST:                  ${a.ast ?? 'N/A'} U/L          [Ref: <40]     ${a.ast ? getReferenceFlag(a.ast, 0, 40) : ''}

Hematological:
  Hematocrit:           ${a.hematocrit ?? 'N/A'}%           [Ref: 38–50]   ${a.hematocrit ? getReferenceFlag(a.hematocrit, 38, 50) : ''}
  Hemoglobin:           ${a.hemoglobin ?? 'N/A'} g/dL        [Ref: 13.5–17.5] ${a.hemoglobin ? getReferenceFlag(a.hemoglobin, 13.5, 17.5) : ''}
  RBC:                  ${a.rbc ?? 'N/A'} M/uL         [Ref: 4.5–6.0] ${a.rbc ? getReferenceFlag(a.rbc, 4.5, 6.0) : ''}

Lipids:
  HDL:                  ${a.cholesterol_hdl ?? 'N/A'} mg/dL       [Ref: >40]     ${a.cholesterol_hdl ? getReferenceFlag(a.cholesterol_hdl, 40, 999) : ''}
  Total Cholesterol:    ${a.cholesterol_total ?? 'N/A'} mg/dL       [Ref: <200]    ${a.cholesterol_total ? getReferenceFlag(a.cholesterol_total, 0, 199) : ''}
  LDL:                  ${a.cholesterol_ldl ?? 'N/A'} mg/dL       [Ref: <100]    ${a.cholesterol_ldl ? getReferenceFlag(a.cholesterol_ldl, 0, 99) : ''}
  Triglycerides:        ${a.triglycerides ?? 'N/A'} mg/dL       [Ref: <150]    ${a.triglycerides ? getReferenceFlag(a.triglycerides, 0, 149) : ''}

Endocrine Panel:
  Testosterone Total:   ${a.testosterone_total ?? 'N/A'} ng/dL      [Ref: 300–1000] ${a.testosterone_total ? getReferenceFlag(a.testosterone_total, 300, 1000) : ''}
  Testosterone Free:    ${a.testosterone_free ?? 'N/A'} pg/mL       [Ref: 9–30]    ${a.testosterone_free ? getReferenceFlag(a.testosterone_free, 9, 30) : ''}
  Estradiol:            ${a.estradiol ?? 'N/A'} pg/mL       [Ref: 10–40]   ${a.estradiol ? getReferenceFlag(a.estradiol, 10, 40) : ''}
  LH:                   ${a.lh ?? 'N/A'} IU/L         [Ref: 1.5–9.3] ${a.lh ? getReferenceFlag(a.lh, 1.5, 9.3) : ''}
  FSH:                  ${a.fsh ?? 'N/A'} IU/L         [Ref: 1.5–12.4] ${a.fsh ? getReferenceFlag(a.fsh, 1.5, 12.4) : ''}

Kidney:
  Creatinine:           ${a.creatinine ?? 'N/A'} mg/dL       [Ref: 0.7–1.2] ${a.creatinine ? getReferenceFlag(a.creatinine, 0.7, 1.2) : ''}

CURRENT COMPOUNDS
━━━━━━━━━━━━━━━━━━━━
${compoundsStr || 'None reported'}

RISK STRATIFICATION
━━━━━━━━━━━━━━━━━━━━
Cardiovascular:         ${sa.cardiovascular.score}/100  CI: [${sa.cardiovascular.confidence_interval[0]}–${sa.cardiovascular.confidence_interval[1]}]  Confidence: ${sa.cardiovascular.confidence}
  Drivers: ${sa.cardiovascular.primary_drivers.join(' | ')}

Hepatotoxicity:         ${sa.hepatotoxicity.score}/100  CI: [${sa.hepatotoxicity.confidence_interval[0]}–${sa.hepatotoxicity.confidence_interval[1]}]  Confidence: ${sa.hepatotoxicity.confidence}
  Drivers: ${sa.hepatotoxicity.primary_drivers.join(' | ')}

Endocrine Suppression:  ${sa.endocrine_suppression.score}/100  CI: [${sa.endocrine_suppression.confidence_interval[0]}–${sa.endocrine_suppression.confidence_interval[1]}]  Confidence: ${sa.endocrine_suppression.confidence}
  Drivers: ${sa.endocrine_suppression.primary_drivers.join(' | ')}

Hematological:          ${sa.hematological.score}/100  CI: [${sa.hematological.confidence_interval[0]}–${sa.hematological.confidence_interval[1]}]  Confidence: ${sa.hematological.confidence}
  Drivers: ${sa.hematological.primary_drivers.join(' | ')}

Overall Risk:           ${overall}

CLINICAL TASK
━━━━━━━━━━━━━━━━━━━━
Interpret biomarker deviations in the context of the specific compounds listed.
Identify causal links between compounds and abnormal values.
Do not moralize about compound use — focus entirely on harm reduction.
Never prescribe. Never diagnose.

Return ONLY valid JSON, no markdown, no backticks:
{"insights":["3-5 specific biomarker observations referencing actual values and compounds"],
"recommendations":["3-5 harm reduction actions, specific and actionable"],
"causation_flags":["2-4 specific compound-to-biomarker causal observations with values"]}`;
    }

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(prompt);
    const textContent = result.response.text() || '';
    const cleanJSON = stripMarkdownJSON(textContent);
    return JSON.parse(cleanJSON);

  } catch (error: any) {
    console.error('Gemini API Error (Insights):', error);
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

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(prompt);
    return (result.response.text() || '').trim();
  } catch (error: any) {
    console.error('Gemini API Error (Simulation):', error);
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
      systemPrompt = `You are Dr. Vita, a world-class clinical AI assistant for ${patient.name}'s digital health twin. 
Overall Risk Status: ${overallRisk}.
Current Clinical Insights: ${topInsights}
Your Goal: Provide precise, proactive, and compassionate guidance to optimize the patient's digital twin.
Guidelines:
1. Reference specific biometrics (Glucose, BP, BMI) when explaining risks.
2. If risk is high, suggest specific lifestyle modifications (exercise, sodium reduction, sleep) without prescribing medication.
3. Be concise (max 3-4 sentences). Use a professional yet accessible clinical tone.
4. Never diagnose or prescribe. Always include a disclaimer if the query is high-risk.`;
    } else {
      systemPrompt = `You are the Performance Health AI for ${patient.name}'s athletic digital twin.
Overall Risk Status: ${overallRisk}.
Current Performance Insights: ${topInsights}
Your Goal: Provide high-level harm reduction and performance optimization guidance.
Guidelines:
1. Focus on biomarker stabilization (Liver enzymes, Hematocrit, Lipid profiles).
2. Never moralize about compound use; focus entirely on clinical safety and harm reduction.
3. Reference the specific compounds the athlete is using if relevant to their query.
4. Be concise (max 3-4 sentences). Use a technical, high-performance clinical tone.
5. Never prescribe. Always emphasize regular bloodwork monitoring.`;
    }

    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: systemPrompt
    });

    const chat = model.startChat({
      history: history.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }))
    });

    const result = await chat.sendMessage(message);
    return result.response.text().trim();
  } catch (error: any) {
    console.error('Gemini API Error (Chat):', error);
    return "I'm having trouble connecting to my analysis core right now. Please consult with your physician regarding your data.";
  }
}
