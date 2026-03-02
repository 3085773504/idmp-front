
import React from 'react';
import { motion } from 'framer-motion';
import { BaseProps } from '../../types';

interface TableContainerProps extends BaseProps {
  children: React.ReactNode;
}

export const TableContainer: React.FC<TableContainerProps> = ({ children, className = '' }) => (
  <div className={`w-full overflow-hidden bg-white rounded-[24px] border border-gray-100 shadow-sm ring-1 ring-gray-50 ${className}`}>
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full text-left border-collapse">
        {children}
      </table>
    </div>
  </div>
);

export const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <thead className="bg-gray-50/60 border-b border-gray-100 backdrop-blur-sm">
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
    viewport={{ once: true, margin: "-10px" }}
    transition={{ duration: 0.2, delay: index * 0.03, ease: "easeOut" }}
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
  <th className={`py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap ${className}`}>
    {children}
  </th>
);

export const TableCell: React.FC<BaseProps> = ({ children, className = '' }) => (
  <td className={`py-4 px-6 text-sm text-gray-600 font-medium align-middle ${className}`}>
    {children}
  </td>
);
