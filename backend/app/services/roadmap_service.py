from typing import List, Dict, Any, Optional
from app.services.ai_service import ai_service

# Standard industry benchmarks for college students / entry-level roles
ROLE_SKILL_PROFILES: Dict[str, Dict[str, Any]] = {
    "AI/ML Engineer": {
        "required_skills": [
            "Python", "NumPy", "Pandas", "Scikit-Learn", "PyTorch", "TensorFlow",
            "Deep Learning", "Transformers", "FastAPI", "Docker", "Git", "SQL", "Mathematics & Statistics"
        ],
        "default_phases": [
            {
                "phase_number": 1,
                "phase_name": "Phase 1 — Core Math & Python Foundations",
                "items": [
                    {
                        "skill_name": "Python for Scientific Computing & Linear Algebra",
                        "priority": "High",
                        "difficulty": "Beginner",
                        "estimated_hours": 20,
                        "prerequisites": ["Basic Python"],
                        "project_idea": "Build a custom matrix manipulation engine and linear regression optimizer from scratch using pure NumPy."
                    },
                    {
                        "skill_name": "Exploratory Data Analysis with Pandas & Seaborn",
                        "priority": "High",
                        "difficulty": "Beginner",
                        "estimated_hours": 15,
                        "prerequisites": ["Python", "NumPy"],
                        "project_idea": "Perform end-to-end exploratory analysis and data cleaning on the Kaggle Titanic & Housing datasets."
                    }
                ]
            },
            {
                "phase_number": 2,
                "phase_name": "Phase 2 — Classical Machine Learning",
                "items": [
                    {
                        "skill_name": "Supervised & Unsupervised Learning with Scikit-Learn",
                        "priority": "High",
                        "difficulty": "Intermediate",
                        "estimated_hours": 30,
                        "prerequisites": ["NumPy", "Pandas"],
                        "project_idea": "Develop a Customer Churn Predictor with cross-validation, hyperparameter tuning, and ROC-AUC analysis."
                    },
                    {
                        "skill_name": "SQL & Relational Data Extraction for ML",
                        "priority": "Medium",
                        "difficulty": "Beginner",
                        "estimated_hours": 15,
                        "prerequisites": ["Basic Databases"],
                        "project_idea": "Write complex analytical SQL queries with window functions to construct ML training feature stores."
                    }
                ]
            },
            {
                "phase_number": 3,
                "phase_name": "Phase 3 — Deep Learning & Modern NLP",
                "items": [
                    {
                        "skill_name": "PyTorch Neural Networks & Backpropagation",
                        "priority": "High",
                        "difficulty": "Intermediate",
                        "estimated_hours": 35,
                        "prerequisites": ["Python", "Linear Algebra"],
                        "project_idea": "Implement a Convolutional Neural Network (CNN) for multi-class image classification on CIFAR-10."
                    },
                    {
                        "skill_name": "Transformers, Embeddings & LLM Fine-Tuning",
                        "priority": "High",
                        "difficulty": "Advanced",
                        "estimated_hours": 35,
                        "prerequisites": ["PyTorch", "NLP Fundamentals"],
                        "project_idea": "Build a Retrieval-Augmented Generation (RAG) system over technical documentation using Hugging Face and ChromaDB."
                    }
                ]
            },
            {
                "phase_number": 4,
                "phase_name": "Phase 4 — Model Deployment & MLOps",
                "items": [
                    {
                        "skill_name": "FastAPI Model Serving & Async Endpoints",
                        "priority": "High",
                        "difficulty": "Intermediate",
                        "estimated_hours": 20,
                        "prerequisites": ["Python", "REST APIs"],
                        "project_idea": "Wrap a trained PyTorch model in high-performance asynchronous REST API endpoints with request validation."
                    },
                    {
                        "skill_name": "Docker Containerization & Cloud Deployment",
                        "priority": "High",
                        "difficulty": "Intermediate",
                        "estimated_hours": 20,
                        "prerequisites": ["Linux / CLI"],
                        "project_idea": "Containerize the model API into a multi-stage Docker image and deploy to AWS ECS or Google Cloud Run."
                    }
                ]
            },
            {
                "phase_number": 5,
                "phase_name": "Phase 5 — Industry Capstone Project",
                "items": [
                    {
                        "skill_name": "Production Multi-Modal AI Application",
                        "priority": "High",
                        "difficulty": "Advanced",
                        "estimated_hours": 45,
                        "prerequisites": ["PyTorch", "FastAPI", "Docker"],
                        "project_idea": "Design an end-to-end AI copilot with speech-to-text, vector search, streaming LLM inference, and CI/CD testing."
                    }
                ]
            }
        ]
    },
    "Software Developer": {
        "required_skills": [
            "Data Structures & Algorithms", "Java", "Python", "SQL", "PostgreSQL",
            "REST APIs", "Git", "System Design", "Docker", "Unit Testing", "CI/CD"
        ],
        "default_phases": [
            {
                "phase_number": 1,
                "phase_name": "Phase 1 — Core CS & Problem Solving",
                "items": [
                    {
                        "skill_name": "Data Structures & Algorithmic Problem Solving",
                        "priority": "High",
                        "difficulty": "Intermediate",
                        "estimated_hours": 40,
                        "prerequisites": ["Language syntax"],
                        "project_idea": "Master 75 essential LeetCode patterns (Arrays, Trees, Graphs, Dynamic Programming) and document time complexities."
                    },
                    {
                        "skill_name": "Object-Oriented Design & Clean Code Principles",
                        "priority": "High",
                        "difficulty": "Beginner",
                        "estimated_hours": 20,
                        "prerequisites": ["Java or Python"],
                        "project_idea": "Implement standard design patterns (Factory, Strategy, Observer) in an interactive parking lot simulator."
                    }
                ]
            },
            {
                "phase_number": 2,
                "phase_name": "Phase 2 — Backend Systems & Databases",
                "items": [
                    {
                        "skill_name": "Relational Database Design & PostgreSQL Optimization",
                        "priority": "High",
                        "difficulty": "Intermediate",
                        "estimated_hours": 25,
                        "prerequisites": ["Basic SQL"],
                        "project_idea": "Design a normalized database schema with B-Tree indexes, transactions, and foreign keys for an e-commerce platform."
                    },
                    {
                        "skill_name": "RESTful API Architecture & Validation",
                        "priority": "High",
                        "difficulty": "Intermediate",
                        "estimated_hours": 25,
                        "prerequisites": ["Python / Java"],
                        "project_idea": "Develop a multi-tenant backend service with pagination, JWT authentication, and rate limiting."
                    }
                ]
            },
            {
                "phase_number": 3,
                "phase_name": "Phase 3 — Caching & Asynchronous Processing",
                "items": [
                    {
                        "skill_name": "Redis Caching & Session Store",
                        "priority": "Medium",
                        "difficulty": "Intermediate",
                        "estimated_hours": 15,
                        "prerequisites": ["Backend fundamentals"],
                        "project_idea": "Integrate Redis cache-aside strategy into the backend to reduce database query load by 80%."
                    },
                    {
                        "skill_name": "Message Queues & Background Workers",
                        "priority": "Medium",
                        "difficulty": "Advanced",
                        "estimated_hours": 20,
                        "prerequisites": ["REST APIs"],
                        "project_idea": "Implement background email notifications and PDF invoice generation using Celery or RabbitMQ."
                    }
                ]
            },
            {
                "phase_number": 4,
                "phase_name": "Phase 4 — DevOps & Containerization",
                "items": [
                    {
                        "skill_name": "Docker & Multi-Container Docker Compose",
                        "priority": "High",
                        "difficulty": "Intermediate",
                        "estimated_hours": 20,
                        "prerequisites": ["Linux CLI"],
                        "project_idea": "Containerize the frontend, backend, PostgreSQL, and Redis stack into an orchestrated docker-compose environment."
                    },
                    {
                        "skill_name": "Automated Testing & GitHub Actions CI/CD",
                        "priority": "High",
                        "difficulty": "Intermediate",
                        "estimated_hours": 15,
                        "prerequisites": ["Git"],
                        "project_idea": "Configure a GitHub Actions pipeline that automatically executes unit tests and linter checks on every pull request."
                    }
                ]
            },
            {
                "phase_number": 5,
                "phase_name": "Phase 5 — Full-Stack Capstone & System Design",
                "items": [
                    {
                        "skill_name": "Distributed Scalable Web Platform",
                        "priority": "High",
                        "difficulty": "Advanced",
                        "estimated_hours": 40,
                        "prerequisites": ["Full Stack Skills"],
                        "project_idea": "Architect and deploy a real-time collaborative application (e.g. collaborative document editor or kanban board)."
                    }
                ]
            }
        ]
    },
    "Data Analyst": {
        "required_skills": [
            "SQL", "Python", "Pandas", "Tableau", "Power BI", "Excel",
            "A/B Testing", "Data Visualization", "Statistics", "ETL"
        ],
        "default_phases": [
            {
                "phase_number": 1,
                "phase_name": "Phase 1 — Advanced SQL & Data Extraction",
                "items": [
                    {
                        "skill_name": "Advanced SQL (Window Functions & CTEs)",
                        "priority": "High",
                        "difficulty": "Intermediate",
                        "estimated_hours": 25,
                        "prerequisites": ["Basic SQL"],
                        "project_idea": "Write cohort retention and user lifecycle analysis queries using RANK, LEAD/LAG, and recursive CTEs."
                    }
                ]
            },
            {
                "phase_number": 2,
                "phase_name": "Phase 2 — Python & Statistical Analysis",
                "items": [
                    {
                        "skill_name": "Data Wrangling with Pandas & NumPy",
                        "priority": "High",
                        "difficulty": "Intermediate",
                        "estimated_hours": 30,
                        "prerequisites": ["Python"],
                        "project_idea": "Clean, reshape, and normalize an unformatted 500,000-row retail sales dataset."
                    },
                    {
                        "skill_name": "Statistical Hypothesis Testing & A/B Testing",
                        "priority": "High",
                        "difficulty": "Intermediate",
                        "estimated_hours": 20,
                        "prerequisites": ["Basic Stats"],
                        "project_idea": "Design an A/B test report analyzing p-values, confidence intervals, and statistical power for a website conversion experiment."
                    }
                ]
            },
            {
                "phase_number": 3,
                "phase_name": "Phase 3 — Business Intelligence & Dashboards",
                "items": [
                    {
                        "skill_name": "Executive Dashboarding in Power BI or Tableau",
                        "priority": "High",
                        "difficulty": "Intermediate",
                        "estimated_hours": 25,
                        "prerequisites": ["Data Modeling"],
                        "project_idea": "Construct an interactive executive sales KPI dashboard with drill-down filters and automated data refresh."
                    }
                ]
            },
            {
                "phase_number": 4,
                "phase_name": "Phase 4 — Data Pipeline & Automation",
                "items": [
                    {
                        "skill_name": "Automated ETL Pipelines with Python & Airflow/Cron",
                        "priority": "Medium",
                        "difficulty": "Intermediate",
                        "estimated_hours": 20,
                        "prerequisites": ["Python", "SQL"],
                        "project_idea": "Build a daily scheduled script that ingests public stock or weather API data, transforms it, and upserts to a warehouse."
                    }
                ]
            },
            {
                "phase_number": 5,
                "phase_name": "Phase 5 — Business Analytics Case Study",
                "items": [
                    {
                        "skill_name": "Comprehensive Financial or Product Analytics Story",
                        "priority": "High",
                        "difficulty": "Advanced",
                        "estimated_hours": 30,
                        "prerequisites": ["SQL", "BI", "Statistics"],
                        "project_idea": "Publish a complete case study with executive slide deck uncovering key drivers of customer churn and revenue growth."
                    }
                ]
            }
        ]
    },
    "Frontend Engineer": {
        "required_skills": [
            "HTML5", "CSS3", "JavaScript", "TypeScript", "React", "Next.js",
            "Tailwind CSS", "Redux / Zustand", "Git", "REST APIs", "Web Performance"
        ],
        "default_phases": [
            {
                "phase_number": 1,
                "phase_name": "Phase 1 — Modern JavaScript & Web Fundamentals",
                "items": [
                    {
                        "skill_name": "ES6+ JavaScript, DOM Manipulation & Event Loop",
                        "priority": "High",
                        "difficulty": "Beginner",
                        "estimated_hours": 20,
                        "prerequisites": ["Basic Programming"],
                        "project_idea": "Build an interactive browser game using vanilla JavaScript and Canvas with zero external libraries."
                    },
                    {
                        "skill_name": "Modern Responsive Layouts with Flexbox & Grid",
                        "priority": "High",
                        "difficulty": "Beginner",
                        "estimated_hours": 15,
                        "prerequisites": ["HTML/CSS"],
                        "project_idea": "Recreate a pixel-perfect, fully responsive landing page for a modern fintech product."
                    }
                ]
            },
            {
                "phase_number": 2,
                "phase_name": "Phase 2 — React 18 & Component Architecture",
                "items": [
                    {
                        "skill_name": "React Component Lifecycle, Hooks & Custom Hooks",
                        "priority": "High",
                        "difficulty": "Intermediate",
                        "estimated_hours": 30,
                        "prerequisites": ["JavaScript ES6+"],
                        "project_idea": "Develop a multi-view kanban task management board with custom drag-and-drop hooks and local persistence."
                    },
                    {
                        "skill_name": "Modern CSS with Tailwind CSS & Motion Effects",
                        "priority": "Medium",
                        "difficulty": "Beginner",
                        "estimated_hours": 15,
                        "prerequisites": ["CSS Basics"],
                        "project_idea": "Style a complete design system with dark mode toggle and micro-interactions."
                    }
                ]
            },
            {
                "phase_number": 3,
                "phase_name": "Phase 3 — TypeScript & Next.js Architecture",
                "items": [
                    {
                        "skill_name": "TypeScript Type Safety & Generics in React",
                        "priority": "High",
                        "difficulty": "Intermediate",
                        "estimated_hours": 25,
                        "prerequisites": ["React", "JavaScript"],
                        "project_idea": "Refactor a JavaScript React codebase to strict TypeScript with 100% type coverage."
                    },
                    {
                        "skill_name": "Next.js App Router, SSR & Server Components",
                        "priority": "High",
                        "difficulty": "Intermediate",
                        "estimated_hours": 25,
                        "prerequisites": ["React", "TypeScript"],
                        "project_idea": "Build a high-performance blog platform with incremental static regeneration and dynamic OG image generation."
                    }
                ]
            },
            {
                "phase_number": 4,
                "phase_name": "Phase 4 — State Management & Performance",
                "items": [
                    {
                        "skill_name": "Global State with Zustand & React Query",
                        "priority": "High",
                        "difficulty": "Intermediate",
                        "estimated_hours": 20,
                        "prerequisites": ["React Hooks"],
                        "project_idea": "Implement optimistic UI updates and server cache invalidation for an e-commerce shopping cart."
                    },
                    {
                        "skill_name": "Core Web Vitals Optimization & Bundle Splitting",
                        "priority": "High",
                        "difficulty": "Advanced",
                        "estimated_hours": 15,
                        "prerequisites": ["Next.js"],
                        "project_idea": "Audit and optimize a web application to achieve a 95+ Google Lighthouse performance score."
                    }
                ]
            },
            {
                "phase_number": 5,
                "phase_name": "Phase 5 — Production SaaS Frontend Capstone",
                "items": [
                    {
                        "skill_name": "Enterprise Dashboard with Charts & Testing",
                        "priority": "High",
                        "difficulty": "Advanced",
                        "estimated_hours": 35,
                        "prerequisites": ["React", "TypeScript", "Next.js"],
                        "project_idea": "Architect and deploy an enterprise SaaS analytics dashboard with automated Vitest/Playwright tests."
                    }
                ]
            }
        ]
    },
    "Backend Developer": {
        "required_skills": [
            "Python", "FastAPI", "Node.js", "PostgreSQL", "Redis",
            "Docker", "REST APIs", "Microservices", "System Design", "Git"
        ],
        "default_phases": [
            {
                "phase_number": 1,
                "phase_name": "Phase 1 — Core Backend Architecture & APIs",
                "items": [
                    {
                        "skill_name": "Asynchronous Backend API Development with FastAPI",
                        "priority": "High",
                        "difficulty": "Intermediate",
                        "estimated_hours": 25,
                        "prerequisites": ["Python"],
                        "project_idea": "Build a robust RESTful API with Pydantic request validation, dependency injection, and automatic OpenAPI docs."
                    }
                ]
            },
            {
                "phase_number": 2,
                "phase_name": "Phase 2 — Relational Databases & Query Optimization",
                "items": [
                    {
                        "skill_name": "PostgreSQL Schema Design & B-Tree Indexing",
                        "priority": "High",
                        "difficulty": "Intermediate",
                        "estimated_hours": 25,
                        "prerequisites": ["Basic SQL"],
                        "project_idea": "Design an e-commerce relational schema handling concurrent inventory deductions with database transactions."
                    }
                ]
            },
            {
                "phase_number": 3,
                "phase_name": "Phase 3 — Caching, Security & Authentication",
                "items": [
                    {
                        "skill_name": "JWT Authentication, Bcrypt & Role-Based Access Control",
                        "priority": "High",
                        "difficulty": "Intermediate",
                        "estimated_hours": 20,
                        "prerequisites": ["FastAPI / Express"],
                        "project_idea": "Implement secure user registration, password reset flows, refresh token rotation, and RBAC middleware."
                    },
                    {
                        "skill_name": "High-Throughput In-Memory Caching with Redis",
                        "priority": "High",
                        "difficulty": "Intermediate",
                        "estimated_hours": 15,
                        "prerequisites": ["Database basics"],
                        "project_idea": "Implement a distributed rate limiter and cache-aside query layer reducing database reads by 85%."
                    }
                ]
            },
            {
                "phase_number": 4,
                "phase_name": "Phase 4 — Asynchronous Message Queues & Docker",
                "items": [
                    {
                        "skill_name": "Background Task Workers with Celery & RabbitMQ",
                        "priority": "High",
                        "difficulty": "Advanced",
                        "estimated_hours": 25,
                        "prerequisites": ["Redis", "Backend API"],
                        "project_idea": "Develop an asynchronous video transcoding and PDF generation worker pipeline with retry exponential backoff."
                    }
                ]
            },
            {
                "phase_number": 5,
                "phase_name": "Phase 5 — Distributed Microservices Capstone",
                "items": [
                    {
                        "skill_name": "High-Concurrency Scalable Backend Architecture",
                        "priority": "High",
                        "difficulty": "Advanced",
                        "estimated_hours": 35,
                        "prerequisites": ["FastAPI", "Docker", "PostgreSQL"],
                        "project_idea": "Architect and load-test a distributed booking system capable of sustaining 5,000 requests per second."
                    }
                ]
            }
        ]
    },
    "Full Stack Developer": {
        "required_skills": [
            "React", "TypeScript", "Node.js", "Python", "FastAPI",
            "PostgreSQL", "MongoDB", "Tailwind CSS", "Docker", "Git", "REST APIs"
        ],
        "default_phases": [
            {
                "phase_number": 1,
                "phase_name": "Phase 1 — Frontend Interface & State",
                "items": [
                    {
                        "skill_name": "React & TypeScript Component Systems",
                        "priority": "High",
                        "difficulty": "Intermediate",
                        "estimated_hours": 25,
                        "prerequisites": ["HTML/CSS/JS"],
                        "project_idea": "Build a responsive frontend web application with reusable component libraries and dark mode."
                    }
                ]
            },
            {
                "phase_number": 2,
                "phase_name": "Phase 2 — REST API & Server Logic",
                "items": [
                    {
                        "skill_name": "RESTful Server APIs with FastAPI or Express",
                        "priority": "High",
                        "difficulty": "Intermediate",
                        "estimated_hours": 25,
                        "prerequisites": ["Python / JavaScript"],
                        "project_idea": "Build a full REST API with JWT security and CRUD operations matching frontend schemas."
                    }
                ]
            },
            {
                "phase_number": 3,
                "phase_name": "Phase 3 — Database Integration & ORM",
                "items": [
                    {
                        "skill_name": "Relational Data Modeling with PostgreSQL & SQLAlchemy/Prisma",
                        "priority": "High",
                        "difficulty": "Intermediate",
                        "estimated_hours": 25,
                        "prerequisites": ["SQL"],
                        "project_idea": "Connect frontend and backend to a normalized PostgreSQL database with automated migrations."
                    }
                ]
            },
            {
                "phase_number": 4,
                "phase_name": "Phase 4 — Authentication, Docker & CI/CD",
                "items": [
                    {
                        "skill_name": "Full Stack Containerization & Deployments",
                        "priority": "High",
                        "difficulty": "Intermediate",
                        "estimated_hours": 20,
                        "prerequisites": ["Docker"],
                        "project_idea": "Dockerize the client and server into orchestrated containers with GitHub Actions automated testing."
                    }
                ]
            },
            {
                "phase_number": 5,
                "phase_name": "Phase 5 — Production SaaS Capstone",
                "items": [
                    {
                        "skill_name": "Full-Featured SaaS Web Application",
                        "priority": "High",
                        "difficulty": "Advanced",
                        "estimated_hours": 40,
                        "prerequisites": ["React", "Backend", "PostgreSQL"],
                        "project_idea": "Deploy a complete multi-tenant SaaS application with user billing, analytics, and interactive dashboard."
                    }
                ]
            }
        ]
    },
    "Data Scientist": {
        "required_skills": [
            "Python", "Pandas", "NumPy", "Statistics", "Machine Learning",
            "Scikit-Learn", "PyTorch", "Data Visualization", "SQL", "Feature Engineering"
        ],
        "default_phases": [
            {
                "phase_number": 1,
                "phase_name": "Phase 1 — Math, Statistics & Data Manipulation",
                "items": [
                    {
                        "skill_name": "Inferential Statistics & Hypothesis Testing",
                        "priority": "High",
                        "difficulty": "Intermediate",
                        "estimated_hours": 25,
                        "prerequisites": ["Mathematics"],
                        "project_idea": "Conduct rigorous statistical significance testing (t-tests, ANOVA, Chi-Square) on clinical or user trial data."
                    }
                ]
            },
            {
                "phase_number": 2,
                "phase_name": "Phase 2 — Predictive Machine Learning",
                "items": [
                    {
                        "skill_name": "Ensemble Methods with XGBoost & LightGBM",
                        "priority": "High",
                        "difficulty": "Intermediate",
                        "estimated_hours": 30,
                        "prerequisites": ["Scikit-Learn"],
                        "project_idea": "Build a financial fraud detection model handling extreme class imbalance with SMOTE and precision-recall tuning."
                    }
                ]
            },
            {
                "phase_number": 3,
                "phase_name": "Phase 3 — Deep Learning & Representation",
                "items": [
                    {
                        "skill_name": "PyTorch Neural Networks & Embeddings",
                        "priority": "High",
                        "difficulty": "Advanced",
                        "estimated_hours": 35,
                        "prerequisites": ["Python", "Linear Algebra"],
                        "project_idea": "Train a collaborative filtering recommendation engine using neural embeddings on user-item interaction matrices."
                    }
                ]
            },
            {
                "phase_number": 4,
                "phase_name": "Phase 4 — Model Validation & Interpretability",
                "items": [
                    {
                        "skill_name": "Explainable AI (SHAP & LIME)",
                        "priority": "High",
                        "difficulty": "Intermediate",
                        "estimated_hours": 20,
                        "prerequisites": ["ML Models"],
                        "project_idea": "Generate feature attribution explanations for black-box credit risk models to satisfy regulatory compliance."
                    }
                ]
            },
            {
                "phase_number": 5,
                "phase_name": "Phase 5 — End-to-End Data Science Project",
                "items": [
                    {
                        "skill_name": "Production ML Inference Pipeline",
                        "priority": "High",
                        "difficulty": "Advanced",
                        "estimated_hours": 35,
                        "prerequisites": ["PyTorch", "FastAPI", "Docker"],
                        "project_idea": "Deploy a real-time sentiment analysis and trend forecasting pipeline with live visualization dashboard."
                    }
                ]
            }
        ]
    },
    "DevOps & Cloud Engineer": {
        "required_skills": [
            "Linux", "Docker", "Kubernetes", "AWS", "Terraform",
            "CI/CD", "Prometheus", "Grafana", "Bash", "Git"
        ],
        "default_phases": [
            {
                "phase_number": 1,
                "phase_name": "Phase 1 — Linux & Infrastructure Scripting",
                "items": [
                    {
                        "skill_name": "Linux Internals, Networking & Shell Automation",
                        "priority": "High",
                        "difficulty": "Beginner",
                        "estimated_hours": 20,
                        "prerequisites": ["Terminal basics"],
                        "project_idea": "Write automated Bash maintenance scripts for server health auditing, log rotation, and backup automation."
                    }
                ]
            },
            {
                "phase_number": 2,
                "phase_name": "Phase 2 — Containerization with Docker",
                "items": [
                    {
                        "skill_name": "Production Multi-Stage Docker Builds",
                        "priority": "High",
                        "difficulty": "Intermediate",
                        "estimated_hours": 20,
                        "prerequisites": ["Linux CLI"],
                        "project_idea": "Optimize container images from 1.2GB down to 60MB using Alpine distroless images and security scanners."
                    }
                ]
            },
            {
                "phase_number": 3,
                "phase_name": "Phase 3 — Cloud Architecture & Terraform (IaC)",
                "items": [
                    {
                        "skill_name": "Infrastructure as Code with Terraform & AWS/GCP",
                        "priority": "High",
                        "difficulty": "Intermediate",
                        "estimated_hours": 30,
                        "prerequisites": ["Cloud basics"],
                        "project_idea": "Provision a multi-AZ VPC with public/private subnets, security groups, and an autoscaling application load balancer via Terraform."
                    }
                ]
            },
            {
                "phase_number": 4,
                "phase_name": "Phase 4 — Kubernetes Cluster Orchestration",
                "items": [
                    {
                        "skill_name": "Kubernetes Deployments, Ingress & Helm Charts",
                        "priority": "High",
                        "difficulty": "Advanced",
                        "estimated_hours": 35,
                        "prerequisites": ["Docker"],
                        "project_idea": "Deploy a multi-service web app on a managed Kubernetes cluster with SSL Ingress and Horizontal Pod Autoscaling."
                    }
                ]
            },
            {
                "phase_number": 5,
                "phase_name": "Phase 5 — Full CI/CD & Observability Pipeline",
                "items": [
                    {
                        "skill_name": "Zero-Downtime Deployment & Prometheus Monitoring",
                        "priority": "High",
                        "difficulty": "Advanced",
                        "estimated_hours": 30,
                        "prerequisites": ["Kubernetes", "Git"],
                        "project_idea": "Build a GitLab/GitHub Actions pipeline that deploys canary releases with Grafana latency alerting."
                    }
                ]
            }
        ]
    },
    "Cybersecurity Analyst": {
        "required_skills": [
            "Network Security", "Linux", "Python", "OWASP Top 10", "Wireshark",
            "SIEM", "Incident Response", "Vulnerability Assessment", "Cryptography"
        ],
        "default_phases": [
            {
                "phase_number": 1,
                "phase_name": "Phase 1 — Networks & Security Fundamentals",
                "items": [
                    {
                        "skill_name": "Packet Analysis with Wireshark & TCP/IP Security",
                        "priority": "High",
                        "difficulty": "Beginner",
                        "estimated_hours": 20,
                        "prerequisites": ["Computer Networks"],
                        "project_idea": "Analyze PCAP packet captures to detect ARP spoofing, port scans, and unencrypted credential transmission."
                    }
                ]
            },
            {
                "phase_number": 2,
                "phase_name": "Phase 2 — Web Application Security & OWASP Top 10",
                "items": [
                    {
                        "skill_name": "Ethical Hacking & Web Vulnerability Assessment",
                        "priority": "High",
                        "difficulty": "Intermediate",
                        "estimated_hours": 30,
                        "prerequisites": ["HTTP/Web basics"],
                        "project_idea": "Perform controlled penetration testing on OWASP Juice Shop, identifying SQLi, XSS, and broken access controls."
                    }
                ]
            },
            {
                "phase_number": 3,
                "phase_name": "Phase 3 — Cryptography & Access Control",
                "items": [
                    {
                        "skill_name": "Modern Cryptography & Identity Management",
                        "priority": "High",
                        "difficulty": "Intermediate",
                        "estimated_hours": 20,
                        "prerequisites": ["Security fundamentals"],
                        "project_idea": "Implement symmetric AES-GCM and asymmetric RSA key exchange protocols with digital signature verification in Python."
                    }
                ]
            },
            {
                "phase_number": 4,
                "phase_name": "Phase 4 — SIEM & Threat Hunting",
                "items": [
                    {
                        "skill_name": "Security Operations Center (SOC) Log Monitoring",
                        "priority": "High",
                        "difficulty": "Intermediate",
                        "estimated_hours": 25,
                        "prerequisites": ["Linux"],
                        "project_idea": "Deploy Elastic/Splunk SIEM to ingest server syslogs and configure automated detection alerts for brute-force SSH attacks."
                    }
                ]
            },
            {
                "phase_number": 5,
                "phase_name": "Phase 5 — Enterprise Defense Capstone",
                "items": [
                    {
                        "skill_name": "Incident Response Plan & Security Hardening",
                        "priority": "High",
                        "difficulty": "Advanced",
                        "estimated_hours": 30,
                        "prerequisites": ["SIEM", "Networking"],
                        "project_idea": "Draft an enterprise incident response playbook and execute a blue-team containment simulation against a ransomware attack."
                    }
                ]
            }
        ]
    },
    "Mobile App Developer": {
        "required_skills": [
            "Flutter / React Native", "Dart / TypeScript", "Mobile UI Design", "REST APIs",
            "State Management", "SQLite / Hive", "Push Notifications", "Git"
        ],
        "default_phases": [
            {
                "phase_number": 1,
                "phase_name": "Phase 1 — Cross-Platform UI & Widgets",
                "items": [
                    {
                        "skill_name": "Flutter/React Native Layouts & Responsive Mobile UI",
                        "priority": "High",
                        "difficulty": "Beginner",
                        "estimated_hours": 25,
                        "prerequisites": ["Basic Programming"],
                        "project_idea": "Develop a multi-screen mobile crypto tracking app with real-time price charts and smooth tab navigation."
                    }
                ]
            },
            {
                "phase_number": 2,
                "phase_name": "Phase 2 — Mobile State Management & Architecture",
                "items": [
                    {
                        "skill_name": "Predictable State Management (Bloc / Riverpod)",
                        "priority": "High",
                        "difficulty": "Intermediate",
                        "estimated_hours": 25,
                        "prerequisites": ["Mobile UI"],
                        "project_idea": "Build an offline-first notes application with local search, tag filtering, and undo/redo state stacks."
                    }
                ]
            },
            {
                "phase_number": 3,
                "phase_name": "Phase 3 — Local Storage & Backend Synchronization",
                "items": [
                    {
                        "skill_name": "SQLite/Hive Storage & REST API Interceptors",
                        "priority": "High",
                        "difficulty": "Intermediate",
                        "estimated_hours": 20,
                        "prerequisites": ["State Management"],
                        "project_idea": "Implement token refresh handling and background synchronization queue for unstable mobile network connectivity."
                    }
                ]
            },
            {
                "phase_number": 4,
                "phase_name": "Phase 4 — Native Hardware APIs & Notifications",
                "items": [
                    {
                        "skill_name": "Camera, Geolocation & Firebase Cloud Messaging",
                        "priority": "High",
                        "difficulty": "Intermediate",
                        "estimated_hours": 20,
                        "prerequisites": ["Mobile basics"],
                        "project_idea": "Integrate camera photo capture with GPS tagging and instant push notification alerts."
                    }
                ]
            },
            {
                "phase_number": 5,
                "phase_name": "Phase 5 — App Store Production Capstone",
                "items": [
                    {
                        "skill_name": "Production Mobile App with CI/CD & Analytics",
                        "priority": "High",
                        "difficulty": "Advanced",
                        "estimated_hours": 35,
                        "prerequisites": ["Full Mobile Skills"],
                        "project_idea": "Build and bundle a production-ready mobile marketplace with payment integration and Fastlane automated build deployment."
                    }
                ]
            }
        ]
    }
}

class RoadmapService:
    """Service for calculating role skill gaps and building personalized 5-phase roadmaps."""

    @staticmethod
    def calculate_skill_gap(target_role: str, current_skills: List[str]) -> Dict[str, Any]:
        # Match against known profile or generate standard
        profile = ROLE_SKILL_PROFILES.get(target_role)
        if not profile:
            # Default to Software Developer if role not directly matched
            for k in ROLE_SKILL_PROFILES.keys():
                if k.lower() in target_role.lower():
                    profile = ROLE_SKILL_PROFILES[k]
                    break
            if not profile:
                profile = ROLE_SKILL_PROFILES["Software Developer"]

        required = profile["required_skills"]
        current_set = set(s.lower() for s in current_skills)

        missing = []
        matching = []
        for req in required:
            if req.lower() in current_set:
                matching.append(req)
            else:
                missing.append(req)

        readiness = round((len(matching) / len(required)) * 100, 1) if required else 65.0

        return {
            "target_role": target_role,
            "current_skills": current_skills,
            "missing_skills": missing,
            "role_required_skills": required,
            "readiness_percentage": readiness
        }

    @staticmethod
    async def generate_roadmap(target_role: str, current_skills: List[str]) -> Dict[str, Any]:
        # Check pre-compiled template
        profile = ROLE_SKILL_PROFILES.get(target_role)
        if not profile:
            for k in ROLE_SKILL_PROFILES.keys():
                if k.lower() in target_role.lower():
                    profile = ROLE_SKILL_PROFILES[k]
                    break
            if not profile:
                profile = ROLE_SKILL_PROFILES["Software Developer"]

        phases = profile["default_phases"]

        # If live AI is available and user requested an unusual role, generate custom phases
        if ai_service.is_live_ai_available() and target_role not in ROLE_SKILL_PROFILES:
            prompt = f"""
            Create a 5-phase career roadmap for a student preparing for: {target_role}
            Current Skills: {current_skills}
            
            Return JSON with:
            - "title": "Career Roadmap: {target_role}"
            - "description": "Short explanation"
            - "phases": list of 5 phases with keys:
              - "phase_number": 1..5
              - "phase_name": "Phase Name"
              - "items": list of items with keys:
                - "skill_name": str
                - "priority": "High" | "Medium" | "Low"
                - "difficulty": "Beginner" | "Intermediate" | "Advanced"
                - "estimated_hours": int
                - "prerequisites": list of str
                - "project_idea": str
            """
            llm_res = await ai_service.generate_json(prompt, system_instruction="You are a senior tech mentor creating personalized learning plans.")
            if llm_res and "phases" in llm_res:
                phases = llm_res["phases"]

        # Flatten items with order_index and default status
        flattened_items = []
        order = 1
        for phase in phases:
            p_num = phase.get("phase_number", 1)
            p_name = phase.get("phase_name", f"Phase {p_num}")
            for item in phase.get("items", []):
                # Mark as completed if student already has this skill
                is_already_known = any(item["skill_name"].lower() in cs.lower() for cs in current_skills)
                initial_status = "completed" if is_already_known else "not_started"
                
                flattened_items.append({
                    "phase_number": p_num,
                    "phase_name": p_name,
                    "skill_name": item.get("skill_name", "Technical Skill"),
                    "priority": item.get("priority", "High"),
                    "difficulty": item.get("difficulty", "Intermediate"),
                    "estimated_hours": item.get("estimated_hours", 20),
                    "prerequisites": item.get("prerequisites", []),
                    "project_idea": item.get("project_idea", "Implement a practical project applying this concept."),
                    "status": initial_status,
                    "order_index": order
                })
                order += 1

        completed_count = sum(1 for it in flattened_items if it["status"] == "completed")
        progress = round((completed_count / len(flattened_items)) * 100, 1) if flattened_items else 0.0

        return {
            "target_role": target_role,
            "title": f"Personalized Career Roadmap: {target_role}",
            "description": f"Targeted 5-phase career progression designed to bridge your skill gaps for top-tier placement opportunities in {target_role}.",
            "progress_percentage": progress,
            "items": flattened_items
        }

roadmap_service = RoadmapService()
