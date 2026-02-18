
import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface MasonryProps {
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  columns?: number;
  gap?: number;
  className?: string;
}

const Masonry: React.FC<MasonryProps> = ({ 
  items, 
  renderItem, 
  columns = 3, 
  gap = 24, 
  className = '' 
}) => {
  // Simple column distribution logic
  const columnWrapper = useMemo(() => {
    const cols = Array.from({ length: columns }, () => [] as any[]);
    items.forEach((item, index) => {
      cols[index % columns].push({ item, originalIndex: index });
    });
    return cols;
  }, [items, columns]);

  return (
    <div 
        className={`flex ${className}`} 
        style={{ gap: `${gap}px` }}
    >
      {columnWrapper.map((col, colIndex) => (
        <div 
            key={colIndex} 
            className="flex flex-col flex-1"
            style={{ gap: `${gap}px` }}
        >
          {col.map(({ item, originalIndex }) => (
            <motion.div
              key={originalIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "50px" }}
              transition={{ 
                  duration: 0.4, 
                  delay: (originalIndex % 5) * 0.05,
                  ease: "easeOut"
              }}
            >
              {renderItem(item, originalIndex)}
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Masonry;
