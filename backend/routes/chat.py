# routes/chat.py — Core chat logic: Gemini AI + keyword fallback
# This file handles the POST /chat endpoint.
# It tries to answer using Google's Gemini AI first.
# If the API key is missing or the call fails, it falls back to keyword matching.

import os
import httpx
from datetime import datetime, timezone
from fastapi import APIRouter
from dotenv import load_dotenv

from models import ChatRequest, ChatResponse
from supabase_client import save_chat_log

# Load environment variables
load_dotenv()

# Create a router — this groups related endpoints together
router = APIRouter()


# ---------------------------------------------------------------------------
# FALLBACK: Keyword-based responses (works without any API key)
# ---------------------------------------------------------------------------

def fallback_response(message: str) -> str:
    """
    Match the student's message against common keywords and return
    a helpful pre-written answer. This is the "offline" mode that
    always works, even without an internet connection or API key.
    """
    # Convert to lowercase so matching is case-insensitive
    msg = message.lower()

    # Check each group of keywords and return the matching response
    if any(word in msg for word in ["exam", "exams", "examination", "test"]):
        return "📅 Exams start from **10th March**. Check the notice board for the full timetable."

    if any(word in msg for word in ["subject", "subjects", "course", "syllabus"]):
        return "📚 Your subjects are **Math, Science, and English**. Visit the academic office for electives."

    if any(word in msg for word in ["timing", "time", "schedule", "hours"]):
        return "🕘 College timing is **9 AM to 3 PM**, Monday to Saturday."

    if any(word in msg for word in ["fee", "fees", "payment"]):
        return "💳 Visit the **Accounts Office** (Room 12) between 10 AM–1 PM for fee queries."

    if any(word in msg for word in ["holiday", "holidays", "vacation"]):
        return "🎉 Next holiday is **Diwali Break (Nov 1–5)**. Check the college website for the full calendar."

    if any(word in msg for word in ["library", "books", "borrow"]):
        return "📖 Library is open **9 AM to 5 PM**. Borrow up to 3 books for 2 weeks."

    if any(word in msg for word in ["result", "results", "marks", "grade"]):
        return "📊 Results are on the **student portal** within 2 weeks of exams."

    # If no keyword matched, give a generic helpful response
    return "🤝 Please **contact the administration office** or call **+91-XXXXXXXXXX**."


# ---------------------------------------------------------------------------
# GROQ AI: Call Groq API for fast, smart AI responses (free tier)
# Uses Llama 3.3 70B model — great for study questions
# ---------------------------------------------------------------------------

async def ask_ai(message: str) -> str | None:
    """
    Send the student's question to Groq (Llama 3.3 70B) and get an AI-generated answer.
    
    Returns:
        The AI's response as a string, or None if the call fails / key is missing.
    """
    # Read the Groq API key from environment
    api_key = os.getenv("GROQ_API_KEY", "")

    # If no key is set, skip AI and use fallback instead
    if not api_key:
        print("ℹ️  GROQ_API_KEY not set — using fallback responses.")
        return None

    try:
        # Groq API uses the OpenAI-compatible format
        url = "https://api.groq.com/openai/v1/chat/completions"

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }

        payload = {
            "model": "llama-3.3-70b-versatile",
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "You are a friendly AI assistant for a college helpdesk. "
                        "Answer student questions about exams, subjects, timings, fees, "
                        "library, results, and also general study/academic questions. "
                        "For study questions (science, math, history, etc.), give clear "
                        "and helpful explanations. Keep responses concise (2–4 sentences). "
                        "If unsure, tell the student to contact administration."
                    ),
                },
                {
                    "role": "user",
                    "content": message,
                },
            ],
            "max_tokens": 512,
            "temperature": 0.7,
        }

        # Make the API call
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(url, json=payload, headers=headers)

        # Check if the response is successful
        if resp.status_code == 200:
            data = resp.json()
            text = data["choices"][0]["message"]["content"]
            return text.strip()
        else:
            print(f"❌ Groq API returned status {resp.status_code}: {resp.text}")
            return None

    except Exception as e:
        # If anything goes wrong, log it and fall back to keywords
        print(f"❌ Error calling Groq API: {e}")
        return None


# ---------------------------------------------------------------------------
# POST /chat — Main endpoint that the frontend calls
# ---------------------------------------------------------------------------

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Handle a student's chat message.
    
    Flow:
    1. Check if the message is empty
    2. Try Gemini AI first
    3. If AI fails, use keyword fallback
    4. Save the conversation to Supabase
    5. Return the response
    """
    message = request.message.strip()

    # If the student sent an empty message, ask them to type something
    if not message:
        return ChatResponse(
            response="😊 Please type a question and I'll do my best to help you!",
            source="system",
            timestamp=datetime.now(timezone.utc).isoformat(),
        )

    # Step 1: Try getting an answer from Groq AI
    ai_response = await ask_ai(message)

    if ai_response:
        # AI gave us an answer!
        answer = ai_response
        source = "ai"
    else:
        # No AI available — use keyword fallback
        answer = fallback_response(message)
        source = "fallback"

    # Step 2: Save the conversation to Supabase (non-blocking, won't crash if it fails)
    await save_chat_log(question=message, response=answer, source=source)

    # Step 3: Build and return the response
    return ChatResponse(
        response=answer,
        source=source,
        timestamp=datetime.now(timezone.utc).isoformat(),
    )
