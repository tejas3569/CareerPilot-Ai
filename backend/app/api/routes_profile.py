from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.profile import Profile
from app.schemas.user import ProfileOut, ProfileUpdate
from app.api.deps import get_current_user

router = APIRouter(prefix="/profile", tags=["Profile"])

@router.get("", response_model=ProfileOut)
def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current student's profile."""
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        profile = Profile(user_id=current_user.id, name="Student")
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@router.put("", response_model=ProfileOut)
def update_profile(
    payload: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update student profile details."""
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        profile = Profile(user_id=current_user.id)
        db.add(profile)

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)
    return profile
