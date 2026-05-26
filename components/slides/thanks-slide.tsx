"use client"

import { StepElement } from "@/components/presentation/step-element"
import { motion } from "framer-motion"

// Steps: 1=thanks
export const THANKS_STEPS = 1

export function ThanksSlide() {
  return (
    <div className="relative flex h-full w-full items-center justify-center px-6 py-10 md:px-12 lg:px-20">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-1/4 h-[420px] w-[420px] rounded-full bg-[#22D3EE]/8 blur-[120px]" />
        <div className="absolute -right-16 bottom-1/4 h-[380px] w-[380px] rounded-full bg-[#A855F7]/8 blur-[120px]" />
      </div>

      <StepElement step={1} animation="fadeUp" className="relative z-10 w-full max-w-5xl">
        <div
          className="glass-card relative overflow-hidden rounded-3xl px-8 py-14 text-center md:px-16 md:py-20 lg:px-20 lg:py-24"
          style={{
            border: "1px solid rgba(168, 85, 247, 0.18)",
            boxShadow:
              "0 0 60px rgba(34, 211, 238, 0.08), 0 0 80px rgba(168, 85, 247, 0.06)",
          }}
        >
          <div className="absolute left-0 top-0 h-px w-28 bg-gradient-to-r from-[#22D3EE] to-transparent" />
          <div className="absolute right-0 bottom-0 h-px w-28 bg-gradient-to-l from-[#A855F7] to-transparent" />

          {/* Primary focus */}
          <motion.h1
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-6xl font-bold leading-none tracking-tight gradient-text text-glow-cyan sm:text-7xl md:text-8xl lg:text-9xl"
          >
            Thank you
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mx-auto mt-8 h-px w-16 origin-center bg-gradient-to-r from-transparent via-[#A855F7]/60 to-transparent md:mt-10"
          />

          {/* Secondary message */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mx-auto mt-8 max-w-2xl text-xl font-normal leading-relaxed text-[#94A3B8] md:mt-10 md:text-2xl lg:text-3xl"
          >
            for sharing a piece of your life with me.
          </motion.p>
        </div>
      </StepElement>
    </div>
  )
}
