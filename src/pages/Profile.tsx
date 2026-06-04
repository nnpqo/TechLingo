import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import LevelBadge from '@/components/ui/LevelBadge';
import { useProgress } from '@/hooks/useProgress';
import { useUserStore } from '@/store/userStore';
import { cybersecurityTerms, frontendTerms, backendTerms, databaseTerms, devopsTerms, networkingTerms } from '@/data/terms';
import { Flame } from 'lucide-react';

const Profile: React.FC = () => {
  const { profile, getTotalLearned: totalLearned, getLevelInfo } = useProgress();
  const logout = useUserStore((s) => s.logout);
  const levelInfo = getLevelInfo();

  const totalTerms = useMemo(() => {
    return (
      cybersecurityTerms.length +
      frontendTerms.length +
      backendTerms.length +
      databaseTerms.length +
      devopsTerms.length +
      networkingTerms.length
    );
  }, []);

  const overallPercent = useMemo(() => {
    if (!totalTerms) return 0;
    return Math.round((totalLearned / totalTerms) * 100);
  }, [totalLearned, totalTerms]);

  return (
    <div className="min-h-screen bg-bg-dark pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12">
          <h1 className="text-4xl font-bold text-text-primary mb-2">Perfil</h1>
          <p className="text-lg text-text-secondary">Tu progreso general y estado actual</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <Card>
            <h3 className="text-sm text-text-secondary mb-2">Progreso general</h3>
            <div className="text-3xl font-bold text-text-primary mb-3">{overallPercent}%</div>
            <ProgressBar current={totalLearned} max={Math.max(1, totalTerms)} color="bg-primary-500" animated={false} showLabel={false} />
            <p className="text-xs text-text-secondary mt-2">
              {totalLearned} de {totalTerms} términos aprendidos
            </p>
          </Card>

          <Card>
            <h3 className="text-sm text-text-secondary mb-2">Nivel actual</h3>
            <div className="flex items-center gap-3">
              <div className="text-3xl">{levelInfo.badge}</div>
              <div>
                <div className="text-2xl font-bold text-text-primary">{levelInfo.name}</div>
                <div className="text-sm text-text-secondary">Tu nivel actual</div>
              </div>
            </div>
            <div className="mt-4">
              <LevelBadge level={profile.currentLevel} name={levelInfo.name} badge={levelInfo.badge} size="sm" />
            </div>
          </Card>

          <Card>
            <h3 className="text-sm text-text-secondary mb-2">Day streak</h3>
            <div className="flex items-center gap-3">
              <Flame className="w-6 h-6 text-secondary" />
              <div>
                <div className="text-3xl font-bold text-secondary">{profile.streak}</div>
                <div className="text-sm text-text-secondary">días seguidos</div>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">{profile.name}</h2>
              <p className="text-sm text-text-secondary">Sesión simulada (sin servidor)</p>
            </div>
            <Button variant="outline" onClick={logout}>
              Cerrar sesión
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
