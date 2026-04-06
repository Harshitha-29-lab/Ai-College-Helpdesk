# main.py — Entry point for the FastAPI backend server
# This file sets up the web server, enables CORS (so the frontend can talk to it),
# and registers all the API routes.

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import our chat routes
from routes.chat import router as chat_router

# Create the FastAPI application
app = FastAPI(
    title="AI College Helpdesk API",
    description="Backend API for the AI College Helpdesk chatbot. Uses Gemini AI with keyword fallback.",
    version="1.0.0",
)

# ---------------------------------------------------------------------------
# CORS Middleware
# ---------------------------------------------------------------------------
# CORS = Cross-Origin Resource Sharing
# The frontend runs on port 5173 (Vite) and the backend on port 8000 (Uvicorn).
# Without CORS, the browser blocks requests between different ports.
# This middleware tells the browser: "It's okay, let port 5173 talk to me."

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],     # Allow GET, POST, etc.
    allow_headers=["*"],     # Allow all headers
)

# ---------------------------------------------------------------------------
# Register Routes
# ---------------------------------------------------------------------------
# All chat-related routes will be under /api (e.g., POST /api/chat)
app.include_router(chat_router, prefix="/api")


# ---------------------------------------------------------------------------
# Root Endpoint — Health Check
# ---------------------------------------------------------------------------
@app.get("/")
async def root():
    """
    Simple health check. Visit http://localhost:8000 to see if the server is running.
    """
    return {
        "status": "ok",
        "message": "College Helpdesk API is running 🎓",
    }
