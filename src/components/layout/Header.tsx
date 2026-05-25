import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, BookOpen, Trophy, Settings, Brain } from 'lucide-react';
import LevelBadge from '@/components/ui/LevelBadge';
import { useProgress } from '@/hooks/useProgress';

const Header: React.FC = () => {
  const { profile, getLevelInfo } = useProgress();
  const levelInfo = getLevelInfo();

  return (
    <motion.header
      className="bg-bg-card border-b border-border-color sticky top-0 z-30"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Brain className="w-8 h-8 text-primary-500" />
          <span className="text-2xl font-bold text-primary-500">TechLingo</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-secondary">Level {profile.currentLevel}</span>
            <LevelBadge level={profile.currentLevel} name={levelInfo.name} badge={levelInfo.badge} size="sm" />
          </div>
          <div className="text-right">
            <div className="text-sm text-text-secondary">XP</div>
            <div className="font-bold">{profile.totalXP}</div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
