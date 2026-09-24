import React, { useState, useEffect } from 'react';
import {
  History,
  FileText,
  Target,
  MessageSquareCode,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Skeleton } from '../components/common/Skeleton';
import { resumeApi, jobsApi, interviewApi } from '../api/endpoints';
import { Resume, JobMatch, InterviewSession } from '../types';
import { NavRoute } from '../components/layout/Sidebar';

interface HistoryPageProps {
  onNavigate: (route: NavRoute) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onNavigate }) => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
  const [interviews, setInterviews] = useState<InterviewSession[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'resume' | 'job' | 'interview'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      resumeApi.getResumeHistory().catch(() => []),
      jobsApi.getJobHistory().catch(() => []),
      interviewApi.getHistory().catch(() => []),
    ]).then(([resumesData, jobsData, interviewsData]) => {
      setResumes(resumesData);
      setJobMatches(jobsData);
      setInterviews(interviewsData);
      setIsLoading(false);
    });
  }, []);

  const totalCount = resumes.length + jobMatches.length + interviews.length;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Recent';
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200/60 dark:border-indigo-800/60 mb-2">
            <History className="w-3.5 h-3.5" />
            <span>Activity Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Analysis & Practice History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Review and track your past resume ATS scans, semantic job matches, and evaluated mock interview sessions.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <TrendingUp className="w-4 h-4 text-indigo-500" />
          <span>Total Records:</span>
          <span className="font-bold text-indigo-600 dark:text-indigo-400">{totalCount}</span>
        </div>
      </div>

      {/* Filter Tabs - Horizontal scrollable on mobile to eliminate clumsy wrapping */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {[
          { id: 'all' as const, label: 'All Activity', count: totalCount },
          { id: 'resume' as const, label: 'Resume Scans', count: resumes.length },
          { id: 'job' as const, label: 'Job Matches', count: jobMatches.length },
          { id: 'interview' as const, label: 'Interviews', count: interviews.length },
        ].map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800/80'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      )}

      {/* History Items Grid */}
      {!isLoading && (
        <div className="space-y-3">
          {/* Resume Analyses */}
          {(activeFilter === 'all' || activeFilter === 'resume') &&
            resumes.map((r) => {
              const score = r.analysis?.score ?? 0;
              const isHigh = score >= 80;
              const isMid = score >= 60 && score < 80;
              return (
                <Card
                  key={`resume-${r.id}`}
                  hover
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 transition-all"
                >
                  {/* Top / Left Section */}
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-center shrink-0 shadow-xs">
                      <FileText className="w-5 h-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <Badge variant="indigo" size="sm">Resume ATS Scan</Badge>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(r.created_at)}
                        </span>
                      </div>
                      <h3
                        className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate"
                        title={r.filename}
                      >
                        {r.filename}
                      </h3>
                    </div>
                  </div>

                  {/* Bottom / Right Section (Mobile 2-tier, Desktop single row) */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2.5 sm:pt-0 border-t border-slate-100 dark:border-slate-800/80 sm:border-0 shrink-0">
                    {r.analysis && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          ATS Score
                        </span>
                        <span
                          className={`text-sm sm:text-base font-black ${
                            isHigh
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : isMid
                              ? 'text-indigo-600 dark:text-indigo-400'
                              : 'text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          {score} / 100
                        </span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => onNavigate('resume')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 transition-all cursor-pointer active:scale-95"
                    >
                      <span>View Scan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </Card>
              );
            })}

          {/* Job Matches */}
          {(activeFilter === 'all' || activeFilter === 'job') &&
            jobMatches.map((jm) => {
              const score = jm.overall_match_score ?? 0;
              const isHigh = score >= 75;
              return (
                <Card
                  key={`job-${jm.id}`}
                  hover
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 transition-all"
                >
                  {/* Top / Left Section */}
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/70 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center shrink-0 shadow-xs">
                      <Target className="w-5 h-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <Badge variant="emerald" size="sm">Job Match</Badge>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(jm.created_at)}
                        </span>
                      </div>
                      <h3
                        className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate"
                        title={`${jm.job_title} at ${jm.company_name}`}
                      >
                        {jm.job_title}{' '}
                        <span className="text-slate-400 font-normal">
                          @ {jm.company_name}
                        </span>
                      </h3>
                    </div>
                  </div>

                  {/* Bottom / Right Section */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2.5 sm:pt-0 border-t border-slate-100 dark:border-slate-800/80 sm:border-0 shrink-0">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Match
                      </span>
                      <span
                        className={`text-sm sm:text-base font-black ${
                          isHigh
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-indigo-600 dark:text-indigo-400'
                        }`}
                      >
                        {score}%
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onNavigate('jobs')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 transition-all cursor-pointer active:scale-95"
                    >
                      <span>View Match</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </Card>
              );
            })}

          {/* Interview Sessions */}
          {(activeFilter === 'all' || activeFilter === 'interview') &&
            interviews.map((iv) => (
              <Card
                key={`interview-${iv.id}`}
                hover
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 transition-all"
              >
                {/* Top / Left Section */}
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/70 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/60 flex items-center justify-center shrink-0 shadow-xs">
                    <MessageSquareCode className="w-5 h-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <Badge variant="purple" size="sm">Mock Interview</Badge>
                      <Badge variant="indigo" size="sm">{iv.status}</Badge>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(iv.created_at)}
                      </span>
                    </div>
                    <h3
                      className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate"
                      title={`${iv.role} — ${iv.interview_type}`}
                    >
                      {iv.role}{' '}
                      <span className="text-slate-400 font-normal">
                        ({iv.interview_type})
                      </span>
                    </h3>
                  </div>
                </div>

                {/* Bottom / Right Section */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2.5 sm:pt-0 border-t border-slate-100 dark:border-slate-800/80 sm:border-0 shrink-0">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Avg Score
                    </span>
                    <span className="text-sm sm:text-base font-black text-purple-600 dark:text-purple-400">
                      {iv.average_score ?? 0} / 10
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigate('interview')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 transition-all cursor-pointer active:scale-95"
                  >
                    <span>View Session</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Card>
            ))}

          {/* Empty State */}
          {((activeFilter === 'all' && totalCount === 0) ||
            (activeFilter === 'resume' && resumes.length === 0) ||
            (activeFilter === 'job' && jobMatches.length === 0) ||
            (activeFilter === 'interview' && interviews.length === 0)) && (
            <Card className="text-center py-12 sm:py-16 px-6 rounded-2xl border-dashed">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4 shadow-xs">
                {activeFilter === 'resume' ? (
                  <FileText className="w-7 h-7" />
                ) : activeFilter === 'job' ? (
                  <Target className="w-7 h-7" />
                ) : activeFilter === 'interview' ? (
                  <MessageSquareCode className="w-7 h-7" />
                ) : (
                  <Sparkles className="w-7 h-7" />
                )}
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {activeFilter === 'resume'
                  ? 'No resume scans yet'
                  : activeFilter === 'job'
                  ? 'No job matches evaluated yet'
                  : activeFilter === 'interview'
                  ? 'No mock interviews taken yet'
                  : 'No placement activity recorded yet'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 mb-5">
                {activeFilter === 'resume'
                  ? 'Upload your PDF resume to receive real-time ATS scoring, keyword match, and quantifiable bullet critiques.'
                  : activeFilter === 'job'
                  ? 'Match your profile against target tech job postings to see semantic alignment and skill gaps.'
                  : activeFilter === 'interview'
                  ? 'Test your engineering communication and technical knowledge in an AI mock interview.'
                  : 'Get started by running a resume diagnostic scan or comparing a target role description.'}
              </p>

              <button
                type="button"
                onClick={() =>
                  onNavigate(
                    activeFilter === 'job'
                      ? 'jobs'
                      : activeFilter === 'interview'
                      ? 'interview'
                      : 'resume'
                  )
                }
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <span>
                  {activeFilter === 'job'
                    ? 'Compare Job Description'
                    : activeFilter === 'interview'
                    ? 'Start Mock Interview'
                    : 'Upload & Scan Resume'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

