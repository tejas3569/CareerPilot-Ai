from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    name = Column(String(255), default="")
    college = Column(String(255), default="")
    degree = Column(String(255), default="")
    graduation_year = Column(String(50), default="")
    target_role = Column(String(255), default="Software Developer")
    bio = Column(Text, default="")
    github = Column(String(255), default="")
    linkedin = Column(String(255), default="")
    portfolio = Column(String(255), default="")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="profile")
