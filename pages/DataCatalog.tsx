import React, { useState } from 'react';
import { AlertCircle, FolderTree } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { useCatalogState } from '@/pages/data-catalog/useCatalogState';
import { CatalogTreePanel } from '@/pages/data-catalog/components/CatalogTreePanel';
import { RootOverviewPanel } from '@/pages/data-catalog/components/RootOverviewPanel';
import { ElementDetailPanel } from '@/pages/data-catalog/components/ElementDetailPanel';
import { PropertyDetailPanel } from '@/pages/data-catalog/components/PropertyDetailPanel';
import { ElementNode } from '@/pages/data-catalog/types';

export default function DataCatalog() {
  const {
    dimension, setDimension,
    filteredTreeData, setTreeData,
    propertiesMap, setPropertiesMap,
    selectedNode, setSelectedNode,
    selectedProperty, setSelectedProperty,
    viewState, setViewState,
    categoryFilter, setCategoryFilter,
    handleRefresh, handleSelectNode, handleSelectProperty,
    handleBackToElement, handleToggleFavorite,
    updateTree, deleteFromTree, getBreadcrumbs
  } = useCatalogState();

  const [modalState, setModalState] = useState<{ type: string | null, payload?: any }>({ type: null });
  const [modalInput, setModalInput] = useState('');

  // Modal Handlers
  const handleModalConfirm = () => {
    const { type, payload } = modalState;
    if (type === 'CREATE_ELEMENT') {
      if (modalInput.trim()) {
        const newNode: ElementNode = {
          id: `new-${Date.now()}`,
          label: modalInput.trim(),
          type: 'DEVICE',
          path: 'root.new',
          children: []
        };
        setTreeData(prev => [...prev, newNode]);
      }
    } else if (type === 'EDIT_ELEMENT' && selectedNode) {
      if (modalInput.trim()) {
        const updatedNode = { ...selectedNode, label: modalInput.trim() };
        setSelectedNode(updatedNode);
        setTreeData(prev => updateTree(prev, updatedNode.id, () => updatedNode));
      }
    } else if (type === 'DELETE_ELEMENT' && selectedNode) {
      setTreeData(prev => deleteFromTree(prev, selectedNode.id));
      setSelectedNode(null);
      setViewState('EMPTY');
    } else if (type === 'EDIT_PROPERTY' && selectedProperty && selectedNode) {
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
        children[payload.idx] = { ...children[payload.idx], label: modalInput.trim() };
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
  };

  const handleChildAction = (action: string, childId: string) => {
    if (!selectedNode || !selectedNode.children) return;
    const children = [...selectedNode.children];
    const idx = children.findIndex(c => c.id === childId);
    if (idx === -1) return;

    if (action === 'delete') {
      setModalState({ type: 'DELETE_CHILD', payload: { childId, idx } });
    } else if (action === 'up' && idx > 0) {
      [children[idx - 1], children[idx]] = [children[idx], children[idx - 1]];
      const updatedNode = { ...selectedNode, children };
      setSelectedNode(updatedNode);
      setTreeData(prev => updateTree(prev, updatedNode.id, () => updatedNode));
    } else if (action === 'down' && idx < children.length - 1) {
      [children[idx + 1], children[idx]] = [children[idx], children[idx + 1]];
      const updatedNode = { ...selectedNode, children };
      setSelectedNode(updatedNode);
      setTreeData(prev => updateTree(prev, updatedNode.id, () => updatedNode));
    } else if (action === 'top' && idx > 0) {
      const [item] = children.splice(idx, 1);
      children.unshift(item);
      const updatedNode = { ...selectedNode, children };
      setSelectedNode(updatedNode);
      setTreeData(prev => updateTree(prev, updatedNode.id, () => updatedNode));
    } else if (action === 'edit') {
      setModalInput(children[idx].label);
      setModalState({ type: 'EDIT_CHILD', payload: { childId, idx } });
    } else if (action === 'detail') {
      handleSelectNode(children[idx]);
    } else if (action === 'copy') {
      setModalState({ type: 'INFO', payload: { message: '已复制子元素' } });
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
      />

      {/* Right Panel: Details */}
      <Card className="flex-1 flex flex-col p-0 overflow-hidden h-[calc(100vh-8rem)]">
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
          modalState.type === 'DELETE_ELEMENT' || modalState.type === 'DELETE_CHILD' ? '删除确认' :
          modalState.type === 'DELETE_PROPERTY' ? '删除确认' :
          '提示'
        }
        footer={
          <div className="px-6 py-5 bg-gray-50/50 flex justify-end gap-3 border-t border-gray-50 shrink-0">
            {modalState.type !== 'INFO' && (
              <Button variant="secondary" className="px-6 rounded-2xl" onClick={() => setModalState({ type: null })}>取消</Button>
            )}
            <Button className="px-8 rounded-2xl" onClick={modalState.type === 'INFO' ? () => setModalState({ type: null }) : handleModalConfirm}>确认</Button>
          </div>
        }
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
            </div>
          )}
          {(modalState.type === 'DELETE_ELEMENT' || modalState.type === 'DELETE_CHILD') && (
            <p className="text-gray-600">确定要删除该元素吗？此操作不可恢复。</p>
          )}
          {modalState.type === 'DELETE_PROPERTY' && (
            <p className="text-gray-600">确定要删除该属性吗？此操作不可恢复。</p>
          )}
          {modalState.type === 'INFO' && (
            <p className="text-gray-600">{modalState.payload?.message}</p>
          )}
        </div>
      </Modal>
    </div>
  );
}
