# Counterfactual Fairness Simulation Agent

## Overview

The Counterfactual Fairness Agent detects and corrects bias in candidate scoring by testing whether AI evaluation changes when only identity attributes are modified while qualifications remain identical.

## Architecture

### Backend (FastAPI)

**Module:** `backend/agents/counterfactual_agent.py`

**Core Functions:**

1. **generate_counterfactual_profiles(candidate_profile)**
   - Creates identity variants (name, college tier, location)
   - Preserves skills, experience, education
   - Returns list of profile variants

2. **evaluate_variants(profiles)**
   - Scores each profile using the evaluation model
   - Returns dictionary of {name: score}

3. **calculate_bias_delta(scores)**
   - Computes: max(score) - min(score)
   - Returns bias magnitude

4. **apply_bias_correction(original_score, scores)**
   - If bias_delta > threshold (10): assigns highest variant score
   - Otherwise: returns original score

5. **log_fairness_audit(db, candidate_id, ...)**
   - Stores audit log in PostgreSQL
   - Table: fairness_audit_logs

### API Endpoint

**POST /api/fairness/check**

Request:
```json
{
  "candidate_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

Response:
```json
{
  "candidate_id": "123e4567-e89b-12d3-a456-426614174000",
  "original_score": 62.0,
  "corrected_score": 78.0,
  "bias_detected": true,
  "bias_delta": 16.0,
  "variant_scores": {
    "Priya": 62.0,
    "Emily": 78.0,
    "John": 75.0
  }
}
```

### Database Schema

**Table: fairness_audit_logs**

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| candidate_id | UUID | Foreign key to candidates |
| original_score | Float | Score before correction |
| corrected_score | Float | Score after correction |
| bias_delta | Float | Max - min score difference |
| timestamp | DateTime | Audit timestamp |

### Frontend (React + TailwindCSS)

**Component:** `frontend/src/components/FairnessAudit.jsx`

Features:
- Run fairness check button
- Display original vs corrected scores
- Show bias detection status
- Tooltip explanation for bias correction
- Expandable variant scores view

**Page:** `frontend/src/pages/CandidateView.jsx`

Integrates FairnessAudit component into candidate dashboard.

## Setup Instructions

### 1. Backend Setup

```bash
cd backend

# Run migration to create fairness_audit_logs table
python migrate_fairness.py

# Start backend server
python main.py
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies (if needed)
npm install

# Start frontend
npm run dev
```

### 3. Test the Feature

1. Navigate to candidate view page
2. Enter a candidate UUID
3. Click "Run Fairness Check"
4. View bias detection results

## Integration Workflow

```
Resume Upload
    ↓
Candidate Scoring
    ↓
Counterfactual Fairness Agent ← NEW
    ↓
Candidate Ranking
```

## Configuration

**Bias Threshold:** 10 points (configurable in `counterfactual_agent.py`)

If score variance exceeds threshold, bias is detected and correction applied.

## Example Use Case

**Original Candidate:**
- Name: Priya
- Skills: Python, SQL
- Experience: 3 years
- Score: 62

**Counterfactual Variant:**
- Name: Emily
- Skills: Python, SQL (same)
- Experience: 3 years (same)
- Score: 78

**Result:** Bias detected (delta = 16), corrected score = 78

## API Testing

```bash
curl -X POST http://localhost:8000/api/fairness/check \
  -H "Content-Type: application/json" \
  -d '{"candidate_id": "YOUR_CANDIDATE_UUID"}'
```

## Future Enhancements

- Automatic fairness checks in candidate pipeline
- Real-time bias monitoring dashboard
- Historical bias trend analysis
- Multi-dimensional bias detection (intersectionality)
