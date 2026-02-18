
import React from 'react';
import { motion } from 'framer-motion';

interface RadioOption {
  label: string;
  value: string;
  description?: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  name: string;
  label?: string;
  direction?: 'horizontal' | 'vertical';
}

const Radio: React.FC<RadioGroupProps> = ({ options, value, onChange, name, label, direction = 'vertical' }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-gray-700 mb-3 ml-1">{label}</label>}
      <div className={`flex ${direction === 'vertical' ? 'flex-col space-y-3' : 'flex-wrap gap-6'}`}>
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <label
              key={option.value}
              className="relative flex items-start gap-3 cursor-pointer group py-1"
            >
              <motion.div 
                className="relative shrink-0 mt-[1px]" // 精确对齐文本首行
                whileTap={{ scale: 0.9 }}
              >
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={isSelected}
                  onChange={() => onChange(option.value)}
                  className="sr-only"
                />
                
                {/* 完美对中容器：20x20px 固定空间 */}
                <motion.div
                  className="w-5 h-5 rounded-full flex items-center justify-center relative overflow-hidden"
                  initial={false}
                  animate={{
                    // 使用 box-shadow 模拟边框，避免 border 宽度影响 flex 居中计算
                    boxShadow: isSelected 
                      ? `inset 0 0 0 2px #4f46e5` 
                      : `inset 0 0 0 2px #e2e8f0`,
                    backgroundColor: isSelected ? '#ffffff' : '#f8fafc',
                    scale: isSelected ? 1.05 : 1
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                  {/* 内部圆点：在 20x20 的纯净空间中 flex 居中 */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: isSelected ? 1 : 0, 
                      opacity: isSelected ? 1 : 0 
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 550, 
                      damping: 35,
                      mass: 0.5
                    }}
                    // 9px 或 2.25单位 看起来更精致，也更容易在偶数容器中对齐
                    className="w-[9px] h-[9px] rounded-full bg-primary-600"
                  />
                </motion.div>
              </motion.div>
              
              <div className="flex flex-col select-none pt-[1px]">
                <span className={`text-sm font-medium transition-colors leading-tight ${isSelected ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'}`}>
                  {option.label}
                </span>
                {option.description && (
                  <span className="text-xs text-gray-400 mt-1 leading-normal">{option.description}</span>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default Radio;
