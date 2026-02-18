import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { BaseProps } from '../../types';

interface ButtonProps extends BaseProps, Omit<HTMLMotionProps<"button">, "children" | "className"> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  shape?: 'default' | 'circle' | 'square';
  isLoading?: boolean;
  isIconOnly?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  shape = 'default',
  isLoading = false,
  isIconOnly = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  // 核心样式：使用 transition-all 处理颜色变化，物理动效由 framer-motion 接管
  const baseStyles = "relative inline-flex items-center justify-center font-medium transition-colors duration-200 outline-none active:ring-2 active:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-visible select-none";
  
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 active:ring-primary-600 shadow-lg shadow-primary-500/20 border border-transparent hover:shadow-primary-500/40",
    secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:text-gray-900 active:ring-gray-300 shadow-sm",
    ghost: "bg-transparent text-gray-600 hover:bg-primary-50 hover:text-primary-600 active:ring-primary-400/30",
    danger: "bg-red-500 text-white hover:bg-red-600 active:ring-red-500 shadow-sm shadow-red-500/10 hover:shadow-red-500/30"
  };

  const sizes = isIconOnly ? {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12"
  } : {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base"
  };

  const shapes = {
    default: "rounded-xl",
    circle: "rounded-full",
    square: "rounded-2xl"
  };

  return (
    <motion.button
      // 悬浮时：稍微放大并向上抬起
      whileHover={{ 
        scale: disabled || isLoading ? 1 : 1.04,
        y: disabled || isLoading ? 0 : -2
      }}
      // 点击时：缩放并回归原位
      whileTap={{ 
        scale: 0.96,
        y: 0 
      }}
      // iOS 风格的柔和弹簧曲线
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 30,
        mass: 0.8 // 增加一点“质量感”，让回弹更稳健
      }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${shapes[shape]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      <div className={`flex items-center justify-center gap-2 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {isIconOnly ? (
          <span className="flex items-center justify-center">{leftIcon || rightIcon || children}</span>
        ) : (
          <>
            {leftIcon && <span className="flex items-center justify-center">{leftIcon}</span>}
            <span className="leading-none">{children}</span>
            {rightIcon && <span className="flex items-center justify-center">{rightIcon}</span>}
          </>
        )}
      </div>
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        </div>
      )}
    </motion.button>
  );
};

export default Button;