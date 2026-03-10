# MeritMind - Complete Integration Guide

## 🚀 Quick Start

### 1. Start Backend (Terminal 1)
```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```
Or double-click: `start-backend.bat`

Backend will run on: **http://localhost:8000**

### 2. Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
Or double-click: `start-frontend.bat`

Frontend will run on: **http://localhost:5173**

## ✅ Integration Checklist

- [x] CORS configured for port 5173
- [x] Tailwind CSS properly configured
- [x] PostCSS fixed
- [x] All components created
- [x] Auth API integrated
- [x] LocalStorage persistence
- [x] Modal animations
- [x] Responsive design
- [x] Poppins font loaded

## 🎨 Features

### Frontend
- **Hero Section**: Animated glowing blobs, gradient text
- **Features**: 3-card grid with hover effects
- **How It Works**: 3-step stepper with arrows
- **Auth Modals**: Login/SignUp with error handling
- **Navbar**: Sticky with frosted glass effect

### Backend
- **POST /api/auth/register**: Create new user
- **POST /api/auth/login**: Authenticate user
- **POST /api/auth/logout**: End session

## 🔧 Troubleshooting

### CSS not loading?
```bash
cd frontend
npm install
```

### Backend errors?
```bash
cd backend
python -m pip install -r requirements.txt
```

### Port conflicts?
- Backend: Change port in `start-backend.bat`
- Frontend: Change in `vite.config.js`

## 📦 Tech Stack

**Frontend:**
- React 19
- Vite
- Tailwind CSS 4
- Axios
- Poppins Font

**Backend:**
- FastAPI
- SQLAlchemy
- PostgreSQL
- Bcrypt

## 🎯 Test Flow

1. Open http://localhost:5173
2. Click "Sign Up"
3. Fill form (name, email, password, role)
4. Submit → Auto-login
5. Navbar shows "Welcome, [name] 👋"
6. Click "Logout"
7. Click "Login" to sign back in

## 🌈 Color Palette

- Deep Purple: `#6B21A8`
- Bright Purple: `#7C3AED`
- Hot Pink: `#EC4899`
- Soft Pink: `#F9A8D4`
- Lavender: `#FAF5FF`
