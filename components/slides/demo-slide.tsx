"use client"

import { StepElement } from "@/components/presentation/step-element"
import { usePresentation, markPreventAdvance, useVideoKeyboardToggle } from "@/components/presentation/presentation-context"
import { 
  Sparkles, 
  Palette, 
  Database, 
  Code2, 
  Rocket,
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize,
  type LucideIcon
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Fragment, useState, useRef, useEffect, useCallback } from "react"
import { presentationVideos } from "@/lib/presentation-videos"
import { cn } from "@/lib/utils"

// Gemini prompt text lines to show before video
const geminiPromptLines = [
  "我是一名互联网产品经理，想尝试 Vibe Coding。",
  "我计划使用这几款工具：v0、Supabase 和 Cursor。\n我计划的步骤是：先在 v0 里设计理想的前端样式，再由 Cursor 连通 Supabase 完成代码。\n如果你觉得有更适合我的工具和方案可以告诉我。",
  "我打算做一款【运动换消费基金】的移动端APP，供我和伴侣使用。\n基本逻辑：当我们完成运动时，会获得虚拟消费基金。每次能够获得的基金数按照消耗的卡路里1:1计算。这笔基金可以用来旅游也可以用来购买大件商品。",
  "我需要的功能如下：\n1. 录入数据：支持录入打卡的人、运动类型、消耗的卡路里，并自动折算成基金。\n2. 展示数据：需要醒目地展示当前基金总额、两个人的基金贡献统计、历史基金明细。\n3. 修改数据：支持对录入错误的记录进行删除或修改。",
  "请你对我进行全程的指导，包括完善需求文档、写给v0、cursor的提示词，解决所有我在这个过程中遇到的问题，直到我完成一个APP。",
  "接下去如果你有95%以上的信心理解我的需求，就开始写一份尽可能完整的需求文档和我进行确认。如果没有，请你先向我提问，再开始写文档。",
]

interface ToolSection {
  id: number
  tool: string
  mapLabel: string
  role: string
  icon: LucideIcon
  color: string
  videoUrl: string
  tips: string[]
  hasPromptIntro?: boolean
  skipTips?: boolean
}

const toolSections: ToolSection[] = [
  {
    id: 1,
    tool: "Gemini",
    mapLabel: "Gemini",
    role: "全能助理",
    icon: Sparkles,
    color: "#A855F7",
    videoUrl: presentationVideos.demoGemini,
    tips: [
      "让AI简单了解你，制定最适合你的沟通方式",
      "让AI知道你为什么要做这样的事情，了解动机更不容易跑偏，还能帮你完善功能",
      "列举功能给AI，增删差改就差不了",
      "让AI用苏格拉底式的提问采访你，减少幻觉",
      "需求逻辑确认的越详细越好，增加准确性，提高效率",
    ],
    hasPromptIntro: true,
  },
  {
    id: 2,
    tool: "v0",
    mapLabel: "v0",
    role: "实现界面和交互逻辑",
    icon: Palette,
    color: "#22D3EE",
    videoUrl: presentationVideos.demoV0,
    tips: [
      "v0和大多数AI一样，是会员+余额制，会员每月赠送余额，任务消耗余额",
      "比起通过文字理解风格，AI更擅长从图片模仿风格，这可以降低抽卡失败率",
      "大多数人没有能力去通过沟通来调整第一眼就不满意的视觉方案，重新抽卡最简单",
      "先跑通核心页面和流程，再打磨细节",
      "修改意见尽可能一次性说完，即节省余额又提高代码稳定性",
      "在提意见的时候，尽可能让自己描述的更精准，例如放大1.5倍而不是放大一点",
      "有设计能力的同学可以联动figma制作出更符合心意的界面",
      "日常工作可用v0制作简单demo，方便演示",
    ]
  },
  {
    id: 3,
    tool: "Supabase",
    mapLabel: "Supabase",
    role: "把用户数据存储在云端",
    icon: Database,
    color: "#A855F7",
    videoUrl: presentationVideos.demoSupabase,
    tips: [],
    skipTips: true
  },
  {
    id: 4,
    tool: "Cursor",
    mapLabel: "Cursor",
    role: "全栈开发，联调前后端代码",
    icon: Code2,
    color: "#22D3EE",
    videoUrl: presentationVideos.demoCursor,
    tips: [
      "不会的操作直接下指令让cursor完成，不要自己瞎琢磨",
      "对话太长了，AI会降智，不要忍耐，直接新开窗口，强制重启他的大脑",
      "要修改/新增功能的时候，如果cursor生成的界面不满意，让v0先做，截图发给cursor学习",
      "对于效率有高要求的同学可以直接跳过v0，直接用cursor完成所有代码",
    ]
  },
  {
    id: 5,
    tool: "GitHub + Vercel",
    mapLabel: "GitHub / Vercel",
    role: "使代码可随时随地被访问",
    icon: Rocket,
    color: "#A855F7",
    videoUrl: presentationVideos.demoGithubVercel,
    tips: [],
    skipTips: true,
  },
]

// Steps calculation:
// Gemini: Steps 1-6 (6 prompt lines) + Step 7 (video) + Steps 8-12 (5 tips one by one) = 12 steps
// v0: Step 13 (video) + Steps 14-21 (8 tips one by one) = 9 steps
// Supabase: Step 22 (video only, no tips) = 1 step
// Cursor: Step 23 (video) + Steps 24-27 (4 tips one by one) = 5 steps
// GitHub+Vercel: Step 28 (video only) = 1 step
// Total: 12 + 9 + 1 + 5 + 1 = 28 steps
export const DEMO_STEPS = 28

function DemoStepMap({ activeIndex }: { activeIndex: number }) {
  const activeTool = toolSections[activeIndex]
  const ActiveIcon = activeTool.icon

  return (
    <div
      className={cn(
        "flex w-full flex-shrink-0 items-center gap-2 sm:gap-3",
      )}
    >
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10"
        style={{
          background: `linear-gradient(135deg, ${activeTool.color}20, ${activeTool.color}05)`,
          border: `1px solid ${activeTool.color}40`,
        }}
      >
        <ActiveIcon className="h-5 w-5" style={{ color: activeTool.color }} />
      </div>

      <nav
        aria-label="演示流程"
        className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-1 gap-y-0.5"
      >
        {toolSections.map((item, index) => {
          const isActive = index === activeIndex

          return (
            <Fragment key={item.id}>
              {index > 0 && (
                <span
                  aria-hidden
                  className="mx-0.5 select-none text-sm text-[#334155] sm:text-base"
                >
                  —
                </span>
              )}
              <span
                className={cn(
                  "relative inline-flex items-baseline whitespace-nowrap transition-all duration-300",
                  isActive
                    ? "text-lg font-bold sm:text-xl md:text-2xl"
                    : "text-sm font-medium text-[#64748B] sm:text-base md:text-lg"
                )}
                style={isActive ? { color: item.color } : undefined}
                aria-current={isActive ? "step" : undefined}
              >
                <span>{item.mapLabel}</span>
                <AnimatePresence mode="wait">
                  {isActive && (
                    <motion.span
                      key={`${item.id}-role`}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -4 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="ml-0.5 text-sm font-normal text-[#94A3B8] sm:ml-1 sm:text-base md:text-lg"
                    >
                      （{item.role}）
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </Fragment>
          )
        })}
      </nav>
    </div>
  )
}

function VideoPlayer({ videoUrl, isSmall }: { videoUrl: string; isSmall?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showOverlay, setShowOverlay] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const [showControls, setShowControls] = useState(false)
  const [hasEnded, setHasEnded] = useState(false)

  const performTogglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    if (hasEnded) {
      video.currentTime = 0
      setProgress(0)
      setHasEnded(false)
      void video.play()
      setIsPlaying(true)
      setShowOverlay(false)
      return
    }

    if (isPlaying) {
      video.pause()
      setIsPlaying(false)
    } else {
      void video.play()
      setIsPlaying(true)
      setShowOverlay(false)
    }
  }, [hasEnded, isPlaying])

  const activateVideoKeyboard = useVideoKeyboardToggle(performTogglePlay)

  const togglePlay = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    e?.preventDefault()
    markPreventAdvance()
    activateVideoKeyboard()
    performTogglePlay()
  }, [activateVideoKeyboard, performTogglePlay])

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    markPreventAdvance()
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    markPreventAdvance()
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        videoRef.current.requestFullscreen()
      }
    }
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateProgress = () => {
      const percent = (video.currentTime / video.duration) * 100
      setProgress(percent)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setShowOverlay(false)
      setProgress(100)
      setHasEnded(true)
    }

    video.addEventListener("timeupdate", updateProgress)
    video.addEventListener("ended", handleEnded)

    return () => {
      video.removeEventListener("timeupdate", updateProgress)
      video.removeEventListener("ended", handleEnded)
    }
  }, [])

  useEffect(() => {
    setIsPlaying(false)
    setShowOverlay(true)
    setProgress(0)
    setHasEnded(false)
    if (videoRef.current) {
      videoRef.current.load()
    }
  }, [videoUrl])

  const handleVideoAreaClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".video-controls")) return
    e.stopPropagation()
    e.preventDefault()
    togglePlay(e)
  }

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 items-center justify-center">
      <div
        className="video-player-container group relative h-full w-full cursor-pointer rounded-xl"
        style={{
          boxShadow: isSmall
            ? "0 0 20px rgba(34, 211, 238, 0.1)"
            : "0 0 60px rgba(34, 211, 238, 0.2), 0 0 120px rgba(168, 85, 247, 0.15)",
          border: "1px solid rgba(34, 211, 238, 0.3)",
        }}
        onMouseEnter={() => {
          setShowControls(true)
          activateVideoKeyboard()
        }}
        onMouseLeave={() => setShowControls(false)}
        data-no-advance
      >
        {!isSmall && (
          <div className="pointer-events-none absolute -inset-[1px] z-0 rounded-xl bg-gradient-to-r from-[#22D3EE]/30 via-[#A855F7]/30 to-[#22D3EE]/30 opacity-60 blur-sm" />
        )}

        <div className="absolute inset-0 z-10 bg-black/40">
          <video
            ref={videoRef}
            className="bg-black"
            style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center center" }}
            src={videoUrl}
            muted={isMuted}
            playsInline
            preload="metadata"
            data-no-advance
          />
        </div>

        {!showOverlay && (
          <button
            type="button"
            aria-label={isPlaying ? "暂停" : "播放"}
            className="absolute inset-0 z-20 cursor-pointer border-0 bg-transparent p-0"
            onClick={handleVideoAreaClick}
            data-no-advance
          />
        )}

      <AnimatePresence>
        {showOverlay && !hasEnded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-20 bg-[#0B0F19]/55 backdrop-blur-sm flex items-center justify-center"
            onClick={handleVideoAreaClick}
          >
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation()
                togglePlay(e)
              }}
              className={`relative flex items-center justify-center rounded-full no-advance ${isSmall ? 'w-12 h-12' : 'w-24 h-24'}`}
              style={{
                background: "linear-gradient(135deg, rgba(34, 211, 238, 0.2), rgba(168, 85, 247, 0.2))",
                border: "2px solid rgba(34, 211, 238, 0.4)",
                boxShadow: "0 0 30px rgba(34, 211, 238, 0.3), 0 0 60px rgba(168, 85, 247, 0.2)",
              }}
              data-no-advance
            >
              <span className="absolute inset-0 rounded-full animate-ping opacity-30 bg-[#22D3EE]/30" />
              <Play className={`${isSmall ? 'w-5 h-5' : 'w-10 h-10'} text-[#E8EDF5] ml-1 relative z-10`} fill="currentColor" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(showControls || isPlaying) && !showOverlay && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 left-0 right-0 z-30 p-3 video-controls"
            data-no-advance
            style={{ background: "linear-gradient(to top, rgba(11, 15, 25, 0.9), transparent)" }}
          >
            <div className="relative h-1 bg-[#1E293B]/60 rounded-full mb-3 overflow-hidden" data-no-advance>
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #22D3EE, #A855F7)",
                  boxShadow: "0 0 10px rgba(34, 211, 238, 0.5)",
                }}
              />
            </div>
            <div className="flex items-center justify-between video-controls" data-no-advance>
              <div className="flex items-center gap-3">
                <button 
                  onClick={togglePlay} 
                  data-no-advance 
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-[#1E293B]/60 no-advance disabled:opacity-50" 
                  type="button"
                  disabled={hasEnded}
                >
                  {hasEnded ? <span className="text-[10px] text-[#94A3B8]">已结束</span> : isPlaying ? <Pause className="w-4 h-4 text-[#E8EDF5]" /> : <Play className="w-4 h-4 text-[#E8EDF5] ml-0.5" fill="currentColor" />}
                </button>
                <button 
                  onClick={toggleMute} 
                  data-no-advance 
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-[#1E293B]/60 no-advance" 
                  type="button"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-[#94A3B8]" /> : <Volume2 className="w-4 h-4 text-[#E8EDF5]" />}
                </button>
              </div>
              <button 
                onClick={toggleFullscreen} 
                data-no-advance 
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-[#1E293B]/60 no-advance" 
                type="button"
              >
                <Maximize className="w-4 h-4 text-[#94A3B8]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="pointer-events-none absolute top-3 right-3 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: "rgba(11, 15, 25, 0.7)", backdropFilter: "blur(8px)", border: "1px solid rgba(34, 211, 238, 0.2)" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]" />
            </span>
            <span className="text-[10px] text-[#E8EDF5]/80 font-medium">播放中</span>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  )
}

export function DemoSlide() {
  const { currentStep } = usePresentation()
  
  // Calculate state based on step
  // Gemini: Steps 1-6 = prompt lines, Step 7 = video, Steps 8-12 = tips (5 tips)
  // v0: Step 13 = video, Steps 14-21 = tips (8 tips)
  // Supabase: Step 22 = video only
  // Cursor: Step 23 = video, Steps 24-27 = tips (4 tips)
  // GitHub+Vercel: Step 28 = video only
  
  const getState = () => {
    if (currentStep <= 6) {
      return { phase: 'gemini-prompt' as const, toolIndex: 0, promptLine: currentStep, showVideo: false, showTips: false, visibleTips: 0 }
    }
    if (currentStep === 7) {
      return { phase: 'gemini-video' as const, toolIndex: 0, promptLine: 6, showVideo: true, showTips: false, visibleTips: 0 }
    }
    if (currentStep >= 8 && currentStep <= 12) {
      return { phase: 'gemini-tips' as const, toolIndex: 0, promptLine: 6, showVideo: true, showTips: true, visibleTips: currentStep - 7 }
    }
    if (currentStep === 13) {
      return { phase: 'v0-video' as const, toolIndex: 1, promptLine: 0, showVideo: true, showTips: false, visibleTips: 0 }
    }
    if (currentStep >= 14 && currentStep <= 21) {
      return { phase: 'v0-tips' as const, toolIndex: 1, promptLine: 0, showVideo: true, showTips: true, visibleTips: currentStep - 13 }
    }
    if (currentStep === 22) {
      return { phase: 'supabase-video' as const, toolIndex: 2, promptLine: 0, showVideo: true, showTips: false, visibleTips: 0 }
    }
    if (currentStep === 23) {
      return { phase: 'cursor-video' as const, toolIndex: 3, promptLine: 0, showVideo: true, showTips: false, visibleTips: 0 }
    }
    if (currentStep >= 24 && currentStep <= 27) {
      return { phase: 'cursor-tips' as const, toolIndex: 3, promptLine: 0, showVideo: true, showTips: true, visibleTips: currentStep - 23 }
    }
    return { phase: 'vercel-video' as const, toolIndex: 4, promptLine: 0, showVideo: true, showTips: false, visibleTips: 0 }
  }
  
  const state = getState()
  const activeTool = toolSections[state.toolIndex]
  const videoOnly = state.showVideo && !state.showTips

  const isGeminiPrompt = state.phase === "gemini-prompt"
  const promptScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (state.phase !== "gemini-prompt") return
    const container = promptScrollRef.current
    if (!container) return

    const scrollActiveLine = () => {
      const activeLine = container.querySelector('[data-prompt-active="true"]') as HTMLElement | null
      if (!activeLine) {
        container.scrollTo({ top: container.scrollHeight, behavior: "smooth" })
        return
      }

      const scrollPadding = 16
      const containerRect = container.getBoundingClientRect()
      const activeRect = activeLine.getBoundingClientRect()
      const activeBottom = activeRect.bottom - containerRect.top + container.scrollTop
      const targetTop = activeBottom - container.clientHeight + scrollPadding

      container.scrollTo({
        top: Math.max(0, targetTop),
        behavior: "smooth",
      })
    }

    requestAnimationFrame(scrollActiveLine)
  }, [state.phase, state.promptLine])

  return (
    <div
      className={cn(
        "flex h-full min-h-0 w-full min-w-0 flex-col items-center overflow-hidden",
        isGeminiPrompt ? "justify-start" : "justify-center",
        videoOnly && "px-2 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4",
        isGeminiPrompt && "px-2 py-1.5 sm:px-5 sm:py-3 md:px-8 md:py-4",
        !videoOnly && !isGeminiPrompt && "px-6 py-6 md:px-12"
      )}
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-[#A855F7]/5 blur-[150px]" />
        <div className="absolute bottom-1/3 left-0 w-[400px] h-[400px] rounded-full bg-[#22D3EE]/5 blur-[120px]" />
      </div>

      <div
        className={cn(
          "relative z-10 grid min-h-0 w-full min-w-0 flex-1 grid-rows-[auto_minmax(0,1fr)]",
          videoOnly ? "max-w-[min(100%,1920px)]" : "max-w-7xl"
        )}
      >
        <div
          className={cn(
            videoOnly ? "mb-2" : isGeminiPrompt ? "mb-1.5 sm:mb-3" : "mb-4"
          )}
        >
          <DemoStepMap activeIndex={state.toolIndex} />
        </div>

        {/* Main content area */}
        <div className="relative h-full min-h-0 overflow-hidden">
          <AnimatePresence mode="wait">
            {/* Gemini Prompt Phase */}
            {state.phase === 'gemini-prompt' && (
              <motion.div
                key="gemini-prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex min-h-0 flex-col"
              >
                <div
                  className="glass-card flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl"
                  style={{
                    border: `1px solid ${activeTool.color}30`,
                  }}
                >
                  <div
                    ref={promptScrollRef}
                    data-prompt-scroll
                    className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-3 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6 lg:px-8 lg:py-8"
                    style={{ scrollPaddingBlock: "24px", WebkitOverflowScrolling: "touch" }}
                  >
                    <div className="w-full min-w-0 max-w-full space-y-2 pb-4 text-left sm:space-y-3 md:space-y-4 sm:pb-6">
                      {geminiPromptLines.map((line, index) => {
                        if (state.promptLine <= index) return null

                        return (
                          <motion.div
                            key={index}
                            data-prompt-active={state.promptLine === index + 1 ? "true" : undefined}
                            initial={{ opacity: 0 }}
                            animate={{
                              opacity: state.promptLine === index + 1 ? 1 : 0.35,
                            }}
                            transition={{ duration: 0.4 }}
                            className={cn(
                              "max-w-full break-words [overflow-wrap:anywhere] text-base leading-relaxed font-medium whitespace-pre-wrap transition-colors duration-300 sm:text-lg md:text-xl lg:text-2xl",
                              state.promptLine === index + 1 ? "text-[#E8EDF5]" : "text-[#64748B]"
                            )}
                          >
                            {line}
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Video Phase (all tools) */}
            {state.showVideo && (
              <motion.div
                key={`tool-${state.toolIndex}-${state.showTips ? 'tips' : 'video'}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex min-h-0 flex-col"
              >
                <div className="flex min-h-0 flex-1 gap-3 transition-all duration-500 md:gap-4">
                  {/* Video area */}
                  <motion.div
                    className={`glass-card flex min-h-0 flex-col overflow-hidden rounded-xl ${
                      state.showTips ? "p-1.5" : "p-0 sm:p-1"
                    }`}
                    animate={{
                      flex: state.showTips ? "0 0 30%" : "1 1 100%",
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    <div className="relative min-h-0 min-w-0 flex-1">
                      <VideoPlayer videoUrl={activeTool.videoUrl} isSmall={state.showTips} />
                    </div>
                  </motion.div>

                  {/* Tips area */}
                  <AnimatePresence>
                    {state.showTips && activeTool.tips.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, x: 50, flex: '0 0 0%' }}
                        animate={{ opacity: 1, x: 0, flex: '1 1 70%' }}
                        exit={{ opacity: 0, x: 50, flex: '0 0 0%' }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="glass-card flex min-h-0 flex-col overflow-hidden rounded-xl p-6 md:p-8"
                        style={{
                          border: `1px solid ${activeTool.color}30`,
                        }}
                      >
                        <h4 className="text-2xl font-semibold mb-7 flex items-center gap-2" style={{ color: activeTool.color }}>
                          <span className="w-1.5 h-8 rounded-full" style={{ background: activeTool.color }} />
                          Tips
                        </h4>
                        <div className="flex-1 flex flex-col justify-start space-y-7">
                          {activeTool.tips.map((tip, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ 
                                opacity: state.visibleTips > index ? 1 : 0,
                                x: state.visibleTips > index ? 0 : 20,
                              }}
                              transition={{ duration: 0.3 }}
                              className="flex items-center gap-4"
                            >
                              <span 
                                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-base font-bold"
                                style={{ 
                                  background: `${activeTool.color}20`,
                                  color: activeTool.color,
                                }}
                              >
                                {index + 1}
                              </span>
                              <p className="text-xl md:text-2xl text-[#E8EDF5] leading-normal">{tip}</p>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
