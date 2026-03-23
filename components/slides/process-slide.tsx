"use client"

import { StepElement } from "@/components/presentation/step-element"
import { 
  Sparkles, 
  Palette, 
  Database, 
  Code2, 
  GitBranch, 
  Rocket,
  type LucideIcon
} from "lucide-react"

interface NodeData {
  id: number
  tool: string
  role: string
  task: string
  icon: LucideIcon
  color: string
}

const nodes: NodeData[] = [
  {
    id: 1,
    tool: "Gemini",
    role: "产品经理 & 技术架构师",
    task: "定义需求、设计提示词、全能助理",
    icon: Sparkles,
    color: "#A855F7",
  },
  {
    id: 2,
    tool: "v0",
    role: "UI/UX & 前端开发",
    task: "视觉实现",
    icon: Palette,
    color: "#22D3EE",
  },
  {
    id: 3,
    tool: "Supabase",
    role: "DBA & 后端架构",
    task: "数据库管理",
    icon: Database,
    color: "#A855F7",
  },
  {
    id: 4,
    tool: "Cursor",
    role: "全栈开发工程师",
    task: "集成与执行",
    icon: Code2,
    color: "#22D3EE",
  },
  {
    id: 5,
    tool: "GitHub",
    role: "配置管理员",
    task: "版本控制",
    icon: GitBranch,
    color: "#A855F7",
  },
  {
    id: 6,
    tool: "Vercel",
    role: "运维工程师",
    task: "发布与部署",
    icon: Rocket,
    color: "#22D3EE",
  },
]

// Steps: 1=title, 2-7=nodes (6 cards)
export const PROCESS_STEPS = 7

export function ProcessSlide() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-8 md:px-12 lg:px-16 py-12">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#22D3EE]/10 to-transparent" />
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[#A855F7]/3 blur-[150px]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        {/* Title - Step 1 */}
        <StepElement step={1} animation="fadeUp" className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="gradient-text">一个人 = 一个敏捷开发团队</span>
          </h2>
          <p className="text-[#94A3B8] text-xl md:text-2xl">
            超级个体：6款工具，6种角色，无限可能
          </p>
        </StepElement>

        {/* Nodes grid - 2 rows x 3 columns, larger cards */}
        <div className="grid grid-cols-3 gap-6 md:gap-8">
          {nodes.map((node, index) => (
            <StepElement
              key={node.id}
              step={2 + index}
              animation="scaleUp"
            >
              <div
                className="glass-card rounded-2xl p-6 md:p-8 h-full relative group cursor-default transition-all duration-300 hover:scale-105"
                style={{
                  boxShadow: `0 0 0 1px ${node.color}15`,
                }}
              >
                {/* Glow on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    boxShadow: `0 0 30px ${node.color}20, inset 0 0 30px ${node.color}05`,
                  }}
                />

                <div className="relative z-10 flex flex-col items-center text-center">
                  {/* Icon */}
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      background: `linear-gradient(135deg, ${node.color}20, ${node.color}05)`,
                      border: `1px solid ${node.color}30`,
                    }}
                  >
                    <node.icon className="w-8 h-8" style={{ color: node.color }} />
                  </div>

                  {/* Tool name */}
                  <h3 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: node.color }}>
                    {node.tool}
                  </h3>

                  {/* Role */}
                  <p className="text-[#E8EDF5] text-base md:text-lg font-medium mb-2 leading-tight">
                    {node.role}
                  </p>

                  {/* Task */}
                  <p className="text-[#94A3B8] text-sm md:text-base leading-relaxed">
                    {node.task}
                  </p>

                </div>
              </div>
            </StepElement>
          ))}
        </div>
      </div>
    </div>
  )
}
