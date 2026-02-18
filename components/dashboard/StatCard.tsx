import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Card from '../ui/Card';
import { Stat } from '../../types';

interface StatCardProps {
  stat: Stat;
  index: number;
}

const StatCard: React.FC<StatCardProps> = ({ stat, index }) => {
  const isPositive = stat.change >= 0;

  return (
    <Card 
      hoverEffect 
      className="flex flex-col justify-between"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 bg-gray-50 rounded-xl">
          <stat.icon className="w-5 h-5 text-gray-600" />
        </div>
        <div className={`
          flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-lg
          ${isPositive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}
        `}>
          {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          <span>{Math.abs(stat.change)}%</span>
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium mb-1">{stat.label}</p>
        <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{stat.value}</h3>
      </div>
    </Card>
  );
};

export default StatCard;