import React, { useState, useEffect } from 'react';
import { 
  FolderTree, Plus, Search, MoreVertical, 
  Database, AlertCircle, 
  Tag, Activity, Calculator, Edit2, RefreshCw,
  ChevronLeft, Star, Copy, ArrowUp, ArrowDown, ArrowUpToLine,
  Trash2, FileText, Download, ExternalLink, Info, Shield, History,
  LineChart
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Tree, { TreeNode } from '../components/ui/Tree';
import Tabs from '../components/ui/Tabs';
import Modal from '../components/ui/Modal';

// Types
type Dimension = 'PHYSICAL' | 'FUNCTION' | 'ASSET';
type ElementType = 'ROOT' | 'FACTORY' | 'WORKSHOP' | 'LINE' | 'DEVICE' | 'SENSOR';

interface ElementNode extends TreeNode {
  type: ElementType;
  path: string;
  template?: string;
  category?: string;
  description?: string;
  location?: Record<string, string>;
  additionalProperties?: Record<string, string>;
  defaultProperties?: string;
  isFavorite?: boolean;
  stats?: {
    totalElements: number;
    totalProperties: number;
    totalTimeSeries: number;
    totalAnalysis: number;
  };
  children?: ElementNode[];
}

interface Property {
  id: string;
  name: string;
  path: string;
  valueType: string;
  length?: number;
  referenceType: string;
  displayValue?: string;
  defaultValue?: string;
  flags: {
    constant: boolean;
    excluded: boolean;
    hidden: boolean;
  };
  limits?: {
    high?: number;
    low?: number;
  };
  prediction?: {
    algorithm: string;
    covariables: string[];
    samplingInterval: string;
    historical: string;
    future: string;
    confidence: number;
  };
  additionalProperties?: Record<string, string>;
  isFile?: boolean;
  fileUrl?: string;
}

// Mock Data
const mockProperties: Record<string, Property[]> = {
  'dev-1': [
    {
      id: 'p1',
      name: '温度',
      path: 'root.bj.ws1.dev1.temp',
      valueType: 'DOUBLE',
      referenceType: '时序数据',
      displayValue: '45.5 °C',
      defaultValue: '0',
      flags: { constant: false, excluded: false, hidden: false },
      limits: { high: 80, low: -10 },
      prediction: {
        algorithm: 'ARIMA',
        covariables: ['压力', '转速'],
        samplingInterval: '1m',
        historical: '7d',
        future: '1h',
        confidence: 0.95
      },
      additionalProperties: { '传感器型号': 'PT100' }
    },
    {
      id: 'p2',
      name: '设备手册',
      path: 'root.bj.ws1.dev1.manual',
      valueType: 'FILE',
      referenceType: '静态属性',
      displayValue: 'manual.pdf',
      flags: { constant: true, excluded: false, hidden: false },
      isFile: true,
      fileUrl: '#'
    }
  ]
};

const mockTreeData: ElementNode[] = [
  {
    id: 'root-1',
    label: '北京一厂',
    type: 'ROOT',
    path: 'root.bj',
    category: '生产基地',
    description: '华北地区主要生产基地',
    stats: {
      totalElements: 1250,
      totalProperties: 5600,
      totalTimeSeries: 3200,
      totalAnalysis: 45
    },
    children: [
      {
        id: 'ws-1',
        label: '装配车间 A',
        type: 'WORKSHOP',
        path: 'root.bj.ws1',
        category: '核心车间',
        template: '标准车间模板',
        location: { '经度': '116.40', '纬度': '39.90' },
        additionalProperties: { '负责人': '王总' },
        children: [
          {
            id: 'dev-1',
            label: '数控机床 01',
            type: 'DEVICE',
            path: 'root.bj.ws1.dev1',
            category: '关键设备',
            template: 'CNC标准模板',
            description: '主轴转速监控设备',
            location: { '工位': 'A-01' },
            additionalProperties: { '维保周期': '30天', '生产商': 'ABC公司' },
            defaultProperties: '温度, 压力',
            isFavorite: true
          }
        ]
      }
    ]
  }
];

// Main Component
export default function DataCatalog() {
  const [dimension, setDimension] = useState<Dimension>('PHYSICAL');
  const [treeData, setTreeData] = useState<ElementNode[]>([]);
  const [propertiesMap, setPropertiesMap] = useState<Record<string, Property[]>>(mockProperties);
  const [selectedNode, setSelectedNode] = useState<ElementNode | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [viewState, setViewState] = useState<'LOADING' | 'ERROR' | 'ROOT_OVERVIEW' | 'ELEMENT_DETAIL' | 'PROPERTY_DETAIL' | 'EMPTY'>('LOADING');
  const [activeTab, setActiveTab] = useState('children');
  const [modalState, setModalState] = useState<{ type: string | null, payload?: any }>({ type: null });
  const [modalInput, setModalInput] = useState('');
  
  // Filters
  const [categoryFilter, setCategoryFilter] = useState('');

  // Load data effect
  useEffect(() => {
    setViewState('LOADING');
    const timer = setTimeout(() => {
      setTreeData(mockTreeData);
      setViewState('EMPTY');
      // Retain selection if possible
      if (selectedNode) {
        setViewState(selectedNode.type === 'ROOT' ? 'ROOT_OVERVIEW' : 'ELEMENT_DETAIL');
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [dimension]);

  // Helpers for tree updates
  const updateTree = (nodes: ElementNode[], id: string, updater: (node: ElementNode) => ElementNode): ElementNode[] => {
    return nodes.map(node => {
      if (node.id === id) return updater(node);
      if (node.children) return { ...node, children: updateTree(node.children, id, updater) };
      return node;
    });
  };

  const deleteFromTree = (nodes: ElementNode[], id: string): ElementNode[] => {
    return nodes.filter(node => node.id !== id).map(node => {
      if (node.children) return { ...node, children: deleteFromTree(node.children, id) };
      return node;
    });
  };

  const handleSelectNode = (node: TreeNode) => {
    const elNode = node as ElementNode;
    setSelectedNode(elNode);
    setSelectedProperty(null);
    if (elNode.type === 'ROOT') {
      setViewState('ROOT_OVERVIEW');
    } else {
      setViewState('ELEMENT_DETAIL');
    }
  };

  const handleSelectProperty = (prop: Property) => {
    setSelectedProperty(prop);
    setViewState('PROPERTY_DETAIL');
  };

  const handleBackToElement = () => {
    setSelectedProperty(null);
    setViewState(selectedNode?.type === 'ROOT' ? 'ROOT_OVERVIEW' : 'ELEMENT_DETAIL');
  };

  const handleToggleFavorite = () => {
    if (!selectedNode) return;
    const updatedNode = { ...selectedNode, isFavorite: !selectedNode.isFavorite };
    setSelectedNode(updatedNode);
    setTreeData(prev => updateTree(prev, updatedNode.id, () => updatedNode));
  };

  const handleDeleteSelectedNode = () => {
    if (!selectedNode) return;
    setModalState({ type: 'DELETE_ELEMENT' });
  };

  const handleEditSelectedNode = () => {
    if (!selectedNode) return;
    setModalInput(selectedNode.label);
    setModalState({ type: 'EDIT_ELEMENT' });
  };

  const handleDeleteSelectedProperty = () => {
    if (!selectedNode || !selectedProperty) return;
    setModalState({ type: 'DELETE_PROPERTY' });
  };

  const handleEditSelectedProperty = () => {
    if (!selectedProperty || !selectedNode) return;
    setModalInput(selectedProperty.name);
    setModalState({ type: 'EDIT_PROPERTY' });
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

  const handleModalConfirm = () => {
    const { type, payload } = modalState;
    if (type === 'CREATE_ELEMENT') {
      if (modalInput.trim()) {
        const newNode: ElementNode = {
          id: `new-${Date.now()}`,
          label: modalInput.trim(),
          type: 'DEVICE',
          path: 'root.new',
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

  // Render Root Overview
  const renderRootOverview = () => {
    if (!selectedNode || !selectedNode.stats) return null;
    const stats = selectedNode.stats;
    return (
      <div className="p-6 h-full flex flex-col overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{selectedNode.label} 概览</h2>
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

  // Render Element Detail
  const renderElementDetail = () => {
    if (!selectedNode) return null;
    return (
      <div className="flex flex-col h-full overflow-hidden">
        {/* Top Actions */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" isIconOnly onClick={() => setViewState('EMPTY')}><ChevronLeft className="w-4 h-4" /></Button>
            <h2 className="text-xl font-bold text-gray-900">{selectedNode.label}</h2>
            {selectedNode.isFavorite && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" leftIcon={<Edit2 className="w-4 h-4" />} onClick={handleEditSelectedNode}>编辑</Button>
            <Button variant="ghost" size="sm" leftIcon={<Star className="w-4 h-4" />} onClick={handleToggleFavorite}>{selectedNode.isFavorite ? '取消收藏' : '收藏'}</Button>
            <Button variant="ghost" size="sm" leftIcon={<Copy className="w-4 h-4" />} onClick={() => setModalState({ type: 'INFO', payload: { message: '已加入模板' } })}>加入模板</Button>
            <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700" leftIcon={<Trash2 className="w-4 h-4" />} onClick={handleDeleteSelectedNode}>删除</Button>
          </div>
        </div>

        {/* Main Info */}
        <div className="p-6 bg-gray-50/50 border-b border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm shrink-0">
          <div><span className="text-gray-500">完整路径:</span> <span className="font-mono">{selectedNode.path}</span></div>
          <div><span className="text-gray-500">分类:</span> {selectedNode.category || '-'}</div>
          <div><span className="text-gray-500">模板:</span> {selectedNode.template || '-'}</div>
          <div><span className="text-gray-500">描述:</span> {selectedNode.description || '-'}</div>
          <div><span className="text-gray-500">默认属性:</span> {selectedNode.defaultProperties || '-'}</div>
          {/* Location */}
          {selectedNode.location && Object.entries(selectedNode.location).map(([k, v]) => (
            <div key={k}><span className="text-gray-500">位置({k}):</span> {v}</div>
          ))}
          {/* Additional Properties */}
          {selectedNode.additionalProperties && Object.entries(selectedNode.additionalProperties).map(([k, v]) => (
            <div key={k}><span className="text-gray-500">{k}:</span> {v}</div>
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
            {activeTab === 'children' && <ChildElementsTab node={selectedNode} onAction={handleChildAction} />}
            {activeTab === 'properties' && <PropertiesTab node={selectedNode} onSelectProperty={handleSelectProperty} propertiesMap={propertiesMap} />}
            {activeTab === 'info' && <InfoTab />}
          </div>
        </div>
      </div>
    );
  };

  // Render Property Detail
  const renderPropertyDetail = () => {
    if (!selectedProperty) return null;
    const p = selectedProperty;
    return (
      <div className="flex flex-col h-full overflow-y-auto p-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" isIconOnly onClick={handleBackToElement}><ChevronLeft className="w-4 h-4" /></Button>
          <h2 className="text-xl font-bold text-gray-900">{p.name} <span className="text-sm font-normal text-gray-500 ml-2">(属性详情)</span></h2>
          <div className="ml-auto flex gap-2">
            <Button variant="secondary" size="sm" leftIcon={<Edit2 className="w-4 h-4" />} onClick={handleEditSelectedProperty}>编辑</Button>
            <Button variant="secondary" size="sm" leftIcon={<History className="w-4 h-4" />} onClick={() => setModalState({ type: 'INFO', payload: { message: '查看历史值' } })}>历史值</Button>
            <Button variant="secondary" size="sm" leftIcon={<LineChart className="w-4 h-4" />} onClick={() => setModalState({ type: 'INFO', payload: { message: '查看趋势' } })}>趋势</Button>
            <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700" leftIcon={<Trash2 className="w-4 h-4" />} onClick={handleDeleteSelectedProperty}>删除</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4">
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

          <Card className="p-4">
            <h3 className="font-bold mb-4 border-b pb-2">配置标志</h3>
            <div className="flex gap-4">
              <Badge variant={p.flags.constant ? 'primary' : 'neutral'}>Constant</Badge>
              <Badge variant={p.flags.excluded ? 'primary' : 'neutral'}>Excluded</Badge>
              <Badge variant={p.flags.hidden ? 'primary' : 'neutral'}>Hidden</Badge>
            </div>
          </Card>

          {p.limits && (
            <Card className="p-4">
              <h3 className="font-bold mb-4 border-b pb-2">限值配置</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">上限 (High):</span> <span>{p.limits.high}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">下限 (Low):</span> <span>{p.limits.low}</span></div>
              </div>
            </Card>
          )}

          {p.prediction && (
            <Card className="p-4">
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
            <Card className="p-4 md:col-span-2">
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

  return (
    <div className="h-full flex flex-col md:flex-row gap-6">
      {/* Left Panel: Tree View */}
      <Card className="w-full md:w-80 flex flex-col p-0 overflow-hidden shrink-0 h-[calc(100vh-8rem)]">
        <div className="p-4 border-b border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-indigo-600" />
              数据目录
            </h3>
            <Button variant="ghost" size="sm" isIconOnly onClick={() => { setModalInput(''); setModalState({ type: 'CREATE_ELEMENT' }); }}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Select 
              value={dimension} 
              onChange={(val) => setDimension(val as Dimension)}
              className="flex-1"
              options={[
                { value: 'PHYSICAL', label: '物理维度' },
                { value: 'FUNCTION', label: '功能维度' },
                { value: 'ASSET', label: '资产维度' }
              ]}
            />
            <Button variant="secondary" isIconOnly onClick={() => setDimension(dimension)}>
              <RefreshCw className={`w-4 h-4 ${viewState === 'LOADING' ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="按类别过滤..." 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar relative">
          {viewState === 'LOADING' ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : treeData.length > 0 ? (
            <Tree 
              data={treeData} 
              selectedId={selectedNode?.id}
              onSelect={handleSelectNode}
              variant="timeseries"
              defaultExpandedIds={['root-1', 'ws-1']}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <FolderTree className="w-12 h-12 mb-2 opacity-20" />
              <p className="text-sm">暂无数据</p>
            </div>
          )}
        </div>
      </Card>

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
            <Button variant="secondary" className="mt-4" onClick={() => setDimension(dimension)}>重试</Button>
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
        {viewState === 'ROOT_OVERVIEW' && renderRootOverview()}
        {viewState === 'ELEMENT_DETAIL' && renderElementDetail()}
        {viewState === 'PROPERTY_DETAIL' && renderPropertyDetail()}
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
              <label className="block text-sm font-medium text-gray-700">名称</label>
              <Input 
                value={modalInput} 
                onChange={(e) => setModalInput(e.target.value)} 
                placeholder="请输入名称" 
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

// Subcomponents for Tabs
const ChildElementsTab = ({ node, onAction }: { node: ElementNode, onAction: (action: string, id: string) => void }) => {
  const children = node.children || [];
  return (
    <div className="p-6 flex flex-col h-full overflow-hidden">
      {/* Toolbar */}
      <div className="flex gap-2 mb-4 shrink-0">
        <Input placeholder="关键字搜索..." className="w-48" />
        <Select options={[{value:'', label:'全部分类'}]} value="" onChange={()=>{}} className="w-32" />
        <Select options={[{value:'', label:'全部模板'}]} value="" onChange={()=>{}} className="w-32" />
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
            {children.length > 0 ? children.map(child => (
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
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">暂无子元素</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination mock */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-500 shrink-0">
        <span>共 {children.length} 条记录</span>
        <div className="flex gap-1">
          <Button variant="secondary" size="sm" disabled>上一页</Button>
          <Button variant="secondary" size="sm" disabled>下一页</Button>
        </div>
      </div>
    </div>
  );
};

const PropertiesTab = ({ node, onSelectProperty, propertiesMap }: { node: ElementNode, onSelectProperty: (p: Property) => void, propertiesMap: Record<string, Property[]> }) => {
  const props = propertiesMap[node.id] || [];
  return (
    <div className="p-6 h-full overflow-auto custom-scrollbar">
      {props.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {props.map(p => (
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

const InfoTab = () => {
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full custom-scrollbar">
      <Card className="p-4">
        <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-900"><FileText className="w-4 h-4 text-indigo-500" /> 关联文档</h3>
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
          <Badge variant="neutral">北京一厂</Badge> <ChevronLeft className="w-4 h-4 rotate-180 text-gray-400" /> 
          <Badge variant="neutral">装配车间 A</Badge> <ChevronLeft className="w-4 h-4 rotate-180 text-gray-400" /> 
          <Badge variant="primary">数控机床 01</Badge>
        </div>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4 bg-gray-50 border-dashed">
          <h3 className="font-bold mb-2 flex items-center gap-2 text-gray-500"><Shield className="w-4 h-4" /> 安全配置</h3>
          <p className="text-xs text-gray-400">暂未实现</p>
        </Card>
        <Card className="p-4 bg-gray-50 border-dashed">
          <h3 className="font-bold mb-2 flex items-center gap-2 text-gray-500"><History className="w-4 h-4" /> 版本历史</h3>
          <p className="text-xs text-gray-400">暂未实现</p>
        </Card>
      </div>
    </div>
  );
};
