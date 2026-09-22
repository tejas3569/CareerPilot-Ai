from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Float, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base

class JobDescription(Base):
    __tablename__ = "job_descriptions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), default="")
    company = Column(String(255), default="")
    raw_text = Column(Text, nullable=False)
    extracted_skills = Column(JSON, default=list)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    matches = relationship("JobMatch", back_populates="job_description", cascade="all, delete-orphan")

class JobMatch(Base):
    __tablename__ = "job_matches"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="SET NULL"), nullable=True)
    job_description_id = Column(Integer, ForeignKey("job_descriptions.id", ondelete="SET NULL"), nullable=True)
    
    job_title = Column(String(255), default="")
    company_name = Column(String(255), default="")
    job_text = Column(Text, default="")
    
    overall_match_score = Column(Integer, default=0)  # 0 to 100
    semantic_score = Column(Float, default=0.0)       # 0.0 to 1.0
    keyword_score = Column(Float, default=0.0)        # 0.0 to 1.0
    
    matching_skills = Column(JSON, default=list)
    missing_skills = Column(JSON, default=list)
    recommended_skills = Column(JSON, default=list)
    relevant_projects = Column(JSON, default=list)
    recommendations = Column(JSON, default=list)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="job_matches")
    resume = relationship("Resume", back_populates="job_matches")
    job_description = relationship("JobDescription", back_populates="matches")
