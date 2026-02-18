
import React, { useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showTooltip?: boolean;
  formatTooltip?: (value: number) => string;
  marks?: boolean;
  className?: string;
}

const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  showTooltip = false,
  formatTooltip,
  marks = false,
  className = ''
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Safe percentage calculation
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  // Calculate tick marks positions
  const tickPoints = useMemo(() => {
    if (!marks || step <= 0) return [];
    const count = Math.floor((max - min) / step);
    // Limit tick rendering to avoid performance issues if step is too small
    if (count > 20) return [min, max]; 
    return Array.from({ length: count + 1 }, (_, i) => min + i * step);
  }, [min, max, step, marks]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled || !trackRef.current) return;
    
    setIsDragging(true);
    updateValue(e.clientX);
    
    // Capture pointer for dragging outside the component area
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging && !disabled) {
      updateValue(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      (e.target as Element).releasePointerCapture(e.pointerId);
    }
  };

  const updateValue = (clientX: number) => {
    if (!trackRef.current) return;
    
    const rect = trackRef.current.getBoundingClientRect();
    // Calculate position relative to track
    const x = Math.min(rect.width, Math.max(0, clientX - rect.left));
    const ratio = x / rect.width;
    
    let newValue = min + ratio * (max - min);
    
    if (step) {
      newValue = Math.round(newValue / step) * step;
    }
    
    // Ensure value is within bounds and updated
    newValue = Math.min(max, Math.max(min, newValue));
    
    if (newValue !== value) {
      onChange(newValue);
    }
  };

  const isActive = isDragging || isHovered;

  return (
    <div 
      className={`
        relative h-10 flex items-center select-none touch-none 
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} 
        ${className}
      `}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      {/* Animated Track Container */}
      <motion.div 
        ref={trackRef} 
        className="absolute inset-x-0 rounded-full overflow-hidden"
        initial={false}
        animate={{ 
          height: isActive ? 12 : 6, // Track expands on interaction
          backgroundColor: isActive ? '#e2e8f0' : '#e5e7eb' // slate-200 vs gray-200
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Tick Marks */}
        {marks && tickPoints.map((tickVal) => {
          const tickPercent = ((tickVal - min) / (max - min)) * 100;
          return (
            <div 
              key={tickVal}
              className="absolute top-0 bottom-0 w-[2px] bg-white/60 z-10 pointer-events-none"
              style={{ left: `${tickPercent}%`, transform: 'translateX(-50%)' }}
            />
          );
        })}

        {/* Fill Track */}
        <motion.div 
          className="h-full bg-primary-500 relative z-20"
          initial={false}
          animate={{ width: `${percentage}%` }}
          transition={isDragging ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 30 }}
        />
      </motion.div>

      {/* Thumb (Knob) */}
      <motion.div
        className={`
          absolute top-1/2 -mt-3.5 w-7 h-7 bg-white border rounded-full flex items-center justify-center z-30
          ${isDragging ? 'border-primary-500' : 'border-gray-200'}
        `}
        initial={false}
        animate={{ 
          left: `calc(${percentage}% - 14px)`, // Center thumb (14px is half of 28px width)
          scale: isDragging ? 1.15 : (isHovered ? 1.05 : 1),
          boxShadow: isDragging 
            ? '0 0 0 4px rgba(99, 102, 241, 0.2), 0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
            : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}
        transition={isDragging ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 25 }}
      >
        {/* Inner dot */}
        <motion.div 
           className={`rounded-full ${disabled ? 'bg-gray-300' : 'bg-primary-500'}`} 
           animate={{ 
             width: isDragging ? 6 : 8, 
             height: isDragging ? 6 : 8 
           }}
        />
        
        {/* Tooltip */}
        <AnimatePresence>
          {(showTooltip && isActive) && !disabled && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: -42, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="absolute bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-xl"
            >
              {formatTooltip ? formatTooltip(value) : Math.round(value)}
              {/* Tooltip Arrow */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Slider;
