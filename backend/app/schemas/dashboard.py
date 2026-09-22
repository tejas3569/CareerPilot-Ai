from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class RecentAnalysisItem(BaseModel):
    id: int
    type: str  # "resume" | "job_match" | "interview"
    title: str
    score: Optional[int] = None
    date: str

class RecommendedActionItem(BaseModel):
    id: str
    title: str
    description: str
    action_text: str
    route: str
    priority: str  # high | medium | low

class DashboardStats(BaseModel):
    profile_completion: int  # 0 to 100
    resume_score: Optional[int] = None  # out of 100
    latest_job_match_score: Optional[int] = None  # percentage
    skills_detected_count: int
    missing_skills_count: int
    interview_readiness_score: Optional[int] = None  # percentage 0 to 100
    current_streak_days: int
    recent_analyses: List[RecentAnalysisItem]
    recommended_actions: List[RecommendedActionItem]
