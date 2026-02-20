import React, { ReactNode } from 'react';

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
    <div className={`${className} w-full bg-gray-50 flex overflow-hidden`}>
      {/* 左侧菜单栏区域 - Only render in sidebar mode */}
      {layoutMode === 'sidebar' && sidebar}

      {/* 主体内容区域 */}
      <main 
        className={`flex-1 flex flex-col min-w-0 h-full relative bg-gray-50 transition-all duration-300 ease-in-out`}
      >
        
        {/* 顶部导航栏区域 */}
        {header}
        
        {/* 标签页区域 */}
        {tabs}

        {/* 中间内容区 */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
          {children}
          {/* Bottom padding for bottom nav mode to prevent content overlap */}
          {layoutMode === 'bottom' && <div className="h-24" />}
        </div>
      </main>

      {/* 底部悬浮导航 - Only render in bottom mode */}
      {layoutMode === 'bottom' && bottomNav}
    </div>
  );
};

export default NavigationLayout;
