import { apiClient } from './client';
import {
  AuthResponse,
  User,
  Profile,
  Resume,
  ResumeUploadResponse,
  JobMatch,
  SampleJob,
  SkillGap,
  UserSkill,
  LearningRoadmap,
  RoadmapItem,
  InterviewSession,
  InterviewAnswer,
  QuestionBankItem,
  DashboardStats
} from '../types';

export const authApi = {
  register: (data: { email: string; password: string; name?: string; target_role?: string }) =>
    apiClient.post<AuthResponse>('/auth/register', data).then((res) => res.data),
  login: (data: { email: string; password: string }) =>
    apiClient.post<AuthResponse>('/auth/login', data).then((res) => res.data),
  demoLogin: () =>
    apiClient.post<AuthResponse>('/auth/demo-login').then((res) => res.data),
  forgotPassword: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }).then((res) => res.data),
  getMe: () =>
    apiClient.get<User>('/auth/me').then((res) => res.data),
};

export const profileApi = {
  getProfile: () =>
    apiClient.get<Profile>('/profile').then((res) => res.data),
  updateProfile: (data: Partial<Profile>) =>
    apiClient.put<Profile>('/profile', data).then((res) => res.data),
};

export const resumeApi = {
  uploadResume: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<ResumeUploadResponse>('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((res) => res.data);
  },
  loadSampleResume: () =>
    apiClient.post<ResumeUploadResponse>('/resume/sample').then((res) => res.data),
  getLatestResume: () =>
    apiClient.get<Resume>('/resume/latest').then((res) => res.data),
  getResumeHistory: () =>
    apiClient.get<Resume[]>('/resume/history').then((res) => res.data),
  getResumeById: (id: number) =>
    apiClient.get<Resume>(`/resume/${id}`).then((res) => res.data),
};

export const jobsApi = {
  getSampleJobs: () =>
    apiClient.get<SampleJob[]>('/jobs/samples').then((res) => res.data),
  analyzeJobMatch: (data: { job_description: string; job_title?: string; company_name?: string; resume_id?: number }) =>
    apiClient.post<JobMatch>('/jobs/analyze', data).then((res) => res.data),
  getJobHistory: () =>
    apiClient.get<JobMatch[]>('/jobs/history').then((res) => res.data),
  getJobMatchById: (id: number) =>
    apiClient.get<JobMatch>(`/jobs/${id}`).then((res) => res.data),
};

export const skillsApi = {
  getTaxonomy: () =>
    apiClient.get<{ categories: Record<string, string[]>; available_roles: string[] }>('/skills/taxonomy').then((res) => res.data),
  getUserSkills: () =>
    apiClient.get<UserSkill[]>('/skills').then((res) => res.data),
  addSkill: (skill_name: string, category: string = 'Technical') =>
    apiClient.post<UserSkill>('/skills', { skill_name, category }).then((res) => res.data),
  deleteSkill: (id: number) =>
    apiClient.delete(`/skills/${id}`).then((res) => res.data),
  analyzeSkillGap: (target_role: string) =>
    apiClient.post<SkillGap>('/skills/analyze', { target_role }).then((res) => res.data),
};

export const roadmapApi = {
  generateRoadmap: (target_role: string) =>
    apiClient.post<LearningRoadmap>('/roadmap/generate', { target_role }).then((res) => res.data),
  getLatestRoadmap: () =>
    apiClient.get<LearningRoadmap>('/roadmap/latest').then((res) => res.data),
  getRoadmapHistory: () =>
    apiClient.get<LearningRoadmap[]>('/roadmap/history').then((res) => res.data),
  updateItemStatus: (itemId: number, status: 'not_started' | 'in_progress' | 'completed') =>
    apiClient.patch<RoadmapItem>(`/roadmap/items/${itemId}`, { status }).then((res) => res.data),
};

export const interviewApi = {
  startSession: (data: { role: string; experience_level: string; interview_type: string; total_questions?: number }) =>
    apiClient.post<InterviewSession>('/interview/start', data).then((res) => res.data),
  submitAnswer: (questionId: number, user_answer: string) =>
    apiClient.post<InterviewAnswer>(`/interview/answer/${questionId}`, { user_answer }).then((res) => res.data),
  getSession: (sessionId: number) =>
    apiClient.get<InterviewSession>(`/interview/${sessionId}`).then((res) => res.data),
  getHistory: () =>
    apiClient.get<InterviewSession[]>('/interview/history').then((res) => res.data),
  generateQuestionBank: (params?: { target_role?: string; category?: string; force_refresh?: boolean } | string) => {
    const payload = typeof params === 'string'
      ? { target_role: params }
      : (params || {});
    return apiClient.post<{ target_role: string; questions: QuestionBankItem[] }>('/interview/questions/generate', payload).then((res) => res.data);
  },
};

export const dashboardApi = {
  getStats: () =>
    apiClient.get<DashboardStats>('/dashboard').then((res) => res.data),
};

export const chatApi = {
  sendMessage: (message: string, history: Array<{ role: string; content: string }> = [], target_role?: string) =>
    apiClient.post<{ reply: string; suggested_followups: string[] }>('/chat/message', {
      message,
      history,
      target_role,
    }).then((res) => res.data),
};
