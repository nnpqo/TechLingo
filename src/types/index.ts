export type TechArea = 'cybersecurity' | 'frontend' | 'backend' | 'database' | 'devops' | 'networking';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Term {
  id: string;
  english: string;
  spanish: string;
  phonetic: string;           // IPA notation: /ˈfaɪərwɔːl/
  pronunciation_guide: string; // Spanish guide: "fáier-uol"
  definition_en: string;
  definition_es: string;
  area: TechArea;
  level: DifficultyLevel;
  codeExample?: string;       // Real code snippet where the term is used
  contextSentence: string;    // Real context sentence in English
  tags: string[];
  relatedTerms: string[];     // Term IDs of related terms
}

export type ExerciseType = 
  | 'multiple_choice'         // Choose the correct translation
  | 'fill_in_blank'           // Complete the code with the term
  | 'pronunciation_practice'  // Pronounce and STT evaluates
  | 'matching'                // Match term with definition
  | 'code_context'            // Read snippet and answer questions
  | 'listen_and_type'         // Listen to TTS and type the term
  | 'true_false';             // True/false about definition

export interface Exercise {
  id: string;
  type: ExerciseType;
  termId: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;        // Why it's the correct answer
  xpReward: number;
  hints: string[];
}

export interface ExerciseResult {
  isCorrect: boolean;
  score: number;              // 0-100
  xpEarned: number;
  feedback: string;           // Specific explanation
  hint?: string;              // If incorrect
  correctAnswer: string;
}

export interface Level {
  number: number;
  name: string;               // "Novato", "Junior", etc.
  xpRequired: number;
  badge: string;              // emoji or SVG
  unlockedAreas: TechArea[];
}

export interface TermProgress {
  termId: string;
  learned: boolean;
  timesCorrect: number;
  timesWrong: number;
  lastPracticed: string;      // ISO date string
  pronunciationScore?: number; // 0-100
}

export interface UserProfile {
  name: string;
  createdAt: string;          // ISO date string
  currentLevel: number;
  totalXP: number;
  streak: number;
  lastStudiedDate: string;    // ISO date string
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;         // ISO date string
}

export interface Lesson {
  id: string;
  areaId: TechArea;
  number: number;
  name: string;
  description: string;
  exercises: Exercise[];
  minLevel: DifficultyLevel;
}
