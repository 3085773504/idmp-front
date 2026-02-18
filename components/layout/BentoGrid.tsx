
import React from 'react';
import { motion } from 'framer-motion';

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

interface BentoItemProps {
  children: React.ReactNode;
  colSpan?: 1 | 2 | 3 | 4;
  rowSpan?: 1 | 2 | 3 | 4;
  className?: string;
  title?: string;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ children, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-4 auto-rows-[minmax(180px,auto)] gap-6 ${className}`}>
      {children}
    </div>
  );
};

export const BentoItem: React.FC<BentoItemProps> = ({ 
  children, 
  colSpan = 1, 
  rowSpan = 1, 
  className = '',
  title
}) => {
  const colSpanClass = {
    1: 'md:col-span-1',
    2: 'md:col-span-2',
    3: 'md:col-span-3',
    4: 'md:col-span-4',
  };

  const rowSpanClass = {
    1: 'md:row-span-1',
    2: 'md:row-span-2',
    3: 'md:row-span-3',
    4: 'md:row-span-4',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`
        relative overflow-hidden rounded-[2rem] bg-white border border-gray-100 shadow-sm
        flex flex-col
        ${colSpanClass[colSpan]} 
        ${rowSpanClass[rowSpan]} 
        ${className}
      `}
    >
      {title && (
          <div className="absolute top-6 left-6 z-20">
              <h4 className="text-lg font-bold text-gray-900">{title}</h4>
          </div>
      )}
      <div className="h-full w-full">
        {children}
      </div>
    </motion.div>
  );
};
