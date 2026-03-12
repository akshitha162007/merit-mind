# Counterfactual Fairness Agent - System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React + TailwindCSS)              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  CandidateView.jsx                                           │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │  Candidate Information                                  │  │  │
│  │  │  • Name: Priya Sharma                                   │  │  │
│  │  │  • Skills: Python, SQL, FastAPI                         │  │  │
│  │  │  • Experience: 3 years                                  │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  │                                                              │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │  FairnessAudit.jsx                                      │  │  │
│  │  │                                                          │  │  │
│  │  │  [Run Fairness Check Button]                            │  │  │
│  │  │                                                          │  │  │
│  │  │  ┌──────────────┐  ┌──────────────┐                    │  │  │
│  │  │  │ Original: 62 │  │ Corrected: 78│                    │  │  │
│  │  │  └──────────────┘  └──────────────┘                    │  │  │
│  │  │                                                          │  │  │
│  │  │  Bias Detected: Yes | Bias Delta: 16                    │  │  │
│  │  │                                                          │  │  │
│  │  │  ℹ️ Explanation: Score adjusted due to bias detection   │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  API Layer (fairness.js)                                     │  │
│  │  • checkFairness(candidateId)                                │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP POST
                                    │ /api/fairness/check
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         BACKEND (FastAPI)                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  main.py - API Endpoint                                      │  │
│  │                                                               │  │
│  │  POST /api/fairness/check                                    │  │
│  │  ├─ Validate candidate_id                                    │  │
│  │  ├─ Fetch candidate profile                                  │  │
│  │  ├─ Call counterfactual_agent                                │  │
│  │  ├─ Log audit                                                │  │
│  │  └─ Return results                                           │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                    │                                │
│                                    ▼                                │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  agents/counterfactual_agent.py                              │  │
│  │                                                               │  │
│  │  1. generate_counterfactual_profiles()                       │  │
│  │     ┌─────────────────────────────────────────────────────┐  │  │
│  │     │ Original: Priya, NIT Trichy, Bangalore              │  │  │
│  │     │ Variant 1: Emily, NIT Trichy, Bangalore             │  │  │
│  │     │ Variant 2: John, NIT Trichy, Bangalore              │  │  │
│  │     │ Variant 3: Priya, IIT Delhi, Bangalore              │  │  │
│  │     │ Variant 4: Priya, Local College, Bangalore          │  │  │
│  │     │ ... (8 total variants)                              │  │  │
│  │     └─────────────────────────────────────────────────────┘  │  │
│  │                                                               │  │
│  │  2. evaluate_variants()                                      │  │
│  │     ┌─────────────────────────────────────────────────────┐  │  │
│  │     │ Priya: 62    Emily: 78    John: 75                  │  │  │
│  │     │ IIT: 80      Local: 55    ...                        │  │  │
│  │     └─────────────────────────────────────────────────────┘  │  │
│  │                                                               │  │
│  │  3. calculate_bias_delta()                                   │  │
│  │     ┌─────────────────────────────────────────────────────┐  │  │
│  │     │ max(80) - min(55) = 25                               │  │  │
│  │     │ 25 > 10 (threshold) → BIAS DETECTED                  │  │  │
│  │     └─────────────────────────────────────────────────────┘  │  │
│  │                                                               │  │
│  │  4. apply_bias_correction()                                  │  │
│  │     ┌─────────────────────────────────────────────────────┐  │  │
│  │     │ Original: 62 → Corrected: 80 (highest score)        │  │  │
│  │     └─────────────────────────────────────────────────────┘  │  │
│  │                                                               │  │
│  │  5. log_fairness_audit()                                     │  │
│  │     └─ Save to database                                      │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                    │                                │
│                                    ▼                                │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  models.py                                                   │  │
│  │  • FairnessAuditLog                                          │  │
│  │  • Candidate                                                 │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         DATABASE (PostgreSQL)                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  fairness_audit_logs                                         │  │
│  │  ┌────────────┬────────────┬────────────┬────────────────┐  │  │
│  │  │ id         │ candidate  │ original   │ corrected      │  │  │
│  │  │            │ _id        │ _score     │ _score         │  │  │
│  │  ├────────────┼────────────┼────────────┼────────────────┤  │  │
│  │  │ uuid-1     │ cand-123   │ 62.0       │ 80.0           │  │  │
│  │  │ uuid-2     │ cand-456   │ 75.0       │ 75.0           │  │  │
│  │  └────────────┴────────────┴────────────┴────────────────┘  │  │
│  │                                                              │  │
│  │  Additional columns: bias_delta, timestamp                  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  candidates                                                  │  │
│  │  • id, name, email, resume_url, blind_id                    │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════
                            DATA FLOW
═══════════════════════════════════════════════════════════════════════

1. User Input
   └─> Candidate ID entered in frontend

2. API Request
   └─> POST /api/fairness/check with candidate_id

3. Profile Generation
   └─> Create 8 identity variants (same qualifications)

4. Scoring
   └─> Evaluate each variant with scoring model

5. Bias Detection
   └─> Calculate score variance (max - min)
   └─> If variance > 10: BIAS DETECTED

6. Correction
   └─> Apply highest score if bias detected

7. Audit Log
   └─> Store results in database

8. Response
   └─> Return results to frontend

9. Display
   └─> Show original vs corrected scores
   └─> Display bias detection status
   └─> Explain correction reasoning


═══════════════════════════════════════════════════════════════════════
                         KEY COMPONENTS
═══════════════════════════════════════════════════════════════════════

Backend Files:
├── agents/counterfactual_agent.py    (Core logic)
├── main.py                           (API endpoint)
├── models.py                         (Database models)
├── migrate_fairness.py               (DB migration)
└── test_fairness_agent.py            (Tests)

Frontend Files:
├── components/FairnessAudit.jsx      (Main component)
├── pages/CandidateView.jsx           (Demo page)
└── api/fairness.js                   (API utility)

Documentation:
├── FAIRNESS_AGENT_README.md          (Full docs)
├── FAIRNESS_QUICKSTART.md            (Quick start)
└── IMPLEMENTATION_SUMMARY.md         (Summary)
```
