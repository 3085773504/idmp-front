
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  MonitorPlay,
  Layout,
  Sparkles, 
  MessageSquare, 
  Lightbulb,
  TrendingUp, 
  Bell,
  AlertTriangle, 
  History,
  Database, 
  FolderTree, 
  Tags,
  ShieldCheck,
  Zap, 
  Box, 
  Archive, 
  Activity, 
  Server,
  Settings, 
  Users, 
  Share2,
  Eye,
  Puzzle,
  LogOut, 
  ChevronLeft,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: any;
  children?: NavItem[];
}

export const navItems: NavItem[] = [
  { 
    id: 'visual-board', 
    label: '可视化看板', 
    icon: LayoutDashboard,
    children: [
      { id: 'dashboard', label: '全局控制台', icon: MonitorPlay },
      { id: 'dashboards', label: '自定义仪表板', icon: Layout },
    ]
  },
  { 
    id: 'ai-apps', 
    label: 'AI 智能应用', 
    icon: Sparkles,
    children: [
      { id: 'ai-chat', label: '数据智能问答', icon: MessageSquare },
      { id: 'ai-insight', label: '数据洞察与推荐', icon: Lightbulb },
      { id: 'ai-forecast', label: '多变量时序预测', icon: TrendingUp },
    ]
  },
  { 
    id: 'events', 
    label: '事件与告警', 
    icon: Bell,
    children: [
      { id: 'event-rules', label: '事件检测与规则', icon: AlertTriangle },
      { id: 'event-history', label: '告警历史分析', icon: History },
    ]
  },
  { 
    id: 'data-center', 
    label: '时序数据中心', 
    icon: Database,
    children: [
      { id: 'data-catalog', label: '数据目录与资产', icon: FolderTree },
      { id: 'data-context', label: '数据情景化配置', icon: Tags },
      { id: 'data-quality', label: '数据质量治理', icon: ShieldCheck },
      { id: 'realtime-task', label: '实时分析任务', icon: Zap },
    ]
  },
  { 
    id: 'model-studio', 
    label: 'AI 模型工坊', 
    icon: Box,
    children: [
      { id: 'model-hub', label: '模型仓库与版本', icon: Archive },
      { id: 'model-train', label: '模型训练与评测', icon: Activity },
      { id: 'model-deploy', label: '模型部署与服务', icon: Server },
    ]
  },
  { 
    id: 'system', 
    label: '系统与平台管理', 
    icon: Settings,
    children: [
      { id: 'users', label: '用户与权限管理', icon: Users },
      { id: 'data-service', label: '数据服务与分发', icon: Share2 },
      { id: 'observability', label: '可观测性与运维', icon: Eye },
      { id: 'integration', label: '兼容性与扩展接入', icon: Puzzle },
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
        <motion.button
          whileHover={{ scale: isCollapsed ? 1.05 : 1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleItemClick(item)}
          onMouseEnter={(e: any) => handleMouseEnter(e, item)}
          onMouseLeave={handleMouseLeave}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-200 group relative isolate
            ${isActive 
              ? 'text-primary-700' 
              : isChildActive
                ? 'text-primary-600'
                : 'text-gray-500 hover:text-gray-900'
            }
            ${isCollapsed ? 'justify-center !px-0' : ''} 
          `}
          style={{ 
            paddingLeft: isCollapsed ? 0 : `${0.75 + depth * 1}rem` 
          }}
        >
          {/* Active Background Pill */}
          {(isActive || isChildActive) && (
            <motion.div
              layoutId="sidebar-active-bg"
              className="absolute inset-0 bg-primary-50 rounded-xl -z-10"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}

          <motion.div 
            whileHover={{ scale: 1.1 }}
            className={`relative flex items-center justify-center transition-colors ${isActive || isChildActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'}`}
          >
            <item.icon className="w-5 h-5" />
            {isActive && (
              <motion.div
                layoutId="sidebar-active-indicator"
                className="absolute -left-3 w-1 h-6 bg-primary-600 rounded-r-full"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </motion.div>
          
          {!isCollapsed && (
            <>
              <span className="font-medium text-sm whitespace-nowrap flex-1 text-left">
                {item.label}
              </span>
              {hasChildren && (
                <motion.span 
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="text-gray-400"
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.span>
              )}
            </>
          )}
        </motion.button>

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
            const item = findNavItem(navItems, hoveredMenuId);
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
