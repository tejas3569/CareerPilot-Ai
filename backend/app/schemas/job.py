from pydantic import BaseModel, ConfigDict
from typing import List, Dict, Any, Optional
from datetime import datetime

class JobMatchRequest(BaseModel):
    job_title: Optional[str] = "Target Role"
    company_name: Optional[str] = "Company"
    job_description: str
    resume_id: Optional[int] = None

class JobMatchOut(BaseModel):
    id: int
    job_title: str
    company_name: str
    overall_match_score: int
    semantic_score: float
    keyword_score: float
    matching_skills: List[str]
    missing_skills: List[str]
    recommended_skills: List[str]
    relevant_projects: List[Dict[str, Any]]
    recommendations: List[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
