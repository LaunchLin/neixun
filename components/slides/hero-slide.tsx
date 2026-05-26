"use client"

import { StepElement } from "@/components/presentation/step-element"
import { usePresentation } from "@/components/presentation/presentation-context"
import { useEffect, useState } from "react"

// Steps: 1=typewriter quote, 2=static quote, 3=strikethrough + main headline
export const HERO_STEPS = 3

const FULL_QUOTE = '"Talk is cheap.\nShow me the code."'
const TYPE_MS = 110 // 0.5× speed (was 55ms)
const PAUSE_MS = 4000

export function HeroSlide() {
  const { isStepVisible, currentStep } = usePresentation()
  const isTyping = currentStep === 1
  const showFinal = isStepVisible(3)
  const [typedLength, setTypedLength] = useState(0)

  useEffect(() => {
    if (!isTyping) {
      if (currentStep >= 2) {
        setTypedLength(FULL_QUOTE.length)
      }
      return
    }

    let index = 0
    let timeoutId: ReturnType<typeof setTimeout>

    const tick = () => {
      if (index < FULL_QUOTE.length) {
        index += 1
        setTypedLength(index)
        timeoutId = setTimeout(tick, TYPE_MS)
      } else {
        timeoutId = setTimeout(() => {
          index = 0
          setTypedLength(0)
          timeoutId = setTimeout(tick, TYPE_MS)
        }, PAUSE_MS)
      }
    }

    setTypedLength(0)
    timeoutId = setTimeout(tick, TYPE_MS)

    return () => clearTimeout(timeoutId)
  }, [isTyping, currentStep])

  const displayedText = isTyping ? FULL_QUOTE.slice(0, typedLength) : FULL_QUOTE
  const lines = displayedText.split("\n")

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-8 md:px-16">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#22D3EE]/5 blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#A855F7]/5 blur-[150px]" />
      </div>

      <div className="relative z-10 text-center max-w-6xl">
        <StepElement step={1} animation="fadeUp" className="mb-16">
          <p className="text-3xl md:text-5xl lg:text-7xl text-[#94A3B8]/70 font-mono leading-tight">
            <span
              className={`transition-all duration-700 ${
                showFinal
                  ? "line-through decoration-[#EF4444]/70 decoration-4 text-[#94A3B8]/30"
                  : ""
              }`}
            >
              {lines.map((line, index) => (
                <span key={index}>
                  {index > 0 && <br />}
                  {line}
                </span>
              ))}
              {isTyping && (
                <span className="ml-0.5 inline-block w-[0.05em] animate-pulse text-[#22D3EE]">
                  |
                </span>
              )}
            </span>
          </p>
        </StepElement>

        <StepElement step={3} animation="scale" className="mb-10">
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold tracking-tight leading-none">
            <span className="gradient-text text-glow-cyan">
              No, talk IS the code.
            </span>
          </h1>
        </StepElement>
      </div>
    </div>
  )
}
