import React, { useState, useRef, useEffect } from 'react';
import { motion, PanInfo, useAnimation, useMotionValue, AnimatePresence } from 'framer-motion';
import { navItems, NavItem } from './Sidebar';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

type Orientation = 'horizontal' | 'vertical';
type Placement = 'top' | 'bottom' | 'left' | 'right';

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const [orientation, setOrientation] = useState<Orientation>('horizontal');
  const [placement, setPlacement] = useState<Placement>('top'); // Direction the menu/tooltip pops out
  const [popupMenuId, setPopupMenuId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  
  // Use motion values for absolute position (top-left based)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    // Initial position: Bottom Center
    const { innerWidth, innerHeight } = window;
    const initialWidth = navItems.length * 50 + 20; 
    const initialX = (innerWidth - initialWidth) / 2;
    const initialY = innerHeight - 100;
    
    x.set(initialX);
    y.set(initialY);
    // Default placement is top (popping up) because we are at bottom
    setPlacement('top');
  }, []);

  const handleDrag = (event: any, info: PanInfo) => {
    const { x: mouseX, y: mouseY } = info.point;
    const { innerWidth, innerHeight } = window;

    const isNearVerticalEdge = mouseX < innerWidth * 0.15 || mouseX > innerWidth * 0.85;
    const isNearHorizontalEdge = mouseY < innerHeight * 0.15 || mouseY > innerHeight * 0.85;

    let newOrientation: Orientation = orientation;
    let newPlacement: Placement = placement;

    // Determine Orientation
    if (isNearVerticalEdge && !isNearHorizontalEdge) {
      newOrientation = 'vertical';
    } else if (isNearHorizontalEdge) {
      newOrientation = 'horizontal';
    } else {
        if (isNearVerticalEdge) {
            newOrientation = 'vertical';
        } else {
            newOrientation = 'horizontal';
        }
    }

    // Determine Placement (Pop direction) based on screen position
    if (newOrientation === 'vertical') {
        // If on left side, pop right. If on right side, pop left.
        newPlacement = mouseX < innerWidth / 2 ? 'right' : 'left';
    } else {
        // If on top side, pop bottom. If on bottom side, pop top.
        newPlacement = mouseY < innerHeight / 2 ? 'bottom' : 'top';
    }

    if (newOrientation !== orientation) {
      const rect = navRef.current?.getBoundingClientRect();
      if (rect) {
          const offsetX = mouseX - rect.left;
          const offsetY = mouseY - rect.top;
          
          const newLeft = mouseX - offsetY;
          const newTop = mouseY - offsetX;
          
          const safeLeft = Math.min(Math.max(newLeft, -50), innerWidth - 50);
          const safeTop = Math.min(Math.max(newTop, -50), innerHeight - 50);

          x.set(safeLeft);
          y.set(safeTop);
      }
      setOrientation(newOrientation);
    }
    
    if (newPlacement !== placement) {
        setPlacement(newPlacement);
    }
    
    setPopupMenuId(null); // Close menu on drag
  };

  const handleItemClick = (item: NavItem) => {
    if (!item.children) {
      setActiveTab(item.id);
      setPopupMenuId(null);
    }
  };

  const handleSubItemClick = (id: string) => {
    setActiveTab(id);
    setPopupMenuId(null);
  };

  // Helper to get positioning classes based on placement
  const getPopupClasses = () => {
    switch (placement) {
      case 'top': return 'bottom-full left-1/2 -translate-x-1/2 mb-3 flex-col';
      case 'bottom': return 'top-full left-1/2 -translate-x-1/2 mt-3 flex-col';
      case 'left': return 'right-full top-1/2 -translate-y-1/2 mr-3 flex-col'; // Changed to flex-col
      case 'right': return 'left-full top-1/2 -translate-y-1/2 ml-3 flex-col'; // Changed to flex-col
      default: return 'bottom-full left-1/2 -translate-x-1/2 mb-3 flex-col';
    }
  };

  const getTooltipClasses = () => {
    switch (placement) {
      case 'top': return 'bottom-full mb-2 left-1/2 -translate-x-1/2';
      case 'bottom': return 'top-full mt-2 left-1/2 -translate-x-1/2';
      case 'left': return 'right-full mr-2 top-1/2 -translate-y-1/2';
      case 'right': return 'left-full ml-2 top-1/2 -translate-y-1/2';
      default: return 'bottom-full mb-2 left-1/2 -translate-x-1/2';
    }
  };

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <motion.div
        ref={navRef}
        drag
        dragMomentum={false}
        dragElastic={0.1}
        dragConstraints={containerRef}
        onDrag={handleDrag}
        animate={controls}
        style={{ x, y }}
        layout
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="absolute top-0 left-0 pointer-events-auto cursor-grab active:cursor-grabbing"
      >
        <motion.nav
          layout
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-2xl shadow-gray-200/50 rounded-[2rem] p-2 flex items-center gap-2 ${orientation === 'vertical' ? 'flex-col' : 'flex-row'}`}
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const hasChildren = item.children && item.children.length > 0;
            const isChildActive = hasChildren && item.children?.some(child => child.id === activeTab);
            const isOpen = popupMenuId === item.id;
            
            return (
              <div 
                key={item.id} 
                className="relative group"
                onMouseEnter={() => {
                   if (hasChildren) setPopupMenuId(item.id);
                }}
                onMouseLeave={() => {
                   setPopupMenuId(null);
                }}
              >
                <motion.button
                  layout
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  onClick={() => handleItemClick(item)}
                  className="relative flex flex-col items-center justify-center w-12 h-12 rounded-full shrink-0"
                >
                  {(isActive || isChildActive) && (
                    <motion.div
                      layoutId="bottom-nav-active"
                      className="absolute inset-0 bg-primary-500 rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  
                  <span className="relative z-10">
                    <item.icon 
                      className={`w-5 h-5 transition-colors duration-200 ${
                        (isActive || isChildActive) ? 'text-white' : 'text-gray-500 group-hover:text-primary-600'
                      }`} 
                    />
                  </span>
                  
                  {/* Indicator for children */}
                  {hasChildren && (
                    <span className={`absolute bottom-2 w-1 h-1 rounded-full ${
                      (isActive || isChildActive) ? 'bg-white/50' : 'bg-gray-400'
                    }`} />
                  )}
                  
                  {/* Tooltip - Always show on hover unless menu is open */}
                  {!isOpen && (
                    <span className={`
                      absolute px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20
                      ${getTooltipClasses()}
                    `}>
                      {item.label}
                    </span>
                  )}
                </motion.button>

                {/* Popup Menu */}
                <AnimatePresence>
                  {isOpen && hasChildren && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className={`
                        absolute bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-xl rounded-2xl p-2 flex gap-1 z-30
                        ${getPopupClasses()}
                      `}
                    >
                      {item.children!.map((child) => {
                        const isChildSelected = activeTab === child.id;
                        return (
                          <button
                            key={child.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSubItemClick(child.id);
                            }}
                            className={`
                              flex items-center gap-2 px-3 py-2 rounded-xl transition-colors whitespace-nowrap
                              ${isChildSelected 
                                ? 'bg-primary-50 text-primary-600' 
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                              }
                            `}
                          >
                            <child.icon className="w-4 h-4" />
                            <span className="text-sm font-medium">{child.label}</span>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.nav>
      </motion.div>
    </div>
  );
};

export default BottomNav;
