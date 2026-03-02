
import React, { useId } from 'react';
import { motion } from 'framer-motion';
import { BaseProps } from '../../types';

interface TabOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps extends BaseProps {
  options: TabOption[];
  activeId: string;
  onChange: (id: string) => void;
  size?: 'sm' | 'md';
  variant?: 'segmented' | 'pills' | 'underline';
}

const Tabs: React.FC<TabsProps> = ({
  options,
  activeId,
  onChange,
  size = 'md',
  variant = 'segmented',
  className = '',
}) => {
  const uniqueId = useId(); 
  const layoutId = `tabs-bg-${uniqueId}`;
  
  // Adjust padding based on size and variant
  let itemPadding = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-5 py-2 text-sm';
  if (variant === 'underline') {
      itemPadding = size === 'sm' ? 'px-3 py-3 text-xs' : 'px-5 py-4 text-sm';
  }
  
  // Container Layout
  let containerClasses = `inline-flex items-center justify-center rounded-xl select-none relative ${className}`;
  
  if (variant === 'segmented') {
      containerClasses = `inline-flex items-center justify-center rounded-xl select-none relative bg-gray-100/80 p-1 ${className}`;
  } else if (variant === 'pills') {
      containerClasses = `inline-flex items-center justify-center rounded-xl select-none relative gap-2 ${className}`;
  } else if (variant === 'underline') {
      // Underline typically takes full width or is left aligned
      containerClasses = `flex items-center gap-6 border-b border-gray-100 w-full select-none relative ${className}`;
  }
  
  return (
    <div className={containerClasses}>
      {options.map((option) => {
        const isActive = activeId === option.id;
        
        let itemClasses = `relative flex items-center justify-center gap-2 font-semibold transition-colors duration-200 z-10 group outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 ${itemPadding}`;
        
        if (variant === 'underline') {
            itemClasses += isActive ? ' text-primary-600' : ' text-gray-500 hover:text-gray-700';
        } else {
            itemClasses += ` rounded-[10px]`;
            itemClasses += isActive ? ' text-gray-900' : ' text-gray-500 hover:text-gray-700';
        }

        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            type="button"
            className={itemClasses}
            style={{
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {/* Active Background / Indicator Layer */}
            {isActive && (
              <motion.div
                layoutId={layoutId}
                className={`
                  absolute z-0
                  ${variant === 'segmented' ? 'inset-0 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] rounded-[10px]' : ''}
                  ${variant === 'pills' ? 'inset-0 bg-primary-50 rounded-xl' : ''}
                  ${variant === 'underline' ? 'left-0 right-0 -bottom-[1px] h-[2px] bg-primary-600' : ''}
                `}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
              />
            )}

            {/* Content Layer (Relative z-10 to sit above background) */}
            <span className="relative z-10 flex items-center gap-2">
              {option.icon && (
                <span className={`flex items-center justify-center transition-colors duration-200 ${isActive ? (variant === 'underline' ? 'text-primary-600' : 'text-gray-900') : 'text-gray-500 group-hover:text-gray-600'}`}>
                  {option.icon}
                </span>
              )}
              <span>{option.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
