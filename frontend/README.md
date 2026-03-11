# MeritMind Frontend

Modern React landing page for MeritMind - AI-powered bias-free recruitment platform.

## Setup & Run

```bash
cd frontend
npm install
npm run dev
```

The app will run on `http://localhost:5173`

## Features

- 🎨 Stunning gradient design with purple/pink color scheme
- 🔐 Complete authentication flow (Login/Sign Up modals)
- 📱 Fully responsive (mobile & desktop)
- ✨ Smooth animations and transitions
- 🎯 Hero section with animated glowing blobs
- 📊 Features showcase with 3 cards
- 🔄 How It Works stepper flow
- 🌐 Backend integration with FastAPI

## Tech Stack

- React 18 (JavaScript)
- Vite
- Tailwind CSS
- Axios
- Google Fonts (Poppins)

## Backend API

Connects to FastAPI backend at `http://localhost:8000`

Endpoints:
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login
- POST `/api/auth/logout` - User logout
