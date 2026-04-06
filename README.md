# 🎓 AI College Helpdesk / Study Assistant Chatbot

A WhatsApp-style chatbot where students ask questions and get instant answers about exams, subjects, and college timings. The bot uses **Google Gemini AI** if an API key is available, otherwise falls back to keyword-based responses. All conversations are saved to a **Supabase** database.

**Tech Stack:** React (Vite) + Tailwind CSS | Python + FastAPI | Google Gemini AI | Supabase

---

## Setup Instructions

### Step 1 — Enter the project

```bash
cd college-helpdesk
```

### Step 2 — Backend setup

```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate

# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Now open .env and fill in your keys (see Step 5 & 6)
```

### Step 3 — Run the backend

```bash
uvicorn main:app --reload --port 8000
# You should see: Uvicorn running on http://127.0.0.1:8000
# Test it: open http://localhost:8000 in your browser
```

### Step 4 — Frontend setup (open a NEW terminal)

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:5173 in your browser
```

### Step 5 — Supabase Setup (Database)

> ⚠️ This must be done manually in your browser:

1. Go to **https://supabase.com** → Sign up / Log in
2. Click **"New Project"** → Give it a name like `college-helpdesk` → Set a database password → Click **Create**
3. Wait ~2 minutes for the project to be ready
4. Go to **SQL Editor** (left sidebar) → Click **"New Query"**
5. Paste and run this SQL:

```sql
CREATE TABLE chat_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  question text NOT NULL,
  response text NOT NULL,
  source text DEFAULT 'fallback',
  timestamp timestamptz DEFAULT now()
);
```

6. Go to **Project Settings → API**
7. Copy **Project URL** → paste as `SUPABASE_URL` in your `.env`
8. Copy **service_role** key (under "Project API keys") → paste as `SUPABASE_SERVICE_KEY` in your `.env`

### Step 6 — Gemini API Key (Optional — app works without it)

> ⚠️ This must be done manually:

1. Go to **https://aistudio.google.com/apikey** → Sign in with Google
2. Click **"Create API Key"**
3. Copy the key → paste as `GEMINI_API_KEY` in your `.env`
4. If you skip this, the app uses keyword fallback responses automatically ✅

---

## Environment Variables Reference

| Variable | Where to get it | Required? |
|---|---|---|
| `GEMINI_API_KEY` | aistudio.google.com/apikey | No — fallback works without it |
| `SUPABASE_URL` | Supabase → Settings → API | No — app works without DB |
| `SUPABASE_SERVICE_KEY` | Supabase → Settings → API → service_role | No — app works without DB |

---

## How It Works

```
Student types question
       ↓
Frontend (React) sends POST /api/chat
       ↓
Backend checks for GEMINI_API_KEY
       ↓ yes                    ↓ no
Gemini AI answers        Keyword fallback answers
       ↓                        ↓
Response saved to Supabase chat_logs table
       ↓
Frontend displays reply in WhatsApp-style bubble
```

---

## Project Structure

```
college-helpdesk/
├── backend/
│   ├── main.py              # FastAPI server entry point
│   ├── models.py            # Pydantic request/response models
│   ├── supabase_client.py   # Supabase database integration
│   ├── routes/
│   │   ├── __init__.py
│   │   └── chat.py          # Chat endpoint + Gemini AI + fallback logic
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx          # React entry point
│       ├── App.jsx           # Root component
│       ├── index.css         # Tailwind + custom bubble styles
│       └── components/
│           └── Chat.jsx      # WhatsApp-style chat UI
└── README.md
```
