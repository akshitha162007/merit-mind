# Skill Graph Intelligence Agent - Complete Documentation

## Overview

The Skill Graph Intelligence Agent evaluates candidate capabilities by mapping relationships between skills using a graph-based approach, going beyond exact keyword matching.

## Architecture

### Backend Components

**Module:** `backend/agents/skill_graph_agent.py`

**Core Functions:**

1. **build_skill_graph()**
   - Creates a NetworkX graph with skill relationships
   - Defines bidirectional edges between related skills
   - Returns graph object for similarity calculations

2. **calculate_skill_similarity(candidate_skill, job_skill, graph)**
   - Computes similarity score between two skills
   - Uses graph distance (hops) to determine relationship strength
   - Scoring:
     - Exact match: 1.0
     - 1-hop connection: 0.85
     - 2-hop connection: 0.70
     - 3-hop connection: 0.55

3. **extract_candidate_skills(candidate_data)**
   - Extracts skills from candidate profile
   - Supports multiple data sources (direct skills, parsed resume)
   - Returns deduplicated skill list

4. **extract_job_requirements(job_data)**
   - Extracts required skills from job description
   - Handles various data formats
   - Returns list of required skills

5. **evaluate_skill_match(candidate_skills, job_skills)**
   - Evaluates overall skill match
   - Finds best matching candidate skill for each job requirement
   - Returns comprehensive match result

6. **save_skill_match_result(db, candidate_id, job_id, result)**
   - Saves evaluation to skill_graph_matches table
   - Stores match percentage and detailed skill mapping

### API Endpoint

**POST /api/skills/evaluate**

Request:
```json
{
  "candidate_id": "123e4567-e89b-12d3-a456-426614174000",
  "job_id": "987e6543-e21b-12d3-a456-426614174000"
}
```

Response:
```json
{
  "candidate_id": "123e4567-e89b-12d3-a456-426614174000",
  "job_id": "987e6543-e21b-12d3-a456-426614174000",
  "skill_score": 0.925,
  "matched_skills": ["SQL", "Business Analytics", "Python"],
  "skill_details": [
    {
      "job_skill": "Data Analysis",
      "candidate_skill": "Business Analytics",
      "similarity": 0.85
    },
    {
      "job_skill": "SQL",
      "candidate_skill": "SQL",
      "similarity": 1.0
    },
    {
      "job_skill": "Python",
      "candidate_skill": "Python",
      "similarity": 1.0
    }
  ],
  "matched_count": 3,
  "total_required": 3
}
```

### Database Integration

**Table:** `skill_graph_matches` (existing)

Columns used:
- `candidate_id` - UUID reference to candidates table
- `jd_id` - UUID reference to job_descriptions table
- `match_percentage` - Overall skill match percentage
- `transferable_skills_json` - Detailed skill mapping data
- `cosine_similarity` - Skill score (0-1)

### Frontend Components

**Component:** `frontend/src/components/SkillIntelligence.jsx`

Features:
- Evaluate skill match button
- Large skill match score display (percentage)
- Matched skills badges
- Detailed skill mapping (expandable)
- Color-coded similarity indicators
- Intelligence insight explanation

**Page:** `frontend/src/pages/SkillEvaluationPage.jsx`

Features:
- Input fields for candidate ID and job ID
- Example scenario display
- Integration with SkillIntelligence component
- Dark theme styling

## Skill Graph Structure

### Example Relationships

```
Data & Analytics:
  Business Analytics ↔ Data Analysis
  Data Analysis ↔ Statistical Modeling
  Statistical Modeling ↔ Python Analytics
  Python Analytics ↔ Machine Learning
  Data Analysis ↔ Data Science
  Excel ↔ Data Analysis

Programming:
  Python ↔ Python Analytics
  Python ↔ Machine Learning
  JavaScript ↔ Frontend Development
  React ↔ Frontend Development
  FastAPI ↔ Backend Development

Database:
  SQL ↔ Database Management
  PostgreSQL ↔ SQL
  MySQL ↔ SQL

Cloud & DevOps:
  AWS ↔ Cloud Computing
  Docker ↔ DevOps
  Kubernetes ↔ DevOps
```

## Example Use Case

**Job Requirements:**
- Data Analysis
- SQL
- Python

**Candidate Skills:**
- Business Analytics
- SQL
- Excel
- Python

**Evaluation Process:**

1. **Data Analysis** requirement:
   - Check candidate skills
   - "Business Analytics" found
   - Graph distance: 1 hop
   - Similarity: 0.85

2. **SQL** requirement:
   - Exact match found
   - Similarity: 1.0

3. **Python** requirement:
   - Exact match found
   - Similarity: 1.0

**Final Score:** (0.85 + 1.0 + 1.0) / 3 = 0.95 (95%)

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
pip install networkx==3.4.2
```

### 2. Test the Agent

```bash
python test_skill_graph.py
```

Expected output:
```
======================================================================
Testing Skill Graph Intelligence Agent
======================================================================

1. Building Skill Graph...
   Graph nodes: 40
   Graph edges: 30

2. Testing Skill Similarity Calculations...
   SQL ↔ SQL: 1.00
   Business Analytics ↔ Data Analysis: 0.85
   Python ↔ Machine Learning: 0.85
   Excel ↔ Data Analysis: 0.85
   React ↔ Frontend Development: 0.85

3. Testing Full Skill Match Evaluation...
   Candidate Skills: Python, SQL, Business Analytics, Excel
   Job Requirements: Data Analysis, SQL, Python

   Skill Match Score: 0.950 (95.0%)
   Matched Skills: 3/3
   Matched: Business Analytics, SQL, Python

4. Detailed Skill Mapping:
   Data Analysis ← Business Analytics (0.85)
   SQL ← SQL (1.00)
   Python ← Python (1.00)
```

### 3. Start Backend

```bash
python main.py
```

### 4. Start Frontend

```bash
cd ../frontend
npm run dev
```

### 5. Access the Feature

Navigate to: **http://localhost:5173/skill-evaluation**

## API Testing

### Using curl:

```bash
curl -X POST http://localhost:8000/api/skills/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "candidate_id": "YOUR_CANDIDATE_UUID",
    "job_id": "YOUR_JOB_UUID"
  }'
```

### Using the Frontend:

1. Login to the application
2. Navigate to `/skill-evaluation`
3. Enter candidate UUID
4. Enter job UUID
5. Click "Evaluate Skill Match"
6. View results

## Integration Pipeline

```
Resume Upload
    ↓
Resume Parsing
    ↓
Skill Graph Intelligence Agent ← NEW
    ↓
Counterfactual Fairness Agent
    ↓
Fair Ranking Optimizer
    ↓
Final Candidate Recommendation
```

## Color Coding

**Frontend Display:**
- Green (≥85%): Exact match or 1-hop connection
- Yellow (≥70%): 2-hop connection
- Orange (<70%): 3+ hop connection or weak match

## Advantages Over Keyword Matching

1. **Semantic Understanding:** Recognizes "Business Analytics" ≈ "Data Analysis"
2. **Transferable Skills:** Identifies related competencies
3. **Reduced Bias:** Less dependent on exact terminology
4. **Better Matches:** Finds qualified candidates missed by keyword search
5. **Explainable:** Shows relationship path between skills

## Extending the Graph

To add new skill relationships, edit `skill_graph_agent.py`:

```python
skill_relationships = [
    # Add your relationships here
    ("New Skill", "Related Skill"),
    ("Another Skill", "Connected Skill"),
]
```

## Performance

- Graph building: O(E) where E = number of edges
- Similarity calculation: O(V + E) using BFS
- Full evaluation: O(C × J × (V + E)) where C = candidate skills, J = job skills

For typical use cases (40 nodes, 30 edges, 10 skills each):
- Evaluation time: <100ms
- Memory usage: <1MB

## Troubleshooting

**Error: Module 'networkx' not found**
→ Run: `pip install networkx==3.4.2`

**Error: No path between skills**
→ Skills are not connected in graph, returns 0.0 similarity

**Low match scores**
→ Check if skills are in the graph, add missing relationships

## Future Enhancements

- Machine learning-based similarity scores
- Dynamic graph updates from hiring data
- Industry-specific skill graphs
- Multi-language skill mapping
- Skill proficiency levels
