import React from 'react';
import { FolderTree, Plus, Search, RefreshCw } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import Tree, { TreeNode } from '@/components/ui/Tree';
import { Dimension, ElementNode, ViewState } from '../types';

interface CatalogTreePanelProps {
  dimension: Dimension;
  setDimension: (d: Dimension) => void;
  categoryFilter: string;
  setCategoryFilter: (f: string) => void;
  viewState: ViewState;
  handleRefresh: () => void;
  filteredTreeData: ElementNode[];
  selectedNode: ElementNode | null;
  handleSelectNode: (node: TreeNode) => void;
  onCreateElement: () => void;
  expandedIds: Set<string>;
}

export const CatalogTreePanel: React.FC<CatalogTreePanelProps> = ({
  dimension, setDimension, categoryFilter, setCategoryFilter, viewState,
  handleRefresh, filteredTreeData, selectedNode, handleSelectNode, onCreateElement, expandedIds
}) => {
  return (
    <Card className="w-full md:w-80 flex flex-col p-0 overflow-hidden shrink-0 h-[calc(100vh-8rem)]">
      <div className="p-4 border-b border-gray-100 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-indigo-600" />
            数据目录
          </h3>
          <Button variant="ghost" size="sm" isIconOnly onClick={onCreateElement}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex gap-2 items-center">
          <div className="flex-1">
            <Select 
              value={dimension} 
              onChange={(val) => setDimension(val as Dimension)}
              size="sm"
              options={[
                { value: 'PHYSICAL', label: '物理维度' },
                { value: 'FUNCTION', label: '功能维度' },
                { value: 'ASSET', label: '资产维度' }
              ]}
            />
          </div>
          <Button variant="secondary" className="!w-[36px] !h-[36px] !min-h-0 !min-w-0 !p-0" isIconOnly onClick={handleRefresh}>
            <RefreshCw className={`w-4 h-4 ${viewState === 'LOADING' ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className="relative">
          <Input 
            value={categoryFilter}
            onChange={(val) => setCategoryFilter(val)}
            placeholder="按类别过滤..." 
            size="sm"
            icon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar relative">
        {viewState === 'LOADING' ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredTreeData.length > 0 ? (
          <Tree 
            data={filteredTreeData} 
            selectedId={selectedNode?.id}
            onSelect={handleSelectNode}
            variant="timeseries"
            defaultExpandedIds={Array.from(expandedIds)}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <FolderTree className="w-12 h-12 mb-2 opacity-20" />
            <p className="text-sm">暂无数据</p>
          </div>
        )}
      </div>
    </Card>
  );
};
