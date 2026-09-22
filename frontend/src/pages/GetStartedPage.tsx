import React from 'react';
import {
  Sparkles,
  FileText,
  Target,
  Map,
  MessageSquareCode,
  BookOpen,
  ArrowRight,
  Bot,
  CheckCircle2
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { NavRoute } from '../components/layout/Sidebar';
import { useAuth } from '../context/AuthContext';

interface GetStartedPageProps {
  onNavigate: (route: NavRoute) => void;
}

export const GetStartedPage: React.FC<GetStartedPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const candidateName = user?.profile?.name || 'Student';
  const targetRole = user?.profile?.target_role || 'Software Developer';

  const steps = [
    {
      step: '01',
      title: 'Analyze Your Resume',
      desc: 'Upload your PDF resume to get an instant 0–100 ATS score, section breakdown, and quantified bullet point critique.',
      badge: 'Step 1: Diagnostic',
      route: 'resume' as NavRoute,
      icon: <FileText className="w-6 h-6 text-indigo-500" />,
      cta: 'Analyze Resume Now'
    },
    {
      step: '02',
      title: 'Match Target Job Description',
      desc: 'Paste a target job posting or pick one of our pre-loaded tech roles to see exact semantic alignment and missing skills.',
      badge: 'Step 2: Alignment',
      route: 'jobs' as NavRoute,
      icon: <Target className="w-6 h-6 text-emerald-500" />,
      cta: 'Compare Job Description'
    },
    {
      step: '03',
      title: 'Follow Your 5-Phase Roadmap',
      desc: 'Explore your customized 5-phase career roadmap across 10+ tech domains with project milestones and tracked progress.',
      badge: 'Step 3: Action Plan',
      route: 'roadmap' as NavRoute,
      icon: <Map className="w-6 h-6 text-amber-500" />,
      cta: 'Open Learning Roadmap'
    },
    {
      step: '04',
      title: 'AI Mock Interview Simulator',
      desc: 'Take an interactive, timed mock interview with 5-axis rubric grading (Accuracy, Relevance, Clarity, Communication, Completeness).',
      badge: 'Step 4: Mastery',
      route: 'interview' as NavRoute,
      icon: <MessageSquareCode className="w-6 h-6 text-purple-500" />,
      cta: 'Start Mock Interview'
    }
  ];

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-12">
      {/* Welcome Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-200 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Placement Acceleration Launchpad</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Welcome to CareerPilot AI, {candidateName}!
          </h1>
          <p className="text-sm sm:text-base text-indigo-200 leading-relaxed">
            Here is your 4-step blueprint to go from an academic CV to an offer-ready engineering candidate targeting <strong>{targetRole}</strong>.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onNavigate('resume')}
              className="bg-white text-indigo-950 font-bold hover:bg-slate-100 shadow-md cursor-pointer"
              leftIcon={<FileText className="w-4 h-4 text-indigo-700" />}
            >
              Start with Resume Scan
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onNavigate('chat')}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm cursor-pointer"
              leftIcon={<Bot className="w-4 h-4 text-indigo-200" />}
            >
              Ask AI Career Chat
            </Button>
          </div>
        </div>

        {/* Decorative glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 4 Step Workflow Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Your 4-Step Placement Preparation Journey
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Complete each phase to build a competitive engineering profile.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((st) => (
            <Card key={st.step} hover className="p-6 flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    {st.icon}
                  </div>
                  <span className="text-2xl font-black text-slate-200 dark:text-slate-800">
                    {st.step}
                  </span>
                </div>

                <div>
                  <Badge variant="indigo" size="sm" className="mb-2">{st.badge}</Badge>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {st.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate(st.route)}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                className="w-full justify-between cursor-pointer"
              >
                <span>{st.cta}</span>
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Fast Copilot Tools Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card hover className="p-5 flex items-center justify-between cursor-pointer" onClick={() => onNavigate('questions')}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Tailored Question Bank</h4>
              <p className="text-xs text-slate-500">Practice questions across 11 courses.</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </Card>

        <Card hover className="p-5 flex items-center justify-between cursor-pointer" onClick={() => onNavigate('about')}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">About Platform & Founder</h4>
              <p className="text-xs text-slate-500">Meet Kommana Kesava Ram Sai Tejas.</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </Card>
      </div>
    </div>
  );
};
