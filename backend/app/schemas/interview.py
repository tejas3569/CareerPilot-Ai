from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

class InterviewStartRequest(BaseModel):
    role: str = "Software Developer"
    experience_level: str = "Entry-level / Intern"
    interview_type: str = "Technical"  # Technical, Behavioral, HR, Mixed
    total_questions: int = 5

class InterviewAnswerSubmit(BaseModel):
    user_answer: str

class InterviewAnswerOut(BaseModel):
    id: int
    question_id: int
    technical_accuracy: float
    relevance: float
    clarity: float
    communication: float
    completeness: float
    overall_score: float
    what_was_good: List[str]
    what_could_improve: List[str]
    better_answer_example: str
    follow_up_question: str
    submitted_at: datetime

    model_config = ConfigDict(from_attributes=True)

class InterviewQuestionOut(BaseModel):
    id: int
    session_id: int
    question_text: str
    category: str
    question_order: int
    context_note: str
    answer: Optional[InterviewAnswerOut] = None

    model_config = ConfigDict(from_attributes=True)

class InterviewSessionOut(BaseModel):
    id: int
    role: str
    experience_level: str
    interview_type: str
    status: str
    total_questions: int
    completed_questions: int
    average_score: float
    summary_feedback: str
    questions: List[InterviewQuestionOut]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class GeneratedQuestionsRequest(BaseModel):
    target_role: Optional[str] = None
    resume_id: Optional[int] = None
    category: Optional[str] = None
    force_refresh: Optional[bool] = False

class QuestionItem(BaseModel):
    id: int
    question: str
    category: str
    why_asked: str
    key_talking_points: List[str]
    model_answer_outline: str

class QuestionBankResponse(BaseModel):
    target_role: str
    questions: List[QuestionItem]
