
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

const Switch: React.FC<SwitchProps> = ({ 
  checked, 
  onChange, 
  label, 
  description, 
  disabled = false,
  className = '' 
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const toggle = () => {
    if (!disabled) onChange(!checked);
  };

  return (
    <div 
      className={`flex items-center justify-between gap-4 group cursor-pointer select-none ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${className}`} 
      onClick={toggle}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      {/* 文本区域 */}
      {(label || description) && (
        <div className="flex flex-col">
          {label && <span className="text-[15px] font-semibold text-gray-900 tracking-tight leading-none mb-1.5">{label}</span>}
          {description && <span className="text-[13px] text-gray-400 leading-tight">{description}</span>}
        </div>
      )}

      {/* 轨道容器 */}
      <motion.div
        animate={{
          backgroundColor: checked ? '#4f46e5' : '#e5e7eb', // primary-600 vs gray-200
        }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="relative h-[31px] w-[51px] shrink-0 rounded-full flex items-center px-[2px] overflow-visible"
      >
        {/* 内部高光层 (增加体积感) */}
        <div className={`absolute inset-0 rounded-full transition-opacity duration-300 ${checked ? 'opacity-10' : 'opacity-0'} bg-gradient-to-b from-white to-transparent`} />

        {/* 滑块 (Thumb) - 移除 layout 属性，手动控制动画以避免布局计算错误 */}
        <motion.div
          initial={false}
          animate={{
            x: checked ? 20 : 0,
            width: isPressed ? 32 : 27, // 按下时拉伸成胶囊状
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 32,
            mass: 0.8,
            velocity: 2
          }}
          className={`
            relative h-[27px] rounded-full bg-white flex items-center justify-center
            shadow-[0_3px_8px_rgba(0,0,0,0.15),0_1px_1px_rgba(0,0,0,0.16),0_3px_1px_rgba(0,0,0,0.1)]
            z-10
          `}
        >
          {/* 滑块微细纹理或图标可放于此 */}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Switch;
