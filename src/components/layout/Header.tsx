import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, BookOpen, Trophy, Settings, Brain, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/config/firebaseConfig';
import LevelBadge from '@/components/ui/LevelBadge';
import { useProgress } from '@/hooks/useProgress';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { profile, getLevelInfo } = useProgress();
  const levelInfo = getLevelInfo();

  const handleLogout = async () => {
    if (confirm('¿Deseas cerrar sesión?')) {
      try {
        await signOut(auth);
        navigate('/login', { replace: true });
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
  };

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
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm hidden sm:inline">Salir</span>
          </button>
        </div>

        {/* Mobile logout button */}
        <button
          onClick={handleLogout}
          className="md:hidden p-2 rounded-lg hover:bg-bg-elevated transition-colors"
          title="Sign out"
        >
          <LogOut className="w-5 h-5 text-red-500" />
        </button>
      </div>
    </motion.header>
  );
};

export default Header;
