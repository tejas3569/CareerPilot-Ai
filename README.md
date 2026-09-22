# CareerPilot AI — AI-Powered Career & Placement Copilot

> A production-quality, full-stack career acceleration platform designed for college students and recent graduates preparing for software development, AI/ML, data science, and tech placements.

---

## 🚀 1. Project Overview & Architecture

**CareerPilot AI** is an intelligent, full-stack career enablement engine built to replace guesswork in placement preparation. It combines deterministic Natural Language Processing (NLP), semantic vector embeddings, and Large Language Models (LLMs) with an enterprise-grade React dashboard.

Unlike standard mock-interview chatbots or static resume templates, CareerPilot AI implements a **closed-loop feedback system**:
1. It ingests student resumes (PDF/Text) and extracts candidate skills and structured sections using an ATS parser.
2. It semantically aligns candidate profiles against target Job Descriptions using cosine vector similarity and keyword coverage.
3. It identifies critical skill gaps and builds an actionable, 5-phase personalized learning roadmap stored in a relational database.
4. It conducts interactive, real-time mock interviews with a multi-axis rubric evaluator (accuracy, clarity, relevance, communication, completeness) and generates tailored technical questions based on the candidate's actual projects.

```
                                  ┌───────────────────────────┐
                                  │      Client Browser       │
                                  │ React 18 + TS + Tailwind  │
                                  └─────────────┬─────────────┘
                                                │ REST / Bearer JWT
                                                ▼
                                  ┌───────────────────────────┐
                                  │     FastAPI Gateway       │
                                  │  CORS • Pydantic v2 • Auth│
                                  └─────────────┬─────────────┘
                                                │
                 ┌──────────────────────────────┼─────────────────────────────┐
                 │                              │                             │
                 ▼                              ▼                             ▼
       ┌───────────────────┐          ┌───────────────────┐         ┌───────────────────┐
       │   Resume & ATS    │          │ Semantic Matcher  │         │   AI Interview    │
       │      Engine       │          │  & Skill Taxonomy │         │     Simulator     │
       │ pypdf • Sectioner │          │ 350+ Skills Vector│         │ 5-Axis Rubric Eval│
       └─────────┬─────────┘          └─────────┬─────────┘         └─────────┬─────────┘
                 │                              │                             │
                 └──────────────────────────────┼─────────────────────────────┘
                                                │
                                                ▼
                                ┌───────────────────────────────┐
                                │       AI Provider Layer       │
                                │   Google Gemini 2.5 Flash /   │
                                │  OpenAI / Local Vector Engine │
                                └───────────────┬───────────────┘
                                                │
                                                ▼
                                ┌───────────────────────────────┐
                                │   SQLAlchemy ORM Database     │
                                │ SQLite (dev) / Postgres (prod)│
                                └───────────────────────────────┘
```

---

## 🌟 2. Key Features

1. **Secure Authentication & Onboarding**:
   - Production bcrypt hashing (`bcrypt.hashpw`) with salt.
   - Cryptographically signed HS256 JWT tokens.
   - Demo Quick-Login for 1-click test evaluations without manual signup.
2. **Student Profile Center**:
   - Education details (Degree, Branch, College, Graduation Year, CGPA).
   - Target job roles & career tracks.
   - Portfolio, GitHub, and LinkedIn external profiles.
3. **ATS Resume Analyzer & Structural Scorer**:
   - Fast PDF text extraction via `pypdf` with raw text fallbacks.
   - Multi-metric ATS scoring formula (Contact, Summary, Experience, Education, Skills, Projects, Quantifiable Metrics).
   - Instant categorization of Strengths, Critical Weaknesses, and Formatting Flags.
4. **Semantic Job Description Matcher**:
   - Hybrid matching algorithm: 55% Semantic Vector Cosine Similarity + 45% Exact/Alias Keyword Coverage.
   - Instant pre-loaded job templates (Frontend Engineer, ML Engineer, Backend Developer, Full Stack Intern).
   - Direct breakdown of matching skills, missing skills, and recommended focus areas.
5. **Skill Gap Discovery Engine**:
   - 350+ industry skills taxonomy across 9 engineering domains.
   - Visual workflow: **Current Verified Skills ➔ Target Role ➔ Missing Skill Gaps ➔ Actionable Roadmap**.
   - One-click skill addition and deletion.
6. **5-Phase Personalized Learning Roadmap**:
   - Structured milestones: *Phase 1: Foundations*, *Phase 2: Core Engineering*, *Phase 3: Advanced Concepts*, *Phase 4: Capstone Projects*, *Phase 5: Interview Prep & Mock Drills*.
   - Each item includes: Priority, Difficulty, Estimated Hours, Prerequisites, and Project Ideas.
   - Live status toggling (`not_started` ➔ `in_progress` ➔ `completed`) persisted in the database with celebratory confetti effects.
7. **Interactive AI Mock Interview Arena**:
   - Dynamic question sequencing customized to target roles and student resumes.
   - Realistic answer submission with timer tracking.
   - 5-Axis Rubric Evaluation: **Technical Accuracy (0-100)**, **Relevance (0-100)**, **Clarity (0-100)**, **Communication (0-100)**, and **Completeness (0-100)**.
   - Generates constructive strengths, actionable improvements, an idealized model answer, and an intelligent follow-up question.
8. **Targeted Technical Question Bank**:
   - Generates role-specific questions categorized by Technical, System Design, Behavioral, and Resume-Project inquiries.
   - Includes difficulty markers, sample model responses, and core concepts tested.
9. **Interactive Dashboard & Progress Tracker**:
   - Real-time score rings for ATS Readiness, Job Match %, and Interview Mastery.
   - Daily streak tracking and preparation action items.
   - Activity stream summarizing recent resume scans, job matches, and interview sessions.
10. **Historical Audit & Analysis Archive**:
    - Complete persistence of all previous resume analyses, job match reports, and mock interviews.
    - Inspect past scores and track progress over time.

---

## 🛠️ 3. Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript (`@types/react`, `@types/react-dom`)
- **Build Tool**: Vite 6 / Vite 8 with ES2023 target
- **Styling**: Tailwind CSS v4 with custom dark/light theme tokens and PostCSS
- **Icons**: Lucide React (featherweight SVG icons)
- **Networking**: Axios with request/response interceptors for Bearer JWT injection
- **Effects**: Canvas Confetti for milestone completions

### Backend
- **Framework**: Python 3.14 / 3.11+ FastAPI
- **Data Validation**: Pydantic v2 with `BaseSettings` and `SettingsConfigDict`
- **Security**: `bcrypt` (password hashing) + `PyJWT` (JSON Web Tokens)
- **Database ORM**: SQLAlchemy 2.0 (Declarative Base with SQLite / PostgreSQL)
- **Document Parsing**: `pypdf` for high-throughput PDF parsing
- **Testing**: `pytest`, `pytest-asyncio`, `httpx`

### AI / ML & Semantic Search
- **Primary LLM**: Google Gemini 2.5 Flash (`google-genai` official SDK)
- **Secondary LLM**: OpenAI GPT-4o / GPT-4o-mini (`openai` SDK)
- **Embeddings**: Google `text-embedding-004` / OpenAI `text-embedding-3-small`
- **Fallback / Offline Engine**: Built-in 256-dimensional subword and TF-IDF vectorizer with cosine similarity matrix for zero-key local evaluation.

---

## 📂 4. Project Folder Structure

```
careerpilot-ai/
├── README.md                           # Comprehensive documentation
├── backend/
│   ├── run.py                          # Local server launcher
│   ├── requirements.txt                # Python dependencies
│   ├── .env.example                    # Sample backend environment configuration
│   ├── .env                            # Active backend environment variables
│   ├── careerpilot.db                  # Local SQLite database (auto-generated)
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                     # FastAPI application entry & middleware
│   │   ├── config.py                   # Pydantic v2 Settings & environment loader
│   │   ├── database.py                 # SQLAlchemy session engine & Base
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── deps.py                 # JWT authentication & DB session dependencies
│   │   │   ├── routes_auth.py          # /api/auth (register, login, me)
│   │   │   ├── routes_profile.py       # /api/profile (view, update)
│   │   │   ├── routes_resume.py        # /api/resume (upload, parse, score)
│   │   │   ├── routes_jobs.py          # /api/jobs (match, templates)
│   │   │   ├── routes_skills.py        # /api/skills (taxonomy, gaps)
│   │   │   ├── routes_roadmap.py       # /api/roadmap (generate, update status)
│   │   │   ├── routes_interview.py     # /api/interview (session, submit, questions)
│   │   │   └── routes_dashboard.py     # /api/dashboard (stats, trends, streaks)
│   │   ├── models/                     # SQLAlchemy DB tables
│   │   │   ├── user.py
│   │   │   ├── profile.py
│   │   │   ├── resume.py
│   │   │   ├── job_match.py
│   │   │   ├── skill.py
│   │   │   ├── roadmap.py
│   │   │   └── interview.py
│   │   ├── schemas/                    # Pydantic input/output schemas
│   │   │   ├── auth.py
│   │   │   ├── profile.py
│   │   │   ├── resume.py
│   │   │   ├── job.py
│   │   │   ├── skill.py
│   │   │   ├── roadmap.py
│   │   │   ├── interview.py
│   │   │   └── dashboard.py
│   │   ├── services/                   # Core business logic & AI integration
│   │   │   ├── ai_service.py           # Unified LLM provider (Gemini/OpenAI/Offline)
│   │   │   ├── embedding_service.py    # Vector generation & Cosine similarity
│   │   │   ├── resume_service.py       # PDF parsing & 0-100 ATS evaluation
│   │   │   ├── job_service.py          # Semantic & keyword hybrid matcher
│   │   │   ├── roadmap_service.py      # 5-phase career progression paths
│   │   │   └── interview_service.py    # 5-axis rubric interview grader
│   │   └── utils/
│   │       ├── security.py             # Bcrypt hashing & PyJWT encode/decode
│   │       └── text_processing.py      # 350+ skills taxonomy & regex extractors
│   └── tests/
│       ├── conftest.py                 # Pytest fixtures & in-memory DB configuration
│       ├── test_auth.py                # Authentication & token verification tests
│       └── test_resume_and_match.py    # ATS scoring & Job match integration tests
└── frontend/
    ├── package.json                    # Node dependencies & scripts
    ├── tsconfig.json                   # Root TypeScript config
    ├── tsconfig.app.json               # Application compiler options
    ├── vite.config.ts                  # Vite config with /api reverse proxy
    ├── tailwind.config.js              # Theme extensions & colors
    ├── postcss.config.js               # PostCSS Tailwind v4 pipeline
    ├── index.html                      # HTML entrypoint
    ├── src/
    │   ├── main.tsx                    # React DOM mount point
    │   ├── App.tsx                     # Top-level router & state management
    │   ├── index.css                   # Tailwind directives & custom CSS
    │   ├── types/
    │   │   └── index.ts                # TypeScript types & API contracts
    │   ├── context/
    │   │   └── AuthContext.tsx         # Session context & quick-login handler
    │   ├── api/
    │   │   ├── client.ts               # Axios instance with Bearer interceptors
    │   │   └── endpoints.ts            # Type-safe API endpoints
    │   ├── components/
    │   │   ├── common/                 # Button, Card, Badge, Modal, ScoreRing, etc.
    │   │   └── layout/                 # Navbar, Sidebar, AppLayout
    │   └── pages/                      # 11 Dedicated views
    │       ├── LandingPage.tsx
    │       ├── LoginPage.tsx
    │       ├── RegisterPage.tsx
    │       ├── ForgotPasswordPage.tsx
    │       ├── DashboardPage.tsx
    │       ├── ResumeAnalyzerPage.tsx
    │       ├── JobMatchPage.tsx
    │       ├── SkillGapPage.tsx
    │       ├── LearningRoadmapPage.tsx
    │       ├── InterviewSimulatorPage.tsx
    │       ├── QuestionGeneratorPage.tsx
    │       ├── ProfilePage.tsx
    │       └── HistoryPage.tsx
```

---

## ⚙️ 5. Prerequisites & Environment Setup

- **Python**: Version 3.10 to 3.14
- **Node.js**: Version 18.x, 20.x, or 22.x (with `npm`)
- **Git**: For version control

---

## 🐍 6. Backend Installation & Run Guide

### 1. Navigate to the backend directory:
```bash
cd backend
```

### 2. Create and activate a virtual environment (recommended):
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

### 4. Configure environment variables:
Copy the example environment file:
```bash
cp .env.example .env
```

### 5. Launch the backend server:
```bash
python run.py
```
Or with Uvicorn directly:
```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

The backend will start at `http://127.0.0.1:8000`.
- **Interactive Swagger Docs**: `http://127.0.0.1:8000/docs`
- **ReDoc Documentation**: `http://127.0.0.1:8000/redoc`
- **Health Check**: `http://127.0.0.1:8000/health`

---

## 💻 7. Frontend Installation & Run Guide

### 1. Navigate to the frontend directory:
```bash
cd frontend
```

### 2. Install Node dependencies:
```bash
npm install
```

### 3. Run the development server:
```bash
npm run dev
```
The Vite development server will start at `http://localhost:5173`.
All requests to `/api` are automatically proxied to the backend at `http://127.0.0.1:8000`.

### 4. Build for production:
```bash
npm run build
```
Creates an optimized production bundle in `frontend/dist/`.

---

## 🧠 8. AI & LLM Configuration

CareerPilot AI is designed with an **adaptive, multi-tiered AI architecture**:

| Mode | Trigger | Description |
| :--- | :--- | :--- |
| **Google Gemini (Default)** | `GEMINI_API_KEY` set in `.env` | Uses `gemini-2.5-flash` for contextual analysis and `text-embedding-004` for high-dimension embeddings. |
| **OpenAI** | `LLM_PROVIDER=openai` + `OPENAI_API_KEY` | Uses `gpt-4o-mini` or `gpt-4o` with `text-embedding-3-small`. |
| **Offline / Demo Mode** | No API keys set (`DEMO_MODE=True`) | Uses an internal 256-dimensional subword & TF-IDF vectorizer and deterministic NLP heuristics. **Zero API keys required to test all features.** |

### Sample `.env` Configuration
```ini
PROJECT_NAME="CareerPilot AI"
DATABASE_URL="sqlite:///./careerpilot.db"
JWT_SECRET="your_custom_jwt_secret_key_here_minimum_32_characters"
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# AI Provider ("gemini" | "openai" | "demo")
LLM_PROVIDER="gemini"
GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"
LLM_MODEL="gemini-2.5-flash"
EMBEDDING_MODEL="text-embedding-004"
DEMO_MODE=False
```

---

## 🗄️ 9. Database Setup & Architecture

- **Default Engine**: SQLite (`sqlite:///./careerpilot.db`). Tables are created automatically on startup.
- **Production Engine**: PostgreSQL. To use PostgreSQL:
  1. Install psycopg2: `pip install psycopg2-binary`
  2. Set `DATABASE_URL` in `.env`:
     ```ini
     DATABASE_URL="postgresql://user:password@localhost:5432/careerpilot"
     ```
  3. Start the application. SQLAlchemy auto-initializes all tables and relational foreign keys.

---

## 🧪 10. Testing Suite Guide

### Running Backend Tests:
```bash
cd backend
pytest -v
```
The test suite validates:
- User registration, password hashing, and token issuance.
- Authenticated user profile retrieval.
- ATS scoring and skill extraction from sample resumes.
- Semantic vector similarity and job match calculation.
- 5-axis interview answer grading.

### Running Frontend Typecheck & Build:
```bash
cd frontend
npm run build
```

---

## 🚢 11. Production Deployment

### Option A: Docker Compose (Unified Deployment)
Create a `docker-compose.yml`:
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=sqlite:///./careerpilot.db
      - JWT_SECRET=production_secret_key_9988776655
      - LLM_PROVIDER=gemini
      - GEMINI_API_KEY=${GEMINI_API_KEY}
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
```

### Option B: Cloud Platforms
- **Backend**: Deploy to **Google Cloud Run**, **Render**, or **Railway** as a Python FastAPI web service using `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
- **Frontend**: Deploy the `frontend/dist` folder to **Vercel**, **Netlify**, or **Firebase Hosting**. Set `VITE_API_URL` to your production backend endpoint.

---

## 🔮 12. Future Enhancements

1. **Voice AI Mock Interviews**: Integrate Gemini Live API or WebRTC for natural, low-latency spoken conversations.
2. **GitHub Repository Deep Scan**: Automatically extract verified skills and commit patterns directly from student GitHub accounts.
3. **Company-Specific Placement Packs**: Curated question banks and evaluation criteria for FAANG and top-tier tech firms.
4. **Automated ATS Tailoring**: One-click resume bullet point optimizer aligned with targeted job postings.

---

## 📄 License
MIT License. Built for students worldwide to accelerate their career preparation.
