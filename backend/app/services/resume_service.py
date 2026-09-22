import io
import re
from typing import Dict, Any, List, Optional
import pypdf
from app.utils.text_processing import (
    extract_skills_from_text,
    extract_sections_from_resume,
    calculate_ats_metrics,
    parse_projects_from_text,
    clean_text
)
from app.services.ai_service import ai_service

SAMPLE_RESUME_TEXT = """
Alex Chen
San Francisco, CA | alex.chen@berkeley.edu | (555) 349-2048 | github.com/alexchen-demo | linkedin.com/in/alexchen-demo

EDUCATION
University of California, Berkeley — Bachelor of Science in Computer Science
Graduation: May 2026 | GPA: 3.84 / 4.0
Relevant Coursework: Data Structures, Algorithms, Machine Learning, Operating Systems, Database Systems, Computer Vision

TECHNICAL SKILLS
Languages: Python, C++, Java, TypeScript, JavaScript, SQL, Bash
AI / Machine Learning: PyTorch, TensorFlow, Scikit-Learn, Pandas, NumPy, Hugging Face Transformers, OpenCV
Backend & Cloud: FastAPI, Flask, Docker, PostgreSQL, Redis, AWS (S3, EC2), Git, Linux, CI/CD, GitHub Actions

WORK EXPERIENCE
AI/ML Engineering Intern — NeuralMetrics Labs | San Francisco, CA
June 2025 – August 2025
• Designed and deployed a semantic retrieval-augmented generation (RAG) system using PyTorch and FastAPI, reducing search latency by 42%.
• Fine-tuned open-source LLM embeddings on 250,000 internal engineering documents, boosting top-3 retrieval accuracy by 28%.
• Containerized the inference pipeline using Docker and deployed to AWS EC2 with automated health checks and Prometheus metrics.

Software Engineering Intern — CloudScale Technologies | San Jose, CA
May 2024 – August 2024
• Engineered scalable REST APIs using Python and PostgreSQL handling over 15,000 requests per minute during peak loads.
• Optimized slow relational database queries using composite B-Tree indexes and Redis caching, reducing average p95 response time from 380ms to 45ms.
• Created 30+ unit and integration tests using pytest, expanding backend code coverage from 68% to 92%.

PROJECTS
MedVision: Deep Learning Pneumonia Classifier
• Architected a Convolutional Neural Network (DenseNet-121) in PyTorch to classify chest X-ray radiographs across 112,000 public NIH images.
• Implemented data augmentation and gradient-weighted class activation mapping (Grad-CAM) to visualize explainable diagnostic heatmaps.
• Deployed an interactive demo application with FastAPI backend and React frontend, achieving 94.2% ROC-AUC.

Distributed Task Queue & Cache Manager
• Implemented an asynchronous background job processing engine in Python featuring thread pooling and Redis-backed state replication.
• Built exponential backoff retry algorithms and dead-letter queues handling 5,000 simulated worker tasks with zero drop rate.

ACHIEVEMENTS & CERTIFICATIONS
• Winner (1st place out of 60 teams) — CalHacks AI Innovation Track 2024
• AWS Certified Cloud Practitioner (2024)
"""

class ResumeService:

    """Service for parsing PDF resumes and calculating comprehensive ATS scores and recommendations."""

    @staticmethod
    def extract_text_from_pdf(file_bytes: bytes) -> str:
        """Extract plain text from uploaded PDF file using pypdf."""
        reader = pypdf.PdfReader(io.BytesIO(file_bytes))
        full_text = []
        for page_idx, page in enumerate(reader.pages):
            text = page.extract_text()
            if text:
                full_text.append(text)
        return "\n\n".join(full_text).strip()

    @staticmethod
    def parse_resume(raw_text: str) -> Dict[str, Any]:
        """Parse structured sections, extracted skills, and projects from raw resume text."""
        sections = extract_sections_from_resume(raw_text)
        skills = extract_skills_from_text(raw_text)
        ats_metrics = calculate_ats_metrics(raw_text, sections)
        projects = parse_projects_from_text(sections.get("projects", ""))

        # Extract name heuristic (usually first non-empty line)
        lines = [line.strip() for line in raw_text.split("\n") if line.strip()]
        candidate_name = lines[0] if lines and len(lines[0].split()) <= 4 else "Candidate"

        parsed_sections = {
            "name": candidate_name,
            "education": sections.get("education", ""),
            "experience": sections.get("experience", ""),
            "projects": projects or [{"title": "Projects", "description": sections.get("projects", "")}],
            "skills": [s["name"] for s in skills],
            "certifications": sections.get("certifications", ""),
            "achievements": sections.get("achievements", "")
        }

        return {
            "candidate_name": candidate_name,
            "sections": sections,
            "detected_skills": skills,
            "ats_metrics": ats_metrics,
            "parsed_sections": parsed_sections
        }

    @staticmethod
    async def analyze_resume(raw_text: str) -> Dict[str, Any]:
        """
        Produce a full ATS analysis containing:
        - Score (0-100)
        - Strengths
        - Weaknesses
        - Missing sections
        - Skills detected
        - Suggestions for improvement
        - ATS-style keyword analysis
        - Project quality suggestions
        """
        parsed = ResumeService.parse_resume(raw_text)
        metrics = parsed["ats_metrics"]
        skills = parsed["detected_skills"]
        skill_names = [s["name"] for s in skills]

        # 1. Calculate Algorithmic ATS Score
        # Component weights:
        # - Skills breadth (25 pts): up to 15+ detected technical skills
        # - Quantifiable impact & metrics (20 pts): presence of metrics/numbers
        # - Action verbs (20 pts): active verbs count
        # - Section completeness (20 pts): presence of core sections
        # - Formatting & length (15 pts): reasonable word count (300-750 words) and contacts
        
        skill_score = min(25, len(skills) * 1.5)
        metrics_score = min(20, metrics["metrics_count"] * 3.5)
        verb_score = min(20, metrics["action_verbs_count"] * 2.0)
        
        core_secs = ["education", "skills", "projects", "experience"]
        found_secs = [s for s in core_secs if s in metrics["detected_sections"]]
        section_score = (len(found_secs) / len(core_secs)) * 20.0
        
        format_score = 0.0
        if 250 <= metrics["word_count"] <= 850:
            format_score += 7.0
        if metrics["has_email"]:
            format_score += 4.0
        if metrics["has_github"] or metrics["has_linkedin"]:
            format_score += 4.0

        total_score = int(round(skill_score + metrics_score + verb_score + section_score + format_score))
        total_score = max(35, min(96, total_score))

        # 2. Derive Strengths, Weaknesses, and Suggestions
        strengths = []
        weaknesses = []
        suggestions = []
        project_suggestions = []

        if len(skills) >= 10:
            strengths.append(f"Strong technical skill variety detected ({len(skills)} verified industry tools & languages).")
        else:
            weaknesses.append(f"Relatively low technical keyword density ({len(skills)} detected skills).")
            suggestions.append("Add a dedicated 'Technical Skills' section categorizing Languages, Frameworks, Developer Tools, and Databases.")

        if metrics["metrics_count"] >= 4:
            strengths.append(f"Strong quantification of results ({metrics['metrics_count']} metrics/percentages found).")
        else:
            weaknesses.append("Lack of quantifiable business and engineering impact in project descriptions.")
            suggestions.append("Use the Google XYZ formula: 'Accomplished [X], as measured by [Y], by doing [Z]'. Example: 'Reduced query latency by 45%'.")

        if metrics["action_verbs_count"] >= 8:
            strengths.append(f"Effective use of active engineering verbs ({metrics['action_verbs_count']} dynamic action verbs).")
        else:
            weaknesses.append("Passive phrasing detected; several bullet points lack compelling leadership or ownership verbs.")
            suggestions.append("Begin every bullet point with strong action verbs like 'Architected', 'Spearheaded', 'Engineered', 'Optimized'.")

        if not metrics["missing_sections"]:
            strengths.append("All primary ATS resume sections (Education, Experience, Projects, Skills) are present.")
        else:
            for ms in metrics["missing_sections"]:
                weaknesses.append(f"Missing recommended section: '{ms.capitalize()}'.")
                suggestions.append(f"Ensure your resume contains a clear header for '{ms.capitalize()}'.")

        if not (metrics["has_github"] or metrics["has_linkedin"]):
            weaknesses.append("No GitHub or LinkedIn profile hyperlinks detected in the header.")
            suggestions.append("Include clickable URLs to your active GitHub and LinkedIn profiles to substantiate project work.")

        # Project quality suggestions
        project_suggestions = [
            "Highlight modern architectural decisions in your projects (e.g. state management, caching with Redis, or asynchronous workers).",
            "Include live deployed demo links and public GitHub repositories for top projects.",
            "Demonstrate automated testing (unit tests, CI/CD pipelines) within at least one core project."
        ]

        # 3. LLM Enhancement (if API key configured)
        if ai_service.is_live_ai_available():
            prompt = f"""
            Analyze this student resume for tech campus placements:
            Resume Text:
            \"\"\"{raw_text[:3000]}\"\"\"

            Return JSON with keys:
            - "strengths": list of 3-4 concise professional strengths
            - "weaknesses": list of 2-3 specific weaknesses
            - "suggestions": list of 3-4 actionable tips
            - "project_suggestions": list of 2-3 specific project enhancements
            """
            llm_result = await ai_service.generate_json(prompt, system_instruction="You are an expert tech recruiter and ATS resume specialist.")
            if llm_result:
                if "strengths" in llm_result and isinstance(llm_result["strengths"], list) and llm_result["strengths"]:
                    strengths = llm_result["strengths"]
                if "weaknesses" in llm_result and isinstance(llm_result["weaknesses"], list) and llm_result["weaknesses"]:
                    weaknesses = llm_result["weaknesses"]
                if "suggestions" in llm_result and isinstance(llm_result["suggestions"], list) and llm_result["suggestions"]:
                    suggestions = llm_result["suggestions"]
                if "project_suggestions" in llm_result and isinstance(llm_result["project_suggestions"], list) and llm_result["project_suggestions"]:
                    project_suggestions = llm_result["project_suggestions"]

        return {
            "score": total_score,
            "strengths": strengths,
            "weaknesses": weaknesses,
            "missing_sections": metrics["missing_sections"],
            "detected_skills": skill_names,
            "suggestions": suggestions,
            "ats_metrics": metrics,
            "project_suggestions": project_suggestions,
            "parsed_sections": parsed["parsed_sections"]
        }

resume_service = ResumeService()
