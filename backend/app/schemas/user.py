from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime

class ProfileBase(BaseModel):
    name: Optional[str] = ""
    college: Optional[str] = ""
    degree: Optional[str] = ""
    graduation_year: Optional[str] = ""
    target_role: Optional[str] = "Software Developer"
    bio: Optional[str] = ""
    github: Optional[str] = ""
    linkedin: Optional[str] = ""
    portfolio: Optional[str] = ""

class ProfileUpdate(ProfileBase):
    pass

class ProfileOut(ProfileBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class UserOut(BaseModel):
    id: int
    email: EmailStr
    is_active: bool
    is_demo: bool
    created_at: datetime
    profile: Optional[ProfileOut] = None

    model_config = ConfigDict(from_attributes=True)
