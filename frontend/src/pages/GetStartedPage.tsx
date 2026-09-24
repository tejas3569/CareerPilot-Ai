import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  FileText,
  Target,
  Map,
  MessageSquareCode,
  BookOpen,
  ArrowRight,
  Bot,
  CheckCircle2,
  LayoutDashboard,
  ShieldCheck,
  TrendingUp,
  Award,
  ChevronRight
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { NavRoute } from '../components/layout/Sidebar';
import { useAuth } from '../context/AuthContext';
import { resumeApi, jobsApi, interviewApi } from '../api/endpoints';

interface GetStartedPageProps {
  onNavigate: (route: NavRoute) => void;
}

export const GetStartedPage: React.FC<GetStartedPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const candidateName = user?.profile?.name || 'Student';
  const targetRole = user?.profile?.target_role || 'Software Developer';

  const [hasResume, setHasResume] = useState(false);
  const [hasJobMatch, setHasJobMatch] = useState(false);
  const [hasInterview, setHasInterview] = useState(false);

  useEffect(() => {
    Promise.all([
      resumeApi.getResumeHistory().catch(() => []),
      jobsApi.getJobHistory().catch(() => []),
      interviewApi.getHistory().catch(() => []),
    ]).then(([resumes, jobs, interviews]) => {
      setHasResume(resumes.length > 0);
      setHasJobMatch(jobs.length > 0);
      setHasInterview(interviews.length > 0);
    });
  }, []);

  const steps = [
    {
      step: '01',
      title: 'Analyze Your Resume',
      desc: 'Upload your PDF resume to receive real-time 0–100 ATS scoring, section strength diagnostics, and quantified bullet critiques.',
      badge: 'Step 1: Diagnostic',
      route: 'resume' as NavRoute,
      icon: <FileText className="w-6 h-6 text-indigo-500" />,
      cta: hasResume ? 'Re-scan / View Resume' : 'Analyze Resume Now',
      isCompleted: hasResume,
      color: 'indigo'
    },
    {
      step: '02',
      title: 'Match Target Job Description',
      desc: 'Paste a target job posting or pick one of our pre-loaded tech roles to evaluate exact semantic alignment and missing skills.',
      badge: 'Step 2: Alignment',
      route: 'jobs' as NavRoute,
      icon: <Target className="w-6 h-6 text-emerald-500" />,
      cta: hasJobMatch ? 'View Job Matches' : 'Compare Job Description',
      isCompleted: hasJobMatch,
      color: 'emerald'
    },
    {
      step: '03',
      title: 'Follow Your 5-Phase Roadmap',
      desc: 'Explore your customized 5-phase career roadmap across 10+ tech domains with project milestones and tracked progress.',
      badge: 'Step 3: Action Plan',
      route: 'roadmap' as NavRoute,
      icon: <Map className="w-6 h-6 text-amber-500" />,
      cta: 'Open Learning Roadmap',
      isCompleted: false,
      color: 'amber'
    },
    {
      step: '04',
      title: 'AI Mock Interview Simulator',
      desc: 'Take an interactive, timed mock interview with 5-axis rubric grading (Accuracy, Relevance, Clarity, Communication, Completeness).',
      badge: 'Step 4: Mastery',
      route: 'interview' as NavRoute,
      icon: <MessageSquareCode className="w-6 h-6 text-purple-500" />,
      cta: hasInterview ? 'Practice Another Session' : 'Start Mock Interview',
      isCompleted: hasInterview,
      color: 'purple'
    }
  ];

  const completedCount = [hasResume, hasJobMatch, hasInterview].filter(Boolean).length;

  return (
    <div className="space-y-8 sm:space-y-10 max-w-5xl mx-auto pb-12">
      {/* Welcome Hero Banner */}
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white shadow-xl relative overflow-hidden border border-indigo-800/40">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 backdrop-blur-md text-xs font-bold text-indigo-300 border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Placement Acceleration Launchpad</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-slate-300 border border-white/10">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>Target: {targetRole}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Welcome to CareerPilot AI, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-violet-200">{candidateName}</span>!
          </h1>
          <p className="text-xs sm:text-base text-indigo-200/90 leading-relaxed max-w-2xl">
            Follow this 4-step blueprint to transform your academic profile into an interview-ready software engineering candidate.
          </p>

          {/* Quick Progress Indicator */}
          <div className="pt-1 pb-1">
            <div className="flex items-center justify-between text-xs text-indigo-200 mb-1.5 font-semibold">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                Setup Progress ({completedCount}/3 core tasks done)
              </span>
              <span className="font-bold">{Math.round((completedCount / 3) * 100)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400 transition-all duration-500"
                style={{ width: `${Math.max(12, (completedCount / 3) * 100)}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('resume')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black bg-white text-indigo-950 hover:bg-slate-100 shadow-md transition-all active:scale-95 cursor-pointer ring-2 ring-white/20"
            >
              <FileText className="w-4 h-4 text-indigo-700" />
              <span>1. Scan Your Resume</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm transition-all active:scale-95 cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-300" />
              <span>Open Dashboard</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('chat')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600/50 hover:bg-indigo-600/70 text-indigo-100 border border-indigo-400/40 backdrop-blur-sm transition-all active:scale-95 cursor-pointer"
            >
              <Bot className="w-4 h-4 text-indigo-200" />
              <span>Ask AI Chat</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow & mesh circles */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-16 w-60 h-60 bg-violet-500/15 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 4 Step Workflow Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Your 4-Step Placement Preparation Journey
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Complete each phase to build a competitive, offer-ready profile.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {steps.map((st) => (
            <Card
              key={st.step}
              hover
              className="p-5 sm:p-6 flex flex-col justify-between space-y-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 transition-all hover:border-indigo-300 dark:hover:border-indigo-700/60 shadow-xs hover:shadow-md"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-center shadow-xs">
                    {st.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    {st.isCompleted && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                        <CheckCircle2 className="w-3 h-3" />
                        Done
                      </span>
                    )}
                    <span className="text-2xl font-black text-slate-200 dark:text-slate-800">
                      {st.step}
                    </span>
                  </div>
                </div>

                <div>
                  <Badge variant="indigo" size="sm" className="mb-2">
                    {st.badge}
                  </Badge>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {st.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant={st.isCompleted ? 'outline' : 'primary'}
                  size="sm"
                  onClick={() => onNavigate(st.route)}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  className="w-full justify-between cursor-pointer active:scale-98 transition-all"
                >
                  <span>{st.cta}</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Fast Copilot Tools Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card
          hover
          className="p-5 flex items-center justify-between cursor-pointer rounded-2xl border border-slate-200/80 dark:border-slate-800/80 transition-all hover:border-purple-300 dark:hover:border-purple-800/60 group"
          onClick={() => onNavigate('questions')}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-200/60 dark:border-purple-800/60 shrink-0">
              <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Tailored Question Bank
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Practice interview questions across 11 core CS subjects.
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Card>

        <Card
          hover
          className="p-5 flex items-center justify-between cursor-pointer rounded-2xl border border-slate-200/80 dark:border-slate-800/80 transition-all hover:border-indigo-300 dark:hover:border-indigo-800/60 group"
          onClick={() => onNavigate('about')}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200/60 dark:border-indigo-800/60 shrink-0">
              <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                About Platform & Founder
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Created by Kommana Kesava Ram Sai Tejas.
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Card>
      </div>
    </div>
  );
};

