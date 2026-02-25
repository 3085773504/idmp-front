import React, { useState } from 'react';
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
import { SmoothAreaChart } from '@/components/ui/Charts';

export default function DataCatalog() {
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
    updateTree, deleteFromTree, updatePathRecursively, getBreadcrumbs
  } = useCatalogState();

  const [modalState, setModalState] = useState<{ type: string | null, payload?: any }>({ type: null });
  const [modalInput, setModalInput] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  // Modal Handlers
  const handleModalConfirm = () => {
    const { type, payload } = modalState;
    if (type === 'CREATE_ELEMENT') {
      if (modalInput.trim()) {
        // Determine parent: selectedNode or root if none (but usually we create under selected)
        // If no selectedNode, we might append to root level of treeData... 
        // But for simplicity, let's assume we create under selectedNode if it exists, 
        // or if it's ROOT_OVERVIEW.
        
        // Actually, the requirement says "New element defaults to under currently selected node (if none, root)".
        // Since we only show CREATE button in TreePanel, let's assume we append to selectedNode if selected,
        // or to the root list if nothing selected (though UI might not support "nothing selected" easily).
        
        const parentNode = selectedNode;
        const parentPath = parentNode ? parentNode.path : 'root';
        
        // Simple slug generation
        const slug = modalInput.trim(); // In real app, sanitize this
        const newPath = `${parentPath}.${slug}`;
        
        // Check uniqueness in siblings? 
        // For mock, we just append timestamp to ID to be safe.
        
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
           // Auto expand parent
           setExpandedIds(prev => new Set(prev).add(parentNode.id));
        } else {
           // Append to root
           setTreeData(prev => [...prev, newNode]);
        }
      }
    } else if (type === 'EDIT_ELEMENT' && selectedNode) {
      if (modalInput.trim()) {
        const parentPath = selectedNode.path.substring(0, selectedNode.path.lastIndexOf('.'));
        const newSlug = modalInput.trim();
        const newPath = `${parentPath}.${newSlug}`;
        
        // Update current node
        let updatedNode = { ...selectedNode, label: modalInput.trim(), path: newPath };
        
        // Recursively update children paths
        if (updatedNode.children) {
             updatedNode.children = updatedNode.children.map(child => updatePathRecursively(child, newPath));
        }
        
        setSelectedNode(updatedNode);
        setTreeData(prev => updateTree(prev, updatedNode.id, () => updatedNode));
      }
    } else if (type === 'DELETE_ELEMENT' && selectedNode) {
      setTreeData(prev => deleteFromTree(prev, selectedNode.id));
      setSelectedNode(null);
      setViewState('EMPTY');
    } else if (type === 'ADD_TEMPLATE') {
        if (selectedTemplate) {
            // Mock update template
            if (selectedNode) {
                const updatedNode = { ...selectedNode, template: selectedTemplate };
                setSelectedNode(updatedNode);
                setTreeData(prev => updateTree(prev, updatedNode.id, () => updatedNode));
                setModalState({ type: 'INFO', payload: { message: `已成功应用模板: ${selectedTemplate}` } });
                return; // Skip default close to show info
            }
        }
    }
    // ... (keep existing handlers for properties and children)
    else if (type === 'EDIT_PROPERTY' && selectedProperty && selectedNode) {
      if (modalInput.trim()) {
        const updatedProp = { ...selectedProperty, name: modalInput.trim() };
        setSelectedProperty(updatedProp);
        setPropertiesMap(prev => ({
          ...prev,
          [selectedNode.id]: (prev[selectedNode.id] || []).map(p => p.id === updatedProp.id ? updatedProp : p)
        }));
      }
    } else if (type === 'DELETE_PROPERTY' && selectedProperty && selectedNode) {
      setPropertiesMap(prev => ({
        ...prev,
        [selectedNode.id]: (prev[selectedNode.id] || []).filter(p => p.id !== selectedProperty.id)
      }));
      handleBackToElement();
    } else if (type === 'EDIT_CHILD' && selectedNode && selectedNode.children) {
      if (modalInput.trim()) {
        const children = [...selectedNode.children];
        const child = children[payload.idx];
        const newSlug = modalInput.trim();
        const newPath = `${selectedNode.path}.${newSlug}`;
        
        let updatedChild = { ...child, label: modalInput.trim(), path: newPath };
        if (updatedChild.children) {
             updatedChild.children = updatedChild.children.map(c => updatePathRecursively(c, newPath));
        }
        
        children[payload.idx] = updatedChild;
        
        const updatedNode = { ...selectedNode, children };
        setSelectedNode(updatedNode);
        setTreeData(prev => updateTree(prev, updatedNode.id, () => updatedNode));
      }
    } else if (type === 'DELETE_CHILD' && selectedNode && selectedNode.children) {
      const children = [...selectedNode.children];
      children.splice(payload.idx, 1);
      const updatedNode = { ...selectedNode, children };
      setSelectedNode(updatedNode);
      setTreeData(prev => updateTree(prev, updatedNode.id, () => updatedNode));
    }
    setModalState({ type: null });
    setModalInput('');
    setSelectedTemplate('');
  };

  const handleChildAction = (action: string, childId: string) => {
    if (!selectedNode || !selectedNode.children) return;
    const idx = selectedNode.children.findIndex(c => c.id === childId);
    if (idx === -1) return;

    if (action === 'edit') {
      openModal('EDIT_CHILD', { idx });
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
    <div className="h-full flex flex-col md:flex-row gap-6">
      {/* Left Panel: Tree View */}
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

      {/* Right Panel: Details */}
      <Card className="flex-1 flex flex-col p-0 overflow-hidden h-[calc(100vh-8rem)]">
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
          modalState.type === 'ADD_TEMPLATE' ? '选择模板' :
          modalState.type === 'HISTORY' ? '历史趋势' :
          '提示'
        }
        footer={
          modalState.type === 'HISTORY' ? null : (
            <div className="px-6 py-5 bg-gray-50/50 flex justify-end gap-3 border-t border-gray-50 shrink-0">
                {modalState.type !== 'INFO' && (
                <Button variant="secondary" className="px-6 rounded-2xl" onClick={() => setModalState({ type: null })}>取消</Button>
                )}
                <Button className="px-8 rounded-2xl" onClick={modalState.type === 'INFO' ? () => setModalState({ type: null }) : handleModalConfirm}>确认</Button>
            </div>
          )
        }
        className={modalState.type === 'HISTORY' ? '!max-w-2xl' : ''}
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
          {modalState.type === 'INFO' && (
            <p className="text-gray-600">{modalState.payload?.message}</p>
          )}
        </div>
      </Modal>
    </div>
  );
}
