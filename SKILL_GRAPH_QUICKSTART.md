# Quick Start: Skill Graph Intelligence Agent

## 🚀 Setup (3 minutes)

### Step 1: Install Dependencies
```bash
cd backend
pip install networkx==3.4.2
```

### Step 2: Test the Agent
```bash
python test_skill_graph.py
```

Expected output shows skill similarity calculations and match scores.

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

## 🧪 Test the Feature

### Option 1: Using the Frontend
1. Login to the application
2. Navigate to: http://localhost:5173/skill-evaluation
3. Enter candidate UUID
4. Enter job UUID
5. Click "Evaluate Skill Match"
6. View results with skill mapping

### Option 2: Using API
```bash
curl -X POST http://localhost:8000/api/skills/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "candidate_id": "YOUR_CANDIDATE_UUID",
    "job_id": "YOUR_JOB_UUID"
  }'
```

## 📊 Understanding Results

**Skill Match Score:** Overall percentage (0-100%)

**Similarity Levels:**
- 100% = Exact match
- 85% = 1-hop connection (closely related)
- 70% = 2-hop connection (transferable skill)
- 55% = 3-hop connection (distantly related)

**Example:**
```
Job Requirement: Data Analysis
Candidate Skill: Business Analytics
Graph Connection: 1-hop
Similarity: 85%
```

## 🎯 How It Works

1. **Build Graph:** Creates network of skill relationships
2. **Extract Skills:** Gets candidate and job skills
3. **Calculate Similarity:** Uses graph distance for each skill pair
4. **Match Skills:** Finds best candidate skill for each job requirement
5. **Compute Score:** Averages all similarity scores
6. **Save Results:** Stores in skill_graph_matches table

## 🔧 Skill Graph Structure

```
Business Analytics ↔ Data Analysis (1-hop)
Data Analysis ↔ Statistical Modeling (1-hop)
Statistical Modeling ↔ Python Analytics (1-hop)

Business Analytics → Statistical Modeling (2-hop)
```

## 📁 File Structure

```
backend/
├── agents/
│   └── skill_graph_agent.py       ← Core logic
├── main.py                         ← Added /api/skills/evaluate
├── test_skill_graph.py             ← Unit tests
└── requirements.txt                ← Added networkx

frontend/
├── src/
│   ├── components/
│   │   └── SkillIntelligence.jsx  ← Main component
│   └── pages/
│       └── SkillEvaluationPage.jsx ← Demo page
```

## ✅ Verification Checklist

- [ ] networkx installed
- [ ] Backend test passes
- [ ] Backend server running
- [ ] Frontend server running
- [ ] API endpoint responds
- [ ] Frontend displays results

## 🐛 Troubleshooting

**Error: networkx not found**
→ Run: `pip install networkx==3.4.2`

**Error: Candidate/Job not found**
→ Use valid UUIDs from database

**Low match scores**
→ Check if skills exist in graph

## 🎨 Frontend Features

- Large percentage display
- Color-coded similarity badges
- Expandable detailed mapping
- Intelligence insight explanation
- Dark theme styling

## 📈 Example Scenario

**Job Requirements:**
- Data Analysis
- SQL
- Python

**Candidate Skills:**
- Business Analytics (maps to Data Analysis at 85%)
- SQL (exact match at 100%)
- Python (exact match at 100%)
- Excel

**Result:** 95% skill match

## 🔗 Integration

The Skill Graph Agent integrates with:
- Existing candidates table
- Existing job_descriptions table
- Existing skill_graph_matches table
- Counterfactual Fairness Agent (pipeline)

## 📞 Support

See SKILL_GRAPH_README.md for detailed documentation.
