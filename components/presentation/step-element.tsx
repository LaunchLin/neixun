"use client"

import { motion } from "framer-motion"
import { usePresentation } from "./presentation-context"
import type { ReactNode } from "react"

interface StepElementProps {
  step: number
  children: ReactNode
  className?: string
  animation?: "fade" | "fadeUp" | "fadeDown" | "fadeLeft" | "fadeRight" | "scale" | "scaleUp" | "typewriter"
  duration?: number
  delay?: number
}

const animations = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  fadeUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  },
  fadeRight: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1 },
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: { opacity: 1, scale: 1, y: 0 },
  },
  typewriter: {
    hidden: { opacity: 0, width: 0 },
    visible: { opacity: 1, width: "auto" },
  },
}

export function StepElement({
  step,
  children,
  className = "",
  animation = "fadeUp",
  duration = 0.5,
  delay = 0,
}: StepElementProps) {
  const { isStepVisible } = usePresentation()
  const visible = isStepVisible(step)
  const variant = animations[animation]

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      variants={variant}
      transition={{
        duration,
        delay: visible ? delay : 0,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  )
}
