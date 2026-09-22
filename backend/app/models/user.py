from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    job_matches = relationship("JobMatch", back_populates="user", cascade="all, delete-orphan")
    user_skills = relationship("UserSkill", back_populates="user", cascade="all, delete-orphan")
    skill_gaps = relationship("SkillGap", back_populates="user", cascade="all, delete-orphan")
    roadmaps = relationship("LearningRoadmap", back_populates="user", cascade="all, delete-orphan")
    interviews = relationship("InterviewSession", back_populates="user", cascade="all, delete-orphan")
