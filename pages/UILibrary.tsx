
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Zap, MousePointer2, 
  Check, Bell, Shield, Smartphone, 
  Layers, LayoutGrid, Type,
  List, Grid, BarChart3, Github, ExternalLink, ArrowUpRight,
  Calendar as CalendarIcon, Clock, CalendarRange,
  Cpu, Activity, TrendingUp, Lock, Server, Wifi,
  AlertTriangle, Trash2, Crown, Sparkles, User, Users, Mail, CreditCard,
  Maximize2, Image, Database, MoreHorizontal, Download, Share2, Filter,
  Loader2, PieChart, RefreshCw, Gauge as GaugeIcon, ChevronLeft, ChevronRight,
  Droplets, Waves, AlignLeft, Star, Inbox, FileText, Hash, Home, MessageSquare, Briefcase, Settings, LogOut, PanelLeftClose, PanelLeftOpen,
  FolderGit2, Monitor, Folder, MessageCircle, Keyboard, Map, Navigation
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import AnimatedInput from '../components/ui/AnimatedInput';
import Switch from '../components/ui/Switch';
import Badge from '../components/ui/Badge';
import Tabs from '../components/ui/Tabs';
import Modal from '../components/ui/Modal';
import GlassModal from '../components/ui/GlassModal';
import LiquidModal from '../components/ui/LiquidModal';
import Link from '../components/ui/Link';
import Select from '../components/ui/Select';
import Radio from '../components/ui/Radio';
import Checkbox from '../components/ui/Checkbox';
import Slider from '../components/ui/Slider';
import Calendar from '../components/ui/Calendar';
import TimePicker from '../components/ui/TimePicker';
import DateRangePicker from '../components/ui/DateRangePicker';
import Upload from '../components/ui/Upload';
import Tree, { TreeNode } from '../components/ui/Tree';
import InteractiveCard from '../components/ui/InteractiveCard';
import { MeshCard, DarkCard, GlassCard } from '../components/ui/AdvancedCards';
import Carousel, { SlideData } from '../components/ui/Carousel';
import { TableContainer, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import Pagination from '../components/ui/Pagination';
import ProgressBar from '../components/ui/ProgressBar';
import { 
    SmoothAreaChart, 
    RoundedBarChart, 
    InteractiveDonutChart, 
    HexRadarChart, 
    LineComparisonChart, 
    RadialProgressChart, 
    ComposedAnalyticsChart,
    RealTimeLineChart
} from '../components/ui/Charts';
import { SimpleGauge, SpeedometerGauge, RingStackGauge } from '../components/ui/Gauge';
import SplitPane from '../components/layout/SplitPane';
import Masonry from '../components/layout/Masonry';
import { BentoGrid, BentoItem } from '../components/layout/BentoGrid';
import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarItem, SidebarFooter } from '../components/ui/Sidebar';
import { useToast } from '../components/ui/Toast';
import Tour, { TourStep } from '../components/ui/Tour';
import Steps from '../components/ui/Steps'; // Import Steps

// --- Mock Data Generator ---
const generateTableData = (count: number) => {
  const types = ['Switch', 'Server', 'Gateway', 'Node', 'Sensor', 'Firewall'];
  const statuses = ['online', 'offline', 'maintenance', 'error', 'archived'];
  const regions = ['US-East', 'EU-West', 'CN-North', 'AP-South', 'SA-East', 'JP-Tokyo'];
  
  return Array.from({ length: count }, (_, i) => {
    const type = types[i % types.length];
    return {
      id: i + 1,
      name: `${type}_${String(i + 1).padStart(3, '0')}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      type: type,
      usage: Math.floor(Math.random() * 100),
      users: Array.from({ length: Math.floor(Math.random() * 4) + 1 }, (_, u) => (i + u) % 15),
      region: regions[i % regions.length],
      lastActive: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toLocaleDateString()
    };
  });
};

const masonryItems = [
    { height: 200, color: 'bg-indigo-100', title: 'Analytics' },
    { height: 320, color: 'bg-purple-100', title: 'Growth' },
    { height: 180, color: 'bg-green-100', title: 'Revenue' },
    { height: 260, color: 'bg-blue-100', title: 'Users' },
    { height: 220, color: 'bg-orange-100', title: 'Orders' },
    { height: 300, color: 'bg-pink-100', title: 'Traffic' },
    { height: 240, color: 'bg-teal-100', title: 'Conversion' },
    { height: 280, color: 'bg-yellow-100', title: 'Engagement' },
];

const mailItems = [
    { id: 1, sender: 'Alicia Keys', subject: 'Project Updates', time: '10:30 AM', active: true },
    { id: 2, sender: 'Mark Zuckerberg', subject: 'Metaverse Plans', time: 'Yesterday', active: false },
    { id: 3, sender: 'Tim Cook', subject: 'Apple Event Invite', time: '2 days ago', active: false },
    { id: 4, sender: 'Satya Nadella', subject: 'Azure Integration', time: 'Last week', active: false },
    { id: 5, sender: 'Elon Musk', subject: 'Mars Mission', time: 'Last month', active: false },
];

const treeData: TreeNode[] = [
  {
    id: 'root',
    label: 'Nexus Project',
    children: [
      {
        id: 'src',
        label: 'src',
        children: [
          {
            id: 'components',
            label: 'components',
            children: [
              { id: 'Button.tsx', label: 'Button.tsx' },
              { id: 'Card.tsx', label: 'Card.tsx' },
              { id: 'Input.tsx', label: 'Input.tsx' },
            ]
          },
          {
            id: 'pages',
            label: 'pages',
            children: [
              { id: 'Home.tsx', label: 'Home.tsx' },
              { id: 'Dashboard.tsx', label: 'Dashboard.tsx' },
            ]
          },
          { id: 'App.tsx', label: 'App.tsx' },
          { id: 'index.css', label: 'index.css' },
        ]
      },
      {
        id: 'public',
        label: 'public',
        children: [
          { id: 'favicon.ico', label: 'favicon.ico' },
          { id: 'manifest.json', label: 'manifest.json' },
        ]
      },
      { id: 'package.json', label: 'package.json' },
      { id: 'README.md', label: 'README.md' },
    ]
  }
];

const navTreeData: TreeNode[] = [
    {
        id: 'overview',
        label: 'Overview',
        children: [
            { id: 'analytics', label: 'Analytics' },
            { id: 'reports', label: 'Reports' },
        ]
    },
    {
        id: 'management',
        label: 'Management',
        children: [
            { id: 'users', label: 'Users' },
            { id: 'roles', label: 'Roles & Permissions' },
            { id: 'teams', label: 'Teams' },
        ]
    },
    {
        id: 'settings',
        label: 'Settings',
        children: [
            { id: 'profile', label: 'Profile' },
            { id: 'billing', label: 'Billing' },
        ]
    }
];

const timeSeriesData: TreeNode[] = [
  {
    id: 'root-cluster',
    label: 'production_cluster_01',
    children: [
      {
        id: 'group-us-east',
        label: 'region: us-east-1',
        children: [
          {
            id: 'device-001',
            label: 'sensor_gateway_alpha',
            children: [
               { id: 'm-001', label: 'temperature_c' },
               { id: 'm-002', label: 'humidity_pct' },
               { id: 'm-003', label: 'battery_v' },
            ]
          },
          {
            id: 'device-002',
            label: 'sensor_gateway_beta',
            children: [
               { id: 'm-004', label: 'vibration_hz' },
               { id: 'm-005', label: 'uptime_sec' },
            ]
          }
        ]
      },
      {
        id: 'group-eu-west',
        label: 'region: eu-west-2',
        children: [
           { id: 'device-003', label: 'edge_node_x1' },
        ]
      }
    ]
  }
];

const UILibrary: React.FC = () => {
  const [activeTab, setActiveTab] = useState('layout');
  
  // Use Toast Hook
  const toast = useToast();

  // Tour State
  const [isTourOpen, setIsTourOpen] = useState(false);

  // Steps State
  const [currentStep, setCurrentStep] = useState(1);

  // Animated Input States
  const [animatedText, setAnimatedText] = useState('');
  const [animatedNumber, setAnimatedNumber] = useState('');

  // Sidebar Demo State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSidebarItem, setActiveSidebarItem] = useState('home');

  // Tree Demo State
  const [selectedTreeNode, setSelectedTreeNode] = useState('Button.tsx');
  const [selectedFsNode, setSelectedFsNode] = useState('package.json');
  const [selectedNavNode, setSelectedNavNode] = useState('analytics');
  const [selectedTsNode, setSelectedTsNode] = useState('m-001');

  // Chart Refresh State
  const [chartKeys, setChartKeys] = useState<{ [key: string]: number }>({
    area: 0,
    bar: 0,
    donut: 0,
    radar: 0,
    lineComp: 0,
    composed: 0,
    radial: 0,
    realtime: 0
  });

  const refreshChart = (chartId: string) => {
    setChartKeys(prev => ({ ...prev, [chartId]: prev[chartId] + 1 }));
  };

  // Helper to render refresh button
  const RefreshButton = ({ onClick, id }: { onClick: () => void, id: number }) => (
    <Button 
        size="sm" 
        variant="ghost" 
        isIconOnly 
        onClick={onClick}
        className="text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
    >
        <motion.div
            key={id} 
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            <RefreshCw className="w-4 h-4" />
        </motion.div>
    </Button>
  );
  
  // Transition Demo States
  const [transitionTab, setTransitionTab] = useState('Overview');
  const [showList, setShowList] = useState(true);
  const [step, setStep] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);

  // Modal State Management
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);
  
  // New Modal States
  const [isGlassModalOpen, setIsGlassModalOpen] = useState(false);
  const [isLiquidModalOpen, setIsLiquidModalOpen] = useState(false);

  // Form States
  const [switchState, setSwitchState] = useState(true);
  const [selectValue, setSelectValue] = useState('1');
  const [radioValue, setRadioValue] = useState('balanced');
  const [checkboxState, setCheckboxState] = useState(true);
  
  // Tabs Demo State
  const [activeTab1, setActiveTab1] = useState('list');
  const [activeTab2, setActiveTab2] = useState('day');
  const [activeTab3, setActiveTab3] = useState('profile');

  // Slider & Progress States
  const [slider1, setSlider1] = useState(0);
  const [slider2, setSlider2] = useState(75);
  const [progressValue, setProgressValue] = useState(45); // For ProgressBar demo
  
  // Gauge States
  const [gaugeValue, setGaugeValue] = useState(68);

  // Date & Time States
  const [date, setDate] = useState(new Date());
  const [dateRange, setDateRange] = useState<{start: Date | null, end: Date | null}>({
    start: new Date(),
    end: new Date(new Date().setDate(new Date().getDate() + 6))
  });

  // Table & Pagination States
  const fullTableData = useMemo(() => generateTableData(128), []); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  // Pagination Logic
  const totalPages = Math.ceil(fullTableData.length / itemsPerPage);
  const currentTableData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return fullTableData.slice(start, start + itemsPerPage);
  }, [currentPage, fullTableData]);

  // Selection Logic
  const toggleRow = (id: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const toggleAll = () => {
    if (selectedRows.size === currentTableData.length) {
      setSelectedRows(new Set());
    } else {
      const newSelected = new Set();
      currentTableData.forEach(row => newSelected.add(row.id));
      setSelectedRows(newSelected as Set<number>);
    }
  };

  const isAllSelected = currentTableData.length > 0 && selectedRows.size === currentTableData.length;

  // Carousel Data
  const slides: SlideData[] = [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2864&auto=format&fit=crop",
      category: "Featured",
      title: "构建未来的 IoT 生态系统",
      description: "探索我们最新的边缘计算网关，为您的工业自动化提供毫秒级响应速度与银行级安全保障。"
    },
    {
      id: "2",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2940&auto=format&fit=crop",
      category: "Security",
      title: "零信任安全架构",
      description: "全链路数据加密，基于 AI 的异常行为检测，确保护联网设备在任何环境下都能安全运行。"
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2944&auto=format&fit=crop",
      category: "Analytics",
      title: "海量数据，实时洞察",
      description: "利用我们的高性能时序数据库，即时处理 PB 级传感器数据，挖掘数据背后的核心价值。"
    }
  ];

  const handleOpenModal = (type: string, e: React.MouseEvent<HTMLElement>) => {
    setTriggerRect(e.currentTarget.getBoundingClientRect());
    setActiveModal(type);
  };

  const handleOpenGlassModal = (e: React.MouseEvent<HTMLElement>) => {
    setTriggerRect(e.currentTarget.getBoundingClientRect());
    setIsGlassModalOpen(true);
  };

  const handleOpenLiquidModal = (e: React.MouseEvent<HTMLElement>) => {
    setTriggerRect(e.currentTarget.getBoundingClientRect());
    setIsLiquidModalOpen(true);
  };

  const closeModal = () => setActiveModal(null);
  const closeGlassModal = () => setIsGlassModalOpen(false);
  const closeLiquidModal = () => setIsLiquidModalOpen(false);

  const ColorSwatch = ({ color, name, shade }: { color: string, name: string, shade: string }) => (
    <div className="flex items-center gap-3">
      <div className={`w-12 h-12 rounded-xl shadow-sm ${color}`}></div>
      <div>
        <p className="text-sm font-bold text-gray-900">{name}</p>
        <p className="text-xs text-gray-400 uppercase">{shade}</p>
      </div>
    </div>
  );

  const renderModalContent = () => {
    switch (activeModal) {
      case 'success':
        return (
          <div className="flex flex-col items-center justify-center pt-2">
            <div className="relative mb-6 group cursor-default">
                <motion.div 
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -inset-4 bg-green-100/50 rounded-full blur-sm"
                />
                <motion.div 
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="relative w-20 h-20 bg-gradient-to-tr from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 text-white"
                >
                    <Check className="w-10 h-10 stroke-[3px]" />
                </motion.div>
            </div>
            <h4 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">系统升级成功</h4>
            <p className="text-gray-500 text-center mb-8 max-w-[260px] leading-relaxed">
                边缘节点固件 v2.4.0 已成功下发至目标设备群组。
            </p>
             <div className="w-full bg-gray-50/80 rounded-2xl p-1 border border-gray-100">
                <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                 <Server className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Target Node</span>
                                <span className="text-sm font-medium text-gray-600">East-Region-1</span>
                            </div>
                        </div>
                        <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs font-bold">
                            <Wifi className="w-3 h-3 mr-1" />
                            Online
                        </div>
                    </div>
                </div>
            </div>
          </div>
        );
      case 'danger':
        return (
          <div className="flex flex-col items-center text-center pt-2">
             <motion.div 
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               transition={{ type: "spring", stiffness: 300, damping: 20 }}
               className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6"
             >
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                   <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
             </motion.div>
             <h4 className="text-xl font-bold text-gray-900 mb-3">确认删除该数据源？</h4>
             <p className="text-gray-500 mb-8 leading-relaxed">
               此操作将永久删除 <span className="font-mono font-bold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded">prod-db-01</span> 及其所有历史快照。该操作无法撤销。
             </p>
          </div>
        );
      case 'pro':
        return (
          <div className="pt-2">
             <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-6 mb-8 shadow-xl shadow-indigo-500/20">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                   <Crown className="w-32 h-32 rotate-12 -mr-8 -mt-8" />
                </div>
                <div className="relative z-10">
                   <div className="flex items-center gap-2 mb-2">
                      <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold border border-white/10">PRO PLAN</span>
                   </div>
                   <h4 className="text-2xl font-bold mb-2">解锁无限潜能</h4>
                   <p className="text-indigo-100 text-sm opacity-90">升级以获取高级数据分析与 24/7 优先支持。</p>
                </div>
             </div>
          </div>
        );
      case 'form':
        return (
           <div className="space-y-6 pt-2">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                 <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
                    <User className="w-6 h-6 text-gray-400" />
                 </div>
                 <div>
                    <h5 className="font-bold text-gray-900">完善个人资料</h5>
                    <p className="text-xs text-gray-500">这将帮助我们为您提供更好的推荐</p>
                 </div>
              </div>
              
              <div className="space-y-5">
                 <div className="grid grid-cols-2 gap-5">
                    <Input label="姓氏" placeholder="Li" />
                    <Input label="名字" placeholder="Ming" />
                 </div>
                 <Input label="工作邮箱" icon={<Mail className="w-4 h-4"/>} placeholder="name@company.com" />
              </div>
           </div>
        );
      default:
        return null;
    }
  };

  const getModalProps = () => {
     switch(activeModal) {
        case 'success':
           return {
              title: "操作反馈",
              footer: (
                 <div className="px-8 py-6 pt-2">
                    <Button className="w-full h-12 rounded-xl text-base shadow-xl shadow-green-500/20 bg-green-600 hover:bg-green-700 active:ring-green-600" onClick={closeModal}>
                        完成
                    </Button>
                 </div>
              )
           };
        case 'danger':
            return {
               title: "删除确认",
               footer: (
                  <div className="px-6 py-5 bg-gray-50/50 flex justify-end gap-3 border-t border-gray-50">
                    <Button variant="ghost" onClick={closeModal}>取消</Button>
                    <Button variant="danger" className="px-6 rounded-xl shadow-lg shadow-red-500/20" onClick={closeModal}>确认删除</Button>
                  </div>
               )
            };
        case 'pro':
            return {
               title: "升级计划",
               className: "max-w-lg", 
               footer: (
                  <div className="px-6 py-5 border-t border-gray-50 flex items-center justify-between bg-gray-50/50">
                     <div className="flex flex-col">
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total</span>
                        <span className="text-2xl font-bold text-gray-900">￥99<span className="text-sm text-gray-400 font-normal">/月</span></span>
                     </div>
                     <Button className="px-8 h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/30 border-none" onClick={closeModal}>
                        立即订阅
                     </Button>
                  </div>
               )
            };
        case 'form':
            return {
               title: "编辑信息",
               footer: (
                  <div className="px-6 py-5 bg-gray-50/50 flex justify-end gap-3 border-t border-gray-50">
                    <Button variant="secondary" onClick={closeModal}>暂不设置</Button>
                    <Button onClick={closeModal}>保存更改</Button>
                  </div>
               )
            };
        default:
           return { title: "", footer: null };
     }
  }

  const modalProps = getModalProps();

  // Tour Steps Configuration
  const tourSteps: TourStep[] = [
    {
      target: '#tour-intro-card',
      title: '欢迎体验 UI 系统',
      description: '这是一个基于物理动效的现代设计系统。让我们带您快速浏览核心组件。',
      placement: 'bottom'
    },
    {
        target: '#tour-tabs',
        title: '分段控制',
        description: '用于在不同的视图或模块之间进行顶层切换。支持键盘导航与滑动动画。',
        placement: 'bottom'
    },
    {
      target: '#tour-carousel',
      title: '沉浸式轮播',
      description: '支持触摸手势、自动播放和视差背景的轮播组件，适用于展示重要内容。',
      placement: 'top'
    },
    {
      target: '#tour-animated-input',
      title: '微交互输入框',
      description: '创新的输入体验，支持气泡文字弹出或数字滚动效果，提升表单趣味性。',
      placement: 'right'
    },
    {
        target: '#tour-start-btn',
        title: '开始旅程',
        description: '演示结束。点击此处可以随时重新开始漫游引导。',
        placement: 'left'
    }
  ];

  return (
    <div className="space-y-12 pb-24">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end justify-between border-b border-gray-100 pb-8"
      >
        <div id="tour-intro-card">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">UI 设计系统</h2>
          <p className="text-gray-500 mt-2">Indigo Design System 核心原子组件预览。</p>
        </div>
        <div className="flex gap-4 items-center">
            <Button 
                id="tour-start-btn"
                variant="secondary" 
                leftIcon={<Map className="w-4 h-4 text-indigo-500" />}
                onClick={() => setIsTourOpen(true)}
            >
                开始漫游引导
            </Button>
            <div id="tour-tabs">
                <Tabs 
                activeId={activeTab}
                onChange={setActiveTab}
                options={[
                    { id: 'layout', label: '布局模式', icon: <LayoutGrid className="w-4 h-4"/> },
                    { id: 'components', label: '交互组件', icon: <Layers className="w-4 h-4"/> },
                    { id: 'design', label: '视觉原子', icon: <Type className="w-4 h-4"/> },
                ]}
                />
            </div>
        </div>
      </motion.div>

      {/* Tour Component Instance */}
      <Tour 
        isOpen={isTourOpen} 
        onClose={() => setIsTourOpen(false)} 
        steps={tourSteps}
        onFinish={() => toast.success("漫游引导已完成！")}
      />

      {activeTab === 'layout' && (
        <motion.div
            key="layout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-16"
        >
            {/* ... Existing Layout Components ... */}
            {/* 1. Sidebar Demo */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-5 bg-gradient-to-b from-indigo-500 to-blue-600 rounded-full"></div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">侧边导航 (Sidebar Navigation)</h3>
                    </div>
                    {/* ... Sidebar Controls ... */}
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 font-medium">{sidebarCollapsed ? '已折叠 (Collapsed)' : '已展开 (Expanded)'}</span>
                        <Button 
                            size="sm" 
                            variant="secondary" 
                            isIconOnly
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        >
                            {sidebarCollapsed ? <PanelLeftOpen className="w-4 h-4"/> : <PanelLeftClose className="w-4 h-4"/>}
                        </Button>
                    </div>
                </div>
                
                <div className="h-[600px] w-full bg-gray-50 rounded-3xl border border-gray-200 overflow-hidden flex shadow-inner">
                    {/* Sidebar Instance */}
                    <Sidebar collapsed={sidebarCollapsed}>
                        {/* ... Sidebar Content ... */}
                        <SidebarHeader>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/20">
                                    <Activity className="w-5 h-5 text-white" />
                                </div>
                                {!sidebarCollapsed && (
                                    <motion.div 
                                        initial={{ opacity: 0 }} 
                                        animate={{ opacity: 1 }} 
                                        className="font-bold text-gray-900 text-lg tracking-tight"
                                    >
                                        Nexus<span className="text-indigo-600">UI</span>
                                    </motion.div>
                                )}
                            </div>
                        </SidebarHeader>
                        
                        <SidebarContent>
                            <SidebarGroup label="Platform">
                                <SidebarItem 
                                    icon={<Home className="w-5 h-5"/>} 
                                    label="控制台" 
                                    active={activeSidebarItem === 'home'}
                                    onClick={() => setActiveSidebarItem('home')}
                                />
                                <SidebarItem 
                                    icon={<Briefcase className="w-5 h-5"/>} 
                                    label="项目管理" 
                                    active={activeSidebarItem === 'projects'}
                                    onClick={() => setActiveSidebarItem('projects')}
                                    badge={<Badge variant="primary" className="!px-1.5 !py-0.5 !text-[10px]">3</Badge>}
                                />
                                <SidebarItem 
                                    icon={<Users className="w-5 h-5"/>} 
                                    label="团队成员" 
                                    active={activeSidebarItem === 'team'}
                                    onClick={() => setActiveSidebarItem('team')}
                                />
                            </SidebarGroup>
                            
                            <SidebarGroup label="Analytics">
                                <SidebarItem 
                                    icon={<BarChart3 className="w-5 h-5"/>} 
                                    label="数据报表" 
                                    active={activeSidebarItem === 'reports'}
                                    onClick={() => setActiveSidebarItem('reports')}
                                />
                                <SidebarItem 
                                    icon={<MessageSquare className="w-5 h-5"/>} 
                                    label="消息中心" 
                                    active={activeSidebarItem === 'messages'}
                                    onClick={() => setActiveSidebarItem('messages')}
                                    badge={<div className="w-2 h-2 bg-red-500 rounded-full" />}
                                />
                            </SidebarGroup>
                        </SidebarContent>
                        
                        <SidebarFooter>
                            <SidebarItem 
                                icon={<Settings className="w-5 h-5"/>} 
                                label="系统设置" 
                                active={activeSidebarItem === 'settings'}
                                onClick={() => setActiveSidebarItem('settings')}
                            />
                            <div className="h-px bg-gray-100 my-2 mx-1" />
                            <SidebarItem 
                                icon={<LogOut className="w-5 h-5 text-red-500"/>} 
                                label="退出登录" 
                                className="!text-red-600 hover:!bg-red-50"
                            />
                        </SidebarFooter>
                    </Sidebar>
                    
                    {/* Content Placeholder */}
                    <div className="flex-1 bg-white m-2 rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col items-center justify-center text-gray-400">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl mb-4 flex items-center justify-center">
                            <LayoutGrid className="w-8 h-8 text-gray-300" />
                        </div>
                        <p>主内容区域随侧边栏动态伸缩</p>
                    </div>
                </div>
            </section>

            {/* 2. Split Pane */}
            <section className="space-y-6">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">交互式分栏 (Resizable Split Pane)</h3>
                </div>
                <div className="h-[500px] w-full bg-gray-100 p-6 rounded-3xl border border-gray-200">
                    <SplitPane>
                        <div className="flex flex-col gap-2 p-4">
                            <div className="flex items-center justify-between mb-4 pl-2">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Inbox</span>
                                <span className="text-xs font-bold bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full">5</span>
                            </div>
                            {mailItems.map((mail) => (
                                <div key={mail.id} className={`p-4 rounded-xl cursor-pointer transition-all ${mail.active ? 'bg-primary-50 ring-1 ring-primary-200' : 'hover:bg-gray-50 bg-white border border-gray-100'}`}>
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className={`text-sm font-bold ${mail.active ? 'text-primary-900' : 'text-gray-900'}`}>{mail.sender}</h4>
                                        <span className="text-[10px] text-gray-400">{mail.time}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 truncate">{mail.subject}</p>
                                </div>
                            ))}
                        </div>
                        <div className="p-8 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Updates</h2>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">AK</div>
                                        <span className="text-sm text-gray-500">Alicia Keys &lt;alicia@example.com&gt;</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="secondary" isIconOnly><Star className="w-4 h-4"/></Button>
                                    <Button size="sm" variant="secondary" isIconOnly><Trash2 className="w-4 h-4"/></Button>
                                </div>
                            </div>
                            <div className="flex-1 text-gray-600 leading-relaxed text-sm space-y-4">
                                <p>Hey team,</p>
                                <p>Just wanted to share the latest progress on the Q4 roadmap. We are well ahead of schedule on the infrastructure migration.</p>
                                <p>Please review the attached documents and let me know if you have any questions.</p>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3 w-max mt-6">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-red-500">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-900">Q4_Report.pdf</span>
                                        <span className="text-xs text-gray-400">2.4 MB</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-auto pt-6 border-t border-gray-100">
                                <Button className="w-full" variant="secondary" leftIcon={<AlignLeft className="w-4 h-4"/>}>Reply</Button>
                            </div>
                        </div>
                    </SplitPane>
                </div>
            </section>

            {/* 3. Masonry Grid */}
            <section className="space-y-6">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-5 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">瀑布流布局 (Masonry Grid)</h3>
                </div>
                <div className="bg-gray-50/50 p-8 rounded-3xl border border-gray-100">
                    <Masonry 
                        items={masonryItems} 
                        columns={4} 
                        gap={24}
                        renderItem={(item, index) => (
                            <div 
                                className={`w-full rounded-2xl ${item.color} flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer transition-transform hover:-translate-y-2 duration-300`}
                                style={{ height: item.height }}
                            >
                                <span className="font-bold text-gray-900/50 text-xl z-10 mix-blend-multiply">{item.title}</span>
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="absolute bottom-4 right-4 text-xs font-mono text-gray-500/50">#{index + 1}</span>
                            </div>
                        )}
                    />
                </div>
            </section>

            {/* 4. Bento Grid */}
            <section className="space-y-6">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-5 bg-gradient-to-b from-orange-400 to-amber-500 rounded-full"></div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Bento 网格 (Bento Grid)</h3>
                </div>
                <BentoGrid>
                    <BentoItem colSpan={2} rowSpan={2} title="总览数据" className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white !border-none">
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                        <div className="absolute inset-0 p-8 flex flex-col justify-end">
                            <span className="text-5xl font-bold tracking-tighter mb-2">84.2%</span>
                            <span className="text-indigo-100 font-medium">系统整体健康度</span>
                        </div>
                        <div className="absolute top-0 right-0 p-8 opacity-20">
                            <Activity className="w-32 h-32" />
                        </div>
                    </BentoItem>
                    <BentoItem title="活跃设备">
                        <div className="h-full flex items-center justify-center pt-6">
                            <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                <Cpu className="w-10 h-10" />
                            </div>
                        </div>
                    </BentoItem>
                    <BentoItem title="待处理">
                        <div className="h-full flex items-center justify-center pt-6">
                            <span className="text-4xl font-bold text-gray-900">12</span>
                        </div>
                    </BentoItem>
                    <BentoItem colSpan={2} className="bg-gray-900 text-white !border-none">
                        <div className="h-full flex items-center justify-between p-8">
                            <div>
                                <h4 className="text-lg font-bold mb-1">暗黑模式预览</h4>
                                <p className="text-gray-400 text-sm">Dark mode ready</p>
                            </div>
                            <Switch checked={true} onChange={() => {}} className="pointer-events-none" />
                        </div>
                    </BentoItem>
                    <BentoItem colSpan={2} title="实时趋势">
                        <div className="absolute bottom-0 inset-x-0 h-32">
                             <RealTimeLineChart height={120} />
                        </div>
                    </BentoItem>
                </BentoGrid>
            </section>
        </motion.div>
      )}

      {activeTab === 'design' ? (
        <motion.div 
          key="design"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-10"
        >
          {/* Colors */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-6">品牌色系 (Brand Colors)</h3>
            <Card className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <ColorSwatch color="bg-primary-500" name="Indigo" shade="#6366f1" />
                <ColorSwatch color="bg-primary-600" name="Indigo Dark" shade="#4f46e5" />
                <ColorSwatch color="bg-gray-900" name="Slate Black" shade="#0f172a" />
                <ColorSwatch color="bg-red-500" name="Danger Red" shade="#ef4444" />
              </div>
            </Card>
          </section>

          {/* Typography */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-6">排版系统 (Typography)</h3>
            <Card className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-b border-gray-50 pb-6">
                <span className="text-xs text-gray-400 font-mono">Display / 4XL</span>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">大道至简，衍化至繁</h1>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-b border-gray-50 pb-6">
                <span className="text-xs text-gray-400 font-mono">Heading / 2XL</span>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">设计不仅仅是外观</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <span className="text-xs text-gray-400 font-mono">Body / Regular</span>
                <p className="text-base text-gray-600 leading-relaxed">
                  设计不只是关于它是如何看或者感觉起来的。设计是关于它是如何工作的。好的设计是显而易见的。伟大的设计是透明的。
                </p>
              </div>
            </Card>
          </section>
        </motion.div>
      ) : activeTab === 'components' ? (
        <motion.div 
          key="components"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col gap-10"
        >
          {/* SECTION: Carousel */}
          <section>
             <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-5 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">高保真轮播 (Physics Carousel)</h3>
             </div>
             <div id="tour-carousel">
                <Carousel slides={slides} />
             </div>
          </section>

          {/* SECTION: Tabs (NEW) */}
          <section className="space-y-8">
              <div className="flex items-center gap-2">
                  <div className="w-1 h-5 bg-gradient-to-b from-primary-600 to-indigo-600 rounded-full"></div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">标签页切换 (Tabs)</h3>
              </div>
              <Card className="p-10 space-y-12">
                  <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">分段式 (Segmented)</h4>
                      <Tabs 
                          activeId={activeTab1} 
                          onChange={setActiveTab1}
                          options={[
                              { id: 'list', label: '列表视图', icon: <List className="w-4 h-4" /> },
                              { id: 'grid', label: '网格视图', icon: <Grid className="w-4 h-4" /> },
                              { id: 'stats', label: '全景透视', icon: <BarChart3 className="w-4 h-4" /> }
                          ]}
                      />
                  </div>
                  <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">胶囊式 (Pills)</h4>
                      <Tabs 
                          variant="pills"
                          activeId={activeTab2} 
                          onChange={setActiveTab2}
                          options={[
                              { id: 'day', label: '今日' },
                              { id: 'week', label: '本周' },
                              { id: 'month', label: '本季度' }
                          ]}
                      />
                  </div>
                  <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">下划线式 (Underline)</h4>
                      <Tabs 
                          variant="underline"
                          activeId={activeTab3} 
                          onChange={setActiveTab3}
                          options={[
                              { id: 'profile', label: '我的资料' },
                              { id: 'security', label: '账号安全' },
                              { id: 'billing', label: '账单管理' },
                              { id: 'notifications', label: '通知设置' }
                          ]}
                      />
                  </div>
              </Card>
          </section>

          {/* SECTION: Message / Toast */}
          <section className="space-y-8">
             <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-indigo-500 to-blue-600 rounded-full"></div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">全局消息提示 (Message)</h3>
             </div>
             <Card className="p-8">
                <div className="flex flex-wrap gap-4 items-center">
                   <Button onClick={() => toast.success("操作成功！数据已同步至云端。")} variant="primary" leftIcon={<Check className="w-4 h-4"/>}>
                      Success
                   </Button>
                   <Button onClick={() => toast.error("连接失败，请检查网络设置。")} variant="danger" leftIcon={<AlertTriangle className="w-4 h-4"/>}>
                      Error
                   </Button>
                   <Button onClick={() => toast.warning("系统维护中，部分功能可能受限。")} variant="secondary" className="!text-amber-600 !bg-amber-50 hover:!bg-amber-100 border-amber-200" leftIcon={<AlertTriangle className="w-4 h-4"/>}>
                      Warning
                   </Button>
                   <Button onClick={() => toast.info("新的固件版本 v2.4.0 可用。")} variant="secondary" leftIcon={<MessageCircle className="w-4 h-4"/>}>
                      Info
                   </Button>
                   <Button 
                      onClick={() => toast.info(
                        <span className="flex items-center gap-2">
                           内容可以是 <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-1 rounded">VNode</span>
                           <a href="#" className="text-indigo-600 hover:underline ml-2">查看详情</a>
                        </span>
                      )} 
                      variant="ghost"
                   >
                      自定义 VNode
                   </Button>
                </div>
                <p className="text-xs text-gray-400 mt-6">
                   点击按钮触发全局 Toast 消息，体验 Framer Motion 的物理弹簧堆叠动画。
                </p>
             </Card>
          </section>

          {/* SECTION: Animated Input */}
          <section className="space-y-8">
             <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-pink-500 to-rose-600 rounded-full"></div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">动态输入框 (Animated Input)</h3>
             </div>
             <Card className="p-8" id="tour-animated-input">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">文字气泡 (Text Bubble)</h4>
                      <AnimatedInput 
                        value={animatedText}
                        onChange={setAnimatedText}
                        placeholder="Type something..."
                        icon={<Keyboard className="w-4 h-4" />}
                        label="搜索内容"
                        animationType="bubble"
                      />
                      <p className="text-xs text-gray-400 mt-2">字符输入时会有轻微的缩放弹跳效果。</p>
                   </div>
                   <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">数字滚动 (Number Ticker)</h4>
                      <AnimatedInput 
                        value={animatedNumber}
                        onChange={setAnimatedNumber}
                        placeholder="12345"
                        icon={<Hash className="w-4 h-4" />}
                        label="验证码 / 金额"
                        type="number"
                        animationType="ticker"
                      />
                      <p className="text-xs text-gray-400 mt-2">数字输入采用垂直滚动动画，模拟机械仪表。</p>
                   </div>
                </div>
             </Card>
          </section>

          {/* SECTION: Steps (NEW) */}
          <section className="space-y-8">
              <div className="flex items-center gap-2">
                  <div className="w-1 h-5 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">步骤条 (Stepper)</h3>
              </div>
              <Card className="p-8 pb-20"> 
                  <Steps 
                      currentStep={currentStep}
                      onChange={setCurrentStep}
                      steps={[
                          { title: '验证身份', description: '手机号/邮箱验证' },
                          { title: '填写信息', description: '完善基本资料' },
                          { title: '上传证件', description: '身份证/护照' },
                          { title: '等待审核', description: '预计 24h 内完成' },
                      ]}
                  />
                  
                  <div className="flex justify-between mt-16 pt-8 border-t border-gray-50">
                      <Button variant="secondary" disabled={currentStep === 0} onClick={() => setCurrentStep(p => p - 1)}>上一步</Button>
                      <Button disabled={currentStep === 3} onClick={() => setCurrentStep(p => p + 1)}>下一步</Button>
                  </div>
              </Card>
          </section>

          {/* SECTION: Tree View */}
          <section className="space-y-8">
             <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-emerald-500 to-green-600 rounded-full"></div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">树形控件多风格 (Tree Variants)</h3>
             </div>
             <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Variant 1: Default */}
                <Card className="p-6 h-[400px] flex flex-col">
                   <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-50">
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-gray-600">
                            <FolderGit2 className="w-3.5 h-3.5" />
                         </div>
                         <h4 className="font-bold text-gray-900 text-sm">Code Structure</h4>
                      </div>
                      <Badge variant="primary" className="!text-[10px] !px-1.5 !py-0">Default</Badge>
                   </div>
                   <div className="flex-1 overflow-y-auto custom-scrollbar">
                      <Tree 
                        data={treeData} 
                        selectedId={selectedTreeNode}
                        onSelect={(node) => setSelectedTreeNode(node.id)}
                        defaultExpandedIds={['root', 'src', 'components']}
                        variant="default"
                      />
                   </div>
                </Card>

                {/* Variant 2: Filesystem */}
                <Card className="p-6 h-[400px] flex flex-col bg-[#fafaf9]">
                   <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200/50">
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 bg-amber-100 rounded flex items-center justify-center text-amber-600">
                            <Folder className="w-3.5 h-3.5 fill-amber-400" />
                         </div>
                         <h4 className="font-bold text-gray-800 text-sm">File System</h4>
                      </div>
                      <Badge variant="warning" className="!text-[10px] !px-1.5 !py-0">Finder</Badge>
                   </div>
                   <div className="flex-1 overflow-y-auto custom-scrollbar">
                      <Tree 
                        data={treeData} 
                        selectedId={selectedFsNode}
                        onSelect={(node) => setSelectedFsNode(node.id)}
                        defaultExpandedIds={['root', 'src', 'components']}
                        variant="filesystem"
                      />
                   </div>
                </Card>

                {/* Variant 3: Navigation */}
                <Card className="p-0 h-[400px] flex flex-col overflow-hidden">
                   <div className="p-6 pb-4 border-b border-gray-50 bg-white">
                      <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <div className="w-6 h-6 bg-gray-900 rounded flex items-center justify-center text-white">
                                <Monitor className="w-3.5 h-3.5" />
                             </div>
                             <h4 className="font-bold text-gray-900 text-sm">Navigation</h4>
                          </div>
                          <Badge variant="neutral" className="!text-[10px] !px-1.5 !py-0">Sidebar</Badge>
                      </div>
                   </div>
                   <div className="flex-1 overflow-y-auto custom-scrollbar bg-white p-2">
                      <Tree 
                        data={navTreeData} 
                        selectedId={selectedNavNode}
                        onSelect={(node) => setSelectedNavNode(node.id)}
                        defaultExpandedIds={['overview', 'management']}
                        variant="navigation"
                      />
                   </div>
                </Card>

                {/* Variant 4: Time Series (NEW) */}
                <Card className="p-6 h-[400px] flex flex-col bg-white ring-1 ring-gray-100 shadow-xl shadow-indigo-100/20">
                   <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 bg-indigo-50 rounded flex items-center justify-center text-indigo-600">
                            <Database className="w-3.5 h-3.5" />
                         </div>
                         <h4 className="font-bold text-gray-900 text-sm">Time Series</h4>
                      </div>
                      <Badge variant="primary" className="!text-[10px] !px-1.5 !py-0 bg-indigo-100 text-indigo-700">IoT</Badge>
                   </div>
                   <div className="flex-1 overflow-y-auto custom-scrollbar">
                      <Tree 
                        data={timeSeriesData} 
                        selectedId={selectedTsNode}
                        onSelect={(node) => setSelectedTsNode(node.id)}
                        defaultExpandedIds={['root-cluster', 'group-us-east', 'device-001']}
                        variant="timeseries"
                      />
                   </div>
                </Card>
             </div>
          </section>

          {/* ... Remaining Sections (Gauges, Charts, Progress, Tables, Cards, Transitions, Modals) ... */}
          {/* SECTION: Gauges */}
          <section className="space-y-8">
             <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-primary-500 to-indigo-600 rounded-full"></div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">仪表盘 (Gauge & Instrument)</h3>
             </div>
             
             <Card className="p-8">
                 <div className="mb-12 bg-gray-50 p-6 rounded-2xl border border-gray-100 max-w-2xl mx-auto">
                    <div className="flex justify-between mb-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-bold text-gray-900">模拟信号输入</label>
                            <span className="text-xs text-gray-400">调整输入值以观察仪表响应</span>
                        </div>
                        <span className="text-xl font-mono font-bold text-primary-600">{Math.round(gaugeValue)}</span>
                    </div>
                    <Slider value={gaugeValue} onChange={setGaugeValue} showTooltip />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-items-center">
                     <div className="flex flex-col items-center gap-4">
                         <SimpleGauge value={gaugeValue} label="Memory" unit="%" size={220} />
                         <span className="text-xs font-bold text-gray-400 font-mono">Simple Arc</span>
                     </div>
                     <div className="flex flex-col items-center gap-4">
                         <SpeedometerGauge value={gaugeValue} label="Network" unit="MB/s" size={260} />
                         <span className="text-xs font-bold text-gray-400 font-mono">Speedometer</span>
                     </div>
                     <div className="flex flex-col items-center gap-4">
                         <RingStackGauge 
                             size={220}
                             rings={[
                                 { value: gaugeValue, color: '#6366f1', label: 'CPU' },
                                 { value: Math.max(0, gaugeValue - 20), color: '#a855f7', label: 'RAM' },
                                 { value: Math.max(0, gaugeValue - 45), color: '#10b981', label: 'GPU' },
                             ]} 
                         />
                         <span className="text-xs font-bold text-gray-400 font-mono">Multi-Ring</span>
                     </div>
                 </div>
             </Card>
          </section>

          {/* SECTION: Charts */}
          <section className="space-y-8">
            <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-violet-500 to-fuchsia-500 rounded-full"></div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">数据可视化 (Data Visualization)</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <Card className="lg:col-span-2 p-6">
                 <div className="flex items-center justify-between mb-6">
                   <h4 className="font-bold text-gray-900">流量趋势 (Smooth Area)</h4>
                   <RefreshButton onClick={() => refreshChart('area')} id={chartKeys.area} />
                 </div>
                 <SmoothAreaChart key={chartKeys.area} height={320} />
               </Card>
               <Card className="lg:col-span-1 p-6">
                 <div className="flex items-center justify-between mb-6">
                   <h4 className="font-bold text-gray-900">核心指标 (Radial)</h4>
                   <div className="flex items-center gap-2">
                       <Badge variant="success">Good</Badge>
                       <RefreshButton onClick={() => refreshChart('radial')} id={chartKeys.radial} />
                   </div>
                 </div>
                 <RadialProgressChart key={chartKeys.radial} height={320} />
               </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <Card className="p-6">
                 <div className="flex items-center justify-between mb-6">
                   <h4 className="font-bold text-gray-900">双期对比 (Line Comparison)</h4>
                   <div className="flex items-center gap-3">
                        <div className="flex gap-2">
                            <div className="flex items-center gap-1.5 text-xs text-gray-500"><div className="w-2 h-2 rounded-full bg-indigo-500"/>本周</div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 bg-gray-50 px-1 rounded"><div className="w-2 h-2 rounded-full bg-gray-300"/>上周</div>
                        </div>
                        <RefreshButton onClick={() => refreshChart('lineComp')} id={chartKeys.lineComp} />
                   </div>
                 </div>
                 <LineComparisonChart key={chartKeys.lineComp} />
               </Card>
               <Card className="p-6">
                 <div className="flex items-center justify-between mb-6">
                   <h4 className="font-bold text-gray-900">组合分析 (Composed)</h4>
                   <div className="flex items-center gap-3">
                       <div className="flex gap-2">
                            <div className="flex items-center gap-1.5 text-xs text-gray-500"><div className="w-2 h-2 rounded-sm bg-indigo-100"/>量</div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500"><div className="w-2 h-2 rounded-full bg-indigo-500"/>率</div>
                       </div>
                       <RefreshButton onClick={() => refreshChart('composed')} id={chartKeys.composed} />
                   </div>
                 </div>
                 <ComposedAnalyticsChart key={chartKeys.composed} />
               </Card>
            </div>

            <div className="grid grid-cols-1">
               <Card className="p-6">
                 <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-3">
                       <div className="relative">
                           <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping absolute inline-flex opacity-75"></span>
                           <span className="w-2.5 h-2.5 bg-green-500 rounded-full relative inline-flex"></span>
                       </div>
                       <h4 className="font-bold text-gray-900">实时负载监控 (Real-time Stream)</h4>
                   </div>
                   <RefreshButton onClick={() => refreshChart('realtime')} id={chartKeys.realtime} />
                 </div>
                 <RealTimeLineChart key={chartKeys.realtime} height={350} />
               </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <Card className="p-6">
                 <div className="flex items-center justify-between mb-6">
                   <h4 className="font-bold text-gray-900">月度营收 (Spotlight)</h4>
                   <div className="flex items-center gap-2">
                       <Badge variant="success">+12.5%</Badge>
                       <RefreshButton onClick={() => refreshChart('bar')} id={chartKeys.bar} />
                   </div>
                 </div>
                 <RoundedBarChart key={chartKeys.bar} />
               </Card>
               <Card className="p-6">
                 <div className="flex items-center justify-between mb-6">
                   <h4 className="font-bold text-gray-900">终端分布 (Donut)</h4>
                   <RefreshButton onClick={() => refreshChart('donut')} id={chartKeys.donut} />
                 </div>
                 <InteractiveDonutChart key={chartKeys.donut} />
               </Card>
               <Card className="p-6">
                 <div className="flex items-center justify-between mb-6">
                   <h4 className="font-bold text-gray-900">健康画像 (Radar)</h4>
                   <RefreshButton onClick={() => refreshChart('radar')} id={chartKeys.radar} />
                 </div>
                 <HexRadarChart key={chartKeys.radar} />
               </Card>
            </div>
          </section>

          {/* SECTION: Progress & Sliders */}
          <section className="space-y-8">
            <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-fuchsia-500 to-pink-500 rounded-full"></div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">进度指示 (Progress & State)</h3>
            </div>
            
            <Card className="p-8">
                <div className="mb-12 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <div className="flex justify-between mb-4">
                    <div className="flex flex-col">
                        <label className="text-sm font-bold text-gray-900">动态演示控制器</label>
                        <span className="text-xs text-gray-400">拖动滑块查看物理动画效果</span>
                    </div>
                    <span className="text-xl font-mono font-bold text-primary-600">{Math.round(progressValue)}%</span>
                  </div>
                  <Slider value={progressValue} onChange={setProgressValue} showTooltip />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div className="space-y-10">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">线性进度条 (Linear)</h4>
                    <div className="space-y-2">
                         <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">基础样式</span>
                         </div>
                         <ProgressBar value={progressValue} showValue />
                    </div>
                    <div className="space-y-2">
                         <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">渐变流光 (Premium)</span>
                         </div>
                         <ProgressBar value={progressValue} variant="gradient" size="lg" />
                    </div>
                    <div className="space-y-2">
                         <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">动态条纹 (Active)</span>
                         </div>
                         <ProgressBar value={progressValue} variant="success" size="md" striped animated showValue />
                    </div>
                    <div className="grid grid-cols-2 gap-6 pt-4">
                       <div className="space-y-2">
                           <span className="text-xs text-gray-500">Warning State</span>
                           <ProgressBar value={75} variant="warning" size="sm" />
                       </div>
                       <div className="space-y-2">
                           <span className="text-xs text-gray-500">Error State</span>
                           <ProgressBar value={30} variant="error" size="sm" />
                       </div>
                    </div>
                  </div>

                  <div className="space-y-10">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">环形进度 (Circular)</h4>
                    <div className="flex items-end justify-around gap-8 flex-wrap py-4">
                      <div className="flex flex-col items-center gap-3">
                         <ProgressBar type="circular" value={progressValue} size="sm" showValue />
                         <span className="text-xs text-gray-400 font-mono">Small</span>
                      </div>
                      <div className="flex flex-col items-center gap-3">
                         <ProgressBar type="circular" value={progressValue} size="md" showValue label="Gradient" variant="gradient" />
                         <span className="text-xs text-gray-400 font-mono">Medium</span>
                      </div>
                      <div className="flex flex-col items-center gap-3">
                         <ProgressBar type="circular" value={progressValue} size="lg" showValue label="Storage" variant="success" />
                         <span className="text-xs text-gray-400 font-mono">Large</span>
                      </div>
                    </div>
                  </div>
                </div>
            </Card>
          </section>

          {/* SECTION: Data Table */}
          <section className="relative">
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-5 bg-gradient-to-b from-gray-700 to-gray-500 rounded-full"></div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">数据表格 (Data Table)</h3>
                </div>
                <div className="flex gap-2">
                   <Button size="sm" variant="secondary" leftIcon={<Filter className="w-4 h-4" />}>筛选</Button>
                   <Button size="sm" variant="secondary" leftIcon={<Download className="w-4 h-4" />}>导出</Button>
                </div>
             </div>
             
             <div className="relative">
                 <TableContainer>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                           <div className="flex items-center justify-center">
                              <Checkbox 
                                label="" 
                                checked={isAllSelected}
                                onChange={toggleAll} 
                              />
                           </div>
                        </TableHead>
                        <TableHead>Device Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Load</TableHead>
                        <TableHead>Users</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentTableData.map((row, index) => {
                        const isSelected = selectedRows.has(row.id);
                        return (
                        <TableRow 
                            key={row.id} 
                            index={index} 
                            onClick={() => toggleRow(row.id)}
                        >
                          <TableCell className="w-[50px]">
                              <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                                  <Checkbox 
                                    label="" 
                                    checked={isSelected}
                                    onChange={() => toggleRow(row.id)}
                                  />
                              </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                 isSelected ? 'bg-primary-100 text-primary-600' :
                                 row.type === 'Switch' ? 'bg-blue-50 text-blue-600' :
                                 row.type === 'Server' ? 'bg-purple-50 text-purple-600' :
                                 row.type === 'Gateway' ? 'bg-orange-50 text-orange-600' :
                                 'bg-emerald-50 text-emerald-600'
                              }`}>
                                <Database className="w-5 h-5" />
                              </div>
                              <div>
                                 <p className={`font-bold transition-colors ${isSelected ? 'text-primary-700' : 'text-gray-900'}`}>{row.name}</p>
                                 <p className="text-xs text-gray-400">{row.region}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              row.status === 'online' ? 'success' : 
                              row.status === 'maintenance' ? 'warning' : 
                              row.status === 'error' ? 'error' : 'neutral'
                            }>
                              {row.status}
                            </Badge>
                          </TableCell>
                          <TableCell><span className="font-mono text-sm text-gray-500">{row.type}</span></TableCell>
                          <TableCell>
                             <div className="w-32">
                               <div className="flex justify-between text-xs mb-1.5">
                                 <span className="font-medium text-gray-700">{row.usage}%</span>
                               </div>
                               <ProgressBar 
                                 value={row.usage} 
                                 size="sm" 
                                 variant={row.usage > 80 ? 'error' : row.usage > 50 ? 'primary' : 'success'} 
                                 className="opacity-90"
                               />
                             </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex -space-x-2.5">
                              {row.users.map((u, i) => (
                                <div key={i} className="w-8 h-8 rounded-full border-[2px] border-white bg-gray-100 flex items-center justify-center text-[10px] text-gray-500 font-bold overflow-hidden transition-transform hover:-translate-y-1 hover:z-10 relative">
                                   <img src={`https://ui-avatars.com/api/?name=U+${u}&background=random&color=fff`} alt="user" />
                                </div>
                              ))}
                              <div className="w-8 h-8 rounded-full border-[2px] border-white bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-400 hover:bg-gray-100 cursor-pointer">
                                +
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                             <Button variant="ghost" isIconOnly size="sm" onClick={(e) => e.stopPropagation()}>
                               <MoreHorizontal className="w-4 h-4 text-gray-400" />
                             </Button>
                          </TableCell>
                        </TableRow>
                      )})}
                    </TableBody>
                 </TableContainer>

                 <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 px-2">
                    <p className="text-sm text-gray-500 order-2 sm:order-1">
                        Showing <span className="font-bold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-gray-900">{Math.min(currentPage * itemsPerPage, fullTableData.length)}</span> of <span className="font-bold text-gray-900">{fullTableData.length}</span> results
                    </p>
                    <div className="order-1 sm:order-2">
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            showJumpTo
                            onPageChange={(p) => {
                                setCurrentPage(p);
                                setSelectedRows(new Set());
                            }}
                        />
                    </div>
                 </div>
                 
                 <AnimatePresence>
                    {selectedRows.size > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.9 }}
                            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-2xl shadow-indigo-500/30 flex items-center gap-6 border border-white/10"
                        >
                            <div className="flex items-center gap-3 pr-6 border-r border-gray-700">
                                <div className="bg-primary-500 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                                    {selectedRows.size}
                                </div>
                                <span className="text-sm font-medium">Items Selected</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button size="sm" variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
                                    <Share2 className="w-4 h-4 mr-2" /> Share
                                </Button>
                                <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                                </Button>
                            </div>
                        </motion.div>
                    )}
                 </AnimatePresence>
             </div>
          </section>

          {/* SECTION: 3D Interactive Cards */}
          <section>
             <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-5 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">3D 视差卡片 (Parallax)</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <InteractiveCard 
                  title="智能中控"
                  subtitle="集成灯光、温度与安防系统的自动化场景联动中心。"
                  icon={<Zap className="w-7 h-7" />}
                  gradient="from-amber-400 to-orange-500"
                />
                <InteractiveCard 
                  title="数据引擎"
                  subtitle="基于 AI 的海量时序数据处理，提供毫秒级查询响应。"
                  icon={<BarChart3 className="w-7 h-7" />}
                  gradient="from-blue-500 to-cyan-400"
                />
                 <InteractiveCard 
                  title="边缘计算"
                  subtitle="分布式节点状态监控，支持远程 OTA 固件升级。"
                  icon={<Cpu className="w-7 h-7" />}
                  gradient="from-purple-500 to-pink-500"
                />
             </div>
          </section>

          {/* SECTION: Advanced Cards */}
          <section>
             <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-teal-400 rounded-full"></div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">高级质感卡片 (Advanced Styles)</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <MeshCard 
                    title="流量增长"
                    subtitle="基于深度学习的流量预测模型，精准度高达 99.8%。"
                    icon={TrendingUp}
                    color="purple"
                />
                <DarkCard />
                <GlassCard />
             </div>
          </section>

          {/* SECTION: Transition Showcase */}
          <section className="space-y-8">
            <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-teal-400 to-emerald-500 rounded-full"></div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">动画与过渡 (Transitions)</h3>
            </div>

            <Card className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    
                    {/* 1. Shared Layout Animation */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">共享布局 (Shared Layout)</h4>
                        <div className="bg-gray-100/50 p-1.5 rounded-xl flex relative isolate">
                            {['Overview', 'Integrations', 'Settings'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setTransitionTab(tab)}
                                    type="button"
                                    className={`
                                        relative flex-1 py-2 text-sm font-medium transition-colors duration-200 z-10
                                        ${transitionTab === tab ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}
                                    `}
                                >
                                    {transitionTab === tab && (
                                        <motion.div
                                            layoutId="active-pill-demo"
                                            className="absolute inset-0 bg-white shadow-sm rounded-lg -z-10"
                                            transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                        />
                                    )}
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            利用 <code className="font-mono text-indigo-500">layoutId</code> 实现组件间平滑的形态变换，常用于导航栏或分段控制器。
                        </p>
                    </div>

                    {/* 2. Staggered Entrance */}
                    <div className="space-y-4">
                         <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">交错入场 (Stagger)</h4>
                            <Button size="sm" variant="ghost" isIconOnly onClick={() => { setShowList(false); setTimeout(() => setShowList(true), 100); }}>
                                <RefreshCw className="w-3.5 h-3.5" />
                            </Button>
                         </div>
                         <div className="h-32 bg-gray-50/50 rounded-xl p-3 overflow-hidden flex flex-col gap-2 border border-gray-100">
                            <AnimatePresence>
                                {showList && [1, 2, 3].map((i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20, filter: 'blur(5px)' }}
                                        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                        exit={{ opacity: 0, x: 20, filter: 'blur(5px)' }}
                                        transition={{ delay: i * 0.08, type: "spring", stiffness: 300, damping: 24 }}
                                        className="h-8 bg-white rounded-lg border border-gray-100/50 shadow-sm flex items-center px-3 text-xs text-gray-600 font-medium"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-2.5" />
                                        System Module 0{i} Loaded
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                         </div>
                    </div>

                    {/* 3. Content Slide (AnimatePresence Mode) */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">视图切换 (Slide Mode)</h4>
                            <div className="flex gap-1">
                                <button onClick={() => setStep(s => Math.max(1, s-1))} className="p-1 hover:bg-gray-100 rounded text-gray-500"><ChevronLeft className="w-4 h-4"/></button>
                                <button onClick={() => setStep(s => Math.min(3, s+1))} className="p-1 hover:bg-gray-100 rounded text-gray-500"><ChevronRight className="w-4 h-4"/></button>
                            </div>
                        </div>
                        <div className="h-32 bg-indigo-50/30 rounded-xl border border-indigo-100/50 relative overflow-hidden flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={step}
                                    initial={{ y: 15, opacity: 0, scale: 0.95 }}
                                    animate={{ y: 0, opacity: 1, scale: 1 }}
                                    exit={{ y: -15, opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                    className="absolute flex flex-col items-center justify-center text-indigo-900"
                                >
                                    <span className="text-5xl font-bold opacity-10 absolute select-none">{step}</span>
                                    <span className="font-bold relative z-10 text-sm">Step {step} Content</span>
                                    <p className="text-[10px] text-indigo-400 mt-1">Wait 模式确保平滑过渡</p>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                     {/* 4. Layout Expansion */}
                     <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">尺寸膨胀 (Layout Expand)</h4>
                        <div className="h-32 flex items-center justify-center bg-gray-50/50 rounded-xl border border-gray-100">
                            <motion.div
                                layout
                                onClick={() => setIsExpanded(!isExpanded)}
                                className={`bg-white shadow-xl shadow-indigo-100 rounded-2xl cursor-pointer overflow-hidden flex flex-col border border-gray-100 relative ${isExpanded ? 'w-64 h-24' : 'w-20 h-20 items-center justify-center'}`}
                                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                            >
                                 <motion.div layout="position" className={`flex items-center gap-3 ${isExpanded ? 'p-4' : 'p-0'}`}>
                                    <motion.div layout className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 shrink-0 shadow-md" />
                                    {isExpanded && (
                                        <motion.div 
                                            initial={{ opacity: 0, x: -10 }} 
                                            animate={{ opacity: 1, x: 0 }} 
                                            transition={{ delay: 0.1 }}
                                            className="flex flex-col min-w-0"
                                        >
                                            <span className="font-bold text-gray-900 text-sm">Magic Card</span>
                                            <span className="text-xs text-gray-500 truncate">Click to collapse</span>
                                        </motion.div>
                                    )}
                                 </motion.div>
                                 {!isExpanded && (
                                     <motion.div 
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="absolute inset-0 flex items-center justify-center"
                                     >
                                         <Plus className="w-5 h-5 text-gray-400" />
                                     </motion.div>
                                 )}
                                 {isExpanded && (
                                     <motion.p 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-[10px] text-gray-400 px-4 pb-2"
                                     >
                                        Framer Motion 自动处理高度与宽度的补间动画，无需复杂的 CSS Transition。
                                     </motion.p>
                                 )}
                            </motion.div>
                        </div>
                    </div>

                </div>
            </Card>
        </section>

          {/* SECTION: Modal Variants */}
          <section>
             <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-5 bg-gradient-to-b from-rose-500 to-orange-400 rounded-full"></div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">多样的弹窗风格 (Modal Variants)</h3>
             </div>
             <Card className="p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
                   <div 
                      onClick={(e) => handleOpenModal('success', e)}
                      className="group cursor-pointer rounded-2xl border border-gray-100 p-6 flex flex-col items-center justify-center gap-4 hover:border-green-200 hover:bg-green-50/50 transition-all bg-white"
                   >
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                         <Check className="w-6 h-6" />
                      </div>
                      <span className="font-bold text-gray-900">成功反馈</span>
                   </div>

                   <div 
                      onClick={(e) => handleOpenModal('danger', e)}
                      className="group cursor-pointer rounded-2xl border border-gray-100 p-6 flex flex-col items-center justify-center gap-4 hover:border-red-200 hover:bg-red-50/50 transition-all bg-white"
                   >
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
                         <Trash2 className="w-6 h-6" />
                      </div>
                      <span className="font-bold text-gray-900">危险操作</span>
                   </div>

                   <div 
                      onClick={(e) => handleOpenModal('pro', e)}
                      className="group cursor-pointer rounded-2xl border border-gray-100 p-6 flex flex-col items-center justify-center gap-4 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all bg-white"
                   >
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                         <Crown className="w-6 h-6" />
                      </div>
                      <span className="font-bold text-gray-900">营销推广</span>
                   </div>

                   <div 
                      onClick={(e) => handleOpenModal('form', e)}
                      className="group cursor-pointer rounded-2xl border border-gray-100 p-6 flex flex-col items-center justify-center gap-4 hover:border-blue-200 hover:bg-blue-50/50 transition-all bg-white"
                   >
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                         <List className="w-6 h-6" />
                      </div>
                      <span className="font-bold text-gray-900">表单录入</span>
                   </div>

                   {/* Glass Modal Trigger */}
                   <div 
                      onClick={handleOpenGlassModal}
                      className="group cursor-pointer rounded-2xl border border-gray-100 p-6 flex flex-col items-center justify-center gap-4 hover:border-cyan-300 hover:bg-cyan-50/50 transition-all bg-white"
                   >
                      <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 group-hover:scale-110 transition-transform">
                         <Droplets className="w-6 h-6" />
                      </div>
                      <span className="font-bold text-gray-900">毛玻璃态</span>
                   </div>

                   {/* Liquid Modal Trigger */}
                   <div 
                      onClick={handleOpenLiquidModal}
                      className="group cursor-pointer rounded-2xl border border-gray-100 p-6 flex flex-col items-center justify-center gap-4 hover:border-purple-300 hover:bg-purple-50/50 transition-all bg-white"
                   >
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                         <Waves className="w-6 h-6" />
                      </div>
                      <span className="font-bold text-gray-900">液态流体</span>
                   </div>
                </div>
             </Card>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT COLUMN */}
            <div className="space-y-8">
              {/* Buttons */}
              <Card className="p-8">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">按钮 (Buttons)</h3>
                <div className="flex flex-wrap gap-4 mb-6">
                  <Button>主要按钮</Button>
                  <Button variant="secondary">次要按钮</Button>
                  <Button variant="ghost">幽灵按钮</Button>
                  <Button variant="danger">危险操作</Button>
                </div>
                <div className="flex flex-wrap items-center gap-4 border-t border-gray-50 pt-6">
                  <Button size="sm">小尺寸</Button>
                  <Button isLoading>加载中</Button>
                  <Button isIconOnly shape="circle" leftIcon={<Plus className="w-5 h-5"/>} />
                </div>
              </Card>

              {/* Selection Controls */}
              <Card className="p-8">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">选择控件 (Selection Controls)</h3>
                <div className="space-y-8">
                  <Radio 
                      label="单选框组"
                      name="demo-radio"
                      value={radioValue}
                      onChange={setRadioValue}
                      options={[
                        { value: 'fast', label: '高性能模式', description: '优先保证响应速度' },
                        { value: 'balanced', label: '均衡模式', description: '自动调节资源占用' }
                      ]}
                  />
                  <div className="h-px bg-gray-50" />
                  <div className="flex items-center justify-between">
                      <Checkbox 
                        label="启用自动备份" 
                        description="每日凌晨2点执行"
                        checked={checkboxState} 
                        onChange={setCheckboxState} 
                      />
                  </div>
                  <div className="h-px bg-gray-50" />
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">系统通知</span>
                      <span className="text-xs text-gray-400">接收实时推送消息</span>
                    </div>
                    <Switch checked={switchState} onChange={setSwitchState} />
                  </div>
                </div>
              </Card>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-8">
              {/* Date & Time Picker */}
              <Card className="p-0 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100 bg-white">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">日期与时间 (Date & Time)</h3>
                </div>
                <div className="p-8 bg-gray-50/50 flex flex-col gap-10">
                  {/* Calendar */}
                  <div className="flex flex-col gap-5 items-center">
                      <div className="flex items-center gap-2.5 self-start w-full border-b border-gray-200/60 pb-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <CalendarIcon className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-gray-900">日历选择</span>
                      </div>
                      <Calendar value={date} onChange={setDate} className="shadow-xl shadow-indigo-500/5 border-gray-100/50" />
                  </div>
                  
                  {/* DateRangePicker */}
                  <div className="flex flex-col gap-5 items-center">
                      <div className="flex items-center gap-2.5 self-start w-full border-b border-gray-200/60 pb-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                          <CalendarRange className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-gray-900">日期范围</span>
                      </div>
                      <DateRangePicker value={dateRange} onChange={setDateRange} className="shadow-xl shadow-indigo-500/5 border-gray-100/50" />
                  </div>
                </div>
              </Card>

              {/* Upload Component */}
              <Card className="p-8">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">文件上传 (Upload)</h3>
                <Upload multiple maxSize={2 * 1024 * 1024} accept=".png,.jpg,.pdf" />
              </Card>
            </div>
          </div>
        </motion.div>
      ) : null}

      {/* Shared Standard Modal Instance */}
      <Modal
        isOpen={!!activeModal}
        onClose={closeModal}
        title={modalProps.title}
        triggerRect={triggerRect}
        footer={modalProps.footer}
        className={modalProps.className}
      >
        {renderModalContent()}
      </Modal>

      {/* New Glass Modal Instance */}
      <GlassModal
        isOpen={isGlassModalOpen}
        onClose={closeGlassModal}
        title="iOS 16 Glass"
        triggerRect={triggerRect}
        footer={
           <div className="flex justify-end gap-3">
              <Button variant="ghost" size="sm" onClick={closeGlassModal} className="text-gray-600 hover:bg-black/5">取消</Button>
              <Button size="sm" onClick={closeGlassModal} className="bg-black/80 hover:bg-black text-white border-none shadow-lg">确认操作</Button>
           </div>
        }
      >
        <div className="space-y-4">
           <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 mb-2">
               <Droplets className="w-8 h-8 text-white" />
           </div>
           <h4 className="text-xl font-bold text-gray-900">极致通透感</h4>
           <p className="text-gray-600 leading-relaxed">
              该组件采用了 <code className="bg-black/5 px-1 rounded text-sm font-mono">backdrop-blur-xl</code> 与 <code className="bg-black/5 px-1 rounded text-sm font-mono">saturate-150</code> 混合滤镜，模拟了真实的磨砂玻璃物理光学特性。
           </p>
           <div className="p-4 rounded-xl bg-white/40 border border-white/40 text-sm text-gray-500 backdrop-blur-sm">
              <p>即使在复杂的背景上，也能保持极高的可读性与视觉层级。</p>
           </div>
        </div>
      </GlassModal>

      {/* New Liquid Modal Instance */}
      <LiquidModal
        isOpen={isLiquidModalOpen}
        onClose={closeLiquidModal}
        title="Liquid Fluid"
        triggerRect={triggerRect}
        footer={
           <div className="flex justify-end gap-3">
              <Button variant="ghost" size="sm" onClick={closeLiquidModal} className="text-gray-700 hover:bg-white/30">取消</Button>
              <Button size="sm" onClick={closeLiquidModal} className="bg-white/80 hover:bg-white text-indigo-900 border-none shadow-lg backdrop-blur-md">确定</Button>
           </div>
        }
      >
        <div className="space-y-4 relative z-10">
           <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 mb-2">
               <Waves className="w-8 h-8 text-white" />
           </div>
           <h4 className="text-xl font-bold text-gray-900">动态流体光效</h4>
           <p className="text-gray-700 leading-relaxed font-medium">
              背景中集成了实时演算的 <span className="text-indigo-600 font-bold">流体光斑</span> 动画。
           </p>
           <div className="p-4 rounded-xl bg-white/30 border border-white/40 text-sm text-gray-800 backdrop-blur-md shadow-inner">
              <p>通过混合模式 (Mix-blend-mode) 与多层高斯模糊，实现了类似于液体在容器中流动的视觉质感，充满科技生命力。</p>
           </div>
        </div>
      </LiquidModal>
    </div>
  );
};

export default UILibrary;
