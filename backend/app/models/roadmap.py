from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Float, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base

class LearningRoadmap(Base):
    __tablename__ = "learning_roadmaps"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    target_role = Column(String(255), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, default="")
    progress_percentage = Column(Float, default=0.0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="roadmaps")
    items = relationship("RoadmapItem", back_populates="roadmap", cascade="all, delete-orphan", order_by="RoadmapItem.order_index")

class RoadmapItem(Base):
    __tablename__ = "roadmap_items"

    id = Column(Integer, primary_key=True, index=True)
    roadmap_id = Column(Integer, ForeignKey("learning_roadmaps.id", ondelete="CASCADE"), nullable=False, index=True)
    phase_number = Column(Integer, default=1)  # 1 to 5
    phase_name = Column(String(255), default="Phase 1 — Fundamentals")
    skill_name = Column(String(150), nullable=False)
    priority = Column(String(50), default="High")  # High, Medium, Low
    difficulty = Column(String(50), default="Beginner")  # Beginner, Intermediate, Advanced
    estimated_hours = Column(Integer, default=15)
    prerequisites = Column(JSON, default=list)
    project_idea = Column(Text, default="")
    status = Column(String(50), default="not_started")  # not_started | in_progress | completed
    order_index = Column(Integer, default=0)

    roadmap = relationship("LearningRoadmap", back_populates="items")
