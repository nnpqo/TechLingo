import React from 'react';
import { motion } from 'framer-motion';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'cyber' | 'frontend' | 'backend' | 'database' | 'devops' | 'network';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
}

const Badge: React.FC<BadgeProps> = ({ 
  label, 
  variant = 'primary',
  size = 'md',
  icon
}) => {
  const variants = {
    primary: 'bg-primary-500 text-white',
    success: 'bg-secondary text-black',
    warning: 'bg-warning text-black',
    danger: 'bg-accent text-white',
    cyber: 'bg-cyber text-white',
    frontend: 'bg-frontend text-white',
    backend: 'bg-backend text-black',
    database: 'bg-database text-black',
    devops: 'bg-devops text-white',
    network: 'bg-network text-white',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <motion.div
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${variants[variant]} ${sizes[size]}`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </motion.div>
  );
};

export default Badge;
