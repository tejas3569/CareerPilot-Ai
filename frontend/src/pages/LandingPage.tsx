import React from 'react';
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
  Users
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

interface LandingPageProps {
  onGetStarted: () => void;
  onTryDemo: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onTryDemo,
  onLogin,
}) => {
  const featureList = [
    {
      icon: <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      title: "ATS Resume Analyzer",
      description: "Extract text from your PDF resume, calculate an algorithmic ATS score, uncover missing sections, and identify actionable bullet-point improvements."
    },
    {
      icon: <Target className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      title: "Semantic Job Match Engine",
      description: "Compare your resume against real job descriptions using high-dimensional vector embeddings and cosine similarity. Pinpoint matching and missing skills."
    },
    {
      icon: <Compass className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: "Skill Gap Detection",
      description: "Map your current skills directly against role benchmarks (Software Developer, AI/ML Engineer, Data Analyst) to calculate your placement readiness."
    },
    {
      icon: <MessageSquareCode className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      title: "AI Interview Simulator",
      description: "Interactive mock interviews evaluating answers on 5 dimensions: Technical Accuracy, Relevance, Clarity, Communication, and Completeness."
    },
    {
      icon: <Map className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
      title: "Personalized Roadmap",
      description: "Step-by-step 5-phase career roadmap tailored to your gaps, complete with time estimates, prerequisites, and production project ideas."
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-rose-600 dark:text-rose-400" />,
      title: "Placement Progress Dashboard",
      description: "Track your ATS score, job match %, interview readiness, learning streak, and prioritized daily action items all in one clean hub."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-6 sm:px-12 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="CareerPilot AI"
            className="w-10 h-10 rounded-xl shadow-md shadow-indigo-500/20 object-cover"
          />
          <div>
            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
              CareerPilot <span className="text-indigo-600 dark:text-indigo-400">AI</span>
            </span>
            <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 rounded-md border border-indigo-200/60 dark:border-indigo-800">
              Campus Copilot
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onLogin}>
            Sign In
          </Button>
          <Button variant="outline" size="sm" onClick={onTryDemo}>
            Try Demo
          </Button>
          <Button variant="primary" size="sm" onClick={onGetStarted}>
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6 sm:px-12 max-w-6xl mx-auto text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-8 animate-subtle">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Built for College Students Targeting Software & AI/ML Roles</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl leading-[1.1]">
          Turn Your Resume Into Your{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Career Roadmap
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Analyze your resume, discover skill gaps, practice interviews, and prepare smarter for your next opportunity.
        </p>

        {/* Call to Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Button
            size="lg"
            variant="primary"
            onClick={onGetStarted}
            rightIcon={<ArrowRight className="w-5 h-5" />}
            className="w-full sm:w-auto text-base px-8 py-3.5"
          >
            Get Started Free
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={onTryDemo}
            leftIcon={<Sparkles className="w-4 h-4 text-indigo-500" />}
            className="w-full sm:w-auto text-base px-8 py-3.5"
          >
            Try Interactive Demo
          </Button>
        </div>

        {/* Proof metrics */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-slate-200/80 dark:border-slate-800 w-full max-w-3xl">
          <div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">350+</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Tech Skills Recognized</p>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">5-Phase</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Personalized Roadmaps</p>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">5-Axis</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Interview Rubric Evaluation</p>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">0 Setup</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Instant Demo Mode Ready</p>
          </div>
        </div>

        {/* Product Mockup Showcase */}
        <div className="mt-16 w-full max-w-5xl rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-4 sm:p-6 shadow-2xl">
          <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-left border border-slate-800 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs text-slate-400 font-mono ml-3">careerpilot-ai.engine // live-copilot</span>
              </div>
              <Badge variant="emerald" size="sm">Active Session</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/60">
                <p className="text-xs text-slate-400 uppercase font-semibold">Resume ATS Score</p>
                <p className="text-3xl font-black text-indigo-400 mt-1">78 / 100</p>
                <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 18 skills verified from PDF
                </p>
              </div>

              <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/60">
                <p className="text-xs text-slate-400 uppercase font-semibold">Job Semantic Match</p>
                <p className="text-3xl font-black text-emerald-400 mt-1">72%</p>
                <p className="text-xs text-slate-300 mt-2">Target: AI/ML Engineer</p>
              </div>

              <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/60">
                <p className="text-xs text-slate-400 uppercase font-semibold">Interview Readiness</p>
                <p className="text-3xl font-black text-purple-400 mt-1">64%</p>
                <p className="text-xs text-amber-300 mt-2">5 skill gaps identified</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Modules */}
      <section className="py-20 px-6 sm:px-12 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="indigo" size="md">Complete Career Platform</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight">
            Engineered for Campus Placements
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-3 text-sm sm:text-base">
            Everything you need to transform an academic CV into an industry-ready engineering profile.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureList.map((feature, idx) => (
            <Card key={idx} hover className="flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{feature.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  {feature.description}
                </p>
              </div>
              <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Explore capability</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 px-6 sm:px-12 bg-indigo-900 text-white mt-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Ready to Accelerate Your Placement Journey?
          </h2>
          <p className="text-indigo-200 mt-4 text-base sm:text-lg max-w-2xl mx-auto">
            Upload your resume or jump into the interactive demo student profile to test all features with zero friction.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={onGetStarted}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-base font-black bg-white text-indigo-950 hover:bg-slate-100 shadow-xl transition-all active:scale-98 cursor-pointer"
            >
              Get Started Now
            </button>
            <button
              type="button"
              onClick={onTryDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-base font-bold bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm transition-all active:scale-98 cursor-pointer"
            >
              Launch Demo Student
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 sm:px-12 bg-slate-950 text-slate-400 text-xs border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
            CP
          </div>
          <span>CareerPilot AI © 2026 · Founded by Kommana Kesava Ram Sai Tejas · Built with FastAPI, React & NLP.</span>
        </div>
        <div className="flex items-center gap-6">
          <span>Terms</span>
          <span>Privacy</span>
          <span>Documentation</span>
        </div>
      </footer>
    </div>
  );
};
