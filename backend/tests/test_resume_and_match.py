import pytest
from app.services.resume_service import resume_service, SAMPLE_RESUME_TEXT
from app.services.job_service import job_service
from app.services.embedding_service import embedding_service
from app.services.roadmap_service import roadmap_service
from app.services.interview_service import interview_service

@pytest.mark.asyncio
async def test_resume_parser_and_ats_scoring():
    raw_text = SAMPLE_RESUME_TEXT
    analysis = await resume_service.analyze_resume(raw_text)
    
    assert analysis["score"] >= 60
    assert len(analysis["detected_skills"]) > 5
    assert "Python" in analysis["detected_skills"]
    assert "FastAPI" in analysis["detected_skills"]
    assert len(analysis["strengths"]) > 0
    assert "ats_metrics" in analysis

@pytest.mark.asyncio
async def test_semantic_embedding_and_job_match():
    # Test vector generation
    vec1 = embedding_service.get_embedding("Machine learning engineer with PyTorch and Python experience")
    vec2 = embedding_service.get_embedding("Deep learning specialist with PyTorch neural networks")
    vec3 = embedding_service.get_embedding("Graphic designer creating marketing flyers and brochures")

    sim_related = embedding_service.calculate_similarity(
        "Machine learning engineer with PyTorch and Python experience",
        "Deep learning specialist with PyTorch neural networks"
    )
    sim_unrelated = embedding_service.calculate_similarity(
        "Machine learning engineer with PyTorch and Python experience",
        "Graphic designer creating marketing flyers and brochures"
    )

    assert sim_related > sim_unrelated
    assert sim_related > 0.4

    # Test Job Match
    match = await job_service.match_resume_to_job(
        resume_text=SAMPLE_RESUME_TEXT,
        job_text="We need a Python developer who knows PyTorch, FastAPI, and Kubernetes.",
        job_title="ML Engineer",
        company_name="AI Labs",
        resume_skills=["Python", "PyTorch", "FastAPI"]
    )

    assert match["overall_match_score"] > 40
    assert "Python" in match["matching_skills"]
    assert "Kubernetes" in match["missing_skills"]

def test_skill_gap_calculation():
    current_skills = ["Python", "Pandas", "NumPy", "Scikit-Learn"]
    gap = roadmap_service.calculate_skill_gap("AI/ML Engineer", current_skills)
    
    assert gap["target_role"] == "AI/ML Engineer"
    assert "PyTorch" in gap["missing_skills"]
    assert "Python" in gap["current_skills"]
    assert 0 < gap["readiness_percentage"] < 100

@pytest.mark.asyncio
async def test_interview_evaluation_rubric():
    question = "Can you explain the bias-variance tradeoff in machine learning?"
    answer = (
        "The bias-variance tradeoff is a fundamental concept in machine learning. "
        "High bias happens when a model is overly simplistic and underfits the training data. "
        "High variance occurs when a model overfits noise in the data and fails to generalize. "
        "We balance them using regularization like L2 or ensemble techniques like Random Forests."
    )
    eval_result = await interview_service.evaluate_answer(question, "Machine Learning", answer)

    assert eval_result["overall_score"] >= 6.0
    assert eval_result["technical_accuracy"] >= 5.0
    assert len(eval_result["what_was_good"]) > 0
    assert len(eval_result["what_could_improve"]) > 0
    assert "follow_up_question" in eval_result
