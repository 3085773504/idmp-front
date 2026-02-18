
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Server, Cpu, Activity, Zap, HardDrive, 
  Wifi, AlertCircle, CheckCircle2, MoreHorizontal 
} from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';

// 模拟实时数据生成
const generateData = () => {
  return Array.from({ length: 20 }, (_, i) => ({
    time: `${i}:00`,
    cpu: Math.floor(Math.random() * 40) + 20,
    memory: Math.floor(Math.random() * 30) + 40,
    network: Math.floor(Math.random() * 80) + 10,
  }));
};

const MonitorCenter: React.FC = () => {
  const [data, setData] = useState(generateData());
  const [activeNode, setActiveNode] = useState('node-01');

  // 模拟数据实时更新效果
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1)];
        const lastTime = parseInt(prev[prev.length - 1].time);
        newData.push({
          time: `${(lastTime + 1) % 24}:00`,
          cpu: Math.floor(Math.random() * 40) + 20,
          memory: Math.floor(Math.random() * 30) + 40,
          network: Math.floor(Math.random() * 80) + 10,
        });
        return newData;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const StatusCard = ({ icon: Icon, label, value, subValue, color, delay }: any) => (
    <Card 
      className="p-6 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className={`absolute top-0 right-0 p-4 opacity-10 ${color}`}>
        <Icon className="w-24 h-24" />
      </div>
      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color.replace('text-', 'bg-').replace('500', '50')} ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{value}</h3>
        <p className="text-sm font-medium text-gray-500 mt-1">{label}</p>
        <div className="mt-4 flex items-center gap-2 text-xs font-medium">
          <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
            {subValue}
          </span>
          <span className="text-gray-400">vs 上一小时</span>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-8">
      <motion.header 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">监控中心</h2>
            <p className="text-lg text-gray-500 mt-2">实时监测集群节点状态与性能指标。</p>
          </div>
          <div className="flex gap-3">
             <Button variant="secondary" leftIcon={<AlertCircle className="w-4 h-4"/>}>报警记录</Button>
             <Button leftIcon={<Zap className="w-4 h-4"/>}>一键诊断</Button>
          </div>
        </div>
      </motion.header>

      {/* 状态卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatusCard 
          icon={Cpu} 
          label="平均 CPU 使用率" 
          value="42.8%" 
          subValue="-12.5%" 
          color="text-indigo-500"
          delay={0.1}
        />
        <StatusCard 
          icon={HardDrive} 
          label="内存负载情况" 
          value="8.2 GB" 
          subValue="+2.4%" 
          color="text-purple-500"
          delay={0.2}
        />
        <StatusCard 
          icon={Wifi} 
          label="网络吞吐量 (I/O)" 
          value="1.2 GB/s" 
          subValue="+18.2%" 
          color="text-blue-500"
          delay={0.3}
        />
      </div>

      {/* 核心图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900">核心指标趋势</h3>
              <p className="text-sm text-gray-500">CPU 与内存实时负载监控</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 text-xs font-medium px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span> CPU
              </div>
              <div className="flex items-center gap-2 text-xs font-medium px-3 py-1 bg-purple-50 text-purple-700 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span> 内存
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)' }}
                />
                <Line type="monotone" dataKey="cpu" stroke="#6366f1" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                <Line type="monotone" dataKey="memory" stroke="#a855f7" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-0 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100">
             <h3 className="text-lg font-bold text-gray-900">节点健康度</h3>
             <p className="text-sm text-gray-500">Cluster Nodes Health</p>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
             {[1,2,3,4,5].map((n) => (
               <div 
                 key={n} 
                 onClick={() => setActiveNode(`node-0${n}`)}
                 className={`
                   group flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all mb-2
                   ${activeNode === `node-0${n}` ? 'bg-indigo-50 ring-1 ring-indigo-500/20' : 'hover:bg-gray-50'}
                 `}
               >
                 <div className="flex items-center gap-4">
                    <div className={`
                      w-10 h-10 rounded-lg flex items-center justify-center
                      ${n % 2 === 0 ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-indigo-600'}
                    `}>
                      <Server className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Server-0{n}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${n % 2 === 0 ? 'bg-green-500' : 'bg-indigo-500'}`}></div>
                        <span className="text-xs text-gray-500">192.168.1.10{n}</span>
                      </div>
                    </div>
                 </div>
                 <div className="text-right">
                   <p className="text-sm font-bold text-gray-900">{Math.floor(Math.random() * 20 + 10)}ms</p>
                   <p className="text-xs text-gray-400">延迟</p>
                 </div>
               </div>
             ))}
          </div>
          <div className="p-4 bg-gray-50/50 border-t border-gray-100 text-center">
            <Button variant="ghost" size="sm" className="w-full text-xs">查看全部节点</Button>
          </div>
        </Card>
      </div>

      {/* 底部告警列表 */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">实时系统日志</h3>
          <div className="flex gap-2">
            <Badge variant="error">3 Critical</Badge>
            <Badge variant="warning">5 Warning</Badge>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4">级别</th>
                <th className="px-6 py-4">时间戳</th>
                <th className="px-6 py-4">来源模块</th>
                <th className="px-6 py-4">消息内容</th>
                <th className="px-6 py-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { level: 'error', time: '10:23:45', module: 'Auth Service', msg: 'Connection timeout waiting for LDAP server' },
                { level: 'warning', time: '10:22:10', module: 'Data Node 03', msg: 'High memory usage detected (>85%)' },
                { level: 'success', time: '10:20:00', module: 'Backup Job', msg: 'Daily incremental backup completed successfully' },
              ].map((log, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    {log.level === 'error' && <Badge variant="error">Critical</Badge>}
                    {log.level === 'warning' && <Badge variant="warning">Warning</Badge>}
                    {log.level === 'success' && <Badge variant="success">Info</Badge>}
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-500">{log.time}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{log.module}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{log.msg}</td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" isIconOnly size="sm">
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default MonitorCenter;
