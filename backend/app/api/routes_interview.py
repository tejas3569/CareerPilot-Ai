from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.resume import Resume
from app.models.interview import InterviewSession, InterviewQuestion, InterviewAnswer
from app.schemas.interview import (
    InterviewStartRequest,
    InterviewAnswerSubmit,
    InterviewAnswerOut,
    InterviewSessionOut,
    GeneratedQuestionsRequest,
    QuestionBankResponse,
    QuestionItem
)
from app.services.interview_service import interview_service
from app.api.deps import get_current_user

router = APIRouter(prefix="/interview", tags=["AI Mock Interview Simulator"])

@router.post("/start", response_model=InterviewSessionOut, status_code=status.HTTP_201_CREATED)
async def start_interview_session(
    payload: InterviewStartRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Start an interactive AI-powered mock interview session.
    Generates tailored questions based on target role, level, and candidate's resume/projects.
    """
    # Fetch candidate's latest resume to tailor questions
    latest_resume = db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.id.desc()).first()
    resume_skills = []
    resume_projects = []
    if latest_resume and latest_resume.analysis:
        resume_skills = latest_resume.analysis.detected_skills or []
        parsed = latest_resume.analysis.parsed_sections or {}
        resume_projects = parsed.get("projects", [])

    generated_questions = await interview_service.generate_interview_questions(
        role=payload.role,
        level=payload.experience_level,
        interview_type=payload.interview_type,
        total_questions=payload.total_questions,
        resume_skills=resume_skills,
        resume_projects=resume_projects
    )

    new_session = InterviewSession(
        user_id=current_user.id,
        role=payload.role,
        experience_level=payload.experience_level,
        interview_type=payload.interview_type,
        total_questions=len(generated_questions),
        completed_questions=0,
        average_score=0.0
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    # Add questions
    for q in generated_questions:
        question_record = InterviewQuestion(
            session_id=new_session.id,
            question_text=q["question_text"],
            category=q["category"],
            question_order=q["question_order"],
            context_note=q.get("context_note", "")
        )
        db.add(question_record)

    db.commit()
    db.refresh(new_session)
    return new_session

@router.post("/answer/{question_id}", response_model=InterviewAnswerOut)
async def submit_answer(
    question_id: int,
    payload: InterviewAnswerSubmit,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Submit an answer for an interview question:
    Evaluates across Technical Accuracy, Relevance, Clarity, Communication, and Completeness.
    Returns 1-10 scores, constructive feedback, exemplary model answer, and a follow-up question.
    """
    question = db.query(InterviewQuestion).join(InterviewSession).filter(
        InterviewQuestion.id == question_id,
        InterviewSession.user_id == current_user.id
    ).first()

    if not question:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interview question not found.")

    if not payload.user_answer.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Answer cannot be empty.")

    evaluation = await interview_service.evaluate_answer(
        question_text=question.question_text,
        category=question.category,
        user_answer=payload.user_answer
    )

    # Save or update answer
    answer = db.query(InterviewAnswer).filter(InterviewAnswer.question_id == question.id).first()
    if not answer:
        answer = InterviewAnswer(
            question_id=question.id,
            user_answer=payload.user_answer,
            technical_accuracy=evaluation["technical_accuracy"],
            relevance=evaluation["relevance"],
            clarity=evaluation["clarity"],
            communication=evaluation["communication"],
            completeness=evaluation["completeness"],
            overall_score=evaluation["overall_score"],
            what_was_good=evaluation["what_was_good"],
            what_could_improve=evaluation["what_could_improve"],
            better_answer_example=evaluation["better_answer_example"],
            follow_up_question=evaluation["follow_up_question"]
        )
        db.add(answer)
    else:
        answer.user_answer = payload.user_answer
        answer.technical_accuracy = evaluation["technical_accuracy"]
        answer.relevance = evaluation["relevance"]
        answer.clarity = evaluation["clarity"]
        answer.communication = evaluation["communication"]
        answer.completeness = evaluation["completeness"]
        answer.overall_score = evaluation["overall_score"]
        answer.what_was_good = evaluation["what_was_good"]
        answer.what_could_improve = evaluation["what_could_improve"]
        answer.better_answer_example = evaluation["better_answer_example"]
        answer.follow_up_question = evaluation["follow_up_question"]

    db.commit()

    # Recalculate session average and status
    session = question.session
    answers = db.query(InterviewAnswer).join(InterviewQuestion).filter(
        InterviewQuestion.session_id == session.id
    ).all()
    session.completed_questions = len(answers)
    if answers:
        session.average_score = round(sum(a.overall_score for a in answers) / len(answers), 1)
    if session.completed_questions >= session.total_questions:
        session.status = "completed"
        session.summary_feedback = (
            f"Interview completed with an overall performance score of {session.average_score}/10. "
            f"Strongest communication observed on structured questions; review recommended improvements before real placement rounds."
        )

    db.commit()
    db.refresh(answer)
    return answer

@router.get("/history", response_model=List[InterviewSessionOut])
def get_interview_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve history of all mock interview sessions by student."""
    sessions = db.query(InterviewSession).filter(
        InterviewSession.user_id == current_user.id
    ).order_by(InterviewSession.id.desc()).all()
    return sessions

@router.get("/{session_id}", response_model=InterviewSessionOut)
def get_interview_session_by_id(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve an interview session with all questions and existing evaluations."""
    session = db.query(InterviewSession).filter(
        InterviewSession.id == session_id,
        InterviewSession.user_id == current_user.id
    ).first()
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interview session not found.")
    return session

@router.post("/questions/generate", response_model=QuestionBankResponse)
async def generate_tailored_questions(
    payload: GeneratedQuestionsRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate categorized interview questions tailored to student's resume, skills, and projects."""
    latest_resume = db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.id.desc()).first()
    resume_skills = []
    resume_projects = []
    target_role = payload.target_role or "Software Developer"

    if latest_resume and latest_resume.analysis:
        resume_skills = latest_resume.analysis.detected_skills or []
        parsed = latest_resume.analysis.parsed_sections or {}
        resume_projects = parsed.get("projects", [])

    items = await interview_service.generate_question_bank(
        target_role=target_role,
        resume_skills=resume_skills,
        resume_projects=resume_projects,
        category=payload.category,
        force_refresh=payload.force_refresh or False
    )

    return QuestionBankResponse(
        target_role=target_role,
        questions=[QuestionItem(**it) for it in items]
    )
