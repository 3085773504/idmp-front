
import React, { createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types & Context ---

interface SidebarContextType {
  collapsed: boolean;
}

const SidebarContext = createContext<SidebarContextType>({ collapsed: false });

interface BaseProps {
  className?: string;
  children?: React.ReactNode;
}

interface SidebarProps extends BaseProps {
  collapsed?: boolean;
  width?: number;
  collapsedWidth?: number;
}

interface SidebarItemProps extends BaseProps {
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  badge?: React.ReactNode;
  label: string; // Label is required for accessibility and collapsed tooltip logic (future)
}

// --- Components ---

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed = false,
  width = 260,
  collapsedWidth = 80,
  children,
  className = ''
}) => {
  return (
    <SidebarContext.Provider value={{ collapsed }}>
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? collapsedWidth : width }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`h-full bg-white border-r border-gray-100 flex flex-col overflow-hidden relative z-20 ${className}`}
      >
        {children}
      </motion.aside>
    </SidebarContext.Provider>
  );
};

export const SidebarHeader: React.FC<BaseProps> = ({ children, className = '' }) => (
  <div className={`p-6 flex items-center shrink-0 ${className}`}>
    {children}
  </div>
);

export const SidebarContent: React.FC<BaseProps> = ({ children, className = '' }) => (
  <div className={`flex-1 overflow-y-auto custom-scrollbar px-3 space-y-6 ${className}`}>
    {children}
  </div>
);

export const SidebarFooter: React.FC<BaseProps> = ({ children, className = '' }) => (
  <div className={`p-4 shrink-0 border-t border-gray-50 ${className}`}>
    {children}
  </div>
);

export const SidebarGroup: React.FC<BaseProps & { label?: string }> = ({ label, children, className = '' }) => {
  const { collapsed } = useContext(SidebarContext);

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <motion.div
          initial={false}
          animate={{ 
            opacity: collapsed ? 0 : 1,
            height: collapsed ? 0 : 'auto',
            marginBottom: collapsed ? 0 : 12 // Increased bottom margin slightly
          }}
          className="px-3 text-xs font-extrabold text-gray-500 uppercase tracking-widest overflow-hidden whitespace-nowrap"
        >
          {label}
        </motion.div>
      )}
      {children}
    </div>
  );
};

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  active = false,
  onClick,
  badge,
  className = ''
}) => {
  const { collapsed } = useContext(SidebarContext);

  return (
    <button
      onClick={onClick}
      className={`
        relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-200 group outline-none
        ${active ? 'text-primary-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}
        ${className}
      `}
    >
      {/* Active Background Animation */}
      {active && (
        <motion.div
          layoutId="sidebar-item-active"
          className="absolute inset-0 bg-primary-50 rounded-xl -z-10"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}

      {/* Icon */}
      {icon && (
        <div className={`shrink-0 w-5 h-5 flex items-center justify-center transition-colors ${active ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'}`}>
          {icon}
        </div>
      )}

      {/* Label (Collapsible) */}
      <div className="flex-1 overflow-hidden flex items-center">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="font-medium text-sm whitespace-nowrap"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Badge (Collapsible or Condense) */}
      {badge && !collapsed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          {badge}
        </motion.div>
      )}
      
      {/* Active Dot when collapsed (Optional visual cue) */}
      {collapsed && active && (
          <motion.div 
            className="absolute right-2 w-1.5 h-1.5 bg-primary-500 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          />
      )}
    </button>
  );
};
