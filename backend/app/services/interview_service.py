import random
from typing import List, Dict, Any, Optional
from app.services.ai_service import ai_service

# Fallback question repository by role and category
CURATED_INTERVIEW_QUESTIONS: Dict[str, Dict[str, List[Dict[str, str]]]] = {
    "AI/ML Engineer": {
        "Technical": [
            {
                "question": "Can you explain the bias-variance tradeoff in machine learning, and how techniques like regularization or ensemble methods address it?",
                "category": "Machine Learning",
                "context": "Evaluates foundational ML theory and statistical understanding."
            },
            {
                "question": "How do attention mechanisms work in Transformer architectures, and how do they differ from recurrent neural networks (RNNs)?",
                "category": "Deep Learning & NLP",
                "context": "Evaluates modern deep learning and sequence modeling knowledge."
            },
            {
                "question": "When serving an LLM or deep learning model in production via FastAPI, what latency and throughput bottlenecks do you typically face, and how would you optimize them?",
                "category": "MLOps & Engineering",
                "context": "Evaluates production inference and system engineering skills."
            },
            {
                "question": "Suppose you have a highly imbalanced dataset (e.g. 99% negative class, 1% positive class). Why is accuracy misleading, and what metrics and sampling strategies would you use?",
                "category": "Data Science",
                "context": "Evaluates real-world dataset handling and evaluation metrics."
            },
            {
                "question": "Walk me through how backpropagation computes gradients in a multi-layer perceptron. What is vanishing gradient problem and how do modern activation functions prevent it?",
                "category": "Deep Learning",
                "context": "Evaluates fundamental calculus and neural network mechanics."
            }
        ],
        "Behavioral": [
            {
                "question": "Describe a time when an ML model or data project you were working on failed to meet the target metric. How did you diagnose the problem and what was your pivot?",
                "category": "Behavioral",
                "context": "Assesses resilience, root cause analysis, and problem-solving."
            },
            {
                "question": "How do you explain a complex black-box machine learning model's output to a non-technical product manager or stakeholder?",
                "category": "Communication",
                "context": "Assesses stakeholder communication and interpretability."
            }
        ],
        "HR": [
            {
                "question": "Why are you interested in this specific role and what excites you most about our engineering culture and domain?",
                "category": "HR",
                "context": "Assesses company motivation and cultural alignment."
            },
            {
                "question": "Where do you see your technical trajectory evolving over the next 2-3 years, and what skills are you prioritizing currently?",
                "category": "HR",
                "context": "Assesses long-term vision and ambition."
            }
        ]
    },
    "Software Developer": {
        "Technical": [
            {
                "question": "Explain the difference between optimistic and pessimistic locking in relational databases, and describe a scenario where you would choose one over the other.",
                "category": "Databases & Concurrency",
                "context": "Evaluates transactional safety and concurrent system design."
            },
            {
                "question": "What happens under the hood when a client makes an HTTPS GET request to a REST API endpoint? Walk from DNS resolution through TLS handshake to server response.",
                "category": "Networking & Web Architecture",
                "context": "Evaluates end-to-end full stack web networking knowledge."
            },
            {
                "question": "Compare Hash Tables and Balanced Binary Search Trees (e.g. Red-Black trees). What are their time complexities for search, insert, and delete in worst-case scenarios?",
                "category": "Data Structures",
                "context": "Evaluates core computer science fundamentals."
            },
            {
                "question": "How do you prevent SQL Injection and Cross-Site Scripting (XSS) in a web application? What defensive practices do you implement in code?",
                "category": "Security",
                "context": "Assesses secure coding practices and API security."
            },
            {
                "question": "Explain the SOLID principles of object-oriented programming. Can you give a concrete example of how the Single Responsibility Principle or Dependency Inversion improved a codebase you worked on?",
                "category": "Software Design",
                "context": "Evaluates clean architecture and software craftsmanship."
            }
        ],
        "Behavioral": [
            {
                "question": "Tell me about a time you had a technical disagreement with a teammate or project partner regarding system architecture. How did you resolve it?",
                "category": "Collaboration",
                "context": "Assesses conflict resolution and technical compromise."
            },
            {
                "question": "Give an example of a situation where you had to learn a completely new framework or tool under a tight deadline to deliver a feature. How did you manage it?",
                "category": "Adaptability",
                "context": "Assesses learning agility and time management."
            }
        ],
        "HR": [
            {
                "question": "Walk me through your background and what motivated you to pursue a career in software engineering.",
                "category": "HR",
                "context": "Assesses communication clarity and narrative presentation."
            },
            {
                "question": "What work environment allows you to do your best engineering work, and how do you handle ambiguity in project requirements?",
                "category": "HR",
                "context": "Assesses work culture fit and problem handling."
            }
        ]
    }
}

class InterviewService:
    """Service for orchestrating mock interviews, evaluating candidate responses, and generating personalized question banks."""

    @staticmethod
    async def generate_interview_questions(
        role: str,
        level: str,
        interview_type: str,
        total_questions: int = 5,
        resume_skills: Optional[List[str]] = None,
        resume_projects: Optional[List[Dict[str, Any]]] = None
    ) -> List[Dict[str, Any]]:
        # If live AI is available, generate personalized questions including project-specific inquiries
        if ai_service.is_live_ai_available():
            proj_context = ""
            if resume_projects:
                proj_context = "Candidate Projects: " + "; ".join(
                    [f"{p.get('title', 'Project')}: {p.get('description', '')[:100]}" for p in resume_projects[:3]]
                )
            
            prompt = f"""
            Generate exactly {total_questions} interview questions for a candidate:
            Role: {role}
            Experience Level: {level}
            Interview Type: {interview_type} (Technical, Behavioral, HR, or Mixed)
            Skills: {resume_skills or []}
            {proj_context}
            
            CRITICAL REQUIREMENTS:
            - Make at least 1-2 questions directly reference their specific projects or tools if provided (e.g. "In your project X, why did you choose Y?").
            - Avoid generic repeated questions.
            - Ensure questions match the selected interview type.
            
            Return JSON with:
            - "questions": list of objects, each with:
              - "question_text": str
              - "category": str (e.g. "Technical", "System Design", "Projects", "Behavioral", "HR")
              - "context_note": str (brief note on what this evaluates)
            """
            llm_res = await ai_service.generate_json(prompt, system_instruction="You are an engineering interviewer at a tier-1 tech company.")
            if llm_res and "questions" in llm_res and len(llm_res["questions"]) >= total_questions:
                results = []
                for idx, q in enumerate(llm_res["questions"][:total_questions]):
                    results.append({
                        "question_text": q.get("question_text", ""),
                        "category": q.get("category", "Technical"),
                        "question_order": idx + 1,
                        "context_note": q.get("context_note", "Targeted interview question.")
                    })
                return results

        # Offline / Curated generation fallback
        role_key = "AI/ML Engineer" if "ai" in role.lower() or "ml" in role.lower() or "data" in role.lower() else "Software Developer"
        role_bucket = CURATED_INTERVIEW_QUESTIONS.get(role_key, CURATED_INTERVIEW_QUESTIONS["Software Developer"])

        pool = []
        if interview_type == "Technical":
            pool.extend(role_bucket.get("Technical", []))
        elif interview_type == "Behavioral":
            pool.extend(role_bucket.get("Behavioral", []))
        elif interview_type == "HR":
            pool.extend(role_bucket.get("HR", []))
        else:  # Mixed
            pool.extend(role_bucket.get("Technical", [])[:3])
            pool.extend(role_bucket.get("Behavioral", [])[:1])
            pool.extend(role_bucket.get("HR", [])[:1])

        # Inject a customized project-based question if projects exist
        questions_list = []
        if resume_projects and len(resume_projects) > 0:
            top_proj = resume_projects[0]
            proj_title = top_proj.get("title", "your featured project")
            proj_techs = top_proj.get("technologies", ["core libraries"])
            tech_str = proj_techs[0] if proj_techs else "the chosen framework"
            questions_list.append({
                "question_text": f"In your project '{proj_title}', you utilized {tech_str}. What architectural trade-offs did you evaluate, and how did you handle edge cases and state management?",
                "category": "Project Deep-Dive",
                "question_order": 1,
                "context_note": "Evaluates candidate's ownership and genuine understanding of listed resume projects."
            })

        for q in pool:
            if len(questions_list) >= total_questions:
                break
            questions_list.append({
                "question_text": q["question"],
                "category": q["category"],
                "question_order": len(questions_list) + 1,
                "context_note": q["context"]
            })

        # Ensure order indexes are sequential
        for i, q in enumerate(questions_list):
            q["question_order"] = i + 1

        return questions_list[:total_questions]

    @staticmethod
    async def evaluate_answer(question_text: str, category: str, user_answer: str) -> Dict[str, Any]:
        """
        Evaluate candidate response across 5 dimensions:
        - Technical Accuracy (1-10)
        - Relevance (1-10)
        - Clarity (1-10)
        - Communication (1-10)
        - Completeness (1-10)
        """
        clean_ans = user_answer.strip()
        word_count = len(clean_ans.split())

        # If live AI is available, evaluate with rigorous rubric
        if ai_service.is_live_ai_available():
            prompt = f"""
            Evaluate this candidate's interview answer:
            Question ({category}): {question_text}
            Candidate Answer:
            \"\"\"{clean_ans}\"\"\"

            Score the answer objectively from 1.0 to 10.0 across:
            1. technical_accuracy (float 1-10)
            2. relevance (float 1-10)
            3. clarity (float 1-10)
            4. communication (float 1-10)
            5. completeness (float 1-10)

            Provide:
            - "what_was_good": list of 2-3 specific positive observations
            - "what_could_improve": list of 2-3 constructive recommendations
            - "better_answer_example": a concise, exemplary model response (STAR format if behavioral, technical structure if tech)
            - "follow_up_question": an intelligent contextual follow-up question to probe deeper
            """
            llm_res = await ai_service.generate_json(prompt, system_instruction="You are a principal engineer conducting technical interviews.")
            if llm_res:
                t_acc = float(llm_res.get("technical_accuracy", 7.0))
                rel = float(llm_res.get("relevance", 7.5))
                cla = float(llm_res.get("clarity", 7.0))
                com = float(llm_res.get("communication", 7.0))
                cmp = float(llm_res.get("completeness", 6.5))
                overall = round((t_acc + rel + cla + com + cmp) / 5.0, 1)

                return {
                    "technical_accuracy": t_acc,
                    "relevance": rel,
                    "clarity": cla,
                    "communication": com,
                    "completeness": cmp,
                    "overall_score": overall,
                    "what_was_good": llm_res.get("what_was_good", ["Clear perspective"]),
                    "what_could_improve": llm_res.get("what_could_improve", ["Add more quantitative details"]),
                    "better_answer_example": llm_res.get("better_answer_example", "A strong response would clearly state..."),
                    "follow_up_question": llm_res.get("follow_up_question", "How would that scale under load?")
                }

        # Offline heuristic scoring rubric
        # Base scores according to length and technical detail
        base_score = 6.0
        if word_count < 15:
            base_score = 3.5
        elif word_count < 40:
            base_score = 5.5
        elif word_count < 100:
            base_score = 7.5
        else:
            base_score = 8.5

        t_acc = min(9.5, base_score + (0.5 if "because" in clean_ans.lower() else 0.0))
        rel = min(9.5, base_score + (0.5 if len(clean_ans) > 60 else -0.5))
        cla = min(9.0, base_score)
        comm = min(9.0, base_score + (0.4 if "." in clean_ans else -0.5))
        compl = min(9.0, base_score + (0.5 if word_count > 60 else -1.0))
        overall = round((t_acc + rel + cla + comm + compl) / 5.0, 1)

        what_was_good = [
            "Addressed the core intent of the question directly.",
            f"Provided appropriate conceptual framing ({word_count} words)."
        ]
        what_could_improve = [
            "Structure answers using the STAR method (Situation, Task, Action, Result) for clarity.",
            "Include specific quantitative metrics or trade-offs between alternative implementations."
        ]
        better_answer = (
            f"An exemplary response should first state the core definition or engineering trade-off concisely, "
            f"illustrate it with a concrete real-world production example, and conclude by highlighting performance or scalability implications."
        )
        follow_up = f"Based on your approach, how would you test and monitor this system in production to guarantee reliability?"

        return {
            "technical_accuracy": t_acc,
            "relevance": rel,
            "clarity": cla,
            "communication": comm,
            "completeness": compl,
            "overall_score": overall,
            "what_was_good": what_was_good,
            "what_could_improve": what_could_improve,
            "better_answer_example": better_answer,
            "follow_up_question": follow_up
        }

    @staticmethod
    async def generate_question_bank(
        target_role: str,
        resume_skills: List[str],
        resume_projects: List[Dict[str, Any]],
        category: Optional[str] = None,
        force_refresh: bool = False
    ) -> List[Dict[str, Any]]:
        """
        Generate rich categorized question bank tailored to candidate's skills,
        target role, and courses with multiple questions per course.
        """
        import random
        
        # Comprehensive curated question catalog across 11 key engineering courses
        course_catalog = {
            "Frontend": [
                {
                    "question": "How does the React Virtual DOM reconciliation algorithm work, and how do React 'key' props optimize array re-rendering?",
                    "why_asked": "Evaluates fundamental understanding of UI rendering pipelines, diffing complexity, and browser repainting.",
                    "key_talking_points": [
                        "Heuristic O(n) diffing assumption vs standard O(n³) tree comparison",
                        "Fiber architecture: work-in-progress tree vs current tree",
                        "Why array index keys cause state mutation bugs when sorting or deleting items"
                    ],
                    "model_answer_outline": "Explain that React uses a Fiber tree to compute minimal DOM mutations. Virtual DOM allows batching updates. Stable unique keys allow React to track which nodes moved rather than re-creating them."
                },
                {
                    "question": "Compare Client-Side Rendering (CSR), Server-Side Rendering (SSR), and Static Site Generation (SSG). How do they affect Core Web Vitals (LCP, INP)?",
                    "why_asked": "Tests modern web architecture decisions and user-centric web performance optimization.",
                    "key_talking_points": [
                        "CSR: fast subsequent navigations, but slow initial Largest Contentful Paint (LCP)",
                        "SSR: quick TTFB and pre-rendered HTML for search indexing, requires hydration",
                        "SSG/ISR: near-instant edge caching for content that updates infrequently"
                    ],
                    "model_answer_outline": "Define each rendering model, detail how TTFB and LCP differ, mention hydration cost (Interaction to Next Paint), and give practical use cases (e-commerce catalog vs admin portal)."
                },
                {
                    "question": "What are React 18 hooks dependency rules, and how do you prevent stale closures or memory leaks in useEffect and useCallback?",
                    "why_asked": "Examines mastery of React component lifecycle and asynchronous state synchronization.",
                    "key_talking_points": [
                        "Closures capturing stale state/props across renders",
                        "Cleanup functions for timers, event listeners, and abort controllers",
                        "useMemo/useCallback memoization trade-offs"
                    ],
                    "model_answer_outline": "Explain that function components re-run on every render. Omitting dependencies leads to stale closures. Provide an example of using AbortController inside useEffect return cleanup."
                }
            ],
            "Backend": [
                {
                    "question": "How would you design a distributed rate limiter for a public REST API? Compare Token Bucket, Leaky Bucket, and Sliding Window Counter.",
                    "why_asked": "Tests system reliability, API security, and high-concurrency throttling techniques.",
                    "key_talking_points": [
                        "Token Bucket: supports bursts while enforcing steady rate limit",
                        "Sliding Window Counter: prevents boundary double-burst vulnerability",
                        "Distributed state synchronization with Redis Lua scripts to eliminate race conditions"
                    ],
                    "model_answer_outline": "Explain why single-instance in-memory limiters fail in horizontal clusters. Detail sliding window algorithm using Redis sorted sets (ZADD, ZREMRANGEBYSCORE) executed atomically via Lua scripts."
                },
                {
                    "question": "Explain the life cycle of an HTTP request through a FastAPI or Node.js asynchronous pipeline. How do you implement global error handling and CORS?",
                    "why_asked": "Validates hands-on proficiency with backend middleware chains and defensive error handling.",
                    "key_talking_points": [
                        "ASGI/Event Loop lifecycle and non-blocking I/O",
                        "Middleware layers (CORS preflight OPTIONS requests, authentication context injection)",
                        "Custom exception handlers returning standardized RFC 7807 error envelopes"
                    ],
                    "model_answer_outline": "Walk through socket acceptance, middleware execution, routing, dependency injection (FastAPI Depends), controller invocation, and response serialization."
                },
                {
                    "question": "Compare monolithic architecture vs microservices. When does network latency and distributed data consistency outweigh modularity?",
                    "why_asked": "Tests pragmatic software architecture judgment over hype-driven development.",
                    "key_talking_points": [
                        "Monolith: zero network hops, ACID database transactions, simple deployment",
                        "Microservices: independent deployment, domain boundary isolation, operational overhead",
                        "Distributed transactions: Saga pattern vs Two-Phase Commit (2PC)"
                    ],
                    "model_answer_outline": "State that early-stage products should start as modular monoliths. Microservices introduce network serialization, partial failure, distributed tracing, and eventual consistency challenges."
                }
            ],
            "Python": [
                {
                    "question": "Explain Python's Global Interpreter Lock (GIL) and how multiprocessing or async/await differs from multithreading in CPU vs I/O bound workloads.",
                    "why_asked": "Tests fundamental concurrency mechanics in Python and ability to write performant scalable code.",
                    "key_talking_points": [
                        "GIL prevents multiple native threads from executing Python bytecode simultaneously",
                        "I/O-bound tasks release the GIL during network/disk wait (asyncio or threading is effective)",
                        "CPU-bound tasks require multiprocessing or C-extensions to achieve true multi-core parallelism"
                    ],
                    "model_answer_outline": "Explain that the GIL protects CPython's reference counts from race conditions. For I/O tasks, asyncio uses a single-threaded cooperative event loop. For CPU tasks, multiprocessing spawns isolated memory processes."
                },
                {
                    "question": "How do Python generators (the `yield` keyword) work internally, and how do they optimize memory usage when streaming large datasets?",
                    "why_asked": "Evaluates memory optimization skills and understanding of iterator protocol.",
                    "key_talking_points": [
                        "Generator functions return generator objects that save execution frame state",
                        "Lazy evaluation: elements are produced on-demand via `__next__()` rather than loading full lists into RAM",
                        "Generator pipelines (`yield from`) for efficient memory-bounded stream processing"
                    ],
                    "model_answer_outline": "Explain that `yield` pauses function execution and yields a value while retaining local variable state. Contrasting loading a 10GB CSV into a list (causing OOM) with streaming line-by-line using a generator."
                },
                {
                    "question": "How does Python handle memory management? Explain reference counting, cyclic garbage collection, and generational GC.",
                    "why_asked": "Tests deep language runtime knowledge and debugging skills for memory leaks.",
                    "key_talking_points": [
                        "Reference counting is primary: deallocation occurs immediately when count hits zero",
                        "Cyclic garbage collector handles self-referential objects that reference counting misses",
                        "Generational GC (Gen 0, 1, 2) based on the weak generational hypothesis"
                    ],
                    "model_answer_outline": "Detail that every PyObject has `ob_refcnt`. When circular references occur (e.g. node.parent = parent), the cyclic GC periodically runs heuristic graph cycle detection across generations."
                }
            ],
            "AI/ML": [
                {
                    "question": "How do you detect and prevent data leakage between training, validation, and test datasets in an end-to-end ML pipeline?",
                    "why_asked": "Validates experimental rigor and prevents inflated, deceptive model accuracy metrics.",
                    "key_talking_points": [
                        "Target leakage (features including future or proxy target information)",
                        "Train-test contamination (fitting scalers/imputers before train_test_split)",
                        "Temporal leakage in time-series data: why random k-fold cross validation fails"
                    ],
                    "model_answer_outline": "State that transformations must only be fit on training partitions. Use scikit-learn Pipelines to encapsulate feature transformations. For time series, use TimeSeriesSplit or rolling forward validation."
                },
                {
                    "question": "Explain the multi-head self-attention mechanism in Transformers. How does attention computational complexity scale with sequence length?",
                    "why_asked": "Tests modern deep learning architecture and foundational generative AI knowledge.",
                    "key_talking_points": [
                        "Query, Key, Value vector projections from input tokens",
                        "Softmax((Q * K^T) / sqrt(d_k)) * V attention formula",
                        "Quadratic O(N^2) complexity with sequence length and optimizations (FlashAttention)"
                    ],
                    "model_answer_outline": "Explain that attention allows each token to weight contextual relationships with all other tokens. Q and K compute similarity scores scaled by sqrt(d_k), normalized by Softmax, and applied to Values."
                },
                {
                    "question": "What strategies do you employ to diagnose and remediate overfitting versus underfitting in deep neural networks?",
                    "why_asked": "Evaluates practical model debugging and regularization skills.",
                    "key_talking_points": [
                        "Comparing training vs validation loss curves (variance vs bias diagnosis)",
                        "Regularization methods: Dropout, L1/L2 weight decay, Data Augmentation",
                        "Early stopping with patience and model checkpointing"
                    ],
                    "model_answer_outline": "If validation loss diverges while training loss decreases, the model is overfitting (high variance). Remediate with dropout, weight decay, early stopping, and data augmentation. If both losses plateau high, increase model capacity."
                }
            ],
            "DSA": [
                {
                    "question": "How do you detect a cycle in a directed graph versus an undirected graph? Explain Kahn's algorithm and Depth-First Search.",
                    "why_asked": "Tests core graph theory algorithms, topological sorting, and recursion depth control.",
                    "key_talking_points": [
                        "Directed graphs: 3-color DFS (unvisited, visiting, visited) or Kahn's in-degree BFS",
                        "Undirected graphs: DFS with parent tracking or Disjoint Set Union (Union-Find)",
                        "Time and space complexity: O(V + E) time, O(V) space"
                    ],
                    "model_answer_outline": "For directed graphs, a cycle exists if DFS reaches a node currently in the recursion stack (visiting state). Kahn's algorithm computes in-degrees; if topological sort count < total vertices, a cycle is present."
                },
                {
                    "question": "Explain the difference between Dynamic Programming with Top-Down Memoization and Bottom-Up Tabulation. How do you analyze overlapping subproblems?",
                    "why_asked": "Assesses dynamic programming problem solving and space complexity trade-offs.",
                    "key_talking_points": [
                        "Top-down: recursive with hash/array memoization cache, intuitive transition formula",
                        "Bottom-up: iterative loop table building, avoids call stack overflow overhead",
                        "State compression: reducing 2D DP matrices to 1D when only previous row is needed"
                    ],
                    "model_answer_outline": "Top-down memoization explores only reachable subproblems but incurs recursion overhead. Bottom-up builds answers sequentially from base cases and often allows O(1) space optimization."
                },
                {
                    "question": "How does a self-balancing Binary Search Tree (like a Red-Black Tree or AVL Tree) guarantee O(log n) operations?",
                    "why_asked": "Tests data structure invariants and worst-case algorithmic guarantees.",
                    "key_talking_points": [
                        "Unbalanced BST degenerates to linked list with O(n) worst-case time",
                        "Tree rotations (left and right) preserve in-order traversal while balancing tree height",
                        "Red-Black Tree invariants: black height equality and no two consecutive red nodes"
                    ],
                    "model_answer_outline": "Explain that standard BSTs degenerate on sorted input. Self-balancing trees enforce height balance invariants through local tree rotations during inserts and deletes, keeping height bounded to O(log n)."
                }
            ],
            "Databases": [
                {
                    "question": "What is the difference between a B-Tree clustered index and a non-clustered index? When can an index degrade database performance?",
                    "why_asked": "Tests query optimization, storage engine layouts, and execution plan tuning.",
                    "key_talking_points": [
                        "Clustered index defines physical row order on disk (only 1 per table)",
                        "Non-clustered index contains pointer/key lookup back to table (bookmark lookup)",
                        "Write degradation: inserts/updates require index tree maintenance and potential page splits"
                    ],
                    "model_answer_outline": "A clustered index stores data pages directly in the leaf nodes. Non-clustered indexes store search keys with pointers. Unused indexes slow down write operations because every INSERT/UPDATE/DELETE must update all indexes."
                },
                {
                    "question": "Explain database ACID properties and compare SQL transaction isolation levels. What are dirty reads, non-repeatable reads, and phantom reads?",
                    "why_asked": "Evaluates relational transaction integrity and concurrency control knowledge.",
                    "key_talking_points": [
                        "Atomicity, Consistency, Isolation, Durability definitions",
                        "Read Uncommitted vs Read Committed vs Repeatable Read vs Serializable",
                        "Multi-Version Concurrency Control (MVCC) vs pessimistic row/table locking"
                    ],
                    "model_answer_outline": "Explain that isolation levels trade throughput for consistency. Read Committed prevents dirty reads. Repeatable Read prevents non-repeatable reads. Serializable prevents phantom reads via predicate locking or snapshot isolation."
                },
                {
                    "question": "When would you choose a NoSQL database (MongoDB / DynamoDB) over a relational database (PostgreSQL)? How do you model one-to-many relationships in each?",
                    "why_asked": "Validates database selection criteria based on schema flexibility and scaling requirements.",
                    "key_talking_points": [
                        "RDBMS: complex joins, ACID compliance, strict normalization, relational integrity",
                        "NoSQL: horizontal sharding, flexible schemas, document embedding vs referencing",
                        "Data access patterns driving document denormalization"
                    ],
                    "model_answer_outline": "Choose PostgreSQL for financial/transactional systems requiring strict referential integrity. Choose NoSQL for high-write velocity or variable document structures where data can be embedded in single atomic documents."
                }
            ],
            "DevOps & Cloud": [
                {
                    "question": "Explain Docker layer caching and how to structure a multi-stage Dockerfile to minimize image size and speed up CI/CD rebuilds.",
                    "why_asked": "Tests containerization best practices and deployment pipeline optimization.",
                    "key_talking_points": [
                        "Each RUN, COPY, ADD instruction creates an immutable image layer",
                        "Order matters: place slow-changing dependencies (package.json / requirements.txt) before source code",
                        "Multi-stage builds: compile in heavy build image, copy artifacts to lightweight alpine/distroless runner"
                    ],
                    "model_answer_outline": "Explain that Docker caches layers until a step changes. Copy dependencies first, install packages, and copy application code last. Use multi-stage builds to discard compilers and dev tools from final image."
                },
                {
                    "question": "How does Kubernetes manage pod self-healing, rolling updates, and Horizontal Pod Autoscaling (HPA)?",
                    "why_asked": "Evaluates container orchestration and cloud-native infrastructure management.",
                    "key_talking_points": [
                        "Kubelet restart policy and liveness/readiness probes",
                        "RollingUpdate deployment strategy with maxSurge and maxUnavailable guarantees",
                        "HPA queries Metrics Server to autoscale pod replicas based on CPU or custom Prometheus metrics"
                    ],
                    "model_answer_outline": "Liveness probes trigger container restarts if unhealthy; readiness probes gate traffic until initialized. Rolling updates gradually replace old ReplicaSet pods with new pods to guarantee zero downtime."
                }
            ],
            "System Design": [
                {
                    "question": "Design a high-volume URL shortening service (like Bitly). How would you generate unique 7-character hashes and handle 100M daily clicks?",
                    "why_asked": "Classic system design problem testing capacity estimation, hashing, caching, and partitioning.",
                    "key_talking_points": [
                        "Base62 encoding (62^7 = ~3.5 trillion URLs) using distributed counter or pre-generated key generator (KGS)",
                        "Redis LRU cache for 80/20 read/write traffic distribution",
                        "Database sharding by hash prefix with 301 vs 302 HTTP redirect trade-offs"
                    ],
                    "model_answer_outline": "Estimate 100M reads/day (~1200 QPS). Use Base62 encoding with a Key-Generation Service (KGS) to avoid hash collisions. Cache top 20% URLs in Redis. Use 302 redirects for analytics tracking, 301 for permanent client caching."
                },
                {
                    "question": "Explain the CAP Theorem and how distributed databases like Cassandra or DynamoDB handle eventual consistency.",
                    "why_asked": "Tests distributed systems theory and partition-tolerance trade-offs.",
                    "key_talking_points": [
                        "Consistency vs Availability in the presence of network Partitions (P is mandatory in networks)",
                        "Quorum reads and writes: R + W > N ensures strong consistency in tunable databases",
                        "Vector clocks and read repair for resolving conflicting concurrent writes"
                    ],
                    "model_answer_outline": "Networks will experience partitions, so systems must choose CP (refuse writes to maintain consistency) or AP (accept writes with eventual consistency). Tunable databases allow configuring read/write quorum."
                }
            ],
            "Java & OOP": [
                {
                    "question": "Explain the SOLID design principles with concrete scenarios. Which principle is most commonly violated in enterprise codebases?",
                    "why_asked": "Tests object-oriented design maturity, modularity, and clean code principles.",
                    "key_talking_points": [
                        "Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion",
                        "Open/Closed principle enables extending functionality without mutating existing tested classes",
                        "Dependency Inversion decoupling high-level modules from low-level implementations using interfaces"
                    ],
                    "model_answer_outline": "Define each principle briefly. Single Responsibility and Open/Closed are most frequently violated when 'god classes' accumulate business logic. Contrast concrete class coupling with interface-based dependency injection."
                },
                {
                    "question": "How does the Java Virtual Machine (JVM) handle Garbage Collection across Young and Old generations (Minor vs Major GC)?",
                    "why_asked": "Tests deep JVM performance tuning, memory pools, and garbage collector selection.",
                    "key_talking_points": [
                        "Heap division: Eden space, Survivor S0/S1 spaces, Tenured Old generation, Metaspace",
                        "Minor GC runs in Young Gen (copying collector); surviving objects age into Old Gen",
                        "Major/Full GC (Mark-Sweep-Compact / G1 / ZGC) collects Old Gen with stop-the-world pauses"
                    ],
                    "model_answer_outline": "Explain that most objects die young. Minor GC quickly reclaims Eden space. Objects that survive survivor cycles are promoted to Old Gen, which requires generational collectors like G1 or ZGC to minimize pauses."
                }
            ],
            "Behavioral": [
                {
                    "question": "Tell me about a time you had to deliver an engineering feature when requirements were ambiguous or changing rapidly. How did you align with stakeholders?",
                    "why_asked": "Assesses adaptability, communication, and ownership in fast-moving engineering environments.",
                    "key_talking_points": [
                        "Situation: unclear scope or conflicting stakeholder priorities",
                        "Action: scheduled quick alignment sync, created low-fidelity prototype or RFC",
                        "Result: delivered incremental MVP on schedule and validated actual user needs"
                    ],
                    "model_answer_outline": "Use the STAR format: Describe the ambiguous challenge, how you broke it into smaller testable milestones, actively clarified expectations with teammates, and achieved successful delivery."
                },
                {
                    "question": "Describe a scenario where you strongly disagreed with a teammate or senior engineer on an architectural decision. How did you resolve the conflict?",
                    "why_asked": "Evaluates teamwork, intellectual humility, emotional intelligence, and data-driven debate.",
                    "key_talking_points": [
                        "Focus on technical trade-offs rather than ego or personal preference",
                        "Creating a lightweight proof-of-concept (PoC) or benchmark to ground decisions in facts",
                        "Committing fully to the team's chosen path once a decision was made (Disagree and Commit)"
                    ],
                    "model_answer_outline": "Explain the technical divergence (e.g. database choice or API contract), how you ran a benchmark to compare latencies, listened to their perspective on maintainability, and achieved consensus."
                }
            ]
        }

        # If live AI is available and force_refresh is requested, attempt dynamic generation
        if force_refresh and ai_service.is_live_ai_available():
            try:
                cat_prompt = f" for the '{category}' topic" if category and category != "All" else ""
                prompt = f"""
                Generate 6 distinct, rigorous interview questions{cat_prompt} for a candidate preparing for the role of '{target_role}'.
                Return a JSON array of objects with the exact schema:
                [
                  {{
                    "question": "Detailed technical or behavioral question text",
                    "category": "{category if category and category != 'All' else 'Technical'}",
                    "why_asked": "Why recruiters ask this",
                    "key_talking_points": ["Point 1", "Point 2", "Point 3"],
                    "model_answer_outline": "Outline of a 10/10 model answer"
                  }}
                ]
                """
                ai_items = await ai_service.generate_json(prompt, system_instruction="You are an expert tech recruiter and principal software engineer.")
                if isinstance(ai_items, list) and len(ai_items) > 0:
                    result = []
                    for idx, q in enumerate(ai_items):
                        result.append({
                            "id": idx + 1,
                            "question": q.get("question", ""),
                            "category": q.get("category", category or "Technical"),
                            "why_asked": q.get("why_asked", "Evaluates fundamental competency."),
                            "key_talking_points": q.get("key_talking_points", ["Core concept", "Practical application"]),
                            "model_answer_outline": q.get("model_answer_outline", "Provide a structured answer with technical details.")
                        })
                    return result
            except Exception:
                pass  # Fall back to curated catalog

        # Deterministic / Curated generation with randomization on refresh
        items = []
        qid = 1

        # 1. Include personalized project questions if resume projects exist
        if resume_projects and len(resume_projects) > 0 and (not category or category == "All" or category == "Projects"):
            for p in resume_projects[:2]:
                title = p.get("title", "Project")
                techs = p.get("technologies", [])
                tech_str = techs[0] if techs else "the tech stack"
                items.append({
                    "id": qid,
                    "question": f"In your project '{title}', you chose to build with {tech_str}. What architectural trade-offs did you consider against alternative solutions, and how did you test its reliability?",
                    "category": "Projects",
                    "why_asked": "Evaluates genuine ownership, decision-making, and architectural depth on personal resume projects.",
                    "key_talking_points": [
                        f"Why {tech_str} fit this specific constraint",
                        "Challenges encountered during implementation and debugging",
                        "Performance benchmarks or end-user feedback"
                    ],
                    "model_answer_outline": f"State the project goal, explain why {tech_str} was selected over alternatives, discuss a major engineering obstacle you resolved, and mention quantitative outcomes."
                })
                qid += 1

        # 2. Select questions from course catalog
        selected_courses = [category] if (category and category != "All" and category in course_catalog) else list(course_catalog.keys())
        
        # When force_refresh is requested or by default, randomize within each course
        for course in selected_courses:
            pool = list(course_catalog[course])
            if force_refresh:
                random.shuffle(pool)
            
            # Take 2-3 questions per course to ensure rich content
            sample_size = min(3, len(pool)) if (category and category != "All") else min(2, len(pool))
            chosen = pool[:sample_size]
            
            for q in chosen:
                items.append({
                    "id": qid,
                    "question": q["question"],
                    "category": course,
                    "why_asked": q["why_asked"],
                    "key_talking_points": q["key_talking_points"],
                    "model_answer_outline": q["model_answer_outline"]
                })
                qid += 1

        return items

interview_service = InterviewService()

