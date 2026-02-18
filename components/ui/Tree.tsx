
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  ChevronRight, ChevronDown, Folder, FolderOpen, FileText, File, 
  FileCode, FileJson, Palette, Image as ImageIcon, 
  MoreHorizontal, Edit2, Trash2, Hash, Layout,
  Database, Server, Activity, Cpu, Zap
} from 'lucide-react';

export type TreeVariant = 'default' | 'filesystem' | 'navigation' | 'timeseries';

export interface TreeNode {
  id: string;
  label: string;
  icon?: React.ReactNode;
  children?: TreeNode[];
  // allow other properties
  [key: string]: any;
}

interface TreeProps {
  data: TreeNode[];
  selectedId?: string;
  onSelect?: (node: TreeNode) => void;
  className?: string;
  defaultExpandedIds?: string[];
  enableKeyboard?: boolean;
  variant?: TreeVariant;
}

interface TreeItemProps {
  node: TreeNode;
  level: number;
  selectedId?: string;
  onSelect?: (node: TreeNode) => void;
  expandedIds: Set<string>;
  toggleExpand: (id: string) => void;
  focusedId?: string;
  variant: TreeVariant;
}

// 动画变体配置
const listVariants: Variants = {
  hidden: { 
    height: 0, 
    opacity: 0,
    transition: {
      height: { type: "spring", stiffness: 400, damping: 30, mass: 0.8 },
      opacity: { duration: 0.2 },
      when: "afterChildren"
    }
  },
  visible: { 
    height: 'auto', 
    opacity: 1,
    transition: {
      height: { type: "spring", stiffness: 400, damping: 30, mass: 0.8 },
      opacity: { duration: 0.2 },
      when: "beforeChildren",
      staggerChildren: 0.03
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -10, scale: 0.95 },
  visible: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 500, damping: 30 }
  }
};

// 智能文件图标匹配 (Default 风格)
const getSmartIcon = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'tsx': case 'ts': case 'jsx': case 'js':
      return <FileCode className="w-4 h-4 text-blue-500" />;
    case 'css': case 'scss': case 'less':
      return <Palette className="w-4 h-4 text-pink-500" />;
    case 'json': case 'config':
      return <FileJson className="w-4 h-4 text-amber-500" />;
    case 'png': case 'jpg': case 'svg': case 'ico':
      return <ImageIcon className="w-4 h-4 text-purple-500" />;
    case 'md': case 'txt':
      return <FileText className="w-4 h-4 text-gray-500" />;
    default:
      return null;
  }
};

const TreeItem: React.FC<TreeItemProps> = ({ 
  node, 
  level, 
  selectedId, 
  onSelect, 
  expandedIds, 
  toggleExpand,
  focusedId,
  variant
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;
  const isFocused = focusedId === node.id;

  // --- 风格化逻辑 ---

  // 1. 图标渲染逻辑
  const renderIcon = () => {
    if (node.icon) return node.icon;

    // Filesystem: 填充色文件夹
    if (variant === 'filesystem') {
        const FolderIcon = isExpanded ? FolderOpen : Folder;
        if (hasChildren) {
            return <FolderIcon className="w-4 h-4 fill-amber-400 text-amber-600" />;
        }
        return <File className="w-4 h-4 text-gray-400" />;
    }

    // Navigation: 简约图标
    if (variant === 'navigation') {
        if (hasChildren) return isExpanded ? <Layout className="w-4 h-4 text-gray-600" /> : <Layout className="w-4 h-4 text-gray-400" />;
        return <Hash className="w-4 h-4 text-gray-400" />;
    }

    // Timeseries: 技术/数据风格
    if (variant === 'timeseries') {
        if (hasChildren) {
            // Level 0 usually Database/Cluster, Level 1+ usually Server/Node
            return level === 0 
                ? <Database className="w-4 h-4 text-indigo-500" /> 
                : <Server className="w-4 h-4 text-slate-500" />;
        }
        // Leaf nodes are metrics
        return <Activity className="w-4 h-4 text-emerald-500" />;
    }

    // Default: 智能图标
    const SmartIcon = !hasChildren ? getSmartIcon(node.label) : null;
    if (SmartIcon) return SmartIcon;
    
    // Default Folder
    const DefaultIcon = hasChildren ? (isExpanded ? FolderOpen : Folder) : File;
    return (
      <div className={`relative w-4 h-4 flex items-center justify-center ${hasChildren ? 'text-indigo-500' : 'text-gray-400'}`}>
         <DefaultIcon className="w-4 h-4" />
      </div>
    );
  };

  // 2. 缩进计算
  let paddingLeft = level * 20 + 8;
  if (variant === 'navigation') paddingLeft = level * 16 + 12;
  if (variant === 'timeseries') paddingLeft = level * 18 + 8; // Slightly tighter for mono font

  // 3. 容器样式类
  const containerClasses = useMemo(() => {
      const base = "group relative flex items-center gap-2 rounded-lg cursor-pointer transition-colors duration-200";
      
      if (variant === 'navigation') {
          return `${base} py-2 pr-3 
            ${isSelected ? 'bg-gray-100 text-gray-900 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
          `;
      }

      if (variant === 'timeseries') {
          return `${base} py-1.5 pr-2 font-mono text-xs tracking-tight
            ${isSelected ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
          `;
      }
      
      return `${base} py-1.5 pr-2 
        ${isSelected ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
        ${isFocused && !isSelected ? 'ring-1 ring-primary-200 bg-gray-50' : ''}
      `;
  }, [variant, isSelected, isFocused]);

  // Timeseries visual guide line calculation
  const guideLineClass = variant === 'timeseries' 
      ? 'border-l border-indigo-200/60' 
      : (variant === 'filesystem' ? 'border-l border-dashed border-gray-300' : 'bg-gray-200/80 w-px');

  const guideLineOffset = variant === 'timeseries' ? 7 : 9;

  return (
    <div className="select-none relative">
      <motion.div
        layout="position"
        whileTap={{ scale: 0.98, backgroundColor: variant === 'navigation' ? "rgba(229, 231, 235, 0.5)" : "rgba(241, 245, 249, 0.8)" }}
        onClick={() => onSelect?.(node)}
        className={containerClasses}
        style={{ paddingLeft: `${paddingLeft}px` }}
      >
        {/* Active Indicator */}
        {isSelected && variant !== 'timeseries' && (
          <motion.div 
            layoutId={`tree-active-${variant}`}
            className={`absolute ${variant === 'navigation' ? 'left-0 top-0 bottom-0 w-1 rounded-l-md bg-gray-900' : 'left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-primary-500'}`}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}

        {/* Expand Toggle */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            if (hasChildren) toggleExpand(node.id);
          }}
          className={`
            w-5 h-5 flex items-center justify-center rounded-md hover:bg-black/5 transition-colors cursor-pointer z-10 shrink-0
            ${!hasChildren ? 'invisible' : ''}
          `}
        >
          <motion.div
            initial={false}
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {variant === 'navigation' ? <ChevronRight className="w-3.5 h-3.5 text-gray-500" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
          </motion.div>
        </div>

        {/* Icon */}
        <div className="shrink-0 flex items-center justify-center">
           {renderIcon()}
        </div>

        {/* Label */}
        <span className={`truncate flex-1 transition-all duration-200 ${variant === 'timeseries' ? 'text-xs' : 'text-sm'} ${isSelected ? (variant === 'navigation' ? 'text-gray-900' : (variant === 'timeseries' ? 'font-bold text-indigo-700' : 'font-semibold text-primary-700')) : 'font-medium'}`}>
          {node.label}
        </span>

        {/* Timeseries: Extra Info (simulated value) */}
        {variant === 'timeseries' && !hasChildren && (
            <span className="text-[10px] text-slate-400 font-mono hidden group-hover:inline-block">
                live
            </span>
        )}

        {/* Hover Actions (Edit/Delete) - Optional: Disable for navigation and timeseries */}
        {variant !== 'navigation' && variant !== 'timeseries' && (
            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity duration-200 mr-1">
            <button className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors" onClick={(e) => { e.stopPropagation(); /* stub */ }}>
                <Edit2 className="w-3 h-3" />
            </button>
            <button className="p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors" onClick={(e) => { e.stopPropagation(); /* stub */ }}>
                <Trash2 className="w-3 h-3" />
            </button>
            </div>
        )}
      </motion.div>

      {/* Children Recursion */}
      <AnimatePresence initial={false}>
        {hasChildren && isExpanded && (
          <motion.div
            key="children-container"
            variants={listVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="overflow-hidden relative"
          >
            {/* Guide Line Logic */}
            {variant !== 'navigation' && (
                <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "100%" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className={`absolute top-0 bottom-2 ${guideLineClass}`}
                style={{ left: `${paddingLeft + guideLineOffset}px` }} 
                />
            )}

            {node.children!.map((child) => (
              <motion.div key={child.id} variants={itemVariants}>
                <TreeItem
                  node={child}
                  level={level + 1}
                  selectedId={selectedId}
                  onSelect={onSelect}
                  expandedIds={expandedIds}
                  toggleExpand={toggleExpand}
                  focusedId={focusedId}
                  variant={variant}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Tree: React.FC<TreeProps> = ({ 
  data, 
  selectedId, 
  onSelect, 
  className = '',
  defaultExpandedIds = [],
  enableKeyboard = true,
  variant = 'default'
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(defaultExpandedIds));
  const containerRef = useRef<HTMLDivElement>(null);

  // Flatten logic for keyboard navigation
  const visibleNodes = useMemo(() => {
    const flatten = (nodes: TreeNode[], result: TreeNode[] = []) => {
      for (const node of nodes) {
        result.push(node);
        if (expandedIds.has(node.id) && node.children) {
          flatten(node.children, result);
        }
      }
      return result;
    };
    return flatten(data);
  }, [data, expandedIds]);

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  }, []);

  // Keyboard Event Handler
  useEffect(() => {
    if (!enableKeyboard) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedId) return;

      const currentIndex = visibleNodes.findIndex(n => n.id === selectedId);
      if (currentIndex === -1) return;

      let nextIndex = currentIndex;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (currentIndex < visibleNodes.length - 1) nextIndex++;
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (currentIndex > 0) nextIndex--;
          break;
        case 'ArrowRight':
          e.preventDefault();
          const node = visibleNodes[currentIndex];
          if (node.children && !expandedIds.has(node.id)) {
            toggleExpand(node.id);
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          const currNode = visibleNodes[currentIndex];
          if (currNode.children && expandedIds.has(currNode.id)) {
            toggleExpand(currNode.id); 
          }
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          const n = visibleNodes[currentIndex];
          if (n.children) toggleExpand(n.id);
          break;
      }

      if (nextIndex !== currentIndex) {
        onSelect?.(visibleNodes[nextIndex]);
        const el = containerRef.current?.querySelector(`[data-tree-id="${visibleNodes[nextIndex].id}"]`);
        el?.scrollIntoView({ block: 'nearest' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visibleNodes, selectedId, expandedIds, onSelect, toggleExpand, enableKeyboard]);

  return (
    <div 
        ref={containerRef} 
        className={`w-full outline-none ${className}`}
        tabIndex={0} 
    >
      {data.map((node) => (
        <TreeItem
          key={node.id}
          node={node}
          level={0}
          selectedId={selectedId}
          onSelect={onSelect}
          expandedIds={expandedIds}
          toggleExpand={toggleExpand}
          focusedId={selectedId}
          variant={variant}
        />
      ))}
    </div>
  );
};

export default Tree;
