# VitaNomy — Project Audit Report
> Generated: 2026-04-05  
> Status: Read-only analysis. No code changes made.

---

## 1. WHAT IS WORKING END TO END

These flows are fully wired, functional, and require no intervention:| Flow | Path |
|------|------|
| **Registration** | `/register` → collects full profile + vitals → **triggers AI analysis** → `/dashboard` |
| **Login (Credentials)** | `/login` → NextAuth `signIn('credentials')` → JWT session created |
| **Dashboard (read)** | `/dashboard` reads `patientStore` → renders vitals, risk cards, AI twin insights |
| **Chat (mock)** | `/chat` reads store → sends user message → **mocked response** |
| **Simulator (patient mode)** | `/simulator` → sliders → local JS simulation → renders delta bars |
| **Risk Engine** | `calculateRisks()` fully implemented for both `patient` and `athlete` modes |
| **AI Analysis** | `POST /api/analyze` → `calculateRisks()` → `getInsights()` (Claude) → returns structured `AnalyzeResponse` |
| **PDF Extract API** | `POST /api/extract` → Claude reads base64 PDF → returns `ExtractResponse` |
| **Auth Database** | NextAuth models present in schema and synced |
| **Domain Database** | `HealthSession`, `PatientRecord`, `Analysis` models present, synced, and used |
nt, synced, and used by `analyze` route |

---

## 2. WHAT EXISTS BUT IS NOT WIRED

Things that are coded, but the UI does **not call** the corresponding API:

| Feature | API Route | Problem |
|---|---|---|
| **Chat with Claude** | `POST /api/chat` | Chat pages use `setTimeout` mock. Real API is bypassed. |
| **Scenario Simulation** | `POST /api/simulate` | `/simulator` runs a local JS calculation. Narrative is not AI-generated. |
| **PDF Extraction** | `POST /api/extract` | Backend complete. No UI allows file upload. |
| **History Timeline** | `GET /api/history` | Route implemented. No UI reads past sessions. |
| **Account page (Save)** | Any API | `/account` fields are read-only. Nothing wired to save changes. |
| **Athlete Mode** | `POST /api/analyze` | No `/athlete` page or intake path exists. |

---

## 3. WHAT IS COMPLETELY MISSING

Features referenced in code or business logic that do **not exist at all**:

| Feature | Impact |
|---|---|
| **Dynamic symptom input** | No free-text symptom capture beyond chat. |
| **Bloodwork upload UI** | API `/api/extract` exists but no file upload component exists. |
| **Supplement log update** | No UI to manage compounds mid-session. |
| **Patient history timeline** | `GET /api/history` exists but no UI renders it. |
| **Athlete intake** | `/app/athlete/page.tsx` — **does not exist**. |
| **Google OAuth** | Missing `.env` variables. Fails on login attempt. |
| **Chat persistence** | `chatHistory` is in-memory only. Refresh = Data loss. |
| **PDF generation** | Reports tab buttons are decorative. |
| **Wearables / Devices** | Purely decorative. No integration exists. |

---

## 4. FILE-BY-FILE STATUS TABLE

### Core Libraries

| File | Status | What Works | Missing / Broken |
|---|---|---|---|
| `types/patient.ts` | ✅ COMPLETE | All interfaces defined: `PatientInput`, `AthleteInput`, `Compound`, `RiskFactor`, `PatientRiskScores`, `AthleteRiskScores`, `AnalyzeResponse`, `ExtractResponse`, `SimulateRequest`, `SimulateResponse`, `ChatMessage`, `ChatRequest`, `ChatResponse` | `cholesterol` (legacy) and `cholesterol_total` both exist — can cause ambiguity in risk engine |
| `lib/riskEngine.ts` | ✅ COMPLETE | Both patient mode (Diabetes/Cardiac/Hypertension) and athlete mode (Cardiovascular/Hepatotoxicity/Endocrine/Hematological) implemented with interaction scoring | None |
| `lib/claudeService.ts` | ✅ COMPLETE | Exports: `getInsights()`, `getSimulationNarrative()`, `chatWithTwin()`. Fallback constants: `FALLBACK_PATIENT_INSIGHTS`, `FALLBACK_ATHLETE_INSIGHTS`. Reference flags and cycle status helpers. | Model name is `claude-sonnet-4-20250514` — verify this model ID is valid |
| `lib/db.ts` | ✅ COMPLETE | Standard singleton Prisma pattern. Dev hot-reload safe. | None |

### API Routes

| File | Status | What Works | Missing / Broken |
|---|---|---|---|
| `app/api/analyze/route.ts` | ✅ COMPLETE | Receives `AnyPatientInput`, runs risk engine, calls Claude, calculates `data_completeness`, upserts `HealthSession` + `PatientRecord`, creates `Analysis` | DB error is caught silently — analysis still returns, but DB persistence may silently fail |
| `app/api/simulate/route.ts` | ✅ COMPLETE | All 4 patient scenarios: `exercise`, `diet`, `quit_smoking`, `medication`. All 4 athlete scenarios: `reduce_dose`, `add_organ_support`, `start_pct`, `cycle_off`. Calls `getSimulationNarrative()` for AI narrative. | Never called by any UI page |
| `app/api/chat/route.ts` | ✅ COMPLETE | Receives `ChatRequest`, calls `chatWithTwin()`. Validates presence of `patient`, `analysis`, `message`. | Never called by any UI page. Chat pages use `setTimeout` mock. |
| `app/api/extract/route.ts` | ✅ COMPLETE | Accepts `{ pdf_base64, mode }`. Sends PDF to Claude via `document` content block. Returns `ExtractResponse` with `confidence`. | Never called by any UI. `bodyParser` config in `export const config` is App Router incompatible — should use `route segment config`. |
| `app/api/history/route.ts` | ✅ COMPLETE | Queries `Analysis` via `HealthSession.patientId`. Returns 10 most recent. | Never called by any UI |
| `app/api/auth/[...nextauth]/route.ts` | ⚠️ PARTIAL | Credentials provider with bcrypt validation. JWT strategy. `PrismaAdapter` now aligned with schema. | Google OAuth missing `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` in `.env`. Will fail silently on Google login. |
| `app/api/auth/register/route.ts` | ✅ COMPLETE (assumed) | Not directly read, but referenced by register page | — |

### Pages

| File | Status | Renders | Missing / Broken |
|---|---|---|---|
| `app/page.tsx` | ✅ COMPLETE | `Navbar`, `Hero`, `Marquee`, `Features`, `HowItWorks`, `Footer` | Pure marketing page. |
| `app/register/page.tsx` | 🏆 SUPERIOR | 4-step flow + **Instant AI Sync** | Syncs to `patientStore` + Calls `/api/analyze`. |
| `app/login/page.tsx` | ✅ COMPLETE | Credential login | Redirects to `/dashboard`. |
| `app/dashboard/page.tsx` | ⚠️ PARTIAL | Two tabs: Builder & Analysis | Read-only. Empty state links to `/register`. |
| `app/simulator/page.tsx` | ⚠️ PARTIAL | Lifestyle sliders + Risk shifts | Local JS simulation. Empty state links to `/register`. |
| `app/chat/page.tsx` | ⚠️ PARTIAL | Full 3-column chat | `setTimeout` mock. Empty state links to `/register`. |
| `app/account/page.tsx` | ⚠️ PARTIAL | 8-tab Account Hub | No data write-back. Locked state links to `/register`. |
| `app/patient/page.tsx` | ❌ MISSING | — | Not present. |
| `app/athlete/page.tsx` | ❌ MISSING | — | Not present. |

### Components

| File | Status | Renders / Purpose | Notes |
|---|---|---|---|
| `components/Landing/Navbar.tsx` | ✅ COMPLETE | Navigation with links | — |
| `components/Landing/Hero.tsx` | ✅ COMPLETE | Landing hero section | — |
| `components/Landing/Marquee.tsx` | ✅ COMPLETE | Scrolling text marquee | — |
| `components/Landing/Features.tsx` | ✅ COMPLETE | Feature cards | — |
| `components/Landing/HowItWorks.tsx` | ✅ COMPLETE | Step-by-step explainer | — |
| `components/Landing/Footer.tsx` | ✅ COMPLETE | Footer | — |
| `components/Landing/DataTwin.tsx` | ⚠️ UNKNOWN | File exists but not imported by any checked page | May be unused / orphan |
| `components/Layout/Topbar.tsx` | ✅ COMPLETE | Navigation bar used across app | — |
| `components/Providers/AuthProvider.tsx` | ✅ COMPLETE | Wraps app in `SessionProvider` | — |
| `components/Form/PatientForm.tsx` | ✅ COMPLETE | 4-step patient intake (Name/Age, Weight/Height, BP/Glucose/Cholesterol, Lifestyle). Pre-fills from store. | Hardcoded to `mode: 'patient'`. No athlete intake path. |
| `components/Form/ProgressBar.tsx` | ✅ COMPLETE | Step progress indicator for PatientForm | — |
| `components/Dashboard/PatientBanner.tsx` | ✅ COMPLETE | Renders patient name, age, gender, BMI, risk badge from store | — |
| `components/Dashboard/BodyHeatmap.tsx` | ✅ COMPLETE | Animated SVG wireframe body with pulsing cardiac and metabolic risk zones | Supports both patient and athlete modes via score mode check |
| `components/Dashboard/InsightsList.tsx` | ✅ COMPLETE (assumed) | Renders AI insights array | Not re-read |
| `components/Dashboard/RiskGauge.tsx` | ✅ COMPLETE (assumed) | Animated gauge for risk scores | Not re-read |
| `components/Simulator/SimulatorBody.tsx` | ✅ COMPLETE (assumed) | Animated body SVG in simulator | Not re-read |
| `components/Simulator/RiskGauge.tsx` | ✅ COMPLETE (assumed) | Gauge component for simulator | Not re-read |
| `components/Simulator/ScenarioCard.tsx` | ✅ COMPLETE (assumed) | Scenario selector card | Not re-read |
| `components/Simulator/DeltaComparison.tsx` | ⚠️ PARTIAL | Renders animated delta bars (original vs projected risk). Falls back to `MOCK_SIMULATION`. | Delta labels are hardcoded strings ("↓ 21 points"). Not reading dynamic computed delta. |
| `components/Chat/ChatBox.tsx` | ⚠️ PARTIAL | Chat input + message thread, reads `chatHistory` from store | Uses `setTimeout` mock — does not call `/api/chat`. Is not used by `/chat/page.tsx` (which has its own inline chat implementation). **Potentially orphaned or duplicate.** |
| `components/Chat/SuggestedChips.tsx` | ⚠️ UNKNOWN | File exists. Not verified if imported anywhere. | Possibly orphaned. |
| `components/Common/TypoAvatar.tsx` | ✅ COMPLETE | Initials-based avatar | — |

### Data & Schema

| File | Status | Exports | Notes |
|---|---|---|---|
| `store/patientStore.ts` | ✅ COMPLETE | `mode`, `patient`, `extractResult`, `analysis`, `simulation`, `chatHistory`, `loadingExtract/Analyze/Simulate/Chat`, `error`. Actions: `setMode`, `setPatient`, `setExtractResult`, `setAnalysis`, `setSimulation`, `addChatMessage`, `clearChat`, `setLoading`, `setError`, `reset` | No persistence — Zustand store is in-memory. Refresh kills all state. |
| `data/mockData.ts` | ✅ COMPLETE | `DEMO_PATIENT`, `DEMO_ATHLETE`, `MOCK_PATIENT_ANALYSIS`, `MOCK_ATHLETE_ANALYSIS`, `MOCK_EXTRACT_RESPONSE`, `MOCK_ANALYSIS` (alias), `MOCK_SIMULATION`, `DEMO_PATIENT_ANALYSIS` (legacy alias) | `DEMO_ATHLETE` unused in any UI |
| `prisma/schema.prisma` | ✅ COMPLETE | **NextAuth**: `User`, `Account`, `Session`, `VerificationToken`. **Domain**: `HealthSession`, `PatientRecord`, `Analysis` | No foreign key linking `User` to `HealthSession` — health data is not associated with authenticated user accounts |

---

## 5. CRITICAL BLOCKERS FOR DEMO

> [!CAUTION]
> These will cause visible failures during a live demonstration.

| # | Blocker | Severity | Fix Effort |
|---|---|---|---|
| 1 | **Chat is mocked** — user types a real medical question, gets a canned template reply. `chatWithTwin()` is never called. | 🔴 HIGH | Medium — replace `setTimeout` in `/chat/page.tsx` `handleSend` with a real `fetch('/api/chat', ...)` call |
| 2 | **Simulator doesn't call AI** — clicking "Run Simulation" triggers local JS math, not `/api/simulate`. No Claude narrative shown. | 🔴 HIGH | Medium — replace `setTimeout` in `runSimulation()` with `fetch('/api/simulate', ...)` |
| 3 | **No athlete mode page** — `/athlete` does not exist. Cannot demo athlete flow without manually editing the URL or store. | 🔴 HIGH | High — need to create `/app/athlete/page.tsx` |
| 4 | **Google OAuth will fail** — `GOOGLE_CLIENT_ID` is not set. Clicking "Continue with Google" will throw a runtime error. | 🟡 MEDIUM | Low — either populate `.env` or remove the Google button from the UI before demo |
| 5 | **No data persistence across refreshes** — Zustand store is in-memory. Refreshing kills the entire session: patient data, analysis, chat. | 🔴 HIGH | Medium — add Zustand `persist` middleware with `localStorage` |
| 6 | **Health data not tied to User** — `HealthSession` has no `userId` foreign key. Logging in as a different user shows the same stored patient data (from the same browser session). | 🟡 MEDIUM | Medium — add `userId String?` to `HealthSession` and link on creation |

---

## 6. NICE TO HAVE BUT NOT BLOCKING

| Feature | Effort |
|---|---|
| Wire `GET /api/history` to a history timeline component in `/account` or `/dashboard` | Low |
| Wire `POST /api/extract` to a file upload flow in `/account` (Reports tab → "Upload New Report") | Medium |
| Implement athlete intake form (mirror of `PatientForm` for `mode: 'athlete'`) | High |
| Add `supplement log` update — allow adding/removing `Compound` objects mid-session without full re-analysis | Medium |
| Wire "Save Changes" in `/account/profile` to a `PATCH /api/user` route | Medium |
| Add Zustand `persist` to survive page refresh | Low |
| Add `userId` link to `HealthSession` so health data is user-scoped | Medium |
| Add PDF generation (report download) using a library like `@react-pdf/renderer` | High |
| Real wearable device integration | Very High |

---

## Summary

The VitaNomy backend (risk engine, Claude AI, all 5 API routes) is **fully implemented and functional**. The schema is clean, type-safe, and synced.

The frontend is **feature-rich but brittle** at the seams — the two highest-value user interactions (chat and simulation) both bypass their respective APIs and use local mocks. For a demo, these two wires are the highest-priority fix.

> **Estimated demo readiness: 65%**  
> Core data flow (register → intake → dashboard) is end-to-end.  
> Chat + Simulator are visually complete but functionally disconnected from their AI backends.
