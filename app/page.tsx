"use client"

import { useEffect, useRef, useState } from "react"
import { PresentationProvider, usePresentation } from "@/components/presentation/presentation-context"
import { Slide } from "@/components/presentation/slide"
import { HeroSlide } from "@/components/slides/hero-slide"
import { ProcessSlide } from "@/components/slides/process-slide"
import { DemoSlide } from "@/components/slides/demo-slide"
import { MeaningSlide } from "@/components/slides/meaning-slide"
import { MethodologySlide } from "@/components/slides/methodology-slide"
import { ShowcaseSlide } from "@/components/slides/showcase-slide"
import { ThanksSlide } from "@/components/slides/thanks-slide"
import { AnimatePresence, motion } from "framer-motion"
import { FullscreenButton } from "@/components/presentation/fullscreen-button"
import { SlideLocator } from "@/components/presentation/slide-locator"

// Slide configuration: each slide has an ID and number of internal steps
// 使用 as const 确保类型稳定
const SLIDE_CONFIGS = [
  { id: "hero", totalSteps: 3 },         // Typewriter quote, static quote, strikethrough + headline
  { id: "process", totalSteps: 7 },      // Title + 6 tools
  { id: "demo", totalSteps: 28 },        // Gemini prompts + videos + tips one by one
  { id: "meaning", totalSteps: 3 },      // Title + 2 cards
  { id: "showcase", totalSteps: 3 },     // 「字游」的可能性 + 2 videos
  { id: "methodology", totalSteps: 5 },  // Title + 4 panels (产品观，倒数第二页)
  { id: "thanks", totalSteps: 1 },       // Thanks only
] as const

function PresentationContent() {
  const { currentSlide } = usePresentation()

  const [locatorOpen, setLocatorOpen] = useState(false)
  const lastOpenRef = useRef(false)

  useEffect(() => {
    // 只在“有精细指针”（鼠标）时启用，避免触摸设备弹出
    const canHover = window.matchMedia?.("(pointer: fine)")?.matches ?? false
    if (!canHover) return

    const threshold = 72 // 右侧多少像素区域内显示

    const onMove = (e: MouseEvent) => {
      const shouldOpen = e.clientX >= window.innerWidth - threshold
      if (shouldOpen === lastOpenRef.current) return
      lastOpenRef.current = shouldOpen
      setLocatorOpen(shouldOpen)
    }

    window.addEventListener("mousemove", onMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  const slides = [
    <HeroSlide key="hero" />,
    <ProcessSlide key="process" />,
    <DemoSlide key="demo" />,
    <MeaningSlide key="meaning" />,
    <ShowcaseSlide key="showcase" />,
    <MethodologySlide key="methodology" />,
    <ThanksSlide key="thanks" />,
  ]

  return (
    <main className="fixed inset-0 h-screen w-screen overflow-hidden bg-[#0B0F19] text-[#E8EDF5]">
      {/* Global background noise texture */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.015] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Slide container */}
      <div className="relative h-full w-full z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.98 }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="absolute inset-0 flex min-h-0 flex-col"
          >
            <Slide slideIndex={currentSlide}>
              {slides[currentSlide]}
            </Slide>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right side quick page locator (默认不显示，鼠标移到右侧显示) */}
      <SlideLocator
        open={locatorOpen}
        items={[
          { id: "hero", label: "首页" },
          { id: "process", label: "流程" },
          { id: "demo", label: "演示" },
          { id: "meaning", label: "含义" },
          { id: "showcase", label: "字游" },
          { id: "methodology", label: "产品观" },
          { id: "thanks", label: "感谢" },
        ]}
      />

      {/* Fullscreen toggle only */}
      <FullscreenButton />
    </main>
  )
}

export default function HomePage() {
  return (
    <PresentationProvider slideConfigs={SLIDE_CONFIGS}>
      <PresentationContent />
    </PresentationProvider>
  )
}
