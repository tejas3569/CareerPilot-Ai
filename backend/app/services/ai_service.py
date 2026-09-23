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
                from google.genai import types
                config = types.GenerateContentConfig(system_instruction=system_instruction) if system_instruction else None
                response = self.gemini_client.models.generate_content(
                    model=settings.LLM_MODEL or "gemini-2.5-flash",
                    contents=prompt,
                    config=config
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
        and an intelligent, high-accuracy offline engineering knowledge engine.
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

        # 1. Founder & Platform Origin Query
        if any(w in msg_lower for w in ["founder", "founded", "founding", "who created", "who made", "creator", "tejas", "owner", "who built", "about careerpilot"]):
            return {
                "reply": (
                    "### 🚀 About CareerPilot AI & Founder\n\n"
                    "**CareerPilot AI** was founded and architected by **Kommana Kesava Ram Sai Tejas** — a passionate "
                    "software engineer, AI/ML architect, and product designer.\n\n"
                    "#### The Vision\n"
                    "Tejas designed CareerPilot AI with a clear mission: **to democratize placement readiness and eliminate guesswork "
                    "for college engineering students**. The platform integrates deterministic ATS resume parsing, vector-based semantic job matching, "
                    "personalized 5-phase career progression roadmaps, and 5-axis rubric mock interview simulations to prepare students "
                    "for real-world engineering careers.\n\n"
                    "💡 *Pro-tip:* You can explore the Resume Analyzer, Mock Interview simulator, or Career Roadmap modules directly from the navigation bar!"
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
                formatted_history = "\n".join([f"{h.get('role', 'user').title()}: {h.get('content', '')}" for h in history[-6:]])
                prompt = (
                    f"Conversation Context:\n{formatted_history}\n\n"
                    f"Candidate Question: {clean_msg}\n\n"
                    f"Answer the candidate thoroughly, concisely, and practically with clear formatting and actionable code/steps."
                )
                live_text = await self.generate_text(prompt, system_instruction=system_instruction)
                if live_text:
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

        # 3. High-Accuracy Offline Engineering Knowledge Engine

        # 3.1. Behavioral Interview & STAR Method
        if any(w in msg_lower for w in ["star", "conflict", "behavioral", "hr question", "tell me about yourself", "weakness", "leadership", "failure"]):
            reply = (
                "### 🎯 Mastering the Behavioral Interview with the STAR Framework\n\n"
                "In campus and off-campus placements, behavioral questions test your emotional intelligence, problem ownership, and technical communication. Structure your answers using the **STAR Framework**:\n\n"
                "1. **S (Situation)**: Set the context in 1-2 concise sentences.\n"
                "   - *Example:* *\"During our final-year capstone project, our 4-person team had 3 weeks left before the demo and faced critical API timeout bottlenecks.\"*\n"
                "2. **T (Task)**: Define the specific responsibility or challenge you owned.\n"
                "   - *Example:* *\"As the backend lead, I was tasked with bringing the average response latency from 1,800ms down to under 200ms without altering existing frontend contracts.\"*\n"
                "3. **A (Action)**: Detailed technical actions YOU personally took.\n"
                "   - *Example:* *\"I profiled SQL execution using PostgreSQL `EXPLAIN ANALYZE`, discovered N+1 query leaks, implemented Redis in-memory caching for read-heavy queries, and added database indexing on foreign keys.\"*\n"
                "4. **R (Result)**: Quantifiable outcomes and lessons learned.\n"
                "   - *Example:* *\"API response time dropped by **84% to 145ms**, enabling 500 concurrent simulated requests with zero dropped frames, earning our team the Best Project Award.\"*\n\n"
                "💡 *Pro-tip for 'Tell me about yourself':* Follow the 90-second **Past -> Present -> Future** rule: 30s on your engineering foundation, 30s on key technical achievements/projects, and 30s on why this exact company and role excites you."
            )
            followups = [
                "How do I answer 'What is your greatest technical weakness'?",
                "How should I answer 'Why do you want to join our company'?",
                "What questions should I ask the interviewer at the end of the round?"
            ]

        # 3.2. Resume ATS & XYZ Formula
        elif any(w in msg_lower for w in ["resume", "ats", "cv", "bullet point", "xyz formula", "format resume"]):
            reply = (
                "### 📄 ATS Resume Engineering Blueprint\n\n"
                "Applicant Tracking Systems (ATS) scan resumes for keyword relevancy, standard headings, and quantifiable achievements. Here is how to guarantee a 90+ ATS score:\n\n"
                "#### 1. The Google XYZ Formula\n"
                "Never write passive job descriptions. Use the formula: **\"Accomplished [X] as measured by [Y], by doing [Z].\"**\n\n"
                "- ❌ **Weak:** *Worked on a recommendation engine using Python and machine learning.*\n"
                "- ✅ **Strong:** *Engineered a hybrid collaborative-filtering recommendation engine in Python and PyTorch that achieved **91.2% NDCG@10**, reducing user search friction by **23%** via FAISS approximate nearest-neighbor search.*\n\n"
                "#### 2. ATS Technical Formatting Rules\n"
                "- **Single-Column Clean Layout**: ATS parsers choke on multi-column layouts, tables, embedded graphics, and text boxes.\n"
                "- **Standard Section Headers**: Stick to `Education`, `Technical Skills`, `Experience`, `Projects`, and `Certifications`.\n"
                "- **Exact Keyword Match**: Write exact tool names (e.g. `PostgreSQL`, `FastAPI`, `Docker`, `PyTorch`) rather than generic terms."
            )
            followups = [
                "Review my resume bullet points for software engineering",
                "What are the top 5 ATS red flags that cause auto-rejection?",
                "How do I highlight academic projects with zero commercial experience?"
            ]

        # 3.3. React & Frontend Frameworks
        elif any(w in msg_lower for w in ["react", "virtual dom", "diffing", "fiber", "frontend", "next.js", "hooks", "useeffect", "usememo", "usecallback", "closure"]):
            reply = (
                "### ⚛️ React 18/19 Deep-Dive: Virtual DOM & Diffing Algorithm\n\n"
                "Interviewers frequently ask how React renders UI efficiently and how the reconciliation engine works under the hood:\n\n"
                "#### How the Virtual DOM Works\n"
                "1. **In-Memory Tree**: React maintains a lightweight JavaScript object representation (Virtual DOM) of the actual browser DOM.\n"
                "2. **Render Trigger**: When state or props change, React invokes render functions and generates a **new Virtual DOM tree**.\n"
                "3. **Heuristic O(n) Diffing**: Comparing two arbitrary trees has an $O(n^3)$ minimum complexity. React uses two heuristic assumptions to achieve $O(n)$ linear speed:\n"
                "   - Two elements of different types produce different component trees.\n"
                "   - Child elements with stable, unique `key` props can be tracked across renders.\n"
                "4. **Reconciliation (Fiber Engine)**: React's Fiber reconciler breaks rendering into cooperative priority units (concurrent mode), computing minimal DOM mutations and applying them in a single batch **Commit phase**.\n\n"
                "```typescript\n"
                "// 💡 Why stable keys matter: prevents rebuilding the entire list subtree\n"
                "const ItemList = ({ items }: { items: { id: string; name: string }[] }) => (\n"
                "  <ul>\n"
                "    {items.map(item => (\n"
                "      // Use persistent entity ID, never array index\n"
                "      <li key={item.id}>{item.name}</li>\n"
                "    ))}\n"
                "  </ul>\n"
                ");\n"
                "```\n\n"
                "💡 *Pro-tip:* Never use array indexes as keys when items can be filtered, sorted, or deleted — it breaks component state persistence and causes re-render bugs."
            )
            followups = [
                "What is the difference between useMemo and useCallback?",
                "Explain the React useEffect dependency array and stale closures",
                "How does Next.js SSR differ from SSG and Client-Side Rendering?"
            ]

        # 3.4. DSA: High-Yield Patterns & Binary Search
        elif any(w in msg_lower for w in ["binary search", "dsa", "leetcode", "sliding window", "two pointers", "dynamic programming", "graph", "tree", "bfs", "dfs", "knapsack"]):
            reply = (
                "### 🧩 Master DSA Patterns for Campus Placements\n\n"
                "Top tech companies (Google, Amazon, Microsoft, Flipkart) assess your mastery of recurring algorithmic patterns, not memorized solutions.\n\n"
                "#### The 6 Core Placement Patterns\n"
                "1. **Two Pointers & Sliding Window**: For contiguous subarray/substring problems in $O(n)$ time (e.g. *Longest Substring Without Repeating Characters*).\n"
                "2. **Binary Search on Answer Space**: When a validation function `isValid(mid)` is monotonic (`TTTTFFFF` or `FFFFTTTT`), search between $[low, high]$ in $O(n \\log(\\text{range}))$.\n"
                "3. **Breadth-First Search (BFS)**: Guaranteed shortest path in unweighted graphs and tree level-order traversals.\n"
                "4. **Fast & Slow Pointers (Floyd's Cycle)**: Linked list cycle detection in $O(n)$ time and $O(1)$ auxiliary space.\n"
                "5. **Dynamic Programming (0/1 Knapsack & LCS)**: Identifying optimal substructure. Write top-down memoization first, then convert to 1D table bottom-up tabulation.\n"
                "6. **Top K Elements (Min/Max Heap)**: Maintain a heap of size $K$ to solve largest/smallest queries in $O(n \\log K)$ time.\n\n"
                "```python\n"
                "# Template: Binary Search with Overflow-Safe Midpoint\n"
                "def binary_search(nums: list[int], target: int) -> int:\n"
                "    low, high = 0, len(nums) - 1\n"
                "    while low <= high:\n"
                "        mid = low + (high - low) // 2  # Prevents integer overflow\n"
                "        if nums[mid] == target:\n"
                "            return mid\n"
                "        elif nums[mid] < target:\n"
                "            low = mid + 1\n"
                "        else:\n"
                "            high = mid - 1\n"
                "    return -1\n"
                "```"
            )
            followups = [
                "Explain the 0/1 Knapsack Dynamic Programming recurrence relation",
                "How do you detect a cycle in a directed graph using DFS?",
                "What is the difference between Dijkstra and BFS?"
            ]

        # 3.5. System Design: Scalability, Caching, TinyURL & Rate Limiter
        elif any(w in msg_lower for w in ["system design", "tinyurl", "url shortener", "rate limiter", "scalability", "load balancer", "caching", "redis", "sharding", "cap theorem", "kafka", "message queue"]):
            reply = (
                "### 🏛️ System Design Architecture: High-Scale Blueprint\n\n"
                "For entry-level and SDE-1 placement interviews, interviewers look for structured architectural thinking across 4 distinct phases:\n\n"
                "#### 1. 4-Phase System Design Structure (45 Mins)\n"
                "- **Step 1: Functional & Non-Functional Requirements (5 mins)**: Clarify write vs read ratios, latency SLAs (<200ms), availability (99.99%), and storage estimations.\n"
                "- **Step 2: Core Data Model & API Contracts (10 mins)**: Define REST/gRPC endpoints and relational vs NoSQL schema.\n"
                "- **Step 3: High-Level Architecture (15 mins)**:\n"
                "  `Client ➔ DNS/CDN (Cloudflare) ➔ Load Balancer (Nginx) ➔ Stateless App Cluster ➔ Redis Cache ➔ DB (PostgreSQL / DynamoDB)`\n"
                "- **Step 4: Deep Dive & Bottlenecks (15 mins)**: Cache-aside pattern, database sharding (consistent hashing), and asynchronous messaging with Kafka/RabbitMQ.\n\n"
                "#### 2. Key Concept: Cache-Aside (Lazy Loading) Pattern\n"
                "1. Read request checks **Redis** cache first.\n"
                "2. **Cache Hit**: Return data immediately (sub-5ms latency).\n"
                "3. **Cache Miss**: Query database, store the result in Redis with an appropriate TTL (Time To Live), and return response.\n\n"
                "💡 *Pro-tip on CAP Theorem:* In distributed network partitions ($P$), you must choose between **Consistency** ($C$ - every read receives the most recent write or error) or **Availability** ($A$ - every request receives a non-error response without guarantee of latest data)."
            )
            followups = [
                "Design a Rate Limiter using the Token Bucket algorithm",
                "How does Consistent Hashing prevent cache thrashing on node addition?",
                "Compare Kafka vs RabbitMQ: when should you use each?"
            ]

        # 3.6. Python Concurrency, GIL & Asyncio
        elif any(w in msg_lower for w in ["python", "gil", "asyncio", "multiprocessing", "threading", "generator", "yield", "decorator", "fastapi"]):
            reply = (
                "### 🐍 Python Concurrency, GIL, and Asyncio Explained\n\n"
                "Python concurrency is a favorite topic in technical interviews for Backend and Data Engineering roles:\n\n"
                "#### 1. The Global Interpreter Lock (GIL)\n"
                "- In CPython, the **GIL is a mutex** that prevents multiple native threads from executing Python bytecode simultaneously.\n"
                "- **Why it exists**: Memory management in CPython is not thread-safe; reference counting requires synchronization to prevent race conditions.\n"
                "- **Implication**: Standard Python `threading` **cannot** utilize multiple CPU cores for CPU-heavy computation.\n\n"
                "#### 2. Concurrency Decision Framework\n"
                "- **CPU-Bound Tasks** (Matrix multiplication, ML training, image processing):\n"
                "  ➔ Use `multiprocessing` or `concurrent.futures.ProcessPoolExecutor` to spawn separate OS processes with dedicated memory spaces and GILs.\n"
                "- **I/O-Bound Tasks** (HTTP requests, DB queries, reading files):\n"
                "  ➔ Use `asyncio` (cooperative single-threaded event loop) or `threading` (threads yield GIL during network I/O wait).\n\n"
                "```python\n"
                "import asyncio\n\n"
                "async def fetch_data(api_id: int) -> dict:\n"
                "    await asyncio.sleep(1)  # Simulates non-blocking network I/O\n"
                "    return {'id': api_id, 'status': 'success'}\n\n"
                "async def main():\n"
                "    # Executes 3 network tasks concurrently in ~1 second, not 3 seconds\n"
                "    results = await asyncio.gather(*(fetch_data(i) for i in range(3)))\n"
                "    print(results)\n"
                "\n"
                "asyncio.run(main())\n"
                "```"
            )
            followups = [
                "How does Python async/await work under the hood with generators?",
                "What is the difference between a Python decorator and a wrapper?",
                "How does FastAPI achieve high performance with Pydantic and Starlette?"
            ]

        # 3.7. Security, Authentication & JWT
        elif any(w in msg_lower for w in ["jwt", "token", "auth", "authentication", "authorization", "oauth", "password", "hash", "bcrypt", "session"]):
            reply = (
                "### 🔒 Modern Web Authentication: JWT vs Session Tokens\n\n"
                "Interviewers test whether you understand how stateless authentication scales and how to protect web applications against vulnerabilities (CSRF, XSS).\n\n"
                "#### Anatomy of a JSON Web Token (JWT)\n"
                "A JWT is a string formatted as `header.payload.signature`:\n"
                "1. **Header**: Specifies token type (`JWT`) and signing hashing algorithm (`HS256`, `RS256`).\n"
                "2. **Payload**: Contains JSON claims (`user_id`, `role`, expiration `exp`). *Never put plain-text passwords or secret keys here — it is base64url encoded, not encrypted!*\n"
                "3. **Signature**: Cryptographic hash: `HMACSHA256(base64Url(header) + \".\" + base64Url(payload), secret_key)`.\n\n"
                "#### Industry Best Practice: Dual Token Pattern\n"
                "- **Short-Lived Access Token** (15-60 mins): Transmitted in `Authorization: Bearer <token>` header to authenticate API requests statelessly.\n"
                "- **Long-Lived Refresh Token** (7-30 days): Stored in a secure `HttpOnly, Secure, SameSite=Strict` cookie to prevent JavaScript XSS theft. Used strictly to rotate access tokens."
            )
            followups = [
                "What is the difference between Authentication (401) and Authorization (403)?",
                "How do you revoke a JWT before its natural expiration?",
                "Explain OAuth 2.0 Authorization Code Flow with PKCE"
            ]

        # 3.8. Core CS: Operating Systems, Deadlocks, Paging, Threads
        elif any(w in msg_lower for w in ["operating system", "deadlock", "process", "thread", "paging", "virtual memory", "semaphore", "mutex", "banker"]):
            reply = (
                "### 🖥️ Operating Systems Placement Essentials\n\n"
                "Core OS fundamentals frequently tested in campus technical rounds:\n\n"
                "#### 1. Deadlock: The 4 Necessary Coffman Conditions\n"
                "A deadlock occurs if and only if all four conditions hold simultaneously:\n"
                "1. **Mutual Exclusion**: At least one resource must be held in a non-shareable mode.\n"
                "2. **Hold and Wait**: A process holds at least one resource and requests additional resources held by other processes.\n"
                "3. **No Preemption**: Resources cannot be preempted; they are released only voluntarily by the holding process.\n"
                "4. **Circular Wait**: A closed chain of processes exists where each process waits for a resource held by the next process.\n\n"
                "#### 2. Process vs Thread\n"
                "- **Process**: An executing program with its own isolated virtual address space, file descriptors, and memory (Heap, Stack, Data). Heavy context-switching cost.\n"
                "- **Thread**: The smallest unit of CPU execution within a process. Threads of the same process share the heap and code segment, but maintain private stacks and registers."
            )
            followups = [
                "Explain how Paging and Virtual Memory prevent external fragmentation",
                "What is the difference between a Mutex and a Counting Semaphore?",
                "How does the Banker's Algorithm detect safe states?"
            ]

        # 3.9. Computer Networks: TCP/IP, OSI, DNS, HTTP/HTTPS
        elif any(w in msg_lower for w in ["network", "tcp", "udp", "osi", "dns", "http", "https", "handshake", "ssl", "tls", "ip"]):
            reply = (
                "### 🌐 Computer Networks: Protocol Stack & Handshakes\n\n"
                "High-frequency network questions in engineering placement rounds:\n\n"
                "#### 1. TCP 3-Way Handshake (Connection Establishment)\n"
                "1. **SYN**: Client sends `SYN (seq=x)` to server.\n"
                "2. **SYN-ACK**: Server responds with `SYN-ACK (seq=y, ack=x+1)`.\n"
                "3. **ACK**: Client acknowledges with `ACK (ack=y+1)`. TCP socket connection is established!\n\n"
                "#### 2. What Happens When You Type a URL in Browser?\n"
                "1. **DNS Lookup**: Checks Browser Cache ➔ OS Cache ➔ Local DNS Resolver ➔ Root Name Server ➔ TLD Server (.com) ➔ Authoritative Name Server to resolve Domain Name to IP address.\n"
                "2. **TCP & TLS Handshake**: Establishes reliable TCP socket on port 443; executes TLS 1.3 cryptographic handshake for encryption keys.\n"
                "3. **HTTP GET Request**: Browser sends request headers (`Accept`, `User-Agent`, `Cookie`).\n"
                "4. **Server Response & Rendering**: Server returns HTML payload; browser parses DOM tree, CSSOM tree, builds Render Tree, calculates Layout, and Paints pixels."
            )
            followups = [
                "What is the difference between TCP and UDP with real-world examples?",
                "Explain the 7 layers of the OSI model and their primary protocols",
                "What is HTTP/2 multiplexing and how does it solve Head-of-Line blocking?"
            ]

        # 3.10. DBMS: ACID, Normalization, SQL vs NoSQL, Indexing
        elif any(w in msg_lower for w in ["dbms", "sql", "nosql", "acid", "index", "normalization", "b-tree", "join", "database", "transaction"]):
            reply = (
                "### 🗄️ Database Management Systems (DBMS) Placement Guide\n\n"
                "Core DBMS principles required for software engineering roles:\n\n"
                "#### 1. ACID Properties of Database Transactions\n"
                "- **Atomicity**: All operations succeed, or none do (All-or-Nothing via undo logs).\n"
                "- **Consistency**: Transactions transition database from one valid state to another, enforcing constraints.\n"
                "- **Isolation**: Concurrent transactions execute without interfering with each other.\n"
                "- **Durability**: Once committed, changes persist even across system crashes (WAL - Write-Ahead Logging).\n\n"
                "#### 2. Database Indexing: Why B-Trees?\n"
                "- Without an index, finding a row requires an $O(n)$ full table scan.\n"
                "- A **B-Tree / B+Tree index** organizes keys in a balanced multi-way search tree with high fan-out, reducing disk page I/O lookups to $O(\\log_B n)$.\n"
                "- **Clustered Index**: Determines the physical ordering of table rows (only 1 per table, typically the Primary Key).\n"
                "- **Non-Clustered Index**: Stores index column values with row pointers pointing to physical data blocks."
            )
            followups = [
                "What are the 4 transaction isolation levels and their anomalies (Dirty Read, Phantom Read)?",
                "Explain 1NF, 2NF, 3NF, and BCNF Normalization with examples",
                "When should you choose PostgreSQL over MongoDB?"
            ]

        # 3.11. Dynamic Tailored Knowledge Synthesizer
        else:
            reply = (
                f"### 💡 CareerPilot AI Mentorship: Deep-Dive into \"{clean_msg}\"\n\n"
                f"For candidates preparing for **{target_role}** placements, tackling questions like this requires structured technical rigor:\n\n"
                f"#### 1. Core Technical Foundation\n"
                f"- **Deconstruct the Objective**: Clarify requirements, identify edge cases (e.g. null inputs, boundary values, network latency), and formulate baseline constraints.\n"
                f"- **Time & Space Trade-offs**: In placement interviews, always state the brute-force complexity first before optimizing to $O(n)$ or $O(\\log n)$.\n\n"
                f"#### 2. Practical Implementation Steps\n"
                f"1. Break down the system or code logic into modular, testable components.\n"
                f"2. Validate input schemas and write descriptive variable names that communicate business intent.\n"
                f"3. Anticipate failure modes: race conditions, memory leaks, and timeout thresholds.\n\n"
                f"#### 3. How to Answer in an Interview\n"
                f"State your assumptions aloud to the interviewer: *\"I'm assuming our inputs fit in memory. If data volume scales beyond RAM, we can transition to external sorting or distributed partitions.\"*\n\n"
                f"💡 *Would you like me to show a concrete code implementation, system diagram, or run a simulated interview question on this topic?*"
            )
            followups = [
                f"Can you provide a concrete code example for {clean_msg[:30]}?",
                f"What are the most common interview traps regarding {clean_msg[:25]}?",
                f"How would a senior engineer explain this in a placement round?"
            ]

        return {
            "reply": reply,
            "suggested_followups": followups
        }

ai_service = AIService()
