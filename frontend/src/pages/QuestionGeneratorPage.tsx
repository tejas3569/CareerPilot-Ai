import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RefreshCw,
  Lightbulb,
  CheckCircle2,
  Filter,
  Copy,
  Briefcase
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { interviewApi } from '../api/endpoints';
import { QuestionBankItem } from '../types';
import { useAuth } from '../context/AuthContext';

interface QuestionGeneratorPageProps {
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const COMMON_ROLES = [
  'Software Developer',
  'Frontend Engineer',
  'Backend Developer',
  'Full Stack Engineer',
  'AI/ML Engineer',
  'Data Analyst',
  'DevOps Engineer'
];

export const QuestionGeneratorPage: React.FC<QuestionGeneratorPageProps> = ({ onShowToast }) => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<QuestionBankItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [targetRole, setTargetRole] = useState(user?.profile?.target_role || 'Software Developer');

  const loadQuestions = async (roleToLoad: string, isRefresh: boolean = false, cat?: string) => {
    setIsLoading(true);
    try {
      const activeCat = cat !== undefined ? cat : selectedCategory;
      const res = await interviewApi.generateQuestionBank({
        target_role: roleToLoad,
        category: activeCat === 'All' ? undefined : activeCat,
        force_refresh: isRefresh,
      });
      setQuestions(res.questions);
      if (isRefresh) {
        onShowToast('Generated fresh set of tailored interview questions!', 'success');
      }
    } catch {
      onShowToast('Failed to generate tailored interview questions.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions(targetRole, false, 'All');
  }, []);

  const handleRoleChange = (newRole: string) => {
    setTargetRole(newRole);
    loadQuestions(newRole, true, selectedCategory);
  };

  const handleCopyQuestion = (text: string) => {
    navigator.clipboard.writeText(text);
    onShowToast('Question copied to clipboard!', 'info');
  };

  // Derive unique categories from questions list
  const categories = ['All', ...Array.from(new Set(questions.map((q) => q.category)))];

  const filteredQuestions = selectedCategory === 'All'
    ? questions
    : questions.filter((q) => q.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Interactive Placement Question Bank</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-normal">
            Tailored Interview Question Bank
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Explore comprehensive interview questions across modern courses and domains, tailored to your resume, projects, and target role.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Role selector dropdown */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs">
            <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
            <select
              value={targetRole}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="bg-transparent font-bold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              {COMMON_ROLES.map((r) => (
                <option key={r} value={r} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {r}
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => loadQuestions(targetRole, true)}
            isLoading={isLoading}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
            className="cursor-pointer"
          >
            Regenerate Questions
          </Button>
        </div>
      </div>

      {/* Filter Tabs / Courses */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Filter by Course / Topic ({filteredQuestions.length} Questions)
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 pb-2">
          {categories.map((cat) => {
            const count = cat === 'All' ? questions.length : questions.filter((q) => q.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none scale-105'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected
                      ? 'bg-indigo-700 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Questions Grid */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 && !isLoading && (
          <Card className="p-8 text-center text-slate-400 space-y-3">
            <p className="text-sm font-semibold">No questions found for this topic.</p>
            <Button size="sm" variant="outline" onClick={() => loadQuestions(targetRole, true)}>
              Reset & Regenerate
            </Button>
          </Card>
        )}

        {filteredQuestions.map((q, idx) => (
          <Card key={q.id || idx} hover className="p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    q.category === 'Projects'
                      ? 'emerald'
                      : q.category === 'Behavioral'
                      ? 'amber'
                      : 'indigo'
                  }
                  size="sm"
                >
                  {q.category}
                </Badge>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Question #{idx + 1}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block text-[11px] text-slate-400 italic">
                  Why asked: {q.why_asked}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyQuestion(q.question)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Copy question text"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
              "{q.question}"
            </h3>

            {/* Key Talking Points */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" /> Key Talking Points to Hit:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {q.key_talking_points.map((pt, pidx) => (
                  <li key={pidx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-1.5">
                    <span className="text-indigo-500 font-bold">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Model Answer Outline */}
            <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 pt-1">
              <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-800 dark:text-slate-200">Exemplary Answer Strategy:</strong>{' '}
                {q.model_answer_outline}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
