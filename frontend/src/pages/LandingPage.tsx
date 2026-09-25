import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  Target,
  Compass,
  MessageSquareCode,
  Map,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Cpu,
  GraduationCap,
  ShieldCheck,
  TrendingUp,
  Users,
  Sun,
  Moon,
  ChevronDown,
  Layers,
  Terminal,
  Code2,
  Briefcase,
  Check,
  Bot,
  BookOpen,
  History,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

interface LandingPageProps {
  onGetStarted: () => void;
  onTryDemo: () => void;
  onLogin: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onTryDemo,
  onLogin,
  darkMode = false,
  onToggleDarkMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<'dashboard' | 'resume' | 'interview'>('dashboard');

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'AI Tools', href: '#ai-tools' },
    { label: 'Showcase', href: '#showcase' },
    { label: 'FAQ', href: '#faq' },
  ];

  const problemSolutions = [
    {
      problemTitle: 'The ATS Black Hole',
      problemDesc: 'Over 75% of college engineering resumes are auto-filtered out before reaching recruiters due to parsing glitches, missing keywords, and weak metric bullets.',
      solutionTitle: 'Deterministic ATS Diagnostics',
      solutionDesc: 'Our local PDF parser extracts sections, highlights keyword gaps, and scores bullets against the Google XYZ formula (Accomplished [X], measured by [Y], by doing [Z]).',
      icon: FileText,
      color: 'indigo',
    },
    {
      problemTitle: 'Outdated College Syllabi',
      problemDesc: 'University curriculum emphasizes theory while modern tech roles demand production Docker, CI/CD, FastAPI, PyTorch, and distributed systems experience.',
      solutionTitle: 'Industry Benchmark Mapping',
      solutionDesc: 'Directly benchmark your skills against 8+ entry-level profiles (Software Engineer, AI/ML, Cloud/DevOps, Data Analyst) to eliminate syllabus guesswork.',
      icon: Compass,
      color: 'emerald',
    },
    {
      problemTitle: 'Interview Anxiety & No Feedback',
      problemDesc: 'Students practice rote LeetCode without evaluating verbal articulation, system trade-offs, or structured communication under timed pressure.',
      solutionTitle: '5-Axis Mock Rubric Simulator',
      solutionDesc: 'Simulate live technical interviews with instant AI scoring on Technical Accuracy, Relevance, Clarity, Communication, and Completeness.',
      icon: MessageSquareCode,
      color: 'purple',
    },
  ];

  const aiFeatures = [
    {
      icon: <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      badge: 'Resume AI',
      title: 'ATS Resume Analyzer',
      description: 'Upload your PDF resume to receive instant 0–100 ATS scoring, section audit, and quantified bullet improvement suggestions.',
      capabilities: ['PDF Text & Section Extraction', 'Google XYZ Metric Rewrites', 'Keyword Gap Identification'],
    },
    {
      icon: <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      badge: 'Vector Match',
      title: 'Semantic Job Match Engine',
      description: 'Compare your resume against any target job description using high-dimensional embeddings and cosine similarity scoring.',
      capabilities: ['Semantic Vector Cosine Scoring', 'Matching & Missing Skill Matrix', 'Tailored Cover Suggestions'],
    },
    {
      icon: <Compass className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      badge: 'Benchmarking',
      title: 'Precision Skill Gap Matrix',
      description: 'Map your verified skills against industry role benchmarks with directed competency satisfactions and zero false-positives.',
      capabilities: ['Directed Competency Taxonomy', 'Role Readiness Percentage', 'One-Click Sample Skills Loader'],
    },
    {
      icon: <Map className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      badge: 'Roadmaps',
      title: 'Personalized 5-Phase Roadmap',
      description: 'Bridge your skill gaps with a structured, step-by-step career curriculum containing prerequisites and real project milestones.',
      capabilities: ['5 Tailored Phase Milestones', 'Curated Project Blueprints', 'Status & Progress Tracking'],
    },
    {
      icon: <MessageSquareCode className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      badge: 'Simulation',
      title: 'AI Mock Interview Simulator',
      description: 'Take timed technical interviews evaluated on an industry 5-axis rubric: Accuracy, Relevance, Clarity, Communication, Completeness.',
      capabilities: ['Multi-Turn Technical Drills', '5-Axis Metric Rubric Grading', 'Detailed Improvement Suggestions'],
    },
    {
      icon: <BookOpen className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
      badge: 'Questions',
      title: 'Curated Question Bank',
      description: 'Generate high-yield technical and behavioral interview questions categorized by role, topic, and difficulty level.',
      capabilities: ['High-Yield DSA & System Design', 'Topic & Category Filters', 'Model Answers & Follow-ups'],
    },
    {
      icon: <Bot className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      badge: 'Copilot',
      title: 'AI Career Assistant & Mentor',
      description: '24/7 technical mentor for deep-dive coding questions, architecture trade-offs, STAR behavioral scenarios, and placement tips.',
      capabilities: ['STAR Method Framework', 'System Design Architectures', 'Code Explanations with Markdown'],
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      badge: 'Analytics',
      title: 'Placement Command Center',
      description: 'Unified career progress telemetry tracking your ATS score, job match percentage, streak, and prioritized daily action items.',
      capabilities: ['Real-time Readiness Telemetry', 'Placement Streak Counter', 'Prioritized Daily Next Actions'],
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Ingest Resume & Profile',
      desc: 'Upload your PDF resume or start instantly with pre-loaded college student profiles to scan your technical proficiencies.',
      tag: '5-Second Scan',
    },
    {
      num: '02',
      title: 'Benchmark Target Role',
      desc: 'Select Software Engineer, AI/ML, Cloud/DevOps, or Data Analyst to uncover exact missing skills and role readiness.',
      tag: 'Zero Guesswork',
    },
    {
      num: '03',
      title: 'Execute Your 5-Phase Plan',
      desc: 'Work through curated milestones, build production-grade projects, and track each competency as you master it.',
      tag: 'Guided Curricula',
    },
    {
      num: '04',
      title: 'Master Mock Interviews',
      desc: 'Simulate high-pressure technical interviews with instant 5-axis rubric grading and actionable feedback before real placement day.',
      tag: 'Placement Ready',
    },
  ];

  const faqs = [
    {
      q: 'How does CareerPilot AI calculate my ATS resume score?',
      a: 'We parse your resume text directly using a secure local parser. The algorithm evaluates four pillars: Core Section Completeness (Contact, Education, Experience, Skills, Projects), Quantified Bullet Point Strength (verifying measurable outcomes and metrics), Technical Keyword Density against 350+ recognized competencies, and Formatting Safety.',
    },
    {
      q: 'Can I test CareerPilot without creating an account or uploading a resume?',
      a: 'Yes! Click "Try Interactive Demo" on the navigation bar or hero section. This instantly provisions an active student session (Alex Chen, CS Senior) pre-seeded with real skills, sample resume diagnostics, and mock interview sessions so you can explore all features with zero friction.',
    },
    {
      q: 'Which technical roles are supported in the Skill Gap Analyzer?',
      a: 'We maintain benchmark profiles and 5-phase learning curricula for Software Developer, Frontend Engineer, Backend Developer, Full Stack Developer, AI/ML Engineer, Cloud/DevOps Engineer, Data Analyst, Data Scientist, Mobile App Developer, and Cybersecurity Analyst.',
    },
    {
      q: 'How does the AI Mock Interview Simulator grade answers?',
      a: 'Instead of generic thumbs-up/down feedback, our AI evaluates answers against an industry-standard 5-axis rubric: Technical Accuracy, Relevance, Clarity, Communication, and Completeness (each scored 0–10). You receive an overall score, identified strong points, and specific missing details.',
    },
    {
      q: 'Is CareerPilot AI completely free for students?',
      a: 'Yes. All core career tools—including PDF resume parsing, job match analysis, learning roadmap generation, question banks, and AI mock interviews—are free for college students and job seekers.',
    },
  ];

  const testimonials = [
    {
      quote: 'The ATS score breakdown showed me that my project bullets lacked measurable metrics. After applying the Google XYZ formula suggestions, my placement interview callbacks increased substantially.',
      name: 'Rohan Sharma',
      role: 'Placed as Graduate SWE',
      college: 'Computer Science & Engineering',
    },
    {
      quote: 'The 5-axis interview evaluation is rigorous and honest. Being graded on Technical Accuracy vs Communication forced me to explain system trade-offs clearly rather than memorizing definitions.',
      name: 'Pooja Verma',
      role: 'Entry-Level AI/ML Engineer',
      college: 'Information Technology',
    },
    {
      quote: 'I was targeting Cloud/DevOps but didn’t know what tools companies actually test. The Skill Gap Analyzer pinpointed Terraform and CI/CD, and the 5-phase roadmap gave me the exact projects to build.',
      name: 'Aditya K.',
      role: 'Associate DevOps Engineer',
      college: 'Electrical & Computer Engineering',
    },
  ];

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#FAF5EE] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      {/* 1. Premium Sticky Navbar */}
      <header className="sticky top-0 z-40 bg-[#FAF5EE]/90 dark:bg-slate-950/85 backdrop-blur-md border-b border-stone-200/80 dark:border-slate-800/80 px-4 sm:px-8 lg:px-12 h-16 sm:h-20 flex items-center justify-between transition-colors w-full">
        {/* Brand */}
        <a href="#" className="flex items-center gap-3 shrink-0 group">
          <img
            src="/logo.png"
            alt="CareerPilot AI"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform object-cover"
          />
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
              CareerPilot <span className="text-indigo-600 dark:text-indigo-400">AI</span>
            </span>
            <span className="hidden md:inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 rounded-md border border-indigo-200/60 dark:border-indigo-800/80">
              Campus Copilot
            </span>
          </div>
        </a>

        {/* Desktop Anchor Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-600 dark:text-slate-300">
          {navLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onLogin}
            className="text-xs font-bold border-2 border-slate-300 dark:border-slate-700 hover:border-indigo-600 dark:hover:border-indigo-400 px-3.5 py-1.5 rounded-xl shadow-xs"
          >
            Sign In
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onTryDemo}
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-amber-500" />}
            className="text-xs font-semibold"
          >
            Try Demo
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onGetStarted}
            className="text-xs font-semibold shadow-sm"
          >
            Get Started Free
          </Button>

          {onToggleDarkMode && (
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition-colors cursor-pointer"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300" />}
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center gap-2">
          {onToggleDarkMode && (
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800"
            aria-label="Toggle navigation drawer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden fixed inset-x-0 top-16 z-30 bg-[#FAF5EE]/98 dark:bg-slate-950/95 backdrop-blur-xl border-b border-stone-200 dark:border-slate-800 p-5 shadow-2xl space-y-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3 pb-3 border-b border-stone-200/80 dark:border-slate-800 text-sm font-semibold">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex flex-col gap-2.5 pt-1">
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setMobileMenuOpen(false);
                onTryDemo();
              }}
              leftIcon={<Sparkles className="w-4 h-4 text-amber-500" />}
              className="w-full text-xs font-semibold"
            >
              Try Interactive Demo
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogin();
                }}
                className="w-full text-xs font-bold border-2 border-slate-300 dark:border-slate-700 hover:border-indigo-600"
              >
                Sign In
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onGetStarted();
                }}
                className="w-full text-xs font-semibold"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Hero Section */}
      <section className="relative pt-16 sm:pt-24 pb-20 sm:pb-28 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto text-center flex flex-col items-center w-full">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-500/15 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-6 shadow-subtle">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>Autonomous Placement Copilot for Software & AI/ML Careers</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white leading-[1.15]">
            Turn Your Engineering Degree into{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              High-Yield Tech Offers
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            Deterministic ATS resume scoring, semantic vector job matching, personalized 5-phase career roadmaps, and 5-axis mock interview simulations—built to eliminate placement guesswork.
          </p>

          {/* CTAs */}
          <div className="mt-9 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
            <Button
              size="lg"
              variant="primary"
              onClick={onGetStarted}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto px-8 py-3.5 text-sm sm:text-base font-bold shadow-md shadow-indigo-500/25"
            >
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onTryDemo}
              leftIcon={<Sparkles className="w-4 h-4 text-amber-500" />}
              className="w-full sm:w-auto px-7 py-3.5 text-sm sm:text-base font-bold"
            >
              Explore Live Demo
            </Button>
          </div>

          {/* Trust Value Badges */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 pt-8 border-t border-slate-200/80 dark:border-slate-800/80 w-full max-w-4xl text-left sm:text-center">
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">350+</p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Tech Competencies Mapped</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">5-Phase</p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Personalized Curricula</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">5-Axis</p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Interview Rubric Evaluation</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">0 Setup</p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Instant Demo Session Ready</p>
            </div>
          </div>
        </div>

        {/* Realistic Product Mockup Showcase */}
        <div className="mt-14 sm:mt-16 w-full max-w-5xl rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-3 sm:p-6 shadow-2xl text-left overflow-hidden">
          <div className="bg-slate-950 rounded-2xl p-4 sm:p-8 text-white border border-slate-800/90 shadow-inner">
            {/* Mock Header Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6 gap-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="w-3 h-3 rounded-full bg-rose-500/90" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/90" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/90" />
                </div>
                <span className="text-xs text-slate-400 font-mono ml-2 truncate">
                  careerpilot-ai.engine // live-copilot-telemetry
                </span>
              </div>
              <Badge variant="emerald" size="sm" dot>Session Active</Badge>
            </div>

            {/* 3 Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">ATS Resume Health</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-black text-indigo-400">78</span>
                  <span className="text-xs text-slate-500 font-bold">/ 100</span>
                </div>
                <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> 18 skills verified from PDF
                </p>
              </div>

              <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Target Job Match</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-black text-emerald-400">72%</span>
                  <span className="text-xs text-emerald-500/80 font-bold">Strong Alignment</span>
                </div>
                <p className="text-xs text-slate-300 mt-2 font-medium">
                  Benchmark: AI/ML Engineer
                </p>
              </div>

              <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Interview Readiness</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-black text-purple-400">64%</span>
                  <span className="text-xs text-amber-400 font-bold">5 Gaps Identified</span>
                </div>
                <p className="text-xs text-amber-300/90 mt-2 font-medium">
                  Next drill: System Design & Transformers
                </p>
              </div>
            </div>

            {/* Active Telemetry Line */}
            <div className="mt-5 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-slate-400">Active Profile:</span>
                <span className="font-bold text-white">Alex Chen (UC Berkeley CS)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Verified:</span>
                <Badge variant="indigo" size="xs">Python</Badge>
                <Badge variant="indigo" size="xs">PyTorch</Badge>
                <Badge variant="indigo" size="xs">Docker</Badge>
                <Badge variant="indigo" size="xs">FastAPI</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Problem → Solution Section */}
      <section className="py-20 sm:py-24 px-4 sm:px-8 lg:px-12 bg-white dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <Badge variant="rose" size="sm">The Placement Reality</Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-normal">
              Why Traditional Campus Placement Preparation Fails
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Every year millions of bright engineering students apply to tech roles with identical generic resumes and theoretical study habits. Here is how CareerPilot fixes the funnel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {problemSolutions.map((item, idx) => (
              <Card key={idx} className="p-6 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  {/* Problem Tag */}
                  <div className="p-4 rounded-xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/60 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
                      The Challenge
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.problemTitle}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.problemDesc}
                    </p>
                  </div>

                  {/* Solution Tag */}
                  <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/60 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      CareerPilot AI Solution
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.solutionTitle}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.solutionDesc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Integrated in Copilot Engine</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. AI Features Section (8 Premium Feature Cards) */}
      <section id="features" className="py-20 sm:py-28 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <Badge variant="indigo" size="sm">End-to-End Capabilities</Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-normal">
            Eight Intelligent Engines Built for Placement Success
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Everything you need to transform from an unprepared applicant to an offer-ready software engineer.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {aiFeatures.map((feat, idx) => (
            <Card key={idx} hover className="p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    {feat.icon}
                  </div>
                  <Badge variant="indigo" size="xs">{feat.badge}</Badge>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5">
                {feat.capabilities.map((cap, cIdx) => (
                  <div key={cIdx} className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                    <Check className="w-3 h-3 text-indigo-500 shrink-0" />
                    <span className="truncate">{cap}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 5. How It Works (4-Step Visual Process) */}
      <section id="how-it-works" className="py-20 sm:py-24 px-4 sm:px-8 lg:px-12 bg-[#F5EFEB]/70 dark:bg-slate-900/40 border-y border-stone-200/80 dark:border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <Badge variant="emerald" size="sm">Structured Workflow</Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-normal">
              Four Steps from First Scan to Placement Offer
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              No unstructured browsing. A deterministic engineering funnel that systematically eliminates your skill deficits.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st, idx) => (
              <div key={idx} className="relative p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                      {st.num}
                    </span>
                    <Badge variant="indigo" size="xs">{st.tag}</Badge>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {st.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {st.desc}
                  </p>
                </div>

                <div className="w-full h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full"
                    style={{ width: `${(idx + 1) * 25}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Dashboard & Product Showcase */}
      <section id="showcase" className="py-20 sm:py-28 px-4 sm:px-8 lg:px-12 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <Badge variant="purple" size="sm">Realistic Product Previews</Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-normal">
            See the Platform in Action
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Engineered with modern SaaS ergonomics, dark mode native styling, and high-density information layout.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 bg-slate-200/70 dark:bg-slate-800/80 rounded-xl border border-slate-300/60 dark:border-slate-700/60">
            <button
              type="button"
              onClick={() => setActiveShowcaseTab('dashboard')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                activeShowcaseTab === 'dashboard'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Command Center
            </button>
            <button
              type="button"
              onClick={() => setActiveShowcaseTab('resume')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                activeShowcaseTab === 'resume'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              ATS Resume Diagnostics
            </button>
            <button
              type="button"
              onClick={() => setActiveShowcaseTab('interview')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                activeShowcaseTab === 'interview'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              5-Axis Interview Room
            </button>
          </div>
        </div>

        {/* Showcase Panel Content */}
        <Card className="p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          {activeShowcaseTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Candidate Placement Cockpit
                  </h3>
                  <p className="text-xs text-slate-500">Real-time status across resumes, job matches, and active streaks.</p>
                </div>
                <Badge variant="indigo" size="sm">Active Target: AI/ML Engineer</Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-center">
                  <p className="text-xs text-slate-500 uppercase font-semibold">Resume ATS</p>
                  <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">78%</p>
                  <span className="text-[10px] text-emerald-600 font-bold">18 Skills Extracted</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-center">
                  <p className="text-xs text-slate-500 uppercase font-semibold">Job Match</p>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">72%</p>
                  <span className="text-[10px] text-slate-400 font-medium">Cosine Vector Score</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-center">
                  <p className="text-xs text-slate-500 uppercase font-semibold">Interview Score</p>
                  <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">6.4 / 10</p>
                  <span className="text-[10px] text-slate-400 font-medium">Rubric Average</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-center">
                  <p className="text-xs text-slate-500 uppercase font-semibold">Placement Streak</p>
                  <p className="text-2xl font-black text-amber-500 mt-1">3 Days</p>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">Consistent Practice</span>
                </div>
              </div>
            </div>
          )}

          {activeShowcaseTab === 'resume' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    ATS Diagnostics & Google XYZ Bullet Rewrites
                  </h3>
                  <p className="text-xs text-slate-500">Automated structural evaluation of projects, education, and keyword density.</p>
                </div>
                <Badge variant="emerald" size="sm">Score: 78 / 100</Badge>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300">✓ Strong Bullet Example:</span>
                  <p className="text-slate-700 dark:text-slate-300 mt-1">
                    "Engineered real-time semantic search microservice using FastAPI & PyTorch embeddings, reducing response latency by 35% across 20,000 queries."
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs">
                  <span className="font-bold text-amber-800 dark:text-amber-300">⚠ Actionable Improvement Needed:</span>
                  <p className="text-slate-700 dark:text-slate-300 mt-1">
                    "Weak bullet: 'Worked on ML project in Python.' &rarr; Suggestion: Add dataset size, model type (e.g. Random Forest, Transformer), and measured accuracy or latency metrics."
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeShowcaseTab === 'interview' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    5-Axis Rubric Feedback Breakdown
                  </h3>
                  <p className="text-xs text-slate-500">Industry rubric scoring based on Amazon / Google technical bar-raiser guidelines.</p>
                </div>
                <Badge variant="purple" size="sm">Question 2 of 5</Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[11px] text-slate-500 font-semibold">Accuracy</span>
                  <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1">8.5 / 10</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[11px] text-slate-500 font-semibold">Relevance</span>
                  <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1">9.0 / 10</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[11px] text-slate-500 font-semibold">Clarity</span>
                  <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1">7.5 / 10</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[11px] text-slate-500 font-semibold">Communication</span>
                  <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1">8.0 / 10</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 col-span-2 sm:col-span-1">
                  <span className="text-[11px] text-slate-500 font-semibold">Completeness</span>
                  <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1">7.0 / 10</p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </section>

      {/* 7. Believable Testimonials / Social Proof */}
      <section className="py-20 sm:py-24 px-4 sm:px-8 lg:px-12 bg-white dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <Badge variant="indigo" size="sm">Real Candidate Stories</Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-normal">
              Trusted by Ambitious Engineering Students
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Honest feedback from students who transformed their technical preparation and landed placement offers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <Card key={idx} className="p-6 flex flex-col justify-between space-y-6">
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "{t.quote}"
                </p>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {t.name[0]}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">{t.name}</h3>
                    <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">{t.role}</p>
                    <p className="text-[10px] text-slate-400">{t.college}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ Section with Accessible Accordions */}
      <section id="faq" className="py-20 sm:py-28 px-4 sm:px-8 lg:px-12 max-w-4xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <Badge variant="slate" size="sm">Frequently Asked Questions</Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-normal">
            Clear Answers to Common Questions
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Everything you need to know about the CareerPilot AI platform, scoring models, and demo sessions.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <details
              key={idx}
              name="landing-faq"
              className="group p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-card transition-all cursor-pointer"
            >
              <summary className="flex items-center justify-between font-bold text-sm sm:text-base text-slate-900 dark:text-white list-none select-none">
                <span>{faq.q}</span>
                <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform duration-200 shrink-0 ml-3" />
              </summary>
              <p className="mt-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3.5">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* 9. Final High-Impact CTA Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 lg:px-12 max-w-6xl mx-auto w-full">
        <div className="rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white p-8 sm:p-14 text-center border border-indigo-800/50 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <Badge variant="indigo" size="sm" className="bg-white/10 text-indigo-200 border-white/20">
              Immediate Readiness
            </Badge>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-normal leading-tight">
              Start Engineering Your Placement Roadmap Today
            </h2>

            <p className="text-sm sm:text-base text-indigo-200 leading-relaxed">
              Join thousands of engineering students mastering ATS keywords, role competencies, and high-stakes technical interviews.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Button
                size="lg"
                variant="white"
                onClick={onGetStarted}
                rightIcon={<ArrowRight className="w-4 h-4 text-indigo-700" />}
                className="w-full sm:w-auto px-8 py-3.5 text-sm sm:text-base font-black shadow-xl"
              >
                Start Preparation Free
              </Button>
              <Button
                size="lg"
                variant="inverted"
                onClick={onTryDemo}
                leftIcon={<Sparkles className="w-4 h-4 text-amber-400" />}
                className="w-full sm:w-auto px-7 py-3.5 text-sm sm:text-base font-bold"
              >
                Launch Instant Demo
              </Button>
            </div>

            <p className="text-[11px] text-indigo-300/80 pt-2 font-medium">
              No credit card required • Instant interactive demo • 100% free for students
            </p>
          </div>

          {/* Ambient Glow */}
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* 10. Professional Footer */}
      <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 py-12 px-4 sm:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="CareerPilot AI Logo"
                className="w-7 h-7 rounded-lg shadow-sm object-cover"
              />
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                CareerPilot AI
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Autonomous career copilot bridging the gap between college education and high-yield technology placements.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All AI Engines Operational</span>
            </div>
          </div>

          {/* AI Tools */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              AI Tools
            </h3>
            <ul className="space-y-1.5 text-xs">
              <li><button type="button" onClick={onGetStarted} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">ATS Resume Analyzer</button></li>
              <li><button type="button" onClick={onGetStarted} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Semantic Job Matcher</button></li>
              <li><button type="button" onClick={onGetStarted} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Skill Gap Analyzer</button></li>
              <li><button type="button" onClick={onGetStarted} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Learning Roadmap</button></li>
            </ul>
          </div>

          {/* Practice & Copilot */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Practice
            </h3>
            <ul className="space-y-1.5 text-xs">
              <li><button type="button" onClick={onGetStarted} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Mock Interview Simulator</button></li>
              <li><button type="button" onClick={onGetStarted} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Question Bank Generator</button></li>
              <li><button type="button" onClick={onGetStarted} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">AI Career Chatbot</button></li>
              <li><button type="button" onClick={onTryDemo} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Interactive Demo Mode</button></li>
            </ul>
          </div>

          {/* Platform & Team */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Platform
            </h3>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">How It Works</a></li>
              <li><a href="#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">FAQ</a></li>
              <li><button type="button" onClick={onLogin} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Candidate Sign In</button></li>
              <li><span className="text-slate-400">Architected by Tejas</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-8 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} CareerPilot AI. All rights reserved.</p>
          <div className="flex items-center gap-6 text-xs">
            <span>Built with React 19 & FastAPI</span>
            <span>Deterministic NLP + Vector Cosine Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
