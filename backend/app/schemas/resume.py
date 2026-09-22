from pydantic import BaseModel, ConfigDict
from typing import List, Dict, Any, Optional
from datetime import datetime

class ResumeAnalysisOut(BaseModel):
    id: int
    resume_id: int
    score: int
    strengths: List[str]
    weaknesses: List[str]
    missing_sections: List[str]
    detected_skills: List[str]
    suggestions: List[str]
    ats_metrics: Dict[str, Any]
    project_suggestions: List[str]
    parsed_sections: Dict[str, Any]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ResumeOut(BaseModel):
    id: int
    filename: str
    created_at: datetime
    analysis: Optional[ResumeAnalysisOut] = None

    model_config = ConfigDict(from_attributes=True)

class ResumeUploadResponse(BaseModel):
    message: str
    resume_id: int
    filename: str
    analysis: ResumeAnalysisOut
