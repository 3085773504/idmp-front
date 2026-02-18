
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BaseProps } from '../../types';

interface AnimatedInputProps extends BaseProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  animationType?: 'bubble' | 'ticker'; // bubble for text, ticker for numbers
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({ 
  label, 
  value, 
  onChange, 
  icon, 
  className = '', 
  animationType = 'bubble',
  placeholder,
  id,
  onFocus, 
  onBlur,
  type = "text",
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  // Track previous value to determine direction for ticker
  const prevValueRef = useRef(value);
  const directionRef = useRef(1);

  useEffect(() => {
    if (value.length > prevValueRef.current.length) {
      directionRef.current = 1; // Typing
    } else {
      directionRef.current = -1; // Deleting
    }
    prevValueRef.current = value;
  }, [value]);
  
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // --- Animation Variants ---

  // 1. Bubble Effect (Scale + Fade) for Text
  const bubbleVariants = {
    initial: { opacity: 0, scale: 0.5, y: 5 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.5, transition: { duration: 0.1 } }
  };

  // 2. Ticker Effect (Vertical Slide) for Numbers
  const tickerVariants = {
    initial: { y: 15, opacity: 0, filter: 'blur(2px)' },
    animate: { y: 0, opacity: 1, filter: 'blur(0px)' },
    exit: { y: -15, opacity: 0, filter: 'blur(2px)', transition: { duration: 0.1 } }
  };

  const activeVariants = animationType === 'ticker' ? tickerVariants : bubbleVariants;

  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">{label}</label>}
      
      <motion.div 
        className="relative group bg-white"
        initial={false}
        animate={isFocused ? { scale: 1.01 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {/* Container Background & Border */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          initial={false}
          animate={{
            backgroundColor: isFocused ? '#ffffff' : '#f8fafc',
            borderColor: isFocused ? '#6366f1' : '#e2e8f0',
            boxShadow: isFocused 
              ? '0 0 0 4px rgba(99, 102, 241, 0.15)' 
              : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          }}
          style={{ borderWidth: '1px', borderStyle: 'solid' }}
          transition={{ duration: 0.2 }}
        />

        <div className="relative flex items-center z-10 min-h-[48px]">
          {icon && (
            <motion.div 
              animate={{ color: isFocused ? '#4f46e5' : '#94a3b8' }}
              className="absolute left-4 transition-colors duration-200 z-20 pointer-events-none"
            >
              {icon}
            </motion.div>
          )}

          {/* 
             MIRROR LAYER (The animated text)
             It sits exactly behind the real input.
             pointer-events-none ensures clicks go through to the real input.
          */}
          <div 
            className={`
              absolute inset-0 flex items-center overflow-hidden
              px-4 py-3 text-gray-900 font-medium
              ${icon ? 'pl-11' : ''}
            `}
            aria-hidden="true"
          >
            <div className="flex items-center h-full w-full whitespace-pre">
               <AnimatePresence mode="popLayout" initial={false}>
                 {value.split('').map((char, index) => (
                   <motion.span
                     // Key uses index to maintain position stability, but creates new elements for typing
                     // Appending a random ID if it's the last char could force animation on type
                     key={`${index}-${char}`} 
                     variants={activeVariants}
                     initial="initial"
                     animate="animate"
                     exit="exit"
                     transition={{ type: "spring", stiffness: 500, damping: 25, mass: 0.8 }}
                     className="inline-block"
                   >
                     {char}
                   </motion.span>
                 ))}
               </AnimatePresence>
               {/* Show placeholder if empty */}
               {value === '' && (
                 <span className="text-gray-400 absolute pointer-events-none">{placeholder}</span>
               )}
            </div>
          </div>

          {/* 
             REAL INPUT (Transparent Text)
             The user types here. Text is invisible (color: transparent), 
             but the Caret (cursor) is visible and colored.
          */}
          <input
            id={id}
            type={type}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`
              w-full bg-transparent rounded-xl px-4 py-3 
              text-transparent caret-indigo-600 font-medium
              focus:outline-none relative z-10
              ${icon ? 'pl-11' : ''}
            `}
            style={{ 
                // Ensure browser styling matches the mirror layer exactly
                fontFamily: 'inherit',
                letterSpacing: 'inherit',
                color: 'transparent',
                textShadow: '0 0 0 transparent' // iOS fix
            }}
            autoComplete="off"
            {...props}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default AnimatedInput;
