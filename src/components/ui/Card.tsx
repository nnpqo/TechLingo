import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isHoverable?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = '', onClick, isHoverable = false }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={`bg-bg-card border border-border-color rounded-2xl p-6 transition-all duration-300 ${
          isHoverable ? 'hover:shadow-card-hover hover:border-primary-500' : ''
        } ${onClick ? 'cursor-pointer' : ''} ${className}`}
        onClick={onClick}
        whileHover={isHoverable ? { y: -2 } : {}}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
