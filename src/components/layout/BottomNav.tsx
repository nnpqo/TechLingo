import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, BookOpen, Trophy, Settings, Zap } from 'lucide-react';

const BottomNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/areas', icon: BookOpen, label: 'Learn' },
    { path: '/glossary', icon: Zap, label: 'Glossary' },
    { path: '/progress', icon: Trophy, label: 'Progress' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 bg-bg-card border-t border-border-color md:hidden z-40"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-around items-center py-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link key={path} to={path} className="flex-1">
              <motion.div
                className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl transition-colors ${
                  isActive ? 'text-primary-500' : 'text-text-secondary hover:text-text-primary'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={24} />
                <span className="text-xs font-semibold">{label}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default BottomNav;
