# Merit Mind Frontend

A production-grade React frontend for Merit Mind — an agentic AI system for bias-free and inclusive recruitment.

## Features

- **Dark Glassmorphism Design**: Modern UI with animated gradient orbs and glassmorphic cards
- **Authentication**: Secure login/register with JWT token management
- **Role-Based Routing**: Separate dashboards for Recruiters and Candidates
- **Protected Routes**: Dashboard access restricted to authenticated users
- **Responsive Design**: Fully responsive across mobile, tablet, and desktop
- **Real-time Validation**: Form validation with inline error messages
- **Loading States**: Spinner indicators during API calls
- **Global Auth State**: React Context for centralized authentication management

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Google Fonts** - Syne (headings) and DM Sans (body)

## Project Structure

```
src/
├── api/
│   └── auth.js                    # API calls for authentication
├── components/
│   ├── ProtectedRoute.jsx         # Route protection wrapper
│   └── ui/
│       ├── Button.jsx             # Reusable button component
│       ├── Input.jsx              # Reusable input component
│       └── Card.jsx               # Reusable card component
├── context/
│   └── AuthContext.jsx            # Global auth state
├── pages/
│   ├── Landing.jsx                # Home page
│   ├── Login.jsx                  # Login page
│   ├── Register.jsx               # Registration page
│   ├── RecruiterDashboard.jsx     # Recruiter dashboard
│   └── CandidateDashboard.jsx     # Candidate dashboard
├── App.jsx                        # Router setup
├── main.jsx                       # Entry point
└── index.css                      # Global styles and animations
```

## Setup Instructions

### Prerequisites

- Node.js 16+ and npm
- FastAPI backend running at `http://localhost:8000`

### Backend CORS Setup

Ensure your FastAPI backend has CORS middleware configured to allow both localhost ports:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Installation

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Ensure `.env` contains:
```
VITE_API_URL=http://localhost:8000
```

**⚠️ Important:** Vite only exposes environment variables prefixed with `VITE_`. After editing `.env`, restart the dev server for changes to take effect.

### Development

Start the development server:
```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## API Integration

The frontend integrates with the FastAPI backend at `http://localhost:8000`.

### Authentication Endpoints

- **POST /api/auth/register** - User registration
  - Request: `{ name, email, password, role }`
  - Response: `{ token, user_id, name, email, role }`

- **POST /api/auth/login** - User login
  - Request: `{ email, password }`
  - Response: `{ token, user_id, name, email, role }`

- **POST /api/auth/logout** - User logout
  - Query param: `token`

### Token Management

- Tokens are stored in `localStorage` after successful login
- User data (user_id, name, email, role) also stored in `localStorage`
- Tokens are cleared on logout
- Protected routes check for token in `localStorage`

## Design System

### Color Palette

- **Primary Background**: `#0D0B1E`
- **Secondary Background**: `#13102B`
- **Card Background**: `#1A1535`
- **Accent Pink**: `#E91E8C` (Recruiter accent)
- **Accent Purple**: `#7B2FFF`
- **Accent Cyan**: `#00D4FF` (Candidate accent)
- **Text Primary**: `#FFFFFF`
- **Text Secondary**: `#B8A9D9`

### Typography

- **Headings**: Syne (700-800 weight)
- **Body**: DM Sans (400-500 weight)

### Components

All components use glassmorphism styling with:
- `backdrop-filter: blur(16px)`
- Semi-transparent borders: `rgba(255,255,255,0.08)`
- Glowing shadows on hover

## Pages

### Landing Page (`/`)
- Hero section with animated gradient orbs
- Feature showcase (6 cards)
- Stats counter with animations
- Process steps visualization
- CTA banner
- Footer

### Register Page (`/register`)
- Form with validation (name, email, password, role)
- Role selector (Recruiter/Candidate)
- Password visibility toggle
- Inline error handling
- Link to login

### Login Page (`/login`)
- Email and password fields
- Password visibility toggle
- Inline error handling
- Link to register

### Recruiter Dashboard (`/dashboard/recruiter`)
- Protected route (redirects to login if unauthenticated)
- Sidebar with recruiter-specific navigation
- Top navbar with user info and pink accent
- Placeholder content for future features

### Candidate Dashboard (`/dashboard/candidate`)
- Protected route (redirects to login if unauthenticated)
- Sidebar with candidate-specific navigation
- Top navbar with user info and cyan accent
- Placeholder content for future features

## Authentication Flow

1. User registers or logs in on `/register` or `/login`
2. Backend validates credentials and returns JWT token + user data
3. Frontend stores token and user data in `localStorage`
4. `AuthContext` exposes auth state globally
5. User is redirected to role-based dashboard:
   - Recruiters → `/dashboard/recruiter`
   - Candidates → `/dashboard/candidate`
6. Protected routes check `localStorage` for token
7. On logout, all `localStorage` keys are cleared and user redirected to `/`

## Form Validation

- Required field validation
- Email format validation
- Password minimum length (8 characters)
- Real-time error display
- Inline error messages (no popups)

## Loading States

- Spinner indicator on submit buttons
- Button disabled during API calls
- Loading text updates

## Error Handling

- API errors displayed in red banner inside form
- Specific error messages from backend (e.g., "Email already registered")
- Graceful fallback messages

## Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Sidebar collapses on mobile
- Touch-friendly button sizes
- Flexible grid layouts

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Code splitting with React Router
- Lazy loading of routes
- Optimized animations with CSS
- Minimal JavaScript bundle
- No external icon libraries (using emojis)

## Security

- JWT token-based authentication
- Protected routes with token validation
- Secure token storage in localStorage
- CORS-enabled API calls
- No sensitive data in localStorage (only token and basic user info)

## Troubleshooting

### "Failed to Fetch" Error

1. Ensure backend is running at `http://localhost:8000`
2. Check CORS middleware is configured in backend
3. Verify `VITE_API_URL` in `.env` matches backend URL
4. Restart dev server after changing `.env`

### Port Already in Use

If port 3000 is already in use, Vite will automatically use the next available port.

### API Connection Issues

Ensure the backend is running at the address specified in `VITE_API_URL`.

### Build Errors

Clear `node_modules` and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## License

© 2025 Merit Mind. Built for Hack'her'thon 3.0
