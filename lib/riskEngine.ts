import { 
  AnyPatientInput, AnyRiskScores, PatientRiskScores, AthleteRiskScores, RiskFactor, PatientInput, AthleteInput 
} from '@/types/patient'

// ─── HELPERS (not exported) ──────────────────────────────────────────────────

function calcBMI(weight: number, height: number): number {
  if (!weight || !height) return 0;
  const hM = height / 100;
  return weight / (hM * hM);
}

function getConfidence(presentCount: number): 'low'|'medium'|'high' {
  if (presentCount <= 2) return 'low';
  if (presentCount >= 6) return 'high';
  return 'medium';
}

function getConfidenceInterval(score: number, confidence: string): [number, number] {
  let margin = 10;
  if (confidence === 'low') margin = 18;
  else if (confidence === 'high') margin = 5;
  return [Math.max(0, score - margin), Math.min(95, score + margin)];
}

function getTopDrivers(drivers: {label: string, points: number}[]): string[] {
  return drivers.sort((a, b) => b.points - a.points).slice(0, 2).map(d => d.label);
}

// ─── CORE EXPORTS ────────────────────────────────────────────────────────────

export function calculateRisks(patient: AnyPatientInput): AnyRiskScores {
  if (patient.mode === 'patient') {
    return calculatePatientRisks(patient as PatientInput);
  } else {
    return calculateAthleteRisks(patient as AthleteInput);
  }
}

function extractScore(val: any): number {
  if (typeof val === 'number') return val;
  if (val && typeof val === 'object' && typeof val.score === 'number') return val.score;
  return 0;
}

export function getOverallRisk(scores: AnyRiskScores): 'LOW'|'MEDIUM'|'HIGH'|'CRITICAL' {
  let maxScore = 0;
  if (scores.mode === 'patient') {
    const s = scores as PatientRiskScores;
    maxScore = Math.max(extractScore(s.diabetes), extractScore(s.cardiac), extractScore(s.hypertension));
  } else {
    const s = scores as AthleteRiskScores;
    maxScore = Math.max(extractScore(s.cardiovascular), extractScore(s.hepatotoxicity), extractScore(s.endocrine_suppression), extractScore(s.hematological));
  }

  if (maxScore >= 75) return 'CRITICAL';
  if (maxScore >= 55) return 'HIGH';
  if (maxScore >= 35) return 'MEDIUM';
  return 'LOW';
}

// ─── PATIENT MODE LOGIC ──────────────────────────────────────────────────────

function calculatePatientRisks(p: PatientInput): PatientRiskScores {
  // Normalize optionals
  const glucose = p.glucose ?? 0;
  const bmi = calcBMI(p.weight ?? 0, p.height ?? 0);
  const age = p.age ?? 0;
  const family_history = p.family_history ?? false;
  const exercise = p.exercise ?? 'none';
  const smoking = p.smoking ?? false;
  const alcohol = p.alcohol ?? 'none';
  const cholesterol = p.cholesterol_total ?? 0;
  const hdl = p.cholesterol_hdl ?? 0;
  const systolic = p.systolic_bp ?? 0;
  const diastolic = p.diastolic_bp ?? 0;
  const stress = p.stress_level ?? 5;
  const conditions = p.existing_conditions || [];

  // Present counters
  const dPres = [glucose, bmi, age, family_history, exercise, smoking, alcohol].filter(x => x !== 0 && x !== false && x !== 'none').length;
  const cPres = [cholesterol, hdl, systolic, smoking, exercise, age, family_history, conditions.length].filter(x => x !== 0 && x !== false && x !== 'none').length;
  const hPres = [systolic, diastolic, bmi, age, smoking, alcohol, exercise, conditions.length].filter(x => x !== 0 && x !== false && x !== 'none').length;

  // DIABETES
  let diaScore = 0;
  let diaDrivers: {label: string, points: number}[] = [];
  
  if (glucose >= 126) { diaScore += 40; diaDrivers.push({label: 'Fasting glucose >= 126 mg/dL — diabetic range', points: 40}); }
  else if (glucose >= 100) { diaScore += 20; diaDrivers.push({label: 'Fasting glucose >= 100 mg/dL — prediabetic range', points: 20}); }
  
  if (bmi >= 35) { diaScore += 25; diaDrivers.push({label: 'BMI >= 35 — Obesity Class II+', points: 25}); }
  else if (bmi >= 30) { diaScore += 18; diaDrivers.push({label: 'BMI >= 30 — Obesity Class I', points: 18}); }
  else if (bmi >= 25) { diaScore += 10; diaDrivers.push({label: 'BMI >= 25 — Overweight', points: 10}); }

  if (age >= 60) { diaScore += 12; diaDrivers.push({label: 'Age >= 60', points: 12}); }
  else if (age >= 45) { diaScore += 8; diaDrivers.push({label: 'Age >= 45', points: 8}); }
  else if (age >= 35) { diaScore += 4; diaDrivers.push({label: 'Age >= 35', points: 4}); }

  if (family_history) { diaScore += 20; diaDrivers.push({label: 'Family history of related conditions', points: 20}); }
  
  if (exercise === 'none') { diaScore += 15; diaDrivers.push({label: 'Sedentary lifestyle (no exercise)', points: 15}); }
  else if (exercise === 'light') { diaScore += 8; diaDrivers.push({label: 'Light exercise only', points: 8}); }
  else if (exercise === 'heavy') { diaScore -= 5; diaDrivers.push({label: 'Heavy exercise (protective)', points: -5}); }

  if (smoking) { diaScore += 8; diaDrivers.push({label: 'Active smoking', points: 8}); }
  if (alcohol === 'heavy') { diaScore += 8; diaDrivers.push({label: 'Heavy alcohol consumption', points: 8}); }
  else if (alcohol === 'moderate') { diaScore += 3; diaDrivers.push({label: 'Moderate alcohol consumption', points: 3}); }

  if (stress > 7) { diaScore += 8; diaDrivers.push({label: 'High psychological stress level', points: 8}); }

  // Interactions
  if (smoking && exercise === 'none') { diaScore += 10; diaDrivers.push({label: 'Smoking + zero exercise compounding risk', points: 10}); }
  if (bmi >= 30 && family_history) { diaScore += 10; diaDrivers.push({label: 'Obesity + family history compounding risk', points: 10}); }
  if (glucose >= 100 && bmi >= 25) { diaScore += 8; diaDrivers.push({label: 'Elevated glucose + overweight compounding risk', points: 8}); }


  // CARDIAC
  let carScore = 0;
  let carDrivers: {label: string, points: number}[] = [];
  
  if (cholesterol >= 240) { carScore += 28; carDrivers.push({label: 'Total cholesterol >= 240 mg/dL', points: 28}); }
  else if (cholesterol >= 200) { carScore += 14; carDrivers.push({label: 'Total cholesterol >= 200 mg/dL', points: 14}); }

  if (hdl > 0 && hdl < 40) { carScore += 20; carDrivers.push({label: 'HDL < 40 mg/dL — protective factor absent', points: 20}); }
  else if (hdl >= 40 && hdl <= 60) { carScore += 8; carDrivers.push({label: 'HDL 40-60 mg/dL — sub-optimal', points: 8}); }
  else if (hdl > 60) { carScore -= 8; carDrivers.push({label: 'HDL > 60 mg/dL — protective', points: -8}); }

  if (systolic >= 160) { carScore += 30; carDrivers.push({label: 'Systolic BP >= 160 mmHg — Stage 2 Hypertension', points: 30}); }
  else if (systolic >= 140) { carScore += 22; carDrivers.push({label: 'Systolic BP >= 140 mmHg — Stage 2 Hypertension', points: 22}); }
  else if (systolic >= 130) { carScore += 12; carDrivers.push({label: 'Systolic BP >= 130 mmHg — Stage 1 Hypertension', points: 12}); }

  if (smoking) { carScore += 25; carDrivers.push({label: 'Active smoking', points: 25}); }
  
  if (exercise === 'none') { carScore += 15; carDrivers.push({label: 'Sedentary lifestyle', points: 15}); }
  else if (exercise === 'light') { carScore += 8; carDrivers.push({label: 'Light exercise only', points: 8}); }

  if (age >= 65) { carScore += 15; carDrivers.push({label: 'Age >= 65', points: 15}); }
  else if (age >= 55) { carScore += 10; carDrivers.push({label: 'Age >= 55', points: 10}); }
  else if (age >= 45) { carScore += 6; carDrivers.push({label: 'Age >= 45', points: 6}); }

  if (family_history) { carScore += 15; carDrivers.push({label: 'Family history', points: 15}); }
  if (conditions.includes('type2_diabetes') || conditions.includes('diabetes') || conditions.includes('prediabetes')) { 
    carScore += 12; carDrivers.push({label: 'Existing diabetes/prediabetes', points: 12}); 
  }

  if (stress > 7) { carScore += 10; carDrivers.push({label: 'Chronic high stress impacting cardiac load', points: 10}); }

  // Interactions
  if (smoking && cholesterol >= 240) { carScore += 15; carDrivers.push({label: 'Smoking + high cholesterol compounding risk', points: 15}); }
  if (systolic >= 140 && (conditions.includes('type2_diabetes') || conditions.includes('diabetes'))) { 
    carScore += 12; carDrivers.push({label: 'Hypertension + diabetes compounding risk', points: 12}); 
  }

  // HYPERTENSION
  let hypScore = 0;
  let hypDrivers: {label: string, points: number}[] = [];
  
  if (systolic >= 180) { hypScore += 45; hypDrivers.push({label: 'Systolic >= 180 mmHg — Crisis', points: 45}); }
  else if (systolic >= 160) { hypScore += 38; hypDrivers.push({label: 'Systolic >= 160 mmHg — Stage 2', points: 38}); }
  else if (systolic >= 140) { hypScore += 30; hypDrivers.push({label: 'Systolic >= 140 mmHg — Stage 2', points: 30}); }
  else if (systolic >= 130) { hypScore += 18; hypDrivers.push({label: 'Systolic >= 130 mmHg — Stage 1', points: 18}); }

  if (diastolic >= 120) { hypScore += 25; hypDrivers.push({label: 'Diastolic >= 120 mmHg — Crisis', points: 25}); }
  else if (diastolic >= 100) { hypScore += 18; hypDrivers.push({label: 'Diastolic >= 100 mmHg — Stage 2', points: 18}); }
  else if (diastolic >= 90) { hypScore += 12; hypDrivers.push({label: 'Diastolic >= 90 mmHg — Stage 2', points: 12}); }

  if (bmi >= 35) { hypScore += 18; hypDrivers.push({label: 'BMI >= 35', points: 18}); }
  else if (bmi >= 30) { hypScore += 12; hypDrivers.push({label: 'BMI >= 30', points: 12}); }
  else if (bmi >= 25) { hypScore += 6; hypDrivers.push({label: 'BMI >= 25', points: 6}); }

  if (age >= 65) { hypScore += 12; hypDrivers.push({label: 'Age >= 65', points: 12}); }
  else if (age >= 50) { hypScore += 8; hypDrivers.push({label: 'Age >= 50', points: 8}); }

  if (smoking) { hypScore += 10; hypDrivers.push({label: 'Active smoking', points: 10}); }
  if (alcohol === 'heavy') { hypScore += 12; hypDrivers.push({label: 'Heavy alcohol usage', points: 12}); }
  else if (alcohol === 'moderate') { hypScore += 5; hypDrivers.push({label: 'Moderate alcohol usage', points: 5}); }

  if (exercise === 'none') { hypScore += 8; hypDrivers.push({label: 'Sedentary', points: 8}); }
  
  if (conditions.includes('type2_diabetes') || conditions.includes('diabetes')) { hypScore += 10; hypDrivers.push({label: 'Existing diabetes', points: 10}); }
  if (conditions.includes('kidney_disease')) { hypScore += 15; hypDrivers.push({label: 'Existing kidney disease', points: 15}); }

  if (smoking && bmi >= 30) { hypScore += 8; hypDrivers.push({label: 'Smoking + obesity', points: 8}); }
  if (alcohol === 'heavy' && age >= 50) { hypScore += 10; hypDrivers.push({label: 'Heavy alcohol at age 50+', points: 10}); }
  if (systolic >= 140 && diastolic >= 90) { hypScore += 8; hypDrivers.push({label: 'Combined systolic/diastolic hypertension', points: 8}); }

  // Wrapping up formatting
  diaScore = Math.min(diaScore, 95);
  carScore = Math.min(carScore, 95);
  hypScore = Math.min(hypScore, 95);
  
  const dConf = getConfidence(dPres);
  const cConf = getConfidence(cPres);
  const hConf = getConfidence(hPres);

  const riskScores: PatientRiskScores = {
    mode: 'patient',
    diabetes: { score: diaScore, confidence: dConf, confidence_interval: getConfidenceInterval(diaScore, dConf), primary_drivers: getTopDrivers(diaDrivers) },
    cardiac: { score: carScore, confidence: cConf, confidence_interval: getConfidenceInterval(carScore, cConf), primary_drivers: getTopDrivers(carDrivers) },
    hypertension: { score: hypScore, confidence: hConf, confidence_interval: getConfidenceInterval(hypScore, hConf), primary_drivers: getTopDrivers(hypDrivers) },
    overall_risk: 'LOW' // temporary, will be assigned via getOverallRisk
  };

  riskScores.overall_risk = getOverallRisk(riskScores);
  return riskScores;
}

// ─── ATHLETE MODE LOGIC ──────────────────────────────────────────────────────

function calculateAthleteRisks(a: AthleteInput): AthleteRiskScores {
  const hematocrit = a.hematocrit ?? 0;
  const hdl = a.cholesterol_hdl ?? 0;
  const cholesterol = a.cholesterol_total ?? 0;
  const ldl = a.cholesterol_ldl ?? 0;
  const systolic = a.systolic_bp ?? 0;
  
  const alt = a.alt ?? 0;
  const ast = a.ast ?? 0;
  
  const lh = a.lh ?? 0;
  const fsh = a.fsh ?? 0;
  const testT = a.testosterone_total ?? 0;
  const testF = a.testosterone_free ?? 0;
  const e2 = a.estradiol ?? 0;
  const pctActive = a.pct_active ?? false;
  
  const hemoglobin = a.hemoglobin ?? 0;
  const rbc = a.rbc ?? 0;

  // Derive compound metrics
  const c = a.compounds || [];
  const orals = c.filter(x => x.route === 'oral' && !x.is_pct).length;
  // all compounds have cycle_week_current/total. Avg cycle ratio = sum(current/total) / count if needed, or max. 
  // Let's use the max ratio for worst-case organ stress.
  let cycleRatio = 0;
  if (c.length > 0) cycleRatio = Math.max(...c.map(x => x.cycle_week_total > 0 ? (x.cycle_week_current / x.cycle_week_total) : 0));
  
  const hepatotoxic_orals = c.filter(x => x.route === 'oral' && !x.is_pct && x.compound_type !== 'supplement').length;
  const on_cycle = c.filter(x => !x.is_pct).length;
  const inj_non_pct = c.filter(x => x.route === 'injectable' && !x.is_pct).length;

  const cvPres = [hematocrit, hdl, cholesterol, ldl, systolic, c.length].filter(x => x !== 0).length;
  const hpPres = [alt, ast, c.length].filter(x => x !== 0).length;
  const edPres = [lh, fsh, testT, testF, e2, c.length].filter(x => x !== 0).length;
  const hmPres = [hematocrit, hemoglobin, rbc, c.length].filter(x => x !== 0).length;

  // CARDIOVASCULAR
  let cvScore = 0;
  let cvDrivers: {label: string, points: number}[] = [];

  if (hematocrit >= 54) { cvScore += 45; cvDrivers.push({label: 'Hematocrit >= 54%', points: 45}); }
  else if (hematocrit >= 50) { cvScore += 28; cvDrivers.push({label: 'Hematocrit >= 50%', points: 28}); }
  else if (hematocrit >= 48) { cvScore += 15; cvDrivers.push({label: 'Hematocrit >= 48%', points: 15}); }

  if (hdl > 0 && hdl < 25) { cvScore += 35; cvDrivers.push({label: 'HDL < 25 mg/dL — SEVERE suppression', points: 35}); }
  else if (hdl > 0 && hdl < 35) { cvScore += 22; cvDrivers.push({label: 'HDL < 35 mg/dL', points: 22}); }
  else if (hdl > 0 && hdl < 40) { cvScore += 12; cvDrivers.push({label: 'HDL < 40 mg/dL', points: 12}); }

  if (cholesterol >= 260) { cvScore += 20; cvDrivers.push({label: 'Total Cholesterol >= 260 mg/dL', points: 20}); }

  if (ldl >= 160) { cvScore += 20; cvDrivers.push({label: 'LDL >= 160 mg/dL', points: 20}); }
  else if (ldl >= 130) { cvScore += 10; cvDrivers.push({label: 'LDL >= 130 mg/dL', points: 10}); }

  if (systolic >= 150) { cvScore += 25; cvDrivers.push({label: 'Systolic >= 150 mmHg', points: 25}); }
  else if (systolic >= 140) { cvScore += 18; cvDrivers.push({label: 'Systolic >= 140 mmHg', points: 18}); }
  else if (systolic >= 130) { cvScore += 10; cvDrivers.push({label: 'Systolic >= 130 mmHg', points: 10}); }

  if (orals >= 2) { cvScore += 20; cvDrivers.push({label: 'Multiple oral compounds', points: 20}); }
  else if (orals === 1) { cvScore += 10; cvDrivers.push({label: 'Active oral compound', points: 10}); }

  if (cycleRatio >= 0.8) { cvScore += 10; cvDrivers.push({label: 'Late cycle cardiovascular stress', points: 10}); }

  if (hematocrit >= 50 && orals >= 1) { cvScore += 15; cvDrivers.push({label: 'Polyglobulia + Oral load', points: 15}); }
  if (hdl > 0 && hdl < 35 && cholesterol >= 240) { cvScore += 18; cvDrivers.push({label: 'Extreme lipid derangement', points: 18}); }

  // HEPATOTOXICITY
  let hpScore = 0;
  let hpDrivers: {label: string, points: number}[] = [];

  if (alt >= 120) { hpScore += 45; hpDrivers.push({label: 'ALT >= 120 U/L', points: 45}); }
  else if (alt >= 80) { hpScore += 30; hpDrivers.push({label: 'ALT >= 80 U/L', points: 30}); }
  else if (alt >= 56) { hpScore += 18; hpDrivers.push({label: 'ALT >= 56 U/L', points: 18}); }

  if (ast >= 120) { hpScore += 35; hpDrivers.push({label: 'AST >= 120 U/L', points: 35}); }
  else if (ast >= 80) { hpScore += 22; hpDrivers.push({label: 'AST >= 80 U/L', points: 22}); }
  else if (ast >= 40) { hpScore += 12; hpDrivers.push({label: 'AST >= 40 U/L', points: 12}); }

  if (hepatotoxic_orals >= 2) { hpScore += 30; hpDrivers.push({label: 'Multiple hepatotoxic orals', points: 30}); }
  else if (hepatotoxic_orals === 1) { hpScore += 18; hpDrivers.push({label: 'Active hepatotoxic oral', points: 18}); }

  if (cycleRatio >= 0.75) { hpScore += 15; hpDrivers.push({label: 'Late cycle hepatic stress', points: 15}); }
  else if (cycleRatio >= 0.5) { hpScore += 8; hpDrivers.push({label: 'Mid cycle hepatic stress', points: 8}); }

  if (alt >= 80 && hepatotoxic_orals >= 1) { hpScore += 20; hpDrivers.push({label: 'Confirmed oral hepatic damage', points: 20}); }
  if (ast >= 80 && alt >= 80) { hpScore += 15; hpDrivers.push({label: 'Combined enzyme elevation', points: 15}); }
  if (hepatotoxic_orals >= 2 && cycleRatio >= 0.5) { hpScore += 15; hpDrivers.push({label: 'Extended multi-oral exposure', points: 15}); }

  // ENDOCRINE SUPPRESSION
  let edScore = 0;
  let edDrivers: {label: string, points: number}[] = [];

  if (lh > 0 && lh < 1.5) { edScore += 35; edDrivers.push({label: 'LH < 1.5', points: 35}); }
  else if (lh > 0 && lh < 3.0) { edScore += 20; edDrivers.push({label: 'LH < 3.0', points: 20}); }

  if (fsh > 0 && fsh < 1.5) { edScore += 30; edDrivers.push({label: 'FSH < 1.5', points: 30}); }
  else if (fsh > 0 && fsh < 3.0) { edScore += 15; edDrivers.push({label: 'FSH < 3.0', points: 15}); }

  if (testT > 1500) { edScore += 10; edDrivers.push({label: 'Supraphysiological Total Test', points: 10}); }
  if (testF > 30) { edScore += 8; edDrivers.push({label: 'Supraphysiological Free Test', points: 8}); }

  if (e2 > 60) { edScore += 20; edDrivers.push({label: 'Estradiol > 60 pg/mL', points: 20}); }
  else if (e2 > 40) { edScore += 10; edDrivers.push({label: 'Estradiol > 40 pg/mL', points: 10}); }
  else if (e2 > 0 && e2 < 10) { edScore += 15; edDrivers.push({label: 'Severely crashed Estradiol', points: 15}); }

  if (on_cycle >= 3) { edScore += 20; edDrivers.push({label: 'Heavy cycle stack', points: 20}); }
  else if (on_cycle >= 2) { edScore += 12; edDrivers.push({label: 'Moderate cycle stack', points: 12}); }
  else if (on_cycle === 1) { edScore += 6; edDrivers.push({label: 'Single compound cycle', points: 6}); }

  if (pctActive) { edScore -= 15; edDrivers.push({label: 'Active PCT protocol', points: -15}); }

  if (lh > 0 && lh < 1.5 && fsh > 0 && fsh < 1.5) { edScore += 20; edDrivers.push({label: 'Full HPTA Shutdown', points: 20}); }
  if (e2 > 60 && lh > 0 && lh < 1.5) { edScore += 15; edDrivers.push({label: 'Aromatization + Shutdown', points: 15}); }
  if (on_cycle >= 3 && !pctActive) { edScore += 15; edDrivers.push({label: 'Heavy cycle without recovery', points: 15}); }

  // HEMATOLOGICAL
  let hmScore = 0;
  let hmDrivers: {label: string, points: number}[] = [];

  if (hematocrit >= 54) { hmScore += 50; hmDrivers.push({label: 'Hematocrit >= 54%', points: 50}); }
  else if (hematocrit >= 52) { hmScore += 35; hmDrivers.push({label: 'Hematocrit >= 52%', points: 35}); }
  else if (hematocrit >= 50) { hmScore += 20; hmDrivers.push({label: 'Hematocrit >= 50%', points: 20}); }
  else if (hematocrit >= 48) { hmScore += 10; hmDrivers.push({label: 'Hematocrit >= 48%', points: 10}); }

  if (hemoglobin >= 18.5) { hmScore += 30; hmDrivers.push({label: 'Hemoglobin >= 18.5', points: 30}); }
  else if (hemoglobin >= 17.5) { hmScore += 18; hmDrivers.push({label: 'Hemoglobin >= 17.5', points: 18}); }
  else if (hemoglobin >= 16.5) { hmScore += 8; hmDrivers.push({label: 'Hemoglobin >= 16.5', points: 8}); }

  if (rbc >= 6.5) { hmScore += 25; hmDrivers.push({label: 'RBC >= 6.5', points: 25}); }
  else if (rbc >= 6.0) { hmScore += 15; hmDrivers.push({label: 'RBC >= 6.0', points: 15}); }
  else if (rbc >= 5.5) { hmScore += 5; hmDrivers.push({label: 'RBC >= 5.5', points: 5}); }

  if (inj_non_pct >= 2) { hmScore += 15; hmDrivers.push({label: 'Multiple injectables driving erythropoiesis', points: 15}); }
  else if (inj_non_pct === 1) { hmScore += 8; hmDrivers.push({label: 'Active injectable', points: 8}); }

  if (hematocrit >= 52 && hemoglobin >= 17.5) { hmScore += 15; hmDrivers.push({label: 'Severe polycythemia', points: 15}); }
  if (hematocrit >= 50 && inj_non_pct >= 1) { hmScore += 10; hmDrivers.push({label: 'Injectable-driven polycythemia', points: 10}); }

  cvScore = Math.min(cvScore, 95);
  hpScore = Math.min(hpScore, 95);
  edScore = Math.min(edScore, 95);
  hmScore = Math.min(hmScore, 95);

  const cvConf = getConfidence(cvPres);
  const hpConf = getConfidence(hpPres);
  const edConf = getConfidence(edPres);
  const hmConf = getConfidence(hmPres);

  const riskScores: AthleteRiskScores = {
    mode: 'athlete',
    cardiovascular: { score: cvScore, confidence: cvConf, confidence_interval: getConfidenceInterval(cvScore, cvConf), primary_drivers: getTopDrivers(cvDrivers) },
    hepatotoxicity: { score: hpScore, confidence: hpConf, confidence_interval: getConfidenceInterval(hpScore, hpConf), primary_drivers: getTopDrivers(hpDrivers) },
    endocrine_suppression: { score: edScore, confidence: edConf, confidence_interval: getConfidenceInterval(edScore, edConf), primary_drivers: getTopDrivers(edDrivers) },
    hematological: { score: hmScore, confidence: hmConf, confidence_interval: getConfidenceInterval(hmScore, hmConf), primary_drivers: getTopDrivers(hmDrivers) },
    overall_risk: 'LOW' // temporary
  };

  riskScores.overall_risk = getOverallRisk(riskScores);
  return riskScores;
}

// ─── VERIFICATION BLOCK ──────────────────────────────────────────────────────

/*
import { DEMO_PATIENT, DEMO_ATHLETE } from '@/data/mockData';
const r = calculateRisks(DEMO_PATIENT); // expect diabetes ~74, cardiac ~61, hypertension ~79
const a = calculateRisks(DEMO_ATHLETE); // expect hepatotoxicity ~72, endocrine ~88
console.log('--- PATIENT ---');
console.log(JSON.stringify(r, null, 2));
console.log('--- ATHLETE ---');
console.log(JSON.stringify(a, null, 2));
*/
