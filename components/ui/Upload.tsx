import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { UploadCloud, X, FileText, CheckCircle2, AlertCircle, Trash2, Image as ImageIcon, Film, Loader2 } from 'lucide-react';

interface UploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // bytes, default 5MB
  onUpload?: (files: File[]) => void;
  className?: string;
}

interface FileItem {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  errorMsg?: string;
  preview?: string;
}

const formatBytes = (bytes: number, decimals = 1) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const Upload: React.FC<UploadProps> = ({
  accept = '*',
  multiple = true,
  maxSize = 5 * 1024 * 1024,
  onUpload,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, []);

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      // 随机进度增量，模拟真实网络波动
      progress += Math.random() * 15 + 2;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, progress: 100, status: 'success' } : f
        ));
      } else {
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, progress } : f
        ));
      }
    }, 150);
  };

  const handleFiles = useCallback((newFiles: File[]) => {
    const newFileItems: FileItem[] = newFiles.map(file => {
      const id = Math.random().toString(36).substring(7);
      let preview: string | undefined;

      if (file.type.startsWith('image/')) {
        preview = URL.createObjectURL(file);
      }
      
      if (file.size > maxSize) {
        return {
          id,
          file,
          progress: 0,
          status: 'error',
          errorMsg: `超过 ${formatBytes(maxSize)}`,
          preview
        };
      }

      setTimeout(() => simulateUpload(id), 400);

      return {
        id,
        file,
        progress: 0,
        status: 'uploading',
        preview
      };
    });

    setFiles(prev => multiple ? [...prev, ...newFileItems] : newFileItems);
    onUpload?.(newFiles);
  }, [maxSize, multiple, onUpload]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, [handleFiles]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
    if (inputRef.current) inputRef.current.value = '';
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove?.preview) URL.revokeObjectURL(fileToRemove.preview);
      return prev.filter(f => f.id !== id);
    });
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <ImageIcon className="w-5 h-5" />;
    if (file.type.startsWith('video/')) return <Film className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  // --- Animation Variants ---
  const dropzoneVariants: Variants = {
    idle: { 
      borderColor: '#e2e8f0', 
      backgroundColor: '#f8fafc',
      scale: 1,
      transition: { duration: 0.3 }
    },
    hover: { 
      borderColor: '#6366f1', 
      backgroundColor: '#eff6ff', // primary-50
      scale: 1.01,
      transition: { duration: 0.3 }
    },
    drag: { 
      borderColor: '#4f46e5', // primary-600
      backgroundColor: '#e0e7ff', // primary-100
      scale: 0.98,
      boxShadow: "inset 0 0 20px rgba(99, 102, 241, 0.15)",
      transition: { type: 'spring', stiffness: 400, damping: 25 }
    }
  };

  const cloudIconVariants: Variants = {
    idle: { y: 0, scale: 1 },
    hover: { 
      y: -6, 
      transition: { 
        repeat: Infinity, 
        repeatType: "reverse", 
        duration: 1.5,
        ease: "easeInOut"
      } 
    },
    drag: { 
      scale: 1.2, 
      rotate: [0, -10, 10, 0],
      transition: { 
        rotate: { repeat: Infinity, duration: 0.5 },
        scale: { duration: 0.2 }
      } 
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* 拖拽区域 */}
      <motion.div
        layout
        onClick={() => inputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        variants={dropzoneVariants}
        initial="idle"
        animate={isDragging ? "drag" : "idle"}
        whileHover={!isDragging ? "hover" : undefined}
        className={`
          relative border-2 border-dashed rounded-[32px] p-10 cursor-pointer
          flex flex-col items-center justify-center text-center group
          overflow-hidden select-none
        `}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
        />

        {/* 动态背景装饰 (Grid Pattern) */}
        <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ 
                backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', 
                backgroundSize: '20px 20px' 
            }} 
        />
        
        <motion.div 
          className="w-20 h-20 rounded-3xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-primary-600 mb-6 relative z-10"
          variants={cloudIconVariants}
        >
          <UploadCloud className="w-10 h-10" />
        </motion.div>
        
        <div className="relative z-10 space-y-2">
            <h4 className="text-gray-900 font-bold text-lg tracking-tight">
             {isDragging ? '释放以添加文件' : '点击或拖拽文件上传'}
            </h4>
            <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
            支持 <span className="font-medium text-gray-700">{accept === '*' ? '所有格式' : accept.replace(/,/g, ' ')}</span>，
            最大 <span className="font-medium text-gray-700">{formatBytes(maxSize)}</span>
            </p>
        </div>
      </motion.div>

      {/* 文件列表 */}
      <div className="mt-8 space-y-4">
        <AnimatePresence mode="popLayout">
          {files.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, height: 0, marginBottom: 0, transition: { duration: 0.25 } }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className={`
                group relative bg-white border rounded-2xl p-4 flex items-center gap-5 shadow-sm overflow-hidden
                ${item.status === 'error' ? 'border-red-100' : 'border-gray-100'}
              `}
            >
              {/* 文件预览/图标 */}
              <div className="relative shrink-0 w-12 h-12">
                  {item.preview ? (
                      <div className="w-full h-full rounded-xl overflow-hidden border border-gray-100 relative shadow-sm">
                        <img src={item.preview} alt="preview" className="w-full h-full object-cover" />
                      </div>
                  ) : (
                    <div className={`
                        w-full h-full rounded-xl flex items-center justify-center shadow-sm
                        ${item.status === 'error' ? 'bg-red-50 text-red-500' : 
                        item.status === 'success' ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-50 text-gray-500'}
                    `}>
                        {getFileIcon(item.file)}
                    </div>
                  )}
                  
                  {/* 状态角标动画 */}
                  <div className="absolute -bottom-1.5 -right-1.5 z-10">
                    <AnimatePresence mode="wait">
                        {item.status === 'success' && (
                            <motion.div 
                                key="success"
                                initial={{ scale: 0 }} 
                                animate={{ scale: 1 }} 
                                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                                className="bg-white rounded-full p-0.5 shadow-sm"
                            >
                                <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-50" />
                            </motion.div>
                        )}
                        {item.status === 'error' && (
                             <motion.div 
                                key="error"
                                initial={{ scale: 0 }} 
                                animate={{ scale: 1 }}
                                className="bg-white rounded-full p-0.5 shadow-sm"
                             >
                                 <AlertCircle className="w-5 h-5 text-red-500 fill-red-50" />
                             </motion.div>
                        )}
                    </AnimatePresence>
                  </div>
              </div>

              {/* 文件信息与进度 */}
              <div className="flex-1 min-w-0 flex flex-col justify-center gap-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-bold text-gray-900 truncate pr-4" title={item.file.name}>
                      {item.file.name}
                  </p>
                  <span className={`text-xs font-bold tabular-nums shrink-0 ${
                      item.status === 'error' ? 'text-red-500' : 
                      item.status === 'success' ? 'text-green-600' : 'text-primary-600'
                  }`}>
                    {item.status === 'uploading' ? `${Math.round(item.progress)}%` : 
                     item.status === 'success' ? 'Success' : 'Error'}
                  </span>
                </div>

                {/* 进度条容器 */}
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden relative">
                    {/* 进度条主体 */}
                    <motion.div 
                        className={`h-full rounded-full relative ${item.status === 'error' ? 'bg-red-500' : (item.status === 'success' ? 'bg-green-500' : 'bg-primary-500')}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.progress}%` }}
                        transition={{ ease: "easeOut" }}
                    >
                         {/* 流光特效 (仅在上传时显示) */}
                         {item.status === 'uploading' && (
                             <motion.div
                                className="absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg]"
                                initial={{ x: '-100%' }}
                                animate={{ x: '300%' }}
                                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                             />
                         )}
                    </motion.div>
                </div>
                
                <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>{formatBytes(item.file.size)}</span>
                    {item.status === 'error' && <span className="text-red-500 truncate max-w-[150px]">{item.errorMsg}</span>}
                </div>
              </div>

               {/* 删除按钮 */}
               <motion.button 
                whileHover={{ scale: 1.1, backgroundColor: "#fee2e2", color: "#ef4444" }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); removeFile(item.id); }}
                className="p-2 rounded-xl bg-gray-50 text-gray-400 transition-colors shrink-0"
               >
                 <Trash2 className="w-4 h-4" />
               </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Upload;