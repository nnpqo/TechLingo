import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, TermProgress, Achievement } from '@/types/index';

interface UserStore {
  auth: {
    isAuthenticated: boolean;
    email?: string;
  };
  profile: UserProfile;
  termProgress: Record<string, TermProgress>;
  completedLessons: string[];
  achievements: Achievement[];
  
  // Auth actions (simulated)
  register: (params: { name?: string; email?: string; password?: string }) => void;
  login: (params: { email?: string; password?: string; name?: string }) => void;
  logout: () => void;

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

const DEFAULT_AUTH = {
  isAuthenticated: false,
  email: undefined as string | undefined,
};

const isSameLocalDay = (aIso: string, bIso: string) => {
  const a = new Date(aIso);
  const b = new Date(bIso);
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
};

const isYesterdayLocalDay = (previousIso: string, nowIso: string) => {
  const prev = new Date(previousIso);
  const now = new Date(nowIso);
  const prevMidnight = new Date(prev.getFullYear(), prev.getMonth(), prev.getDate()).getTime();
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const diffDays = Math.round((nowMidnight - prevMidnight) / (1000 * 60 * 60 * 24));
  return diffDays === 1;
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
      auth: DEFAULT_AUTH,
      profile: DEFAULT_PROFILE,
      termProgress: {},
      completedLessons: [],
      achievements: [],

      register: ({ name, email }) => {
        const safeName = (name || '').trim() || 'Learner';
        set((state) => ({
          auth: { isAuthenticated: true, email },
          profile: {
            ...state.profile,
            name: safeName,
            createdAt: state.profile.createdAt || new Date().toISOString(),
          },
        }));
      },

      login: ({ email, name }) => {
        const safeName = (name || '').trim();
        set((state) => ({
          auth: { isAuthenticated: true, email },
          profile: safeName
            ? {
                ...state.profile,
                name: safeName,
              }
            : state.profile,
        }));
      },

      logout: () => {
        set(() => ({
          auth: DEFAULT_AUTH,
        }));
      },
      
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
        set((state) => {
          const nowIso = new Date().toISOString();

          // If the user studied today already, do not change streak.
          if (state.profile.lastStudiedDate && isSameLocalDay(state.profile.lastStudiedDate, nowIso)) {
            return {
              profile: {
                ...state.profile,
                lastStudiedDate: nowIso,
              },
            };
          }

          // If they studied yesterday, increment streak; otherwise reset to 1.
          const nextStreak =
            state.profile.lastStudiedDate && isYesterdayLocalDay(state.profile.lastStudiedDate, nowIso)
              ? (state.profile.streak || 0) + 1
              : 1;

          // Preserve the passed param for backwards compatibility but prefer computed streak.
          const finalStreak = Math.max(nextStreak, days || 0);

          return {
            profile: {
              ...state.profile,
              streak: finalStreak,
              lastStudiedDate: nowIso,
            },
          };
        });
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
