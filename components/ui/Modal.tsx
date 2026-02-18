
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  triggerRect?: DOMRect | null;
  footer?: React.ReactNode; // Optional custom footer. Pass null to hide.
  className?: string; // Allow overriding max-width etc.
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, triggerRect, footer, className = '' }) => {
  // 计算初始偏移量，使弹窗能从点击位置平滑飞入中心
  const animationState = useMemo(() => {
    // 默认无触发源时的居中缩放
    if (!triggerRect) {
      return {
        initial: { scale: 0.8, opacity: 0, y: 30 },
        animate: { scale: 1, opacity: 1, x: 0, y: 0 },
        exit: { scale: 0.85, opacity: 0, y: 20 }
      };
    }
    
    // 获取当前视口宽高
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    
    // 计算触发点（点击位置）相对于视口中心点的偏移量
    const triggerCenterX = triggerRect.left + triggerRect.width / 2;
    const triggerCenterY = triggerRect.top + triggerRect.height / 2;
    
    const offsetX = triggerCenterX - vw / 2;
    const offsetY = triggerCenterY - vh / 2;

    return {
      initial: {
        x: offsetX,
        y: offsetY,
        scale: 0.1,
        opacity: 0,
      },
      animate: {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
      },
      exit: {
        // 退出时向触发点方向略微收缩
        x: offsetX * 0.5,
        y: offsetY * 0.5,
        scale: 0.2,
        opacity: 0,
      }
    };
  }, [triggerRect, isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 全屏背景遮罩：确保 z-index 足够高并覆盖全屏 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-md z-[1000] cursor-default"
          />
          
          {/* 弹性定位容器：通过 flex 确保内容绝对居中 */}
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[1001] p-6">
            <motion.div
              key={title} // 确保内容切换时重新计算
              initial={animationState.initial}
              animate={animationState.animate}
              exit={animationState.exit}
              transition={{ 
                type: "spring", 
                stiffness: 420, 
                damping: 35, 
                mass: 1,
                velocity: 2
              }}
              className={`bg-white w-full max-w-md rounded-[32px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] pointer-events-auto overflow-hidden border border-white/20 flex flex-col origin-center ${className}`}
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between shrink-0">
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">{title}</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  isIconOnly
                  shape="circle"
                  className="!bg-gray-100/50 hover:!bg-gray-100" 
                  onClick={onClose}
                >
                  <X className="w-5 h-5 text-gray-500" />
                </Button>
              </div>
              
              {/* Content Area */}
              <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
                {children}
              </div>
              
              {/* Footer Actions */}
              {footer === undefined ? (
                <div className="px-6 py-5 bg-gray-50/50 flex justify-end gap-3 border-t border-gray-50 shrink-0">
                  <Button variant="secondary" className="px-6 rounded-2xl" onClick={onClose}>取消</Button>
                  <Button className="px-8 rounded-2xl" onClick={onClose}>确认</Button>
                </div>
              ) : footer}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
