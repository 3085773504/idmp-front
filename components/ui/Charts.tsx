
import React, { useState, useEffect, useRef } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Sector, Radar, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Legend, LineChart, Line, ComposedChart,
  RadialBarChart, RadialBar, ReferenceLine
} from 'recharts';
import { motion } from 'framer-motion';

// --- Shared Types & Utils ---

interface ChartProps {
  data?: any[];
  height?: number;
  className?: string;
  colors?: string[];
}

const DEFAULT_COLORS = ['#6366f1', '#a855f7', '#10b981', '#f59e0b', '#ef4444'];

// Custom Tooltip Component (Glassmorphism Style)
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/20 text-sm ring-1 ring-black/5 z-50">
        <p className="font-bold text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 mb-1.5 last:mb-0">
            <div className="flex items-center gap-2">
                <div 
                className="w-2.5 h-2.5 rounded-full shadow-sm" 
                style={{ backgroundColor: entry.color || entry.fill }} 
                />
                <span className="text-gray-500 font-medium text-xs">{entry.name}</span>
            </div>
            <span className="font-mono font-bold text-gray-900">
                {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
                {entry.unit && <span className="text-xs text-gray-400 ml-0.5">{entry.unit}</span>}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// --- 1. Smooth Area Chart (Trend) ---
const areaData = [
  { name: 'Mon', uv: 4000, pv: 2400 },
  { name: 'Tue', uv: 3000, pv: 1398 },
  { name: 'Wed', uv: 2000, pv: 9800 },
  { name: 'Thu', uv: 2780, pv: 3908 },
  { name: 'Fri', uv: 1890, pv: 4800 },
  { name: 'Sat', uv: 2390, pv: 3800 },
  { name: 'Sun', uv: 3490, pv: 4300 },
];

export const SmoothAreaChart: React.FC<ChartProps> = ({ 
  data = areaData, 
  height = 300, 
  className = '' 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full ${className}`} 
      style={{ height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} 
            dy={10} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} 
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Area 
            type="monotone" 
            dataKey="uv" 
            name="访问量"
            stroke="#6366f1" 
            strokeWidth={3} 
            fillOpacity={1} 
            fill="url(#colorUv)" 
            animationDuration={1500}
            activeDot={{ r: 6, strokeWidth: 0, fill: '#6366f1' }}
          />
          <Area 
            type="monotone" 
            dataKey="pv" 
            name="点击量"
            stroke="#a855f7" 
            strokeWidth={3} 
            fillOpacity={1} 
            fill="url(#colorPv)" 
            animationDuration={1500}
            animationBegin={300}
            activeDot={{ r: 6, strokeWidth: 0, fill: '#a855f7' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// --- 2. Spotlight Bar Chart (Interactive) ---
const barData = [
  { name: 'Jan', sales: 4000, profit: 2400 },
  { name: 'Feb', sales: 3000, profit: 1398 },
  { name: 'Mar', sales: 2000, profit: 9800 },
  { name: 'Apr', sales: 2780, profit: 3908 },
  { name: 'May', sales: 1890, profit: 4800 },
  { name: 'Jun', sales: 2390, profit: 3800 },
  { name: 'Jul', sales: 3490, profit: 4300 },
];

export const RoundedBarChart: React.FC<ChartProps> = ({ 
  data = barData, 
  height = 300, 
  className = '' 
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`w-full ${className}`} 
      style={{ height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
            data={data} 
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }} 
            barGap={8}
            onMouseMove={(state: any) => {
                if (state.isTooltipActive) {
                    setActiveIndex(state.activeTooltipIndex);
                } else {
                    setActiveIndex(null);
                }
            }}
            onMouseLeave={() => setActiveIndex(null)}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} 
            dy={10} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} 
          />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ fill: 'transparent' }} 
          />
          <Bar dataKey="sales" name="销售额" radius={[6, 6, 6, 6]} barSize={12} animationDuration={1000}>
            {data.map((entry, index) => (
                <Cell 
                    key={`cell-${index}`} 
                    fill="#6366f1" 
                    className="transition-all duration-300 ease-out"
                    style={{ 
                        opacity: activeIndex === null || activeIndex === index ? 1 : 0.3 
                    }}
                />
            ))}
          </Bar>
          <Bar dataKey="profit" name="净利润" radius={[6, 6, 6, 6]} barSize={12} animationDuration={1000} animationBegin={200}>
             {data.map((entry, index) => (
                <Cell 
                    key={`cell-profit-${index}`} 
                    fill="#cbd5e1" 
                    className="transition-all duration-300 ease-out"
                    style={{ 
                        opacity: activeIndex === null || activeIndex === index ? 1 : 0.3 
                    }}
                />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// --- 3. Interactive Donut Chart (Distribution) ---
const donutData = [
  { name: 'Desktop', value: 400 },
  { name: 'Mobile', value: 300 },
  { name: 'Tablet', value: 300 },
  { name: 'Other', value: 200 },
];

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;

  return (
    <g>
      <text x={cx} y={cy} dy={-10} textAnchor="middle" fill="#1f2937" className="text-xl font-bold font-mono">
        {value}
      </text>
      <text x={cx} y={cy} dy={15} textAnchor="middle" fill="#9ca3af" className="text-xs font-medium uppercase tracking-wider">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8} // Animated expansion
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        cornerRadius={6}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={innerRadius - 8}
        outerRadius={innerRadius - 4}
        fill={fill}
        fillOpacity={0.2}
        cornerRadius={4}
      />
    </g>
  );
};

export const InteractiveDonutChart: React.FC<ChartProps> = ({ 
  data = donutData, 
  height = 300, 
  className = '' 
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, rotate: -20 }}
      animate={{ opacity: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`w-full flex items-center justify-center ${className}`} 
      style={{ height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={onPieEnter}
            paddingAngle={5}
            cornerRadius={6}
            animationDuration={1000}
            animationBegin={0}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={DEFAULT_COLORS[index % DEFAULT_COLORS.length]} stroke="none" />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// --- 4. Hex Radar Chart (Metrics) ---
const radarData = [
  { subject: '性能', A: 120, B: 110, fullMark: 150 },
  { subject: '稳定', A: 98, B: 130, fullMark: 150 },
  { subject: '安全', A: 86, B: 130, fullMark: 150 },
  { subject: '扩展', A: 99, B: 100, fullMark: 150 },
  { subject: '易用', A: 85, B: 90, fullMark: 150 },
  { subject: '维护', A: 65, B: 85, fullMark: 150 },
];

export const HexRadarChart: React.FC<ChartProps> = ({ 
  data = radarData, 
  height = 300, 
  className = '' 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={`w-full ${className}`} 
      style={{ height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} 
          />
          <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
          <Radar
            name="本月指标"
            dataKey="A"
            stroke="#6366f1"
            strokeWidth={2}
            fill="#6366f1"
            fillOpacity={0.4}
            animationDuration={1000}
          />
          <Radar
            name="上月指标"
            dataKey="B"
            stroke="#f59e0b"
            strokeWidth={2}
            fill="#f59e0b"
            fillOpacity={0.2}
            animationDuration={1000}
            animationBegin={300}
          />
          <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 500, color: '#94a3b8', paddingTop: '10px' }}/>
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// --- 5. Line Comparison Chart (Dual Wave) ---
const lineData = [
    { name: 'Mon', current: 120, prev: 80 },
    { name: 'Tue', current: 132, prev: 90 },
    { name: 'Wed', current: 101, prev: 150 },
    { name: 'Thu', current: 134, prev: 110 },
    { name: 'Fri', current: 190, prev: 130 },
    { name: 'Sat', current: 230, prev: 180 },
    { name: 'Sun', current: 210, prev: 170 },
];

export const LineComparisonChart: React.FC<ChartProps> = ({
    data = lineData,
    height = 300,
    className = ''
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className={`w-full ${className}`}
            style={{ height }}
        >
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '4 4' }} />
                    <Legend iconType="circle" wrapperStyle={{ bottom: -10, left: 20, fontSize: '12px' }} />
                    
                    <Line 
                        type="monotone" 
                        dataKey="prev" 
                        name="上周"
                        stroke="#e2e8f0" 
                        strokeWidth={2} 
                        strokeDasharray="5 5" 
                        dot={false}
                        animationDuration={1500}
                        activeDot={{ r: 4, fill: '#cbd5e1', strokeWidth: 0 }}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="current" 
                        name="本周"
                        stroke="#6366f1" 
                        strokeWidth={3} 
                        dot={false}
                        activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 3, className: 'animate-pulse' }}
                        animationDuration={1500}
                        animationBegin={300}
                    />
                </LineChart>
            </ResponsiveContainer>
        </motion.div>
    )
}

// --- 6. Radial Progress Chart (Apple Rings) ---
const radialData = [
    { name: '达成率', value: 85, fill: '#6366f1' },
    { name: '活跃度', value: 65, fill: '#a855f7' },
    { name: '满意度', value: 45, fill: '#10b981' },
];

export const RadialProgressChart: React.FC<ChartProps> = ({
    data = radialData,
    height = 300,
    className = ''
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className={`w-full ${className}`}
            style={{ height }}
        >
            <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                    cx="50%" 
                    cy="50%" 
                    innerRadius="30%" 
                    outerRadius="100%" 
                    barSize={16} 
                    data={data}
                    startAngle={90}
                    endAngle={-270}
                >
                    <RadialBar
                        // minAngle={15}
                        background={{ fill: '#f1f5f9' }}
                        clockWise
                        dataKey="value"
                        cornerRadius={10}
                        animationDuration={2000}
                        animationEasing="ease-out"
                    />
                    <Legend 
                        iconSize={10} 
                        layout="vertical" 
                        verticalAlign="middle" 
                        wrapperStyle={{ right: 0, top: '50%', transform: 'translateY(-50%)', lineHeight: '24px' }} 
                        formatter={(value, entry: any) => <span className="text-gray-600 text-xs font-medium ml-2">{value}</span>}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={false} />
                </RadialBarChart>
            </ResponsiveContainer>
        </motion.div>
    )
}

// --- 7. Composed Analytics Chart (Bar + Line + Dual Axis) ---
const composedData = [
  { name: '1月', uv: 590, pv: 800, amt: 1400 },
  { name: '2月', uv: 868, pv: 967, amt: 1506 },
  { name: '3月', uv: 1397, pv: 1098, amt: 989 },
  { name: '4月', uv: 1480, pv: 1200, amt: 1228 },
  { name: '5月', uv: 1520, pv: 1108, amt: 1100 },
  { name: '6月', uv: 1400, pv: 680, amt: 1700 },
];

export const ComposedAnalyticsChart: React.FC<ChartProps> = ({
    data = composedData,
    height = 300,
    className = ''
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`w-full ${className}`}
            style={{ height }}
        >
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 0, left: -20 }}>
                    <CartesianGrid stroke="#f1f5f9" vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ bottom: -10 }} />
                    
                    <Bar yAxisId="left" dataKey="pv" name="订单量" barSize={20} fill="#e0e7ff" radius={[4, 4, 0, 0]} animationDuration={1500} />
                    <Line yAxisId="right" type="monotone" dataKey="uv" name="转化率" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#fff', stroke: '#6366f1', strokeWidth: 2 }} activeDot={{ r: 7 }} animationDuration={1500} animationBegin={300} />
                </ComposedChart>
            </ResponsiveContainer>
        </motion.div>
    )
}

// --- 8. NEW: Real-Time Line Chart (Streaming Data) ---
const initialRealTimeData = Array.from({ length: 20 }, (_, i) => ({
  time: i,
  value: Math.floor(Math.random() * 50) + 20
}));

export const RealTimeLineChart: React.FC<ChartProps> = ({
  height = 300,
  className = ''
}) => {
  const [data, setData] = useState(initialRealTimeData);
  const counter = useRef(20);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1)];
        newData.push({
          time: counter.current++,
          value: Math.floor(Math.random() * 50) + 20 + Math.sin(counter.current / 5) * 10
        });
        return newData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full ${className}`}
      style={{ height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="time" 
            axisLine={false} 
            tickLine={false} 
            tick={false} // Hide ticks for cleaner stream look
            dy={10} 
          />
          <YAxis 
            domain={[0, 100]} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="value" 
            name="实时负载"
            stroke="#10b981" 
            strokeWidth={3} 
            dot={false}
            isAnimationActive={true} // Keep animation for smooth transitions
            animationDuration={800}
          />
          <Area type="monotone" dataKey="value" fill="#10b981" fillOpacity={0.1} />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
