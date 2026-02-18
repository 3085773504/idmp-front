
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BaseProps } from '../../types';

interface InputProps extends BaseProps, React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelRight?: React.ReactNode;
  error?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  shake?: boolean;
}

const Input: React.FC<InputProps> = ({ 
  label, 
  labelRight, 
  error, 
  icon, 
  rightElement,
  className = '', 
  id, 
  onFocus, 
  onBlur,
  shake,
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

  const labelVariants = {
    idle: { x: 0, color: '#4b5563' },
    focused: { x: 4, color: '#4f46e5', fontWeight: 700 },
    error: { x: 0, color: '#ef4444' }
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || labelRight) && (
        <div className="flex justify-between items-end mb-2 ml-1">
          {label && (
            <motion.label 
              htmlFor={id} 
              initial="idle"
              animate={error ? "error" : isFocused ? "focused" : "idle"}
              variants={labelVariants}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="block text-[13px] font-bold tracking-wide uppercase cursor-pointer"
            >
              {label}
            </motion.label>
          )}
          {labelRight && (
            <div className="text-xs text-gray-500 font-medium">
              {labelRight}
            </div>
          )}
        </div>
      )}
      
      <motion.div 
        className="relative group"
        initial={false}
        animate={{ 
            scale: isFocused ? 1.02 : 1,
            x: shake ? [0, -10, 10, -10, 10, 0] : 0
        }}
        transition={shake ? { duration: 0.4 } : { type: "spring", stiffness: 400, damping: 25 }}
      >
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          initial={false}
          animate={{
            backgroundColor: isFocused ? '#ffffff' : '#f8fafc',
            borderColor: error 
              ? '#fca5a5' 
              : isFocused 
                ? '#6366f1' 
                : '#e2e8f0',
            boxShadow: isFocused 
              ? error 
                ? '0 0 0 4px rgba(239, 68, 68, 0.1)' 
                : '0 10px 25px -5px rgba(99, 102, 241, 0.1), 0 0 0 4px rgba(99, 102, 241, 0.05)' 
              : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          }}
          style={{ borderWidth: '1.5px', borderStyle: 'solid' }}
          transition={{ duration: 0.3 }}
        />

        <div className="relative flex items-center z-10 h-12">
          {icon && (
            <motion.div 
              animate={{ 
                color: isFocused ? '#4f46e5' : '#94a3b8',
                scale: isFocused ? 1.1 : 1
              }}
              className="absolute left-4 transition-colors duration-200"
            >
              {icon}
            </motion.div>
          )}
          <input
            id={id}
            className={`
              w-full h-full bg-transparent rounded-2xl px-4 text-gray-900 placeholder-gray-300
              focus:outline-none transition-colors font-semibold text-base
              ${icon ? 'pl-12' : ''}
              ${rightElement ? 'pr-12' : ''}
            `}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          {rightElement && (
             <div className="absolute right-3 flex items-center justify-center">
                {rightElement}
             </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            className="overflow-hidden"
          >
            <p className="mt-2 ml-1 text-sm text-red-500 font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block shadow-sm shadow-red-500/50"/>
              {error}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Input;
