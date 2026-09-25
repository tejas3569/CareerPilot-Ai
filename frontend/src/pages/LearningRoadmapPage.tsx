import React, { useState, useEffect } from 'react';
import {
  Map,
  Sparkles,
  CheckCircle2,
  Clock,
  BookOpen,
  ArrowRight,
  RefreshCw,
  ChevronDown,
  Layers,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { roadmapApi } from '../api/endpoints';
import { LearningRoadmap, RoadmapItem } from '../types';
import { useAuth } from '../context/AuthContext';

interface LearningRoadmapPageProps {
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const LearningRoadmapPage: React.FC<LearningRoadmapPageProps> = ({ onShowToast }) => {
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState<LearningRoadmap | null>(null);
  const [targetRole, setTargetRole] = useState(user?.profile?.target_role || 'AI/ML Engineer');
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activePhase, setActivePhase] = useState<number | null>(null);

  const fetchRoadmap = async () => {
    try {
      const data = await roadmapApi.getLatestRoadmap();
      setRoadmap(data);
      if (data.items.length > 0) {
        setActivePhase(data.items[0].phase_number);
      }
    } catch {
      // No roadmap yet, auto-generate for target role
      handleGenerateRoadmap(targetRole);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const handleGenerateRoadmap = async (roleToGenerate: string) => {
    setIsGenerating(true);
    try {
      const data = await roadmapApi.generateRoadmap(roleToGenerate);
      setRoadmap(data);
      if (data.items.length > 0) {
        setActivePhase(data.items[0].phase_number);
      }
      onShowToast(`Generated personalized roadmap for ${roleToGenerate}!`, 'success');
    } catch {
      onShowToast('Failed to generate roadmap.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStatusChange = async (item: RoadmapItem, newStatus: 'not_started' | 'in_progress' | 'completed') => {
    try {
      const updatedItem = await roadmapApi.updateItemStatus(item.id, newStatus);
      if (newStatus === 'completed') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        onShowToast(`Mastered ${item.skill_name}! +10 Placement XP`, 'success');
      }

      // Update local state
      if (roadmap) {
        const updatedItems = roadmap.items.map((it) => it.id === item.id ? updatedItem : it);
        const completedCount = updatedItems.filter((it) => it.status === 'completed').length;
        const inProgressCount = updatedItems.filter((it) => it.status === 'in_progress').length;
        const newProgress = Math.round(((completedCount * 1.0 + inProgressCount * 0.5) / updatedItems.length) * 100);

        setRoadmap({
          ...roadmap,
          progress_percentage: newProgress,
          items: updatedItems,
        });
      }
    } catch {
      onShowToast('Failed to update progress.', 'error');
    }
  };

  // Group items by phase
  const phases = [1, 2, 3, 4, 5].map((pNum) => {
    const items = roadmap?.items.filter((it) => it.phase_number === pNum) || [];
    const phaseName = items[0]?.phase_name || `Phase ${pNum}`;
    const completed = items.filter((it) => it.status === 'completed').length;
    return {
      phase_number: pNum,
      phase_name: phaseName,
      items,
      completed,
      total: items.length
    };
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-normal">
            Personalized Learning Roadmap
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Targeted 5-phase career progression bridging your skill gaps for top placement opportunities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={targetRole}
            onChange={(e) => {
              setTargetRole(e.target.value);
              handleGenerateRoadmap(e.target.value);
            }}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="AI/ML Engineer">AI/ML Engineer</option>
            <option value="Software Developer">Software Developer</option>
            <option value="Frontend Engineer">Frontend Engineer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="Full Stack Developer">Full Stack Developer</option>
            <option value="Data Analyst">Data Analyst</option>
            <option value="Data Scientist">Data Scientist</option>
            <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer</option>
            <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
            <option value="Mobile App Developer">Mobile App Developer</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleGenerateRoadmap(targetRole)}
            isLoading={isGenerating}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Regenerate
          </Button>
        </div>
      </div>

      {/* Overall Progress Banner */}
      <Card className="p-6 bg-gradient-to-r from-indigo-900 to-slate-900 text-white border-0 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <Badge variant="indigo" size="sm" className="bg-white/15 text-indigo-100 border-white/20">
              {roadmap?.target_role || targetRole}
            </Badge>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-normal">
              {roadmap?.title || 'Personalized Engineering Roadmap'}
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
              Track your hands-on project milestones. Check off skills as you build projects to level up your placement readiness.
            </p>
          </div>

          <div className="sm:text-right flex-shrink-0">
            <p className="text-4xl font-black text-indigo-300">
              {roadmap?.progress_percentage ?? 0}%
            </p>
            <p className="text-xs text-indigo-200 font-semibold uppercase tracking-wider mt-0.5">
              Roadmap Completed
            </p>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full bg-white/10 rounded-full h-2.5 mt-6 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-400 to-emerald-400 h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${roadmap?.progress_percentage ?? 0}%` }}
          />
        </div>
      </Card>

      {/* 5-Phase Accordion/Cards */}
      <div className="space-y-6">
        {phases.map((phase) => {
          const isExpanded = activePhase === phase.phase_number || activePhase === null;
          const isAllCompleted = phase.total > 0 && phase.completed === phase.total;

          return (
            <Card
              key={phase.phase_number}
              className={`p-6 transition-all border-l-4 ${
                isAllCompleted
                  ? 'border-l-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10'
                  : 'border-l-indigo-500'
              }`}
            >
              {/* Phase Header */}
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setActivePhase(activePhase === phase.phase_number ? null : phase.phase_number)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center ${
                    isAllCompleted
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                      : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                  }`}>
                    {isAllCompleted ? <CheckCircle2 className="w-4 h-4" /> : phase.phase_number}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {phase.phase_name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {phase.completed} of {phase.total} milestones completed
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isAllCompleted && (
                    <Badge variant="emerald" size="sm">Phase Mastered</Badge>
                  )}
                  <ChevronDown className={`w-5 h-5 text-slate-400 transform transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  }`} />
                </div>
              </div>

              {/* Phase Items List */}
              {isExpanded && (
                <div className="mt-6 space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  {phase.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {item.skill_name}
                          </h4>
                          <Badge
                            variant={
                              item.priority === 'High' ? 'rose' : item.priority === 'Medium' ? 'amber' : 'slate'
                            }
                            size="sm"
                          >
                            {item.priority} Priority
                          </Badge>
                          <Badge variant="indigo" size="sm">
                            {item.difficulty}
                          </Badge>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> ~{item.estimated_hours} hrs
                          </span>
                        </div>

                        {/* Project Idea */}
                        <div className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2 pt-1">
                          <BookOpen className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                          <span><strong className="text-slate-800 dark:text-slate-200">Recommended Project:</strong> {item.project_idea}</span>
                        </div>

                        {/* Prerequisites */}
                        {item.prerequisites && item.prerequisites.length > 0 && (
                          <p className="text-[11px] text-slate-400">
                            Prerequisites: {item.prerequisites.join(', ')}
                          </p>
                        )}
                      </div>

                      {/* Status Toggle Buttons */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(item, 'not_started')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            item.status === 'not_started'
                              ? 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-white'
                              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                          }`}
                        >
                          Not Started
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(item, 'in_progress')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            item.status === 'in_progress'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                              : 'text-slate-400 hover:text-amber-600 dark:hover:text-amber-400'
                          }`}
                        >
                          In Progress
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(item, 'completed')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            item.status === 'completed'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'
                          }`}
                        >
                          Completed ✓
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
