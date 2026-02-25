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

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  
  // Child list state
  const [childSearchKeyword, setChildSearchKeyword] = useState('');
  const [childCategoryFilter, setChildCategoryFilter] = useState('');
  const [childTemplateFilter, setChildTemplateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const loadTree = useCallback(async () => {
    setViewState('LOADING');
    try {
      const data = await provider.getTree(dimension);
      setTreeData(data);
      setViewState('EMPTY');
      setSelectedNode(null);
      setSelectedProperty(null);
      // Auto expand root
      if (data.length > 0) {
        setExpandedIds(new Set([data[0].id]));
      }
    } catch (e) {
      setViewState('ERROR');
    }
  }, [dimension, provider]);

  useEffect(() => {
    loadTree();
  }, [loadTree]);

  // Reset pagination when filters change or node changes
  useEffect(() => {
    setCurrentPage(1);
  }, [childSearchKeyword, childCategoryFilter, childTemplateFilter, selectedNode]);

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
    // Reset child filters
    setChildSearchKeyword('');
    setChildCategoryFilter('');
    setChildTemplateFilter('');
  }, [loadProperties]);

  const handleSelectProperty = useCallback((property: Property) => {
    setSelectedProperty(property);
    setViewState('PROPERTY_DETAIL');
  }, []);

  const handleBackToElement = useCallback(() => {
    setSelectedProperty(null);
    setViewState('ELEMENT_DETAIL');
  }, []);

  // Helper: Generate slug from name
  const generateSlug = (name: string): string => {
    return name.trim().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-_]/g, '');
  };

  // Helper: Generate unique path
  const generateUniquePath = (parentPath: string, slug: string, siblings: ElementNode[]): string => {
    const basePath = `${parentPath}.${slug}`;
    let uniquePath = basePath;
    let counter = 2;
    
    // Check if path exists in siblings
    while (siblings.some(s => s.path === uniquePath)) {
      uniquePath = `${basePath}-${counter}`;
      counter++;
    }
    return uniquePath;
  };

  // Filtered Tree Data
  const filteredTreeData = useMemo(() => {
    if (!categoryFilter) return treeData;
    
    const filterNode = (nodes: ElementNode[]): ElementNode[] => {
      return nodes.reduce((acc, node) => {
        // Case-insensitive contains match
        const matches = node.category?.toLowerCase().includes(categoryFilter.toLowerCase());
        const filteredChildren = node.children ? filterNode(node.children) : [];
        
        if (matches || filteredChildren.length > 0) {
          acc.push({ ...node, children: filteredChildren });
        }
        return acc;
      }, [] as ElementNode[]);
    };

    return filterNode(treeData);
  }, [treeData, categoryFilter]);

  const getBreadcrumbs = useCallback((nodeId: string): ElementNode[] => {
    const path: ElementNode[] = [];
    
    const findNode = (nodes: ElementNode[], targetId: string): boolean => {
      for (const node of nodes) {
        if (node.id === targetId) {
          path.push(node);
          return true;
        }
        if (node.children) {
          if (findNode(node.children, targetId)) {
            path.unshift(node);
            return true;
          }
        }
      }
      return false;
    };
    
    findNode(treeData, nodeId);
    return path;
  }, [treeData]);
  const filteredChildren = useMemo(() => {
    if (!selectedNode || !selectedNode.children) return [];
    
    return selectedNode.children.filter(child => {
      const matchKeyword = !childSearchKeyword || 
        child.label.toLowerCase().includes(childSearchKeyword.toLowerCase()) ||
        child.path.toLowerCase().includes(childSearchKeyword.toLowerCase());
      
      const matchCategory = !childCategoryFilter || child.category === childCategoryFilter;
      const matchTemplate = !childTemplateFilter || child.template === childTemplateFilter;

      return matchKeyword && matchCategory && matchTemplate;
    });
  }, [selectedNode, childSearchKeyword, childCategoryFilter, childTemplateFilter]);

  // Paginated Children Logic
  const paginatedChildren = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredChildren.slice(start, start + pageSize);
  }, [filteredChildren, currentPage, pageSize]);

  // Unique categories and templates for filters
  const availableCategories = useMemo(() => {
    if (!selectedNode || !selectedNode.children) return [];
    return Array.from(new Set(selectedNode.children.map(c => c.category).filter(Boolean))) as string[];
  }, [selectedNode]);

  const availableTemplates = useMemo(() => {
    if (!selectedNode || !selectedNode.children) return [];
    return Array.from(new Set(selectedNode.children.map(c => c.template).filter(Boolean))) as string[];
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
  
  // Path update helper
  const updatePathRecursively = (node: ElementNode, newParentPath: string): ElementNode => {
    // Simple slug generation: use last part of old path or label if new
    const oldSlug = node.path.split('.').pop() || node.label; 
    const newPath = `${newParentPath}.${oldSlug}`;
    
    const updatedNode = { ...node, path: newPath };
    if (updatedNode.children) {
      updatedNode.children = updatedNode.children.map(child => updatePathRecursively(child, newPath));
    }
    return updatedNode;
  };

  const handleToggleFavorite = useCallback(() => {
    if (!selectedNode) return;
    const updatedNode = { ...selectedNode, isFavorite: !selectedNode.isFavorite };
    setSelectedNode(updatedNode);
    setTreeData(prev => updateTree(prev, updatedNode.id, () => updatedNode));
  }, [selectedNode]);

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
    expandedIds,
    setExpandedIds,
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
    
    handleRefresh,
    handleSelectNode,
    handleSelectProperty,
    handleBackToElement,
    handleToggleFavorite,
    updateTree,
    deleteFromTree,
    updatePathRecursively,
    getBreadcrumbs,
    generateSlug,
    generateUniquePath
  };
}
