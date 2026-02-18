
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Button from './Button';

interface LiquidModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  triggerRect?: DOMRect | null;
  footer?: React.ReactNode;
  className?: string;
}

const LiquidModal: React.FC<LiquidModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  triggerRect, 
  footer, 
  className = '' 
}) => {
  // 计算动画原点
  const animationState = useMemo(() => {
    if (!triggerRect) {
      return {
        initial: { scale: 0.9, opacity: 0, y: 20 },
        animate: { scale: 1, opacity: 1, x: 0, y: 0 },
        exit: { scale: 0.95, opacity: 0, y: 10 }
      };
    }
    
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    const triggerCenterX = triggerRect.left + triggerRect.width / 2;
    const triggerCenterY = triggerRect.top + triggerRect.height / 2;
    const offsetX = triggerCenterX - vw / 2;
    const offsetY = triggerCenterY - vh / 2;

    return {
      initial: { x: offsetX, y: offsetY, scale: 0.2, opacity: 0 },
      animate: { x: 0, y: 0, scale: 1, opacity: 1 },
      exit: { x: offsetX * 0.5, y: offsetY * 0.5, scale: 0.4, opacity: 0 }
    };
  }, [triggerRect, isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩：深色模糊，突显液态光感 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[1000] cursor-default"
          />
          
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[1001] p-6">
            <motion.div
              initial={animationState.initial}
              animate={animationState.animate}
              exit={animationState.exit}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 25,
                mass: 0.8
              }}
              className={`
                relative w-full max-w-md rounded-[2.5rem] 
                bg-white/40 border border-white/60
                shadow-[0_30px_60px_-12px_rgba(0,0,0,0.2),inset_0_0_0_2px_rgba(255,255,255,0.3)]
                pointer-events-auto overflow-hidden flex flex-col origin-center
                ${className}
              `}
            >
              {/* --- 液态流体背景层 (Fluid Background Layers) --- */}
              <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] z-0">
                 {/* 流体球 1: 蓝紫色 */}
                 <motion.div 
                    className="absolute -top-[20%] -left-[20%] w-[80%] h-[80%] bg-blue-400/30 rounded-full blur-3xl mix-blend-multiply"
                    animate={{ 
                        x: [0, 100, 0],
                        y: [0, 50, 0],
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                 />
                 {/* 流体球 2: 紫红色 */}
                 <motion.div 
                    className="absolute top-[20%] -right-[20%] w-[70%] h-[70%] bg-purple-400/30 rounded-full blur-3xl mix-blend-multiply"
                    animate={{ 
                        x: [0, -80, 0],
                        y: [0, -40, 0],
                        scale: [1, 1.3, 1],
                        rotate: [0, -60, 0]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                 />
                 {/* 流体球 3: 青绿色 (高光) */}
                 <motion.div 
                    className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] bg-cyan-300/30 rounded-full blur-3xl mix-blend-overlay"
                    animate={{ 
                        x: [0, 40, -40, 0],
                        y: [0, -30, 30, 0],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                 />
                 
                 {/* 磨砂扩散层: 均匀光线，让流体看起来在玻璃内部 */}
                 <div className="absolute inset-0 bg-white/40 backdrop-blur-xl" />
              </div>

              {/* --- 内容层 (Content) --- */}
              <div className="relative z-10 flex flex-col h-full">
                  {/* Header */}
                  <div className="px-8 py-6 border-b border-white/20 flex items-center justify-between shrink-0">
                    <h3 className="text-xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">{title}</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      isIconOnly
                      shape="circle"
                      className="!bg-white/20 hover:!bg-white/40 text-gray-700 backdrop-blur-md shadow-sm" 
                      onClick={onClose}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  
                  {/* Body */}
                  <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
                    {children}
                  </div>
                  
                  {/* Footer */}
                  {footer && (
                     <div className="px-8 py-5 bg-white/30 border-t border-white/30 shrink-0 backdrop-blur-md">
                        {footer}
                     </div>
                  )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LiquidModal;
