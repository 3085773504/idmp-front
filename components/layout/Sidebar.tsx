
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Activity, 
  PieChart, 
  Settings, 
  Users, 
  FileText, 
  Bell, 
  LogOut, 
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Shield,
  Database
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: any;
  children?: NavItem[];
}

export const navItems: NavItem[] = [
  { id: 'dashboard', label: '控制面板', icon: LayoutDashboard },
  { id: 'monitor', label: '监控中心', icon: Activity },
  { id: 'analysis', label: '分析页', icon: PieChart },
  { id: 'orders', label: '订单管理', icon: FileText },
  { id: 'notifications', label: '消息通知', icon: Bell },
  { 
    id: 'system', 
    label: '系统管理', 
    icon: Settings,
    children: [
      { id: 'users', label: '用户管理', icon: Users },
      { id: 'roles', label: '角色管理', icon: Shield },
      { id: 'database', label: '数据备份', icon: Database },
    ]
  },
];

export const findNavItem = (items: NavItem[], id: string): NavItem | undefined => {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.children) {
      const found = findNavItem(item.children, id);
      if (found) return found;
    }
  }
  return undefined;
};

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  isCollapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout, isCollapsed, onCollapse }) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['system']);
  const [hoveredMenuId, setHoveredMenuId] = useState<string | null>(null);
  const [hoverMenuPos, setHoverMenuPos] = useState<{top: number, left: number}>({ top: 0, left: 0 });

  const toggleMenu = (id: string) => {
    setExpandedMenus(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleItemClick = (item: NavItem) => {
    if (item.children) {
      if (isCollapsed) {
        // In collapsed mode, click does nothing (we rely on hover for submenu)
        // Previously we expanded sidebar, now we disable that behavior as requested.
        return;
      } else {
        toggleMenu(item.id);
      }
    } else {
      setActiveTab(item.id);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent, item: NavItem) => {
    if (isCollapsed) {
      const rect = e.currentTarget.getBoundingClientRect();
      setHoverMenuPos({ top: rect.top, left: rect.right + 10 });
      setHoveredMenuId(item.id);
    }
  };

  const handleMouseLeave = () => {
    setHoveredMenuId(null);
  };

  const renderNavItem = (item: NavItem, depth = 0) => {
    const isActive = activeTab === item.id;
    const isExpanded = expandedMenus.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const isChildActive = hasChildren && item.children?.some(child => child.id === activeTab);

    return (
      <div key={item.id} className="mb-1 relative">
        <button
          onClick={() => handleItemClick(item)}
          onMouseEnter={(e) => handleMouseEnter(e, item)}
          onMouseLeave={handleMouseLeave}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
            ${isActive 
              ? 'bg-primary-50 text-primary-600 shadow-sm shadow-primary-100' 
              : isChildActive
                ? 'bg-gray-50 text-primary-600'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }
            ${isCollapsed ? 'justify-center !px-0' : ''} 
          `}
          style={{ 
            paddingLeft: isCollapsed ? 0 : `${0.75 + depth * 1}rem` 
          }}
        >
          <div className={`relative flex items-center justify-center transition-colors ${isActive || isChildActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
            <item.icon className="w-5 h-5" />
            {isActive && (
              <motion.div
                layoutId="sidebar-active-indicator"
                className="absolute -left-3 w-1 h-6 bg-primary-600 rounded-r-full"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </div>
          
          {!isCollapsed && (
            <>
              <span className="font-medium text-sm whitespace-nowrap flex-1 text-left">
                {item.label}
              </span>
              {hasChildren && (
                <span className="text-gray-400">
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </span>
              )}
            </>
          )}
        </button>

        {/* Render Children (Inline for Expanded Sidebar) */}
        <AnimatePresence>
          {hasChildren && isExpanded && !isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {item.children!.map(child => renderNavItem(child, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
      <motion.aside 
        initial={false}
        animate={{ width: isCollapsed ? 80 : 256 }}
        className="h-screen bg-white border-r border-gray-100 flex flex-col shrink-0 z-40 relative"
      >
        {/* Logo Area */}
        <div className="h-20 flex items-center px-6 border-b border-gray-50/50">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shrink-0 shadow-lg shadow-primary-500/20">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-bold text-xl text-gray-900 tracking-tight whitespace-nowrap"
              >
                Admin Pro
              </motion.span>
            )}
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => onCollapse(!isCollapsed)}
          className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-md text-gray-400 hover:text-primary-600 hover:border-primary-100 transition-all hover:scale-110 z-50"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>

        {/* Nav Items */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-3 custom-scrollbar">
          <nav className="space-y-1">
            {navItems.map(item => renderNavItem(item))}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-50">
          <button 
            onClick={onLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? "退出登录" : ""}
          >
            <LogOut className="w-5 h-5 shrink-0 transition-colors" />
            {!isCollapsed && (
              <span className="font-medium text-sm whitespace-nowrap">退出登录</span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Floating Menu Portal (Fixed Position) */}
      <AnimatePresence>
        {isCollapsed && hoveredMenuId && (
          (() => {
            const item = navItems.find(i => i.id === hoveredMenuId);
            if (!item) return null;
            
            const hasChildren = item.children && item.children.length > 0;

            if (hasChildren) {
              return (
                <motion.div
                  key="submenu"
                  initial={{ opacity: 0, x: -10, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="fixed z-50 bg-white rounded-xl shadow-xl border border-gray-100 p-2 min-w-[160px]"
                  style={{ 
                    top: hoverMenuPos.top, 
                    left: hoverMenuPos.left 
                  }}
                  onMouseEnter={() => setHoveredMenuId(hoveredMenuId)}
                  onMouseLeave={() => setHoveredMenuId(null)}
                >
                  <div className="text-xs font-semibold text-gray-400 px-3 py-2 mb-1 uppercase tracking-wider">
                    {item.label}
                  </div>
                  {item.children!.map(child => {
                    const isActive = activeTab === child.id;
                    return (
                      <button
                        key={child.id}
                        onClick={() => {
                          setActiveTab(child.id);
                          setHoveredMenuId(null);
                        }}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                          ${isActive 
                            ? 'bg-primary-50 text-primary-600' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }
                        `}
                      >
                        <child.icon className="w-4 h-4" />
                        {child.label}
                      </button>
                    );
                  })}
                </motion.div>
              );
            } else {
              return (
                <motion.div
                  key="tooltip"
                  initial={{ opacity: 0, x: -10, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="fixed z-50 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg shadow-xl pointer-events-none whitespace-nowrap"
                  style={{ 
                    top: hoverMenuPos.top + 6, 
                    left: hoverMenuPos.left 
                  }}
                >
                  {item.label}
                </motion.div>
              );
            }
          })()
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
