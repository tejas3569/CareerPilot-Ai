from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
import app.models  # Ensure all SQLAlchemy models are registered
from app.api import (
    routes_auth,
    routes_profile,
    routes_resume,
    routes_jobs,
    routes_skills,
    routes_roadmap,
    routes_interview,
    routes_dashboard,
    routes_chat
)

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Production-quality career platform for students: Resume ATS Analyzer, Semantic Job Match, Skill Gaps, Roadmaps, and AI Mock Interviews.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(routes_auth.router, prefix=settings.API_V1_STR)
app.include_router(routes_profile.router, prefix=settings.API_V1_STR)
app.include_router(routes_resume.router, prefix=settings.API_V1_STR)
app.include_router(routes_jobs.router, prefix=settings.API_V1_STR)
app.include_router(routes_skills.router, prefix=settings.API_V1_STR)
app.include_router(routes_roadmap.router, prefix=settings.API_V1_STR)
app.include_router(routes_interview.router, prefix=settings.API_V1_STR)
app.include_router(routes_dashboard.router, prefix=settings.API_V1_STR)
app.include_router(routes_chat.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "name": settings.PROJECT_NAME,
        "status": "online",
        "version": "1.0.0",
        "docs": "/docs",
        "demo_mode": settings.DEMO_MODE,
        "llm_provider": settings.LLM_PROVIDER
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
