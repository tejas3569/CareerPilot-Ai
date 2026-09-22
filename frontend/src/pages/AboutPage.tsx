import React from 'react';
import {
  Sparkles,
  Award,
  Code2,
  Cpu,
  GraduationCap,
  ShieldCheck,
  Target,
  Heart,
  Globe,
  Layers,
  ArrowRight,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

interface AboutPageProps {
  onNavigateGetStarted?: () => void;
  onNavigateChat?: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigateGetStarted,
  onNavigateChat
}) => {
  return (
    <div className="space-y-12 max-w-5xl mx-auto pb-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>About CareerPilot AI Platform</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Bridging the Gap Between College and Top Tech Careers
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          CareerPilot AI is an autonomous career copilot built to eliminate placement guesswork for college engineering students through deterministic NLP, semantic vector embeddings, and real-time AI mock interviews.
        </p>
      </div>

      {/* Founder Spotlight Card */}
      <Card className="p-8 sm:p-10 border-2 border-indigo-500/20 shadow-xl relative overflow-hidden bg-gradient-to-br from-white via-indigo-50/20 to-slate-50 dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-950">
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Avatar Profile */}
          <div className="flex-shrink-0 text-center">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-indigo-300/40 dark:shadow-none border-4 border-white dark:border-slate-800 mx-auto">
              TEJAS
            </div>
            <div className="mt-3">
              <Badge variant="indigo" size="sm">Founder & Architect</Badge>
            </div>
          </div>

          {/* Bio & Vision */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Kommana Kesava Ram Sai Tejas
              </h2>
              <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                Founder, Lead Product Architect & AI/ML Engineer
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
              <p className="text-sm italic text-slate-700 dark:text-slate-200 leading-relaxed">
                "Every engineering student deserves an intelligent, objective copilot that transforms an academic CV into an industry-ready engineering profile. No gatekeeping, no confusing heuristics, and no guesswork — just rigorous data, personalized roadmaps, and real preparation."
              </p>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>Kommana Kesava Ram Sai Tejas</strong> conceived and architected CareerPilot AI to solve the pervasive challenges students face during campus placement drives: opaque resume rejection by Applicant Tracking Systems, mismatched job skill requirements, lack of structured project roadmaps, and high anxiety during technical interview rounds.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Full-Stack Engineering</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                <span>AI & LLM Architecture</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-purple-500" />
                <span>Placement Enablement</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative backdrop glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </Card>

      {/* Core Platform Pillars */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <Badge variant="indigo" size="md">Core Pillars</Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
            Engineered for Placement Excellence
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Built from first principles with zero fake responses and full transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card hover className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              0–100 ATS Resume Diagnostic Engine
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Analyzes PDF resumes using high-speed text extraction and tests 7 critical parameters: Contact Completeness, Summary Impact, Quantified Achievements (Google XYZ Formula), Experience Depth, Education, and Section Organization.
            </p>
          </Card>

          <Card hover className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Semantic Vector Job Matcher
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Combines 55% dense vector cosine similarity with 45% exact/alias keyword coverage across a 350+ skills taxonomy, pinpointing critical gaps between your resume and target job postings.
            </p>
          </Card>

          <Card hover className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              10+ 5-Phase Learning Roadmaps
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Comprehensive progression paths for AI/ML, Software Development, Frontend, Backend, Full Stack, Data Science, DevOps, Cybersecurity, and Mobile App Development with project milestones and persistent tracking.
            </p>
          </Card>

          <Card hover className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              5-Axis Rubric AI Mock Interviews
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Real-time timer drills evaluating responses across Technical Accuracy, Relevance, Clarity, Communication, and Completeness, generating constructive strengths and exemplar model answers.
            </p>
          </Card>
        </div>
      </div>

      {/* Technology Specifications */}
      <Card className="p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Full-Stack Architecture & Tech Stack
            </h3>
            <p className="text-xs text-slate-500">Production-grade engineering standards.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Frontend</p>
            <p className="text-sm font-black text-slate-900 dark:text-white mt-1">React 18 + TS</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Tailwind CSS v4 + Vite</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Backend API</p>
            <p className="text-sm font-black text-slate-900 dark:text-white mt-1">FastAPI</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Python 3.14 + Pydantic v2</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Database</p>
            <p className="text-sm font-black text-slate-900 dark:text-white mt-1">SQLAlchemy ORM</p>
            <p className="text-[11px] text-slate-500 mt-0.5">SQLite / PostgreSQL</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">AI Layer</p>
            <p className="text-sm font-black text-slate-900 dark:text-white mt-1">Gemini 2.5 Flash</p>
            <p className="text-[11px] text-slate-500 mt-0.5">+ Local 256-d NLP</p>
          </div>
        </div>
      </Card>

      {/* CTA Footer */}
      <div className="text-center pt-6 space-y-4">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          Ready to Ace Your Next Campus Placement?
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {onNavigateGetStarted && (
            <Button
              variant="primary"
              size="md"
              onClick={onNavigateGetStarted}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Get Started Now
            </Button>
          )}
          {onNavigateChat && (
            <Button
              variant="outline"
              size="md"
              onClick={onNavigateChat}
              leftIcon={<Sparkles className="w-4 h-4 text-indigo-500" />}
            >
              Ask AI Career Chat
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
