
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Button from './Button';

interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  triggerRect?: DOMRect | null;
  footer?: React.ReactNode;
  className?: string;
}

const GlassModal: React.FC<GlassModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  triggerRect, 
  footer, 
  className = '' 
}) => {
  // Calculate animation origin based on trigger element position
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
          {/* Subtle dark overlay with minimal blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-[1000] cursor-default"
          />
          
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[1001] p-6">
            <motion.div
              initial={animationState.initial}
              animate={animationState.animate}
              exit={animationState.exit}
              transition={{ 
                type: "spring", 
                stiffness: 350, 
                damping: 30,
                mass: 0.8
              }}
              className={`
                w-full max-w-md rounded-[2rem] 
                bg-white/65 backdrop-blur-2xl backdrop-saturate-150
                border border-white/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15),inset_0_0_0_1px_rgba(255,255,255,0.2)]
                pointer-events-auto overflow-hidden flex flex-col origin-center
                ${className}
              `}
            >
              {/* Header */}
              <div className="px-8 py-6 border-b border-black/5 flex items-center justify-between shrink-0">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight drop-shadow-sm">{title}</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  isIconOnly
                  shape="circle"
                  className="!bg-black/5 hover:!bg-black/10 text-gray-600 backdrop-blur-sm" 
                  onClick={onClose}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              {/* Content */}
              <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
                {children}
              </div>
              
              {/* Footer */}
              {footer && (
                 <div className="px-8 py-5 bg-white/40 border-t border-white/40 shrink-0 backdrop-blur-md">
                    {footer}
                 </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GlassModal;
