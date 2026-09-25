import React, { useState, useEffect } from 'react';
import {
  Target,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  Briefcase,
  Layers,
  ArrowRight,
  HelpCircle,
  Info
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ScoreRing } from '../components/common/ScoreRing';
import { jobsApi } from '../api/endpoints';
import { JobMatch, SampleJob } from '../types';

interface JobMatchPageProps {
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
  onNavigateRoadmap?: () => void;
  onNavigateResume?: () => void;
}

export const JobMatchPage: React.FC<JobMatchPageProps> = ({
  onShowToast,
  onNavigateRoadmap,
  onNavigateResume,
}) => {
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [samples, setSamples] = useState<SampleJob[]>([]);
  const [matchResult, setMatchResult] = useState<JobMatch | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<JobMatch[]>([]);

  useEffect(() => {
    // Load sample jobs and previous matches
    jobsApi.getSampleJobs().then(setSamples).catch(console.error);
    jobsApi.getJobHistory().then((data) => {
      setHistory(data);
      if (data.length > 0) {
        setMatchResult(data[0]);
      }
    }).catch(console.error);
  }, []);

  const handleApplySample = (sample: SampleJob) => {
    setJobTitle(sample.title);
    setCompanyName(sample.company);
    setJobDescription(sample.description);
    onShowToast(`Loaded template: ${sample.title}`, 'info');
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      onShowToast('Please paste a job description.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const result = await jobsApi.analyzeJobMatch({
        job_title: jobTitle || 'Target Role',
        company_name: companyName || 'Target Company',
        job_description: jobDescription,
      });
      setMatchResult(result);
      setHistory((prev) => [result, ...prev]);
      onShowToast('Semantic job match analysis complete!', 'success');
    } catch (err: any) {
      const errMsg = err.response?.data?.detail || 'Failed to analyze job match.';
      onShowToast(errMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-normal">
          Semantic Job Match Analyzer
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Vector-space comparison of your resume against target job postings. Uncover skill overlaps, keyword gaps, and tailored recommendations.
        </p>
      </div>

      {/* Input Section & Sample Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Job Title
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. AI/ML Engineer Intern"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Stripe, Google, Anthropic"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Job Description Text
              </label>
              <textarea
                rows={7}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job posting, responsibilities, and required qualifications here..."
                className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">
                Matches against your latest uploaded resume
              </span>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
                rightIcon={<Sparkles className="w-4 h-4" />}
              >
                Calculate Semantic Match
              </Button>
            </div>
          </form>
        </Card>

        {/* Quick Sample Templates */}
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                One-Click Sample Postings
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Test semantic embedding match immediately with real job descriptions:
            </p>

            <div className="space-y-2.5">
              {samples.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleApplySample(sample)}
                  className="w-full text-left p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-indigo-50/40 transition-all text-xs"
                >
                  <p className="font-bold text-slate-900 dark:text-white">{sample.title}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{sample.company}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span>Scores are evaluated using vector cosine similarity.</span>
          </div>
        </Card>
      </div>

      {/* Match Results Display */}
      {matchResult && (
        <div className="space-y-6">
          {/* Top Score Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-white to-emerald-50/30 dark:from-slate-900 dark:to-emerald-950/20">
              <ScoreRing
                score={matchResult.overall_match_score}
                size={140}
                strokeWidth={12}
                label="Overall Match"
                sublabel={`${matchResult.overall_match_score}%`}
                colorScheme={matchResult.overall_match_score >= 70 ? 'emerald' : 'indigo'}
              />
              <div className="mt-4">
                <Badge variant={matchResult.overall_match_score >= 70 ? 'emerald' : 'indigo'}>
                  {matchResult.overall_match_score >= 70 ? 'Strong Candidate Alignment' : 'Moderate Alignment'}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {matchResult.job_title} @ {matchResult.company_name}
              </p>
            </Card>

            <Card className="lg:col-span-2 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
                  Match Dimension Breakdown
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-500 uppercase">Semantic Vector Similarity</p>
                    <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                      {Math.round(matchResult.semantic_score * 100)}%
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Reflects contextual conceptual and domain alignment.
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-500 uppercase">Hard Keyword Coverage</p>
                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                      {Math.round(matchResult.keyword_score * 100)}%
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {matchResult.matching_skills.length} of {matchResult.matching_skills.length + matchResult.missing_skills.length} recognized skills present.
                    </p>
                  </div>
                </div>
              </div>

              {/* Explicit legal/ethical disclaimer */}
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                <span className="font-bold text-slate-500">Notice:</span> CareerPilot AI matching score reflects keyword & semantic alignment and does not guarantee employment or interview invitations.
              </div>
            </Card>
          </div>

          {/* Skills Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Matching Skills */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Matching Skills ({matchResult.matching_skills.length})
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {matchResult.matching_skills.length > 0 ? (
                  matchResult.matching_skills.map((skill, idx) => (
                    <Badge key={idx} variant="emerald">{skill}</Badge>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">No overlapping skills found.</span>
                )}
              </div>
            </Card>

            {/* Missing Skills */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Missing Skills ({matchResult.missing_skills.length})
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {matchResult.missing_skills.length > 0 ? (
                  matchResult.missing_skills.map((skill, idx) => (
                    <Badge key={idx} variant="rose">{skill}</Badge>
                  ))
                ) : (
                  <span className="text-xs text-emerald-500">No major missing skills!</span>
                )}
              </div>
            </Card>

            {/* Recommended Skills */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Recommended Learning
                </h3>
              </div>
              <ul className="space-y-2">
                {matchResult.recommended_skills.map((rec, idx) => (
                  <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                    <span className="text-indigo-500 font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Actionable Tailoring Recommendations & Relevant Projects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tailoring Recommendations */}
            <Card className="p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Actionable Resume Tailoring Tips
              </h3>
              <div className="space-y-3">
                {matchResult.recommendations.map((tip, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                    <p className="font-semibold text-slate-900 dark:text-white mb-0.5">Tip #{idx + 1}</p>
                    {tip}
                  </div>
                ))}
              </div>
            </Card>

            {/* Relevant Resume Projects */}
            <Card className="p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Relevant Resume Projects for this Job
              </h3>
              <div className="space-y-3">
                {matchResult.relevant_projects.length > 0 ? (
                  matchResult.relevant_projects.map((proj, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{proj.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{proj.relevance_note}</p>
                      {proj.matched_skills && proj.matched_skills.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {proj.matched_skills.map((s, sidx) => (
                            <Badge key={sidx} variant="slate" size="sm">{s}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No specific projects identified.</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
