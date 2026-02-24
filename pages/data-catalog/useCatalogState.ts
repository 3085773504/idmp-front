import { useState, useEffect, useCallback, useMemo } from 'react';
import { Dimension, ElementNode, Property, ViewState, CatalogProvider } from './types';
import { mockCatalogProvider } from './provider';

export function useCatalogState(provider: CatalogProvider = mockCatalogProvider) {
  const [dimension, setDimension] = useState<Dimension>('PHYSICAL');
  const [treeData, setTreeData] = useState<ElementNode[]>([]);
  const [propertiesMap, setPropertiesMap] = useState<Record<string, Property[]>>({});
  const [selectedNode, setSelectedNode] = useState<ElementNode | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [viewState, setViewState] = useState<ViewState>('LOADING');
  const [categoryFilter, setCategoryFilter] = useState('');

  const loadTree = useCallback(async () => {
    setViewState('LOADING');
    try {
      const data = await provider.getTree(dimension);
      setTreeData(data);
      setViewState('EMPTY');
      setSelectedNode(null);
      setSelectedProperty(null);
    } catch (e) {
      setViewState('ERROR');
    }
  }, [dimension, provider]);

  useEffect(() => {
    loadTree();
  }, [loadTree]);

  const handleRefresh = () => {
    loadTree();
  };

  const loadProperties = useCallback(async (nodeId: string) => {
    if (!propertiesMap[nodeId]) {
      const props = await provider.getProperties(nodeId);
      setPropertiesMap(prev => ({ ...prev, [nodeId]: props }));
    }
  }, [propertiesMap, provider]);

  const handleSelectNode = useCallback((node: ElementNode) => {
    setSelectedNode(node);
    setSelectedProperty(null);
    if (node.type === 'ROOT') {
      setViewState('ROOT_OVERVIEW');
    } else {
      setViewState('ELEMENT_DETAIL');
    }
    loadProperties(node.id);
  }, [loadProperties]);

  const handleSelectProperty = useCallback((prop: Property) => {
    setSelectedProperty(prop);
    setViewState('PROPERTY_DETAIL');
  }, []);

  const handleBackToElement = useCallback(() => {
    setSelectedProperty(null);
    setViewState(selectedNode?.type === 'ROOT' ? 'ROOT_OVERVIEW' : 'ELEMENT_DETAIL');
  }, [selectedNode]);

  // Tree manipulation helpers
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

  const handleToggleFavorite = useCallback(() => {
    if (!selectedNode) return;
    const updatedNode = { ...selectedNode, isFavorite: !selectedNode.isFavorite };
    setSelectedNode(updatedNode);
    setTreeData(prev => updateTree(prev, updatedNode.id, () => updatedNode));
  }, [selectedNode]);

  // Filter tree data
  const filteredTreeData = useMemo(() => {
    if (!categoryFilter.trim()) return treeData;
    
    const filterNode = (node: ElementNode): ElementNode | null => {
      const matches = node.label.toLowerCase().includes(categoryFilter.toLowerCase()) || 
                      (node.category && node.category.toLowerCase().includes(categoryFilter.toLowerCase()));
      
      if (node.children) {
        const filteredChildren = node.children.map(filterNode).filter(Boolean) as ElementNode[];
        if (matches || filteredChildren.length > 0) {
          return { ...node, children: filteredChildren };
        }
      } else if (matches) {
        return node;
      }
      return null;
    };

    return treeData.map(filterNode).filter(Boolean) as ElementNode[];
  }, [treeData, categoryFilter]);

  // Breadcrumb generation
  const getBreadcrumbs = useCallback((targetId: string): ElementNode[] => {
    const path: ElementNode[] = [];
    const findPath = (nodes: ElementNode[], id: string): boolean => {
      for (const node of nodes) {
        path.push(node);
        if (node.id === id) return true;
        if (node.children && findPath(node.children, id)) return true;
        path.pop();
      }
      return false;
    };
    findPath(treeData, targetId);
    return path;
  }, [treeData]);

  return {
    dimension,
    setDimension,
    treeData,
    filteredTreeData,
    setTreeData,
    propertiesMap,
    setPropertiesMap,
    selectedNode,
    setSelectedNode,
    selectedProperty,
    setSelectedProperty,
    viewState,
    setViewState,
    categoryFilter,
    setCategoryFilter,
    handleRefresh,
    handleSelectNode,
    handleSelectProperty,
    handleBackToElement,
    handleToggleFavorite,
    updateTree,
    deleteFromTree,
    getBreadcrumbs
  };
}
