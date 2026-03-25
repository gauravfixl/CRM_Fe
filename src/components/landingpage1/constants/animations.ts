import type { Variants } from "framer-motion"

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.6, ease: "easeOut" },
  }),
}

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -40 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.6, ease: "easeOut" },
  }),
}

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { delay, duration: 0.5, ease: "easeOut" },
  }),
}

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { delay, duration: 0.5, ease: "easeOut" },
  }),
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { delay, duration: 0.5, type: "spring", stiffness: 80 },
  }),
}

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
      type: "spring",
      stiffness: 80,
    },
  }),
}

export const floatLoop: Variants = {
  animate: {
    y: [0, -18, 0],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
  },
}

export const wordStagger = {
  duration: 1,
  staggerDelay: 0.15,
  ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number],
}

export const breatheOut: Variants = {
  animate: {
    scale: [1, 1.03, 1],
    transition: { duration: 2, repeat: 2, ease: "easeInOut" },
  },
}
