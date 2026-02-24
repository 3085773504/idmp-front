
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BaseProps } from '../../types';

interface InputProps extends BaseProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  shake?: boolean;
  value: string;
  onChange: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  icon, 
  rightElement,
  className = '', 
  id, 
  onFocus, 
  onBlur,
  shake,
  value = '', // Default to empty string
  onChange,
  type = "text",
  placeholder,
  size = 'md',
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const hasValue = value.length > 0;
  // 标签显示逻辑：仅当 (未聚焦 且 无内容) 时显示。
  // 一旦获得焦点或有内容，标签立即消失，就像原生 Placeholder。
  const showLabel = !isFocused && !hasValue;

  // 将内容拆分为字符数组
  const characters = value.split('');

  const sizeClasses = {
    sm: 'h-9 text-sm rounded-lg',
    md: 'h-14 text-base rounded-2xl',
    lg: 'h-16 text-lg rounded-2xl',
  };

  const iconSizeClasses = {
    sm: 'left-3',
    md: 'left-4',
    lg: 'left-5',
  };

  const paddingLeftClasses = {
    sm: 'pl-9',
    md: 'pl-11',
    lg: 'pl-12',
  };

  const paddingRightClasses = {
    sm: 'pr-9',
    md: 'pr-12',
    lg: 'pr-14',
  };

  const defaultPaddingLeft = {
    sm: 'pl-3',
    md: 'pl-4',
    lg: 'pl-5',
  };

  const defaultPaddingRight = {
    sm: 'pr-3',
    md: 'pr-4',
    lg: 'pr-5',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className={`w-full ${className}`}>
      <motion.div 
        className="relative group"
        initial={false}
        animate={{ 
            scale: isFocused ? 1.01 : 1,
            x: shake ? [0, -10, 10, -10, 10, 0] : 0
        }}
        transition={shake ? { duration: 0.4 } : { type: "spring", stiffness: 400, damping: 28 }}
      >
        {/* 背景与边框 */}
        <motion.div
          className={`absolute inset-0 pointer-events-none ${size === 'sm' ? 'rounded-lg' : 'rounded-2xl'}`}
          initial={false}
          animate={{
            backgroundColor: isFocused ? '#ffffff' : '#f8fafc',
            borderColor: error 
              ? '#fca5a5' 
              : isFocused 
                ? '#4f46e5' 
                : '#e2e8f0',
            boxShadow: isFocused 
              ? error 
                ? '0 0 0 4px rgba(239, 68, 68, 0.1)' 
                : '0 12px 30px -10px rgba(79, 70, 229, 0.1), 0 0 0 4px rgba(79, 70, 229, 0.05)' 
              : '0 1px 2px 0 rgba(0, 0, 0, 0.02)',
          }}
          style={{ borderWidth: '1.5px', borderStyle: 'solid' }}
          transition={{ duration: 0.2 }}
        />

        <div className={`relative flex items-center z-10 overflow-hidden ${sizeClasses[size]}`}>
          {/* 左侧图标 */}
          {icon && (
            <motion.div 
              animate={{ 
                color: isFocused ? '#4f46e5' : '#94a3b8',
                scale: isFocused ? 1.1 : 1
              }}
              className={`absolute ${iconSizeClasses[size]} transition-colors duration-200 pointer-events-none`}
            >
              {icon}
            </motion.div>
          )}

          {/* Label / Placeholder Text */}
          <AnimatePresence>
            {showLabel && label && (
              <motion.label
                htmlFor={id}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                className={`absolute font-bold text-gray-400 pointer-events-none ${icon ? paddingLeftClasses[size] : defaultPaddingLeft[size]}`}
              >
                {label}
              </motion.label>
            )}
            {showLabel && !label && placeholder && (
              <motion.span
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                className={`absolute font-medium text-gray-400 pointer-events-none ${icon ? paddingLeftClasses[size] : defaultPaddingLeft[size]}`}
              >
                {placeholder}
              </motion.span>
            )}
          </AnimatePresence>

          {/* --- 核心：字符动画镜像层 --- */}
          <div 
            className={`
              absolute inset-0 flex items-center pointer-events-none whitespace-pre
              ${icon ? paddingLeftClasses[size] : defaultPaddingLeft[size]}
              ${rightElement ? paddingRightClasses[size] : defaultPaddingRight[size]}
            `}
            aria-hidden="true"
          >
            <div className={`flex items-center h-full w-full overflow-hidden font-bold text-gray-900 ${textSizeClasses[size]}`}>
               <AnimatePresence mode="popLayout" initial={false}>
                 {characters.map((char, index) => (
                   <motion.span
                     /* 
                        关键修复：使用 index 作为 key。
                        1. 当在末尾输入时，之前的 index (0..n) 不变，React 不会重绘，因此已有文字不闪烁。
                        2. 新增的 index 会触发 initial -> animate 动画。
                        3. 当删除末尾时，最后的 index 移除，触发 exit 动画。
                        4. layout="position" 确保如果前面字符宽度变化（虽然是等宽字体通常没事），后续字符会平滑滑动。
                     */
                     key={index} 
                     layout="position"
                     initial={{ opacity: 0, y: 8, scale: 0.8 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.1 } }}
                     transition={{ 
                        type: "spring", 
                        stiffness: 600, 
                        damping: 35, 
                        mass: 0.5 
                     }}
                     className="inline-block"
                   >
                     {type === 'password' ? '•' : char}
                   </motion.span>
                 ))}
               </AnimatePresence>
            </div>
          </div>

          {/* 真实的隐藏输入框 - 文字设为透明，保留光标 */}
          <input
            ref={inputRef}
            id={id}
            type={type}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`
              w-full h-full bg-transparent
              text-transparent caret-indigo-600 focus:outline-none 
              font-bold relative z-20 ${textSizeClasses[size]}
              ${icon ? paddingLeftClasses[size] : defaultPaddingLeft[size]}
              ${rightElement ? paddingRightClasses[size] : defaultPaddingRight[size]}
            `}
            style={{ 
                textShadow: '0 0 0 transparent', // 隐藏真实文字
                WebkitTextFillColor: 'transparent' // 兼容性隐藏
            }}
            autoComplete="off"
            {...props}
          />

          {/* 右侧按钮 */}
          {rightElement && (
             <div className="absolute right-3 flex items-center justify-center z-30">
                {rightElement}
             </div>
          )}
        </div>
      </motion.div>

      {/* 错误提示 */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-2 ml-1"
          >
            <p className="text-[13px] text-red-500 font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"/>
              {error}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Input;
