# Resume Upload Feature - Quick Reference

## What Was Fixed

### Problem
Resume upload feature was broken:
- Candidates could not upload resumes
- Extraction details were shown to candidates (should be hidden)
- Recruiters had no way to view submitted resumes
- Missing recruiter endpoints

### Solution
Complete rewrite of backend extraction logic and router, plus new recruiter UI panel.

---

## How to Test

### 1. Candidate Resume Upload

**Test Text Upload:**
1. Log in as candidate
2. Go to Dashboard → "My Resume" section
3. Click "Text" tab
4. Paste resume text
5. Click "Extract and Save Resume"
6. Should see: "Resume submitted successfully. Your recruiter will review your application."
7. Should NOT see: Skills list, parsed data, or extraction details

**Test PDF Upload:**
1. Same as above but click "PDF Document" tab
2. Drag and drop or click to select a PDF file
3. Should see filename after selection
4. Click "Upload and Extract"
5. Should see same success message

**Test Image Upload:**
1. Same as above but click "Image / Scan" tab
2. Select JPG or PNG file
3. Should see image preview after selection
4. Click "Scan and Extract"
5. Should see same success message

**Test Existing Resume Warning:**
1. Upload a resume
2. Try to upload again
3. Should see banner: "You have already submitted a resume. Submitting again will replace your existing resume."

### 2. Recruiter Resume Viewing

**Test Resumes Tab:**
1. Log in as recruiter
2. Go to Dashboard
3. Click "Resumes" in sidebar (new tab)
4. Should see table with all submitted resumes
5. Table columns: Candidate, Skills, Education, Experience, Submitted, Action

**Test View Details:**
1. In Resumes table, click "View" button
2. Should see modal with:
   - Candidate name and blind ID
   - Skills as badges
   - Education list
   - Experience list
   - Full resume text (scrollable)
3. Click "Back to Resumes" to return to table

**Test Access Control:**
1. Log in as candidate
2. Try to access: http://localhost:5173/api/resume/all (in browser console)
3. Should get 403 Forbidden error

### 3. Database Verification

**Check SQLite Database:**
```bash
sqlite3 meritmind.db
SELECT * FROM resumes;
```

Should see:
- id (UUID)
- candidate_id (UUID)
- raw_text (full resume text)
- parsed_json (JSON with skills, education, experience, contact)
- blind_text (anonymized version)
- created_at (timestamp)

---

## API Endpoints

### Candidate Endpoints

**POST /api/resume/submit-text**
```json
{
  "candidate_id": "uuid",
  "text": "resume text here"
}
```
Response: `{success: true, resume_id: "uuid", message: "...", skills_found: [...], skills_count: N}`

**POST /api/resume/submit-pdf**
FormData:
- candidate_id: string
- file: PDF file

Response: Same as submit-text

**POST /api/resume/submit-image**
FormData:
- candidate_id: string
- file: JPG/PNG file

Response: Same as submit-text

**GET /api/resume/candidate/{candidate_id}**
Response: `{has_resume: true/false, resume_id: "uuid", submitted_at: "ISO date", skills_count: N}`

### Recruiter Endpoints (Require JWT + role=recruiter/admin)

**GET /api/resume/all**
Response: Array of resumes with candidate info and parsed data

**GET /api/resume/detail/{resume_id}**
Response: Full resume including raw_text, blind_text, parsed_json

---

## Error Codes

| Code | Meaning | Example |
|------|---------|---------|
| 400 | Bad request | Empty text, wrong file type, file too large |
| 401 | Unauthorized | Missing/invalid JWT token |
| 403 | Forbidden | Candidate accessing recruiter endpoint |
| 404 | Not found | Candidate or resume doesn't exist |
| 413 | Payload too large | File > 5MB |
| 500 | Server error | Extraction failed |

---

## File Locations

### Backend
- `/backend/utils/resume_extractor.py` - Text/PDF/image extraction
- `/backend/routers/resume_upload.py` - API endpoints
- `/backend/main.py` - Router registration (already done)

### Frontend
- `/frontend/src/components/ResumeSubmission.jsx` - Candidate upload UI
- `/frontend/src/components/ResumesPanel.jsx` - Recruiter view UI
- `/frontend/src/components/Dashboard.jsx` - Integration
- `/frontend/src/api/resumeApi.js` - API client

---

## Troubleshooting

### Issue: "Image OCR disabled" error
**Solution:** Install pytesseract and Tesseract OCR
```bash
pip install pytesseract
# Windows: https://github.com/UB-Mannheim/tesseract/wiki
# Linux: sudo apt-get install tesseract-ocr
# Mac: brew install tesseract
```

### Issue: "Could not extract text from PDF"
**Solution:** Install pdfplumber
```bash
pip install pdfplumber pymupdf
```

### Issue: Spacy model not found
**Solution:** Download spacy model
```bash
python -m spacy download en_core_web_sm
```

### Issue: 403 Forbidden on /api/resume/all
**Solution:** Make sure you're logged in as recruiter/admin, not candidate

### Issue: Resume not saving to database
**Solution:** Check DATABASE_URL in .env file and ensure SQLite is running

---

## Feature Checklist

- [x] Candidate can upload resume as text
- [x] Candidate can upload resume as PDF
- [x] Candidate can upload resume as image
- [x] Candidate sees only success message (no extraction details)
- [x] Candidate sees warning when replacing existing resume
- [x] Recruiter can view all submitted resumes
- [x] Recruiter can see parsed skills, education, experience
- [x] Recruiter can view full resume text
- [x] Candidate cannot access recruiter endpoints (403)
- [x] Resume data persisted in database
- [x] Proper error handling (no unhandled 500s)
- [x] JWT token validation on recruiter endpoints
