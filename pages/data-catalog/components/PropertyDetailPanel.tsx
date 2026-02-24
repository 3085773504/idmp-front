import React from 'react';
import { ChevronLeft, Edit2, History, LineChart, Trash2, Download } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Property } from '../types';

interface PropertyDetailPanelProps {
  property: Property;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onOpenModal: (type: string, payload?: any) => void;
}

export const PropertyDetailPanel: React.FC<PropertyDetailPanelProps> = ({
  property: p, onBack, onEdit, onDelete, onOpenModal
}) => {
  return (
    <div className="flex flex-col h-full overflow-y-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" isIconOnly onClick={onBack}><ChevronLeft className="w-4 h-4" /></Button>
        <h2 className="text-xl font-bold text-gray-900">{p.name} <span className="text-sm font-normal text-gray-500 ml-2">(属性详情)</span></h2>
        <div className="ml-auto flex gap-2">
          <Button variant="secondary" size="sm" leftIcon={<Edit2 className="w-4 h-4" />} onClick={onEdit}>编辑</Button>
          <Button variant="secondary" size="sm" leftIcon={<History className="w-4 h-4" />} onClick={() => onOpenModal('INFO', { message: '查看历史值' })}>历史值</Button>
          <Button variant="secondary" size="sm" leftIcon={<LineChart className="w-4 h-4" />} onClick={() => onOpenModal('INFO', { message: '查看趋势' })}>趋势</Button>
          <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700" leftIcon={<Trash2 className="w-4 h-4" />} onClick={onDelete}>删除</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4 h-full">
          <h3 className="font-bold mb-4 border-b pb-2">基本信息</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">属性路径:</span> <span className="font-mono">{p.path}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">值类型:</span> <span>{p.valueType} {p.length ? `(${p.length})` : ''}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">数据引用类型:</span> <span>{p.referenceType}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">显示值:</span> 
              {p.isFile ? (
                <a href={p.fileUrl} className="text-indigo-600 hover:underline flex items-center gap-1">
                  {p.displayValue} <Download className="w-3 h-3" />
                </a>
              ) : (
                <span className="font-bold text-indigo-600">{p.displayValue || '-'}</span>
              )}
            </div>
            <div className="flex justify-between"><span className="text-gray-500">默认值:</span> <span>{p.defaultValue || '-'}</span></div>
          </div>
        </Card>

        <Card className="p-4 h-full">
          <h3 className="font-bold mb-4 border-b pb-2">配置标志</h3>
          <div className="flex gap-4">
            <Badge variant={p.flags.constant ? 'primary' : 'neutral'}>Constant</Badge>
            <Badge variant={p.flags.excluded ? 'primary' : 'neutral'}>Excluded</Badge>
            <Badge variant={p.flags.hidden ? 'primary' : 'neutral'}>Hidden</Badge>
          </div>
        </Card>

        {p.limits && (
          <Card className="p-4 h-full">
            <h3 className="font-bold mb-4 border-b pb-2">限值配置</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">上限 (High):</span> <span>{p.limits.high}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">下限 (Low):</span> <span>{p.limits.low}</span></div>
            </div>
          </Card>
        )}

        {p.prediction && (
          <Card className="p-4 h-full">
            <h3 className="font-bold mb-4 border-b pb-2">预测配置</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">算法:</span> <span>{p.prediction.algorithm}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">协变量:</span> <span>{p.prediction.covariables.join(', ')}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">采样间隔:</span> <span>{p.prediction.samplingInterval}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">历史窗口:</span> <span>{p.prediction.historical}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">预测窗口:</span> <span>{p.prediction.future}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">置信度:</span> <span>{p.prediction.confidence * 100}%</span></div>
            </div>
          </Card>
        )}

        {p.additionalProperties && (
          <Card className="p-4 md:col-span-2 h-full">
            <h3 className="font-bold mb-4 border-b pb-2">附加属性</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {Object.entries(p.additionalProperties).map(([k, v]) => (
                <div key={k}><span className="text-gray-500">{k}:</span> {v}</div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
