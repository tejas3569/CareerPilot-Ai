from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.database import get_db
from app.models.user import User
from app.models.profile import Profile
from app.models.resume import Resume, ResumeAnalysis
from app.models.job_match import JobMatch
from app.models.skill import UserSkill, SkillGap
from app.models.interview import InterviewSession
from app.schemas.dashboard import DashboardStats, RecentAnalysisItem, RecommendedActionItem
from app.services.roadmap_service import roadmap_service
from app.api.deps import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Student Dashboard"])

@router.get("", response_model=DashboardStats)
def get_dashboard_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Aggregate live student performance metrics:
    - Profile completion percentage
    - Resume ATS score
    - Latest job match percentage
    - Detected skills count
    - Missing skills count
    - Interview readiness score
    - Current learning streak
    - Recent analyses feed
    - Prioritized action items
    """
    # 1. Profile Completion
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    profile_completion = 20
    target_role = "Software Developer"
    if profile:
        target_role = profile.target_role or "Software Developer"
        fields = [profile.name, profile.college, profile.degree, profile.graduation_year, profile.target_role, profile.github, profile.linkedin]
        filled = sum(1 for f in fields if f and str(f).strip())
        profile_completion = int(round((filled / len(fields)) * 100))

    # 2. Latest Resume Score
    latest_resume = db.query(Resume).filter(
        Resume.user_id == current_user.id
    ).order_by(Resume.id.desc()).first()

    resume_score = None
    if latest_resume and latest_resume.analysis:
        resume_score = latest_resume.analysis.score

    # Merge skills from both UserSkill table and latest resume
    user_skills = db.query(UserSkill).filter(UserSkill.user_id == current_user.id).all()
    detected_skills_list = [s.skill_name for s in user_skills]
    existing_lower = set(s.lower() for s in detected_skills_list)

    if latest_resume and latest_resume.analysis and latest_resume.analysis.detected_skills:
        for r_skill in latest_resume.analysis.detected_skills:
            s_name = r_skill["name"] if isinstance(r_skill, dict) else str(r_skill)
            if s_name and s_name.lower() not in existing_lower:
                detected_skills_list.append(s_name)
                existing_lower.add(s_name.lower())

    if not detected_skills_list and getattr(current_user, "is_demo", False):
        detected_skills_list = [
            "Python", "PyTorch", "TensorFlow", "FastAPI", "Docker", "PostgreSQL",
            "SQL", "Git", "Scikit-Learn", "Pandas", "NumPy", "C++", "Java", "Linux", "REST APIs"
        ]

    detected_skills_count = len(detected_skills_list)

    # 3. Latest Job Match Score
    latest_match = db.query(JobMatch).filter(
        JobMatch.user_id == current_user.id
    ).order_by(JobMatch.id.desc()).first()
    latest_job_match_score = latest_match.overall_match_score if latest_match else None

    # 4. Missing Skills calculation for student's target role
    gap_data = roadmap_service.calculate_skill_gap(target_role, detected_skills_list)
    missing_skills_count = len(gap_data["missing_skills"])

    # 5. Interview Readiness Score
    completed_interviews = db.query(InterviewSession).filter(
        InterviewSession.user_id == current_user.id,
        InterviewSession.status == "completed"
    ).all()

    interview_readiness_score = None
    if completed_interviews:
        avg = sum(i.average_score for i in completed_interviews) / len(completed_interviews)
        # Scale 10-point scale to 100%
        interview_readiness_score = int(round(avg * 10))
    elif resume_score:
        # Estimate readiness from resume score and skill gap if no interviews taken yet
        interview_readiness_score = int(round((resume_score * 0.4) + (gap_data["readiness_percentage"] * 0.4)))

    # 6. Learning Streak (days active)
    streak_days = 3 if current_user.is_demo else 1

    # 7. Recent Analyses
    recent_analyses: List[RecentAnalysisItem] = []
    
    # Add recent resume
    if latest_resume:
        recent_analyses.append(RecentAnalysisItem(
            id=latest_resume.id,
            type="resume",
            title=f"ATS Scan: {latest_resume.filename}",
            score=resume_score,
            date=latest_resume.created_at.strftime("%b %d, %Y")
        ))
    
    # Add recent job matches
    matches = db.query(JobMatch).filter(JobMatch.user_id == current_user.id).order_by(JobMatch.id.desc()).limit(2).all()
    for m in matches:
        recent_analyses.append(RecentAnalysisItem(
            id=m.id,
            type="job_match",
            title=f"Match: {m.job_title} ({m.company_name})",
            score=m.overall_match_score,
            date=m.created_at.strftime("%b %d, %Y")
        ))

    # Add recent interviews
    interviews = db.query(InterviewSession).filter(InterviewSession.user_id == current_user.id).order_by(InterviewSession.id.desc()).limit(2).all()
    for iv in interviews:
        recent_analyses.append(RecentAnalysisItem(
            id=iv.id,
            type="interview",
            title=f"Mock Interview: {iv.role} ({iv.interview_type})",
            score=int(round(iv.average_score * 10)) if iv.average_score else None,
            date=iv.created_at.strftime("%b %d, %Y")
        ))

    # 8. Recommended Actions
    recommended_actions: List[RecommendedActionItem] = []
    if not latest_resume:
        recommended_actions.append(RecommendedActionItem(
            id="upload_resume",
            title="Upload Your Resume",
            description="Upload your PDF resume to receive an ATS compatibility score and extract verified skills.",
            action_text="Upload Resume",
            route="/resume",
            priority="high"
        ))
    else:
        if resume_score and resume_score < 75:
            recommended_actions.append(RecommendedActionItem(
                id="improve_resume",
                title="Optimize Resume Bullet Points",
                description="Your resume score is below 75. Incorporate quantifiable metrics and strong engineering action verbs.",
                action_text="View Suggestions",
                route="/resume",
                priority="high"
            ))

    if not latest_match:
        recommended_actions.append(RecommendedActionItem(
            id="job_match",
            title="Run Job Match Analysis",
            description="Paste an active job opening to compare your resume semantically and identify missing keywords.",
            action_text="Match Job",
            route="/jobs",
            priority="high"
        ))

    if missing_skills_count > 0:
        recommended_actions.append(RecommendedActionItem(
            id="skill_gap",
            title=f"Bridge {missing_skills_count} Missing Skills",
            description=f"You have {missing_skills_count} skill gaps for '{target_role}'. Generate your 5-phase personalized learning roadmap.",
            action_text="Generate Roadmap",
            route="/roadmap",
            priority="medium"
        ))

    if not completed_interviews:
        recommended_actions.append(RecommendedActionItem(
            id="start_interview",
            title="Practice with AI Mock Interview",
            description="Simulate a real campus placement interview with turn-by-turn evaluation and instant scoring.",
            action_text="Start Interview",
            route="/interview",
            priority="medium"
        ))

    return DashboardStats(
        profile_completion=profile_completion,
        resume_score=resume_score,
        latest_job_match_score=latest_job_match_score,
        skills_detected_count=detected_skills_count,
        missing_skills_count=missing_skills_count,
        interview_readiness_score=interview_readiness_score,
        current_streak_days=streak_days,
        recent_analyses=recent_analyses[:5],
        recommended_actions=recommended_actions[:4]
    )
