import React, { useState, useCallback, useMemo } from 'react';
import { AlertCircle, FolderTree } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { useCatalogState } from '@/pages/data-catalog/useCatalogState';
import { CatalogTreePanel } from '@/pages/data-catalog/components/CatalogTreePanel';
import { RootOverviewPanel } from '@/pages/data-catalog/components/RootOverviewPanel';
import { ElementDetailPanel } from '@/pages/data-catalog/components/ElementDetailPanel';
import { PropertyDetailPanel } from '@/pages/data-catalog/components/PropertyDetailPanel';
import { ElementNode } from '@/pages/data-catalog/types';
import { SmoothAreaChart, SpotlightBarChart } from '@/components/ui/Charts';
import { TableContainer, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table';
import { useToast } from '@/components/ui/Toast';

export default function DataCatalog() {
  const toast = useToast();
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
    generateSlug, generateUniquePath, treeData,
    updateElementMetadata, updateDataSourceBinding, applyTemplate, createProperty, addDimensionReference
  } = useCatalogState();

  const [modalState, setModalState] = useState<{ type: string | null, payload?: any }>({ type: null });
  const [modalInput, setModalInput] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [propertyForm, setPropertyForm] = useState({ name: '', type: 'INDICATOR', sourcePath: '', unit: '', value: '', formula: '' });
  const [referenceForm, setReferenceForm] = useState({ targetId: '', referenceType: 'CROSS_DIMENSION' });

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
        toast.success('节点创建成功');
      }
    } else if (type === 'EDIT_ELEMENT' && selectedNode) {
      if (modalInput.trim()) {
        const breadcrumbs = getBreadcrumbs(selectedNode.id);
        const parentNode = breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 2] : null;
        const parentPath = parentNode ? parentNode.path : 'root';
        const siblings = parentNode ? (parentNode.children || []) : treeData;
        const otherSiblings = siblings.filter(s => s.id !== selectedNode.id);
        
        const slug = generateSlug(modalInput);
        const newPath = generateUniquePath(parentPath, slug, otherSiblings);
        
        let updatedNode = { ...selectedNode, label: modalInput.trim(), path: newPath };
        
        if (updatedNode.children) {
             updatedNode.children = updatedNode.children.map(child => updatePathRecursively(child, newPath));
        }
        
        setSelectedNode(updatedNode);
        setTreeData(prev => updateTree(prev, updatedNode.id, () => updatedNode));
        toast.success('节点重命名成功');
      }
    } else if (type === 'DELETE_ELEMENT' && selectedNode) {
      setTreeData(prev => deleteFromTree(prev, selectedNode.id));
      setSelectedNode(null);
      setViewState('EMPTY');
      toast.success('节点删除成功');
    } else if (type === 'ADD_TEMPLATE') {
        if (selectedTemplate) {
            if (selectedNode) {
                applyTemplate(selectedNode.id, selectedTemplate);
                toast.success(`已成功应用模板: ${selectedTemplate}`);
                setModalState({ type: null });
                return;
            }
        }
    } else if (type === 'CREATE_PROPERTY' && selectedNode) {
        if (propertyForm.name.trim()) {
            const newProp: any = {
                id: `prop-${Date.now()}`,
                name: propertyForm.name.trim(),
                propertyType: propertyForm.type as any,
                valueType: propertyForm.type === 'TAG' ? 'TEXT' : 'DOUBLE',
                path: `${selectedNode.path}.${generateSlug(propertyForm.name)}`,
                referenceType: 'DIRECT',
            };
            if (propertyForm.type === 'INDICATOR') {
                newProp.sourcePath = propertyForm.sourcePath;
                newProp.unit = propertyForm.unit;
                newProp.displayValue = '0.00';
            } else if (propertyForm.type === 'TAG') {
                newProp.displayValue = propertyForm.value;
            } else if (propertyForm.type === 'FORMULA') {
                newProp.formulaResult = propertyForm.formula;
                newProp.displayValue = '计算中...';
            }
            createProperty(selectedNode.id, newProp);
            toast.success('属性创建成功');
        }
    } else if (type === 'ADD_REFERENCE' && selectedNode) {
        if (referenceForm.targetId) {
            addDimensionReference(selectedNode.id, {
                label: `Ref-${referenceForm.targetId}`,
                targetId: referenceForm.targetId,
                referenceType: referenceForm.referenceType
            });
            toast.success('已成功添加引用');
            setModalState({ type: null });
            return;
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
        toast.success('属性重命名成功');
      }
    } else if (type === 'DELETE_PROPERTY' && selectedProperty && selectedNode) {
      setPropertiesMap(prev => ({
        ...prev,
        [selectedNode.id]: (prev[selectedNode.id] || []).filter(p => p.id !== selectedProperty.id)
      }));
      handleBackToElement();
      toast.success('属性删除成功');
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
        toast.success('子元素重命名成功');
      }
    } else if (type === 'DELETE_CHILD' && selectedNode && selectedNode.children) {
      const children = [...selectedNode.children];
      children.splice(payload.idx, 1);
      const updatedNode = { ...selectedNode, children };
      setSelectedNode(updatedNode);
      setTreeData(prev => updateTree(prev, updatedNode.id, () => updatedNode));
      toast.success('子元素删除成功');
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
      toast.success('节点复制成功');
    } else if (action === 'up') {
      if (idx > 0) {
        const children = [...selectedNode.children];
        [children[idx - 1], children[idx]] = [children[idx], children[idx - 1]];
        const updatedNode = { ...selectedNode, children };
        setSelectedNode(updatedNode);
        setTreeData(prev => updateTree(prev, updatedNode.id, () => updatedNode));
        toast.success('节点上移成功');
      } else {
        toast.info('节点已在最顶部');
      }
    } else if (action === 'down') {
      if (idx < selectedNode.children.length - 1) {
        const children = [...selectedNode.children];
        [children[idx + 1], children[idx]] = [children[idx], children[idx + 1]];
        const updatedNode = { ...selectedNode, children };
        setSelectedNode(updatedNode);
        setTreeData(prev => updateTree(prev, updatedNode.id, () => updatedNode));
        toast.success('节点下移成功');
      } else {
        toast.info('节点已在最底部');
      }
    } else if (action === 'top') {
      if (idx > 0) {
        const children = [...selectedNode.children];
        const item = children.splice(idx, 1)[0];
        children.unshift(item);
        const updatedNode = { ...selectedNode, children };
        setSelectedNode(updatedNode);
        setTreeData(prev => updateTree(prev, updatedNode.id, () => updatedNode));
        toast.success('节点已移至顶部');
      } else {
        toast.info('节点已在最顶部');
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
    } else if (type === 'CREATE_PROPERTY') {
      setPropertyForm({ name: '', type: 'INDICATOR', sourcePath: '', unit: '', value: '', formula: '' });
    } else if (type === 'ADD_REFERENCE') {
      setReferenceForm({ targetId: '', referenceType: 'CROSS_DIMENSION' });
    } else if (type === 'EDIT_CHILD' && selectedNode && selectedNode.children) {
        setModalInput(selectedNode.children[payload.idx].label);
    }
  };

  const getAllNodes = useCallback((nodes: ElementNode[]): ElementNode[] => {
    let all: ElementNode[] = [];
    nodes.forEach(n => {
      all.push(n);
      if (n.children) {
        all = all.concat(getAllNodes(n.children));
      }
    });
    return all;
  }, []);

  const referenceOptions = useMemo(() => {
    if (modalState.type !== 'ADD_REFERENCE' || !selectedNode) return [];
    const allNodes = getAllNodes(treeData);
    return allNodes
      .filter(n => n.id !== selectedNode.id)
      .map(n => ({ value: n.id, label: `${n.label} (${n.path})` }));
  }, [treeData, selectedNode, modalState.type, getAllNodes]);

  const [treeWidth, setTreeWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = React.useCallback((mouseDownEvent: React.MouseEvent) => {
    setIsResizing(true);
  }, []);

  const stopResizing = React.useCallback(() => {
    setIsResizing(false);
  }, []);

  const containerRef = React.useRef<HTMLDivElement>(null);

  const resize = React.useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const newWidth = mouseMoveEvent.clientX - containerRect.left;
        if (newWidth > 200 && newWidth < 800) {
          setTreeWidth(newWidth);
        }
      }
    },
    [isResizing]
  );

  React.useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  return (
    <div ref={containerRef} className={`h-full flex flex-col md:flex-row gap-0 overflow-hidden relative ${isResizing ? 'select-none' : ''}`}>
      {/* Left Panel: Tree View */}
      <div style={{ width: treeWidth }} className="shrink-0 flex flex-col max-h-[calc(100vh-12rem)] overflow-y-auto custom-scrollbar border border-gray-100 rounded-2xl bg-white shadow-sm">
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

      {/* Resize Handle */}
      <div 
        className={`w-1.5 hover:w-1.5 cursor-col-resize flex-shrink-0 transition-colors duration-200 hover:bg-indigo-400/30 group relative z-20 ${isResizing ? 'bg-indigo-500/50' : ''}`}
        onMouseDown={startResizing}
      >
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-gray-200 group-hover:bg-indigo-300 transition-colors" />
      </div>

      {/* Right Panel: Details */}
      <Card className="flex-1 flex flex-col p-0 overflow-y-auto custom-scrollbar max-h-[calc(100vh-12rem)] min-h-[500px] min-w-0">
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

            onUpdateMetadata={(data) => updateElementMetadata(selectedNode.id, data)}
            onUpdateDataSource={(data) => updateDataSourceBinding(selectedNode.id, data)}
            onApplyTemplate={(templateId) => applyTemplate(selectedNode.id, templateId)}
            onCreateProperty={(property) => createProperty(selectedNode.id, property)}
            onAddReference={(refData) => addDimensionReference(selectedNode.id, refData)}
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
      </Card>

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
          modalState.type === 'ADD_TEMPLATE' ? '应用模板' :
          modalState.type === 'CREATE_PROPERTY' ? '创建属性' :
          modalState.type === 'ADD_REFERENCE' ? '添加维度引用' :
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
                    autoFocus
                />
                {selectedTemplate && (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-600">
                    <p className="font-medium text-gray-800 mb-1">模板说明:</p>
                    <p>该模板包含标准的运行状态、温度、压力等属性配置，应用后将自动为当前节点创建这些属性。</p>
                  </div>
                )}
             </div>
          )}
          {modalState.type === 'CREATE_PROPERTY' && (
             <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">属性名称</label>
                  <Input size="sm" value={propertyForm.name} onChange={val => setPropertyForm(prev => ({...prev, name: val}))} placeholder="输入属性名称" autoFocus />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">属性类型</label>
                  <Select 
                    size="sm" 
                    value={propertyForm.type} 
                    onChange={val => setPropertyForm(prev => ({...prev, type: val}))}
                    options={[
                      {label: 'INDICATOR (指标)', value: 'INDICATOR'},
                      {label: 'TAG (标签)', value: 'TAG'},
                      {label: 'FORMULA (公式)', value: 'FORMULA'}
                    ]}
                  />
                </div>
                {propertyForm.type === 'INDICATOR' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500">测点路径 (sourcePath)</label>
                      <Input size="sm" value={propertyForm.sourcePath} onChange={val => setPropertyForm(prev => ({...prev, sourcePath: val}))} placeholder="例如: root.device.sensor1" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500">单位</label>
                      <Input size="sm" value={propertyForm.unit} onChange={val => setPropertyForm(prev => ({...prev, unit: val}))} placeholder="例如: °C, MPa" />
                    </div>
                  </>
                )}
                {propertyForm.type === 'TAG' && (
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">静态值</label>
                    <Input size="sm" value={propertyForm.value} onChange={val => setPropertyForm(prev => ({...prev, value: val}))} placeholder="输入静态值" />
                  </div>
                )}
                {propertyForm.type === 'FORMULA' && (
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">公式表达式</label>
                    <Input size="sm" value={propertyForm.formula} onChange={val => setPropertyForm(prev => ({...prev, formula: val}))} placeholder="例如: A + B * 2" />
                  </div>
                )}
             </div>
          )}
          {modalState.type === 'ADD_REFERENCE' && (
             <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">目标节点</label>
                  <Select 
                    size="sm" 
                    value={referenceForm.targetId} 
                    onChange={val => setReferenceForm(prev => ({...prev, targetId: val}))} 
                    options={referenceOptions}
                    placeholder="请选择要引用的节点"
                    autoFocus
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">引用类型</label>
                  <Select 
                    size="sm" 
                    value={referenceForm.referenceType} 
                    onChange={val => setReferenceForm(prev => ({...prev, referenceType: val}))}
                    options={[
                      {label: '跨维度引用 (CROSS_DIMENSION)', value: 'CROSS_DIMENSION'}
                    ]}
                  />
                </div>
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
