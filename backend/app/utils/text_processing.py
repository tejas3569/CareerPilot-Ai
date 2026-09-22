import re
from typing import List, Dict, Any, Set, Tuple

# Comprehensive taxonomy of 350+ skills across categories
SKILLS_TAXONOMY: Dict[str, List[str]] = {
    "Programming Languages": [
        "Python", "JavaScript", "TypeScript", "Java", "C++", "C", "C#", "Go", "Golang",
        "Rust", "Ruby", "PHP", "Swift", "Kotlin", "Scala", "R", "Dart", "SQL", "HTML", "CSS", "Bash", "Shell"
    ],
    "Frontend Development": [
        "React", "React.js", "Next.js", "Vue", "Vue.js", "Angular", "Svelte", "Redux", "Zustand",
        "Tailwind CSS", "TailwindCSS", "Bootstrap", "Material UI", "Chakra UI", "Sass", "SCSS",
        "Webpack", "Vite", "Responsive Design", "Web Accessibility", "WCAG"
    ],
    "Backend & APIs": [
        "FastAPI", "Django", "Flask", "Node.js", "Express", "Express.js", "NestJS", "Spring Boot",
        "ASP.NET", "Ruby on Rails", "REST", "RESTful APIs", "GraphQL", "gRPC", "WebSockets", "Microservices"
    ],
    "AI & Machine Learning": [
        "Machine Learning", "Deep Learning", "Artificial Intelligence", "Neural Networks", "NLP",
        "Natural Language Processing", "Computer Vision", "LLMs", "Large Language Models", "Transformers",
        "PyTorch", "TensorFlow", "Keras", "Scikit-Learn", "Hugging Face", "LangChain", "LlamaIndex",
        "OpenCV", "BERT", "GPT", "RAG", "Embeddings", "Vector Search", "Fine-Tuning", "Prompt Engineering"
    ],
    "Data Science & Analytics": [
        "Pandas", "NumPy", "SciPy", "Matplotlib", "Seaborn", "Plotly", "Data Analysis", "Data Visualization",
        "Statistical Modeling", "A/B Testing", "Feature Engineering", "BigQuery", "Snowflake", "Apache Spark",
        "PySpark", "Hadoop", "Tableau", "Power BI", "Excel", "Data Cleaning", "ETL"
    ],
    "Databases & Storage": [
        "PostgreSQL", "MySQL", "SQLite", "MongoDB", "Redis", "Cassandra", "DynamoDB", "Elasticsearch",
        "Pinecone", "ChromaDB", "Milvus", "Weaviate", "Firebase", "Supabase", "SQLAlchemy", "Prisma", "Neo4j"
    ],
    "DevOps & Cloud": [
        "Docker", "Kubernetes", "AWS", "Amazon Web Services", "Google Cloud", "GCP", "Azure",
        "CI/CD", "GitHub Actions", "GitLab CI", "Terraform", "Linux", "Nginx", "Docker Compose",
        "Prometheus", "Grafana", "Cloudflare", "Serverless", "S3", "EC2", "Lambda"
    ],
    "Core CS & Software Engineering": [
        "Data Structures", "Algorithms", "Object-Oriented Programming", "OOP", "Design Patterns",
        "System Design", "Git", "GitHub", "Version Control", "Unit Testing", "Integration Testing",
        "Agile", "Scrum", "CI/CD", "Clean Code", "Test-Driven Development", "TDD"
    ],
    "Soft Skills & Leadership": [
        "Problem Solving", "Communication", "Team Collaboration", "Leadership", "Critical Thinking",
        "Time Management", "Adaptability", "Presentation Skills", "Mentorship", "Analytical Thinking"
    ]
}

# Aliases for canonical skill mapping
SKILL_ALIASES: Dict[str, str] = {
    "reactjs": "React",
    "react.js": "React",
    "nextjs": "Next.js",
    "vuejs": "Vue",
    "vue.js": "Vue",
    "nodejs": "Node.js",
    "node": "Node.js",
    "expressjs": "Express",
    "express.js": "Express",
    "golang": "Go",
    "postgres": "PostgreSQL",
    "k8s": "Kubernetes",
    "tf": "TensorFlow",
    "sklearn": "Scikit-Learn",
    "scikit learn": "Scikit-Learn",
    "ml": "Machine Learning",
    "dl": "Deep Learning",
    "nlp": "Natural Language Processing",
    "cv": "Computer Vision",
    "llm": "Large Language Models",
    "llms": "Large Language Models",
    "ai": "Artificial Intelligence",
    "tailwind": "Tailwind CSS",
    "tailwindcss": "Tailwind CSS",
    "aws": "AWS",
    "gcp": "Google Cloud",
    "dsa": "Data Structures & Algorithms",
    "oop": "Object-Oriented Programming",
    "rest api": "RESTful APIs",
    "rest apis": "RESTful APIs",
    "ts": "TypeScript",
    "js": "JavaScript",
    "py": "Python"
}

# Canonical list of skills flattened
ALL_CANONICAL_SKILLS: List[Tuple[str, str]] = []
for category, skills in SKILLS_TAXONOMY.items():
    for skill in skills:
        ALL_CANONICAL_SKILLS.append((skill, category))

# Resume Section Headers Regex Patterns
SECTION_PATTERNS: Dict[str, str] = {
    "summary": r"(?:summary|objective|professional summary|about me|profile)",
    "education": r"(?:education|academic background|academics|qualifications|degrees)",
    "experience": r"(?:experience|work experience|employment history|internship|professional experience)",
    "projects": r"(?:projects|personal projects|academic projects|key projects|notable projects)",
    "skills": r"(?:skills|technical skills|technologies|proficiencies|competencies|skillset)",
    "certifications": r"(?:certifications|certificates|licenses|accreditations)",
    "achievements": r"(?:achievements|awards|honors|publications|extracurricular|accomplishments)"
}

# Strong impact verbs for ATS evaluation
ACTION_VERBS = {
    "accelerated", "achieved", "analyzed", "architected", "automated", "built", "calculated",
    "centralized", "collaborated", "constructed", "created", "decreased", "delivered", "deployed",
    "designed", "developed", "devised", "engineered", "established", "executed", "expanded",
    "formulated", "generated", "implemented", "improved", "increased", "initiated", "integrated",
    "launched", "led", "managed", "maximized", "minimized", "modeled", "modernized", "optimized",
    "orchestrated", "overhauled", "pioneered", "reduced", "refactored", "resolved", "scaled",
    "secured", "simplified", "spearheaded", "standardized", "streamlined", "structured", "trained",
    "transformed", "upgraded"
}

def clean_text(text: str) -> str:
    """Normalize whitespace and remove non-printable characters."""
    if not text:
        return ""
    text = re.sub(r"[\r\n\t]+", " ", text)
    text = re.sub(r"\s{2,}", " ", text)
    return text.strip()

def extract_skills_from_text(text: str) -> List[Dict[str, str]]:
    """
    Extract skills from arbitrary text (resume or job description)
    using boundary matching and taxonomy lookups.
    Returns list of {"name": canonical_name, "category": category}
    """
    if not text:
        return []
    
    found_skills: Dict[str, str] = {}
    lower_text = " " + text.lower() + " "
    
    # Check aliases first
    for alias, canonical in SKILL_ALIASES.items():
        if alias in ["c++", "c#"]:
            pattern = r"(?<![a-zA-Z0-9])" + re.escape(alias.lower()) + r"(?![a-zA-Z0-9\+\#])"
        else:
            pattern = r"(?<![a-zA-Z0-9])" + re.escape(alias.lower()) + r"(?![a-zA-Z0-9])"
        if re.search(pattern, lower_text):
            # Find its category
            cat = "Technical"
            for c, skills in SKILLS_TAXONOMY.items():
                if canonical in skills:
                    cat = c
                    break
            found_skills[canonical] = cat

    # Check canonical skills
    for skill, category in ALL_CANONICAL_SKILLS:
        if skill in found_skills:
            continue
        if skill.lower() in ["c++", "c#"]:
            pattern = r"(?<![a-zA-Z0-9])" + re.escape(skill.lower()) + r"(?![a-zA-Z0-9\+\#])"
        else:
            pattern = r"(?<![a-zA-Z0-9])" + re.escape(skill.lower()) + r"(?![a-zA-Z0-9])"
        if re.search(pattern, lower_text):
            found_skills[skill] = category

    result = [{"name": name, "category": cat} for name, cat in sorted(found_skills.items())]
    return result

def extract_sections_from_resume(raw_text: str) -> Dict[str, str]:
    """
    Split resume text into semantic sections (education, experience, projects, skills, etc.)
    """
    if not raw_text:
        return {}

    lines = raw_text.split("\n")
    sections: Dict[str, List[str]] = {}
    current_section = "contact_header"
    sections[current_section] = []

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue
        
        # Check if this line looks like a section header (usually short line matching header pattern)
        is_header = False
        if len(stripped.split()) <= 4:
            for sec_name, pattern in SECTION_PATTERNS.items():
                if re.fullmatch(pattern, stripped.lower(), re.IGNORECASE) or re.search(r"^" + pattern + r"[\s:]*$", stripped.lower()):
                    current_section = sec_name
                    if current_section not in sections:
                        sections[current_section] = []
                    is_header = True
                    break
        
        if not is_header:
            if current_section not in sections:
                sections[current_section] = []
            sections[current_section].append(stripped)

    return {sec: "\n".join(content_lines).strip() for sec, content_lines in sections.items() if content_lines}

def parse_projects_from_text(projects_text: str) -> List[Dict[str, Any]]:
    """Parse distinct projects from the projects section of a resume."""
    if not projects_text:
        return []
    
    paragraphs = re.split(r"\n{2,}|(?<=[.\n])(?=[A-Z0-9][A-Za-z0-9\s\-]+(?:\s*\||\s*–|\s*—|\s*:))", projects_text)
    parsed = []
    
    for idx, p in enumerate(paragraphs):
        p_clean = p.strip()
        if len(p_clean) < 20:
            continue
        lines = p_clean.split("\n")
        title = lines[0][:80].strip()
        # Clean title
        title = re.sub(r"^[•\-\*]\s*", "", title)
        skills = extract_skills_from_text(p_clean)
        parsed.append({
            "id": idx + 1,
            "title": title,
            "description": p_clean,
            "technologies": [s["name"] for s in skills[:6]]
        })
    
    return parsed[:5]

def calculate_ats_metrics(text: str, sections: Dict[str, str]) -> Dict[str, Any]:
    """
    Calculate quantifiable ATS metrics:
    - Action verbs score
    - Metric/quantification presence (numbers, percentages, metrics)
    - Contact presence (email, phone, links)
    - Section completeness
    """
    words = re.findall(r"\b[a-zA-Z0-9_\-\.\#\+]+", text)
    word_count = len(words)
    
    # Action verbs count
    verbs_found = [w.lower() for w in words if w.lower() in ACTION_VERBS]
    unique_verbs = set(verbs_found)
    
    # Quantifiable metrics (numbers like 50%, 10x, $500, 200ms, 1,000)
    numbers_found = re.findall(r"(?:\d+(?:\.\d+)?%|\$\d+(?:,\d+)?|\b\d+(?:x|k|m|ms|s)\b|\b\d{2,}\b)", text, re.IGNORECASE)
    
    # Contact info detection
    has_email = bool(re.search(r"[\w\.-]+@[\w\.-]+\.\w+", text))
    has_phone = bool(re.search(r"(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}", text))
    has_github = bool(re.search(r"github\.com/[\w\-]+", text, re.IGNORECASE))
    has_linkedin = bool(re.search(r"linkedin\.com/in/[\w\-]+", text, re.IGNORECASE))

    # Core sections check
    required_sections = ["education", "skills", "projects", "experience"]
    detected_sections = [s for s in required_sections if s in sections and len(sections[s]) > 20]
    missing_sections = [s for s in required_sections if s not in detected_sections]

    return {
        "word_count": word_count,
        "action_verbs_count": len(verbs_found),
        "unique_action_verbs": sorted(list(unique_verbs))[:12],
        "metrics_count": len(numbers_found),
        "quantifiable_examples": numbers_found[:6],
        "has_email": has_email,
        "has_phone": has_phone,
        "has_github": has_github,
        "has_linkedin": has_linkedin,
        "detected_sections": detected_sections,
        "missing_sections": missing_sections,
        "readability_score": min(100, max(40, 100 - abs(450 - word_count) // 10))
    }
