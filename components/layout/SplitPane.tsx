
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MoreVertical } from 'lucide-react';

interface SplitPaneProps {
  children: [React.ReactNode, React.ReactNode];
  initialLeftWidth?: number; // pixel width
  minLeftWidth?: number;
  maxLeftWidth?: number;
  className?: string;
}

const SplitPane: React.FC<SplitPaneProps> = ({
  children,
  initialLeftWidth = 300,
  minLeftWidth = 200,
  maxLeftWidth = 600,
  className = ''
}) => {
  const [leftWidth, setLeftWidth] = useState(initialLeftWidth);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newWidth = e.clientX - containerRect.left;

    if (newWidth >= minLeftWidth && newWidth <= maxLeftWidth) {
      setLeftWidth(newWidth);
    }
  }, [isDragging, minLeftWidth, maxLeftWidth]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none'; // Prevent text selection
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div 
      ref={containerRef} 
      className={`flex h-full w-full overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm ${className}`}
    >
      {/* Left Pane */}
      <div style={{ width: leftWidth }} className="h-full shrink-0 overflow-hidden relative z-0">
        <div className="h-full w-full overflow-y-auto custom-scrollbar">
            {children[0]}
        </div>
      </div>

      {/* Resizer Handle */}
      <div
        onMouseDown={handleMouseDown}
        className={`
            w-4 -ml-2 h-full cursor-col-resize z-10 flex items-center justify-center group relative outline-none
        `}
      >
        {/* Visual Line */}
        <div className={`
            w-[1px] h-full transition-colors duration-200
            ${isDragging ? 'bg-primary-500' : 'bg-gray-200 group-hover:bg-primary-300'}
        `} />
        
        {/* Grab Handle Pill */}
        <div className={`
            absolute w-1 h-8 rounded-full transition-all duration-200 flex items-center justify-center
            ${isDragging 
                ? 'bg-primary-600 scale-y-125 shadow-[0_0_10px_rgba(99,102,241,0.5)] w-1.5' 
                : 'bg-transparent group-hover:bg-gray-300'}
        `} />
      </div>

      {/* Right Pane */}
      <div className="flex-1 h-full min-w-0 overflow-hidden bg-gray-50/50">
         <div className="h-full w-full overflow-y-auto custom-scrollbar">
            {children[1]}
         </div>
      </div>
    </div>
  );
};

export default SplitPane;
