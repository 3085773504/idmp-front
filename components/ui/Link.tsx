
import React from 'react';
import { motion } from 'framer-motion';
import { BaseProps } from '../../types';

interface LinkProps extends BaseProps {
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  underline?: 'none' | 'hover' | 'always';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
}

const Link: React.FC<LinkProps> = ({
  children,
  href = '#',
  onClick,
  variant = 'primary',
  size = 'md',
  underline = 'hover',
  leftIcon,
  rightIcon,
  className = '',
  disabled = false,
}) => {
  const variants = {
    primary: "text-primary-600 hover:text-primary-700",
    secondary: "text-gray-500 hover:text-gray-900",
    danger: "text-red-500 hover:text-red-600",
  };

  const sizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const underlineColors = {
    primary: "bg-primary-500",
    secondary: "bg-gray-900",
    danger: "bg-red-500",
  };

  return (
    <motion.a
      href={disabled ? undefined : href}
      onClick={disabled ? (e) => e.preventDefault() : onClick}
      whileTap={disabled ? {} : { scale: 0.98, opacity: 0.8 }}
      className={`
        relative inline-flex items-center gap-1.5 font-medium transition-colors duration-300 cursor-pointer select-none
        ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${className}
      `}
    >
      {leftIcon && <span className="flex items-center justify-center shrink-0">{leftIcon}</span>}
      
      <span className="relative py-0.5">
        {children}
        
        {/* iOS 风格平滑下划线 */}
        {underline !== 'none' && (
          <motion.div
            className={`absolute bottom-0 left-0 h-[1.5px] rounded-full ${underlineColors[variant]}`}
            initial={underline === 'always' ? { width: '100%' } : { width: 0 }}
            whileHover={underline === 'hover' ? { width: '100%' } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
      </span>

      {rightIcon && <span className="flex items-center justify-center shrink-0">{rightIcon}</span>}
    </motion.a>
  );
};

export default Link;
