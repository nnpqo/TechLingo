import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, TermProgress, Achievement } from '@/types/index';

interface UserStore {
  profile: UserProfile;
  termProgress: Record<string, TermProgress>;
  completedLessons: string[];
  achievements: Achievement[];
  
  // Profile actions
  setProfile: (profile: UserProfile) => void;
  updateXP: (xpGained: number) => void;
  updateStreak: (days: number) => void;
  
  // Term progress actions
  updateTermProgress: (termId: string, progress: Partial<TermProgress>) => void;
  markTermLearned: (termId: string, score?: number) => void;
  recordTermAttempt: (termId: string, correct: boolean) => void;
  
  // Lesson actions
  addCompletedLesson: (lessonId: string) => void;
  
  // Achievement actions
  addAchievement: (achievement: Achievement) => void;
  
  // Utility
  getCurrentLevel: () => number;
  getTotalLearned: () => number;
  getTotalWordsPracticed: () => number;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Learner',
  createdAt: new Date().toISOString(),
  currentLevel: 1,
  totalXP: 0,
  streak: 0,
  lastStudiedDate: new Date().toISOString(),
};

const LEVEL_CONFIG = [
  { number: 1, name: 'Novato', xpRequired: 0, badge: '🌱' },
  { number: 2, name: 'Junior', xpRequired: 1000, badge: '💻' },
  { number: 3, name: 'Mid', xpRequired: 2500, badge: '⚡' },
  { number: 4, name: 'Senior', xpRequired: 5000, badge: '🏆' },
  { number: 5, name: 'Lead', xpRequired: 10000, badge: '🚀' },
  { number: 6, name: 'Architect', xpRequired: 20000, badge: '🏗️' },
];

const calculateLevel = (xp: number, wordsPracticed: number): number => {
  // Level advancement based on BOTH XP AND words practiced
  // Each level requires either XP OR 1000 words practiced
  let level = 1;
  
  for (const config of LEVEL_CONFIG) {
    const wordsForLevel = (config.number - 1) * 1000; // Level 2 = 1000 words, Level 3 = 2000, etc.
    
    // Advance to this level if EITHER XP OR words practiced threshold is met
    if (xp >= config.xpRequired || wordsPracticed >= wordsForLevel) {
      level = config.number;
    } else {
      break;
    }
  }
  
  return level;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      profile: DEFAULT_PROFILE,
      termProgress: {},
      completedLessons: [],
      achievements: [],
      
      setProfile: (profile) => set({ profile }),
      
      updateXP: (xpGained) => {
        set((state) => {
          const newXP = state.profile.totalXP + xpGained;
          const totalWordsPracticed = Object.values(state.termProgress).reduce(
            (total, term) => total + (term.timesCorrect + term.timesWrong),
            0
          );
          const newLevel = calculateLevel(newXP, totalWordsPracticed);
          
          return {
            profile: {
              ...state.profile,
              totalXP: newXP,
              currentLevel: newLevel,
            },
          };
        });
      },
      
      updateStreak: (days) => {
        set((state) => ({
          profile: {
            ...state.profile,
            streak: days,
            lastStudiedDate: new Date().toISOString(),
          },
        }));
      },
      
      updateTermProgress: (termId, progress) => {
        set((state) => ({
          termProgress: {
            ...state.termProgress,
            [termId]: {
              ...state.termProgress[termId],
              ...progress,
            },
          },
        }));
      },
      
      markTermLearned: (termId, score) => {
        set((state) => {
          const current = state.termProgress[termId] || {
            termId,
            learned: false,
            timesCorrect: 0,
            timesWrong: 0,
            lastPracticed: new Date().toISOString(),
          };
          
          return {
            termProgress: {
              ...state.termProgress,
              [termId]: {
                ...current,
                learned: true,
                timesCorrect: current.timesCorrect + 1,
                lastPracticed: new Date().toISOString(),
                pronunciationScore: score,
              },
            },
          };
        });
      },
      
      recordTermAttempt: (termId, correct) => {
        set((state) => {
          const current = state.termProgress[termId] || {
            termId,
            learned: false,
            timesCorrect: 0,
            timesWrong: 0,
            lastPracticed: new Date().toISOString(),
          };
          
          const updatedTermProgress = {
            ...state.termProgress,
            [termId]: {
              ...current,
              timesCorrect: correct ? current.timesCorrect + 1 : current.timesCorrect,
              timesWrong: !correct ? current.timesWrong + 1 : current.timesWrong,
              lastPracticed: new Date().toISOString(),
            },
          };
          
          // Calculate total words practiced after this attempt
          const totalWordsPracticed = Object.values(updatedTermProgress).reduce(
            (total, term) => total + (term.timesCorrect + term.timesWrong),
            0
          );
          
          // Check if user advanced to next level by words practiced
          const newLevel = calculateLevel(state.profile.totalXP, totalWordsPracticed);
          
          return {
            termProgress: updatedTermProgress,
            profile: newLevel > state.profile.currentLevel ? {
              ...state.profile,
              currentLevel: newLevel,
            } : state.profile,
          };
        });
      },
      
      addCompletedLesson: (lessonId) => {
        set((state) => {
          if (!state.completedLessons.includes(lessonId)) {
            return {
              completedLessons: [...state.completedLessons, lessonId],
            };
          }
          return state;
        });
      },
      
      addAchievement: (achievement) => {
        set((state) => {
          const exists = state.achievements.some((a) => a.id === achievement.id);
          if (!exists) {
            return {
              achievements: [...state.achievements, achievement],
            };
          }
          return state;
        });
      },
      
      getCurrentLevel: () => get().profile.currentLevel,
      
      getTotalLearned: () => {
        return Object.values(get().termProgress).filter((p) => p.learned).length;
      },
      
      getTotalWordsPracticed: () => {
        return Object.values(get().termProgress).reduce(
          (total, term) => total + (term.timesCorrect + term.timesWrong),
          0
        );
      },
    }),
    {
      name: 'techlingo-user-store',
      version: 1,
    }
  )
);
