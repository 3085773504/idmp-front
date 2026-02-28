import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, Star, Edit2, Copy, History, Trash2, Search, Info, 
  ArrowUp, ArrowDown, ArrowUpToLine, Database, ExternalLink, Shield, FolderTree,
  Tag, FileText, Link2
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Tabs from '@/components/ui/Tabs';
import Badge from '@/components/ui/Badge';
import Pagination from '@/components/ui/Pagination';
import { 
  TableContainer, TableHeader, TableBody, TableRow, TableHead, TableCell 
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
    <div className="flex flex-col h-full w-full overflow-hidden">
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
      <div className="px-6 py-4 bg-white border-b border-gray-100 flex flex-col gap-2 text-sm shrink-0 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] z-10">
        <div className="flex items-center gap-2">
           <span className="text-gray-400 font-medium">路径:</span>
           <code className="font-mono text-xs bg-gray-50 px-2 py-0.5 rounded text-gray-600 border border-gray-100">{node.path}</code>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-500">
          <div className="flex items-center gap-2">
            <span>分类:</span> 
            <Badge variant="neutral" className="py-0 h-5 text-xs">{node.category || '-'}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>模板:</span>
            <Badge variant="primary" className="py-0 h-5 text-xs">{node.template || '-'}</Badge>
          </div>
          <div className="flex items-center gap-2 max-w-[300px]">
            <span>描述:</span>
            <span className="truncate" title={node.description}>{node.description || '-'}</span>
          </div>
          {node.location && Object.entries(node.location).map(([k, v]) => (
            <div key={k} className="flex items-center gap-1">
              <span>{k}:</span>
              <span className="font-mono text-gray-700">{v}</span>
            </div>
          ))}
          {/* Default Properties - Hidden or simplified */}
          {/* Additional Properties - Tooltip or Icon */}
          {node.additionalProperties && Object.keys(node.additionalProperties).length > 0 && (
             <div className="flex items-center gap-1" title={JSON.stringify(node.additionalProperties)}>
                <Info className="w-3 h-3" />
                <span>{Object.keys(node.additionalProperties).length} 个附加属性</span>
             </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="px-6 pt-1 border-b border-gray-100 shrink-0">
          <Tabs 
            options={[
              { id: 'children', label: '子元素列表' },
              { id: 'properties', label: '属性列表' },
              { id: 'info', label: '信息标签' }
            ]}
            activeId={activeTab}
            onChange={setActiveTab}
            variant="underline"
            size="sm"
          />
        </div>
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
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
  const emptyRows = Math.max(0, pageSize - paginatedChildren.length);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.row-action-menu')) {
        setOpenMenuId(null);
      }
    };

    // Close menu on ESC key
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  const handleMenuToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(prev => prev === id ? null : id);
  };

  return (
    <div className="p-6 flex flex-col h-full overflow-hidden">
      {/* Toolbar */}
      <div className="flex gap-2 mb-3 shrink-0 items-center">
        <div className="w-48">
          <Input 
            value={searchKeyword}
            onChange={setSearchKeyword}
            placeholder="关键字搜索..." 
            size="xs"
            className="h-8 text-xs"
            icon={<Search className="w-3.5 h-3.5" />}
          />
        </div>
        <div className="w-28">
          <Select 
            value={categoryFilter} 
            onChange={setCategoryFilter} 
            size="xs"
            className="h-8 text-xs"
            options={[{value: '', label: '全部分类'}, ...availableCategories.map(c => ({value: c, label: c}))]} 
          />
        </div>
        <div className="w-28">
          <Select 
            value={templateFilter} 
            onChange={setTemplateFilter} 
            size="xs"
            className="h-8 text-xs"
            options={[{value: '', label: '全部模板'}, ...availableTemplates.map(t => ({value: t, label: t}))]} 
          />
        </div>
      </div>
      {/* Table */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <TableContainer className="h-full">
          <TableHeader>
            <tr>
              <TableHead className="bg-gray-50/80 sticky top-0 z-10 whitespace-nowrap pl-6">名称</TableHead>
              <TableHead className="bg-gray-50/80 sticky top-0 z-10 whitespace-nowrap">路径</TableHead>
              <TableHead className="bg-gray-50/80 sticky top-0 z-10 whitespace-nowrap">分类</TableHead>
              <TableHead className="bg-gray-50/80 sticky top-0 z-10 whitespace-nowrap">引用类型</TableHead>
              <TableHead className="bg-gray-50/80 sticky top-0 z-10 whitespace-nowrap">描述</TableHead>
              <TableHead className="bg-gray-50/80 sticky top-0 z-10 whitespace-nowrap">模板</TableHead>
              <TableHead className="bg-gray-50/80 sticky top-0 z-10 whitespace-nowrap">附加属性</TableHead>
              <TableHead className="text-right bg-gray-50/80 sticky top-0 right-0 z-20 whitespace-nowrap pr-6 shadow-[calc(-20px)_0_20px_-10px_rgba(0,0,0,0.05)]">操作</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {paginatedChildren.length > 0 ? paginatedChildren.map((child, index) => (
              <TableRow key={child.id} index={index}>
                <TableCell className="font-medium text-gray-900 pl-6">
                  <div className="flex items-center gap-2">
                    <FolderTree className="w-4 h-4 text-indigo-500 opacity-70" />
                    {child.label}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs text-gray-500">{child.path}</TableCell>
                <TableCell>
                  {child.category ? (
                    <Badge variant="neutral" className="py-0 h-5 text-xs font-normal gap-1">
                      <Tag className="w-3 h-3 opacity-50" />
                      {child.category}
                    </Badge>
                  ) : '-'}
                </TableCell>
                <TableCell className="text-gray-500">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Link2 className="w-3 h-3 opacity-50" />
                    直接子节点
                  </div>
                </TableCell>
                <TableCell className="text-gray-500 truncate max-w-[150px]" title={child.description || ''}>{child.description || '-'}</TableCell>
                <TableCell className="text-gray-500">
                  {child.template ? (
                    <Badge variant="primary" className="py-0 h-5 text-xs font-normal bg-indigo-50 text-indigo-600 border-indigo-100 gap-1">
                      <FileText className="w-3 h-3 opacity-50" />
                      {child.template}
                    </Badge>
                  ) : '-'}
                </TableCell>
                <TableCell className="text-gray-500 text-xs">
                  {child.additionalProperties ? (
                    <div className="flex items-center gap-1 text-gray-400">
                      <Info className="w-3 h-3" />
                      <span>{Object.keys(child.additionalProperties).length} 项</span>
                    </div>
                  ) : '-'}
                </TableCell>
                <TableCell className="text-right sticky right-0 bg-white/95 backdrop-blur-sm z-10 pr-6 group-hover:bg-gray-50/50 transition-colors border-l border-transparent group-hover:border-primary-100 shadow-[calc(-20px)_0_20px_-10px_rgba(0,0,0,0.05)]">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="sm" isIconOnly title="详情" aria-label="查看详情" onClick={() => onAction('detail', child.id)}><Info className="w-4 h-4 text-gray-400 hover:text-indigo-600" /></Button>
                    <Button variant="ghost" size="sm" isIconOnly title="编辑" aria-label="编辑元素" onClick={() => onAction('edit', child.id)}><Edit2 className="w-4 h-4 text-gray-400 hover:text-indigo-600" /></Button>
                    <Button variant="ghost" size="sm" isIconOnly title="复制" aria-label="复制元素" onClick={() => onAction('copy', child.id)}><Copy className="w-4 h-4 text-gray-400 hover:text-indigo-600" /></Button>
                    <div className="relative row-action-menu">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        isIconOnly 
                        title="更多操作"
                        aria-label="更多操作"
                        aria-haspopup="true"
                        aria-expanded={openMenuId === child.id}
                        className={openMenuId === child.id ? 'bg-gray-100 text-indigo-600' : ''}
                        onClick={(e) => handleMenuToggle(child.id, e)}
                      >
                        <ArrowDown className={`w-4 h-4 transition-transform duration-200 ${openMenuId === child.id ? 'rotate-180 text-indigo-600' : 'text-gray-400 hover:text-indigo-600'}`} />
                      </Button>
                      <AnimatePresence>
                        {openMenuId === child.id && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.1 }}
                            className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 origin-top-right focus:outline-none"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="options-menu"
                          >
                            <button role="menuitem" className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2 transition-colors focus:bg-gray-50 focus:outline-none" onClick={() => { onAction('up', child.id); setOpenMenuId(null); }}>
                              <ArrowUp className="w-3 h-3" /> 上移
                            </button>
                            <button role="menuitem" className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2 transition-colors focus:bg-gray-50 focus:outline-none" onClick={() => { onAction('down', child.id); setOpenMenuId(null); }}>
                              <ArrowDown className="w-3 h-3" /> 下移
                            </button>
                            <button role="menuitem" className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2 transition-colors focus:bg-gray-50 focus:outline-none" onClick={() => { onAction('top', child.id); setOpenMenuId(null); }}>
                              <ArrowUpToLine className="w-3 h-3" /> 移顶
                            </button>
                            <div className="h-px bg-gray-100 my-1" role="separator" />
                            <button role="menuitem" className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors focus:bg-red-50 focus:outline-none" onClick={() => { onAction('delete', child.id); setOpenMenuId(null); }}>
                              <Trash2 className="w-3 h-3" /> 删除
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell className="text-center text-gray-400 py-8" colSpan={8}>暂无子元素</TableCell>
              </TableRow>
            )}
            {/* Empty Rows Padding */}
            {paginatedChildren.length > 0 && Array.from({ length: emptyRows }).map((_, index) => (
              <TableRow key={`empty-${index}`}>
                 <TableCell className="text-transparent select-none">&nbsp;</TableCell>
                 <TableCell className="text-transparent select-none">&nbsp;</TableCell>
                 <TableCell className="text-transparent select-none">&nbsp;</TableCell>
                 <TableCell className="text-transparent select-none">&nbsp;</TableCell>
                 <TableCell className="text-transparent select-none">&nbsp;</TableCell>
                 <TableCell className="text-transparent select-none">&nbsp;</TableCell>
                 <TableCell className="text-transparent select-none">&nbsp;</TableCell>
                 <TableCell className="text-transparent select-none sticky right-0 bg-white/50 backdrop-blur-sm border-l border-transparent">&nbsp;</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableContainer>
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
