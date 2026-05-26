"use client"

import { StepElement } from "@/components/presentation/step-element"
import { usePresentation } from "@/components/presentation/presentation-context"
import { Heart, Brain } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

// Steps: 1=title, 2=first card, 3=second card, 4=use-case bubbles
export const MEANING_STEPS = 4

const USE_CASE_BUBBLES = [
  { label: "做 APP", offset: "ml-0", delay: 0.15, duration: 3.4, accent: "purple" as const },
  { label: "做小游戏", offset: "ml-3 sm:ml-5", delay: 0.28, duration: 3.9, accent: "cyan" as const },
  { label: "写监控脚本", offset: "ml-1 sm:ml-2", delay: 0.4, duration: 4.2, accent: "purple" as const },
  { label: "处理数据", offset: "ml-4 sm:ml-6", delay: 0.22, duration: 3.6, accent: "cyan" as const },
  { label: "做演示文档", offset: "ml-2 sm:ml-3", delay: 0.34, duration: 4.0, accent: "purple" as const },
  { label: "……", offset: "ml-5 sm:ml-7", delay: 0.48, duration: 3.2, accent: "cyan" as const },
] as const

function FloatingUseCaseBubbles({ visible }: { visible: boolean }) {
  return (
    <div
      className="pointer-events-none flex shrink-0 flex-col items-start justify-center gap-2 py-2 sm:gap-2.5 md:gap-3"
      aria-hidden
    >
      {USE_CASE_BUBBLES.map((bubble) => (
        <motion.span
          key={bubble.label}
          initial={{ opacity: 0, scale: 0.85, x: 8 }}
          animate={
            visible
              ? {
                  opacity: 1,
                  scale: 1,
                  x: 0,
                  y: [0, -4, 0],
                }
              : { opacity: 0, scale: 0.85, x: 8, y: 0 }
          }
          transition={{
            opacity: { duration: 0.45, delay: bubble.delay, ease: [0.25, 0.46, 0.45, 0.94] },
            scale: { duration: 0.45, delay: bubble.delay, ease: [0.25, 0.46, 0.45, 0.94] },
            x: { duration: 0.45, delay: bubble.delay, ease: [0.25, 0.46, 0.45, 0.94] },
            y: {
              duration: bubble.duration,
              repeat: visible ? Infinity : 0,
              ease: "easeInOut",
              delay: bubble.delay + 0.45,
            },
          }}
          className={cn(
            "whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] sm:px-3 sm:py-1.5 sm:text-xs md:text-sm",
            "border bg-[#0B0F19]/75 backdrop-blur-md shadow-sm",
            bubble.accent === "purple"
              ? "border-[#A855F7]/30 text-[#C4B5FD]/90 shadow-[0_2px_12px_rgba(168,85,247,0.15)]"
              : "border-[#22D3EE]/28 text-[#A5F3FC]/90 shadow-[0_2px_12px_rgba(34,211,238,0.12)]",
            bubble.offset
          )}
        >
          {bubble.label}
        </motion.span>
      ))}
    </div>
  )
}

export function MeaningSlide() {
  const { isStepVisible } = usePresentation()
  const showBubbles = isStepVisible(4)

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-8 md:px-16">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-[#22D3EE]/5 blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-[#A855F7]/5 blur-[150px]" />
      </div>

      <div className="relative z-10 text-center max-w-5xl overflow-visible">
        {/* Title */}
        <StepElement step={1} animation="fadeUp" className="mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            <span className="text-[#E8EDF5]">Vibe Coding 对</span>
            <span className="gradient-text">我们</span>
            <span className="text-[#E8EDF5]">的意义</span>
          </h2>
        </StepElement>

        {/* Two cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto overflow-visible">
          {/* Card 1: 哄自己开心 */}
          <StepElement step={2} animation="fadeLeft">
            <div 
              className="glass-card rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center group hover:scale-105 transition-transform duration-300"
              style={{
                boxShadow: "0 0 40px rgba(34, 211, 238, 0.1)",
                border: "1px solid rgba(34, 211, 238, 0.2)",
              }}
            >
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                style={{
                  background: "linear-gradient(135deg, rgba(34, 211, 238, 0.2), rgba(34, 211, 238, 0.05))",
                  border: "1px solid rgba(34, 211, 238, 0.3)",
                }}
              >
                <Heart className="w-10 h-10 text-[#22D3EE]" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-[#22D3EE] mb-4">
                哄自己开心
              </h3>
              <p className="text-[#94A3B8] text-lg leading-relaxed">
                做自己真正可以掌控的小工具
                <br />
                没有广告、不用付费、完全贴合心意
                <br />
                <span className="text-[#E8EDF5]">这种快乐，以前做不到</span>
              </p>
            </div>
          </StepElement>

          {/* Card 2: 大脑健身房 */}
          <StepElement step={3} animation="fadeRight">
            <div className="relative w-full overflow-visible">
              <div
                className="glass-card w-full rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center group hover:scale-105 transition-transform duration-300"
                style={{
                  boxShadow: "0 0 40px rgba(168, 85, 247, 0.1)",
                  border: "1px solid rgba(168, 85, 247, 0.2)",
                }}
              >
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                  style={{
                    background: "linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(168, 85, 247, 0.05))",
                    border: "1px solid rgba(168, 85, 247, 0.3)",
                  }}
                >
                  <Brain className="w-10 h-10 text-[#A855F7]" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-[#A855F7] mb-4">
                  大脑健身房
                </h3>
                <p className="text-[#94A3B8] text-lg leading-relaxed">
                  极致锻炼表达能力和需求拆解
                  <br />
                  把模糊想法变成清晰指令
                  <br />
                  <span className="text-[#E8EDF5]">这是AI时代的核心竞争力</span>
                </p>
              </div>
              <AnimatePresence>
                {showBubbles && (
                  <motion.div
                    key="use-case-bubbles"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="absolute left-full top-1/2 z-20 ml-2 -translate-y-1/2 sm:ml-3 md:ml-4"
                  >
                    <FloatingUseCaseBubbles visible />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </StepElement>
        </div>
      </div>
    </div>
  )
}
