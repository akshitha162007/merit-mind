# Access Counterfactual Fairness Feature

## Frontend Access

Navigate to: **http://localhost:5173/candidate-view**

This page displays:
- Candidate information input
- Fairness audit component
- Bias detection results

## Steps to Test

1. **Start Backend:**
   ```bash
   cd backend
   python main.py
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the Page:**
   Open browser: http://localhost:5173/candidate-view

4. **Enter Candidate ID:**
   - Use any UUID format (e.g., `123e4567-e89b-12d3-a456-426614174000`)
   - Or create a real candidate in the database first

5. **Click "Run Fairness Check"**

6. **View Results:**
   - Original Score
   - Corrected Score
   - Bias Detection Status
   - Bias Delta
   - Variant Scores (expandable)

## Direct Link

After starting the frontend, go directly to:
```
http://localhost:5173/candidate-view
```

## Testing Without Real Candidate

The system will work with any UUID. The backend will:
- Generate counterfactual profiles
- Score each variant
- Detect bias
- Return corrected scores

Even if the candidate doesn't exist in the database, the fairness check will demonstrate the bias detection algorithm.

## Expected Output

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
    "John": 75.0,
    ...
  }
}
```

## Troubleshooting

**Page not loading?**
- Check frontend is running on port 5173
- Check browser console for errors

**API errors?**
- Ensure backend is running on port 8000
- Check CORS is enabled
- Verify database connection

**No results showing?**
- Enter a candidate ID first
- Click "Run Fairness Check" button
- Check browser network tab for API response
