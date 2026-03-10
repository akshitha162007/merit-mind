# Merit Mind Backend

FastAPI backend for the Merit Mind application.

## Setup

1. Create a Python virtual environment and activate it:
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1   # PowerShell
   ```

2. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```

3. Copy `.env.example` (if present) to `.env` and update the `DATABASE_URL`.
   The API URL is not required here but you can set `FRONTEND_URL` if you want to
   restrict CORS.

4. Run database migrations / create tables if needed (not currently implemented,
   you can run `python` and `from database import Base, engine; Base.metadata.create_all(bind=engine)`).

## Running the server

By default the API listens on port **8080**. Use the following command from the
`backend` directory:

```powershell
uvicorn main:app --reload --port 8080
```

If you prefer to use port 8000 (the value referenced by the frontend example),
start it with `--port 8000` and make sure the frontend `VITE_API_URL` matches.

The frontend(s) should be served from `http://localhost:3000` by default, and
CORS is already configured to allow that origin.

## Endpoints

- `POST /api/auth/register` - create a new user
- `POST /api/auth/login`    - log in and receive a token
- `POST /api/auth/logout`   - revoke a token
- `GET  /api/health`        - simple health check


