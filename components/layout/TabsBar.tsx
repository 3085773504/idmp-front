import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export interface Tab {
  id: string;
  label: string;
}

interface TabsBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabClick: (id: string) => void;
  onTabClose: (id: string) => void;
}

const TabsBar: React.FC<TabsBarProps> = ({ tabs, activeTab, onTabClick, onTabClose }) => {
  return (
    <div className="flex items-center gap-2 px-4 pt-3 border-b border-gray-100 bg-white/50 backdrop-blur-sm overflow-x-auto custom-scrollbar">
      <AnimatePresence initial={false}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <motion.div
              key={tab.id}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 10, width: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0, width: "auto" }}
              exit={{ opacity: 0, scale: 0.9, width: 0 }}
              transition={{ 
                opacity: { duration: 0.2 },
                layout: { duration: 0.2 },
                scale: { duration: 0.2 },
                width: { duration: 0.2 }, // Use simple duration for width to prevent spring overshoot
                y: { type: "spring", stiffness: 500, damping: 30 }
              }}
              className="relative group overflow-hidden flex-shrink-0"
            >
              <div
                onClick={() => onTabClick(tab.id)}
                className={`
                  relative flex items-center gap-2 px-4 py-2 rounded-t-lg cursor-pointer transition-all duration-200 select-none text-sm font-medium whitespace-nowrap
                  ${isActive 
                    ? 'bg-white text-primary-600 shadow-[0_-1px_2px_rgba(0,0,0,0.02)] border-t border-x border-gray-100 z-10' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
                  }
                `}
              >
                {/* Active Indicator Line */}
                {isActive && (
                  <motion.div
                    layoutId="active-tab-indicator"
                    className="absolute top-0 left-0 right-0 h-0.5 bg-primary-500 rounded-full"
                  />
                )}

                <span>{tab.label}</span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTabClose(tab.id);
                  }}
                  className={`
                    p-0.5 rounded-full transition-colors
                    ${isActive 
                      ? 'text-primary-400 hover:bg-primary-50 hover:text-primary-600' 
                      : 'text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-gray-200 hover:text-gray-600'
                    }
                  `}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              
              {/* Bottom border cover for active tab to merge with content */}
              {isActive && (
                <div className="absolute -bottom-px left-0 right-0 h-px bg-white z-20" />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default TabsBar;
