# Resume Submission Feature - Implementation Complete

## Overview
Implemented a full-stack Candidate Resume Submission feature for Merit Mind with support for text, PDF, and image uploads.

## Backend Implementation

### 1. Updated Dependencies
**File:** `/backend/requirements.txt`
- Added: `pymupdf==1.24.0` (PDF extraction)
- Added: `pdfplumber==0.10.3` (PDF fallback)
- Added: `pytesseract==0.3.10` (OCR for images)

### 2. Resume Extractor Utility
**File:** `/backend/utils/resume_extractor.py`
- `extract_from_text(text)` - Extracts from plain text
- `extract_from_pdf(file_bytes)` - Extracts from PDF using PyMuPDF with pdfplumber fallback
- `extract_from_image(file_bytes)` - Extracts from JPG/PNG using Tesseract OCR
- `parse_resume(text)` - Parses extracted text using SpaCy NER:
  - Detects 60 tech skills (Python, React, AWS, etc.)
  - Extracts education organizations
  - Extracts experience entries
  - Extracts email and phone via regex
- `blind_screen(text)` - Anonymizes resume by replacing:
  - PERSON → [NAME]
  - ORG → [COMPANY]
  - GPE → [LOCATION]
  - FAC → [INSTITUTION]

### 3. Resume Upload Router
**File:** `/backend/routers/resume_upload.py`
- `POST /api/resume/submit-text` - Submit plain text resume
- `POST /api/resume/submit-pdf` - Upload PDF resume (5MB limit)
- `POST /api/resume/submit-image` - Upload JPG/PNG resume (5MB limit)
- `GET /api/resume/candidate/{candidate_id}` - Retrieve latest resume

All endpoints:
- Validate candidate exists
- Extract and parse resume
- Generate anonymized version
- Store in database
- Return detected skills

### 4. Database Model Update
**File:** `/backend/models.py`
- Added `blind_text` field to Resume model for anonymized content

### 5. Main Application
**File:** `/backend/main.py`
- Registered resume_upload router (2 lines added)

## Frontend Implementation

### 1. Resume API Client
**File:** `/frontend/src/api/resumeApi.js`
- `submitResumeText(candidate_id, text)` - Submit text
- `submitResumePdf(candidate_id, file)` - Upload PDF
- `submitResumeImage(candidate_id, file)` - Upload image
- `getCandidateResume(candidate_id)` - Fetch latest resume

All functions include JWT authorization header.

### 2. Resume Submission Component
**File:** `/frontend/src/components/ResumeSubmission.jsx`
- Three submission tabs: Text, PDF, Image
- Tab switching with gradient active state
- Text input with character counter
- Drag-and-drop file zones with hover effects
- Image preview for scanned resumes
- 5MB file size validation
- Loading spinner during submission
- Success banner with detected skills
- Error handling with user-friendly messages
- Checks for existing resume on mount

### 3. Dashboard Integration
**File:** `/frontend/src/components/Dashboard.jsx`
- Imported ResumeSubmission component
- Added component to candidate dashboard (only shown for non-recruiters)
- Passes candidate_id from user.user_id

## Features

✓ Three submission methods (text, PDF, image)
✓ Automatic text extraction from all formats
✓ Skill detection from 60 tech skills
✓ Education and experience parsing
✓ Contact information extraction
✓ Resume anonymization for bias-free screening
✓ File size validation (5MB limit)
✓ Drag-and-drop support
✓ Image preview
✓ Success confirmation with detected skills
✓ Error handling and user feedback
✓ Existing resume detection
✓ Professional UI matching dashboard theme

## Database Schema

### Resume Table
- id (UUID, PK)
- candidate_id (UUID, FK)
- raw_text (TEXT) - Full extracted text
- parsed_json (JSONB) - {skills, education, experience, contact}
- blind_text (TEXT) - Anonymized version
- skill_graph_json (JSONB) - Optional skill graph
- created_at (DATETIME)

## Error Handling

- File too large (>5MB) - Inline validation, no API call
- Wrong file type - Validation with helpful message
- PDF extraction failure - Fallback to pdfplumber
- OCR failure - Returns error message
- Network errors - Caught and displayed to user
- Missing candidate - 404 error

## Notes

- Tesseract OCR must be installed on system for image scanning
- Windows: https://github.com/UB-Mannheim/tesseract/wiki
- SpaCy model (en_core_web_sm) required for NER
- All IDs are UUID strings
- JWT token stored in localStorage
- CORS already configured
