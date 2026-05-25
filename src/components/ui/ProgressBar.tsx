import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  max: number;
  color?: string;
  animated?: boolean;
  showLabel?: boolean;
  height?: 'sm' | 'md' | 'lg';
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  max,
  color = 'bg-primary-500',
  animated = true,
  showLabel = true,
  height = 'md',
}) => {
  const percentage = Math.round((current / max) * 100);
  
  const heights = {
    sm: 'h-1',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className="w-full">
      <div className={`w-full bg-bg-elevated rounded-full overflow-hidden ${heights[height]}`}>
        <motion.div
          className={`${color} h-full rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={animated ? { duration: 0.6, ease: 'easeOut' } : { duration: 0 }}
        />
      </div>
      {showLabel && (
        <div className="mt-2 flex justify-between text-xs text-text-secondary">
          <span>{current} / {max}</span>
          <span>{percentage}%</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
