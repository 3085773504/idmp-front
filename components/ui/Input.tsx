import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BaseProps } from '../../types';

interface InputProps extends BaseProps, React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelRight?: React.ReactNode;
  error?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ 
  label, 
  labelRight, 
  error, 
  icon, 
  className = '', 
  id, 
  onFocus, 
  onBlur, 
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  // Animation variants for specific parts
  const labelVariants = {
    idle: { x: 0, color: '#4b5563' }, // gray-600
    focused: { x: 4, color: '#4f46e5' }, // primary-600 (Indigo)
    error: { x: 0, color: '#ef4444' } // red-500
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Label Row */}
      {(label || labelRight) && (
        <div className="flex justify-between items-end mb-2 ml-1">
          {label && (
            <motion.label 
              htmlFor={id} 
              initial="idle"
              animate={error ? "error" : isFocused ? "focused" : "idle"}
              variants={labelVariants}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="block text-sm font-semibold cursor-pointer"
            >
              {label}
            </motion.label>
          )}
          {labelRight && (
            <div className="text-xs text-gray-500">
              {labelRight}
            </div>
          )}
        </div>
      )}
      
      {/* Input Container */}
      <motion.div 
        className="relative group"
        initial={false}
        animate={isFocused ? { scale: 1.01 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {/* Animated Background & Border Layer (Absolute) */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          initial={false}
          animate={{
            backgroundColor: isFocused ? '#ffffff' : '#f8fafc', // white vs slate-50
            borderColor: error 
              ? '#fca5a5' // red-300
              : isFocused 
                ? '#6366f1' // primary-500
                : '#e2e8f0', // slate-200
            boxShadow: isFocused 
              ? error 
                ? '0 0 0 4px rgba(239, 68, 68, 0.15)' // Red glow
                : '0 0 0 4px rgba(99, 102, 241, 0.15)' // Indigo glow
              : '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // Subtle shadow when idle
          }}
          style={{ borderWidth: '1px', borderStyle: 'solid' }}
          transition={{ duration: 0.2 }}
        />

        {/* Input Element & Icon */}
        <div className="relative flex items-center z-10">
          {icon && (
            <motion.div 
              animate={{ color: isFocused ? '#4f46e5' : '#94a3b8' }} // primary-600 vs slate-400
              className="absolute left-4 transition-colors duration-200"
            >
              {icon}
            </motion.div>
          )}
          <input
            id={id}
            className={`
              w-full bg-transparent rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400
              focus:outline-none transition-colors font-medium
              ${icon ? 'pl-11' : ''}
            `}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
        </div>
      </motion.div>

      {/* Error Message Animation */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            className="overflow-hidden"
          >
            <p className="mt-1.5 ml-1 text-sm text-red-500 font-medium flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-red-500 inline-block"/>
              {error}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Input;