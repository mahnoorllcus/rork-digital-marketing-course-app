import { useState, useEffect, useMemo, useCallback } from "react";
import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { courseModules } from "@/data/courseContent";

export interface UserProgress {
  completedLessons: Record<string, string[]>;
  quizScores: Record<string, number>;
  lastModuleId?: string;
  lastLessonId?: string;
}

interface CourseContextType {
  modules: typeof courseModules;
  userProgress: UserProgress;
  isLoading: boolean;
  markLessonComplete: (moduleId: string, lessonId: string) => void;
  saveQuizScore: (moduleId: string, score: number) => void;
  isModuleUnlocked: (moduleId: string) => boolean;
  getModuleProgress: (moduleId: string) => number;
  calculateOverallProgress: () => number;
  resetProgress: () => void;
}

export const [CourseProvider, useCourse] = createContextHook<CourseContextType>(() => {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedLessons: {},
    quizScores: {},
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadProgress = useCallback(async () => {
    try {
      // Add small delay to prevent hydration timeout on web
      await new Promise(resolve => setTimeout(resolve, 100));
      const stored = await AsyncStorage.getItem("userProgress");
      if (stored) {
        setUserProgress(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading progress:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const saveProgress = useCallback(async (progress: UserProgress) => {
    if (!progress || typeof progress !== 'object') return;
    try {
      await AsyncStorage.setItem("userProgress", JSON.stringify(progress));
      setUserProgress(progress);
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  }, []);

  const markLessonComplete = useCallback((moduleId: string, lessonId: string) => {
    if (!moduleId?.trim() || !lessonId?.trim()) return;
    const updatedProgress = { ...userProgress };
    if (!updatedProgress.completedLessons[moduleId]) {
      updatedProgress.completedLessons[moduleId] = [];
    }
    if (!updatedProgress.completedLessons[moduleId].includes(lessonId)) {
      updatedProgress.completedLessons[moduleId].push(lessonId);
    }
    updatedProgress.lastModuleId = moduleId;
    updatedProgress.lastLessonId = lessonId;
    saveProgress(updatedProgress);
  }, [userProgress, saveProgress]);

  const saveQuizScore = useCallback((moduleId: string, score: number) => {
    if (!moduleId?.trim() || typeof score !== 'number') return;
    const updatedProgress = { ...userProgress };
    updatedProgress.quizScores[moduleId] = score;
    saveProgress(updatedProgress);
  }, [userProgress, saveProgress]);

  const isModuleUnlocked = useCallback((moduleId: string) => {
    if (!moduleId?.trim()) return false;
    const moduleIndex = courseModules.findIndex(m => m.id === moduleId);
    if (moduleIndex === 0) return true;
    
    const previousModule = courseModules[moduleIndex - 1];
    const previousModuleCompleted = userProgress.completedLessons[previousModule.id]?.length === previousModule.lessons.length;
    const previousQuizPassed = (userProgress.quizScores[previousModule.id] || 0) >= 70;
    
    return previousModuleCompleted && previousQuizPassed;
  }, [userProgress]);

  const getModuleProgress = useCallback((moduleId: string) => {
    if (!moduleId?.trim()) return 0;
    const module = courseModules.find(m => m.id === moduleId);
    if (!module) return 0;
    
    const completedCount = userProgress.completedLessons[moduleId]?.length || 0;
    return (completedCount / module.lessons.length) * 100;
  }, [userProgress]);

  const calculateOverallProgress = useCallback(() => {
    const totalLessons = courseModules.reduce((sum, module) => sum + module.lessons.length, 0);
    const completedLessons = Object.values(userProgress.completedLessons).flat().length;
    return (completedLessons / totalLessons) * 100;
  }, [userProgress]);

  const resetProgress = useCallback(() => {
    const emptyProgress: UserProgress = {
      completedLessons: {},
      quizScores: {},
    };
    saveProgress(emptyProgress);
  }, [saveProgress]);

  return useMemo(() => ({
    modules: courseModules,
    userProgress,
    isLoading,
    markLessonComplete,
    saveQuizScore,
    isModuleUnlocked,
    getModuleProgress,
    calculateOverallProgress,
    resetProgress,
  }), [userProgress, isLoading, markLessonComplete, saveQuizScore, isModuleUnlocked, getModuleProgress, calculateOverallProgress, resetProgress]);
});