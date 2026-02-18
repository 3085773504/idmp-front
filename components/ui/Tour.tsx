
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import Button from './Button';

export interface TourStep {
  target: string; // CSS Selector (e.g., "#my-button" or ".sidebar-header")
  title: string;
  description: string;
  placement?: 'top' | 'bottom' | 'left' | 'right'; // Preferred placement
}

interface TourProps {
  steps: TourStep[];
  isOpen: boolean;
  onClose: () => void;
  onFinish?: () => void;
}

const Tour: React.FC<TourProps> = ({ steps, isOpen, onClose, onFinish }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isCalculated, setIsCalculated] = useState(false);

  // Reset step when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setIsCalculated(false);
    }
  }, [isOpen]);

  const updatePosition = useCallback(() => {
    if (!isOpen || !steps[currentStep]) return;

    const selector = steps[currentStep].target;
    const element = document.querySelector(selector);

    if (element) {
      // Scroll into view smoothly if needed
      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      
      // Get dimensions
      const rect = element.getBoundingClientRect();
      setTargetRect(rect);
      setIsCalculated(true);
    } else {
      // Element not found, verify selector or wait for render
      console.warn(`Tour: Element not found for selector "${selector}"`);
    }
  }, [isOpen, currentStep, steps]);

  // Update position on step change, resize, or scroll
  useEffect(() => {
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true); // Capture scroll

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [updatePosition]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onFinish?.();
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Calculate Popover Position
  const getPopoverStyle = () => {
    if (!targetRect) return {};

    const gap = 16;
    const step = steps[currentStep];
    const preferredPlacement = step.placement || 'bottom';
    
    // Basic positioning logic (can be enhanced with floating-ui for collision detection)
    let top = 0;
    let left = 0;
    const width = 320; // Fixed width for popover

    // Simple adaptive logic
    const spaceBelow = window.innerHeight - targetRect.bottom;
    const spaceAbove = targetRect.top;
    const isMobile = window.innerWidth < 640;

    let placement = preferredPlacement;

    // Flip if not enough space
    if (placement === 'bottom' && spaceBelow < 250 && spaceAbove > 250) placement = 'top';
    if (placement === 'top' && spaceAbove < 250 && spaceBelow > 250) placement = 'bottom';

    if (isMobile) {
        // Center on mobile mostly
        placement = spaceBelow > 200 ? 'bottom' : 'top';
    }

    switch (placement) {
      case 'top':
        top = targetRect.top - gap;
        left = targetRect.left + (targetRect.width / 2) - (width / 2);
        break;
      case 'bottom':
        top = targetRect.bottom + gap;
        left = targetRect.left + (targetRect.width / 2) - (width / 2);
        break;
      case 'left':
        top = targetRect.top;
        left = targetRect.left - width - gap;
        break;
      case 'right':
        top = targetRect.top;
        left = targetRect.right + gap;
        break;
    }

    // Safety bounds check (Keep within screen)
    if (left < 10) left = 10;
    if (left + width > window.innerWidth - 10) left = window.innerWidth - width - 10;
    if (placement === 'top') {
        // We can't know height easily before render, but we can use transform translateY(-100%)
    }

    return { top, left, placement };
  };

  if (!isOpen) return null;

  const { top, left, placement } = getPopoverStyle();
  const stepData = steps[currentStep];

  return (
    <AnimatePresence>
      {isOpen && targetRect && (
        <>
          {/* Spotlight Layer */}
          {/* We use a motion div with a HUGE shadow to create the cutout effect. 
              This is more performant to animate than an SVG mask for simple rectangles. */}
          <motion.div
            className="fixed z-[9998] pointer-events-none rounded-xl"
            initial={false}
            animate={{
              top: targetRect.top - 4, // Add padding
              left: targetRect.left - 4,
              width: targetRect.width + 8,
              height: targetRect.height + 8,
              // The shadow creates the backdrop
              boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.6)" 
            }}
            transition={{
              type: "spring",
              stiffness: 250,
              damping: 30,
              mass: 0.8
            }}
          />

          {/* Popover Card */}
          <motion.div
            className="fixed z-[9999] w-[320px] bg-white rounded-2xl shadow-2xl p-6 border border-gray-100"
            style={{ 
                top, 
                left,
                // Adjust vertical alignment based on placement
                transform: placement === 'top' ? 'translateY(-100%)' : 'none' 
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            key={currentStep} // Re-animate slightly on step change
            transition={{ duration: 0.3 }}
          >
            {/* Close Button */}
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
                <X className="w-4 h-4" />
            </button>

            {/* Content */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-primary-50 text-primary-600 text-[10px] font-bold uppercase rounded-md tracking-wider">
                        Step {currentStep + 1} / {steps.length}
                    </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{stepData.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{stepData.description}</p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-400 hover:text-gray-600 px-0"
                    onClick={onClose}
                >
                    跳过
                </Button>
                <div className="flex gap-2">
                    {currentStep > 0 && (
                        <Button variant="secondary" size="sm" onClick={handlePrev} isIconOnly>
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                    )}
                    <Button 
                        size="sm" 
                        onClick={handleNext} 
                        className="px-4"
                        rightIcon={currentStep < steps.length - 1 ? <ChevronRight className="w-4 h-4" /> : undefined}
                    >
                        {currentStep < steps.length - 1 ? '下一步' : '完成'}
                    </Button>
                </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Tour;
