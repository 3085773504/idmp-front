
import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, ShoppingCart, Settings, LogOut, Package, PieChart, Activity, Clock, Palette, Gauge } from 'lucide-react';
import { NavItem } from '../../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: '控制面板', icon: LayoutDashboard },
  { id: 'monitor', label: '监控中心', icon: Gauge },
  { id: 'ui-library', label: 'UI 系统', icon: Palette },
  { id: 'analytics', label: '数据分析', icon: PieChart },
  { id: 'users', label: '客户管理', icon: Users },
  { id: 'products', label: '设备管理', icon: Package },
  { id: 'orders', label: '任务工单', icon: ShoppingCart },
  { id: 'settings', label: '系统设置', icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  return (
    <motion.aside 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen fixed left-0 top-0 z-30"
    >
      <div className="p-8 pb-4">
        <div className="flex items-center gap-3 mb-8">
          <motion.div 
            layoutId="app-logo-box"
            className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-600/20 relative overflow-hidden"
          >
            <Clock className="w-5 h-5 text-white/30 absolute -right-1 -bottom-1" />
            <Activity className="w-5 h-5 text-white relative z-10" />
          </motion.div>
          <motion.h1 layoutId="app-logo-text" className="text-xl font-bold tracking-tight text-gray-900">iotdb-idmp</motion.h1>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                relative isolate w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group
                ${isActive ? 'text-primary-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 bg-primary-50 rounded-xl -z-10"
                  transition={{ 
                    type: "spring", 
                    stiffness: 500, 
                    damping: 30,
                    mass: 0.5 
                  }}
                />
              )}
              <span className="relative z-10 flex items-center gap-3">
                <item.icon className={`w-5 h-5 transition-colors duration-200 ${isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5" />
          退出登录
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
