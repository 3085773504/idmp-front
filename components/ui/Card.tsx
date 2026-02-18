import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { BaseProps } from '../../types';

interface CardProps extends BaseProps, Omit<HTMLMotionProps<"div">, "children" | "className"> {
  hoverEffect?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', hoverEffect = false, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hoverEffect ? { y: -4, boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)" } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;