"use client"

import { StepElement } from "@/components/presentation/step-element"
import { Users, Target, MessageSquare, Rocket } from "lucide-react"

export function MethodologySlide() {
  const panels = [
    {
      icon: Users,
      content: "了解用户是做好产品的根本前提",
      color: "#22D3EE"
    },
    {
      icon: Target,
      content: "做事变得更容易了，不做什么比做什么更重要",
      color: "#A855F7"
    },
    {
      icon: MessageSquare,
      content: "话说不清楚一定是没想清楚",
      color: "#22D3EE"
    },
    {
      icon: Rocket,
      content: "先完成再完美，快速验证比极致体验更重要",
      color: "#A855F7"
    }
  ]

  return (
    <div className="h-full w-full flex flex-col items-center justify-center px-8 py-10">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#A855F7]/5 blur-[150px]" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#22D3EE]/5 blur-[120px]" />
      </div>

      {/* Title */}
      <StepElement step={1} animation="fadeUp">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-12">
          <span className="text-[#E8EDF5]">代码之外：</span>
          <span className="gradient-text">我的产品观</span>
        </h2>
      </StepElement>

      {/* Panels - 4 horizontal bars */}
      <div className="flex flex-col gap-5 max-w-5xl w-full">
        {panels.map((panel, index) => (
          <StepElement key={index} step={index + 2} animation="fadeLeft">
            <div 
              className="glass-card px-8 py-5 rounded-xl border transition-all duration-300 flex items-center gap-6 group hover:scale-[1.02]"
              style={{
                borderColor: `${panel.color}30`,
                boxShadow: `0 0 20px ${panel.color}10`,
              }}
            >
              {/* Icon */}
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                style={{
                  background: `linear-gradient(135deg, ${panel.color}20, ${panel.color}05)`,
                  border: `1px solid ${panel.color}40`,
                }}
              >
                <panel.icon className="w-6 h-6" style={{ color: panel.color }} />
              </div>
              
              {/* Content */}
              <p className="text-2xl md:text-3xl text-[#E8EDF5] leading-normal font-medium">
                {panel.content}
              </p>
            </div>
          </StepElement>
        ))}
      </div>
    </div>
  )
}
