
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, DollarSign, ShoppingBag, Activity, Bell, Search, Menu, Plus, UserPlus } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Card from '../components/ui/Card';
import StatCard from '../components/dashboard/StatCard';
import OrdersTable from '../components/dashboard/OrdersTable';
import MonitorCenter from './MonitorCenter';
import UILibrary from './UILibrary'; // 新页面导入
import Input from '../components/ui/Input';
import AnimatedInput from '../components/ui/AnimatedInput';
import Button from '../components/ui/Button';
import { Stat, Order, User } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isChartReady, setIsChartReady] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setIsChartReady(true), 200);
    return () => clearTimeout(timer);
  }, []);

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
      case 'ui-library': // 新的路由
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
             <Button variant="ghost" onClick={() => setActiveTab('dashboard')} className="mt-4">返回首页</Button>
          </div>
        );
    }
  };

  return (
    <div className="h-screen w-full bg-gray-50 flex overflow-hidden">
      {/* 侧边栏 */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />

      {/* 主体内容区域 */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative lg:ml-64 bg-gray-50">
        
        {/* 顶部通栏 */}
        <header className="h-20 shrink-0 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-8 z-30 sticky top-0">
          <div className="flex items-center gap-4 lg:hidden">
            <Button variant="ghost" isIconOnly onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="w-6 h-6 text-gray-600" />
            </Button>
          </div>

          <div className="flex-1 max-w-md hidden md:block">
            {/* 使用新的 AnimatedInput 替换普通 Input */}
            <AnimatedInput 
              value={searchValue}
              onChange={setSearchValue}
              placeholder="搜索任意内容..." 
              icon={<Search className="w-4 h-4 text-gray-400" />} 
              className="!mb-0"
              animationType="bubble"
            />
          </div>

          <div className="flex items-center gap-5">
            <Button variant="ghost" isIconOnly shape="circle" className="relative !bg-gray-100/50">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white ring-1 ring-red-500/20"></span>
            </Button>
            
            <div className="flex items-center gap-3 pl-5 border-l border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 leading-tight">{user.name}</p>
                <p className="text-[11px] text-gray-400 uppercase tracking-widest mt-0.5">Administrator</p>
              </div>
              <motion.img 
                whileHover={{ scale: 1.05 }}
                src={user.avatar} 
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-100 cursor-pointer" 
                alt="user" 
              />
            </div>
          </div>
        </header>

        {/* 内容滚动区 */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
          <div className="max-w-7xl mx-auto p-8 lg:p-10">
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
