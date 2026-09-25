import React, { useState, useEffect } from 'react';
import {
  Compass,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  Map,
  Plus,
  Trash2,
  FileText,
  Upload,
  RefreshCw,
  TrendingUp,
  Check
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { skillsApi } from '../api/endpoints';
import { SkillGap, UserSkill } from '../types';
import { useAuth } from '../context/AuthContext';
import { NavRoute } from '../components/layout/Sidebar';

interface SkillGapPageProps {
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
  onNavigateRoadmap: () => void;
  onNavigateResume?: () => void;
}

export const SkillGapPage: React.FC<SkillGapPageProps> = ({
  onShowToast,
  onNavigateRoadmap,
  onNavigateResume,
}) => {
  const { user } = useAuth();
  const [targetRole, setTargetRole] = useState(user?.profile?.target_role || 'Software Developer');
  const [skillGap, setSkillGap] = useState<SkillGap | null>(null);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<string[]>([
    'Software Developer',
    'AI/ML Engineer',
    'Cloud/DevOps Engineer',
    'Data Analyst',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Scientist',
  ]);

  useEffect(() => {
    skillsApi.getTaxonomy()
      .then((data) => {
        if (data.available_roles && data.available_roles.length > 0) {
          // Merge default roles and taxonomy roles
          const merged = Array.from(new Set([
            'Software Developer',
            'AI/ML Engineer',
            'Cloud/DevOps Engineer',
            'Data Analyst',
            'Frontend Developer',
            'Backend Developer',
            ...data.available_roles
          ]));
          setAvailableRoles(merged);
        }
      })
      .catch(() => {
        // Fallback already configured
      });
  }, []);

  const loadGapAnalysis = async (role: string) => {
    setIsLoading(true);
    try {
      const data = await skillsApi.analyzeSkillGap(role);
      setSkillGap(data);
      const allSkills = await skillsApi.getUserSkills();
      setUserSkills(allSkills);
    } catch {
      onShowToast('Failed to analyze skill gaps.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGapAnalysis(targetRole);
  }, [targetRole]);

  const handleAddManualSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSkillName.trim();
    if (!trimmed) return;
    try {
      await skillsApi.addSkill(trimmed);
      setNewSkillName('');
      onShowToast(`Added verified skill: ${trimmed}`, 'success');
      loadGapAnalysis(targetRole);
    } catch {
      onShowToast('Failed to add skill.', 'error');
    }
  };

  const handleDeleteSkill = async (id: number) => {
    try {
      await skillsApi.deleteSkill(id);
      onShowToast('Skill removed', 'info');
      loadGapAnalysis(targetRole);
    } catch {
      onShowToast('Failed to remove skill.', 'error');
    }
  };

  const handleAddSampleSkills = async () => {
    const samplePack = [
      'Python', 'Data Structures & Algorithms', 'SQL', 'Git',
      'Docker', 'REST APIs', 'FastAPI', 'PostgreSQL'
    ];
    try {
      for (const sk of samplePack) {
        await skillsApi.addSkill(sk).catch(() => {});
      }
      onShowToast('Loaded sample core tech skill pack', 'success');
      loadGapAnalysis(targetRole);
    } catch {
      onShowToast('Failed to seed sample skills', 'error');
    }
  };

  // Compute matched skills deterministically
  const totalRequired = skillGap?.role_required_skills.length ?? 0;
  const missingCount = skillGap?.missing_skills.length ?? 0;
  const matchingCount = Math.max(0, totalRequired - missingCount);
  const readiness = skillGap?.readiness_percentage ?? 0;

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200/60 dark:border-indigo-800/60 mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Deterministic Role Benchmarks</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-normal">
            Skill Gap Analyzer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Accurately compares your verified skills against standard hiring benchmarks for top engineering roles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateResume && (
            <Button
              variant="outline"
              size="sm"
              onClick={onNavigateResume}
              leftIcon={<FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
              className="cursor-pointer"
            >
              Scan Resume
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={onNavigateRoadmap}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="cursor-pointer"
          >
            Open Roadmap
          </Button>
        </div>
      </div>

      {/* Target Role Benchmark Selector */}
      <Card className="p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Select Placement Role Benchmark
              </label>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                Evaluating: <strong>{targetRole}</strong>
              </span>
            </div>

            {/* Horizontal scrollable role pills */}
            <div className="flex flex-wrap gap-2">
              {availableRoles.map((role) => {
                const isSelected = targetRole.toLowerCase() === role.toLowerCase();
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setTargetRole(role)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/20'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/50 dark:border-slate-700/50'
                    }`}
                  >
                    {role}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Readiness Gauge Card */}
          <div className="lg:border-l lg:border-slate-200 dark:lg:border-slate-800 lg:pl-6 flex flex-col justify-center min-w-[200px]">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                Role Readiness
              </span>
              <span className={`text-2xl sm:text-3xl font-black ${
                readiness >= 75
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : readiness >= 50
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-amber-600 dark:text-amber-400'
              }`}>
                {readiness}%
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden my-2">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  readiness >= 75
                    ? 'bg-emerald-500'
                    : readiness >= 50
                    ? 'bg-indigo-600'
                    : 'bg-amber-500'
                }`}
                style={{ width: `${Math.max(6, readiness)}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-400 font-medium">
              <strong>{matchingCount}</strong> of <strong>{totalRequired}</strong> competencies verified
            </p>
          </div>
        </div>
      </Card>

      {/* Visual 4-Step Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Step 1: Current Skills */}
        <Card className="p-5 border-indigo-200/80 dark:border-indigo-900/60 bg-indigo-50/20 dark:bg-indigo-950/20 flex flex-col justify-between rounded-2xl shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-black flex items-center justify-center">
                  1
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Verified Skills
                </h3>
              </div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {skillGap?.current_skills?.length ?? 0}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Skills extracted from resume & manual additions:
            </p>

            <div className="flex flex-wrap gap-1.5 max-h-52 overflow-y-auto pr-1">
              {skillGap?.current_skills && skillGap.current_skills.length > 0 ? (
                skillGap.current_skills.map((s, idx) => (
                  <Badge key={idx} variant="emerald" size="sm">
                    {s}
                  </Badge>
                ))
              ) : (
                <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300 w-full space-y-2">
                  <p className="font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    No skills detected yet
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    Upload your resume or click below to seed sample tech skills.
                  </p>
                  <button
                    type="button"
                    onClick={handleAddSampleSkills}
                    className="w-full text-center py-1 rounded-lg bg-amber-200 dark:bg-amber-800 text-amber-950 dark:text-amber-100 font-bold text-[11px] cursor-pointer hover:opacity-90"
                  >
                    + Load Sample Skills
                  </button>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Step 2: Role Required Skills */}
        <Card className="p-5 border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between rounded-2xl shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-700 dark:bg-slate-300 text-white dark:text-slate-900 text-xs font-black flex items-center justify-center">
                  2
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Role Benchmark
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-500">
                {totalRequired}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Core industry requirements for <strong>{targetRole}</strong>:
            </p>

            <div className="flex flex-wrap gap-1.5 max-h-52 overflow-y-auto pr-1">
              {skillGap?.role_required_skills.map((s, idx) => (
                <Badge key={idx} variant="slate" size="sm">
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        {/* Step 3: Missing Skill Gaps */}
        <Card className="p-5 border-rose-200/80 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/20 flex flex-col justify-between rounded-2xl shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-rose-600 text-white text-xs font-black flex items-center justify-center">
                  3
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Missing Gaps
                </h3>
              </div>
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                {missingCount}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Priority gaps to bridge for {targetRole}:
            </p>

            <div className="flex flex-wrap gap-1.5 max-h-52 overflow-y-auto pr-1">
              {skillGap?.missing_skills && skillGap.missing_skills.length > 0 ? (
                skillGap.missing_skills.map((s, idx) => (
                  <Badge key={idx} variant="rose" size="sm">
                    {s}
                  </Badge>
                ))
              ) : (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>100% matched! Zero missing competencies.</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Step 4: Roadmap Action */}
        <Card className="p-5 border-purple-200/80 dark:border-purple-900/60 bg-purple-50/20 dark:bg-purple-950/20 flex flex-col justify-between rounded-2xl shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-black flex items-center justify-center">
                4
              </span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Next Step
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-2 leading-relaxed">
              Bridge your remaining <strong>{missingCount} gaps</strong> with a personalized 5-phase career roadmap.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={onNavigateRoadmap}
            className="w-full mt-4 cursor-pointer"
            leftIcon={<Map className="w-4 h-4" />}
          >
            Generate Roadmap
          </Button>
        </Card>
      </div>

      {/* Manual Skill Management Card */}
      <Card className="p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Manage Your Verified Skills
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Add extra languages, frameworks, or cloud tools that might not have appeared on your resume.
            </p>
          </div>

          <form onSubmit={handleAddManualSkill} className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="e.g. PyTorch, Docker, Kubernetes"
              className="flex-1 sm:w-64 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            />
            <Button
              type="submit"
              size="sm"
              variant="primary"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="cursor-pointer shrink-0"
            >
              Add Skill
            </Button>
          </form>
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          {userSkills.length > 0 ? (
            userSkills.map((sk) => (
              <Badge
                key={sk.id}
                variant="indigo"
                onRemove={() => handleDeleteSkill(sk.id)}
                className="cursor-pointer"
              >
                {sk.skill_name}
              </Badge>
            ))
          ) : (
            <p className="text-xs text-slate-400 py-2">
              No manual skills recorded yet. Use the form above to add your proficiencies.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

