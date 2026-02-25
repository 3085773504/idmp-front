import React, { useState } from 'react';
import { 
  ChevronLeft, Star, Edit2, Copy, History, Trash2, Search, Info, 
  ArrowUp, ArrowDown, ArrowUpToLine, Database, ExternalLink, Shield, FolderTree 
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Tabs from '@/components/ui/Tabs';
import Badge from '@/components/ui/Badge';
import Pagination from '@/components/ui/Pagination';
import { ElementNode, Property } from '../types';

interface ElementDetailPanelProps {
  node: ElementNode;
  properties: Property[];
  breadcrumbs: ElementNode[];
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
  onSelectProperty: (prop: Property) => void;
  onChildAction: (action: string, childId: string) => void;
  onOpenModal: (type: string, payload?: any) => void;
  
  // Child List Props
  childSearchKeyword: string;
  setChildSearchKeyword: (val: string) => void;
  childCategoryFilter: string;
  setChildCategoryFilter: (val: string) => void;
  childTemplateFilter: string;
  setChildTemplateFilter: (val: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  filteredChildren: ElementNode[];
  paginatedChildren: ElementNode[];
  availableCategories: string[];
  availableTemplates: string[];
}

export const ElementDetailPanel: React.FC<ElementDetailPanelProps> = ({
  node, properties, breadcrumbs,
  onBack, onEdit, onDelete, onToggleFavorite,
  onSelectProperty, onChildAction, onOpenModal,
  childSearchKeyword, setChildSearchKeyword,
  childCategoryFilter, setChildCategoryFilter,
  childTemplateFilter, setChildTemplateFilter,
  currentPage, setCurrentPage, pageSize,
  filteredChildren, paginatedChildren,
  availableCategories, availableTemplates
}) => {
  const [activeTab, setActiveTab] = useState('children');

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top Actions */}
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" isIconOnly onClick={onBack}><ChevronLeft className="w-4 h-4" /></Button>
          <h2 className="text-xl font-bold text-gray-900">{node.label}</h2>
          {node.isFavorite && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" leftIcon={<Edit2 className="w-4 h-4" />} onClick={onEdit}>编辑</Button>
          <Button variant="ghost" size="sm" leftIcon={<Star className="w-4 h-4" />} onClick={onToggleFavorite}>{node.isFavorite ? '取消收藏' : '收藏'}</Button>
          <Button variant="ghost" size="sm" leftIcon={<Copy className="w-4 h-4" />} onClick={() => onOpenModal('ADD_TEMPLATE')}>加入模板</Button>
          <Button variant="ghost" size="sm" leftIcon={<History className="w-4 h-4" />} onClick={() => onOpenModal('HISTORY')}>历史趋势</Button>
          <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700" leftIcon={<Trash2 className="w-4 h-4" />} onClick={onDelete}>删除</Button>
        </div>
      </div>

      {/* Main Info - Fixed Order: Path, Category, Template, Description, Location, Additional, Default */}
      <div className="p-6 bg-gray-50/50 border-b border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm shrink-0">
        <div className="col-span-2 md:col-span-4"><span className="text-gray-500">完整路径:</span> <span className="font-mono ml-2">{node.path}</span></div>
        <div><span className="text-gray-500">分类:</span> <span className="ml-2">{node.category || '-'}</span></div>
        <div><span className="text-gray-500">模板:</span> <span className="ml-2">{node.template || '-'}</span></div>
        <div><span className="text-gray-500">描述:</span> <span className="ml-2">{node.description || '-'}</span></div>
        <div><span className="text-gray-500">默认属性:</span> <span className="ml-2">{node.defaultProperties || '-'}</span></div>
        {/* Location */}
        {node.location && Object.entries(node.location).map(([k, v]) => (
          <div key={k}><span className="text-gray-500">位置({k}):</span> <span className="ml-2">{v}</span></div>
        ))}
        {/* Additional Properties */}
        {node.additionalProperties && Object.entries(node.additionalProperties).map(([k, v]) => (
          <div key={k}><span className="text-gray-500">{k}:</span> <span className="ml-2">{v}</span></div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 pt-2 border-b border-gray-100 shrink-0">
          <Tabs 
            options={[
              { id: 'children', label: '子元素列表' },
              { id: 'properties', label: '属性列表' },
              { id: 'info', label: '信息标签' }
            ]}
            activeId={activeTab}
            onChange={setActiveTab}
            variant="underline"
          />
        </div>
        <div className="flex-1 overflow-hidden">
          {activeTab === 'children' && (
            <ChildElementsTab 
              paginatedChildren={paginatedChildren}
              onAction={onChildAction}
              searchKeyword={childSearchKeyword}
              setSearchKeyword={setChildSearchKeyword}
              categoryFilter={childCategoryFilter}
              setCategoryFilter={setChildCategoryFilter}
              templateFilter={childTemplateFilter}
              setTemplateFilter={setChildTemplateFilter}
              availableCategories={availableCategories}
              availableTemplates={availableTemplates}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalItems={filteredChildren.length}
              pageSize={pageSize}
            />
          )}
          {activeTab === 'properties' && <PropertiesTab properties={properties} onSelectProperty={onSelectProperty} />}
          {activeTab === 'info' && <InfoTab breadcrumbs={breadcrumbs} />}
        </div>
      </div>
    </div>
  );
};

interface ChildElementsTabProps {
  paginatedChildren: ElementNode[];
  onAction: (action: string, id: string) => void;
  searchKeyword: string;
  setSearchKeyword: (val: string) => void;
  categoryFilter: string;
  setCategoryFilter: (val: string) => void;
  templateFilter: string;
  setTemplateFilter: (val: string) => void;
  availableCategories: string[];
  availableTemplates: string[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalItems: number;
  pageSize: number;
}

const ChildElementsTab = ({ 
  paginatedChildren, onAction,
  searchKeyword, setSearchKeyword,
  categoryFilter, setCategoryFilter,
  templateFilter, setTemplateFilter,
  availableCategories, availableTemplates,
  currentPage, setCurrentPage, totalItems, pageSize
}: ChildElementsTabProps) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className="p-6 flex flex-col h-full overflow-hidden">
      {/* Toolbar */}
      <div className="flex gap-2 mb-4 shrink-0">
        <div className="w-48">
          <Input 
            value={searchKeyword}
            onChange={setSearchKeyword}
            placeholder="关键字搜索..." 
            size="sm"
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="w-32">
          <Select 
            value={categoryFilter} 
            onChange={setCategoryFilter} 
            size="sm"
            options={[{value: '', label: '全部分类'}, ...availableCategories.map(c => ({value: c, label: c}))]} 
          />
        </div>
        <div className="w-32">
          <Select 
            value={templateFilter} 
            onChange={setTemplateFilter} 
            size="sm"
            options={[{value: '', label: '全部模板'}, ...availableTemplates.map(t => ({value: t, label: t}))]} 
          />
        </div>
      </div>
      {/* Table */}
      <div className="flex-1 overflow-auto border border-gray-200 rounded-lg custom-scrollbar">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-500">名称</th>
              <th className="px-4 py-3 font-medium text-gray-500">路径</th>
              <th className="px-4 py-3 font-medium text-gray-500">分类</th>
              <th className="px-4 py-3 font-medium text-gray-500">引用类型</th>
              <th className="px-4 py-3 font-medium text-gray-500">描述</th>
              <th className="px-4 py-3 font-medium text-gray-500">模板</th>
              <th className="px-4 py-3 font-medium text-gray-500">附加属性(动态)</th>
              <th className="px-4 py-3 font-medium text-gray-500 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedChildren.length > 0 ? paginatedChildren.map(child => (
              <tr key={child.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{child.label}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{child.path}</td>
                <td className="px-4 py-3">{child.category || '-'}</td>
                <td className="px-4 py-3 text-gray-500">直接子节点</td>
                <td className="px-4 py-3 text-gray-500 truncate max-w-[150px]">{child.description || '-'}</td>
                <td className="px-4 py-3 text-gray-500">{child.template || '-'}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {child.additionalProperties ? Object.entries(child.additionalProperties).map(([k, v]) => (
                    <div key={k} className="truncate max-w-[120px]" title={`${k}: ${v}`}>{k}: {v}</div>
                  )) : '-'}
                </td>
                <td className="px-4 py-3 flex justify-end gap-1">
                  <Button variant="ghost" size="sm" isIconOnly title="详情" onClick={() => onAction('detail', child.id)}><Info className="w-4 h-4 text-gray-400 hover:text-indigo-600" /></Button>
                  <Button variant="ghost" size="sm" isIconOnly title="编辑" onClick={() => onAction('edit', child.id)}><Edit2 className="w-4 h-4 text-gray-400 hover:text-indigo-600" /></Button>
                  <Button variant="ghost" size="sm" isIconOnly title="复制" onClick={() => onAction('copy', child.id)}><Copy className="w-4 h-4 text-gray-400 hover:text-indigo-600" /></Button>
                  <Button variant="ghost" size="sm" isIconOnly title="上移" onClick={() => onAction('up', child.id)}><ArrowUp className="w-4 h-4 text-gray-400 hover:text-indigo-600" /></Button>
                  <Button variant="ghost" size="sm" isIconOnly title="下移" onClick={() => onAction('down', child.id)}><ArrowDown className="w-4 h-4 text-gray-400 hover:text-indigo-600" /></Button>
                  <Button variant="ghost" size="sm" isIconOnly title="移顶" onClick={() => onAction('top', child.id)}><ArrowUpToLine className="w-4 h-4 text-gray-400 hover:text-indigo-600" /></Button>
                  <Button variant="ghost" size="sm" isIconOnly title="删除" onClick={() => onAction('delete', child.id)}><Trash2 className="w-4 h-4 text-gray-400 hover:text-red-600" /></Button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400">暂无子元素</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-500 shrink-0">
        <span>共 {totalItems} 条记录</span>
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          showJumpTo
        />
      </div>
    </div>
  );
};

const PropertiesTab = ({ properties, onSelectProperty }: { properties: Property[], onSelectProperty: (p: Property) => void }) => {
  return (
    <div className="p-6 h-full overflow-auto custom-scrollbar">
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map(p => (
            <Card key={p.id} className="p-4 hover:border-indigo-300 cursor-pointer transition-colors" onClick={() => onSelectProperty(p)}>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-gray-900">{p.name}</h4>
                <Badge variant="neutral">{p.valueType}</Badge>
              </div>
              <div className="text-sm text-gray-500 font-mono mb-4 truncate" title={p.path}>{p.path}</div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">{p.referenceType}</span>
                <span className="font-bold text-indigo-600">{p.displayValue || '-'}</span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-gray-400">
          <Database className="w-12 h-12 mb-2 opacity-20" />
          <p>暂无属性配置</p>
        </div>
      )}
    </div>
  );
};

const InfoTab = ({ breadcrumbs }: { breadcrumbs: ElementNode[] }) => {
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full custom-scrollbar">
      <Card className="p-4">
        <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-900"><FileTextIcon /> 关联文档</h3>
        <ul className="space-y-2 text-sm">
          <li><a href="#" className="text-indigo-600 hover:underline flex items-center gap-1"><ExternalLink className="w-3 h-3" /> 设备操作手册 v2.pdf</a></li>
          <li><a href="#" className="text-indigo-600 hover:underline flex items-center gap-1"><ExternalLink className="w-3 h-3" /> 维护记录_2024.xlsx</a></li>
        </ul>
      </Card>
      <Card className="p-4">
        <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-900"><Info className="w-4 h-4 text-blue-500" /> 注释</h3>
        <p className="text-sm text-gray-600">该设备于2024年1月进行过大修，更换了主轴轴承。目前运行状态良好，需注意定期检查润滑油位。</p>
      </Card>
      <Card className="p-4">
        <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-900"><FolderTree className="w-4 h-4 text-emerald-500" /> 父链</h3>
        <div className="text-sm text-gray-600 flex items-center gap-2 flex-wrap">
          {breadcrumbs.map((node, index) => (
            <React.Fragment key={node.id}>
              <Badge variant={index === breadcrumbs.length - 1 ? 'primary' : 'neutral'}>{node.label}</Badge>
              {index < breadcrumbs.length - 1 && <ChevronLeft className="w-4 h-4 rotate-180 text-gray-400" />}
            </React.Fragment>
          ))}
        </div>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4 bg-gray-50 border-dashed">
          <h3 className="font-bold mb-2 flex items-center gap-2 text-gray-500"><Shield className="w-4 h-4" /> 安全配置</h3>
          <ul className="text-xs text-gray-500 space-y-1">
            <li className="flex justify-between"><span>访问级别:</span> <span className="font-medium text-gray-700">Level 3</span></li>
            <li className="flex justify-between"><span>最后审计:</span> <span className="font-medium text-gray-700">2024-02-15</span></li>
            <li className="flex justify-between"><span>加密状态:</span> <span className="text-green-600">已启用</span></li>
          </ul>
        </Card>
        <Card className="p-4 bg-gray-50 border-dashed">
          <h3 className="font-bold mb-2 flex items-center gap-2 text-gray-500"><History className="w-4 h-4" /> 版本历史</h3>
          <ul className="text-xs text-gray-500 space-y-1">
            <li className="flex justify-between"><span>v2.1.0</span> <span className="text-gray-400">2024-01-10</span></li>
            <li className="flex justify-between"><span>v2.0.5</span> <span className="text-gray-400">2023-12-05</span></li>
            <li className="flex justify-between"><span>v1.9.8</span> <span className="text-gray-400">2023-11-20</span></li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

// Helper component for icon
const FileTextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
);
