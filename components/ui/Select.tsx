
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

const Select: React.FC<SelectProps> = ({ options, value, onChange, placeholder = "请选择...", label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full relative" ref={containerRef}>
      {label && <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">{label}</label>}
      
      <motion.button
        whileTap={{ scale: 0.985 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between px-4 py-3 bg-white border rounded-xl text-left transition-all duration-300 outline-none
          ${isOpen 
            ? 'border-primary-500 ring-4 ring-primary-500/10 shadow-sm' 
            : 'border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'}
        `}
      >
        <span className={`font-medium transition-colors ${selectedOption ? 'text-gray-900' : 'text-gray-400'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <motion.div 
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <ChevronDown className={`w-4 h-4 transition-colors ${isOpen ? 'text-primary-500' : 'text-gray-400'}`} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 6, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ 
              type: "spring", 
              stiffness: 450, 
              damping: 32,
              mass: 0.8
            }}
            className="absolute z-50 w-full bg-white border border-gray-100 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] py-1.5 overflow-hidden origin-top"
          >
            {options.map((option) => {
              const isSelected = value === option.value;
              return (
                <li key={option.value}>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-all duration-200
                      ${isSelected 
                        ? 'bg-primary-50 text-primary-600' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}
                    `}
                  >
                    <span>{option.label}</span>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                      >
                        <Check className="w-4 h-4 text-primary-600 stroke-[3px]" />
                      </motion.div>
                    )}
                  </motion.button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Select;
