# models.py — Pydantic models for request/response validation
# Pydantic ensures that incoming data has the right shape and types.
# Think of these like "forms" that the API expects to receive or send back.

from pydantic import BaseModel
from typing import Optional


class ChatRequest(BaseModel):
    """
    What the frontend sends to the backend.
    - message: the student's question (e.g., "When are exams?")
    """
    message: str


class ChatResponse(BaseModel):
    """
    What the backend sends back to the frontend.
    - response: the answer text
    - source: where the answer came from — "gemini" (AI) or "fallback" (keyword rules)
    - timestamp: when the response was generated (ISO format string)
    """
    response: str
    source: str = "fallback"
    timestamp: Optional[str] = None
