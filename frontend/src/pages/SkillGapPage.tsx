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
  Trash2
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ScoreRing } from '../components/common/ScoreRing';
import { skillsApi } from '../api/endpoints';
import { SkillGap, UserSkill } from '../types';
import { useAuth } from '../context/AuthContext';

interface SkillGapPageProps {
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
  onNavigateRoadmap: () => void;
}

export const SkillGapPage: React.FC<SkillGapPageProps> = ({
  onShowToast,
  onNavigateRoadmap,
}) => {
  const { user } = useAuth();
  const [targetRole, setTargetRole] = useState(user?.profile?.target_role || 'AI/ML Engineer');
  const [skillGap, setSkillGap] = useState<SkillGap | null>(null);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const availableRoles = [
    'AI/ML Engineer',
    'Software Developer',
    'Data Analyst',
    'Cloud/DevOps Engineer',
  ];

  const loadGapAnalysis = async (role: string) => {
    setIsLoading(true);
    try {
      const data = await skillsApi.analyzeSkillGap(role);
      setSkillGap(data);
      const allSkills = await skillsApi.getUserSkills();
      setUserSkills(allSkills);
    } catch (err: any) {
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
    if (!newSkillName.trim()) return;
    try {
      await skillsApi.addSkill(newSkillName.trim());
      setNewSkillName('');
      onShowToast(`Added skill: ${newSkillName}`, 'success');
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Skill Gap Analyzer
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Compare your verified competencies against industry hiring benchmarks for high-demand placement profiles.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={onNavigateRoadmap}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          View Learning Roadmap
        </Button>
      </div>

      {/* Target Role Selector */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Select Your Target Role Benchmark
            </label>
            <div className="flex flex-wrap gap-2">
              {availableRoles.map((role) => (
                <button
                  key={role}
                  onClick={() => setTargetRole(role)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    targetRole === role
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="sm:border-l sm:border-slate-200 sm:dark:border-slate-800 sm:pl-6 flex items-center gap-4">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase">Role Readiness</p>
              <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                {skillGap?.readiness_percentage ?? 0}%
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Visual Workflow: Current Skills -> Target Role -> Missing Skills -> Roadmap */}
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Step 1: Current Skills */}
          <Card className="p-5 border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/20">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">1</span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Current Skills</h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">Verified from your resume & additions:</p>
            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
              {skillGap?.current_skills && skillGap.current_skills.length > 0 ? (
                skillGap.current_skills.map((s, idx) => (
                  <Badge key={idx} variant="emerald" size="sm">{s}</Badge>
                ))
              ) : (
                <p className="text-xs text-slate-400">No skills detected yet. Upload resume.</p>
              )}
            </div>
          </Card>

          {/* Step 2: Target Role Requirements */}
          <Card className="p-5 border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-slate-700 text-white text-xs font-bold flex items-center justify-center">2</span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Target Role</h3>
            </div>
            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">{targetRole}</p>
            <p className="text-xs text-slate-500 mb-3">Core industry requirements:</p>
            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
              {skillGap?.role_required_skills.map((s, idx) => (
                <Badge key={idx} variant="slate" size="sm">{s}</Badge>
              ))}
            </div>
          </Card>

          {/* Step 3: Missing Skills */}
          <Card className="p-5 border-rose-200 dark:border-rose-900/60 bg-rose-50/20">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-rose-600 text-white text-xs font-bold flex items-center justify-center">3</span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Missing Gaps</h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">Priority skills to acquire:</p>
            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
              {skillGap?.missing_skills && skillGap.missing_skills.length > 0 ? (
                skillGap.missing_skills.map((s, idx) => (
                  <Badge key={idx} variant="rose" size="sm">{s}</Badge>
                ))
              ) : (
                <span className="text-xs text-emerald-500 font-bold">Zero missing gaps! Ready to apply.</span>
              )}
            </div>
          </Card>

          {/* Step 4: Learning Roadmap Action */}
          <Card className="p-5 border-purple-200 dark:border-purple-900/60 bg-purple-50/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center">4</span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Next Step</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">
                Bridge these gaps with a structured 5-phase career progression plan.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={onNavigateRoadmap}
              className="w-full mt-4"
              leftIcon={<Map className="w-4 h-4" />}
            >
              Generate Roadmap
            </Button>
          </Card>
        </div>
      </div>

      {/* Manual Skill Management Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Manage Your Verified Skills
            </h3>
            <p className="text-xs text-slate-500">
              Add extra languages or frameworks that may not have appeared in your resume.
            </p>
          </div>

          <form onSubmit={handleAddManualSkill} className="flex gap-2">
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="e.g. PyTorch, Docker"
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Button type="submit" size="sm" variant="primary" leftIcon={<Plus className="w-3.5 h-3.5" />}>
              Add
            </Button>
          </form>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {userSkills.map((sk) => (
            <Badge
              key={sk.id}
              variant="indigo"
              onRemove={() => handleDeleteSkill(sk.id)}
            >
              {sk.skill_name}
            </Badge>
          ))}
        </div>
      </Card>
    </div>
  );
};
