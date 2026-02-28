import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AlertCircle, FolderTree, GripVertical } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { useToast } from '@/components/ui/Toast';
import { useCatalogState } from '@/pages/data-catalog/useCatalogState';
import { CatalogTreePanel } from '@/pages/data-catalog/components/CatalogTreePanel';
import { RootOverviewPanel } from '@/pages/data-catalog/components/RootOverviewPanel';
import { ElementDetailPanel } from '@/pages/data-catalog/components/ElementDetailPanel';
import { PropertyDetailPanel } from '@/pages/data-catalog/components/PropertyDetailPanel';
import { ElementNode } from '@/pages/data-catalog/types';
import { SmoothAreaChart, SpotlightBarChart } from '@/components/ui/Charts';
import { TableContainer, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table';

export default function DataCatalog() {
  const { addToast } = useToast();
  const {
    dimension, setDimension,
    filteredTreeData, setTreeData,
    propertiesMap, setPropertiesMap,
    selectedNode, setSelectedNode,
    selectedProperty, setSelectedProperty,
    viewState, setViewState,
    categoryFilter, setCategoryFilter,
    expandedIds, setExpandedIds,
    // Child list props
    childSearchKeyword, setChildSearchKeyword,
    childCategoryFilter, setChildCategoryFilter,
    childTemplateFilter, setChildTemplateFilter,
    currentPage, setCurrentPage,
    pageSize, setPageSize,
    filteredChildren,
    paginatedChildren,
    availableCategories,
    availableTemplates,
    
    handleRefresh, handleSelectNode, handleSelectProperty,
    handleBackToElement, handleToggleFavorite,
    updateTree, deleteFromTree, updatePathRecursively, getBreadcrumbs,
    generateSlug, generateUniquePath, treeData
  } = useCatalogState();

  const [modalState, setModalState] = useState<{ type: string | null, payload?: any }>({ type: null });
  const [modalInput, setModalInput] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  // Mobile & Layout State
  const [isMobileTreeOpen, setIsMobileTreeOpen] = useState(false);
  const isMobile = window.innerWidth < 768; // Simple check, ideally use a hook

  // Resizable Sidebar State
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    try {
      const saved = localStorage.getItem('datacatalog-sidebar-width');
      return saved ? Math.max(200, Math.min(600, parseInt(saved))) : 280;
    } catch {
      return 280;
    }
  });
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-close mobile tree on selection
  useEffect(() => {
    if (isMobile && selectedNode) {
        setIsMobileTreeOpen(false);
    }
  }, [selectedNode, isMobile]);

  // Persist sidebar width
  useEffect(() => {
    localStorage.setItem('datacatalog-sidebar-width', sidebarWidth.toString());
  }, [sidebarWidth]);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = e.clientX - containerRect.left;
      if (newWidth >= 200 && newWidth <= 600) {
        setSidebarWidth(newWidth);
      }
    }
  }, [isResizing]);

  const resetSidebarWidth = useCallback(() => {
    setSidebarWidth(280);
  }, []);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
    }
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  // Modal Handlers
  const handleModalConfirm = () => {
    const { type, payload } = modalState;
    if (type === 'CREATE_ELEMENT') {
      if (modalInput.trim()) {
        const parentNode = selectedNode;
        const parentPath = parentNode ? parentNode.path : 'root';
        const siblings = parentNode ? (parentNode.children || []) : treeData;
        
        const slug = generateSlug(modalInput);
        const newPath = generateUniquePath(parentPath, slug, siblings);
        
        const newNode: ElementNode = {
          id: `new-${Date.now()}`,
          label: modalInput.trim(),
          type: 'DEVICE',
          path: newPath,
          children: []
        };

        if (parentNode) {
           const updatedParent = { ...parentNode, children: [...(parentNode.children || []), newNode] };
           setSelectedNode(updatedParent);
           setTreeData(prev => updateTree(prev, parentNode.id, () => updatedParent));
           setExpandedIds(prev => new Set(prev).add(parentNode.id));
        } else {
           setTreeData(prev => [...prev, newNode]);
        }
        addToast({ type: 'success', title: '创建成功', message: `已创建元素: ${modalInput.trim()}` });
      }
    } else if (type === 'EDIT_ELEMENT' && selectedNode) {
      if (modalInput.trim()) {
        const parentPath = selectedNode.path.substring(0, selectedNode.path.lastIndexOf('.'));
        const slug = generateSlug(modalInput);
        
        // Find siblings by finding parent node first
        // Since we don't have direct parent reference, we search in treeData
        // Note: This is a simplified approach. Ideally we should have parentId or parent reference.
        let siblings: ElementNode[] = treeData;
        if (parentPath !== 'root') {
             // Try to find parent node in tree
             const findNodeByPath = (nodes: ElementNode[], path: string): ElementNode | null => {
                for (const node of nodes) {
                    if (node.path === path) return node;
                    if (node.children) {
                        const found = findNodeByPath(node.children, path);
                        if (found) return found;
                    }
                }
                return null;
             };
             const parent = findNodeByPath(treeData, parentPath);
             if (parent && parent.children) {
                 siblings = parent.children.filter(c => c.id !== selectedNode.id);
             }
        } else {
             siblings = treeData.filter(c => c.id !== selectedNode.id);
        }

        const newPath = generateUniquePath(parentPath, slug, siblings);
        
        let updatedNode = { ...selectedNode, label: modalInput.trim(), path: newPath };
        
        if (updatedNode.children) {
             updatedNode.children = updatedNode.children.map(child => updatePathRecursively(child, newPath));
        }
        
        setSelectedNode(updatedNode);
        setTreeData(prev => updateTree(prev, updatedNode.id, () => updatedNode));
        addToast({ type: 'success', title: '修改成功', message: `元素已重命名为: ${modalInput.trim()}` });
      }
    } else if (type === 'DELETE_ELEMENT' && selectedNode) {
      setTreeData(prev => deleteFromTree(prev, selectedNode.id));
      setSelectedNode(null);
      setViewState('EMPTY');
      addToast({ type: 'success', title: '删除成功', message: '元素及其子元素已删除' });
    } else if (type === 'ADD_TEMPLATE') {
        if (selectedTemplate) {
            if (selectedNode) {
                const updatedNode = { ...selectedNode, template: selectedTemplate };
                setSelectedNode(updatedNode);
                setTreeData(prev => updateTree(prev, updatedNode.id, () => updatedNode));
                addToast({ type: 'success', title: '模板应用成功', message: `已应用模板: ${selectedTemplate}` });
                // setModalState({ type: 'INFO', payload: { message: `已成功应用模板: ${selectedTemplate}` } });
                return;
            }
        }
    }
    else if (type === 'EDIT_PROPERTY' && selectedProperty && selectedNode) {
      if (modalInput.trim()) {
        const updatedProp = { ...selectedProperty, name: modalInput.trim() };
        setSelectedProperty(updatedProp);
        setPropertiesMap(prev => ({
          ...prev,
          [selectedNode.id]: (prev[selectedNode.id] || []).map(p => p.id === updatedProp.id ? updatedProp : p)
        }));
        addToast({ type: 'success', title: '修改成功', message: `属性已重命名为: ${modalInput.trim()}` });
      }
    } else if (type === 'DELETE_PROPERTY' && selectedProperty && selectedNode) {
      setPropertiesMap(prev => ({
        ...prev,
        [selectedNode.id]: (prev[selectedNode.id] || []).filter(p => p.id !== selectedProperty.id)
      }));
      handleBackToElement();
      addToast({ type: 'success', title: '删除成功', message: '属性已删除' });
    } else if (type === 'EDIT_CHILD' && selectedNode && selectedNode.children) {
      if (modalInput.trim()) {
        const children = [...selectedNode.children];
        const child = children[payload.idx];
        const slug = generateSlug(modalInput);
        
        // Check siblings for uniqueness (excluding self)
        const siblings = children.filter((_, i) => i !== payload.idx);
        const newPath = generateUniquePath(selectedNode.path, slug, siblings);
        
        let updatedChild = { ...child, label: modalInput.trim(), path: newPath };
        if (updatedChild.children) {
             updatedChild.children = updatedChild.children.map(c => updatePathRecursively(c, newPath));
        }
        
        children[payload.idx] = updatedChild;
        
        const updatedNode = { ...selectedNode, children };
        setSelectedNode(updatedNode);
        setTreeData(prev => updateTree(prev, updatedNode.id, () => updatedNode));
        addToast({ type: 'success', title: '修改成功', message: `子元素已重命名` });
      }
    } else if (type === 'DELETE_CHILD' && selectedNode && selectedNode.children) {
      const children = [...selectedNode.children];
      children.splice(payload.idx, 1);
      const updatedNode = { ...selectedNode, children };
      setSelectedNode(updatedNode);
      setTreeData(prev => updateTree(prev, updatedNode.id, () => updatedNode));
      addToast({ type: 'success', title: '删除成功', message: '子元素已删除' });
    }
    setModalState({ type: null });
    setModalInput('');
    setSelectedTemplate('');
  };

  const handleChildAction = (action: string, childId: string) => {
    if (!selectedNode || !selectedNode.children) return;
    const idx = selectedNode.children.findIndex(c => c.id === childId);
    if (idx === -1) return;
    
    const child = selectedNode.children[idx];

    if (action === 'detail') {
      handleSelectNode(child);
    } else if (action === 'edit') {
      openModal('EDIT_CHILD', { idx });
    } else if (action === 'copy') {
      const slug = generateSlug(child.label + '_副本');
      const newPath = generateUniquePath(selectedNode.path, slug, selectedNode.children);
      
      const newChild = {
        ...child,
        id: `copy-${Date.now()}`,
        label: child.label + '_副本',
        path: newPath,
        children: [] // Deep copy children if needed, but for now empty
      };
      
      const children = [...selectedNode.children, newChild];
      const updatedNode = { ...selectedNode, children };
      setSelectedNode(updatedNode);
      setTreeData(prev => updateTree(prev, updatedNode.id, () => updatedNode));
      addToast({ type: 'success', title: '复制成功', message: `已复制元素: ${child.label}` });
      
    } else if (action === 'up') {
      if (idx > 0) {
        const children = [...selectedNode.children];
        [children[idx - 1], children[idx]] = [children[idx], children[idx - 1]];
        const updatedNode = { ...selectedNode, children };
        setSelectedNode(updatedNode);
        setTreeData(prev => updateTree(prev, updatedNode.id, () => updatedNode));
        addToast({ type: 'success', title: '排序成功', message: '子元素顺序已更新' });
      }
    } else if (action === 'down') {
      if (idx < selectedNode.children.length - 1) {
        const children = [...selectedNode.children];
        [children[idx + 1], children[idx]] = [children[idx], children[idx + 1]];
        const updatedNode = { ...selectedNode, children };
        setSelectedNode(updatedNode);
        setTreeData(prev => updateTree(prev, updatedNode.id, () => updatedNode));
        addToast({ type: 'success', title: '排序成功', message: '子元素顺序已更新' });
      }
    } else if (action === 'top') {
      if (idx > 0) {
        const children = [...selectedNode.children];
        const item = children.splice(idx, 1)[0];
        children.unshift(item);
        const updatedNode = { ...selectedNode, children };
        setSelectedNode(updatedNode);
        setTreeData(prev => updateTree(prev, updatedNode.id, () => updatedNode));
        addToast({ type: 'success', title: '排序成功', message: '子元素顺序已更新' });
      }
    } else if (action === 'delete') {
      openModal('DELETE_CHILD', { idx });
    }
  };

  const openModal = (type: string, payload?: any) => {
    setModalState({ type, payload });
    if (type === 'EDIT_ELEMENT' && selectedNode) {
      setModalInput(selectedNode.label);
    } else if (type === 'EDIT_PROPERTY' && selectedProperty) {
      setModalInput(selectedProperty.name);
    } else if (type === 'CREATE_ELEMENT') {
      setModalInput('');
    } else if (type === 'ADD_TEMPLATE') {
      setSelectedTemplate('');
    } else if (type === 'EDIT_CHILD' && selectedNode && selectedNode.children) {
        setModalInput(selectedNode.children[payload.idx].label);
    }
  };

  return (
    <div className="h-full w-full p-[15px] overflow-hidden select-none bg-gray-50 flex flex-col relative">
      {/* Mobile Tree Toggle */}
      <div className="md:hidden mb-2">
        <Button 
            variant="secondary" 
            className="w-full justify-between"
            onClick={() => setIsMobileTreeOpen(!isMobileTreeOpen)}
            rightIcon={<FolderTree className="w-4 h-4" />}
        >
            {selectedNode ? selectedNode.label : '选择数据目录'}
        </Button>
      </div>

      <div 
        ref={containerRef}
        className="flex-1 flex flex-row bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden min-h-0 relative"
      >
        {/* Left Panel: Tree View - Resizable on Desktop, Overlay on Mobile */}
        <div 
          style={{ width: isMobile ? '100%' : sidebarWidth }} 
          className={`
            flex-shrink-0 h-full overflow-hidden border-r border-gray-100 bg-gray-50/30 flex flex-col
            md:relative absolute z-30 bg-white transition-transform duration-300 ease-in-out
            ${isMobile ? (isMobileTreeOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
          `}
        >
          <CatalogTreePanel 
            dimension={dimension}
            setDimension={setDimension}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            viewState={viewState}
            handleRefresh={handleRefresh}
            filteredTreeData={filteredTreeData}
            selectedNode={selectedNode}
            handleSelectNode={handleSelectNode}
            onCreateElement={() => openModal('CREATE_ELEMENT')}
            expandedIds={expandedIds}
          />
        </div>

        {/* Resizer Handle (Desktop Only) */}
        <div
          className={`w-1 cursor-col-resize hover:bg-indigo-500 transition-colors z-20 flex items-center justify-center group relative shrink-0 hidden md:flex
            ${isResizing ? 'bg-indigo-600' : 'bg-gray-100 hover:bg-indigo-300'}
          `}
          onMouseDown={startResizing}
          onDoubleClick={resetSidebarWidth}
          title="双击恢复默认宽度"
        >
           {/* Visual handle indicator */}
           <div className={`w-1 h-8 rounded-full bg-gray-300 group-hover:bg-white transition-colors absolute ${isResizing ? 'bg-white' : ''}`} />
        </div>

        {/* Right Panel: Details - Auto-fill */}
        <div className="flex-1 min-w-0 h-full flex flex-col bg-white overflow-hidden relative">
          <div className="flex-1 flex flex-col p-0 overflow-auto h-full custom-scrollbar">
            {/* ... (keep loading/error/empty states) */}
            {viewState === 'LOADING' && (
              <div className="h-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {viewState === 'ERROR' && (
              <div className="h-full flex flex-col items-center justify-center text-red-500">
                <AlertCircle className="w-12 h-12 mb-4" />
                <p>加载失败，请重试</p>
                <Button variant="secondary" className="mt-4" onClick={handleRefresh}>重试</Button>
              </div>
            )}
            {viewState === 'EMPTY' && (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50/30">
                <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-6">
                  <FolderTree className="w-10 h-10 text-indigo-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">未选择节点</h3>
                <p className="text-sm text-gray-500">请在左侧目录树中选择一个元素节点查看详情</p>
              </div>
            )}
            {viewState === 'ROOT_OVERVIEW' && selectedNode && (
              <RootOverviewPanel node={selectedNode} />
            )}
            {viewState === 'ELEMENT_DETAIL' && selectedNode && (
              <ElementDetailPanel 
                node={selectedNode}
                properties={propertiesMap[selectedNode.id] || []}
                breadcrumbs={getBreadcrumbs(selectedNode.id)}
                onBack={() => setViewState('EMPTY')}
                onEdit={() => openModal('EDIT_ELEMENT')}
                onDelete={() => openModal('DELETE_ELEMENT')}
                onToggleFavorite={handleToggleFavorite}
                onSelectProperty={handleSelectProperty}
                onChildAction={handleChildAction}
                onOpenModal={openModal}
                
                childSearchKeyword={childSearchKeyword}
                setChildSearchKeyword={setChildSearchKeyword}
                childCategoryFilter={childCategoryFilter}
                setChildCategoryFilter={setChildCategoryFilter}
                childTemplateFilter={childTemplateFilter}
                setChildTemplateFilter={setChildTemplateFilter}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                pageSize={pageSize}
                filteredChildren={filteredChildren}
                paginatedChildren={paginatedChildren}
                availableCategories={availableCategories}
                availableTemplates={availableTemplates}
              />
            )}
            {viewState === 'PROPERTY_DETAIL' && selectedProperty && (
              <PropertyDetailPanel 
                property={selectedProperty}
                onBack={handleBackToElement}
                onEdit={() => openModal('EDIT_PROPERTY')}
                onDelete={() => openModal('DELETE_PROPERTY')}
                onOpenModal={openModal}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal 
        isOpen={modalState.type !== null} 
        onClose={() => setModalState({ type: null })}
        title={
          modalState.type === 'CREATE_ELEMENT' ? '新建元素' :
          modalState.type === 'EDIT_ELEMENT' || modalState.type === 'EDIT_CHILD' ? '重命名元素' :
          modalState.type === 'EDIT_PROPERTY' ? '重命名属性' :
          modalState.type === 'DELETE_ELEMENT' ? '删除元素确认' :
          modalState.type === 'DELETE_CHILD' ? '删除子元素确认' :
          modalState.type === 'DELETE_PROPERTY' ? '删除属性确认' :
          modalState.type === 'ADD_TEMPLATE' ? '选择模板' :
          modalState.type === 'HISTORY' ? '历史趋势' :
          modalState.type === 'HISTORY_VALUES' ? '历史值' :
          modalState.type === 'TREND_CHART' ? '趋势图' :
          '提示'
        }
        footer={
          (modalState.type === 'HISTORY' || modalState.type === 'HISTORY_VALUES' || modalState.type === 'TREND_CHART') ? null : (
            <div className="px-6 py-5 bg-gray-50/50 flex justify-end gap-3 border-t border-gray-50 shrink-0">
                {modalState.type !== 'INFO' && (
                <Button variant="secondary" className="px-6 rounded-2xl" onClick={() => setModalState({ type: null })}>取消</Button>
                )}
                <Button className="px-8 rounded-2xl" onClick={modalState.type === 'INFO' ? () => setModalState({ type: null }) : handleModalConfirm}>确认</Button>
            </div>
          )
        }
        className={(modalState.type === 'HISTORY' || modalState.type === 'TREND_CHART' || modalState.type === 'HISTORY_VALUES') ? '!max-w-3xl' : ''}
      >
        <div className="py-4">
          {(modalState.type === 'CREATE_ELEMENT' || modalState.type === 'EDIT_ELEMENT' || modalState.type === 'EDIT_CHILD' || modalState.type === 'EDIT_PROPERTY') && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">名称</label>
              <Input 
                value={modalInput} 
                onChange={(val) => setModalInput(val)} 
                placeholder="请输入名称" 
                size="md"
                autoFocus
              />
              {modalState.type === 'CREATE_ELEMENT' && selectedNode && (
                 <p className="text-xs text-gray-500">将创建在 <span className="font-bold">{selectedNode.label}</span> 节点下</p>
              )}
            </div>
          )}
          {modalState.type === 'DELETE_ELEMENT' && selectedNode && (
             <div className="space-y-2">
                <p className="text-gray-600">确定要删除 <span className="font-bold">{selectedNode.label}</span> 吗？</p>
                {selectedNode.children && selectedNode.children.length > 0 && (
                    <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>该节点包含 {selectedNode.children.length} 个子元素，删除将一并移除这些子元素！</span>
                    </div>
                )}
             </div>
          )}
          {modalState.type === 'DELETE_CHILD' && (
             <p className="text-gray-600">确定要删除该子元素吗？此操作不可恢复。</p>
          )}
          {modalState.type === 'DELETE_PROPERTY' && (
            <p className="text-gray-600">确定要删除该属性吗？此操作不可恢复。</p>
          )}
          {modalState.type === 'ADD_TEMPLATE' && (
             <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">选择模板</label>
                <Select
                    value={selectedTemplate}
                    onChange={setSelectedTemplate}
                    options={[
                        { value: 'CNC标准模板', label: 'CNC标准模板' },
                        { value: '通用设备模板', label: '通用设备模板' },
                        { value: '传感器模板', label: '传感器模板' }
                    ]}
                    placeholder="请选择模板..."
                />
             </div>
          )}
          {modalState.type === 'HISTORY' && (
             <div className="h-[300px] w-full">
                <SmoothAreaChart height={300} />
             </div>
          )}
          
          {modalState.type === 'TREND_CHART' && (
             <div className="h-[400px] w-full p-4">
                <SpotlightBarChart height={350} />
                <p className="text-center text-sm text-gray-500 mt-2">近24小时数据趋势</p>
             </div>
          )}

          {modalState.type === 'HISTORY_VALUES' && (
             <div className="h-[400px] w-full overflow-hidden flex flex-col">
                <TableContainer className="flex-1 overflow-auto">
                  <TableHeader>
                    <TableRow>
                      <TableHead>时间</TableHead>
                      <TableHead>值</TableHead>
                      <TableHead>质量</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 20 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>{new Date(Date.now() - i * 60000 * 10).toLocaleString()}</TableCell>
                        <TableCell>{(Math.random() * 100).toFixed(2)}</TableCell>
                        <TableCell><span className="text-green-600">Good</span></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </TableContainer>
             </div>
          )}
          {modalState.type === 'INFO' && (
            <p className="text-gray-600">{modalState.payload?.message}</p>
          )}
        </div>
      </Modal>
    </div>
  );
}
