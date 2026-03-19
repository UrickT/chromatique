import { Variants } from "motion/react";

export const fadeInVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
  exit: { opacity: 0, y: -20 },
};

export const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};
