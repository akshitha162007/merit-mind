# Quick Start: Counterfactual Fairness Agent

## 🚀 Setup (5 minutes)

### Step 1: Database Migration
```bash
cd backend
python migrate_fairness.py
```

### Step 2: Test the Agent
```bash
python test_fairness_agent.py
```

Expected output:
```
============================================================
Testing Counterfactual Fairness Agent
============================================================

1. Original Candidate Profile:
   Name: Priya
   Skills: Python, SQL, FastAPI
   Experience: 3 years
   College: NIT Trichy

2. Generating Counterfactual Profiles...
   Generated 8 profile variants

3. Evaluating Variants...
   Scores:
   - Priya: 62.0
   - Emily: 78.0
   - John: 75.0
   ...

4. Calculating Bias Delta...
   Bias Delta: 16.0
   Threshold: 10
   Bias Detected: True

5. Applying Bias Correction...
   Original Score: 62.0
   Corrected Score: 78.0
   Adjustment: +16.0
```

### Step 3: Start Backend
```bash
python main.py
```

Backend runs on: http://localhost:8000

### Step 4: Start Frontend
```bash
cd ../frontend
npm run dev
```

Frontend runs on: http://localhost:5173

## 🧪 Test the API

### Using curl:
```bash
curl -X POST http://localhost:8000/api/fairness/check \
  -H "Content-Type: application/json" \
  -d '{"candidate_id": "YOUR_CANDIDATE_UUID"}'
```

### Using the Frontend:
1. Navigate to http://localhost:5173/candidate-view
2. Enter a candidate UUID
3. Click "Run Fairness Check"
4. View results

## 📊 Understanding Results

**Bias Detected = Yes**
- Score variance > 10 points across identity variants
- System applies correction (uses highest variant score)

**Bias Detected = No**
- Score variance ≤ 10 points
- Original score retained

## 🔧 Configuration

Edit `backend/agents/counterfactual_agent.py`:

```python
BIAS_THRESHOLD = 10  # Change threshold here
```

## 📁 File Structure

```
backend/
├── agents/
│   ├── __init__.py
│   └── counterfactual_agent.py    ← Core logic
├── models.py                       ← Added FairnessAuditLog
├── main.py                         ← Added /api/fairness/check
├── migrate_fairness.py             ← Database migration
└── test_fairness_agent.py          ← Unit tests

frontend/
├── src/
│   ├── api/
│   │   └── fairness.js             ← API utility
│   ├── components/
│   │   └── FairnessAudit.jsx       ← Main component
│   └── pages/
│       └── CandidateView.jsx       ← Demo page
```

## ✅ Verification Checklist

- [ ] Database table created (fairness_audit_logs)
- [ ] Backend test passes
- [ ] Backend server running
- [ ] Frontend server running
- [ ] API endpoint responds
- [ ] Frontend displays results

## 🐛 Troubleshooting

**Error: Table doesn't exist**
→ Run: `python migrate_fairness.py`

**Error: Module not found**
→ Check you're in the backend directory

**Error: Connection refused**
→ Ensure backend is running on port 8000

## 📞 Support

See FAIRNESS_AGENT_README.md for detailed documentation.
