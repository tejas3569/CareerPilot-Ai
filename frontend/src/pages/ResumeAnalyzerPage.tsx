import React, { useState, useEffect, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  HelpCircle,
  Hash,
  Activity,
  Layers,
  Award,
  BookOpen,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ScoreRing } from '../components/common/ScoreRing';
import { Skeleton } from '../components/common/Skeleton';
import { resumeApi } from '../api/endpoints';
import { Resume, ResumeAnalysis } from '../types';

interface ResumeAnalyzerPageProps {
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
  onNavigateRoadmap?: () => void;
}

export const ResumeAnalyzerPage: React.FC<ResumeAnalyzerPageProps> = ({
  onShowToast,
  onNavigateRoadmap,
}) => {
  const [resume, setResume] = useState<Resume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'sections' | 'keywords' | 'raw'>('overview');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchLatestResume = async () => {
    try {
      const data = await resumeApi.getLatestResume();
      setResume(data);
    } catch {
      // No resume uploaded yet
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestResume();
  }, []);

  const handleFileUpload = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      onShowToast('Only PDF format (.pdf) is supported.', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const response = await resumeApi.uploadResume(file);
      onShowToast('Resume uploaded and analyzed successfully!', 'success');
      setResume({
        id: response.resume_id,
        filename: response.filename,
        created_at: new Date().toISOString(),
        analysis: response.analysis,
      });
    } catch (err: any) {
      onShowToast(err.response?.data?.detail || 'Failed to analyze resume.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleLoadSample = async () => {
    setIsUploading(true);
    try {
      const response = await resumeApi.loadSampleResume();
      onShowToast('Loaded and analyzed sample student resume!', 'success');
      setResume({
        id: response.resume_id,
        filename: response.filename,
        created_at: new Date().toISOString(),
        analysis: response.analysis,
      });
    } catch (err: any) {
      onShowToast(err.response?.data?.detail || 'Failed to load sample resume.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 md:col-span-2 rounded-2xl" />
        </div>
      </div>
    );
  }

  const analysis: ResumeAnalysis | undefined = resume?.analysis;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            ATS Resume Analyzer
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Extract verified technical competencies, quantify impact, and optimize your resume for campus recruitment bots.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoadSample}
            isLoading={isUploading}
            leftIcon={<Sparkles className="w-4 h-4 text-amber-500" />}
          >
            Load Sample Resume
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            isLoading={isUploading}
            leftIcon={<UploadCloud className="w-4 h-4" />}
          >
            Upload PDF
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
            accept=".pdf,application/pdf"
            className="hidden"
          />
        </div>
      </div>

      {/* Upload Drag & Drop Box if no resume */}
      {!analysis && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className="border-2 border-dashed border-indigo-200 dark:border-indigo-900/60 rounded-3xl p-12 text-center bg-indigo-50/40 dark:bg-indigo-950/20 hover:bg-indigo-50/70 transition-all cursor-pointer flex flex-col items-center justify-center"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Drag & Drop Your PDF Resume Here
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-1">
            Supports standard PDF format up to 10MB. Or click to select from your files.
          </p>
          <div className="mt-6 flex gap-3">
            <Button size="sm" variant="primary">Select PDF File</Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handleLoadSample();
              }}
            >
              Try Sample Resume
            </Button>
          </div>
        </div>
      )}

      {/* Analysis Results View */}
      {analysis && (
        <div className="space-y-6">
          {/* Top Score Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Score Card */}
            <Card className="flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-white to-indigo-50/40 dark:from-slate-900 dark:to-indigo-950/20">
              <ScoreRing
                score={analysis.score}
                size={140}
                strokeWidth={12}
                label="ATS Resume Score"
                sublabel={`${analysis.score}/100`}
                colorScheme={analysis.score >= 75 ? 'emerald' : analysis.score >= 60 ? 'indigo' : 'amber'}
              />
              <div className="mt-4 text-xs font-semibold">
                {analysis.score >= 80 && (
                  <Badge variant="emerald">Placement Ready</Badge>
                )}
                {analysis.score >= 60 && analysis.score < 80 && (
                  <Badge variant="indigo">Competitive Foundation</Badge>
                )}
                {analysis.score < 60 && (
                  <Badge variant="amber">Needs Key Revisions</Badge>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Scanned: {resume?.filename}
              </p>
            </Card>

            {/* Quick Metrics & Completeness */}
            <Card className="lg:col-span-2 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
                  ATS Structural Breakdown
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    <p className="text-[11px] font-bold text-slate-500 uppercase">Word Count</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                      {analysis.ats_metrics.word_count}
                    </p>
                    <p className="text-[10px] text-emerald-500 font-semibold mt-1">Ideal: 400-750</p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    <p className="text-[11px] font-bold text-slate-500 uppercase">Action Verbs</p>
                    <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                      {analysis.ats_metrics.action_verbs_count}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium mt-1">Impact words</p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    <p className="text-[11px] font-bold text-slate-500 uppercase">Metrics Found</p>
                    <p className="text-xl font-black text-purple-600 dark:text-purple-400 mt-0.5">
                      {analysis.ats_metrics.metrics_count}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium mt-1">Percentages / numbers</p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    <p className="text-[11px] font-bold text-slate-500 uppercase">Skills Found</p>
                    <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {analysis.detected_skills.length}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium mt-1">Tech competencies</p>
                  </div>
                </div>
              </div>

              {/* Missing Sections Alert */}
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {analysis.missing_sections.length === 0 ? (
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> All essential ATS sections detected
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" /> Missing sections: {analysis.missing_sections.join(', ')}
                    </span>
                  )}
                </div>
                {onNavigateRoadmap && (
                  <button
                    onClick={onNavigateRoadmap}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 inline-flex items-center gap-1"
                  >
                    Bridge Gaps <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </Card>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Feedback & Suggestions
            </button>
            <button
              onClick={() => setActiveTab('keywords')}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
                activeTab === 'keywords'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Extracted Skills ({analysis.detected_skills.length})
            </button>
            <button
              onClick={() => setActiveTab('sections')}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
                activeTab === 'sections'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Parsed Sections
            </button>
          </div>

          {/* Tab 1: Overview (Strengths, Weaknesses, Suggestions) */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <Card className="p-6 space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Strong Elements
                </h3>
                <ul className="space-y-2.5">
                  {analysis.strengths.map((str, idx) => (
                    <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Weaknesses */}
              <Card className="p-6 space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Areas for Improvement
                </h3>
                <ul className="space-y-2.5">
                  {analysis.weaknesses.map((wk, idx) => (
                    <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                      <span>{wk}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Actionable Suggestions */}
              <Card className="p-6 md:col-span-2 space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Actionable Recommendations
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  {analysis.suggestions.map((sug, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                      <p className="font-semibold text-slate-900 dark:text-white mb-1">Tip #{idx + 1}</p>
                      {sug}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Project Quality Suggestions */}
              {analysis.project_suggestions && analysis.project_suggestions.length > 0 && (
                <Card className="p-6 md:col-span-2 space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-purple-500" /> Project Quality Enhancements
                  </h3>
                  <div className="space-y-2">
                    {analysis.project_suggestions.map((ps, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">→</span>
                        <span>{ps}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Tab 2: Extracted Skills */}
          {activeTab === 'keywords' && (
            <Card className="p-6 space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Verified Skills Detected From Resume
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  These canonical terms were extracted and matched against our industry database of 350+ skills.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {analysis.detected_skills.map((skill, idx) => (
                  <Badge key={idx} variant="indigo" size="md">
                    {skill}
                  </Badge>
                ))}
              </div>

              {/* Action Verbs Found */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Key Action Verbs Detected
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.ats_metrics.unique_action_verbs.map((verb, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                    >
                      {verb}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Tab 3: Parsed Sections */}
          {activeTab === 'sections' && (
            <div className="space-y-4">
              {analysis.parsed_sections.projects && (
                <Card className="p-6 space-y-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-500" /> Extracted Projects
                  </h3>
                  <div className="space-y-4">
                    {analysis.parsed_sections.projects.map((proj, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{proj.title}</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 whitespace-pre-line leading-relaxed">
                          {proj.description}
                        </p>
                        {proj.technologies && proj.technologies.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {proj.technologies.map((t, tidx) => (
                              <Badge key={tidx} variant="slate" size="sm">{t}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {analysis.parsed_sections.education && (
                <Card className="p-6">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Education Section</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed">
                    {analysis.parsed_sections.education}
                  </p>
                </Card>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
