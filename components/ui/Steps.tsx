
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

export interface StepItem {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

interface StepsProps {
  steps: StepItem[];
  currentStep: number;
  onChange?: (step: number) => void; // Optional: if provided, steps become clickable
  className?: string;
}

const Steps: React.FC<StepsProps> = ({ steps, currentStep, onChange, className = '' }) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="relative flex items-center justify-between">
        {/* Background Track Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full" />

        {/* Active Progress Line */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary-600 rounded-full origin-left"
          initial={{ width: '0%' }}
          animate={{
            width: `${(currentStep / (steps.length - 1)) * 100}%`
          }}
          // 修改点：改用 easeInOut 缓动，消除 spring 带来的"穿透"或回弹感，实现像水流一样的平滑填充
          // duration: 0.4s 保证了既不拖沓也不突兀
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />

        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isClickable = onChange && index <= currentStep + 1; // Allow clicking up to next step usually, or adjust logic

          return (
            <div key={index} className="relative flex flex-col items-center group z-10">
              <motion.button
                onClick={() => isClickable && onChange?.(index)}
                disabled={!isClickable}
                className={`
                  relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-300 bg-white
                  ${isCompleted || isActive 
                    ? 'border-primary-600 bg-primary-600 text-white' 
                    : 'border-gray-200 text-gray-400'}
                  ${isClickable ? 'cursor-pointer' : 'cursor-default'}
                `}
                initial={false}
                animate={{
                  scale: isActive ? 1.15 : 1,
                  backgroundColor: isCompleted || isActive ? '#4f46e5' : '#ffffff',
                  borderColor: isCompleted || isActive ? '#4f46e5' : '#e2e8f0',
                  boxShadow: isActive ? "0 0 0 6px rgba(99, 102, 241, 0.15)" : "none"
                }}
                whileHover={isClickable && !isActive ? { scale: 1.05, borderColor: '#9ca3af' } : {}}
                whileTap={isClickable ? { scale: 0.95 } : {}}
                // 按钮动画稍微调高阻尼 (damping)，使其变"硬"一点，配合线条的稳重感
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                {/* Icon Container */}
                <div className="relative flex items-center justify-center w-full h-full">
                    <AnimatePresence mode="wait" initial={false}>
                        {isCompleted ? (
                            <motion.div
                                key="check"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Check className="w-5 h-5 stroke-[3px]" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="number"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.2 }}
                            >
                                {step.icon ? step.icon : <span className="font-bold text-sm font-mono">{index + 1}</span>}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
              </motion.button>

              {/* Text Label */}
              <motion.div 
                className="absolute top-14 flex flex-col items-center w-32 text-center"
                initial={false}
                animate={{ 
                    opacity: isActive || isCompleted ? 1 : 0.6,
                    y: isActive ? 0 : 0
                }}
                transition={{ duration: 0.3 }}
              >
                <span className={`text-sm font-bold transition-colors duration-300 ${isActive ? 'text-primary-700' : 'text-gray-600'}`}>
                  {step.title}
                </span>
                {step.description && (
                  <span className="text-xs text-gray-400 mt-0.5 font-medium">{step.description}</span>
                )}
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Steps;
