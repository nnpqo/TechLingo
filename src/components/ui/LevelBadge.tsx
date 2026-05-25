import React from 'react';
import { motion } from 'framer-motion';

interface LevelBadgeProps {
  level: number;
  name: string;
  badge: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  showAnimation?: boolean;
}

const LevelBadge: React.FC<LevelBadgeProps> = ({
  level,
  name,
  badge,
  size = 'md',
  onClick,
  showAnimation = false,
}) => {
  const sizes = {
    sm: 'w-12 h-12 text-xl',
    md: 'w-16 h-16 text-3xl',
    lg: 'w-24 h-24 text-5xl',
  };

  return (
    <motion.div
      className={`${sizes[size]} flex flex-col items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 border-2 border-primary-400 cursor-pointer`}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={showAnimation ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : {}}
      transition={showAnimation ? { duration: 0.6 } : {}}
    >
      <span>{badge}</span>
      {size !== 'sm' && (
        <span className="text-xs font-bold text-white mt-1">{level}</span>
      )}
    </motion.div>
  );
};

export default LevelBadge;
