import React from 'react';
import { motion } from 'framer-motion';
import { useProgress } from '@/hooks/useProgress';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import Badge from '@/components/ui/Badge';
import { Lock, Unlock, CheckCircle } from 'lucide-react';

const LearningPath: React.FC = () => {
  const { profile, getLevelInfo, getTotalWordsPracticed } = useProgress();
  const levelInfo = getLevelInfo();
  const totalWordsPracticed = getTotalWordsPracticed;

  const learningModules = [
    {
      level: 1,
      name: 'Novato',
      xpRequired: 0,
      wordsRequired: 0,
      xpToNext: 1000,
      wordsToNext: 1000,
      badge: '🌱',
      description: 'Start your technical English journey',
      areas: ['cybersecurity', 'frontend', 'backend'],
      difficulty: 'Beginner',
    },
    {
      level: 2,
      name: 'Junior',
      xpRequired: 1000,
      wordsRequired: 1000,
      xpToNext: 1500,
      wordsToNext: 1000,
      badge: '💻',
      description: 'Intermediate concepts and techniques',
      areas: ['cybersecurity', 'frontend', 'backend', 'database'],
      difficulty: 'Intermediate',
    },
    {
      level: 3,
      name: 'Mid',
      xpRequired: 2500,
      wordsRequired: 2000,
      xpToNext: 2500,
      wordsToNext: 1000,
      badge: '⚡',
      description: 'Advanced professional vocabulary',
      areas: ['cybersecurity', 'frontend', 'backend', 'database', 'devops'],
      difficulty: 'Intermediate+',
    },
    {
      level: 4,
      name: 'Senior',
      xpRequired: 5000,
      wordsRequired: 3000,
      xpToNext: 5000,
      wordsToNext: 1000,
      badge: '🏆',
      description: 'Expert-level technical terms',
      areas: ['cybersecurity', 'frontend', 'backend', 'database', 'devops', 'networking'],
      difficulty: 'Advanced',
    },
    {
      level: 5,
      name: 'Lead',
      xpRequired: 10000,
      wordsRequired: 4000,
      xpToNext: 10000,
      wordsToNext: 1000,
      badge: '🚀',
      description: 'Leadership and architecture vocabulary',
      areas: ['all'],
      difficulty: 'Advanced+',
    },
    {
      level: 6,
      name: 'Architect',
      xpRequired: 20000,
      wordsRequired: 5000,
      xpToNext: Infinity,
      wordsToNext: Infinity,
      badge: '🏗️',
      description: 'Master of technical English',
      areas: ['all'],
      difficulty: 'Expert',
    },
  ];

  const isLevelUnlocked = (requiredXP: number, wordsRequired: number): boolean => {
    return profile.totalXP >= requiredXP || totalWordsPracticed >= wordsRequired;
  };

  const getProgressToLevel = (xpRequired: number, wordsRequired: number): number => {
    const xpUnlocked = profile.totalXP >= xpRequired;
    const wordsUnlocked = totalWordsPracticed >= wordsRequired;
    
    if (xpUnlocked || wordsUnlocked) {
      return 100;
    }
    
    // Show progress toward whichever is closer
    const xpProgress = Math.min(100, (profile.totalXP / xpRequired) * 100);
    const wordsProgress = Math.min(100, (totalWordsPracticed / wordsRequired) * 100);
    
    return Math.max(xpProgress, wordsProgress);
  };

  return (
    <div className="min-h-screen bg-bg-dark pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-text-primary mb-4">Your Learning Path</h1>
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            <div className="bg-bg-card rounded-lg p-4">
              <p className="text-sm text-text-secondary mb-1">Current Level</p>
              <div className="flex items-center gap-2">
                <span className="text-3xl">{levelInfo.badge}</span>
                <div>
                  <p className="font-bold text-lg">{levelInfo.name}</p>
                  <p className="text-xs text-text-secondary">Level {profile.currentLevel}</p>
                </div>
              </div>
            </div>
            <div className="bg-bg-card rounded-lg p-4">
              <p className="text-sm text-text-secondary mb-1">Total XP</p>
              <p className="text-3xl font-bold text-secondary">{profile.totalXP}</p>
            </div>
            <div className="bg-bg-card rounded-lg p-4">
              <p className="text-sm text-text-secondary mb-1">Words Practiced</p>
              <p className="text-3xl font-bold text-accent">{totalWordsPracticed}</p>
              <p className="text-xs text-text-secondary">/{(profile.currentLevel) * 1000} for next</p>
            </div>
          </div>
        </motion.div>

        {/* Learning Modules */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          <h2 className="text-2xl font-bold text-text-primary mb-6">Progression Roadmap</h2>
          <div className="space-y-4">
            {learningModules.map((module, index) => {
              const isUnlocked = isLevelUnlocked(module.xpRequired, module.wordsRequired);
              const isCurrent = profile.currentLevel === module.level;
              const progress = getProgressToLevel(module.xpRequired, module.wordsRequired);

              return (
                <motion.div
                  key={module.level}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`${
                      isCurrent
                        ? 'border-primary-500 bg-primary-500 bg-opacity-5'
                        : isUnlocked
                        ? 'border-secondary border-opacity-50'
                        : 'opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{module.badge}</div>
                        <div>
                          <h3 className="text-xl font-bold flex items-center gap-2">
                            Level {module.level}: {module.name}
                            {isCurrent && (
                              <Badge label="Current" variant="primary" size="sm" />
                            )}
                            {isUnlocked && !isCurrent && (
                              <CheckCircle className="w-5 h-5 text-secondary" />
                            )}
                            {!isUnlocked && (
                              <Lock className="w-5 h-5 text-text-secondary" />
                            )}
                          </h3>
                          <p className="text-sm text-text-secondary mb-2">
                            {module.description}
                          </p>
                          <p className="text-xs text-text-secondary">
                            Difficulty: {module.difficulty}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">
                          {module.xpRequired.toLocaleString()} XP
                        </p>
                        <p className="text-xs text-accent">
                          {module.wordsRequired.toLocaleString()} words
                        </p>
                        {isCurrent && module.xpToNext !== Infinity && (
                          <>
                            <p className="text-xs text-secondary">
                              {Math.max(0, module.xpToNext - profile.totalXP).toLocaleString()} XP left
                            </p>
                            <p className="text-xs text-accent">
                              {Math.max(0, module.wordsToNext - totalWordsPracticed).toLocaleString()} words left
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar for Current Level */}
                    {isCurrent && (
                      <div className="mb-4">
                        <ProgressBar
                          current={profile.totalXP - module.xpRequired}
                          max={module.xpToNext - module.xpRequired}
                          color="bg-primary-500"
                          showLabel={true}
                        />
                      </div>
                    )}

                    {/* Available Areas */}
                    <div className="flex flex-wrap gap-2">
                      {module.areas[0] === 'all' ? (
                        <span className="text-xs bg-primary-500 bg-opacity-20 text-primary-500 px-2 py-1 rounded">
                          All Areas Unlocked
                        </span>
                      ) : (
                        module.areas.map((area) => (
                          <span
                            key={area}
                            className="text-xs bg-bg-elevated text-text-secondary px-2 py-1 rounded capitalize"
                          >
                            {area}
                          </span>
                        ))
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Estimated Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-bg-card border border-border-color rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold text-text-primary mb-4">📊 Learning Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-text-secondary">Avg. XP per Lesson</p>
              <p className="text-2xl font-bold text-secondary">~15 XP</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Lessons to Level 2</p>
              <p className="text-2xl font-bold text-primary-500">~67</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Est. Total Hours (Lvl 6)</p>
              <p className="text-2xl font-bold text-accent">~40 hours</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Topics Covered</p>
              <p className="text-2xl font-bold text-secondary">90+</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LearningPath;
