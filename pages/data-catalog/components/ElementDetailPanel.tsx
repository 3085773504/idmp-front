import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, Star, Edit2, Copy, History, Trash2, Search, Info, 
  ArrowUp, ArrowDown, ArrowUpToLine, Database, ExternalLink, Shield, FolderTree,
  FileText as FileTextIcon
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Tabs from '@/components/ui/Tabs';
import Badge from '@/components/ui/Badge';
import Pagination from '@/components/ui/Pagination';
import { 
  TableContainer, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/Table';
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
  
  // New action props
  onUpdateMetadata?: (data: Partial<ElementNode>) => void;
  onUpdateDataSource?: (data: ElementNode['dataSourceBinding']) => void;
  onApplyTemplate?: (templateId: string) => void;
  onCreateProperty?: (property: Property) => void;
  onAddReference?: (refData: any) => void;
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
  availableCategories, availableTemplates,
  onUpdateMetadata, onUpdateDataSource, onApplyTemplate, onCreateProperty, onAddReference
}) => {
  const [activeTab, setActiveTab] = useState('children');
  
  // Metadata Edit State
  const [isEditingMetadata, setIsEditingMetadata] = useState(false);
  const [editForm, setEditForm] = useState({
    description: node.description || '',
    category: node.category || '',
    additionalProperties: JSON.stringify(node.additionalProperties || {}, null, 2)
  });

  // Data Source Edit State
  const [isEditingDataSource, setIsEditingDataSource] = useState(false);
  const [dsForm, setDsForm] = useState({
    type: node.dataSourceBinding?.type || 'IoTDB',
    sourcePath: node.dataSourceBinding?.sourcePath || ''
  });

  // Sync state when node changes
  React.useEffect(() => {
    setEditForm({
      description: node.description || '',
      category: node.category || '',
      additionalProperties: JSON.stringify(node.additionalProperties || {}, null, 2)
    });
    setDsForm({
      type: node.dataSourceBinding?.type || 'IoTDB',
      sourcePath: node.dataSourceBinding?.sourcePath || ''
    });
    setIsEditingMetadata(false);
    setIsEditingDataSource(false);
  }, [node]);

  const handleSaveMetadata = () => {
    let parsedProps = {};
    try {
      parsedProps = JSON.parse(editForm.additionalProperties);
    } catch (e) {
      // Ignore invalid JSON for now or show toast
    }
    onUpdateMetadata?.({
      description: editForm.description,
      category: editForm.category,
      additionalProperties: parsedProps
    });
    setIsEditingMetadata(false);
  };

  const handleSaveDataSource = () => {
    onUpdateDataSource?.({
      type: dsForm.type as 'IoTDB' | 'InfluxDB',
      sourcePath: dsForm.sourcePath,
      status: 'BOUND'
    });
    setIsEditingDataSource(false);
  };

  const handleUnbindDataSource = () => {
    onUpdateDataSource?.({
      type: dsForm.type as 'IoTDB' | 'InfluxDB',
      sourcePath: '',
      status: 'UNBOUND'
    });
    setDsForm(prev => ({ ...prev, sourcePath: '' }));
    setIsEditingDataSource(false);
  };

  return (
    <div className="flex flex-col">
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

      {/* Main Info - Compact Layout */}
      <div className="px-6 py-4 bg-gray-50/30 border-b border-gray-100 shrink-0 flex flex-col gap-4">
        {/* Metadata Section */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-700">基本信息</h3>
            {!isEditingMetadata ? (
              <Button variant="ghost" size="sm" onClick={() => setIsEditingMetadata(true)}>编辑信息</Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsEditingMetadata(false)}>取消</Button>
                <Button variant="primary" size="sm" onClick={handleSaveMetadata}>保存</Button>
              </div>
            )}
          </div>
          
          {!isEditingMetadata ? (
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-[12px]">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-medium">完整路径:</span>
                <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-mono">{node.path}</code>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-medium">分类:</span>
                <span className="text-gray-600">{node.category || '-'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-medium">模板:</span>
                <span className="text-gray-600">{node.template || '-'}</span>
                {node.templateAppliedAt && <span className="text-gray-400 text-[10px] ml-1">({new Date(node.templateAppliedAt).toLocaleString()})</span>}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-medium">负责人:</span>
                <span className="text-gray-600">王总</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-medium">描述:</span>
                <span className="text-gray-600 truncate max-w-[200px]" title={node.description || ''}>{node.description || '-'}</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <label className="text-xs text-gray-500">分类</label>
                <Input size="sm" value={editForm.category} onChange={val => setEditForm(prev => ({...prev, category: val}))} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500">描述</label>
                <Input size="sm" value={editForm.description} onChange={val => setEditForm(prev => ({...prev, description: val}))} />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-xs text-gray-500">附加特性 (JSON)</label>
                <textarea 
                  className="w-full text-sm border border-gray-200 rounded-md p-2 font-mono" 
                  rows={3}
                  value={editForm.additionalProperties}
                  onChange={e => setEditForm(prev => ({...prev, additionalProperties: e.target.value}))}
                />
              </div>
            </div>
          )}
        </div>

        {/* Data Source Binding Section */}
        <div className="flex flex-col gap-2 border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-700">数据源绑定</h3>
            {!isEditingDataSource ? (
              <Button variant="ghost" size="sm" onClick={() => setIsEditingDataSource(true)}>编辑绑定</Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsEditingDataSource(false)}>取消</Button>
                <Button variant="ghost" size="sm" className="text-red-600" onClick={handleUnbindDataSource}>解除绑定</Button>
                <Button variant="primary" size="sm" onClick={handleSaveDataSource}>保存绑定</Button>
              </div>
            )}
          </div>

          {!isEditingDataSource ? (
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-[12px]">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-medium">状态:</span>
                {node.dataSourceBinding?.status === 'BOUND' ? (
                  <Badge variant="success">已绑定</Badge>
                ) : (
                  <Badge variant="neutral">未绑定</Badge>
                )}
              </div>
              {node.dataSourceBinding?.status === 'BOUND' && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 font-medium">类型:</span>
                    <span className="text-gray-600">{node.dataSourceBinding.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 font-medium">测点路径:</span>
                    <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-mono">{node.dataSourceBinding.sourcePath}</code>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex gap-4 items-end text-sm">
              <div className="space-y-1 w-48">
                <label className="text-xs text-gray-500">数据源类型</label>
                <Select 
                  size="sm" 
                  value={dsForm.type} 
                  onChange={val => setDsForm(prev => ({...prev, type: val}))}
                  options={[{label: 'IoTDB', value: 'IoTDB'}, {label: 'InfluxDB', value: 'InfluxDB'}]}
                />
              </div>
              <div className="space-y-1 flex-1">
                <label className="text-xs text-gray-500">测点路径 (sourcePath)</label>
                <Input size="sm" value={dsForm.sourcePath} onChange={val => setDsForm(prev => ({...prev, sourcePath: val}))} placeholder="例如: root.factory.device.sensor" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col">
        <div className="px-6 pt-2 border-b border-gray-100 shrink-0">
          <Tabs 
            options={[
              { id: 'children', label: '子元素列表' },
              { id: 'properties', label: '属性列表' },
              { id: 'relations', label: '引用关系' },
              { id: 'info', label: '信息标签' }
            ]}
            activeId={activeTab}
            onChange={setActiveTab}
            variant="underline"
          />
        </div>
        <div className="">
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
              onOpenModal={onOpenModal}
            />
          )}
          {activeTab === 'properties' && <PropertiesTab properties={properties} onSelectProperty={onSelectProperty} onOpenModal={onOpenModal} />}
          {activeTab === 'relations' && <RelationsTab node={node} />}
          {activeTab === 'info' && <InfoTab breadcrumbs={breadcrumbs} node={node} />}
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
  onOpenModal: (type: string) => void;
}

const ChildElementsTab = ({ 
  paginatedChildren, onAction,
  searchKeyword, setSearchKeyword,
  categoryFilter, setCategoryFilter,
  templateFilter, setTemplateFilter,
  availableCategories, availableTemplates,
  currentPage, setCurrentPage, totalItems, pageSize,
  onOpenModal
}: ChildElementsTabProps) => {
  return (
    <div className="p-6 flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex gap-4 mb-4 shrink-0 justify-between items-center">
        <div className="flex gap-4">
          <div className="w-64">
            <Input 
              value={searchKeyword}
              onChange={setSearchKeyword}
              placeholder="关键字搜索..." 
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="w-48">
            <Select 
              value={categoryFilter} 
              onChange={setCategoryFilter} 
              options={[{value: '', label: '全部分类'}, ...availableCategories.map(c => ({value: c, label: c}))]} 
            />
          </div>
          <div className="w-48">
            <Select 
              value={templateFilter} 
              onChange={setTemplateFilter} 
              options={[{value: '', label: '全部模板'}, ...availableTemplates.map(t => ({value: t, label: t}))]} 
            />
          </div>
        </div>
        <Button variant="primary" size="sm" onClick={() => onOpenModal('ADD_REFERENCE')}>添加维度引用</Button>
      </div>

      {/* Table */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col border border-gray-200 rounded-lg">
        <TableContainer className="flex-1 overflow-auto">
            <TableHeader>
              <TableRow>
                <TableHead>名称</TableHead>
                <TableHead>路径</TableHead>
                <TableHead>分类</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>描述</TableHead>
                <TableHead>模板</TableHead>
                <TableHead>附加属性</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedChildren.length > 0 ? paginatedChildren.map((child) => (
                <TableRow key={child.id} className="group">
                  <TableCell className="font-medium text-gray-900 flex items-center gap-2">
                    <FolderTree className="w-4 h-4 text-gray-400" />
                    {child.label}
                  </TableCell>
                  <TableCell className="text-gray-500 font-mono text-xs">{child.path}</TableCell>
                  <TableCell>
                    {child.category ? <Badge variant="neutral">{child.category}</Badge> : <span className="text-gray-400">-</span>}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {child.referenceType === 'CROSS_DIMENSION' ? (
                      <Badge variant="primary" className="bg-indigo-50 text-indigo-700 border-indigo-200">跨维度引用</Badge>
                    ) : (
                      '直接子节点'
                    )}
                  </TableCell>
                  <TableCell className="text-gray-500 max-w-[200px] truncate" title={child.description || ''}>
                    {child.description || '-'}
                  </TableCell>
                  <TableCell>
                    {child.template ? (
                      <div className="flex items-center gap-1 text-gray-600">
                        <Shield className="w-3 h-3" />
                        <span>{child.template}</span>
                      </div>
                    ) : <span className="text-gray-400">-</span>}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {child.additionalProperties ? Object.entries(child.additionalProperties).slice(0, 2).map(([k, v]) => (
                        <Badge key={k} variant="neutral" className="text-[10px]">{k}:{v as string}</Badge>
                      )) : '-'}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" isIconOnly onClick={() => onAction('detail', child.id)}><Info className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" isIconOnly onClick={() => onAction('edit', child.id)}><Edit2 className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" isIconOnly onClick={() => onAction('copy', child.id)}><Copy className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" isIconOnly onClick={() => onAction('up', child.id)}><ArrowUp className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" isIconOnly onClick={() => onAction('down', child.id)}><ArrowDown className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" isIconOnly className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => onAction('delete', child.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-gray-500">
                    暂无数据
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
        </TableContainer>
      </div>

      {/* Pagination */}
      <div className="mt-4 shrink-0">
        <Pagination 
          currentPage={currentPage}
          totalPages={Math.ceil(totalItems / pageSize)}
          onPageChange={setCurrentPage}
          totalItems={totalItems}
        />
      </div>
    </div>
  );
};

const PropertiesTab = ({ properties, onSelectProperty, onOpenModal }: { properties: Property[], onSelectProperty: (p: Property) => void, onOpenModal: (type: string) => void }) => {
  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-900">属性列表</h3>
        <Button variant="primary" size="sm" onClick={() => onOpenModal('CREATE_PROPERTY')}>创建属性</Button>
      </div>
      
      {properties.length > 0 ? (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <TableContainer>
              <TableHeader>
                <TableRow>
                  <TableHead>名称</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>路径</TableHead>
                  <TableHead>引用类型</TableHead>
                  <TableHead className="text-right">当前值</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((p) => (
                  <TableRow 
                    key={p.id} 
                    onClick={() => onSelectProperty(p)}
                    className="cursor-pointer hover:bg-gray-50 group"
                  >
                    <TableCell className="font-medium text-gray-900">{p.name}</TableCell>
                    <TableCell>
                      <Badge variant="neutral">{p.valueType}</Badge>
                    </TableCell>
                    <TableCell className="text-gray-500 font-mono text-xs">{p.path}</TableCell>
                    <TableCell className="text-gray-500">{p.referenceType}</TableCell>
                    <TableCell className="text-right font-mono font-medium text-indigo-600 group-hover:text-indigo-700">
                      {p.displayValue || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
          </TableContainer>
        </div>
      ) : (
        <div className="h-48 flex flex-col items-center justify-center text-gray-400 border border-dashed border-gray-200 rounded-lg">
          <Database className="w-10 h-10 mb-2 text-gray-300" />
          <p>暂无属性配置</p>
        </div>
      )}

      <div className="flex flex-col gap-4 mt-4">
        <h3 className="font-bold text-gray-900">字段映射与单位转换</h3>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <TableContainer>
              <TableHeader>
                <TableRow>
                  <TableHead>属性名称</TableHead>
                  <TableHead>属性类型</TableHead>
                  <TableHead>测点路径 (sourcePath)</TableHead>
                  <TableHead>单位转换策略</TableHead>
                  <TableHead>公式结果</TableHead>
                  <TableHead className="text-right">展示值</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.length > 0 ? properties.map((p) => (
                  <TableRow key={`mapping-${p.id}`}>
                    <TableCell className="font-medium text-gray-900">{p.name}</TableCell>
                    <TableCell>
                      <Badge variant={p.propertyType === 'FORMULA' ? 'primary' : p.propertyType === 'TAG' ? 'success' : 'neutral'}>
                        {p.propertyType || 'INDICATOR'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500 font-mono text-xs">{p.sourcePath || '-'}</TableCell>
                    <TableCell className="text-gray-500">{p.unitConversionStrategy || '-'}</TableCell>
                    <TableCell className="text-gray-500 font-mono">
                      {p.propertyType === 'FORMULA' ? (p.formulaResult || '计算中...') : '-'}
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium text-indigo-600">
                      {p.displayValue || '-'} {p.unit || ''}
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                      暂无映射数据
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

const RelationsTab = ({ node }: { node: ElementNode }) => {
  const relations = node.relations || { upstream: [], downstream: [], impactCount: 0 };
  
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4 bg-indigo-50/50 border-indigo-100">
          <h3 className="font-bold mb-2 text-indigo-900">上游节点</h3>
          <div className="text-2xl font-bold text-indigo-600 mb-2">{relations.upstream.length}</div>
          <ul className="text-sm text-indigo-700 space-y-1">
            {relations.upstream.map((u, i) => <li key={i} className="truncate">{u}</li>)}
            {relations.upstream.length === 0 && <li className="text-indigo-400">暂无上游节点</li>}
          </ul>
        </Card>
        <Card className="p-4 bg-emerald-50/50 border-emerald-100">
          <h3 className="font-bold mb-2 text-emerald-900">下游节点</h3>
          <div className="text-2xl font-bold text-emerald-600 mb-2">{relations.downstream.length}</div>
          <ul className="text-sm text-emerald-700 space-y-1">
            {relations.downstream.map((d, i) => <li key={i} className="truncate">{d}</li>)}
            {relations.downstream.length === 0 && <li className="text-emerald-400">暂无下游节点</li>}
          </ul>
        </Card>
        <Card className="p-4 bg-orange-50/50 border-orange-100">
          <h3 className="font-bold mb-2 text-orange-900">影响节点数量</h3>
          <div className="text-2xl font-bold text-orange-600 mb-2">{relations.impactCount}</div>
          <p className="text-sm text-orange-700">
            {node.referenceSource ? `引用来源维度: ${node.referenceSource}` : '当前为源节点'}
          </p>
        </Card>
      </div>
    </div>
  );
};

const InfoTab = ({ breadcrumbs, node }: { breadcrumbs: ElementNode[], node: ElementNode }) => {
  const info = node.info || {
    documents: [
      { name: '设备操作手册 v2.pdf', url: '#' },
      { name: '维护记录_2024.xlsx', url: '#' }
    ],
    notes: '该设备于2024年1月进行过大修，更换了主轴轴承。目前运行状态良好，需注意定期检查润滑油位。',
    security: { level: 'Level 3', lastAudit: '2024-02-15', encrypted: true },
    history: [
      { version: 'v2.1.0', date: '2024-01-10' },
      { version: 'v2.0.5', date: '2023-12-05' },
      { version: 'v1.9.8', date: '2023-11-20' }
    ]
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="p-4">
        <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-900"><FileTextIcon className="w-4 h-4" /> 关联文档</h3>
        <ul className="space-y-2 text-sm">
          {info.documents.map((doc, i) => (
            <li key={i}><a href={doc.url} className="text-indigo-600 hover:underline flex items-center gap-1"><ExternalLink className="w-3 h-3" /> {doc.name}</a></li>
          ))}
        </ul>
      </Card>
      <Card className="p-4">
        <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-900"><Info className="w-4 h-4 text-blue-500" /> 注释</h3>
        <p className="text-sm text-gray-600">{info.notes}</p>
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
            <li className="flex justify-between"><span>访问级别:</span> <span className="font-medium text-gray-700">{info.security.level}</span></li>
            <li className="flex justify-between"><span>最后审计:</span> <span className="font-medium text-gray-700">{info.security.lastAudit}</span></li>
            <li className="flex justify-between"><span>加密状态:</span> <span className={info.security.encrypted ? "text-green-600" : "text-gray-500"}>{info.security.encrypted ? '已启用' : '未启用'}</span></li>
          </ul>
        </Card>
        <Card className="p-4 bg-gray-50 border-dashed">
          <h3 className="font-bold mb-2 flex items-center gap-2 text-gray-500"><History className="w-4 h-4" /> 版本历史</h3>
          <ul className="text-xs text-gray-500 space-y-1">
            {info.history.map((h, i) => (
              <li key={i} className="flex justify-between"><span>{h.version}</span> <span className="text-gray-400">{h.date}</span></li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};
