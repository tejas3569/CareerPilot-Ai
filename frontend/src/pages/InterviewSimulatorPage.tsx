import React, { useState, useEffect } from 'react';
import {
  MessageSquareCode,
  Sparkles,
  Send,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Play,
  RotateCcw,
  Award,
  ChevronRight,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ScoreRing } from '../components/common/ScoreRing';
import { interviewApi } from '../api/endpoints';
import { InterviewSession, InterviewQuestion, InterviewAnswer } from '../types';
import { useAuth } from '../context/AuthContext';

interface InterviewSimulatorPageProps {
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const InterviewSimulatorPage: React.FC<InterviewSimulatorPageProps> = ({ onShowToast }) => {
  const { user } = useAuth();
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isStarting, setIsStarting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Setup form states
  const [role, setRole] = useState(user?.profile?.target_role || 'AI/ML Engineer');
  const [experienceLevel, setExperienceLevel] = useState('Entry-level / Intern');
  const [interviewType, setInterviewType] = useState('Technical');
  const [totalQuestions, setTotalQuestions] = useState(5);

  const startNewInterview = async () => {
    setIsStarting(true);
    try {
      const newSession = await interviewApi.startSession({
        role,
        experience_level: experienceLevel,
        interview_type: interviewType,
        total_questions: totalQuestions,
      });
      setSession(newSession);
      setCurrentQuestionIndex(0);
      setUserAnswer('');
      onShowToast('Mock interview room ready. Best of luck!', 'success');
    } catch {
      onShowToast('Failed to initialize interview session.', 'error');
    } finally {
      setIsStarting(false);
    }
  };

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim()) {
      onShowToast('Please type your response before submitting.', 'error');
      return;
    }

    if (!session) return;
    const currentQ = session.questions[currentQuestionIndex];
    if (!currentQ) return;

    setIsSubmitting(true);
    try {
      const evaluation = await interviewApi.submitAnswer(currentQ.id, userAnswer);
      
      // Update session locally with new answer
      const updatedQuestions = session.questions.map((q) =>
        q.id === currentQ.id ? { ...q, answer: evaluation } : q
      );

      const answeredQuestions = updatedQuestions.filter((q) => q.answer);
      const avg = answeredQuestions.reduce((acc, q) => acc + (q.answer?.overall_score || 0), 0) / answeredQuestions.length;

      const isFinished = answeredQuestions.length >= session.total_questions;

      setSession({
        ...session,
        completed_questions: answeredQuestions.length,
        average_score: Math.round(avg * 10) / 10,
        status: isFinished ? 'completed' : 'in_progress',
        questions: updatedQuestions,
      });

      if (isFinished) {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
        onShowToast('Mock interview session completed!', 'success');
      } else {
        onShowToast(`Question ${currentQuestionIndex + 1} scored ${evaluation.overall_score}/10`, 'info');
      }
    } catch {
      onShowToast('Failed to evaluate response.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQ: InterviewQuestion | undefined = session?.questions[currentQuestionIndex];
  const currentAnswer: InterviewAnswer | undefined = currentQ?.answer;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-normal">
          AI Interview Simulator
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Interactive real-time mock interview room with 5-axis objective rubric scoring, model answers, and smart follow-ups.
        </p>
      </div>

      {/* Setup View (when no session or restarting) */}
      {!session ? (
        <Card className="p-8 max-w-2xl mx-auto shadow-xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 flex items-center justify-center">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Configure Your Mock Interview</h2>
              <p className="text-xs text-slate-500">Personalized using your resume projects and target role skills.</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Target Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="AI/ML Engineer">AI/ML Engineer</option>
                <option value="Software Developer">Software Developer (SWE)</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="Frontend Developer">Frontend Developer</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Experience Level
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Entry-level / Intern">Entry-level / Intern</option>
                  <option value="Associate (1-2 yrs)">Associate (1-2 yrs)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Interview Category
                </label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Technical">Technical Questions</option>
                  <option value="Behavioral">Behavioral (STAR Method)</option>
                  <option value="HR">HR & Cultural Alignment</option>
                  <option value="Mixed">Mixed (Comprehensive Round)</option>
                </select>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={startNewInterview}
              isLoading={isStarting}
              className="w-full mt-4 text-base"
              leftIcon={<Play className="w-5 h-5 fill-current" />}
            >
              Start Live Interview Session
            </Button>
          </div>
        </Card>
      ) : (
        /* Active Interview Arena */
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Top Progress Bar & Controls */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3">
              <Badge variant="indigo" size="md">
                {session.role} ({session.interview_type})
              </Badge>
              <span className="text-xs font-bold text-slate-500">
                Question {currentQuestionIndex + 1} of {session.total_questions}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {session.average_score > 0 && (
                <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950">
                  Avg: {session.average_score}/10
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSession(null)}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Reset Session
              </Button>
            </div>
          </div>

          {/* Question Stepper Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {session.questions.map((q, idx) => {
              const isAnswered = Boolean(q.answer);
              const isCurrent = idx === currentQuestionIndex;

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentQuestionIndex(idx);
                    setUserAnswer(q.answer?.user_answer || '');
                  }}
                  className={`flex-1 min-w-[70px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none'
                      : isAnswered
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  <span>Q{idx + 1}</span>
                  {isAnswered && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>

          {/* Current Question Display */}
          {currentQ && (
            <Card className="p-6 space-y-6 shadow-md border-indigo-100 dark:border-indigo-950">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="indigo" size="sm">{currentQ.category}</Badge>
                  <span className="text-xs text-slate-400">Order: #{currentQ.question_order}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-relaxed">
                  "{currentQ.question_text}"
                </h3>
                {currentQ.context_note && (
                  <p className="text-xs text-slate-500 italic">
                    Note: {currentQ.context_note}
                  </p>
                )}
              </div>

              {/* Answer Form (if not yet answered) */}
              {!currentAnswer ? (
                <form onSubmit={handleAnswerSubmit} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Your Response
                    </label>
                    <textarea
                      rows={5}
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type your response clearly with technical details, trade-offs, and examples..."
                      className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                      required
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      isLoading={isSubmitting}
                      rightIcon={<Send className="w-4 h-4" />}
                    >
                      Submit Response for Evaluation
                    </Button>
                  </div>
                </form>
              ) : (
                /* Evaluated Answer Card */
                <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  {/* Candidate's Submitted Response */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">Your Submitted Answer:</p>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                      {currentAnswer.user_answer}
                    </p>
                  </div>

                  {/* 5-Axis Evaluation Score Breakdown */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        5-Axis Performance Rubric
                      </h4>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-sm font-black">
                        <span>Overall:</span>
                        <span>{currentAnswer.overall_score} / 10.0</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center border border-slate-200/60 dark:border-slate-800">
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Tech Accuracy</p>
                        <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                          {currentAnswer.technical_accuracy}/10
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center border border-slate-200/60 dark:border-slate-800">
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Relevance</p>
                        <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                          {currentAnswer.relevance}/10
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center border border-slate-200/60 dark:border-slate-800">
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Clarity</p>
                        <p className="text-lg font-black text-purple-600 dark:text-purple-400 mt-0.5">
                          {currentAnswer.clarity}/10
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center border border-slate-200/60 dark:border-slate-800">
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Communication</p>
                        <p className="text-lg font-black text-blue-600 dark:text-blue-400 mt-0.5">
                          {currentAnswer.communication}/10
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center border border-slate-200/60 dark:border-slate-800">
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Completeness</p>
                        <p className="text-lg font-black text-amber-600 dark:text-amber-400 mt-0.5">
                          {currentAnswer.completeness}/10
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Feedback Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/60 space-y-2">
                      <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> What was good:
                      </p>
                      <ul className="space-y-1.5">
                        {currentAnswer.what_was_good.map((item, idx) => (
                          <li key={idx} className="text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-1.5">
                            <span>•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/60 space-y-2">
                      <p className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" /> What could improve:
                      </p>
                      <ul className="space-y-1.5">
                        {currentAnswer.what_could_improve.map((item, idx) => (
                          <li key={idx} className="text-xs text-rose-900 dark:text-rose-200 flex items-start gap-1.5">
                            <span>•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Exemplary Model Answer */}
                  <div className="p-4 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/60 space-y-1.5">
                    <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Exemplary Model Response:
                    </p>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                      {currentAnswer.better_answer_example}
                    </p>
                  </div>

                  {/* Intelligent Follow-up Question */}
                  {currentAnswer.follow_up_question && (
                    <div className="p-4 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/60 space-y-1.5">
                      <p className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-500" /> Follow-Up Interview Question:
                      </p>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                        "{currentAnswer.follow_up_question}"
                      </p>
                    </div>
                  )}

                  {/* Next Question Navigation */}
                  <div className="flex justify-end pt-2">
                    {currentQuestionIndex < session.total_questions - 1 ? (
                      <Button
                        variant="primary"
                        size="md"
                        onClick={() => {
                          const nextIdx = currentQuestionIndex + 1;
                          setCurrentQuestionIndex(nextIdx);
                          setUserAnswer(session.questions[nextIdx]?.answer?.user_answer || '');
                        }}
                        rightIcon={<ChevronRight className="w-4 h-4" />}
                      >
                        Proceed to Question {currentQuestionIndex + 2}
                      </Button>
                    ) : (
                      <Badge variant="emerald" size="md">
                        All Questions Completed! 🎉
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Session Complete Summary Card */}
          {session.status === 'completed' && (
            <Card className="p-6 bg-gradient-to-tr from-emerald-500/10 to-indigo-500/10 border-emerald-300 dark:border-emerald-800 space-y-3">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-base">
                <Award className="w-6 h-6" /> Mock Interview Complete!
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {session.summary_feedback}
              </p>
              <div className="pt-2 flex gap-3">
                <Button size="sm" variant="primary" onClick={() => setSession(null)}>
                  Start Another Round
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
