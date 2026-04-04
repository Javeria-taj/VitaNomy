MODE: Plan mode

CONTEXT:
[PASTE FULL types/patient.ts HERE]

TASK:
Build all five API route handlers. Each must return exactly
the shape specified in types/patient.ts. No improvising.

── ROUTE 1: /app/api/extract/route.ts ──

POST handler receives: { pdf_base64: string, mode: PlatformMode }
Returns: ExtractResponse

Pipeline:
1. Parse body, validate pdf_base64 exists and mode is valid
2. Call Claude with PDF as document block:
   messages: [{
     role: 'user',
     content: [{
       type: 'document',
       source: {
         type: 'base64',
         media_type: 'application/pdf',
         data: pdf_base64
       }
     }, {
       type: 'text',
       text: [mode-specific extraction prompt]
     }]
   }]
3. Parse response JSON safely
4. Determine which expected fields are missing → unreadable_fields
5. Calculate confidence: >70% fields found=high, 40-70%=medium, <40%=low
6. Return ExtractResponse

Patient mode extraction prompt:
"Extract all available medical values from this lab report.
Return ONLY valid JSON with these exact keys where present:
systolic_bp, diastolic_bp, glucose, cholesterol_total,
cholesterol_hdl, cholesterol_ldl, triglycerides, weight, height.
Omit any key not found. No markdown, no backticks."

Athlete mode extraction prompt:
"Extract all available medical values from this blood panel.
Return ONLY valid JSON with these exact keys where present:
systolic_bp, diastolic_bp, glucose, cholesterol_total,
cholesterol_hdl, cholesterol_ldl, triglycerides, hematocrit,
hemoglobin, rbc, alt, ast, testosterone_total, testosterone_free,
estradiol, lh, fsh, creatinine, weight, height, body_fat_percent.
Omit any key not found. No markdown, no backticks."

On any error: return { mode, extracted_fields: {}, unreadable_fields: [], confidence: 'low' }
Add: export const config = { api: { bodyParser: { sizeLimit: '10mb' }}}

── ROUTE 2: /app/api/analyze/route.ts ──

POST handler receives: AnyPatientInput
Returns: AnalyzeResponse

Pipeline:
1. Parse and validate body has mode field
2. const risk_scores = calculateRisks(patient)  ← sync, instant
3. const overall_risk = getOverallRisk(risk_scores)  ← sync
4. const { insights, recommendations, causation_flags } =
     await getInsights(patient, risk_scores)  ← only async op
5. Calculate data_completeness:
   count defined fields / total fields for that mode * 100
6. Save to DB (wrap in try/catch — DB failure must not break response):
   await prisma.session.upsert({
     where: { patientId },
     create: { patientId, mode: patient.mode },
     update: {}
   })
   await prisma.patientRecord.upsert({...})
   await prisma.analysis.create({...})
7. Return AnalyzeResponse

patient_id: `${patient.name.replace(/\s+/g,'-').toLowerCase()}-${Date.now()}`

── ROUTE 3: /app/api/simulate/route.ts ──

POST handler receives: SimulateRequest
Returns: SimulateResponse

Pipeline:
1. Parse body: { patient: AnyPatientInput, scenario: string }
2. Apply scenario modifiers to create modifiedPatient:

PATIENT MODE MODIFIERS:
exercise:    set exercise='moderate', weight: weight*0.97 (3% reduction)
diet:        glucose: glucose*0.88, cholesterol_total: cholesterol_total*0.92,
             triglycerides: triglycerides ? triglycerides*0.85 : undefined
quit_smoking: smoking=false, systolic_bp: systolic_bp-6
medication:  systolic_bp: systolic_bp*0.88, diastolic_bp: diastolic_bp*0.88,
             glucose: glucose*0.85

ATHLETE MODE MODIFIERS:
reduce_dose:      all compound doses *= 0.5
add_organ_support: alt: alt ? alt*0.75 : undefined, ast: ast ? ast*0.75 : undefined
start_pct:        pct_active=true, lh: lh ? lh*1.8 : undefined,
                  fsh: fsh ? fsh*1.8 : undefined
cycle_off:        compounds=[], pct_active=true,
                  lh: lh ? lh*2.5 : 2.0, fsh: fsh ? fsh*2.5 : 1.8

3. const original_risks = calculateRisks(patient)
4. const projected_risks = calculateRisks(modifiedPatient)
5. Calculate delta: for each risk key, projected - original
6. const timeframe = getTimeframe(scenario):
   exercise='3-6 months', diet='2-3 months',
   quit_smoking='6-12 months', medication='4-8 weeks',
   reduce_dose='4-6 weeks', add_organ_support='2-4 weeks',
   start_pct='4-8 weeks', cycle_off='3-6 months'
7. const narrative = await getSimulationNarrative(scenario, delta, timeframe)
8. Return SimulateResponse

── ROUTE 4: /app/api/chat/route.ts ──

POST handler receives: ChatRequest
Returns: ChatResponse

Pipeline:
1. Parse body: { patient, analysis, history, message }
2. const reply = await chatWithTwin(patient, analysis, history, message)
3. Return { reply }

── ROUTE 5: /app/api/history/route.ts ──

GET handler — query param: ?patientId=string
Returns: { sessions: Analysis[] }

Pipeline:
1. const patientId = searchParams.get('patientId')
2. If no patientId: return { sessions: [] }
3. const sessions = await prisma.analysis.findMany({
     where: { session: { patientId } },
     orderBy: { createdAt: 'desc' },
     take: 10
   })
4. Return { sessions }

CONSTRAINTS FOR ALL ROUTES:
- Every route wrapped in try/catch returning { error: string } with status 500
- Validate mode field exists before any processing
- Never expose raw error messages — generic 'Analysis failed' only
- All imports must resolve — no missing module errors
- DB operations always wrapped in separate try/catch from main logic

VERIFY:
Test each route with Thunder Client:
POST /api/extract  → body: { pdf_base64: "dGVzdA==", mode: "patient" }
POST /api/analyze  → body: DEMO_PATIENT from mockData.ts
POST /api/simulate → body: { patient: DEMO_PATIENT, scenario: "exercise" }
POST /api/chat     → body: { patient: DEMO_PATIENT, analysis: MOCK_PATIENT_ANALYSIS, history: [], message: "What should I focus on?" }
GET  /api/history  → ?patientId=alex-morgan-mock
All must return valid JSON matching their types exactly.