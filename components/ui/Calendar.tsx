
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
  className?: string;
}

const Calendar: React.FC<CalendarProps> = ({ 
  value = new Date(), 
  onChange,
  className = '' 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date(value));
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

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    onChange?.(newDate);
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const isToday = (day: number) => {
    const today = new Date();
    return isSameDay(new Date(currentDate.getFullYear(), currentDate.getMonth(), day), today);
  };

  const isSelected = (day: number) => {
    return isSameDay(new Date(currentDate.getFullYear(), currentDate.getMonth(), day), value);
  };

  // Animation variants
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  
  // Generating calendar grid
  const days = [];
  // Empty slots for previous month
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
  }
  // Days of current month
  for (let d = 1; d <= daysInMonth; d++) {
    const selected = isSelected(d);
    const today = isToday(d);
    
    days.push(
      <button
        key={d}
        onClick={() => handleDateClick(d)}
        className="relative h-10 w-10 flex items-center justify-center text-sm font-medium rounded-full transition-colors outline-none z-10"
      >
        {selected && (
          <motion.div
            layoutId="calendar-selection"
            className="absolute inset-0 bg-primary-600 rounded-full -z-10 shadow-lg shadow-primary-500/30"
            initial={false}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
        
        <span className={`relative z-10 ${selected ? 'text-white font-bold' : (today ? 'text-primary-600 font-bold' : 'text-gray-700 hover:bg-gray-100 rounded-full')}`}>
          {d}
        </span>
        
        {/* Today Indicator Dot */}
        {today && !selected && (
          <div className="absolute bottom-1.5 w-1 h-1 bg-primary-500 rounded-full" />
        )}
      </button>
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
          <div key={day} className="h-10 flex items-center justify-center text-xs font-semibold text-gray-400">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid with Animation */}
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

export default Calendar;
