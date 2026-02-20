
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar, { navItems, findNavItem } from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import NavigationLayout from '../components/layout/NavigationLayout';
import TabsBar, { Tab } from '../components/layout/TabsBar';
import BottomNav from '../components/layout/BottomNav';
import Card from '../components/ui/Card';
import StatCard from '../components/dashboard/StatCard';
import OrdersTable from '../components/dashboard/OrdersTable';
import MonitorCenter from './MonitorCenter';
import UILibrary from './UILibrary';
import Button from '../components/ui/Button';
import { Stat, Order, User } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Users, 
  DollarSign, 
  ShoppingCart, 
  TrendingUp,
  MoreHorizontal,
  Plus,
  UserPlus,
  ShoppingBag,
  Activity
} from 'lucide-react';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const stats: Stat[] = [
  { label: '总营收', value: '￥45,231.89', change: 20.1, icon: DollarSign },
  { label: '活跃用户', value: '+2,350', change: 180.1, icon: Users },
  { label: '设备销售', value: '+12,234', change: 19, icon: ShoppingBag },
  { label: '实时在线', value: '+573', change: -4.3, icon: Activity },
];

const orders: Order[] = [
  { id: '3214', customer: '张三', date: '2023年10月23日', amount: '￥1,120.50', status: 'completed' },
  { id: '3213', customer: '李四', date: '2023年10月23日', amount: '￥85.00', status: 'pending' },
  { id: '3212', customer: '王五', date: '2023年10月22日', amount: '￥350.20', status: 'completed' },
  { id: '3211', customer: '赵六', date: '2023年10月21日', amount: '￥54.00', status: 'cancelled' },
  { id: '3210', customer: '孙七', date: '2023年10月21日', amount: '￥210.00', status: 'completed' },
];

const chartData = [
  { name: '周一', uv: 4000, pv: 2400, amt: 2400 },
  { name: '周二', uv: 3000, pv: 1398, amt: 2210 },
  { name: '周三', uv: 2000, pv: 9800, amt: 2290 },
  { name: '周四', uv: 2780, pv: 3908, amt: 2000 },
  { name: '周五', uv: 1890, pv: 4800, amt: 2181 },
  { name: '周六', uv: 2390, pv: 3800, amt: 2500 },
  { name: '周日', uv: 3490, pv: 4300, amt: 2100 },
];

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [openTabs, setOpenTabs] = useState<Tab[]>([{ id: 'dashboard', label: '控制面板' }]);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Desktop sidebar collapse
  const [layoutMode, setLayoutMode] = useState<'sidebar' | 'bottom'>('sidebar'); // Layout mode state
  const [isChartReady, setIsChartReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsChartReady(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const toggleLayoutMode = () => {
    setLayoutMode(prev => prev === 'sidebar' ? 'bottom' : 'sidebar');
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Ensure tab is in openTabs (should be if clicked, but good for safety)
    if (!openTabs.find(t => t.id === tabId)) {
      const item = findNavItem(navItems, tabId);
      if (item) {
        setOpenTabs([...openTabs, { id: item.id, label: item.label }]);
      }
    }
  };

  const handleSidebarClick = (tabId: string) => {
    const item = findNavItem(navItems, tabId);
    if (item) {
      if (!openTabs.find(t => t.id === tabId)) {
        setOpenTabs([...openTabs, { id: item.id, label: item.label }]);
      }
      setActiveTab(tabId);
    }
  };

  const handleTabClose = (tabId: string) => {
    // Prevent closing the last tab
    if (openTabs.length <= 1) return;

    const newTabs = openTabs.filter(t => t.id !== tabId);
    setOpenTabs(newTabs);

    // If closing active tab, switch to the one before it
    if (activeTab === tabId) {
      const index = openTabs.findIndex(t => t.id === tabId);
      const newActiveTab = newTabs[Math.max(0, index - 1)];
      setActiveTab(newActiveTab.id);
    }
  };

  const currentTitle = findNavItem(navItems, activeTab)?.label || '控制面板';

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <motion.div
            key="dash-main"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, i) => (
                <StatCard key={i} stat={stat} index={i} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <Card className="lg:col-span-2 h-[450px] flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">营收概览</h3>
                    <p className="text-sm text-gray-500">月度时序数据分析</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary">按周</Button>
                    <Button size="sm" variant="primary">按月</Button>
                  </div>
                </div>
                <div className="w-full h-[320px] min-h-[320px]">
                  {isChartReady && (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)' }}
                          cursor={{ stroke: '#4f46e5', strokeWidth: 1.5 }}
                        />
                        <Area type="monotone" dataKey="uv" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorUv)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </Card>

              <Card className="lg:col-span-1">
                <h3 className="text-lg font-bold text-gray-900 mb-6">快捷操作</h3>
                <div className="space-y-4">
                  <div className="p-5 bg-indigo-50/50 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-indigo-100/50 transition-all group">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                      <Plus className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-indigo-900">新增设备</h4>
                      <p className="text-xs text-indigo-500 mt-0.5">快速注册 IoT 终端</p>
                    </div>
                  </div>
                  <div className="p-5 bg-purple-50/50 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-purple-100/50 transition-all group">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                      <UserPlus className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-purple-900">创建用户</h4>
                      <p className="text-xs text-purple-500 mt-0.5">分配系统管理权限</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="overflow-hidden p-0">
              <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">最新工单</h3>
                  <p className="text-sm text-gray-500 mt-0.5">近期设备异常及处理记录</p>
                </div>
                <Button variant="secondary" size="sm">全部工单</Button>
              </div>
              <OrdersTable orders={orders} />
            </Card>
          </motion.div>
        );
      case 'monitor':
        return (
          <motion.div
            key="monitor-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <MonitorCenter />
          </motion.div>
        );
      case 'ui-library':
        return (
          <motion.div
            key="ui-library"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <UILibrary />
          </motion.div>
        );
      default:
        return (
          <div className="h-[60vh] flex flex-col items-center justify-center text-gray-400">
             <Activity className="w-16 h-16 mb-4 opacity-20" />
             <p className="text-lg font-medium">功能建设中...</p>
             <p className="text-sm text-gray-400 mt-2">Page ID: {activeTab}</p>
             <Button variant="ghost" onClick={() => setActiveTab('dashboard')} className="mt-4">返回首页</Button>
          </div>
        );
    }
  };

  return (
    <NavigationLayout
      layoutMode={layoutMode}
      isSidebarCollapsed={isSidebarCollapsed}
      sidebar={
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={handleSidebarClick} 
          onLogout={onLogout} 
          isCollapsed={isSidebarCollapsed}
          onCollapse={setIsSidebarCollapsed}
        />
      }
      bottomNav={
        <BottomNav 
          activeTab={activeTab} 
          setActiveTab={handleSidebarClick} 
        />
      }
      header={
        <Header 
          user={user} 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen}
          title={currentTitle}
          layoutMode={layoutMode}
          onToggleLayout={toggleLayoutMode}
        />
      }
      tabs={
        <TabsBar 
          tabs={openTabs}
          activeTab={activeTab}
          onTabClick={handleTabChange}
          onTabClose={handleTabClose}
        />
      }
    >
      <div className="max-w-7xl mx-auto p-8 lg:p-10">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </div>
    </NavigationLayout>
  );
};

export default Dashboard;
