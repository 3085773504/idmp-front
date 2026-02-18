
import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
  id: string;
  type: ToastType;
  content: ReactNode;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastData[];
  addToast: (type: ToastType, content: ReactNode, duration?: number) => void;
  removeToast: (id: string) => void;
  success: (content: ReactNode, duration?: number) => void;
  error: (content: ReactNode, duration?: number) => void;
  warning: (content: ReactNode, duration?: number) => void;
  info: (content: ReactNode, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// --- Toast Item Component ---

interface ToastItemProps {
  toast: ToastData;
  onClose: (id: string) => void;
  index: number;
}

const ToastItem: React.FC<ToastItemProps> = ({ 
  toast, 
  onClose, 
  index 
}) => {
  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        onClose(toast.id);
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  const styles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-100',
      text: 'text-green-800',
      iconColor: 'text-green-500',
      Icon: CheckCircle2
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-100',
      text: 'text-red-800',
      iconColor: 'text-red-500',
      Icon: AlertCircle
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      text: 'text-amber-800',
      iconColor: 'text-amber-500',
      Icon: AlertTriangle
    },
    info: {
      bg: 'bg-primary-50',
      border: 'border-primary-100',
      text: 'text-primary-800',
      iconColor: 'text-primary-500',
      Icon: Info
    }
  };

  const style = styles[toast.type];
  const Icon = style.Icon;

  return (
    <motion.div
      layout // 启用布局动画，实现丝滑的堆叠移动
      initial={{ opacity: 0, y: -50, scale: 0.9, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)', transition: { duration: 0.2 } }}
      transition={{ 
        type: "spring", 
        stiffness: 500, 
        damping: 30, 
        mass: 1 
      }}
      className={`
        pointer-events-auto flex items-center gap-3 px-4 py-3 min-w-[320px] max-w-md rounded-xl shadow-lg border backdrop-blur-sm
        ${style.bg} ${style.border} ${style.text}
      `}
      style={{
        zIndex: 1000 - index // 确保新消息在视觉上层级正确（虽然flex-col-reverse通常不需要）
      }}
    >
      <Icon className={`w-5 h-5 shrink-0 ${style.iconColor}`} />
      <div className="flex-1 text-sm font-medium leading-tight break-all">
        {toast.content}
      </div>
      <button 
        onClick={() => onClose(toast.id)}
        className={`p-1 rounded-full hover:bg-black/5 transition-colors ${style.iconColor} opacity-60 hover:opacity-100`}
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

// --- Provider Component ---

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, content: ReactNode, duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    // 新消息添加到数组末尾
    setToasts((prev) => [...prev, { id, type, content, duration }]);
  }, []);

  const success = useCallback((content: ReactNode, duration?: number) => addToast('success', content, duration), [addToast]);
  const error = useCallback((content: ReactNode, duration?: number) => addToast('error', content, duration), [addToast]);
  const warning = useCallback((content: ReactNode, duration?: number) => addToast('warning', content, duration), [addToast]);
  const info = useCallback((content: ReactNode, duration?: number) => addToast('info', content, duration), [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}
      
      {/* Toast Container - Fixed Position */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-3 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast, index) => (
            <ToastItem 
              key={toast.id} 
              toast={toast} 
              index={index}
              onClose={removeToast} 
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

// --- Hook ---

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
