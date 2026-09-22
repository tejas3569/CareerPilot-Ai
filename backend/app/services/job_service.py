import re
from typing import Dict, Any, List, Optional
from app.utils.text_processing import extract_skills_from_text, parse_projects_from_text
from app.services.embedding_service import embedding_service
from app.services.ai_service import ai_service

class JobService:
    """Service for comparing resumes with job descriptions using vector embeddings and skill extraction."""

    @staticmethod
    async def match_resume_to_job(
        resume_text: str,
        job_text: str,
        job_title: str = "",
        company_name: str = "",
        resume_skills: Optional[List[str]] = None,
        resume_projects: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        # Extract skills from job description
        job_skills_found = extract_skills_from_text(job_text)
        job_skill_names = [s["name"] for s in job_skills_found]

        # Extract skills from resume if not provided
        if resume_skills is None:
            r_skills = extract_skills_from_text(resume_text)
            resume_skill_names = [s["name"] for s in r_skills]
        else:
            resume_skill_names = resume_skills

        resume_skills_set = set(s.lower() for s in resume_skill_names)
        
        # Categorize matching vs missing skills
        matching_skills = []
        missing_skills = []
        for s in job_skill_names:
            if s.lower() in resume_skills_set:
                matching_skills.append(s)
            else:
                missing_skills.append(s)

        # Keyword coverage score (0.0 to 1.0)
        keyword_score = 0.0
        if job_skill_names:
            keyword_score = len(matching_skills) / len(job_skill_names)
        else:
            keyword_score = 0.75  # Default if job description didn't list specific recognized skills

        # Semantic embedding vector similarity (0.0 to 1.0)
        semantic_score = embedding_service.calculate_similarity(resume_text, job_text)

        # Blended overall score (0 to 100)
        # 55% semantic context + 45% hard keyword match
        combined = (0.55 * semantic_score) + (0.45 * keyword_score)
        # Normalize to realistic recruiter threshold (30% to 95%)
        scaled_score = int(round(combined * 100))
        overall_match_score = max(25, min(96, scaled_score))

        # Recommended skills (top priority missing skills + related tooling)
        recommended_skills = []
        for ms in missing_skills[:6]:
            recommended_skills.append(f"Learn {ms} fundamentals and build a targeted module")

        # Project relevance matching
        relevant_projects = []
        if resume_projects:
            for proj in resume_projects:
                proj_desc = proj.get("description", "")
                proj_skills = proj.get("technologies", [])
                
                # Check overlapping skills with job
                overlap = [sk for sk in proj_skills if sk.lower() in [js.lower() for js in job_skill_names]]
                if overlap or len(relevant_projects) < 2:
                    relevant_projects.append({
                        "title": proj.get("title", "Project"),
                        "matched_skills": overlap,
                        "relevance_note": f"Demonstrates practical hands-on experience with {', '.join(overlap)}" if overlap else "Showcases core engineering competency and problem solving."
                    })

        # Default recommendations
        recommendations = [
            f"Tailor your resume headline and summary to specifically reference '{job_title or 'the target role'}'.",
            f"Add bullet points illustrating any academic or self-directed coursework in: {', '.join(missing_skills[:3]) if missing_skills else 'cloud infrastructure'}.",
            "Incorporate industry-standard terminology from the job description into your project descriptions to optimize ATS parsing."
        ]

        # LLM enhancement if live AI is available
        if ai_service.is_live_ai_available():
            prompt = f"""
            Compare candidate resume against job description:
            Role: {job_title} at {company_name}
            Matching Skills: {matching_skills}
            Missing Skills: {missing_skills}
            
            Job Snippet:
            \"\"\"{job_text[:1500]}\"\"\"
            
            Return JSON with keys:
            - "recommendations": list of 3 high-impact suggestions for tailoring the resume to this specific job
            - "recommended_skills": list of 3-4 specific skill action items
            """
            llm_res = await ai_service.generate_json(prompt, system_instruction="You are an expert technical recruiter matching talent to roles.")
            if llm_res:
                if "recommendations" in llm_res and isinstance(llm_res["recommendations"], list) and llm_res["recommendations"]:
                    recommendations = llm_res["recommendations"]
                if "recommended_skills" in llm_res and isinstance(llm_res["recommended_skills"], list) and llm_res["recommended_skills"]:
                    recommended_skills = llm_res["recommended_skills"]

        return {
            "job_title": job_title or "Target Position",
            "company_name": company_name or "Company",
            "overall_match_score": overall_match_score,
            "semantic_score": round(semantic_score, 4),
            "keyword_score": round(keyword_score, 4),
            "required_skills": job_skill_names,
            "matching_skills": matching_skills,
            "missing_skills": missing_skills,
            "recommended_skills": recommended_skills,
            "relevant_projects": relevant_projects[:3],
            "recommendations": recommendations
        }

job_service = JobService()
