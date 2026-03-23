"use client"

import { StepElement } from "@/components/presentation/step-element"
import { usePresentation, markPreventAdvance } from "@/components/presentation/presentation-context"
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
import { useState, useRef, useEffect } from "react"
import { presentationVideos } from "@/lib/presentation-videos"

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
  icon: LucideIcon
  color: string
  videoUrl: string
  tips: string[]
  hasQrCode?: boolean
  hasPromptIntro?: boolean
  skipTips?: boolean
}

const toolSections: ToolSection[] = [
  {
    id: 1,
    tool: "Gemini",
    icon: Sparkles,
    color: "#A855F7",
    videoUrl: presentationVideos.demoGemini,
    tips: [
      "让AI简单了解你的技术能力，制定最适合你的沟通方式",
      "让AI知道你为什么要做这样一个APP，了解动机更不容易跑偏",
      "列举功能的基本方法：增删查改大差不差",
      "用苏格拉底式的提问，减轻AI幻觉",
      "让AI输出自己的理解，确认后再动手",
      "带着AI走，不要让AI带着走"
    ],
    hasPromptIntro: true,
  },
  {
    id: 2,
    tool: "v0",
    icon: Palette,
    color: "#22D3EE",
    videoUrl: presentationVideos.demoV0,
    tips: [
      "v0是会员+余额制，根据每次任务难度消耗不同余额，不同等级会员价格不同，每个月赠送不同余额",
      "比起文字提示词，AI更擅长模仿图片",
      "先跑通核心流程和页面，再打磨细节",
      "修改意见尽可能一次性说完，既节省余额又提高代码稳定性",
      "量化自己的描述：例如放大1.5倍而不是放大一点",
      "有设计能力的同学可以联动figma制作出更符合心意的界面",
      "v0的作品发布后可通过手机访问测试，可用于日常demo演示"
    ]
  },
  {
    id: 3,
    tool: "Supabase",
    icon: Database,
    color: "#A855F7",
    videoUrl: presentationVideos.demoSupabase,
    tips: [],
    skipTips: true
  },
  {
    id: 4,
    tool: "Cursor",
    icon: Code2,
    color: "#22D3EE",
    videoUrl: presentationVideos.demoCursor,
    tips: [
      "修改界面可以用v0先做，生成截图让cursor学习",
      "AI降智，果断新开窗口",
      "不懂就问，别自己瞎琢磨"
    ]
  },
  {
    id: 5,
    tool: "GitHub + Vercel",
    icon: Rocket,
    color: "#A855F7",
    videoUrl: presentationVideos.demoGithubVercel,
    tips: [],
    skipTips: true,
    hasQrCode: true,
  },
]

// Steps calculation:
// Gemini: Steps 1-6 (6 prompt lines) + Step 7 (video) + Steps 8-13 (6 tips one by one) = 13 steps
// v0: Step 14 (video) + Steps 15-21 (7 tips one by one) = 8 steps
// Supabase: Step 22 (video only, no tips) = 1 step
// Cursor: Step 23 (video) + Steps 24-26 (3 tips one by one) = 4 steps
// GitHub+Vercel: Step 27 (video) + Step 28 (QR code) = 2 steps
// Total: 13 + 8 + 1 + 4 + 2 = 28 steps
export const DEMO_STEPS = 28

function VideoPlayer({ videoUrl, isSmall }: { videoUrl: string; isSmall?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showOverlay, setShowOverlay] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const [showControls, setShowControls] = useState(false)
  const [hasEnded, setHasEnded] = useState(false)

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    markPreventAdvance()
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
        setShowOverlay(false)
        setHasEnded(false)
      }
      setIsPlaying(!isPlaying)
    }
  }

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

  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    markPreventAdvance()
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
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        onClick={handleContainerClick}
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

      <AnimatePresence>
        {showOverlay && !hasEnded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-20 bg-[#0B0F19]/55 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlay}
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
            className="absolute top-3 right-3 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full"
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
  // Gemini: Steps 1-6 = prompt lines, Step 7 = video, Steps 8-13 = tips (6 tips)
  // v0: Step 14 = video, Steps 15-21 = tips (7 tips)
  // Supabase: Step 22 = video only
  // Cursor: Step 23 = video, Steps 24-26 = tips (3 tips)
  // GitHub+Vercel: Step 27 = video, Step 28 = QR code
  
  const getState = () => {
    if (currentStep <= 6) {
      return { phase: 'gemini-prompt' as const, toolIndex: 0, promptLine: currentStep, showVideo: false, showTips: false, visibleTips: 0, showQr: false }
    }
    if (currentStep === 7) {
      return { phase: 'gemini-video' as const, toolIndex: 0, promptLine: 6, showVideo: true, showTips: false, visibleTips: 0, showQr: false }
    }
    if (currentStep >= 8 && currentStep <= 13) {
      return { phase: 'gemini-tips' as const, toolIndex: 0, promptLine: 6, showVideo: true, showTips: true, visibleTips: currentStep - 7, showQr: false }
    }
    if (currentStep === 14) {
      return { phase: 'v0-video' as const, toolIndex: 1, promptLine: 0, showVideo: true, showTips: false, visibleTips: 0, showQr: false }
    }
    if (currentStep >= 15 && currentStep <= 21) {
      return { phase: 'v0-tips' as const, toolIndex: 1, promptLine: 0, showVideo: true, showTips: true, visibleTips: currentStep - 14, showQr: false }
    }
    if (currentStep === 22) {
      return { phase: 'supabase-video' as const, toolIndex: 2, promptLine: 0, showVideo: true, showTips: false, visibleTips: 0, showQr: false }
    }
    if (currentStep === 23) {
      return { phase: 'cursor-video' as const, toolIndex: 3, promptLine: 0, showVideo: true, showTips: false, visibleTips: 0, showQr: false }
    }
    if (currentStep >= 24 && currentStep <= 26) {
      return { phase: 'cursor-tips' as const, toolIndex: 3, promptLine: 0, showVideo: true, showTips: true, visibleTips: currentStep - 23, showQr: false }
    }
    if (currentStep === 27) {
      return { phase: 'vercel-video' as const, toolIndex: 4, promptLine: 0, showVideo: true, showTips: false, visibleTips: 0, showQr: false }
    }
    return { phase: 'vercel-qr' as const, toolIndex: 4, promptLine: 0, showVideo: true, showTips: false, visibleTips: 0, showQr: true }
  }
  
  const state = getState()
  const activeTool = toolSections[state.toolIndex]
  const videoOnly = state.showVideo && !state.showTips && !state.showQr

  return (
    <div
      className={`w-full h-full min-h-0 flex flex-col items-center justify-center ${
        videoOnly ? "px-2 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4" : "px-6 md:px-12 py-6"
      }`}
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-[#A855F7]/5 blur-[150px]" />
        <div className="absolute bottom-1/3 left-0 w-[400px] h-[400px] rounded-full bg-[#22D3EE]/5 blur-[120px]" />
      </div>

      <div
        className={`relative z-10 w-full h-full min-h-0 flex flex-col ${videoOnly ? "max-w-[min(100%,1920px)]" : "max-w-7xl"}`}
      >
        {/* Minimal tool badge */}
        <div className={`flex flex-shrink-0 items-center gap-3 ${videoOnly ? "mb-2" : "mb-4"}`}>
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${activeTool.color}20, ${activeTool.color}05)`,
              border: `1px solid ${activeTool.color}40`,
            }}
          >
            <activeTool.icon className="w-5 h-5" style={{ color: activeTool.color }} />
          </div>
          <h3 className="text-2xl font-bold" style={{ color: activeTool.color }}>
            {activeTool.tool}
          </h3>
        </div>

        {/* Main content area */}
        <div className="flex-1 min-h-0">
          <AnimatePresence mode="wait">
            {/* Gemini Prompt Phase */}
            {state.phase === 'gemini-prompt' && (
              <motion.div
                key="gemini-prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="h-full flex flex-col"
              >
                <div 
                  className="flex-1 glass-card rounded-xl p-8 md:p-12 overflow-y-auto flex items-center"
                  style={{
                    border: `1px solid ${activeTool.color}30`,
                  }}
                >
                  <div className="space-y-6 text-left w-full">
                    {geminiPromptLines.map((line, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ 
                          opacity: state.promptLine > index ? (state.promptLine === index + 1 ? 1 : 0.35) : 0,
                          y: state.promptLine > index ? 0 : 20,
                        }}
                        transition={{ duration: 0.4 }}
                        className={`text-xl md:text-2xl lg:text-3xl leading-relaxed whitespace-pre-wrap font-medium transition-colors duration-300`}
                        style={{
                          color: state.promptLine === index + 1 ? '#E8EDF5' : '#64748B'
                        }}
                      >
                        {line}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Video Phase (all tools) */}
            {state.showVideo && (
              <motion.div
                key={`tool-${state.toolIndex}-${state.showTips ? 'tips' : state.showQr ? 'qr' : 'video'}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="flex h-full min-h-0 flex-col"
              >
                <div className="flex min-h-0 flex-1 gap-3 transition-all duration-500 md:gap-4">
                  {/* Video area */}
                  <motion.div
                    className={`glass-card flex min-h-0 flex-col overflow-hidden rounded-xl ${
                      state.showTips || state.showQr ? "p-1.5" : "p-0 sm:p-1"
                    }`}
                    animate={{
                      flex: state.showTips || state.showQr ? "0 0 30%" : "1 1 100%",
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    <div className="relative min-h-0 min-w-0 flex-1">
                      <VideoPlayer videoUrl={activeTool.videoUrl} isSmall={state.showTips || state.showQr} />
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

                  {/* QR Code area for Vercel */}
                  <AnimatePresence>
                    {state.showQr && (
                      <motion.div
                        initial={{ opacity: 0, x: 50, flex: '0 0 0%' }}
                        animate={{ opacity: 1, x: 0, flex: '1 1 70%' }}
                        exit={{ opacity: 0, x: 50, flex: '0 0 0%' }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="glass-card rounded-xl p-8 md:p-12 flex flex-col items-center justify-center"
                        style={{
                          border: `1px solid ${activeTool.color}30`,
                        }}
                      >
                        <div 
                          className="w-64 h-64 rounded-2xl flex items-center justify-center relative overflow-hidden mb-8"
                          style={{
                            background: "linear-gradient(135deg, rgba(34, 211, 238, 0.1), rgba(168, 85, 247, 0.1))",
                            border: "2px dashed rgba(34, 211, 238, 0.3)",
                          }}
                        >
                          <img
                            src={presentationVideos.vercelQrApp}
                            alt="扫码体验运动打卡激励APP"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <p className="text-3xl font-bold text-[#E8EDF5] mb-3">扫码体验</p>
                        <p className="text-xl text-[#94A3B8]">运动打卡激励APP</p>
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
