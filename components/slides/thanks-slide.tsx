"use client"

import { StepElement } from "@/components/presentation/step-element"

// Steps: 1=thanks
export const THANKS_STEPS = 1

export function ThanksSlide() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-8 md:px-16">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-[#22D3EE]/10 via-[#A855F7]/10 to-[#22D3EE]/10 blur-[150px]" />
      </div>

      <div className="relative z-10 text-center max-w-4xl">
        {/* Thanks message */}
        <StepElement step={1} animation="scale">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
            <span className="gradient-text text-glow-cyan">Thank you for extending my life.</span>
          </h1>
        </StepElement>
      </div>
    </div>
  )
}
