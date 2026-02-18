import { HTMLMotionProps } from 'framer-motion';

// iOS-like spring animation
export const springTransition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};

export const softSpring = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
};

export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: softSpring
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: softSpring
};
