
import React from 'react';
import { motion } from 'framer-motion';
import { BaseProps } from '../../types';

interface TableContainerProps extends BaseProps {
  children: React.ReactNode;
}

export const TableContainer: React.FC<TableContainerProps> = ({ children, className = '' }) => (
  <div className={`w-full overflow-hidden bg-white rounded-lg border border-gray-100 shadow-sm ring-1 ring-gray-50 flex flex-col ${className}`}>
    <div className="overflow-auto custom-scrollbar flex-1 relative">
      <table className="w-full text-left border-collapse">
        {children}
      </table>
    </div>
  </div>
);

export const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <thead className="bg-gray-50/60 border-b border-gray-100 backdrop-blur-sm sticky top-0 z-10">
    {children}
  </thead>
);

export const TableBody: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <tbody className="divide-y divide-gray-50">
    {children}
  </tbody>
);

interface TableRowProps {
  children: React.ReactNode;
  onClick?: () => void;
  index?: number; // For staggered animation
}

export const TableRow: React.FC<TableRowProps> = ({ children, onClick, index = 0 }) => (
  <motion.tr 
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "0px" }}
    transition={{ 
      duration: 0.2, 
      delay: Math.min(index * 0.02, 0.3), // Cap delay to avoid long waits for bottom rows
      ease: "easeOut" 
    }}
    onClick={onClick}
    className={`
      group transition-colors duration-200
      ${onClick 
        ? 'cursor-pointer hover:bg-primary-50/50 active:bg-primary-100/50' 
        : 'hover:bg-gray-50/50'}
    `}
  >
    {children}
  </motion.tr>
);

export const TableHead: React.FC<BaseProps> = ({ children, className = '' }) => (
  <th className={`py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap bg-gray-50/80 backdrop-blur-md ${className}`}>
    {children}
  </th>
);

export const TableCell: React.FC<BaseProps> = ({ children, className = '' }) => (
  <td className={`py-2.5 px-4 text-sm text-gray-600 font-medium align-middle whitespace-nowrap border-b border-gray-50 last:border-0 ${className}`}>
    {children}
  </td>
);
