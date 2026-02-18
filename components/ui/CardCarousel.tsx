
import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, animate, MotionValue } from 'framer-motion';
import { ArrowRight, Zap, Activity, Box, BarChart3, ShieldCheck, Cpu } from 'lucide-react';

export interface CardItem {
  id: string;
  title: string;
  subtitle: string;
  bgGradient: string;
  shadowColor: string; // 新增：用于生成匹配的彩色辉光
  icon: React.ElementType;
}

interface CardCarouselProps {
  items?: CardItem[];
  className?: string;
}

const DEFAULT_ITEMS: CardItem[] = [
  {
    id: '1',
    title: '边缘节点',
    subtitle: 'Edge Node',
    bgGradient: 'from-blue-500 via-indigo-500 to-violet-600',
    shadowColor: 'bg-indigo-500',
    icon: Cpu
  },
  {
    id: '2',
    title: '实时数据',
    subtitle: 'Live Stream',
    bgGradient: 'from-fuchsia-500 via-pink-500 to-rose-500',
    shadowColor: 'bg-pink-500',
    icon: Activity
  },
  {
    id: '3',
    title: '安全防护',
    subtitle: 'Security',
    bgGradient: 'from-emerald-400 via-teal-500 to-cyan-600',
    shadowColor: 'bg-teal-500',
    icon: ShieldCheck
  },
  {
    id: '4',
    title: '智能容器',
    subtitle: 'Container',
    bgGradient: 'from-orange-400 via-amber-500 to-yellow-500',
    shadowColor: 'bg-orange-500',
    icon: Box
  },
  {
    id: '5',
    title: '可视化',
    subtitle: 'Analytics',
    bgGradient: 'from-cyan-400 via-sky-500 to-blue-600',
    shadowColor: 'bg-sky-500',
    icon: BarChart3
  },
  {
    id: '6',
    title: '能耗管理',
    subtitle: 'Energy',
    bgGradient: 'from-violet-500 via-purple-500 to-indigo-600',
    shadowColor: 'bg-purple-500',
    icon: Zap
  }
];

// 调整为更修长的比例 (280px x 420px)
const CARD_WIDTH = 280; 
const CARD_HEIGHT = 420;
const CARD_GAP = 50; 
const STRIDE = CARD_WIDTH + CARD_GAP;

interface CardProps {
  item: CardItem;
  index: number;
  x: MotionValue<number>;
  centerOffset: number;
  onSnap: (index: number) => void;
}

const Card: React.FC<CardProps> = ({ item, index, x, centerOffset, onSnap }) => {
  const targetX = centerOffset - index * STRIDE;
  
  // 核心范围：[左侧, 中心, 右侧]
  const inputRange = [
    targetX - STRIDE, 
    targetX, 
    targetX + STRIDE
  ];
  
  // 1. 缩放逻辑：两侧 0.9，中间 1.15 (差异更明显)
  const scale = useTransform(x, inputRange, [0.9, 1.15, 0.9]);
  
  // 2. 透明度：两侧稍微降低透明度，但不再使用黑色遮罩
  const opacity = useTransform(x, inputRange, [0.6, 1, 0.6]);
  
  // 3. 3D 旋转：更自然的开合角度
  const rotateY = useTransform(x, inputRange, [18, 0, -18]);
  
  // 4. 层级：严格保证中间最高
  const zIndex = useTransform(x, inputRange, [1, 100, 1]);

  // 5. 视差效果
  const contentX = useTransform(x, inputRange, [40, 0, -40]);
  const bgX = useTransform(x, inputRange, [-20, 0, 20]);

  return (
    <motion.div
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        marginRight: CARD_GAP,
        scale,
        opacity,
        zIndex,
        rotateY,
        x: 0, 
        perspective: 1200,
        transformStyle: "preserve-3d",
      }}
      onClick={() => onSnap(index)}
      className="shrink-0 relative rounded-[2rem] cursor-grab active:cursor-grabbing select-none group"
    >
        {/* 彩色辉光阴影 (代替之前的黑色阴影) */}
        <motion.div 
            style={{ 
                scale: useTransform(x, inputRange, [0.85, 1.2, 0.85]), // 阴影随卡片放大
                opacity: useTransform(x, inputRange, [0.3, 0.6, 0.3]) 
            }}
            className={`absolute top-12 left-4 right-4 bottom-0 ${item.shadowColor} blur-[50px] rounded-[2rem] -z-10`} 
        />

        <div className="relative h-full w-full rounded-[2rem] overflow-hidden bg-white ring-1 ring-white/20 transform-style-3d shadow-xl">
            {/* 鲜艳的渐变背景 */}
            <motion.div 
                style={{ x: bgX, scale: 1.2 }} 
                className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient}`} 
            />
            
            {/* 细微的噪点纹理 (降低不透明度，避免发乌) */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
            
            {/* 顶部高光 (Glass effect) */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

            {/* 内容层 */}
            <motion.div 
                style={{ x: contentX, z: 50 }}
                className="relative h-full p-8 flex flex-col justify-between text-white z-50"
            >
                <div className="space-y-6">
                    <motion.div 
                        className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-[0_8px_16px_rgba(0,0,0,0.1)]"
                    >
                        <item.icon className="w-8 h-8 text-white drop-shadow-sm" />
                    </motion.div>
                    <div>
                        <h3 className="text-3xl font-extrabold mb-2 tracking-tight drop-shadow-md">{item.title}</h3>
                        <p className="text-white/80 text-base font-medium tracking-wide">{item.subtitle}</p>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <div className="px-3 py-1.5 rounded-lg bg-black/10 backdrop-blur-sm border border-white/10 text-xs font-bold text-white/90">
                        ACTIVE
                    </div>
                    <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-12 h-12 rounded-full bg-white text-gray-900 flex items-center justify-center shadow-lg hover:shadow-xl hover:bg-white transition-all"
                    >
                        <ArrowRight className="w-5 h-5" />
                    </motion.button>
                </div>
            </motion.div>
      </div>
    </motion.div>
  );
};

interface FluidDotProps {
  index: number;
  x: MotionValue<number>;
  centerOffset: number;
}

const FluidDot: React.FC<FluidDotProps> = ({ index, x, centerOffset }) => {
    const targetX = centerOffset - index * STRIDE;
    const inputRange = [targetX - STRIDE, targetX, targetX + STRIDE];
    
    const width = useTransform(x, inputRange, [8, 32, 8]);
    const opacity = useTransform(x, inputRange, [0.3, 1, 0.3]);
    const backgroundColor = useTransform(x, inputRange, ["#cbd5e1", "#6366f1", "#cbd5e1"]);
    
    return (
        <motion.div 
            style={{ width, backgroundColor, opacity }}
            className="h-2 rounded-full shadow-sm"
        />
    )
}

const CardCarousel: React.FC<CardCarouselProps> = ({ items = DEFAULT_ITEMS, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [centerOffset, setCenterOffset] = useState(0);
  const x = useMotionValue(0);

  useEffect(() => {
    if (containerRef.current) {
      // 这里的计算决定了哪个点是"中心"
      const offset = containerRef.current.offsetWidth / 2 - CARD_WIDTH / 2;
      setCenterOffset(offset);
      x.set(offset);
    }
    
    const handleResize = () => {
        if (containerRef.current) {
            const offset = containerRef.current.offsetWidth / 2 - CARD_WIDTH / 2;
            setCenterOffset(offset);
        }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [x]);

  const snapTo = (index: number) => {
      const finalX = centerOffset - index * STRIDE;
      animate(x, finalX, {
          type: "spring",
          stiffness: 250,
          damping: 25,
          mass: 0.8
      });
  };

  const handleDragEnd = (e: any, { offset, velocity }: PanInfo) => {
    const currentX = x.get();
    
    // 惯性预测
    const velocityFactor = 0.25; 
    const projectedPosition = currentX + velocity.x * velocityFactor * 1000;
    
    const rawIndex = (centerOffset - projectedPosition) / STRIDE;
    let targetIndex = Math.round(rawIndex);
    
    targetIndex = Math.max(0, Math.min(items.length - 1, targetIndex));
    
    const finalX = centerOffset - targetIndex * STRIDE;
    
    animate(x, finalX, {
      type: "spring",
      stiffness: 180,
      damping: 24,
      mass: 0.8
    });
  };

  return (
    <div 
      ref={containerRef} 
      className={`
        relative w-full h-[600px] flex flex-col items-center justify-center 
        bg-gray-50/50 rounded-[3rem] border border-gray-100 overflow-hidden 
        ${className}
      `}
    >
      <div className="w-full h-full flex items-center justify-center perspective-[1000px] overflow-visible z-10">
          <motion.div
            drag="x"
            dragConstraints={{ left: -10000, right: 10000 }}
            style={{ x }} 
            onDragEnd={handleDragEnd}
            dragElastic={0.2}
            dragMomentum={false} 
            className="flex items-center cursor-grab active:cursor-grabbing pl-[50vw] pr-[50vw] py-10"
            layout
          >
            {items.map((item, index) => (
              <Card 
                key={item.id} 
                item={item} 
                index={index} 
                x={x} 
                centerOffset={centerOffset} 
                onSnap={snapTo}
              />
            ))}
          </motion.div>
      </div>
      
      {/* 底部指示器 */}
      <div className="absolute bottom-8 flex items-center gap-2 z-20 bg-white/40 backdrop-blur-md px-5 py-3 rounded-full border border-white/20 shadow-sm">
          {items.map((_, i) => (
              <FluidDot key={i} index={i} x={x} centerOffset={centerOffset} />
          ))}
      </div>
      
      {/* 左右渐变遮罩 (变窄一点，避免遮挡太多) */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-gray-50 via-gray-50/60 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-gray-50 via-gray-50/60 to-transparent pointer-events-none z-10" />
    </div>
  );
};

export default CardCarousel;
