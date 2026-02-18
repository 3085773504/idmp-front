
import React from 'react';
import { motion } from 'framer-motion';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange, description }) => {
  return (
    <label className="flex items-start gap-3 cursor-pointer group py-1 select-none">
      <motion.div 
        className="relative shrink-0 mt-[2px]"
        whileTap={{ scale: 0.9 }}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        
        {/* 复选框主体：使用内阴影模拟边框确保居中精度 */}
        <motion.div
          className="w-5 h-5 rounded-md flex items-center justify-center relative shadow-sm"
          initial={false}
          animate={{
            backgroundColor: checked ? '#4f46e5' : '#ffffff',
            boxShadow: checked 
              ? `inset 0 0 0 2px #4f46e5` 
              : `inset 0 0 0 2px #e2e8f0`,
            scale: checked ? 1.05 : 1
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          {/* 勾选图标 */}
          <svg
            className="w-3.5 h-3.5 text-white relative z-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={4.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.path
              initial={false}
              animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
              transition={{ 
                pathLength: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.1 }
              }}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>
      </motion.div>
      
      <div className="flex flex-col pt-[1px]">
        <span className={`text-sm font-medium transition-colors ${checked ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'}`}>
          {label}
        </span>
        {description && (
          <span className="text-xs text-gray-400 mt-1 leading-normal">{description}</span>
        )}
      </div>
    </label>
  );
};

export default Checkbox;
