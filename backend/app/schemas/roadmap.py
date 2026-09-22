from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

class RoadmapItemUpdate(BaseModel):
    status: str  # not_started | in_progress | completed

class RoadmapItemOut(BaseModel):
    id: int
    roadmap_id: int
    phase_number: int
    phase_name: str
    skill_name: str
    priority: str
    difficulty: str
    estimated_hours: int
    prerequisites: List[str]
    project_idea: str
    status: str
    order_index: int

    model_config = ConfigDict(from_attributes=True)

class RoadmapCreateRequest(BaseModel):
    target_role: str

class RoadmapOut(BaseModel):
    id: int
    target_role: str
    title: str
    description: str
    progress_percentage: float
    items: List[RoadmapItemOut]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
