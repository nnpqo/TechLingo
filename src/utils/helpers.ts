// Utility function for calculating Levenshtein distance
export const calculateLevenshteinDistance = (a: string, b: string): number => {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
};

// Calculate pronunciation similarity (0-100)
export const calculatePronunciationScore = (spoken: string, expected: string): number => {
  const spokenLower = spoken.toLowerCase().trim();
  const expectedLower = expected.toLowerCase().trim();

  if (!expectedLower) return 0;
  if (spokenLower === expectedLower) return 100;

  const distance = calculateLevenshteinDistance(spokenLower, expectedLower);
  const maxLength = Math.max(spokenLower.length, expectedLower.length);

  const similarity = ((maxLength - distance) / maxLength) * 100;
  return Math.max(0, Math.min(100, Math.round(similarity)));
};

// XP calculation based on exercise difficulty and performance
export const calculateXPReward = (
  correct: boolean,
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  perfectScore: boolean = false
): number => {
  let baseXP = 10;

  if (difficulty === 'intermediate') baseXP = 15;
  if (difficulty === 'advanced') baseXP = 20;

  if (!correct) return 0;
  if (perfectScore) return baseXP + 5;

  return baseXP;
};

// Streak calculation
export const calculateStreak = (lastStudiedDate: string): number => {
  const lastDate = new Date(lastStudiedDate);
  const today = new Date();

  // Normalize dates to compare just the day part
  const lastDay = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
  const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const daysDiff = Math.floor((todayDay.getTime() - lastDay.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff === 0) return 1; // Same day
  if (daysDiff === 1) return 2; // Next day (maintain streak)
  return 1; // Streak broken
};

// Format time for display
export const formatStudyTime = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
};
