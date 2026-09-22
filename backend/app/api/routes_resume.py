import os
import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.models.user import User
from app.models.resume import Resume, ResumeAnalysis
from app.models.skill import UserSkill
from app.schemas.resume import ResumeOut, ResumeAnalysisOut, ResumeUploadResponse
from app.services.resume_service import resume_service, SAMPLE_RESUME_TEXT
from app.api.deps import get_current_user

router = APIRouter(prefix="/resume", tags=["Resume Analyzer"])


@router.post("/upload", response_model=ResumeUploadResponse)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload a PDF resume, extract text, and run comprehensive ATS analysis."""
    # Validate file extension
    filename = file.filename or "resume.pdf"
    if not filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files (.pdf) are accepted."
        )

    # Read bytes and validate size (10 MB limit)
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resume file exceeds the maximum allowed size of 10MB."
        )

    # Save to disk
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    saved_filename = f"{current_user.id}_{uuid.uuid4().hex[:8]}_{filename}"
    file_path = os.path.join(settings.UPLOAD_DIR, saved_filename)
    with open(file_path, "wb") as f:
        f.write(contents)

    # Extract text
    try:
        raw_text = resume_service.extract_text_from_pdf(contents)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to extract text from PDF: {str(e)}"
        )

    if not raw_text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not extract readable text from PDF. Please ensure the document is not an image scan."
        )

    # Analyze resume
    analysis_data = await resume_service.analyze_resume(raw_text)

    # Create Resume record
    new_resume = Resume(
        user_id=current_user.id,
        filename=filename,
        file_path=file_path,
        raw_text=raw_text
    )
    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)

    # Create ResumeAnalysis record
    new_analysis = ResumeAnalysis(
        resume_id=new_resume.id,
        score=analysis_data["score"],
        strengths=analysis_data["strengths"],
        weaknesses=analysis_data["weaknesses"],
        missing_sections=analysis_data["missing_sections"],
        detected_skills=analysis_data["detected_skills"],
        suggestions=analysis_data["suggestions"],
        ats_metrics=analysis_data["ats_metrics"],
        project_suggestions=analysis_data["project_suggestions"],
        parsed_sections=analysis_data["parsed_sections"]
    )
    db.add(new_analysis)

    # Sync detected skills into UserSkill table
    for skill_name in analysis_data["detected_skills"]:
        exists = db.query(UserSkill).filter(
            UserSkill.user_id == current_user.id,
            UserSkill.skill_name == skill_name
        ).first()
        if not exists:
            db.add(UserSkill(
                user_id=current_user.id,
                skill_name=skill_name,
                source="resume"
            ))

    db.commit()
    db.refresh(new_analysis)

    return ResumeUploadResponse(
        message="Resume uploaded and analyzed successfully.",
        resume_id=new_resume.id,
        filename=new_resume.filename,
        analysis=ResumeAnalysisOut.model_validate(new_analysis)
    )

@router.post("/sample", response_model=ResumeUploadResponse)
async def seed_sample_resume(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Seed an exemplary college student tech resume for instant testing and demonstration."""
    raw_text = SAMPLE_RESUME_TEXT.strip()
    analysis_data = await resume_service.analyze_resume(raw_text)

    new_resume = Resume(
        user_id=current_user.id,
        filename="Alex_Chen_Resume_2026.pdf",
        file_path="sample://Alex_Chen_Resume_2026.pdf",
        raw_text=raw_text
    )
    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)

    new_analysis = ResumeAnalysis(
        resume_id=new_resume.id,
        score=analysis_data["score"],
        strengths=analysis_data["strengths"],
        weaknesses=analysis_data["weaknesses"],
        missing_sections=analysis_data["missing_sections"],
        detected_skills=analysis_data["detected_skills"],
        suggestions=analysis_data["suggestions"],
        ats_metrics=analysis_data["ats_metrics"],
        project_suggestions=analysis_data["project_suggestions"],
        parsed_sections=analysis_data["parsed_sections"]
    )
    db.add(new_analysis)

    for skill_name in analysis_data["detected_skills"]:
        exists = db.query(UserSkill).filter(
            UserSkill.user_id == current_user.id,
            UserSkill.skill_name == skill_name
        ).first()
        if not exists:
            db.add(UserSkill(
                user_id=current_user.id,
                skill_name=skill_name,
                source="resume"
            ))

    db.commit()
    db.refresh(new_analysis)

    return ResumeUploadResponse(
        message="Sample student resume loaded and analyzed successfully.",
        resume_id=new_resume.id,
        filename=new_resume.filename,
        analysis=ResumeAnalysisOut.model_validate(new_analysis)
    )

@router.get("/latest", response_model=ResumeOut)
def get_latest_resume(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve current student's most recently uploaded resume and analysis."""
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.id.desc()).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No resume found. Please upload your resume first."
        )
    return resume

@router.get("/history", response_model=List[ResumeOut])
def get_resume_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve list of all uploaded resumes by student."""
    resumes = db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.id.desc()).all()
    return resumes

@router.get("/{resume_id}", response_model=ResumeOut)
def get_resume_by_id(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve specific resume analysis by ID."""
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found.")
    return resume
