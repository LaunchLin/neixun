"use client"

import { StepElement } from "@/components/presentation/step-element"
import { usePresentation } from "@/components/presentation/presentation-context"
import { motion } from "framer-motion"

// Steps: 1=quote, 2=strikethrough, 3=main headline
export const HERO_STEPS = 3

export function HeroSlide() {
  const { isStepVisible } = usePresentation()

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-8 md:px-16">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#22D3EE]/5 blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#A855F7]/5 blur-[150px]" />
      </div>

      <div className="relative z-10 text-center max-w-6xl">
        {/* Step 1: Original quote - made much larger */}
        <StepElement step={1} animation="fadeUp" className="mb-16">
          <p className="text-3xl md:text-5xl lg:text-7xl text-[#94A3B8]/70 font-mono leading-tight">
            <span 
              className={`transition-all duration-700 ${
                isStepVisible(2) 
                  ? "line-through decoration-[#EF4444]/70 decoration-4 text-[#94A3B8]/30" 
                  : ""
              }`}
            >
              {'"Talk is cheap.'}
              <br />
              {'Show me the code."'}
            </span>
          </p>
        </StepElement>

        {/* Step 3: Main headline with glow */}
        <StepElement step={3} animation="scale" className="mb-10">
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold tracking-tight leading-none">
            <span className="gradient-text text-glow-cyan">
              No, talk IS the code.
            </span>
          </h1>
        </StepElement>

        {/* Continue hint - shows after all steps */}
        <StepElement step={3} animation="fade" delay={0.8}>
          <motion.div
            className="mt-20 flex flex-col items-center gap-2"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-6 h-10 rounded-full border-2 border-[#94A3B8]/20 flex items-start justify-center p-2">
              <motion.div 
                className="w-1 h-2 rounded-full bg-[#22D3EE]/60"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <span className="text-[#94A3B8]/30 text-xs font-mono uppercase tracking-widest">
              点击继续
            </span>
          </motion.div>
        </StepElement>
      </div>
    </div>
  )
}
