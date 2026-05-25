import { useUserStore } from '@/store/userStore';
import { useLessonStore } from '@/store/lessonStore';
import { Term, ExerciseResult } from '@/types/index';

interface LevelInfo {
  number: number;
  name: string;
  badge: string;
  xpRequired: number;
  xpToNext: number;
  progressPercent: number;
}

export const useProgress = () => {
  const profile = useUserStore((state) => state.profile);
  const termProgress = useUserStore((state) => state.termProgress);
  const getTotalLearnedFn = useUserStore((state) => state.getTotalLearned);
  const getTotalWordsPracticedFn = useUserStore((state) => state.getTotalWordsPracticed);
  const completedLessons = useUserStore((state) => state.completedLessons);

  const LEVEL_CONFIG = [
    { number: 1, name: 'Novato', xpRequired: 0, badge: '🌱' },
    { number: 2, name: 'Junior', xpRequired: 1000, badge: '💻' },
    { number: 3, name: 'Mid', xpRequired: 2500, badge: '⚡' },
    { number: 4, name: 'Senior', xpRequired: 5000, badge: '🏆' },
    { number: 5, name: 'Lead', xpRequired: 10000, badge: '🚀' },
    { number: 6, name: 'Architect', xpRequired: 20000, badge: '🏗️' },
  ];

  const getLevelInfo = (): LevelInfo => {
    const currentLevelConfig = LEVEL_CONFIG.find(
      (l) => l.number === profile.currentLevel
    );
    const nextLevelConfig = LEVEL_CONFIG.find(
      (l) => l.number === profile.currentLevel + 1
    );

    const currentXpRequired = currentLevelConfig?.xpRequired || 0;
    const nextXpRequired = nextLevelConfig?.xpRequired || LEVEL_CONFIG[5].xpRequired;

    const xpToNext = nextXpRequired - profile.totalXP;
    const xpInCurrentLevel = profile.totalXP - currentXpRequired;
    const xpNeededForLevel = nextXpRequired - currentXpRequired;
    const progressPercent = Math.round((xpInCurrentLevel / xpNeededForLevel) * 100);

    return {
      number: profile.currentLevel,
      name: currentLevelConfig?.name || 'Unknown',
      badge: currentLevelConfig?.badge || '',
      xpRequired: currentXpRequired,
      xpToNext: Math.max(0, xpToNext),
      progressPercent: Math.max(0, Math.min(100, progressPercent)),
    };
  };

  const getTermStats = (term: Term) => {
    const progress = termProgress[term.id];
    if (!progress) {
      return { timesCorrect: 0, timesWrong: 0, totalAttempts: 0, learned: false };
    }
    return {
      timesCorrect: progress.timesCorrect,
      timesWrong: progress.timesWrong,
      totalAttempts: progress.timesCorrect + progress.timesWrong,
      learned: progress.learned,
    };
  };

  const getAreaProgress = (areaTerms: Term[]) => {
    const learned = areaTerms.filter((t) => termProgress[t.id]?.learned).length;
    return {
      learned,
      total: areaTerms.length,
      percentage: Math.round((learned / areaTerms.length) * 100),
    };
  };

  return {
    profile,
    termProgress,
    getLevelInfo,
    getTermStats,
    getAreaProgress,
    getTotalLearned: getTotalLearnedFn(),
    getTotalWordsPracticed: getTotalWordsPracticedFn(),
    totalLessonsCompleted: completedLessons.length,
    totalXP: profile.totalXP,
    streak: profile.streak,
  };
};

export const useExercise = () => {
  const updateXP = useUserStore((state) => state.updateXP);
  const updateTermProgress = useUserStore((state) => state.updateTermProgress);
  const recordTermAttempt = useUserStore((state) => state.recordTermAttempt);
  const addXP = useLessonStore((state) => state.addXP);
  const nextExercise = useLessonStore((state) => state.nextExercise);

  const processExerciseResult = (termId: string, result: ExerciseResult) => {
    // Update term progress
    recordTermAttempt(termId, result.isCorrect);

    // Update XP
    if (result.isCorrect) {
      updateXP(result.xpEarned);
      addXP(result.xpEarned);

      // Bonus XP for perfect score or pronunciation
      if (result.score === 100) {
        updateXP(5);
        addXP(5);
      }
    }

    // Move to next exercise
    nextExercise();

    return result;
  };

  return {
    processExerciseResult,
  };
};

export const useLevel = () => {
  const LEVEL_CONFIG = [
    { number: 1, name: 'Novato', xpRequired: 0, badge: '🌱', unlockedAreas: [] },
    { number: 2, name: 'Junior', xpRequired: 300, badge: '💻', unlockedAreas: [] },
    { number: 3, name: 'Mid', xpRequired: 800, badge: '⚡', unlockedAreas: [] },
    { number: 4, name: 'Senior', xpRequired: 1800, badge: '🏆', unlockedAreas: [] },
    { number: 5, name: 'Lead', xpRequired: 3500, badge: '🚀', unlockedAreas: [] },
    { number: 6, name: 'Architect', xpRequired: 6000, badge: '🏗️', unlockedAreas: [] },
  ];

  const getLevelByXP = (xp: number) => {
    let level = LEVEL_CONFIG[0];
    for (const config of LEVEL_CONFIG) {
      if (xp >= config.xpRequired) {
        level = config;
      } else {
        break;
      }
    }
    return level;
  };

  const getNextLevel = (currentLevel: number) => {
    return LEVEL_CONFIG.find((l) => l.number === currentLevel + 1);
  };

  return {
    LEVEL_CONFIG,
    getLevelByXP,
    getNextLevel,
  };
};
