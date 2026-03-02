import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavigationLayoutProps {
  sidebar: ReactNode;
  header: ReactNode;
  tabs?: ReactNode;
  children: ReactNode;
  className?: string;
  isSidebarCollapsed?: boolean;
  layoutMode?: 'sidebar' | 'bottom'; // New prop
  bottomNav?: ReactNode; // New prop for bottom nav component
}

const NavigationLayout: React.FC<NavigationLayoutProps> = ({ 
  sidebar, 
  header, 
  tabs, 
  children, 
  className = "h-screen", 
  isSidebarCollapsed = false,
  layoutMode = 'sidebar',
  bottomNav
}) => {
  return (
    <div className={`${className} w-full bg-gray-50 flex overflow-hidden relative`}>
      {/* 左侧菜单栏区域 - Animate width to push/pull main content smoothly */}
      <AnimatePresence initial={false}>
        {layoutMode === 'sidebar' && (
          <motion.div
            key="sidebar-layout"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: isSidebarCollapsed ? 80 : 256, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="h-full z-40 shrink-0 relative"
          >
            {/* Inner div maintains width so sidebar content doesn't squish during transition */}
            <div style={{ width: isSidebarCollapsed ? 80 : 256 }} className="h-full absolute top-0 left-0">
              {sidebar}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 主体内容区域 */}
      <main 
        className={`flex-1 flex flex-col min-w-0 h-full relative bg-gray-50`}
      >
        
        {/* 顶部导航栏区域 */}
        {header}
        
        {/* 标签页区域 */}
        {tabs}

        {/* 中间内容区 */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
          {children}
          {/* Bottom padding for bottom nav mode to prevent content overlap */}
          <AnimatePresence>
            {layoutMode === 'bottom' && (
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: 96 }} // 24rem = 96px
                exit={{ height: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* 底部悬浮导航 - Animate from bottom and center it */}
      <AnimatePresence initial={false}>
        {layoutMode === 'bottom' && (
          <motion.div
            key="bottom-nav-layout"
            initial={{ y: 150, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 150, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            className="fixed bottom-8 left-0 right-0 z-50 pointer-events-none flex justify-center"
          >
            <div className="pointer-events-auto">
              {bottomNav}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavigationLayout;
