from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(512), nullable=False)
    raw_text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="resumes")
    analysis = relationship("ResumeAnalysis", back_populates="resume", uselist=False, cascade="all, delete-orphan")
    job_matches = relationship("JobMatch", back_populates="resume", cascade="all, delete-orphan")

class ResumeAnalysis(Base):
    __tablename__ = "resume_analyses"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), unique=True, nullable=False)
    score = Column(Integer, default=0)  # 0 to 100
    strengths = Column(JSON, default=list)
    weaknesses = Column(JSON, default=list)
    missing_sections = Column(JSON, default=list)
    detected_skills = Column(JSON, default=list)
    suggestions = Column(JSON, default=list)
    ats_metrics = Column(JSON, default=dict)
    project_suggestions = Column(JSON, default=list)
    parsed_sections = Column(JSON, default=dict)  # education, projects, experience, certifications, achievements
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    resume = relationship("Resume", back_populates="analysis")
