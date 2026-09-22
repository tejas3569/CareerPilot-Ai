import React, { useState, useEffect } from 'react';
import {
  History,
  FileText,
  Target,
  MessageSquareCode,
  Calendar,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Analysis & Practice History
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review your past resume ATS scans, semantic job matches, and evaluated mock interview sessions.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'resume', 'job', 'interview'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
              activeFilter === filter
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {filter === 'all' ? 'All Activity' : filter === 'job' ? 'Job Matches' : filter === 'resume' ? 'Resume Scans' : 'Interviews'}
          </button>
        ))}
      </div>

      {/* History Items Grid */}
      <div className="space-y-4">
        {/* Resume Analyses */}
        {(activeFilter === 'all' || activeFilter === 'resume') &&
          resumes.map((r) => (
            <Card key={`resume-${r.id}`} hover className="p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{r.filename}</h3>
                    <Badge variant="indigo" size="sm">Resume ATS Scan</Badge>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(r.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {r.analysis && (
                  <div className="text-right">
                    <p className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                      {r.analysis.score} / 100
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">ATS Score</p>
                  </div>
                )}
                <button
                  onClick={() => onNavigate('resume')}
                  className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}

        {/* Job Matches */}
        {(activeFilter === 'all' || activeFilter === 'job') &&
          jobMatches.map((jm) => (
            <Card key={`job-${jm.id}`} hover className="p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {jm.job_title} ({jm.company_name})
                    </h3>
                    <Badge variant="emerald" size="sm">Job Match</Badge>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(jm.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                    {jm.overall_match_score}%
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Match Score</p>
                </div>
                <button
                  onClick={() => onNavigate('jobs')}
                  className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}

        {/* Interview Sessions */}
        {(activeFilter === 'all' || activeFilter === 'interview') &&
          interviews.map((iv) => (
            <Card key={`interview-${iv.id}`} hover className="p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
                  <MessageSquareCode className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {iv.role} — {iv.interview_type}
                    </h3>
                    <Badge variant="indigo" size="sm">{iv.status}</Badge>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(iv.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-lg font-black text-purple-600 dark:text-purple-400">
                    {iv.average_score} / 10
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Avg Score</p>
                </div>
                <button
                  onClick={() => onNavigate('interview')}
                  className="p-2 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}

        {resumes.length === 0 && jobMatches.length === 0 && interviews.length === 0 && !isLoading && (
          <Card className="text-center py-12 text-slate-400 text-sm">
            No history recorded yet. Start by uploading a resume or taking a mock interview!
          </Card>
        )}
      </div>
    </div>
  );
};
