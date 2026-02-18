
import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface InteractiveCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  gradient?: string;
  className?: string;
  onClick?: () => void;
}

const InteractiveCard: React.FC<InteractiveCardProps> = ({ 
  title, 
  subtitle, 
  icon, 
  gradient = "from-blue-500 to-indigo-600",
  className = "",
  onClick
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // 鼠标位置状态 (范围 0 到 1)
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // 使用弹簧物理效果平滑鼠标数值，实现"跟手"但有重量感的延迟
  const mouseX = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseY = useSpring(y, { stiffness: 300, damping: 30 });

  // 将鼠标位置映射到旋转角度 (最大 ±7 度)
  const rotateX = useTransform(mouseY, [0, 1], [7, -7]); // 鼠标在上方时，卡片上半部后仰(正旋转)
  const rotateY = useTransform(mouseX, [0, 1], [-7, 7]); // 鼠标在左方时，卡片左半部后仰(负旋转)

  // 动态光泽的位置映射
  const shineX = useTransform(mouseX, [0, 1], ["0%", "100%"]);
  const shineY = useTransform(mouseY, [0, 1], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    
    // 计算鼠标在卡片内的相对坐标
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    // 归一化为 0-1
    const xPct = clientX / rect.width;
    const yPct = clientY / rect.height;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    // 鼠标离开时自动回正
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileTap={{ scale: 0.96 }}
      style={{
        perspective: 1000, // 设定 3D 透视深度
        transformStyle: "preserve-3d"
      }}
      className={`relative h-64 w-full cursor-pointer group select-none ${className}`}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
        className="relative h-full w-full rounded-[2rem] bg-white shadow-xl transition-shadow duration-200 border border-gray-100/50"
      >
        {/* 动态光泽层 (Shine Layer) */}
        <div className="absolute inset-0 rounded-[2rem] overflow-hidden z-20 pointer-events-none mix-blend-soft-light">
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
               // 创建一个跟随鼠标移动的径向渐变光斑
               background: `radial-gradient(circle at ${shineX} ${shineY}, rgba(255,255,255,0.8), transparent 60%)`
            }}
          />
        </div>

        {/* 内容层 (Content Layer) - 使用 translateZ 实现悬浮感 */}
        <div 
           className="absolute inset-0 p-7 flex flex-col justify-between z-10"
           style={{ transform: "translateZ(30px)" }}
        >
           {/* Top Section */}
           <div className="flex justify-between items-start">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg ring-4 ring-white`}>
                 {icon}
              </div>
              <div className="bg-gray-50 rounded-full p-2.5 group-hover:bg-gray-900 transition-colors duration-300">
                 <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
              </div>
           </div>

           {/* Bottom Section */}
           <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 transition-all">
                {title}
              </h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed line-clamp-2">
                {subtitle}
              </p>
           </div>
        </div>

        {/* 内部装饰性背景 (Decorative Gradient) */}
        <div className={`absolute bottom-0 right-0 w-56 h-56 bg-gradient-to-tl ${gradient} opacity-[0.03] group-hover:opacity-[0.08] rounded-tl-[100%] transition-opacity duration-500 pointer-events-none rounded-br-[2rem]`} />
      </motion.div>
      
      {/* 动态阴影 (Dynamic Drop Shadow) - 反向移动以增强悬浮感 */}
      <motion.div 
         className={`absolute inset-6 rounded-[2rem] bg-gradient-to-br ${gradient} blur-2xl -z-10`}
         style={{
            opacity: useTransform(mouseY, [0, 1], [0.15, 0.35]),
            scale: 0.9,
            // 阴影向远处移动 (Z轴负方向)，并且X/Y偏移量稍微滞后于卡片
            transform: "translateZ(-50px)",
            x: useTransform(mouseX, [0, 1], [-5, 5]),
            y: useTransform(mouseY, [0, 1], [-5, 5]),
         }}
      />
    </motion.div>
  );
};

export default InteractiveCard;
