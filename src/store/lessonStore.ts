import { create } from 'zustand';
import { TechArea } from '@/types/index';

interface LessonState {
  currentAreaId: TechArea | null;
  currentLessonNumber: number;
  currentExerciseIndex: number;
  lives: number;
  xpEarnedInLesson: number;
  exercisesCompleted: number;
  totalExercises: number;
  
  setCurrentArea: (areaId: TechArea | null) => void;
  setCurrentLesson: (lessonNumber: number) => void;
  setCurrentExerciseIndex: (index: number) => void;
  setLives: (lives: number) => void;
  decreaseLives: () => void;
  addXP: (xp: number) => void;
  nextExercise: () => void;
  setTotalExercises: (total: number) => void;
  resetLesson: () => void;
  isLessonComplete: () => boolean;
}

export const useLessonStore = create<LessonState>((set, get) => ({
  currentAreaId: null,
  currentLessonNumber: 1,
  currentExerciseIndex: 0,
  lives: 3,
  xpEarnedInLesson: 0,
  exercisesCompleted: 0,
  totalExercises: 0,
  
  setCurrentArea: (areaId) => set({ currentAreaId: areaId }),
  setCurrentLesson: (lessonNumber) => set({ currentLessonNumber: lessonNumber }),
  setCurrentExerciseIndex: (index) => set({ currentExerciseIndex: index }),
  setLives: (lives) => set({ lives: Math.max(0, lives) }),
  
  decreaseLives: () => {
    const current = get().lives;
    set({ lives: Math.max(0, current - 1) });
  },
  
  addXP: (xp) => {
    set((state) => ({
      xpEarnedInLesson: state.xpEarnedInLesson + xp,
    }));
  },
  
  nextExercise: () => {
    set((state) => ({
      currentExerciseIndex: state.currentExerciseIndex + 1,
      exercisesCompleted: state.exercisesCompleted + 1,
    }));
  },
  
  setTotalExercises: (total) => set({ totalExercises: total }),
  
  resetLesson: () => {
    set({
      currentAreaId: null,
      currentLessonNumber: 1,
      currentExerciseIndex: 0,
      lives: 3,
      xpEarnedInLesson: 0,
      exercisesCompleted: 0,
      totalExercises: 0,
    });
  },
  
  isLessonComplete: () => {
    const { currentExerciseIndex, totalExercises } = get();
    return currentExerciseIndex >= totalExercises;
  },
}));
