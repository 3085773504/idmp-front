import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Bell, ChevronRight, Home, LayoutTemplate, PanelBottom } from 'lucide-react';
import Button from '../ui/Button';
import { User } from '../../types';

interface HeaderProps {
  user: User;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  title: string;
  layoutMode?: 'sidebar' | 'bottom';
  onToggleLayout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  user, 
  sidebarOpen, 
  setSidebarOpen, 
  title,
  layoutMode = 'sidebar',
  onToggleLayout
}) => {
  return (
    <header className="h-20 shrink-0 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-8 z-30 sticky top-0">
      <div className="flex items-center gap-4 lg:hidden">
        <Button variant="ghost" isIconOnly onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu className="w-6 h-6 text-gray-600" />
        </Button>
      </div>

      <div className="flex-1 hidden md:flex items-center gap-2 text-sm text-gray-500">
        <div className="flex items-center gap-1 hover:text-primary-600 transition-colors cursor-pointer">
            <Home className="w-4 h-4" />
            <span>首页</span>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300" />
        <AnimatePresence mode="wait">
          <motion.span 
            key={title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="font-bold text-gray-900"
          >
            {title}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-5">
        {onToggleLayout && (
          <Button 
            variant="ghost" 
            isIconOnly 
            shape="circle" 
            className="relative !bg-gray-100/50 text-gray-600 hover:text-primary-600"
            onClick={onToggleLayout}
            title={layoutMode === 'sidebar' ? "切换到底部导航" : "切换到侧边栏导航"}
          >
            {layoutMode === 'sidebar' ? <PanelBottom className="w-5 h-5" /> : <LayoutTemplate className="w-5 h-5" />}
          </Button>
        )}

        <Button variant="ghost" isIconOnly shape="circle" className="relative !bg-gray-100/50">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white ring-1 ring-red-500/20"></span>
        </Button>
        
        <div className="flex items-center gap-3 pl-5 border-l border-gray-100">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900 leading-tight">{user.name}</p>
            <p className="text-[11px] text-gray-400 uppercase tracking-widest mt-0.5">Administrator</p>
          </div>
          <motion.img 
            whileHover={{ scale: 1.05 }}
            src={user.avatar} 
            className="w-10 h-10 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-100 cursor-pointer" 
            alt="user" 
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
