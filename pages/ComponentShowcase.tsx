
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import Switch from '../components/ui/Switch';
import Modal from '../components/ui/Modal';
import Radio from '../components/ui/Radio';
import Checkbox from '../components/ui/Checkbox';
import Link from '../components/ui/Link';
import Tabs from '../components/ui/Tabs';
import { 
  Plus, Settings, Trash2, Search, Info, 
  Send, Bell, ChevronRight,
  List, Grid, BarChart3,
  Maximize2, MousePointer2, ExternalLink, Github, ArrowUpRight,
  Shield, Zap, Globe, Cpu
} from 'lucide-react';

const ComponentShowcase: React.FC = () => {
  const [selectValue, setSelectValue] = useState('1');
  const [modalOpen, setModalOpen] = useState(false);
  const [radioValue, setRadioValue] = useState('fast');
  const [activeTab1, setActiveTab1] = useState('list');
  const [activeTab2, setActiveTab2] = useState('day');
  
  const [checkStates, setCheckStates] = useState({
    logs: true,
    alerts: false,
    backup: true
  });

  const [switchStates, setSwitchStates] = useState({
    notifications: true,
    darkMode: false,
    analytics: true,
    gpu: true
  });

  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);

  const handleOpenModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    setTriggerRect(e.currentTarget.getBoundingClientRect());
    setModalOpen(true);
  };

  return (
    <div className="space-y-16 pb-24 relative z-0">
      <motion.header 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl"
      >
        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">组件库预览</h2>
        <p className="text-lg text-gray-500 mt-4 leading-relaxed">
          一套基于现代美学打造的高端 UI 组件系统，深度集成了 iOS 风格的物理动力学反馈与 Indigo 品牌视觉语言。
        </p>
      </motion.header>

      {/* 按钮系统专区 */}
      <section className="space-y-8">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
          <div className="w-2 h-8 bg-primary-600 rounded-full"></div>
          按钮系统 (Buttons)
        </h3>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <Card className="p-8">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">色彩与变体</h4>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">主要操作</Button>
              <Button variant="secondary">次要按钮</Button>
              <Button variant="ghost">幽灵样式</Button>
              <Button variant="danger">危险操作</Button>
            </div>
          </Card>
          <Card className="p-8">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">形态与尺寸</h4>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button isIconOnly shape="circle" leftIcon={<Zap className="w-4 h-4" />} />
              <Button size="lg" shape="square" leftIcon={<Plus className="w-5 h-5" />}>大尺寸</Button>
            </div>
          </Card>
          <Card className="p-8">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">交互状态</h4>
            <div className="flex flex-wrap gap-4">
              <Button isLoading>加载中</Button>
              <Button disabled>禁用状态</Button>
              <Button variant="secondary" isLoading isIconOnly shape="circle" />
            </div>
          </Card>
        </div>
      </section>

      {/* 弹窗动效测试 */}
      <section className="space-y-8">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
          <div className="w-2 h-8 bg-primary-600 rounded-full"></div>
          弹窗反馈 (Modals)
        </h3>
        {/* 修复：移除 bg-indigo-50/30 背景，改用白色，避免被误认为是“紫色遮罩”错误 */}
        <Card className="p-10 bg-white border-dashed border-gray-200 shadow-none">
           <div className="flex flex-col md:flex-row justify-center gap-8">
             <Button variant="secondary" onClick={handleOpenModal} leftIcon={<MousePointer2 className="w-4 h-4" />}>
               左侧起源点弹出
             </Button>
             <Button variant="primary" onClick={handleOpenModal} className="px-12">
               中央弹出
             </Button>
             <Button variant="danger" onClick={handleOpenModal} rightIcon={<Maximize2 className="w-4 h-4" />}>
               右侧起源点弹出
             </Button>
           </div>
           <p className="text-center text-xs text-gray-400 mt-8">点击不同位置，观察弹窗飞出的动态轨迹。</p>
        </Card>
      </section>

      {/* 开关与选择专区 */}
      <section className="space-y-8">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
          <div className="w-2 h-8 bg-primary-600 rounded-full"></div>
          开关切换 (Switches)
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-10">
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-10">系统全局偏好</h4>
            <div className="space-y-10">
               <Switch 
                 checked={switchStates.notifications} 
                 onChange={(v) => setSwitchStates({...switchStates, notifications: v})} 
                 label="实时报警通知"
                 description="核心设备异常时将触发短信与邮件推送"
               />
               <div className="h-px bg-gray-50 w-full" />
               <Switch 
                 checked={switchStates.darkMode} 
                 onChange={(v) => setSwitchStates({...switchStates, darkMode: v})} 
                 label="夜间护眼模式"
                 description="自动检测系统时间开启深色视觉主题"
               />
               <div className="h-px bg-gray-50 w-full" />
               <Switch 
                 disabled
                 checked={true} 
                 onChange={() => {}} 
                 label="物理防火墙 (已锁定)"
                 description="出于安全策略，此项功能当前不可更改"
               />
            </div>
          </Card>

          <div className="flex flex-col gap-6">
             <Card className="bg-[#0f172a] border-none shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative z-10 p-10">
                  <h4 className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] mb-10">渲染控制单元</h4>
                  <Switch 
                    checked={switchStates.gpu} 
                    onChange={(v) => setSwitchStates({...switchStates, gpu: v})} 
                    label="GPU 硬解加速"
                    description="提升百万级时序数据渲染的帧率至 144FPS"
                    className="[&_span]:text-white [&_.text-gray-400]:text-white/30"
                  />
                  <div className="mt-10 p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <p className="text-xs text-indigo-200/50 leading-relaxed">
                      该功能利用硬件加速技术大幅减少主处理器负载，建议在高性能工作站环境下启用。
                    </p>
                  </div>
                </div>
             </Card>
             <Card className="p-8 flex items-center justify-between">
                <div>
                   <p className="font-bold text-gray-900">数据分析探针</p>
                   <p className="text-xs text-gray-400 mt-1">Real-time stats tracing</p>
                </div>
                <Switch checked={switchStates.analytics} onChange={(v) => setSwitchStates({...switchStates, analytics: v})} />
             </Card>
          </div>
        </div>
      </section>

      {/* 文本链接专区 */}
      <section className="space-y-8">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
          <div className="w-2 h-8 bg-primary-600 rounded-full"></div>
          文字链接 (Links)
        </h3>
        <Card className="p-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col gap-6">
              <Link variant="primary">主要 Indigo 链接</Link>
              <Link variant="secondary">中性灰色链接</Link>
              <Link variant="danger">警告操作链接</Link>
            </div>
            <div className="flex flex-col gap-6">
              <Link leftIcon={<Github className="w-4 h-4" />} variant="secondary">GitHub Repository</Link>
              <Link rightIcon={<ExternalLink className="w-4 h-4" />}>访问开发者文档</Link>
              <Link rightIcon={<ArrowUpRight className="w-4 h-4" />} underline="always">强制显示下划线</Link>
            </div>
            <div className="flex items-baseline gap-8">
              <Link size="sm">Tiny</Link>
              <Link size="md">Regular</Link>
              <Link size="lg">Headline</Link>
            </div>
          </div>
        </Card>
      </section>

      {/* 数据输入与选择专区 */}
      <section className="space-y-8">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
          <div className="w-2 h-8 bg-primary-600 rounded-full"></div>
          表单选择 (Forms)
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-10">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-10">高级选择逻辑</h4>
            <div className="space-y-8">
              <Radio 
                label="边缘计算节点分布"
                name="node_radio"
                value={radioValue}
                onChange={setRadioValue}
                options={[
                  { value: 'fast', label: '北京一区 (低延迟)', description: '平均响应时间 < 20ms' },
                  { value: 'balanced', label: '上海二区 (高带宽)', description: '支持 10Gbps 数据吞吐' }
                ]}
              />
              <div className="h-px bg-gray-50" />
              <div className="space-y-4">
                <p className="text-sm font-bold text-gray-900 ml-1">订阅内容</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Checkbox label="物理运行日志" checked={checkStates.logs} onChange={(v) => setCheckStates({...checkStates, logs: v})} />
                  <Checkbox label="入侵检测预警" description="支持 AI 语义分析" checked={checkStates.alerts} onChange={(v) => setCheckStates({...checkStates, alerts: v})} />
                  <Checkbox label="自动云端备份" checked={checkStates.backup} onChange={(v) => setCheckStates({...checkStates, backup: v})} />
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-10">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-10">信息采集</h4>
            <div className="space-y-10">
              <Input label="快速设备发现" placeholder="输入 ID 或序列号..." icon={<Search className="w-4 h-4" />} />
              <Select 
                label="数据湖存储周期"
                value={selectValue}
                onChange={setSelectValue}
                options={[
                  { value: '1', label: '保留最近 30 天数据' },
                  { value: '2', label: '保留最近 1 个季度' },
                  { value: '3', label: '永久存储 (高成本)' }
                ]}
              />
              <div className="pt-4 flex gap-4">
                <Button variant="secondary" className="flex-1 rounded-2xl h-14">重置表单</Button>
                <Button variant="primary" className="flex-1 rounded-2xl h-14" onClick={handleOpenModal}>提交变更</Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 导航与分段控制器 */}
      <section className="space-y-8">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
          <div className="w-2 h-8 bg-primary-600 rounded-full"></div>
          导航与切换 (Tabs)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-10">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">分段控制 (Segmented)</h4>
            <Tabs 
              activeId={activeTab1} 
              onChange={setActiveTab1}
              options={[
                { id: 'list', label: '列表视图', icon: <List className="w-4 h-4" /> },
                { id: 'grid', label: '网格视图', icon: <Grid className="w-4 h-4" /> },
                { id: 'stats', label: '全景透视', icon: <BarChart3 className="w-4 h-4" /> }
              ]}
            />
          </Card>
          <Card className="p-10">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">药丸标签 (Pills)</h4>
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
          </Card>
        </div>
      </section>

      {/* 弹窗实例 */}
      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title="配置确认"
        triggerRect={triggerRect}
      >
        <div className="flex gap-6">
           <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center shrink-0">
              <Info className="w-8 h-8 text-primary-600" />
           </div>
           <div>
              <p className="text-gray-900 text-lg font-bold mb-2">更新系统策略？</p>
              <p className="text-gray-500 text-sm leading-relaxed">
                您即将应用新的设备连接协议，这可能会导致存量终端产生约 5-10 秒的重连。请确认是否继续？
              </p>
           </div>
        </div>
      </Modal>
    </div>
  );
};

export default ComponentShowcase;
