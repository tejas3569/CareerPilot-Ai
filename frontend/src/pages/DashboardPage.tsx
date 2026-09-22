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
  Layers
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ScoreRing } from '../components/common/ScoreRing';
import { Skeleton } from '../components/common/Skeleton';
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
      .catch((err) => console.error('Failed to load dashboard stats:', err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 lg:col-span-2 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  const candidateName = user?.profile?.name || 'Student';
  const targetRole = user?.profile?.target_role || 'Software Developer';

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-200 border border-white/10 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Target Role: {targetRole}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {candidateName}!
          </h1>
          <p className="text-sm sm:text-base text-indigo-200 mt-2 leading-relaxed">
            Your AI placement copilot is tracking your preparation milestones. Here is your current readiness snapshot.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('resume')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-white text-indigo-950 hover:bg-slate-100 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-indigo-700" />
              <span>Analyze Resume</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('interview')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm transition-all active:scale-95 cursor-pointer"
            >
              <MessageSquareCode className="w-4 h-4 text-indigo-200" />
              <span>Mock Interview</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Resume Score */}
        <Card hover className="flex flex-col items-center justify-center text-center p-5">
          <ScoreRing
            score={stats?.resume_score ?? 0}
            label="Resume Score"
            sublabel={stats?.resume_score ? 'ATS Match' : 'Pending'}
            colorScheme="indigo"
          />
          <p className="text-xs text-slate-500 mt-2">
            {stats?.resume_score ? 'Calculated from PDF analysis' : 'Upload resume to calculate'}
          </p>
        </Card>

        {/* Latest Job Match */}
        <Card hover className="flex flex-col items-center justify-center text-center p-5">
          <ScoreRing
            score={stats?.latest_job_match_score ?? 0}
            label="Job Match"
            sublabel={stats?.latest_job_match_score ? 'Semantic' : 'Not Run'}
            colorScheme="emerald"
          />
          <p className="text-xs text-slate-500 mt-2">
            {stats?.latest_job_match_score ? 'Vector similarity score' : 'Paste JD to compare'}
          </p>
        </Card>

        {/* Interview Readiness */}
        <Card hover className="flex flex-col items-center justify-center text-center p-5">
          <ScoreRing
            score={stats?.interview_readiness_score ?? 0}
            label="Interview Readiness"
            sublabel={stats?.interview_readiness_score ? 'Evaluated' : 'Ready'}
            colorScheme="blue"
          />
          <p className="text-xs text-slate-500 mt-2">
            5-axis performance average
          </p>
        </Card>

        {/* Skills & Learning Streak */}
        <Card hover className="flex flex-col justify-between p-5">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Placement Streak
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 flex items-center justify-center">
                <Flame className="w-5 h-5 fill-amber-500 text-amber-500 animate-bounce" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                {stats?.current_streak_days ?? 1}
              </span>
              <span className="text-xs font-bold text-slate-400">days active</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">{stats?.skills_detected_count ?? 0}</p>
              <p className="text-slate-500 text-[11px]">Skills Detected</p>
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
            <div>
              <p className="font-bold text-amber-600 dark:text-amber-400">{stats?.missing_skills_count ?? 0}</p>
              <p className="text-slate-500 text-[11px]">Skill Gaps</p>
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
            <div>
              <p className="font-bold text-indigo-600 dark:text-indigo-400">{stats?.profile_completion ?? 20}%</p>
              <p className="text-slate-500 text-[11px]">Profile Filled</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Grid: Priority Action Items + Recent Analyses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Actions (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Prioritized Action Items
            </h2>
            <Badge variant="indigo" size="sm">Smart Recommendations</Badge>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {stats?.recommended_actions && stats.recommended_actions.length > 0 ? (
              stats.recommended_actions.map((action) => (
                <Card key={action.id} hover className="p-4 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        action.priority === 'high' ? 'bg-rose-500' : 'bg-amber-500'
                      }`} />
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {action.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
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
                    className="flex-shrink-0"
                  >
                    {action.action_text}
                  </Button>
                </Card>
              ))
            ) : (
              <Card className="text-center py-8 text-slate-500 text-sm">
                No outstanding action items. You are fully up to date!
              </Card>
            )}
          </div>
        </div>

        {/* Recent Activity Feed (1 Col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" />
              Recent Activity
            </h2>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
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
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300 flex items-center justify-center flex-shrink-0">
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
                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50">
                      {item.score}%
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs">
                No recent activity recorded yet.
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
