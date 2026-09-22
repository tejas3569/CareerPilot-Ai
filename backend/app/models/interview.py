from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Float, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base

class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    role = Column(String(255), default="Software Developer")
    experience_level = Column(String(100), default="Entry-level / Intern")
    interview_type = Column(String(100), default="Technical")  # Technical, Behavioral, HR, Mixed
    status = Column(String(50), default="in_progress")  # in_progress | completed
    total_questions = Column(Integer, default=5)
    completed_questions = Column(Integer, default=0)
    average_score = Column(Float, default=0.0)  # out of 10.0
    summary_feedback = Column(Text, default="")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="interviews")
    questions = relationship("InterviewQuestion", back_populates="session", cascade="all, delete-orphan", order_by="InterviewQuestion.question_order")

class InterviewQuestion(Base):
    __tablename__ = "interview_questions"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("interview_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    question_text = Column(Text, nullable=False)
    category = Column(String(100), default="Technical")  # Technical, Behavioral, HR, Project-Based, System Design
    question_order = Column(Integer, default=1)
    context_note = Column(String(255), default="")

    session = relationship("InterviewSession", back_populates="questions")
    answer = relationship("InterviewAnswer", back_populates="question", uselist=False, cascade="all, delete-orphan")

class InterviewAnswer(Base):
    __tablename__ = "interview_answers"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("interview_questions.id", ondelete="CASCADE"), unique=True, nullable=False)
    user_answer = Column(Text, nullable=False)
    
    # 5 Evaluation Dimensions (1 to 10)
    technical_accuracy = Column(Float, default=0.0)
    relevance = Column(Float, default=0.0)
    clarity = Column(Float, default=0.0)
    communication = Column(Float, default=0.0)
    completeness = Column(Float, default=0.0)
    overall_score = Column(Float, default=0.0)  # Average of 5 metrics (out of 10)
    
    what_was_good = Column(JSON, default=list)
    what_could_improve = Column(JSON, default=list)
    better_answer_example = Column(Text, default="")
    follow_up_question = Column(Text, default="")
    
    submitted_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    question = relationship("InterviewQuestion", back_populates="answer")
