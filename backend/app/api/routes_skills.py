from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.skill import UserSkill, SkillGap
from app.models.resume import Resume
from app.schemas.skill import SkillGapRequest, SkillGapOut, UserSkillCreate, UserSkillOut
from app.services.roadmap_service import roadmap_service, ROLE_SKILL_PROFILES
from app.utils.text_processing import SKILLS_TAXONOMY
from app.api.deps import get_current_user

router = APIRouter(prefix="/skills", tags=["Skill Gap Analyzer"])

@router.get("/taxonomy")
def get_skills_taxonomy():
    """Retrieve categorized skill taxonomy and available target role benchmarks."""
    return {
        "categories": SKILLS_TAXONOMY,
        "available_roles": list(ROLE_SKILL_PROFILES.keys())
    }

@router.get("", response_model=List[UserSkillOut])
def get_user_skills(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve all skills associated with current student."""
    skills = db.query(UserSkill).filter(UserSkill.user_id == current_user.id).order_by(UserSkill.skill_name.asc()).all()
    return skills

@router.post("", response_model=UserSkillOut, status_code=status.HTTP_201_CREATED)
def add_user_skill(
    payload: UserSkillCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Manually add a skill to student's verified skills list."""
    clean_name = payload.skill_name.strip()
    if not clean_name:
        raise HTTPException(status_code=400, detail="Skill name cannot be empty.")

    exists = db.query(UserSkill).filter(
        UserSkill.user_id == current_user.id,
        UserSkill.skill_name.ilike(clean_name)
    ).first()
    if exists:
        return exists

    new_skill = UserSkill(
        user_id=current_user.id,
        skill_name=clean_name,
        category=payload.category or "Technical",
        source="manual"
    )
    db.add(new_skill)
    db.commit()
    db.refresh(new_skill)
    return new_skill

@router.delete("/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_skill(
    skill_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove a skill from student's profile."""
    skill = db.query(UserSkill).filter(
        UserSkill.id == skill_id,
        UserSkill.user_id == current_user.id
    ).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found.")
    db.delete(skill)
    db.commit()

@router.post("/analyze", response_model=SkillGapOut)
def analyze_skill_gap(
    payload: SkillGapRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Analyze skill gap for selected target role:
    Current Skills -> Target Role -> Missing Skills -> Readiness %
    """
    # Collect all user skills from UserSkill table and latest resume
    user_skills_records = db.query(UserSkill).filter(UserSkill.user_id == current_user.id).all()
    current_skills = [s.skill_name for s in user_skills_records]

    # If empty, check latest resume
    if not current_skills:
        latest_resume = db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.id.desc()).first()
        if latest_resume and latest_resume.analysis:
            current_skills = latest_resume.analysis.detected_skills or []

    gap_data = roadmap_service.calculate_skill_gap(
        target_role=payload.target_role,
        current_skills=current_skills
    )

    # Save or update SkillGap record
    existing_gap = db.query(SkillGap).filter(
        SkillGap.user_id == current_user.id,
        SkillGap.target_role == payload.target_role
    ).first()

    if not existing_gap:
        existing_gap = SkillGap(
            user_id=current_user.id,
            target_role=payload.target_role,
            current_skills=gap_data["current_skills"],
            missing_skills=gap_data["missing_skills"],
            role_required_skills=gap_data["role_required_skills"],
            readiness_percentage=gap_data["readiness_percentage"]
        )
        db.add(existing_gap)
    else:
        existing_gap.current_skills = gap_data["current_skills"]
        existing_gap.missing_skills = gap_data["missing_skills"]
        existing_gap.role_required_skills = gap_data["role_required_skills"]
        existing_gap.readiness_percentage = gap_data["readiness_percentage"]

    db.commit()
    db.refresh(existing_gap)

    return existing_gap
