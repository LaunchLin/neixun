"use client"

import { StepElement } from "@/components/presentation/step-element"
import { markPreventAdvance } from "@/components/presentation/presentation-context"
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import { presentationVideos } from "@/lib/presentation-videos"

// Steps: 1=title, 2=video1, 3=video2
export const SHOWCASE_STEPS = 3

function VerticalVideoPlayer({ videoUrl }: { videoUrl: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showOverlay, setShowOverlay] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const [showControls, setShowControls] = useState(false)
  const [hasEnded, setHasEnded] = useState(false)

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
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
    markPreventAdvance()
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation()
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
    videoRef.current?.load()
  }, [videoUrl])

  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    markPreventAdvance()
  }

  return (
    <div className="flex h-full min-h-0 w-full items-center justify-center">
      {/* 手机框：先吃满父级高度（不超过 82dvh），宽度由 10:19.5 与 max-w 约束 */}
      <div
        className="relative flex h-full max-h-[min(82dvh,920px)] w-auto min-w-0 max-w-[min(480px,46vw)] shrink-0 flex-col overflow-hidden rounded-[3rem] bg-gradient-to-b from-[#1E293B] to-[#0F172A] p-2 sm:p-3 [aspect-ratio:10/19.5]"
        style={{
          boxShadow: "0 0 60px rgba(34, 211, 238, 0.15), 0 0 100px rgba(168, 85, 247, 0.1), inset 0 1px 1px rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {/* 内屏：圆角裁切 + overflow-hidden，让视频边缘与手机框内轮廓一致，不再“浮在框上” */}
        <div
          className="relative isolate flex min-h-0 flex-1 cursor-pointer flex-col overflow-hidden rounded-[2.35rem] border border-white/5 bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] group video-player-container sm:rounded-[2.55rem]"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
          onClick={handleContainerClick}
          data-no-advance
        >
          {/* 录屏自带状态栏/灵动岛，不再叠一层装饰刘海，避免“双层岛”错位 */}

          <video
            ref={videoRef}
            className="absolute inset-0 z-0 block h-full w-full rounded-[2.35rem] bg-black sm:rounded-[2.55rem]"
            style={{
              /* contain：完整显示录屏（含状态栏）；cover 会裁切上下/左右 */
              objectFit: "contain",
              objectPosition: "center center",
            }}
            src={videoUrl}
            muted={isMuted}
            playsInline
            preload="metadata"
            data-no-advance
          />

          <AnimatePresence>
            {showOverlay && !hasEnded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 z-10 flex items-center justify-center bg-[#0B0F19]/60 backdrop-blur-sm"
              >
                <motion.button
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={togglePlay}
                  className="relative flex items-center justify-center w-20 h-20 rounded-full no-advance"
                  style={{
                    background: "linear-gradient(135deg, rgba(34, 211, 238, 0.2), rgba(168, 85, 247, 0.2))",
                    border: "2px solid rgba(34, 211, 238, 0.4)",
                    boxShadow: "0 0 30px rgba(34, 211, 238, 0.3), 0 0 60px rgba(168, 85, 247, 0.2)",
                  }}
                  data-no-advance
                >
                  <span className="absolute inset-0 rounded-full animate-ping opacity-30 bg-[#22D3EE]/30" />
                  <Play className="w-8 h-8 text-[#E8EDF5] ml-1 relative z-10" fill="currentColor" />
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
                className="absolute bottom-0 left-0 right-0 z-20 p-4 video-controls"
                data-no-advance
                style={{ background: "linear-gradient(to top, rgba(11, 15, 25, 0.9), transparent)" }}
              >
                <div className="relative h-1 bg-[#1E293B]/60 rounded-full mb-3 overflow-hidden">
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
                  <div className="flex items-center gap-2">
                    <button onClick={togglePlay} data-no-advance className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-[#1E293B]/60 no-advance disabled:opacity-50" type="button" disabled={hasEnded}>
                      {hasEnded ? <span className="text-[10px] text-[#94A3B8]">已结束</span> : isPlaying ? <Pause className="w-4 h-4 text-[#E8EDF5]" /> : <Play className="w-4 h-4 text-[#E8EDF5] ml-0.5" fill="currentColor" />}
                    </button>
                    <button onClick={toggleMute} data-no-advance className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-[#1E293B]/60 no-advance" type="button">
                      {isMuted ? <VolumeX className="w-4 h-4 text-[#94A3B8]" /> : <Volume2 className="w-4 h-4 text-[#E8EDF5]" />}
                    </button>
                  </div>
                  <button onClick={toggleFullscreen} data-no-advance className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-[#1E293B]/60 no-advance" type="button">
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
                className="absolute top-12 right-3 z-20 flex items-center gap-2 px-2 py-1 rounded-full"
                style={{ background: "rgba(11, 15, 25, 0.7)", backdropFilter: "blur(8px)", border: "1px solid rgba(34, 211, 238, 0.2)" }}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#22C55E]" />
                </span>
                <span className="text-[8px] text-[#E8EDF5]/80 font-medium">播放中</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export function ShowcaseSlide() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col items-center justify-center px-4 py-4 md:px-8 md:py-6">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[#22D3EE]/5 blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#A855F7]/5 blur-[150px]" />
      </div>

      <div className="relative z-10 flex h-full min-h-0 w-full max-w-7xl flex-col text-center">
        {/* Title */}
        <StepElement step={1} animation="fadeUp" className="mb-3 flex-shrink-0 md:mb-5">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            <span className="gradient-text">「字游」的可能性</span>
          </h2>
        </StepElement>

        {/* Two vertical videos side by side - larger */}
        <div className="flex min-h-0 flex-1 items-center justify-center gap-6 min-[900px]:gap-12 md:gap-16">
          <StepElement step={2} animation="fadeLeft" className="flex h-full min-h-0 max-h-[min(82dvh,920px)] flex-1 justify-center">
            <VerticalVideoPlayer videoUrl={presentationVideos.showcaseLeft} />
          </StepElement>

          <StepElement step={3} animation="fadeRight" className="flex h-full min-h-0 max-h-[min(82dvh,920px)] flex-1 justify-center">
            <VerticalVideoPlayer videoUrl={presentationVideos.showcaseRight} />
          </StepElement>
        </div>
      </div>
    </div>
  )
}
