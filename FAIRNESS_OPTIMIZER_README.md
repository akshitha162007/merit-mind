# Dynamic Fairness Constraint Optimizer - Feature Documentation

## Overview
The Dynamic Fairness Constraint Optimizer allows recruiters to define fairness constraints across multiple demographic axes and re-rank candidates mathematically to satisfy those constraints while maintaining merit-based evaluation.

## Features Implemented

### Frontend Components

#### 1. FairnessOptimizerPanel.jsx
**Location:** `frontend/src/components/FairnessOptimizerPanel.jsx`

**Recruiter View Sections:**
- Header with preset loader (EEOC Compliant, Maximum Diversity, Merit-First Balanced)
- Job selection dropdown
- 5 constraint sliders (Gender, Caste, Region, Age, College Tier) with live percentage display
- Constraint conflict detector (warns if total > 150%)
- Run Optimizer button with loading state
- Results section with:
  - 4 stat cards (Optimized Shortlist, Fairness Score, Diversity Index, Fairness ROI)
  - Before/After comparison table with rank changes
  - Demographic distribution chart (Recharts)
  - Collapsible optimization history with export option

**Candidate View:**
- Read-only Fairness Transparency Card
- Merit Score and Fairness-Adjusted Score display
- Rank Percentile ("Top X%")
- Plain-language explanation of evaluation process
- Active fairness axes display

#### 2. Dashboard.jsx (Updated)
**Location:** `frontend/src/components/Dashboard.jsx`

**Changes:**
- Converted sidebar to collapsible tree navigation
- Dashboard parent node expands to show child items
- "Fairness Optimizer" child item with pink active state
- Chevron icon rotates 90° on expand
- Active items show 4px pink left border
- Smooth 300ms transitions

### Backend Endpoints

#### 1. GET /api/jobs
**Purpose:** Fetch jobs for authenticated recruiter
**Auth:** Bearer token required
**Response:**
```json
[
  { "id": "uuid", "title": "Software Engineer" }
]
```

#### 2. POST /api/fairness/optimize
**Purpose:** Run fairness optimization algorithm
**Auth:** Bearer token required
**Request Body:**
```json
{
  "jd_id": "uuid",
  "constraints": {
    "gender": 40,
    "caste": 20,
    "region": 30,
    "age": 25,
    "college_tier": 15
  }
}
```
**Response:**
```json
{
  "optimized_candidates": [
    {
      "id": "uuid",
      "name_anonymous": "Candidate #1",
      "original_rank": 1,
      "optimized_rank": 2,
      "merit_score": 85.5,
      "fairness_adjustment": 2.3,
      "rank_change": -1
    }
  ],
  "fairness_score": 30.0,
  "diversity_index": 36.0,
  "fairness_roi": {
    "merit_delta": -2.5,
    "fairness_delta": 3.0
  },
  "demographic_breakdown": [
    { "axis": "Gender", "before": 35, "after": 40 }
  ]
}
```

#### 3. GET /api/fairness/history
**Purpose:** Fetch optimization history for a job
**Auth:** Bearer token required
**Query Params:** `jd_id=uuid`
**Response:**
```json
[
  {
    "run_at": "2025-01-10T12:00:00",
    "recruiter_name": "John Doe",
    "job_title": "Software Engineer",
    "fairness_score": 30.0
  }
]
```

## Design System Compliance

### Colors
- Background: `#0D0B1E` (primary), `#13102B` (secondary), `#1A1535` (cards)
- Accents: Pink `#E91E8C`, Purple `#7B2FFF`, Cyan `#00D4FF`
- Text: `#FFFFFF` (primary), `#B8A9D9` (secondary)
- Gradient: `linear-gradient(135deg, #7B2FFF 0%, #E91E8C 100%)`

### Cards
```css
background: rgba(26, 21, 53, 0.6);
backdrop-filter: blur(16px);
border: 1px solid rgba(255, 255, 255, 0.08);
border-radius: 16px;
```

### Buttons
```css
background: linear-gradient(135deg, #7B2FFF, #E91E8C);
border-radius: 8px;
transition: all 0.3s ease;
```
Hover: `translateY(-2px)` with pink shadow

### Inputs/Sliders
```css
background: rgba(255, 255, 255, 0.07);
border: 1px solid rgba(255, 255, 255, 0.1);
```
Focus: Pink ring `#E91E8C`

### Typography
- Headings: **Syne** (weight 700-800)
- Body: **DM Sans** (weight 400-500)

## Usage Instructions

### For Recruiters

1. **Navigate to Fairness Optimizer:**
   - Click "Dashboard" in sidebar to expand
   - Click "Fairness Optimizer" child item

2. **Select Job:**
   - Choose a job from the dropdown

3. **Set Constraints:**
   - Adjust sliders for each demographic axis (0-100%)
   - Or use "Load Preset" dropdown for pre-configured values
   - Watch for conflict warning if total > 150%

4. **Run Optimization:**
   - Click "Run Fairness Optimizer"
   - Wait for results (shimmer loading animation)

5. **Review Results:**
   - Check stat cards for key metrics
   - Review rank comparison table
   - Analyze demographic distribution chart
   - Expand history to see past runs

### For Candidates

1. **View Transparency Report:**
   - Navigate to Fairness Optimizer
   - See your Merit Score and Fairness-Adjusted Score
   - Check your Rank Percentile
   - Read evaluation explanation

## Technical Details

### Loading States
- Shimmer animation (CSS keyframes)
- No spinners except on buttons
- Smooth scroll to results on completion

### Error Handling
- Inline error cards (pink background, pink border)
- No alert() popups
- Detailed error messages from backend

### Responsive Design
- Single column on mobile
- 2-column grid on tablet
- Full layout on desktop
- Sticky table headers

### Cross-Browser Compatibility
- Custom range slider with webkit and moz prefixes
- Backdrop-filter fallback
- Tested on Chrome, Firefox, Safari, Edge

## Database Schema Used

### Tables
- `users` - User authentication
- `sessions` - Session tokens
- `job_descriptions` - Job postings
- `applications` - Candidate applications
- `bias_reports` - Bias detection results
- `fairness_metrics` - Optimization history

## API Authentication

All endpoints require:
```
Authorization: Bearer <token>
```

Token is stored in localStorage after login and automatically included in axios requests.

## Future Enhancements

1. Real-time constraint satisfaction algorithm
2. Machine learning-based fairness scoring
3. Export optimization reports as PDF
4. Email notifications for optimization completion
5. A/B testing different constraint configurations
6. Integration with ATS systems

## Testing

### Manual Testing Steps

1. **Backend:**
   ```bash
   cd backend
   python -m uvicorn main:app --reload --port 8000
   ```

2. **Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Flow:**
   - Register as recruiter
   - Navigate to Fairness Optimizer
   - Select job (or create mock data)
   - Adjust constraints
   - Run optimizer
   - Verify results display correctly

### Mock Data
If no jobs exist, create sample data:
```sql
INSERT INTO job_descriptions (id, recruiter_id, title, raw_text)
VALUES (gen_random_uuid(), '<your_user_id>', 'Software Engineer', 'Sample JD');
```

## Support

For issues or questions:
- Check browser console (F12) for errors
- Verify backend is running on port 8000
- Ensure database tables are initialized
- Check CORS configuration for your frontend port

## License

Part of MeritMind - Bias-Free Recruitment Platform
© 2025 Team Merit Mind
