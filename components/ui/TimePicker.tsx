
import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';

// 单个数字项：使用 React.memo 避免滚动时全列表重绘
const WheelItem = React.memo(({ value, isSelected, onClick }: { value: string, isSelected: boolean, onClick: (v: string) => void }) => {
  return (
    <div 
      onClick={() => onClick(value)}
      className={`
        h-10 flex items-center justify-center font-bold text-xl cursor-pointer snap-center select-none transition-transform duration-200 ease-out
        ${isSelected ? 'text-primary-600 scale-125' : 'text-gray-300 hover:text-gray-500 scale-100'}
      `}
    >
      {value}
    </div>
  );
});
WheelItem.displayName = 'WheelItem';

// 独立的滚动列组件：封装滚动逻辑
interface WheelColumnProps {
  items: string[];
  value: string;
  onChange: (val: string) => void;
}

const WheelColumn: React.FC<WheelColumnProps> = ({ items, value, onChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [localValue, setLocalValue] = useState(value);
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ITEM_HEIGHT = 40;

  // 外部 value 变化时同步（仅当非用户滚动时）
  useEffect(() => {
    if (!isScrolling.current && value !== localValue) {
      setLocalValue(value);
      // 只有在非滚动状态下才自动定位，避免打断用户操作
      const index = items.indexOf(value);
      if (index !== -1 && containerRef.current) {
        containerRef.current.scrollTo({ top: index * ITEM_HEIGHT, behavior: 'auto' });
      }
    }
  }, [value, items]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    isScrolling.current = true;
    const container = e.currentTarget;
    
    // 核心计算：根据滚动高度计算当前索引
    const index = Math.round(container.scrollTop / ITEM_HEIGHT);
    
    // 边界检查
    if (index < 0 || index >= items.length) return;
    
    const newValue = items[index];
    
    // 1. 立即更新本地视觉状态（高亮）
    if (newValue !== localValue) {
      setLocalValue(newValue);
    }

    // 2. 防抖通知父组件（避免频繁触发重绘导致卡顿）
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    
    scrollTimeout.current = setTimeout(() => {
      isScrolling.current = false;
      // 只有当值真正改变且滚动停止时才通知外部
      if (newValue !== value) {
        onChange(newValue);
      }
      
      // 滚动停止后的自动吸附校准（可选，snap-mandatory 通常已经处理了）
      // if (containerRef.current) {
      //   containerRef.current.scrollTo({ top: index * ITEM_HEIGHT, behavior: 'smooth' });
      // }
    }, 100); // 100ms 延迟，确保平滑
  }, [items, localValue, value, onChange]);

  const handleClick = useCallback((val: string) => {
    setLocalValue(val);
    onChange(val);
    const index = items.indexOf(val);
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: index * ITEM_HEIGHT, behavior: 'smooth' });
    }
  }, [items, onChange]);

  return (
    <div className="relative h-[200px] w-20 overflow-hidden group">
      {/* 顶部遮罩 */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white via-white/80 to-transparent z-20 pointer-events-none" />
      {/* 底部遮罩 */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white via-white/80 to-transparent z-20 pointer-events-none" />
      
      {/* 选中框背景 (放在中间) */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-10 bg-gray-50 rounded-lg -z-10" />

      <div 
        ref={containerRef}
        className="h-full overflow-y-auto custom-scrollbar snap-y snap-mandatory py-[80px]" 
        onScroll={handleScroll}
        style={{ 
          scrollBehavior: 'auto',
          touchAction: 'pan-y', // 明确垂直滚动
        }} 
      >
        {items.map((item) => (
          <WheelItem 
            key={item} 
            value={item} 
            isSelected={item === localValue} 
            onClick={handleClick} 
          />
        ))}
      </div>
    </div>
  );
};

interface TimePickerProps {
  value: string; // "HH:MM"
  onChange: (value: string) => void;
  className?: string;
}

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange, className = '' }) => {
  const [propHour, propMinute] = value.split(':');
  
  // 生成数据源
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')), []);
  const minutes = useMemo(() => Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')), []);

  // 处理列变更
  const handleHourChange = useCallback((newHour: string) => {
    onChange(`${newHour}:${propMinute}`);
  }, [onChange, propMinute]);

  const handleMinuteChange = useCallback((newMinute: string) => {
    onChange(`${propHour}:${newMinute}`);
  }, [onChange, propHour]);

  return (
    <div className={`flex gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 select-none ${className}`}>
      <WheelColumn 
        items={hours} 
        value={propHour} 
        onChange={handleHourChange} 
      />
      
      <div className="flex items-center justify-center font-bold text-gray-300 pb-1 text-xl">:</div>
      
      <WheelColumn 
        items={minutes} 
        value={propMinute} 
        onChange={handleMinuteChange} 
      />
    </div>
  );
};

export default TimePicker;
