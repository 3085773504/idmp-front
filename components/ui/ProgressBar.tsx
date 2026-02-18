
import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  type?: 'linear' | 'circular';
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  label?: string;
  striped?: boolean;
  animated?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  type = 'linear',
  variant = 'primary',
  size = 'md',
  showValue = false,
  label,
  striped = false,
  animated = false,
  className = ''
}) => {
  // Clamp value between 0 and 100
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  // Color Definitions
  const colors = {
    primary: 'bg-primary-600',
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
    // Premium gradient: Blue -> Indigo -> Purple
    gradient: 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600'
  };

  const trackColors = {
    primary: 'bg-primary-100/50',
    success: 'bg-green-100/50',
    warning: 'bg-amber-100/50',
    error: 'bg-red-100/50',
    gradient: 'bg-gray-100'
  };

  const textColors = {
    primary: 'text-primary-600',
    success: 'text-green-600',
    warning: 'text-amber-600',
    error: 'text-red-600',
    gradient: 'text-indigo-900'
  };

  // Dimensions
  const heights = {
    sm: 'h-1.5',
    md: 'h-3',
    lg: 'h-5'
  };

  const circleSizes = {
    sm: 56,
    md: 96,
    lg: 140
  };

  const strokeWidths = {
    sm: 5,
    md: 8,
    lg: 12
  };

  // Render Linear Progress Bar
  if (type === 'linear') {
    return (
      <div className={`w-full ${className}`}>
        {(label || showValue) && (
          <div className="flex justify-between items-end mb-2.5 px-0.5">
            {label && <span className="text-sm font-bold text-gray-700 tracking-tight">{label}</span>}
            {showValue && (
               <span className={`text-xs font-bold tabular-nums font-mono ${textColors[variant]}`}>
                 {Math.round(percentage)}%
               </span>
            )}
          </div>
        )}
        <div className={`w-full ${trackColors[variant]} rounded-full overflow-hidden ${heights[size]} shadow-inner`}>
          <motion.div
            className={`h-full rounded-full relative ${colors[variant]}`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            // iOS-like spring animation for smoothness
            transition={{ type: "spring", stiffness: 90, damping: 18, mass: 1 }}
          >
            {/* Striped Pattern Overlay */}
            {striped && (
               <div className="absolute inset-0 w-full h-full opacity-25" 
                    style={{ 
                      backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.25) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.25) 50%,rgba(255,255,255,.25) 75%,transparent 75%,transparent)',
                      backgroundSize: '1rem 1rem' 
                    }}
               >
                 {animated && (
                   <motion.div 
                     className="w-full h-full"
                     animate={{ backgroundPosition: ['0 0', '1rem 0'] }}
                     transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                   />
                 )}
               </div>
            )}
            
            {/* Glossy Reflection (Top Highlight) for depth */}
            <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
            
            {/* End Glow for Gradient Variant */}
            {variant === 'gradient' && (
              <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/40 blur-[4px] translate-x-1" />
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // Render Circular Progress Bar
  const circleSize = circleSizes[size];
  const stroke = strokeWidths[size];
  const radius = (circleSize - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  // Define stroke colors explicitly for SVG
  const getStrokeColor = () => {
     switch(variant) {
        case 'success': return '#22c55e'; // green-500
        case 'warning': return '#f59e0b'; // amber-500
        case 'error': return '#ef4444'; // red-500
        case 'gradient': return '#6366f1'; // indigo-500 (fallback for gradient in svg stroke)
        default: return '#4f46e5'; // primary-600
     }
  }

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      {/* SVG Container */}
      <svg width={circleSize} height={circleSize} className="transform -rotate-90">
        {/* Definition for Gradients */}
        <defs>
          <linearGradient id="circle_gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#9333ea" />
          </linearGradient>
        </defs>

        {/* Background Track */}
        <circle
          cx={circleSize / 2}
          cy={circleSize / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-gray-100"
        />

        {/* Animated Progress Circle */}
        <motion.circle
          cx={circleSize / 2}
          cy={circleSize / 2}
          r={radius}
          fill="none"
          stroke={variant === 'gradient' ? 'url(#circle_gradient)' : getStrokeColor()}
          strokeWidth={stroke}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          style={{ strokeDasharray: circumference }}
          transition={{ type: "spring", stiffness: 90, damping: 18, mass: 1 }}
        />
      </svg>

      {/* Center Content */}
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
           <motion.span 
             key={percentage} // Key change triggers slight pop effect? Optional.
             className={`font-bold tabular-nums font-mono leading-none ${textColors[variant]} ${size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-3xl' : 'text-xl'}`}
           >
             {Math.round(percentage)}
             <span className="text-[0.6em] ml-0.5 opacity-60">%</span>
           </motion.span>
           {label && size !== 'sm' && (
             <span className={`text-gray-400 font-bold uppercase tracking-wider mt-1 ${size === 'lg' ? 'text-xs' : 'text-[10px]'}`}>
                {label}
             </span>
           )}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
