import React from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import { useProgress } from '@/hooks/useProgress';
import { cybersecurityTerms, frontendTerms, backendTerms, databaseTerms, devopsTerms, networkingTerms } from '@/data/terms';

const Progress: React.FC = () => {
  const { profile, getTotalLearned: totalLearned, getLevelInfo, getAreaProgress } = useProgress();
  const levelInfo = getLevelInfo();

  const termsByArea = {
    cybersecurity: cybersecurityTerms,
    frontend: frontendTerms,
    backend: backendTerms,
    database: databaseTerms,
    devops: devopsTerms,
    networking: networkingTerms,
  };

  const areas = [
    { id: 'cybersecurity' as const, name: '🔐 Cybersecurity', color: 'cyber' },
    { id: 'frontend' as const, name: '🌐 Frontend', color: 'frontend' },
    { id: 'backend' as const, name: '⚙️ Backend', color: 'backend' },
    { id: 'database' as const, name: '🗄️ Database', color: 'database' },
    { id: 'devops' as const, name: '🚀 DevOps', color: 'devops' },
    { id: 'networking' as const, name: '🌍 Networking', color: 'network' },
  ];

  return (
    <div className="min-h-screen bg-bg-dark pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12">
          <h1 className="text-4xl font-bold text-text-primary mb-2">Your Progress</h1>
          <p className="text-lg text-text-secondary">Keep improving your technical English skills</p>
        </motion.div>

        {/* Overall Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <h3 className="text-sm text-text-secondary mb-2">Total XP</h3>
            <div className="text-4xl font-bold text-primary-500">{profile.totalXP}</div>
          </Card>
          <Card>
            <h3 className="text-sm text-text-secondary mb-2">Terms Learned</h3>
            <div className="text-4xl font-bold text-secondary">{totalLearned}</div>
          </Card>
          <Card>
            <h3 className="text-sm text-text-secondary mb-2">Current Level</h3>
            <div className="flex items-center gap-3">
              <div className="text-3xl">{levelInfo.badge}</div>
              <div>
                <div className="text-2xl font-bold text-text-primary">{levelInfo.number}</div>
                <div className="text-sm text-text-secondary">{levelInfo.name}</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Learning by Area */}
        <Card className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Learning by Area</h2>
          <div className="space-y-6">
            {areas.map((area) => {
              const progress = getAreaProgress(termsByArea[area.id as keyof typeof termsByArea]);
              return (
                <motion.div key={area.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{area.name.substring(0, 2)}</span>
                      <div>
                        <h4 className="font-semibold">{area.name}</h4>
                        <p className="text-xs text-text-secondary">
                          {progress.learned} of {progress.total} terms
                        </p>
                      </div>
                    </div>
                    <Badge label={`${progress.percentage}%`} variant={area.color as any} />
                  </div>
                  <ProgressBar
                    current={progress.learned}
                    max={progress.total}
                    color={`bg-${area.color}`}
                    animated={false}
                    showLabel={false}
                  />
                </motion.div>
              );
            })}
          </div>
        </Card>

        {/* Achievements */}
        <Card>
          <h2 className="text-2xl font-bold mb-6">Achievements</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: '🔥', label: 'Week Warrior', unlocked: profile.streak >= 7 },
              { icon: '🏆', label: 'Century Club', unlocked: totalLearned >= 100 },
              { icon: '⚡', label: 'Lightning Fast', unlocked: profile.totalXP >= 500 },
              { icon: '👑', label: 'Level Master', unlocked: profile.currentLevel >= 4 },
              { icon: '🎯', label: 'Perfect Score', unlocked: false },
              { icon: '🚀', label: 'Tech Leader', unlocked: profile.currentLevel === 6 },
            ].map((achievement, idx) => (
              <motion.div
                key={idx}
                className={`p-4 rounded-xl text-center border-2 ${
                  achievement.unlocked
                    ? 'border-secondary bg-secondary bg-opacity-10'
                    : 'border-border-color bg-opacity-5'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="text-4xl mb-2 opacity-100">{achievement.icon}</div>
                <p className={`text-sm font-semibold ${achievement.unlocked ? 'text-secondary' : 'text-text-secondary'}`}>
                  {achievement.label}
                </p>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Progress;
