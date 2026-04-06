# supabase_client.py — Handles saving chat logs to the Supabase database
# Supabase is a cloud database (like Firebase but with PostgreSQL).
# We use its REST API to insert rows into the "chat_logs" table.

import os
import httpx
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Read Supabase credentials from environment
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")


async def save_chat_log(question: str, response: str, source: str) -> bool:
    """
    Save a chat interaction to the Supabase 'chat_logs' table.
    
    Parameters:
        question — what the student asked
        response — what the bot answered
        source   — "gemini" or "fallback"
    
    Returns:
        True if saved successfully, False otherwise.
    
    NOTE: If Supabase keys are not set, the app still works — 
          it just won't save to the database.
    """

    # If Supabase is not configured, skip saving (app still works!)
    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        print("⚠️  Supabase not configured — skipping database save.")
        print("   Set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env to enable logging.")
        return False

    try:
        # Build the REST API URL for the chat_logs table
        url = f"{SUPABASE_URL}/rest/v1/chat_logs"

        # These headers authenticate us with Supabase
        headers = {
            "apikey": SUPABASE_SERVICE_KEY,
            "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
            "Content-Type": "application/json",
        }

        # The data we want to insert as a new row
        payload = {
            "question": question,
            "response": response,
            "source": source,
        }

        # Send the POST request to Supabase
        async with httpx.AsyncClient() as client:
            result = await client.post(url, json=payload, headers=headers)

            if result.status_code in (200, 201):
                print(f"✅ Chat saved to Supabase (source: {source})")
                return True
            else:
                print(f"❌ Supabase returned status {result.status_code}: {result.text}")
                return False

    except Exception as e:
        # If anything goes wrong, print the error but don't crash the app
        print(f"❌ Error saving to Supabase: {e}")
        return False
