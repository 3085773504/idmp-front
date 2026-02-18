import React from 'react';
import { motion } from 'framer-motion';
import { BaseProps } from '../../types';

interface BadgeProps extends BaseProps {
  variant?: 'success' | 'warning' | 'error' | 'neutral' | 'primary';
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', className = '' }) => {
  const variants = {
    success: "bg-green-50 text-green-700 border-green-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    error: "bg-red-50 text-red-700 border-red-200",
    neutral: "bg-gray-50 text-gray-600 border-gray-200",
    primary: "bg-primary-50 text-primary-700 border-primary-200"
  };

  return (
    <motion.span 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
        ${variants[variant]} ${className}
      `}
    >
      {children}
    </motion.span>
  );
};

export default Badge;