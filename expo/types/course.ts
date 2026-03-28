export interface Lesson {
  id: string;
  title: string;
  content: string;
  image?: string;
  readTime?: string;
  keyTakeaways?: string[];
}

export interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  image: string;
  lessons: Lesson[];
  quiz?: Quiz;
  isPremium?: boolean;
}

export type SubscriptionPlan = 'free' | 'premium';

export interface SubscriptionInfo {
  plan: SubscriptionPlan;
  expiresAt?: string;
  features: {
    maxModules: number;
    certificateAccess: boolean;
    aiLearning: boolean;
    offlineAccess: boolean;
    prioritySupport: boolean;
  };
}

export interface UserProgress {
  completedLessons: Record<string, string[]>;
  quizScores: Record<string, number>;
  lastModuleId?: string;
  lastLessonId?: string;
}