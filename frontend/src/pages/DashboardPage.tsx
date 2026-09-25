import React, { useEffect, useState } from 'react';
import {
  FileText,
  Target,
  Compass,
  MessageSquareCode,
  Flame,
  ArrowRight,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Map,
  Bot,
  Zap,
  Award,
  ChevronRight,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ScoreRing } from '../components/common/ScoreRing';
import { Skeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { dashboardApi } from '../api/endpoints';
import { DashboardStats } from '../types';
import { useAuth } from '../context/AuthContext';
import { NavRoute } from '../components/layout/Sidebar';

interface DashboardPageProps {
  onNavigate: (route: NavRoute) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getStats()
      .then((data) => setStats(data))
      .catch((err) => console.error('Failed to load dashboard telemetry:', err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-32 w-full rounded-3xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 lg:col-span-2 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  const candidateName = user?.profile?.name || 'Student';
  const targetRole = user?.profile?.target_role || 'Software Developer';

  // Calculate overall readiness tier
  const resumeScore = stats?.resume_score ?? 0;
  const jobMatchScore = stats?.latest_job_match_score ?? 0;
  const interviewScore = stats?.interview_readiness_score ?? 0;
  const totalVerified = stats?.skills_detected_count ?? 0;
  const totalMissing = stats?.missing_skills_count ?? 0;
  const profileCompletion = stats?.profile_completion ?? 25;

  const averageReadiness = Math.round(
    ((resumeScore > 0 ? resumeScore : 40) +
     (jobMatchScore > 0 ? jobMatchScore : 35) +
     (interviewScore > 0 ? interviewScore : 30)) / 3
  );

  const getReadinessTier = (score: number) => {
    if (score >= 80) return { label: 'Offer-Ready Candidate', variant: 'emerald' as const };
    if (score >= 60) return { label: 'Competitive Applicant', variant: 'indigo' as const };
    return { label: 'Foundational Stage', variant: 'amber' as const };
  };

  const tier = getReadinessTier(averageReadiness);

  return (
    <div className="space-y-8 pb-8">
      {/* 1. Personalized Command Center Greeting */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-800/40">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-200 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Target: <strong className="text-white ml-0.5">{targetRole}</strong>
            </span>
            <Badge variant={tier.variant} size="sm" dot>
              {tier.label}
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome to Your Career Command Center, {candidateName}
          </h1>

          <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed max-w-2xl">
            Real-time telemetry tracking your resume ATS health, role competency benchmarks, interview readiness rubrics, and prioritized placement milestones.
          </p>

          {/* Quick Action Shortcuts */}
          <div className="pt-3 flex flex-wrap items-center gap-2.5">
            <Button
              size="sm"
              variant="primary"
              onClick={() => onNavigate('resume')}
              leftIcon={<FileText className="w-4 h-4 text-indigo-200" />}
              className="text-xs font-bold"
            >
              Analyze Resume
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onNavigate('interview')}
              leftIcon={<MessageSquareCode className="w-4 h-4 text-indigo-300" />}
              className="text-xs font-semibold border-white/20 bg-white/10 text-white hover:bg-white/20"
            >
              Start Mock Interview
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onNavigate('chat')}
              leftIcon={<Bot className="w-4 h-4 text-emerald-300" />}
              className="text-xs font-semibold text-indigo-200 hover:text-white hover:bg-white/10"
            >
              AI Copilot Chat
            </Button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Key Progress Telemetry (4 Core Pillars) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* ATS Resume Score */}
        <Card hover onClick={() => onNavigate('resume')} className="flex flex-col items-center justify-center text-center p-5 cursor-pointer">
          <ScoreRing
            score={stats?.resume_score ?? 0}
            label="Resume ATS Score"
            sublabel={stats?.resume_score ? 'Diagnostic Verified' : 'Scan Required'}
            colorScheme="indigo"
          />
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            {stats?.resume_score ? 'Calculated from PDF structure & keywords' : 'Upload PDF resume to compute'}
          </p>
        </Card>

        {/* Semantic Job Match Score */}
        <Card hover onClick={() => onNavigate('jobs')} className="flex flex-col items-center justify-center text-center p-5 cursor-pointer">
          <ScoreRing
            score={stats?.latest_job_match_score ?? 0}
            label="Job Description Match"
            sublabel={stats?.latest_job_match_score ? 'Cosine Similarity' : 'Not Tested'}
            colorScheme="emerald"
          />
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            {stats?.latest_job_match_score ? `Aligned against ${targetRole}` : 'Paste target job description to match'}
          </p>
        </Card>

        {/* Interview Readiness */}
        <Card hover onClick={() => onNavigate('interview')} className="flex flex-col items-center justify-center text-center p-5 cursor-pointer">
          <ScoreRing
            score={stats?.interview_readiness_score ?? 0}
            label="Interview Readiness"
            sublabel={stats?.interview_readiness_score ? 'Rubric Tested' : 'Ready for Drill'}
            colorScheme="blue"
          />
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            5-axis rubric average (Accuracy, Clarity, etc.)
          </p>
        </Card>

        {/* Placement Streak & Profile Health */}
        <Card hover onClick={() => onNavigate('profile')} className="flex flex-col justify-between p-5 cursor-pointer">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Placement Streak
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 flex items-center justify-center">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                {stats?.current_streak_days ?? 1}
              </span>
              <span className="text-xs font-semibold text-slate-400">Days Active</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Profile Completion:</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{profileCompletion}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Skills Competency vs Gap Ratio Bar */}
      <Card className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Verified Competencies vs Role Benchmarks</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Target benchmark: <strong>{targetRole}</strong>. Verified skills reflect your resume analysis and manually added credentials.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onNavigate('skills')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              className="text-xs font-semibold"
            >
              Manage Skills
            </Button>
            <Button
              size="sm"
              variant="soft"
              onClick={() => onNavigate('roadmap')}
              rightIcon={<Map className="w-3.5 h-3.5" />}
              className="text-xs font-semibold"
            >
              View Roadmap
            </Button>
          </div>
        </div>

        {/* Progress Bar & Badges */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Verified: <strong>{totalVerified} Competencies</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Gaps to Bridge: <strong>{totalMissing} Skills</strong>
              </span>
            </div>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{
                width: `${totalVerified + totalMissing > 0 ? (totalVerified / (totalVerified + totalMissing)) * 100 : 50}%`
              }}
              title="Verified Skills"
            />
            <div
              className="h-full bg-amber-500 transition-all duration-500"
              style={{
                width: `${totalVerified + totalMissing > 0 ? (totalMissing / (totalVerified + totalMissing)) * 100 : 50}%`
              }}
              title="Skill Gaps"
            />
          </div>
        </div>
      </Card>

      {/* 4. Main Two-Column Layout: Prioritized Next Actions & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Prioritized Next Actions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Prioritized Next Actions</span>
            </h2>
            <Badge variant="indigo" size="sm">High Yield</Badge>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {stats?.recommended_actions && stats.recommended_actions.length > 0 ? (
              stats.recommended_actions.map((action) => (
                <Card key={action.id} hover className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          action.priority === 'high' ? 'bg-rose-500' : 'bg-amber-500'
                        }`}
                      />
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {action.title}
                      </h3>
                      <Badge
                        variant={action.priority === 'high' ? 'rose' : 'amber'}
                        size="xs"
                      >
                        {action.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {action.description}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const cleanRoute = action.route.replace('/', '') as NavRoute;
                      onNavigate(cleanRoute);
                    }}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    className="shrink-0 w-full sm:w-auto"
                  >
                    {action.action_text}
                  </Button>
                </Card>
              ))
            ) : (
              <EmptyState
                icon={<CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                title="All Milestones Up to Date"
                description="You have completed all active recommended tasks. Check your learning roadmap to build your next milestone project."
                actionText="Open Roadmap"
                onAction={() => onNavigate('roadmap')}
              />
            )}
          </div>

          {/* AI Career Insights Card */}
          <Card className="p-5 border-indigo-200/80 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/40 via-white to-purple-50/20 dark:from-indigo-950/30 dark:via-slate-900 dark:to-purple-950/20">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                AI Placement Insights
              </h3>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {resumeScore < 70 && (
                <div className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>
                    <strong>Resume Diagnostic:</strong> Your ATS score ({resumeScore}/100) indicates missing technical keywords or metric-driven bullet points. Rewriting project bullets with the Google XYZ framework will significantly increase recruiter callbacks.
                  </span>
                </div>
              )}
              {totalMissing > 0 && (
                <div className="flex items-start gap-2">
                  <span className="text-indigo-500 font-bold">•</span>
                  <span>
                    <strong>Skill Gap Advisory:</strong> You have {totalMissing} missing competencies for {targetRole}. Focus on Phase 1 & 2 roadmap milestones to establish baseline credentials.
                  </span>
                </div>
              )}
              {interviewScore === 0 ? (
                <div className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">•</span>
                  <span>
                    <strong>Interview Preparation:</strong> You have not completed a mock interview yet. Complete a 5-question technical drill to test your technical articulation under pressure.
                  </span>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>
                    <strong>Interview Mastery:</strong> Current average score is {interviewScore}%. Focus on concise, structured answers to maximize your Clarity and Relevance rubric scores.
                  </span>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Recent Activity Timeline */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Recent Activity</span>
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('history')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 cursor-pointer"
            >
              View All
            </button>
          </div>

          <Card className="p-4 space-y-3">
            {stats?.recent_analyses && stats.recent_analyses.length > 0 ? (
              stats.recent_analyses.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300 flex items-center justify-center shrink-0">
                      {item.type === 'resume' && <FileText className="w-4 h-4" />}
                      {item.type === 'job_match' && <Target className="w-4 h-4" />}
                      {item.type === 'interview' && <MessageSquareCode className="w-4 h-4" />}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-slate-400">{item.date}</p>
                    </div>
                  </div>

                  {item.score !== null && (
                    <Badge variant="indigo" size="xs">
                      {item.score}%
                    </Badge>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                No activity recorded yet. Run a resume analysis or mock interview to populate your timeline.
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
