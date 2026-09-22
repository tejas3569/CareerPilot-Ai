import json
import re
from typing import Dict, Any, Optional, List
import httpx
from app.config import settings

class AIService:
    """
    Unified AI Service provider supporting Google Gemini, OpenAI,
    and a specialized offline contextual analysis engine for Demo Mode.
    """
    def __init__(self):
        self.gemini_client = None
        if settings.GEMINI_API_KEY:
            try:
                from google import genai
                self.gemini_client = genai.Client(api_key=settings.GEMINI_API_KEY)
            except Exception as e:
                print(f"[AIService] Warning: Could not initialize Gemini client: {e}")

    def is_live_ai_available(self) -> bool:
        """Returns True if a live LLM API key is configured."""
        if settings.LLM_PROVIDER == "gemini" and bool(settings.GEMINI_API_KEY):
            return True
        if settings.LLM_PROVIDER == "openai" and bool(settings.OPENAI_API_KEY):
            return True
        return False

    async def generate_text(self, prompt: str, system_instruction: str = "") -> str:
        """Generate unstructured text from the configured AI provider."""
        if self.gemini_client and settings.GEMINI_API_KEY:
            try:
                config = {}
                if system_instruction:
                    config["system_instruction"] = system_instruction
                
                response = self.gemini_client.models.generate_content(
                    model=settings.LLM_MODEL or "gemini-2.5-flash",
                    contents=prompt,
                    config=config if config else None
                )
                if response and response.text:
                    return response.text.strip()
            except Exception as e:
                print(f"[AIService] Gemini text generation error: {e}")

        # OpenAI fallback if configured
        if settings.OPENAI_API_KEY:
            try:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    res = await client.post(
                        "https://api.openai.com/v1/chat/completions",
                        headers={"Authorization": f"Bearer {settings.OPENAI_API_KEY}"},
                        json={
                            "model": settings.LLM_MODEL if "gpt" in settings.LLM_MODEL else "gpt-4o-mini",
                            "messages": [
                                *([{"role": "system", "content": system_instruction}] if system_instruction else []),
                                {"role": "user", "content": prompt}
                            ],
                            "temperature": 0.7
                        }
                    )
                    if res.status_code == 200:
                        data = res.json()
                        return data["choices"][0]["message"]["content"].strip()
            except Exception as e:
                print(f"[AIService] OpenAI text generation error: {e}")

        return ""

    async def generate_json(self, prompt: str, system_instruction: str = "") -> Optional[Dict[str, Any]]:
        """
        Generate structured JSON output from LLM.
        Strips markdown backticks if present.
        """
        full_system = (system_instruction + "\nReturn ONLY valid JSON. Do not include introductory text or trailing markdown explanations.").strip()
        
        raw_text = await self.generate_text(prompt, system_instruction=full_system)
        if not raw_text:
            return None

        # Clean markdown fences like ```json ... ```
        cleaned = re.sub(r"^```(?:json)?\s*", "", raw_text, flags=re.MULTILINE)
        cleaned = re.sub(r"```\s*$", "", cleaned, flags=re.MULTILINE).strip()
        
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            # Try to locate the outermost JSON object or array
            match = re.search(r"(\{.*\}|\[.*\])", cleaned, re.DOTALL)
            if match:
                try:
                    return json.loads(match.group(1))
                except Exception:
                    pass
            print(f"[AIService] Failed to decode JSON from response: {raw_text[:200]}...")
            return None

    async def chat_completion(
        self,
        message: str,
        history: List[Dict[str, str]] = None,
        target_role: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Conduct conversational career copilot chat. Supports live LLMs (Gemini/OpenAI)
        and an intelligent offline multi-domain engineering knowledge engine.
        """
        history = history or []
        target_role = target_role or "Software Developer"
        clean_msg = message.strip()
        msg_lower = clean_msg.lower()

        system_instruction = (
            f"You are CareerPilot AI, the premier AI Career Copilot and Senior Engineering Mentor "
            f"created by founder Kommana Kesava Ram Sai Tejas. You assist college students and engineering candidates "
            f"in landing top placement offers and internships in {target_role} and related tech fields. "
            f"Provide insightful, friendly, highly actionable answers with code examples, architectural breakdowns, "
            f"and clear interview frameworks (e.g. STAR method) where relevant."
        )

        # 1. Check if user is asking about the founder or platform origin
        if any(w in msg_lower for w in ["founder", "founded", "founding", "who created", "who made", "creator", "tejas", "owner", "who built", "about careerpilot"]):
            return {
                "reply": (
                    "**CareerPilot AI** was founded and architected by **Kommana Kesava Ram Sai Tejas** — a passionate "
                    "software engineer, AI/ML architect, and product designer.\n\n"
                    "Tejas designed CareerPilot AI with a clear mission: **to democratize placement readiness and eliminate guesswork "
                    "for college engineering students**. The platform integrates deterministic ATS resume parsing, vector-based semantic job matching, "
                    "personalized 5-phase career progression roadmaps, and 5-axis rubric mock interview simulations to prepare students "
                    "for real-world engineering careers."
                ),
                "suggested_followups": [
                    "How can CareerPilot AI optimize my resume?",
                    "Generate a 5-phase roadmap for my target role",
                    "How do I prepare for technical mock interviews?"
                ]
            }

        # 2. Try live LLM if available
        if self.is_live_ai_available():
            try:
                # Format conversation context
                formatted_history = "\n".join([f"{h.get('role', 'user').title()}: {h.get('content', '')}" for h in history[-6:]])
                prompt = (
                    f"Conversation Context:\n{formatted_history}\n\n"
                    f"Candidate Question: {clean_msg}\n\n"
                    f"Answer the candidate thoroughly, concisely, and practically."
                )
                live_text = await self.generate_text(prompt, system_instruction=system_instruction)
                if live_text:
                    # Generate dynamic follow-up suggestions
                    followup_prompt = f"Given this question: '{clean_msg}', suggest 3 brief logical follow-up questions a student might ask. Return ONLY valid JSON: [\"q1\", \"q2\", \"q3\"]"
                    followups = await self.generate_json(followup_prompt) or [
                        "Can you show a concrete code example of this?",
                        "What common interview mistakes do candidates make here?",
                        "How do top tech companies test this concept?"
                    ]
                    return {
                        "reply": live_text,
                        "suggested_followups": followups[:3] if isinstance(followups, list) else []
                    }
            except Exception as e:
                print(f"[AIService] Live chat generation fallback: {e}")

        # 3. Smart Contextual Offline Knowledge Engine
        if any(w in msg_lower for w in ["resume", "ats", "cv", "bullet point"]):
            reply = (
                "### 📄 ATS Resume Optimization Strategy\n\n"
                "To maximize your ATS match score for tech placements:\n\n"
                "1. **Use the Google XYZ Formula** for project bullet points: *\"Accomplished [X] as measured by [Y], by doing [Z].\"*\n"
                "   - *Weak:* Built a machine learning model for churn prediction.\n"
                "   - *Strong:* Designed an XGBoost churn prediction pipeline achieving **89.4% ROC-AUC**, reducing false negatives by **18%** using SMOTE feature balancing.\n"
                "2. **Include Core Keyword Anchors**: Ensure exact spelling of tools and libraries (e.g. `PostgreSQL`, `FastAPI`, `Docker`, `PyTorch`) rather than generic descriptions.\n"
                "3. **Single-Column Standard Layout**: Avoid complex multi-column tables, text boxes, or embedded graphics that confuse standard ATS parsers."
            )
            followups = [
                "How do I write quantifiable project metrics?",
                "What are the top ATS red flags?",
                "How can I tailor my resume to a specific job description?"
            ]
        elif any(w in msg_lower for w in ["interview", "behavioral", "star", "hr question", "tell me about yourself"]):
            reply = (
                "### 🎯 Mastering the Behavioral & Technical Interview\n\n"
                "For behavioral and scenario questions, always structure your answer using the **STAR Framework**:\n\n"
                "- **S (Situation)**: Set the context in 1-2 sentences (e.g. *\"During our final semester capstone project with a 4-week deadline...\"*)\n"
                "- **T (Task)**: The specific technical challenge or goal assigned to you.\n"
                "- **A (Action)**: The concrete technical steps YOU took (e.g. *\"I profiled memory usage with cProfile, identified a N+1 query leak, and added Redis caching...\"*)\n"
                "- **R (Result)**: The quantifiable outcome (e.g. *\"Cut API response latency by 64% and achieved an 'A' grade.\"*)\n\n"
                "💡 *Pro-tip:* For 'Tell me about yourself', answer in 90 seconds covering: Current status -> Key technical passions & notable project -> Why you're excited about this specific company."
            )
            followups = [
                "How to answer 'What is your greatest technical weakness'?",
                "How should I handle a question I don't know the answer to?",
                "What questions should I ask the interviewer at the end?"
            ]
        elif any(w in msg_lower for w in ["dsa", "leetcode", "dynamic programming", "graph", "tree", "binary search", "algorithm"]):
            reply = (
                "### 🧩 High-Yield DSA Placement Blueprint\n\n"
                "For software engineering campus placements, master these 6 essential patterns rather than grinding random problems:\n\n"
                "1. **Two Pointers & Sliding Window**: O(n) array and substring problems (e.g. Longest Substring Without Repeating Characters).\n"
                "2. **Breadth-First Search (BFS) & DFS**: Shortest path in unweighted graphs and tree level-order traversals.\n"
                "3. **Fast & Slow Pointers**: Cycle detection in linked lists (Floyd's algorithm).\n"
                "4. **Binary Search on Answer Space**: When search space is monotonic (e.g. Koko Eating Bananas, Capacity to Ship Packages).\n"
                "5. **Dynamic Programming**: Identify optimal substructure and overlapping subproblems. Start top-down with memoization before moving to 1D table space optimization.\n"
                "6. **Top K Elements (Heaps)**: Use min-heap of size K for Top K largest items."
            )
            followups = [
                "Explain the difference between BFS and DFS with code",
                "How to approach Dynamic Programming step-by-step?",
                "What are the top 50 LeetCode patterns for placements?"
            ]
        elif any(w in msg_lower for w in ["system design", "scalability", "load balancer", "caching", "redis", "sharding"]):
            reply = (
                "### 🏛️ System Design Quick Framework for Placements\n\n"
                "When asked to design a system (e.g. TinyURL, Twitter feed, E-Commerce cart):\n\n"
                "1. **Clarify Scope & Constraints** (5 mins): Daily active users (DAU), read/write ratio, latency requirements.\n"
                "2. **High-Level Architecture** (10 mins):\n"
                "   `Client ➔ DNS / CDN ➔ Load Balancer (Nginx) ➔ Stateless App Servers ➔ Cache (Redis) ➔ Relational DB / NoSQL`\n"
                "3. **Data Storage & Schema** (10 mins): Primary keys, indexing strategy, SQL vs NoSQL trade-offs.\n"
                "4. **Scalability Deep Dive** (15 mins): Horizontal scaling, database read replicas, cache-aside pattern, and message queues (Kafka/RabbitMQ) for asynchronous writes."
            )
            followups = [
                "Design a high-volume URL shortener like Bitly",
                "How does Redis caching prevent database bottlenecks?",
                "What is the CAP Theorem and how does it apply in practice?"
            ]
        elif any(w in msg_lower for w in ["react", "frontend", "next.js", "javascript", "typescript", "css"]):
            reply = (
                "### ⚛️ Frontend & React 18 Interview Essentials\n\n"
                "Key concepts tech interviewers test for Frontend roles:\n\n"
                "- **Virtual DOM Diffing**: React uses an O(n) heuristic diffing algorithm on Fiber trees. Stable unique `key` props ensure nodes are reconciled rather than recreated from scratch.\n"
                "- **Hooks Rules & Closures**: Never call hooks inside loops or conditions. Ensure all external variables used inside `useEffect` or `useCallback` are included in the dependency array to avoid stale closures.\n"
                "- **SSR vs SSG vs CSR**: Server-Side Rendering yields faster First Contentful Paint (FCP) and SEO; Static Site Generation pre-renders at build time; Client-Side Rendering shifts bundle parsing to the browser.\n"
                "- **State Architecture**: Use local state (`useState`) for isolated inputs, Context/Zustand for global themes/auth, and TanStack React Query for server cache synchronization."
            )
            followups = [
                "How do React 18 Server Components differ from Client Components?",
                "How to optimize Largest Contentful Paint (LCP) in React?",
                "Explain the JavaScript Event Loop (Microtasks vs Macrotasks)"
            ]
        elif any(w in msg_lower for w in ["python", "fastapi", "backend", "django", "sql", "database"]):
            reply = (
                "### 🐍 Python & Backend Engineering Guide\n\n"
                "Crucial backend placement talking points:\n\n"
                "- **Python Concurrency & GIL**: The Global Interpreter Lock ensures thread-safe memory management in CPython. For CPU-bound tasks, use `multiprocessing`. For I/O-bound tasks, use `asyncio` or `threading`.\n"
                "- **FastAPI Architecture**: Built on Starlette (ASGI) and Pydantic. Uses Python type annotations for automatic data parsing, validation, and OpenAPI documentation.\n"
                "- **Database Indexing**: B-Tree indexes speed up `WHERE` and `JOIN` filters from O(n) table scans to O(log n) seeks, but introduce write overhead on `INSERT`/`UPDATE`."
            )
            followups = [
                "How does async/await work in Python under the hood?",
                "What is the difference between clustered and non-clustered indexes?",
                "How do you design RESTful API authentication using JWT?"
            ]
        elif any(w in msg_lower for w in ["machine learning", "ai", "deep learning", "nlp", "pytorch", "transformers"]):
            reply = (
                "### 🤖 AI/ML & Deep Learning Interview Preparation\n\n"
                "Key areas to review for AI/ML Engineer and Data Scientist placement rounds:\n\n"
                "1. **Bias-Variance Trade-off**: High bias = underfitting; High variance = overfitting. Remediate overfitting with L1/L2 weight decay, dropout, cross-validation, and data augmentation.\n"
                "2. **Feature Engineering & Leakage**: Always fit transformers/scalers strictly on the training partition to prevent validation leakage.\n"
                "3. **Transformers & Self-Attention**: Q, K, V projections compute attention matrices: `Softmax((Q * K^T) / sqrt(d_k)) * V`. Enables parallelized sequence modeling over legacy RNNs.\n"
                "4. **Evaluation Metrics**: Understand why accuracy is misleading on imbalanced datasets — rely on Precision, Recall, F1-Score, and ROC-AUC."
            )
            followups = [
                "Explain the Transformer self-attention formula with intuition",
                "How do you handle severe class imbalance in ML?",
                "What is the difference between PyTorch and TensorFlow?"
            ]
        else:
            reply = (
                f"### 💡 CareerPilot AI Mentorship Insight\n\n"
                f"Regarding **\"{clean_msg}\"**:\n\n"
                f"As you prepare for engineering placements in **{target_role}**, success comes down to three synchronized pillars:\n\n"
                f"1. **Core Problem-Solving Competency**: Demonstrating structured thinking, time/space complexity awareness, and clean code hygiene.\n"
                f"2. **Demonstrated Project Ownership**: Being able to explain architectural trade-offs, tech stack decisions, and edge-case handling for projects listed on your resume.\n"
                f"3. **Clear Technical Communication**: Articulating assumptions clearly and breaking down complex problems aloud before writing code.\n\n"
                f"Would you like me to drill deeper into the technical mechanics, show code examples, or run a practice interview question on this topic?"
            )
            followups = [
                "Give me a real interview question on this topic",
                "How should I explain this in a placement interview?",
                "What projects can I build to demonstrate this skill?"
            ]

        return {
            "reply": reply,
            "suggested_followups": followups
        }

ai_service = AIService()

