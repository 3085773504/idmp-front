
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Button from './Button';

export interface SlideData {
  id: string;
  image: string;
  category: string;
  title: string;
  description: string;
}

interface CarouselProps {
  slides: SlideData[];
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

const Carousel: React.FC<CarouselProps> = ({ 
  slides, 
  autoPlay = true, 
  interval = 5000,
  className = '' 
}) => {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const imageIndex = Math.abs(page % slides.length);
  const wrap = (min: number, max: number, v: number) => {
    const rangeSize = max - min;
    return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
  };
  const activeIndex = wrap(0, slides.length, page);

  const paginate = useCallback((newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  }, [page]);

  useEffect(() => {
    if (!autoPlay || isDragging || isPaused) return;
    
    const timer = setTimeout(() => {
      paginate(1);
    }, interval);

    return () => clearTimeout(timer);
  }, [autoPlay, interval, isDragging, isPaused, page, paginate]);

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const handleDragEnd = (e: any, { offset, velocity }: PanInfo) => {
    setIsDragging(false);
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      paginate(1);
    } else if (swipe > swipeConfidenceThreshold) {
      paginate(-1);
    }
  };

  // 优化后的动画变体
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 1,
      zIndex: 1 // 进场元素层级较高
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0, // 退场元素层级降低，防止遮挡
      x: direction < 0 ? '100%' : '-100%',
      opacity: 1
    })
  };

  return (
    <div 
      className={`relative w-full h-[500px] rounded-[2.5rem] overflow-hidden group select-none bg-gray-900 transform-gpu ${className}`} // transform-gpu 强制硬件加速
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 35 }, // 增加阻尼 (damping) 消除结束时的抖动
            opacity: { duration: 0.2 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.8}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing will-change-transform"
        >
          {/* 背景图片 */}
          <div className="absolute inset-0 w-full h-full">
             <div className="absolute inset-0 bg-gray-900/20 z-10 pointer-events-none" />
             <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent z-10 pointer-events-none" />
             <img 
               src={slides[activeIndex].image} 
               alt={slides[activeIndex].title}
               className="w-full h-full object-cover pointer-events-none"
               draggable={false}
             />
          </div>

          {/* 内容层 - 增加 pointer-events-none 防止拖拽时误触文字 */}
          <div className="absolute inset-0 z-20 flex flex-col justify-end p-10 md:p-16 pointer-events-none">
             <motion.div 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
               className="max-w-2xl pointer-events-auto"
             >
                <div className="flex items-center gap-3 mb-4">
                   <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-xs font-bold text-white uppercase tracking-wider shadow-lg">
                      {slides[activeIndex].category}
                   </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight drop-shadow-sm">
                   {slides[activeIndex].title}
                </h2>
                <p className="text-lg text-gray-200 mb-8 line-clamp-2 leading-relaxed opacity-90">
                   {slides[activeIndex].description}
                </p>
                
                {/* 
                    更新按钮样式：
                    由纯白背景改为磨砂玻璃 (Glassmorphism)，
                    消除视觉突兀感，提升高级感。
                */}
                <Button 
                   className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 px-8 h-12 rounded-full shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] active:scale-95 transition-all"
                   rightIcon={<ArrowRight className="w-5 h-5"/>}
                >
                   查看详情
                </Button>
             </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 导航控制 */}
      <div className="absolute bottom-10 right-10 z-30 flex items-center gap-4 hidden md:flex">
         <button 
           className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90 shadow-lg"
           onClick={() => paginate(-1)}
         >
            <ChevronLeft className="w-6 h-6" />
         </button>
         <button 
           className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90 shadow-lg"
           onClick={() => paginate(1)}
         >
            <ChevronRight className="w-6 h-6" />
         </button>
      </div>

      {/* 进度指示器 */}
      <div className="absolute bottom-10 right-10 md:right-auto md:left-16 md:bottom-16 z-30 flex gap-2">
         {slides.map((_, index) => (
            <div 
              key={index} 
              className="h-1.5 rounded-full overflow-hidden bg-white/20 cursor-pointer transition-all duration-300 backdrop-blur-sm"
              style={{ width: index === activeIndex ? 32 : 12 }}
              onClick={() => {
                 const diff = index - activeIndex;
                 paginate(diff);
              }}
            >
               {index === activeIndex && !isPaused && (
                  <motion.div 
                     className="h-full bg-white rounded-full"
                     initial={{ width: "0%" }}
                     animate={{ width: "100%" }}
                     transition={{ duration: interval / 1000, ease: "linear" }}
                     layoutId="progress"
                  />
               )}
               {index === activeIndex && isPaused && (
                  <div className="h-full bg-white rounded-full w-full" />
               )}
            </div>
         ))}
      </div>
    </div>
  );
};

export default Carousel;
