
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ 
  value, 
  onChange,
  className = '' 
}) => {
  // Use the start date for initial view, or today if null
  const [currentDate, setCurrentDate] = useState(value.start || new Date());
  const [direction, setDirection] = useState(0);

  // Helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const changeMonth = (offset: number) => {
    setDirection(offset);
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setCurrentDate(newDate);
  };

  // Date Comparison Helpers
  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const isBefore = (d1: Date, d2: Date) => {
    return new Date(d1.getFullYear(), d1.getMonth(), d1.getDate()) < 
           new Date(d2.getFullYear(), d2.getMonth(), d2.getDate());
  };

  const isAfter = (d1: Date, d2: Date) => {
    return new Date(d1.getFullYear(), d1.getMonth(), d1.getDate()) > 
           new Date(d2.getFullYear(), d2.getMonth(), d2.getDate());
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    // Logic for range selection
    if (!value.start || (value.start && value.end)) {
      // Start fresh selection
      onChange({ start: clickedDate, end: null });
    } else if (value.start && !value.end) {
      if (isBefore(clickedDate, value.start)) {
        // If clicked before start, make it the new start
        onChange({ start: clickedDate, end: null });
      } else {
        // Complete the range
        onChange({ ...value, end: clickedDate });
      }
    }
  };

  const isToday = (day: number) => {
    const today = new Date();
    return isSameDay(new Date(currentDate.getFullYear(), currentDate.getMonth(), day), today);
  };

  // Animation variants
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };
  
  // Range Background Animation
  const rangeVariants = {
    hidden: { opacity: 0, scaleX: 0 },
    visible: { opacity: 1, scaleX: 1 }
  };
  const rangeTransition = { duration: 0.25, ease: "easeOut" as const };

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  
  // Generating calendar grid
  const days = [];
  // Empty slots
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-10 w-full" />);
  }
  
  // Days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), d);
    
    const isStart = value.start ? isSameDay(dateToCheck, value.start) : false;
    const isEnd = value.end ? isSameDay(dateToCheck, value.end) : false;
    
    // Check if in range (exclusive of start/end for styling logic)
    const inRange = value.start && value.end && 
                    isAfter(dateToCheck, value.start) && 
                    isBefore(dateToCheck, value.end);

    const isStartNode = isStart;
    const isEndNode = isEnd;
    const isRangeNode = inRange;
    const today = isToday(d);

    // Animation Logic:
    // The "cursor" is the active selection indicator that moves.
    const isMovingCursor = (value.end && isEndNode) || (!value.end && isStartNode);
    // The "stationary" bubble is the one left behind at the start position.
    const isStationaryBubble = value.end && isStartNode;

    days.push(
      <div key={d} className="relative h-10 w-full flex items-center justify-center p-0">
        {/* Range Connector Strips (Animated) */}
        {value.start && value.end && (
           <>
             {/* If it's the start node and not the end, connect to right (Right Half) */}
             {isStartNode && !isEndNode && (
               <motion.div 
                 variants={rangeVariants}
                 initial="hidden"
                 animate="visible"
                 transition={rangeTransition}
                 style={{ originX: 0 }} // Grow from center to right
                 className="absolute right-0 top-1 bottom-1 w-1/2 bg-primary-50/80" 
               />
             )}
             {/* If it's the end node and not the start, connect to left (Left Half) */}
             {isEndNode && !isStartNode && (
               <motion.div 
                 variants={rangeVariants}
                 initial="hidden"
                 animate="visible"
                 transition={rangeTransition}
                 style={{ originX: 0 }} // Grow from left edge to center
                 className="absolute left-0 top-1 bottom-1 w-1/2 bg-primary-50/80" 
               />
             )}
             {/* If strictly inside range, fill full width */}
             {isRangeNode && (
               <motion.div 
                 variants={rangeVariants}
                 initial="hidden"
                 animate="visible"
                 transition={rangeTransition}
                 style={{ originX: 0 }} // Grow from left to right
                 className="absolute inset-x-0 top-1 bottom-1 bg-primary-50/80" 
               />
             )}
           </>
        )}

        <button
          onClick={() => handleDateClick(d)}
          className="relative h-10 w-10 flex items-center justify-center text-sm font-medium rounded-full outline-none z-10 transition-transform active:scale-95"
        >
          {/* Moving Cursor (The active selector) */}
          {isMovingCursor && (
            <motion.div
              layoutId="range-selection-cursor"
              className="absolute inset-0 bg-primary-600 rounded-full shadow-md shadow-primary-500/30 z-0"
              initial={false}
              transition={{ 
                type: "spring", 
                stiffness: 380, 
                damping: 25 
              }}
            />
          )}

          {/* Stationary Anchor (Left behind when extending range) */}
          {isStationaryBubble && (
            <motion.div
              className="absolute inset-0 bg-primary-600 rounded-full shadow-md shadow-primary-500/30 z-0"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.3,
                ease: "easeOut"
              }}
            />
          )}
          
          <span className={`relative z-10 ${isStartNode || isEndNode ? 'text-white font-bold' : (isRangeNode ? 'text-primary-900 font-semibold' : (today ? 'text-primary-600 font-bold' : 'text-gray-700 hover:bg-gray-100 rounded-full'))}`}>
            {d}
          </span>
          
          {/* Today Indicator (if not selected) */}
          {today && !isStartNode && !isEndNode && !isRangeNode && (
            <div className="absolute bottom-1.5 w-1 h-1 bg-primary-500 rounded-full" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 w-full max-w-[320px] overflow-hidden select-none ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 ml-2">
          {currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月
        </h3>
        <div className="flex gap-1">
          <button 
            onClick={() => changeMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => changeMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="h-8 flex items-center justify-center text-xs font-semibold text-gray-400">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="relative h-[250px]">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentDate.getMonth()}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
            className="grid grid-cols-7 gap-y-1 absolute inset-0 w-full"
          >
            {days}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DateRangePicker;
