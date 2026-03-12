import re
import io
from PIL import Image

try:
    import fitz
except ImportError:
    fitz = None

try:
    import pdfplumber
except ImportError:
    pdfplumber = None

try:
    import pytesseract
except ImportError:
    pytesseract = None

try:
    import spacy
    nlp = spacy.load("en_core_web_sm")
except Exception:
    nlp = None

TECH_SKILLS = [
    "Python", "JavaScript", "TypeScript", "React", "FastAPI", "Node.js",
    "SQL", "PostgreSQL", "MongoDB", "AWS", "Docker", "Git", "Machine Learning",
    "NLP", "TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy", "Java",
    "C++", "REST API", "GraphQL", "Kubernetes", "Redis", "Data Analysis",
    "Deep Learning", "Excel", "Tableau", "PowerBI", "Figma", "UI/UX", "Agile",
    "Scrum", "Linux", "Bash", "Flutter", "Swift", "Kotlin", "Go", "C#", ".NET",
    "Spring Boot", "Django", "Flask", "Vue.js", "Angular", "Next.js",
    "Tailwind CSS", "Bootstrap", "Firebase", "Supabase", "PHP", "Laravel",
    "Ruby", "Rails", "Rust", "Computer Vision", "Statistics", "DevOps"
]


def extract_from_text(text: str) -> dict:
    """Extract from plain text input"""
    return {
        "raw_text": text,
        "parsed_json": parse_resume(text),
        "blind_text": blind_screen(text)
    }


def extract_from_pdf(file_bytes: bytes) -> dict:
    """Extract from PDF file"""
    text = ""
    
    # Try PyMuPDF first
    if fitz:
        try:
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            for page in doc:
                text += page.get_text()
            doc.close()
        except Exception:
            text = ""
    
    # Fallback to pdfplumber
    if not text and pdfplumber:
        try:
            with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
                for page in pdf.pages:
                    text += page.extract_text() or ""
        except Exception:
            text = ""
    
    if not text:
        raise ValueError("Could not extract text from PDF")
    
    return {
        "raw_text": text,
        "parsed_json": parse_resume(text),
        "blind_text": blind_screen(text)
    }


def extract_from_image(file_bytes: bytes) -> dict:
    """Extract from image file using OCR"""
    text = ""
    
    try:
        if pytesseract:
            image = Image.open(io.BytesIO(file_bytes))
            text = pytesseract.image_to_string(image)
    except Exception:
        text = ""
    
    return {
        "raw_text": text,
        "parsed_json": parse_resume(text),
        "blind_text": blind_screen(text)
    }


def parse_resume(text: str) -> dict:
    """Parse resume text and extract structured data"""
    
    # Extract skills (case-insensitive)
    skills = []
    for skill in TECH_SKILLS:
        if re.search(r'\b' + re.escape(skill) + r'\b', text, re.IGNORECASE):
            skills.append(skill)
    
    # Extract email
    emails = re.findall(r'[\w\.-]+@[\w\.-]+\.\w+', text)
    email = emails[0] if emails else None
    
    # Extract phone
    phones = re.findall(r'[\+\d][\d\s\-]{9,14}\d', text)
    phone = phones[0] if phones else None
    
    # Extract education and experience using spacy if available
    education = []
    experience = []
    
    if nlp:
        try:
            doc = nlp(text)
            
            # Extract education (ORG entities containing education keywords)
            education_keywords = ["university", "college", "institute", "school"]
            for ent in doc.ents:
                if ent.label_ == "ORG":
                    ent_text_lower = ent.text.lower()
                    if any(kw in ent_text_lower for kw in education_keywords):
                        if ent.text not in education:
                            education.append(ent.text)
            
            # Extract experience (all ORG entities not in education)
            for ent in doc.ents:
                if ent.label_ == "ORG":
                    if ent.text not in education:
                        if ent.text not in [e.get("company") for e in experience]:
                            experience.append({"company": ent.text})
        except Exception:
            pass
    
    # Fallback: regex-based extraction if spacy fails
    if not education:
        education_keywords = ["university", "college", "institute", "school", "b.tech", "m.tech", "phd"]
        for line in text.split("\n"):
            for kw in education_keywords:
                if kw.lower() in line.lower():
                    line_stripped = line.strip()
                    if line_stripped and line_stripped not in education:
                        education.append(line_stripped)
                    break
    
    if not experience:
        experience_keywords = ["intern", "engineer", "developer", "analyst", "manager"]
        for line in text.split("\n"):
            for kw in experience_keywords:
                if kw.lower() in line.lower():
                    line_stripped = line.strip()
                    if line_stripped and line_stripped not in [e.get("company") for e in experience]:
                        experience.append({"company": line_stripped})
                    break
    
    return {
        "skills": list(set(skills)),
        "education": list(set(education)),
        "experience": experience[:5],
        "contact": {
            "email": email,
            "phone": phone
        }
    }


def blind_screen(text: str) -> str:
    """Anonymize resume by replacing identifying information"""
    
    if not nlp:
        return text
    
    try:
        doc = nlp(text)
        result = text
        
        # Collect replacements to avoid overlapping
        replacements = []
        for ent in doc.ents:
            if ent.label_ == "PERSON":
                replacements.append((ent.text, "[NAME]"))
            elif ent.label_ == "ORG":
                replacements.append((ent.text, "[COMPANY]"))
            elif ent.label_ == "GPE":
                replacements.append((ent.text, "[LOCATION]"))
            elif ent.label_ == "FAC":
                replacements.append((ent.text, "[INSTITUTION]"))
        
        # Apply replacements
        for original, replacement in replacements:
            result = re.sub(r'\b' + re.escape(original) + r'\b', replacement, result, flags=re.IGNORECASE)
        
        return result
    except Exception:
        return text
