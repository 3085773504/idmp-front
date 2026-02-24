import React from 'react';
import { FolderTree, Tag, Activity, Calculator } from 'lucide-react';
import Card from '@/components/ui/Card';
import { ElementNode } from '../types';

export const RootOverviewPanel: React.FC<{ node: ElementNode }> = ({ node }) => {
  if (!node.stats) return null;
  const stats = node.stats;
  return (
    <div className="p-6 h-full flex flex-col overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{node.label} 概览</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="p-6 flex flex-col items-center justify-center text-center">
          <FolderTree className="w-8 h-8 text-indigo-500 mb-2" />
          <div className="text-3xl font-bold text-gray-900">{stats.totalElements}</div>
          <div className="text-sm text-gray-500">总元素</div>
        </Card>
        <Card className="p-6 flex flex-col items-center justify-center text-center">
          <Tag className="w-8 h-8 text-emerald-500 mb-2" />
          <div className="text-3xl font-bold text-gray-900">{stats.totalProperties}</div>
          <div className="text-sm text-gray-500">总属性</div>
        </Card>
        <Card className="p-6 flex flex-col items-center justify-center text-center">
          <Activity className="w-8 h-8 text-blue-500 mb-2" />
          <div className="text-3xl font-bold text-gray-900">{stats.totalTimeSeries}</div>
          <div className="text-sm text-gray-500">总时序</div>
        </Card>
        <Card className="p-6 flex flex-col items-center justify-center text-center">
          <Calculator className="w-8 h-8 text-purple-500 mb-2" />
          <div className="text-3xl font-bold text-gray-900">{stats.totalAnalysis}</div>
          <div className="text-sm text-gray-500">总分析</div>
        </Card>
      </div>
    </div>
  );
};
