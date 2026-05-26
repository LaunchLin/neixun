"use client"

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react"

// 全局标记，用于视频播放器等组件阻止翻页
let preventNextAdvance = false

export function markPreventAdvance() {
  preventNextAdvance = true
}

type VideoKeyboardToggleHandler = () => void
const videoKeyboardToggles = new Map<symbol, VideoKeyboardToggleHandler>()
let activeVideoKeyboardToggleId: symbol | null = null

export function registerVideoKeyboardToggle(id: symbol, handler: VideoKeyboardToggleHandler) {
  videoKeyboardToggles.set(id, handler)
}

export function unregisterVideoKeyboardToggle(id: symbol) {
  videoKeyboardToggles.delete(id)
  if (activeVideoKeyboardToggleId === id) {
    activeVideoKeyboardToggleId = null
  }
}

export function activateVideoKeyboardToggle(id: symbol) {
  if (videoKeyboardToggles.has(id)) {
    activeVideoKeyboardToggleId = id
  }
}

function invokeVideoKeyboardToggle(): boolean {
  if (activeVideoKeyboardToggleId !== null) {
    const handler = videoKeyboardToggles.get(activeVideoKeyboardToggleId)
    if (handler) {
      handler()
      return true
    }
  }

  if (videoKeyboardToggles.size === 1) {
    videoKeyboardToggles.values().next().value?.()
    return true
  }

  return false
}

export function useVideoKeyboardToggle(togglePlay: () => void) {
  const toggleRef = useRef(togglePlay)
  toggleRef.current = togglePlay
  const idRef = useRef<symbol | null>(null)
  if (!idRef.current) {
    idRef.current = Symbol("video-keyboard-toggle")
  }

  useEffect(() => {
    const id = idRef.current!
    registerVideoKeyboardToggle(id, () => {
      markPreventAdvance()
      toggleRef.current()
    })
    return () => unregisterVideoKeyboardToggle(id)
  }, [])

  return useCallback(() => {
    activateVideoKeyboardToggle(idRef.current!)
  }, [])
}

interface SlideConfig {
  id: string
  totalSteps: number
}

interface PresentationContextType {
  currentSlide: number
  currentStep: number
  totalSlides: number
  slideConfigs: readonly SlideConfig[]
  isStepVisible: (step: number) => boolean
  advance: () => void
  goBack: () => void
  goToSlide: (slideIndex: number) => void
}

const PresentationContext = createContext<PresentationContextType | null>(null)

export function usePresentation() {
  const context = useContext(PresentationContext)
  if (!context) {
    throw new Error("usePresentation must be used within PresentationProvider")
  }
  return context
}

interface PresentationProviderProps {
  children: ReactNode
  slideConfigs: readonly SlideConfig[]
}

export function PresentationProvider({ children, slideConfigs }: PresentationProviderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const totalSlides = slideConfigs.length
  
  // 使用 ref 存储最新状态，避免闭包问题
  const stateRef = useRef({ slide: 0, step: 0 })
  const configsRef = useRef(slideConfigs)
  const isLocked = useRef(false)
  
  // 同步状态到 ref
  useEffect(() => {
    stateRef.current = { slide: currentSlide, step: currentStep }
  }, [currentSlide, currentStep])
  
  useEffect(() => {
    configsRef.current = slideConfigs
  }, [slideConfigs])

  const advance = useCallback(() => {
    if (isLocked.current) return
    isLocked.current = true
    setTimeout(() => { isLocked.current = false }, 350)
    
    const { slide, step } = stateRef.current
    const configs = configsRef.current
    const maxSteps = configs[slide]?.totalSteps ?? 0
    
    if (step < maxSteps) {
      const newStep = step + 1
      stateRef.current.step = newStep
      setCurrentStep(newStep)
    } else if (slide < configs.length - 1) {
      const newSlide = slide + 1
      stateRef.current.slide = newSlide
      stateRef.current.step = 0
      setCurrentSlide(newSlide)
      setCurrentStep(0)
    }
  }, [])

  const goBack = useCallback(() => {
    if (isLocked.current) return
    isLocked.current = true
    setTimeout(() => { isLocked.current = false }, 350)
    
    const { slide, step } = stateRef.current
    const configs = configsRef.current
    
    if (step > 0) {
      const newStep = step - 1
      stateRef.current.step = newStep
      setCurrentStep(newStep)
    } else if (slide > 0) {
      const prevSlideSteps = configs[slide - 1]?.totalSteps ?? 0
      const newSlide = slide - 1
      stateRef.current.slide = newSlide
      stateRef.current.step = prevSlideSteps
      setCurrentSlide(newSlide)
      setCurrentStep(prevSlideSteps)
    }
  }, [])

  const goToSlide = useCallback((slideIndex: number) => {
    const configs = configsRef.current
    if (slideIndex >= 0 && slideIndex < configs.length) {
      stateRef.current.slide = slideIndex
      stateRef.current.step = 0
      setCurrentSlide(slideIndex)
      setCurrentStep(0)
    }
  }, [])

  const isStepVisible = useCallback((step: number) => {
    return stateRef.current.step >= step
  }, [])

  // 全局事件监听
  useEffect(() => {
    const shouldPrevent = (target: HTMLElement): boolean => {
      let el: HTMLElement | null = target
      while (el) {
        if (el.hasAttribute('data-no-advance')) return true
        if (el.classList.contains('video-controls')) return true
        if (el.classList.contains('video-player-container')) return true
        if (el.classList.contains('no-advance')) return true
        const tag = el.tagName.toLowerCase()
        if (['button', 'a', 'input', 'textarea', 'select', 'video', 'audio', 'svg', 'path'].includes(tag)) return true
        if (el.getAttribute('role') === 'button') return true
        el = el.parentElement
      }
      return false
    }

    const handleClick = (e: MouseEvent) => {
      if (preventNextAdvance) {
        preventNextAdvance = false
        return
      }
      
      const target = e.target as HTMLElement
      if (shouldPrevent(target)) return
      
      advance()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
      
      if (e.key === " ") {
        e.preventDefault()
        markPreventAdvance()
        invokeVideoKeyboardToggle()
        return
      }

      if (e.key === "ArrowRight" || e.key === "Enter" || e.key === "ArrowDown") {
        e.preventDefault()
        advance()
      } else if (e.key === "ArrowLeft" || e.key === "Backspace" || e.key === "ArrowUp") {
        e.preventDefault()
        goBack()
      } else if (e.key === "Home") {
        e.preventDefault()
        goToSlide(0)
      } else if (e.key === "End") {
        e.preventDefault()
        goToSlide(configsRef.current.length - 1)
      }
    }

    const handleWheel = (e: WheelEvent) => {
      let el = e.target as HTMLElement | null
      while (el) {
        const canScroll = el.scrollHeight > el.clientHeight + 1
        if (canScroll) {
          const atTop = el.scrollTop <= 0
          const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1
          if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom)) {
            return
          }
        }
        el = el.parentElement
      }
      e.preventDefault()
    }

    document.addEventListener("click", handleClick)
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      document.removeEventListener("click", handleClick)
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("wheel", handleWheel)
    }
  }, [advance, goBack, goToSlide])

  return (
    <PresentationContext.Provider
      value={{
        currentSlide,
        currentStep,
        totalSlides,
        slideConfigs,
        isStepVisible,
        advance,
        goBack,
        goToSlide,
      }}
    >
      {children}
    </PresentationContext.Provider>
  )
}
