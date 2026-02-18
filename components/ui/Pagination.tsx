
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MoreHorizontal, CornerDownLeft } from 'lucide-react';
import { BaseProps } from '../../types';

interface PaginationProps extends BaseProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showJumpTo?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  showJumpTo = false,
  className = '' 
}) => {
  const [jumpPage, setJumpPage] = useState('');

  // Helper to generate page numbers with consistent count (7 items when possible)
  const getPageNumbers = () => {
    // Case 1: Total pages is small, show all
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const showLeftEllipsis = currentPage > 4;
    const showRightEllipsis = currentPage < totalPages - 3;

    // Case 2: Start of range
    if (!showLeftEllipsis && showRightEllipsis) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }

    // Case 3: End of range
    if (showLeftEllipsis && !showRightEllipsis) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    // Case 4: Middle of range
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const pages = getPageNumbers();

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(jumpPage);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page);
      setJumpPage('');
    }
  };

  return (
    <div className={`flex flex-wrap items-center gap-4 select-none ${className}`}>
      {/* Pager Controls */}
      <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm h-12 box-border">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-primary-50 hover:text-primary-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-all text-gray-500"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Reduced padding to align height with 36px (h-9) buttons */}
        <div className="flex items-center bg-gray-50/80 p-0.5 rounded-xl h-9 box-border">
          {pages.map((page, index) => {
            if (page === '...') {
              return (
                <div key={`ellipsis-${index}`} className="w-8 h-8 flex items-center justify-center text-gray-400">
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </div>
              );
            }

            const pageNum = page as number;
            const isActive = pageNum === currentPage;
            
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`
                  relative w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-all z-10
                  ${isActive 
                    ? 'text-primary-600' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'}
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="pagination-active-bg"
                    className="absolute inset-0 bg-white shadow-sm ring-1 ring-gray-200/50 rounded-lg -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-primary-50 hover:text-primary-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-all text-gray-500"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Jump To Section */}
      {showJumpTo && (
        <form 
          onSubmit={handleJumpSubmit} 
          className="flex items-center gap-2 bg-white p-1.5 pl-4 pr-1.5 rounded-2xl border border-gray-100 shadow-sm h-12 box-border"
        >
           <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">跳至</span>
           <input 
             type="text"
             value={jumpPage}
             onChange={(e) => setJumpPage(e.target.value.replace(/[^0-9]/g, ''))}
             className="w-10 h-9 rounded-lg bg-gray-50 text-center text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-primary-500/20 transition-all placeholder-gray-300"
             placeholder="..."
           />
           <span className="text-xs font-semibold text-gray-400 px-1">/ {totalPages} 页</span>
           <button 
             type="submit"
             disabled={!jumpPage}
             className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:bg-gray-100 disabled:text-gray-300 transition-colors shadow-sm shadow-primary-500/20"
           >
              <CornerDownLeft className="w-4 h-4" />
           </button>
        </form>
      )}
    </div>
  );
};

export default Pagination;
