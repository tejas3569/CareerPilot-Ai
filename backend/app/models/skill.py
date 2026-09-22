from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), unique=True, index=True, nullable=False)
    category = Column(String(100), default="Technical")  # Language, Framework, Library, Database, Cloud, Tool, AI/ML, Soft

class UserSkill(Base):
    __tablename__ = "user_skills"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_name = Column(String(150), nullable=False)
    category = Column(String(100), default="Technical")
    source = Column(String(50), default="resume")  # resume | profile | manual
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="user_skills")

class SkillGap(Base):
    __tablename__ = "skill_gaps"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    target_role = Column(String(255), nullable=False)
    current_skills = Column(JSON, default=list)
    missing_skills = Column(JSON, default=list)
    role_required_skills = Column(JSON, default=list)
    readiness_percentage = Column(Float, default=0.0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="skill_gaps")
