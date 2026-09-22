from pydantic import BaseModel, EmailStr
from typing import Optional

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = "Student"
    target_role: Optional[str] = "Software Developer"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    email: str
    is_demo: bool = False

class TokenData(BaseModel):
    user_id: Optional[int] = None
    email: Optional[str] = None

class ForgotPasswordRequest(BaseModel):
    email: EmailStr
