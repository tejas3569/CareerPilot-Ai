from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.resume import Resume
from app.models.job_match import JobDescription, JobMatch
from app.schemas.job import JobMatchRequest, JobMatchOut
from app.services.job_service import job_service
from app.api.deps import get_current_user

router = APIRouter(prefix="/jobs", tags=["Job Match Analyzer"])

SAMPLE_JOB_DESCRIPTIONS = [
    {
        "id": "aiml-intern",
        "title": "AI/ML Engineer Intern",
        "company": "Anthropic AI Innovations",
        "description": """About the Role:
We are seeking an ambitious AI/ML Engineer Intern to build, evaluate, and deploy next-generation foundation model tools. You will work alongside researchers and platform engineers to design scalable inference endpoints and fine-tuning pipelines.

Responsibilities:
• Implement and fine-tune Transformer architectures and deep learning models using PyTorch.
• Build low-latency REST and streaming API endpoints in Python using FastAPI.
• Containerize machine learning services using Docker and orchestrate on Kubernetes / AWS ECS.
• Analyze dataset feature distributions using Pandas, NumPy, and Scikit-Learn.
• Monitor model drift and performance metrics with Prometheus and Grafana.

Qualifications:
• Pursuing a degree in Computer Science, AI, Data Science, or related engineering discipline.
• Strong programming skills in Python with hands-on knowledge of PyTorch or TensorFlow.
• Experience with relational databases like PostgreSQL and vector databases (e.g. Chroma, Pinecone).
• Familiarity with Docker, Git, and Linux environments.
• Demonstrated passion through GitHub projects or open-source contributions."""
    },
    {
        "id": "swe-newgrad",
        "title": "Software Developer — Full Stack",
        "company": "Stripe Payments Platform",
        "description": """About the Role:
We are hiring Software Engineers to craft reliable, high-performance financial infrastructure. You will design, build, and deploy robust APIs and interactive user interfaces used by millions of businesses globally.

Key Responsibilities:
• Build resilient distributed services in Python, Java, or Go.
• Design schema migrations and optimize relational queries on PostgreSQL and Redis.
• Collaborate on responsive web interfaces using TypeScript, React, and Tailwind CSS.
• Write comprehensive automated unit and integration tests using pytest or Jest.
• Participate in code reviews, architectural discussions, and CI/CD automation via GitHub Actions.

Requirements:
• Solid understanding of computer science fundamentals, data structures, algorithms, and system design.
• Hands-on experience building RESTful APIs or web services.
• Experience with SQL database design, transactions, and indexing.
• Familiarity with containerization (Docker) and cloud services (AWS or GCP).
• Excellent communication skills and a team-first mindset."""
    },
    {
        "id": "data-analyst",
        "title": "Data Analyst / BI Specialist",
        "company": "Spotify Media Intelligence",
        "description": """About the Role:
Spotify is looking for a Data Analyst to transform complex user engagement datasets into actionable strategic insights. You will partner with product managers and engineers to measure feature launches and optimize content recommendations.

Responsibilities:
• Author high-performance analytical SQL queries across petabyte-scale data lakes using window functions and CTEs.
• Clean, transform, and model time-series data using Python and Pandas.
• Design executive dashboards and KPI scorecards in Tableau or Power BI.
• Plan, execute, and analyze A/B tests with rigorous statistical hypothesis testing.
• Automate scheduled ETL reporting workflows using Python scripts and cloud tools.

Qualifications:
• Strong proficiency in SQL and relational database concepts.
• Experience with Python data analysis libraries (NumPy, Pandas, Seaborn, Matplotlib).
• Proven track record creating clear data visualizations for non-technical stakeholders.
• Understanding of probability, confidence intervals, and statistical significance."""
    }
]

@router.get("/samples")
def get_sample_jobs():
    """Retrieve curated real-world job descriptions for one-click testing."""
    return SAMPLE_JOB_DESCRIPTIONS

@router.post("/analyze", response_model=JobMatchOut)
async def analyze_job_match(
    payload: JobMatchRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Compare student resume against job description:
    Computes semantic vector similarity and skill overlap,
    highlighting matching, missing, and recommended skills.
    """
    if not payload.job_description.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job description text is required."
        )

    # Get target resume
    if payload.resume_id:
        resume = db.query(Resume).filter(
            Resume.id == payload.resume_id,
            Resume.user_id == current_user.id
        ).first()
    else:
        resume = db.query(Resume).filter(
            Resume.user_id == current_user.id
        ).order_by(Resume.id.desc()).first()

    if not resume:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No resume found on file. Please upload your resume first or load a sample resume."
        )

    # Extract resume skills and projects from analysis
    resume_skills = []
    resume_projects = []
    if resume.analysis:
        resume_skills = resume.analysis.detected_skills or []
        parsed = resume.analysis.parsed_sections or {}
        resume_projects = parsed.get("projects", [])

    # Calculate match
    match_result = await job_service.match_resume_to_job(
        resume_text=resume.raw_text,
        job_text=payload.job_description,
        job_title=payload.job_title or "Target Role",
        company_name=payload.company_name or "Company",
        resume_skills=resume_skills,
        resume_projects=resume_projects
    )

    # Save JobDescription
    job_desc = JobDescription(
        title=payload.job_title or "Target Role",
        company=payload.company_name or "Company",
        raw_text=payload.job_description,
        extracted_skills=match_result["required_skills"]
    )
    db.add(job_desc)
    db.commit()
    db.refresh(job_desc)

    # Save JobMatch record
    new_match = JobMatch(
        user_id=current_user.id,
        resume_id=resume.id,
        job_description_id=job_desc.id,
        job_title=match_result["job_title"],
        company_name=match_result["company_name"],
        job_text=payload.job_description,
        overall_match_score=match_result["overall_match_score"],
        semantic_score=match_result["semantic_score"],
        keyword_score=match_result["keyword_score"],
        matching_skills=match_result["matching_skills"],
        missing_skills=match_result["missing_skills"],
        recommended_skills=match_result["recommended_skills"],
        relevant_projects=match_result["relevant_projects"],
        recommendations=match_result["recommendations"]
    )
    db.add(new_match)
    db.commit()
    db.refresh(new_match)

    return new_match

@router.get("/history", response_model=List[JobMatchOut])
def get_job_match_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve history of all job matches analyzed by student."""
    matches = db.query(JobMatch).filter(
        JobMatch.user_id == current_user.id
    ).order_by(JobMatch.id.desc()).all()
    return matches

@router.get("/{match_id}", response_model=JobMatchOut)
def get_job_match_by_id(
    match_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve specific job match by ID."""
    match = db.query(JobMatch).filter(
        JobMatch.id == match_id,
        JobMatch.user_id == current_user.id
    ).first()
    if not match:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job match not found.")
    return match
