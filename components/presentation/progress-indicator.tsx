"use client"

import { motion } from "framer-motion"
import { usePresentation } from "./presentation-context"

export function ProgressIndicator() {
  const { currentSlide, currentStep, totalSlides, slideConfigs } = usePresentation()
  
  // Calculate total steps progress
  let totalStepsCompleted = 0
  let totalStepsAll = 0
  
  for (let i = 0; i < slideConfigs.length; i++) {
    totalStepsAll += slideConfigs[i].totalSteps
    if (i < currentSlide) {
      totalStepsCompleted += slideConfigs[i].totalSteps
    } else if (i === currentSlide) {
      totalStepsCompleted += currentStep
    }
  }
  
  const overallProgress = totalStepsAll > 0 ? (totalStepsCompleted / totalStepsAll) * 100 : 0

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-6 px-6 py-3 rounded-full bg-[#0B0F19]/90 backdrop-blur-xl border border-[#1E293B]/50 shadow-2xl">
        {/* Slide dots */}
        <div className="flex items-center gap-2">
          {slideConfigs.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation()
              }}
              className="relative group"
            >
              <motion.div
                className="w-2 h-2 rounded-full transition-colors duration-300"
                style={{
                  backgroundColor: index === currentSlide 
                    ? "#22D3EE" 
                    : index < currentSlide 
                      ? "#22D3EE40" 
                      : "#1E293B",
                }}
                animate={{
                  scale: index === currentSlide ? 1.3 : 1,
                }}
                transition={{ duration: 0.2 }}
              />
              {index === currentSlide && (
                <motion.div
                  layoutId="activeDot"
                  className="absolute inset-0 rounded-full bg-[#22D3EE]/30 blur-sm"
                  style={{ scale: 2 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="w-px h-4 bg-[#1E293B]" />

        {/* Progress bar */}
        <div className="w-32 h-1 rounded-full bg-[#1E293B] overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#22D3EE] to-[#A855F7]"
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>

        {/* Slide counter */}
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="text-[#22D3EE]">{currentSlide + 1}</span>
          <span className="text-[#94A3B8]/50">/</span>
          <span className="text-[#94A3B8]/50">{totalSlides}</span>
        </div>

        {/* Hint */}
        <div className="hidden md:flex items-center gap-2 text-[10px] text-[#94A3B8]/40 font-mono uppercase tracking-wider">
          <kbd className="px-1.5 py-0.5 rounded bg-[#1E293B]/50 border border-[#1E293B]">Space</kbd>
          <span>to advance</span>
        </div>
      </div>
    </div>
  )
}
