from typing import List, Dict, Optional, Any
from fastapi import APIRouter, Depends, status
from pydantic import BaseModel, Field
from app.services.ai_service import ai_service
from app.models.user import User
from app.api.deps import get_current_user

router = APIRouter(prefix="/chat", tags=["AI Career Chatbot"])

class ChatHistoryItem(BaseModel):
    role: str = Field(..., description="'user' or 'assistant'")
    content: str = Field(..., description="Message text")

class ChatMessageRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000, description="User question or prompt")
    history: Optional[List[ChatHistoryItem]] = Field(default=[], description="Recent conversation turns")
    target_role: Optional[str] = Field(default="Software Developer", description="Target engineering role context")

class ChatMessageResponse(BaseModel):
    reply: str
    suggested_followups: List[str]

@router.post("/message", response_model=ChatMessageResponse, status_code=status.HTTP_200_OK)
async def send_chat_message(
    payload: ChatMessageRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Ask the AI Career Copilot any question about career, technical topics,
    algorithms, interviews, resume improvements, or system design.
    """
    history_dicts = [{"role": h.role, "content": h.content} for h in payload.history]
    role_to_use = payload.target_role or (current_user.profile.target_role if current_user.profile else "Software Developer")

    result = await ai_service.chat_completion(
        message=payload.message,
        history=history_dicts,
        target_role=role_to_use
    )

    return ChatMessageResponse(
        reply=result["reply"],
        suggested_followups=result.get("suggested_followups", [])
    )
