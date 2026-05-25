import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md',
    isLoading = false,
    children,
    disabled,
    ...props 
  }, ref) => {
    const baseStyles = 'font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2';

    const variants = {
      primary: 'bg-primary-500 hover:bg-primary-600 text-white disabled:bg-primary-300',
      secondary: 'bg-secondary text-black hover:opacity-90 disabled:opacity-50',
      outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 disabled:opacity-50',
      danger: 'bg-accent text-white hover:bg-red-700 disabled:bg-red-300',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5 text-base',
      lg: 'px-7 py-3 text-lg',
    };

    return (
      <motion.button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}
        disabled={disabled || isLoading}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.05 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.95 }}
        {...(props as any)}
      >
        {isLoading ? (
          <>
            <span className="inline-block animate-spin">⟳</span>
            Loading...
          </>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
