from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

class SkillGapRequest(BaseModel):
    target_role: str

class SkillGapOut(BaseModel):
    id: Optional[int] = None
    target_role: str
    current_skills: List[str]
    missing_skills: List[str]
    role_required_skills: List[str]
    readiness_percentage: float
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class UserSkillCreate(BaseModel):
    skill_name: str
    category: Optional[str] = "Technical"

class UserSkillOut(BaseModel):
    id: int
    skill_name: str
    category: str
    source: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
