export interface Profile {
  id?: number;
  user_id?: number;
  name: string;
  college: string;
  degree: string;
  graduation_year: string;
  target_role: string;
  bio: string;
  github: string;
  linkedin: string;
  portfolio: string;
}

export interface User {
  id: number;
  email: string;
  is_active: boolean;
  is_demo: boolean;
  profile?: Profile;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user_id: number;
  email: string;
  is_demo: boolean;
}

export interface AtsMetrics {
  word_count: number;
  action_verbs_count: number;
  unique_action_verbs: string[];
  metrics_count: number;
  quantifiable_examples: string[];
  has_email: boolean;
  has_phone: boolean;
  has_github: boolean;
  has_linkedin: boolean;
  detected_sections: string[];
  missing_sections: string[];
  readability_score: number;
}

export interface ResumeAnalysis {
  id: number;
  resume_id: number;
  score: number;
  strengths: string[];
  weaknesses: string[];
  missing_sections: string[];
  detected_skills: string[];
  suggestions: string[];
  ats_metrics: AtsMetrics;
  project_suggestions: string[];
  parsed_sections: {
    name?: string;
    education?: string;
    experience?: string;
    projects?: Array<{
      id?: number;
      title: string;
      description: string;
      technologies?: string[];
    }>;
    skills?: string[];
    certifications?: string;
    achievements?: string;
  };
  created_at: string;
}

export interface Resume {
  id: number;
  filename: string;
  created_at: string;
  analysis?: ResumeAnalysis;
}

export interface ResumeUploadResponse {
  message: string;
  resume_id: number;
  filename: string;
  analysis: ResumeAnalysis;
}

export interface JobMatch {
  id: number;
  job_title: string;
  company_name: string;
  overall_match_score: number;
  semantic_score: number;
  keyword_score: number;
  matching_skills: string[];
  missing_skills: string[];
  recommended_skills: string[];
  relevant_projects: Array<{
    title: string;
    matched_skills: string[];
    relevance_note: string;
  }>;
  recommendations: string[];
  created_at: string;
}

export interface SampleJob {
  id: string;
  title: string;
  company: string;
  description: string;
}

export interface SkillGap {
  id?: number;
  target_role: string;
  current_skills: string[];
  missing_skills: string[];
  role_required_skills: string[];
  readiness_percentage: number;
}

export interface UserSkill {
  id: number;
  skill_name: string;
  category: string;
  source: string;
  created_at: string;
}

export interface RoadmapItem {
  id: number;
  roadmap_id: number;
  phase_number: number;
  phase_name: string;
  skill_name: string;
  priority: 'High' | 'Medium' | 'Low';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimated_hours: number;
  prerequisites: string[];
  project_idea: string;
  status: 'not_started' | 'in_progress' | 'completed';
  order_index: number;
}

export interface LearningRoadmap {
  id: number;
  target_role: string;
  title: string;
  description: string;
  progress_percentage: number;
  items: RoadmapItem[];
  created_at: string;
  updated_at: string;
}

export interface InterviewAnswer {
  id: number;
  question_id: number;
  user_answer: string;
  technical_accuracy: number;
  relevance: number;
  clarity: number;
  communication: number;
  completeness: number;
  overall_score: number;
  what_was_good: string[];
  what_could_improve: string[];
  better_answer_example: string;
  follow_up_question: string;
  submitted_at: string;
}

export interface InterviewQuestion {
  id: number;
  session_id: number;
  question_text: string;
  category: string;
  question_order: number;
  context_note: string;
  answer?: InterviewAnswer;
}

export interface InterviewSession {
  id: number;
  role: string;
  experience_level: string;
  interview_type: string;
  status: 'in_progress' | 'completed';
  total_questions: number;
  completed_questions: number;
  average_score: number;
  summary_feedback: string;
  questions: InterviewQuestion[];
  created_at: string;
}

export interface QuestionBankItem {
  id: number;
  question: string;
  category: string;
  why_asked: string;
  key_talking_points: string[];
  model_answer_outline: string;
}

export interface DashboardStats {
  profile_completion: number;
  resume_score: number | null;
  latest_job_match_score: number | null;
  skills_detected_count: number;
  missing_skills_count: number;
  interview_readiness_score: number | null;
  current_streak_days: number;
  recent_analyses: Array<{
    id: number;
    type: string;
    title: string;
    score: number | null;
    date: string;
  }>;
  recommended_actions: Array<{
    id: string;
    title: string;
    description: string;
    action_text: string;
    route: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
