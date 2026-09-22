import pytest
from app.services.roadmap_service import roadmap_service, ROLE_SKILL_PROFILES
from app.services.ai_service import ai_service

def test_all_10_roles_defined_in_roadmap():
    expected_roles = [
        "Software Developer",
        "Frontend Engineer",
        "Backend Developer",
        "Full Stack Developer",
        "AI/ML Engineer",
        "Data Scientist",
        "Data Analyst",
        "DevOps & Cloud Engineer",
        "Cybersecurity Analyst",
        "Mobile App Developer"
    ]
    for role in expected_roles:
        assert role in ROLE_SKILL_PROFILES, f"Role {role} should be in ROLE_SKILL_PROFILES"
        profile = ROLE_SKILL_PROFILES[role]
        assert len(profile["required_skills"]) >= 5
        assert len(profile["default_phases"]) == 5

@pytest.mark.asyncio
async def test_roadmap_generation_new_role():
    rm = await roadmap_service.generate_roadmap("Frontend Engineer", ["HTML", "CSS", "JavaScript"])
    assert rm["target_role"] == "Frontend Engineer"
    assert len(rm["items"]) > 0
    phase_numbers = {it["phase_number"] for it in rm["items"]}
    assert phase_numbers == {1, 2, 3, 4, 5}

@pytest.mark.asyncio
async def test_chat_ai_founder_and_offline_response():
    # Test founder inquiry
    res_founder = await ai_service.chat_completion(
        message="Who founded CareerPilot AI?",
        target_role="Software Developer"
    )
    assert "Kommana Kesava Ram Sai Tejas" in res_founder["reply"]
    assert len(res_founder["suggested_followups"]) > 0

    # Test technical STAR method inquiry
    res_star = await ai_service.chat_completion(
        message="Can you explain the STAR method for behavioral interviews?",
        target_role="Software Developer"
    )
    assert "Situation" in res_star["reply"] or "STAR" in res_star["reply"]
    assert len(res_star["suggested_followups"]) > 0

def test_chat_api_endpoint(client):
    # Obtain auth token via demo login
    demo_res = client.post("/api/auth/demo-login")
    assert demo_res.status_code == 200
    token = demo_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    res = client.post("/api/chat/message", json={
        "message": "Who is the founder of CareerPilot AI?",
        "target_role": "AI/ML Engineer"
    }, headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert "reply" in data
    assert "Kommana Kesava Ram Sai Tejas" in data["reply"]
    assert "suggested_followups" in data
