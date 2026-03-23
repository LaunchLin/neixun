"use client"

import { StepElement } from "@/components/presentation/step-element"
import { Heart, Brain } from "lucide-react"

// Steps: 1=title, 2=first card, 3=second card
export const MEANING_STEPS = 3

export function MeaningSlide() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-8 md:px-16">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-[#22D3EE]/5 blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-[#A855F7]/5 blur-[150px]" />
      </div>

      <div className="relative z-10 text-center max-w-5xl">
        {/* Title */}
        <StepElement step={1} animation="fadeUp" className="mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            <span className="text-[#E8EDF5]">Vibe Coding 对</span>
            <span className="gradient-text">我</span>
            <span className="text-[#E8EDF5]">的意义</span>
          </h2>
        </StepElement>

        {/* Two cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
            <div 
              className="glass-card rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center group hover:scale-105 transition-transform duration-300"
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
          </StepElement>
        </div>
      </div>
    </div>
  )
}
