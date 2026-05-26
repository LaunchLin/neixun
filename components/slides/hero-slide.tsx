"use client"

import { StepElement } from "@/components/presentation/step-element"
import { usePresentation } from "@/components/presentation/presentation-context"
import { PixelMonster } from "@/components/slides/pixel-monster"
import { motion } from "framer-motion"
import { useEffect, useLayoutEffect, useRef, useState } from "react"

// Steps: 1=typewriter quote, 2=static quote, 3=strikethrough + main headline
export const HERO_STEPS = 3

const FULL_QUOTE = '"Talk is cheap.\nShow me the code."'
const QUOTE_CHARS = Array.from(FULL_QUOTE)
const TYPE_MS = Math.round(110 / 0.8 / 0.5) // 0.5× 当前速度（更慢，约 275ms/字）
const PAUSE_MS = 4000
const POST_EAT_MS = 3000 // 小怪兽吃完后，空白停顿再重新打字
const CHOMP_MS = 220
const LETTER_TRACK_EM = 0.05 // 字间距，接近参考图
const WORD_SPACE_CH = "1ch" // 等宽字体标准词间距
const FINAL_REVEAL = { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }

type QuotePhase = "typing" | "pause" | "eating" | "empty"

type QuoteLineSegment = {
  chars: { index: number; char: string }[]
}

function buildLineSegments(): QuoteLineSegment[] {
  const lines: QuoteLineSegment[] = [{ chars: [] }]

  QUOTE_CHARS.forEach((char, index) => {
    if (char === "\n") {
      lines.push({ chars: [] })
      return
    }
    lines[lines.length - 1].chars.push({ index, char })
  })

  return lines
}

const QUOTE_LINE_SEGMENTS = buildLineSegments()

/** 从右往左吃：取当前可见区间最右侧的可吃字符索引 */
function getBiteIndex(visibleLength: number) {
  let i = visibleLength - 1
  while (i >= 0 && QUOTE_CHARS[i] === "\n") i -= 1
  return i
}

function displayChar(char: string) {
  return char === " " ? "\u00A0" : char
}

/** 逐字渲染时用手动 margin 模拟 letter-spacing */
function letterMarginRight(index: number, collapse: boolean, char: string) {
  if (collapse || char === " ") return undefined
  const next = QUOTE_CHARS[index + 1]
  if (next == null || next === "\n") return undefined
  return `${LETTER_TRACK_EM}em`
}

/** 光标应出现在哪一行末尾（按已打出字符计） */
function getCursorLineIndex(visibleLength: number) {
  if (visibleLength >= FULL_QUOTE.length) return -1
  let lineIdx = 0
  for (let i = 0; i < visibleLength; i++) {
    if (QUOTE_CHARS[i] === "\n") lineIdx += 1
  }
  return lineIdx
}

export function HeroSlide() {
  const { isStepVisible, currentStep } = usePresentation()
  const isAnimating = currentStep === 1
  const showFinal = isStepVisible(3)

  const [phase, setPhase] = useState<QuotePhase>("typing")
  const [visibleLength, setVisibleLength] = useState(0)
  const [chomping, setChomping] = useState(false)
  const [monsterPos, setMonsterPos] = useState<{ left: number; top: number } | null>(null)
  const [lockedLayoutWidth, setLockedLayoutWidth] = useState<number | null>(null)

  const textWrapRef = useRef<HTMLSpanElement>(null)
  const charRefs = useRef<(HTMLSpanElement | null)[]>([])
  const charPositionsRef = useRef<( { left: number; top: number } | null)[]>([])

  const layoutLocked = phase === "eating"
  const biteIndex = phase === "eating" ? getBiteIndex(visibleLength) : -1
  const showCursor = isAnimating && phase === "typing" && visibleLength < FULL_QUOTE.length
  const cursorLineIndex = showCursor ? getCursorLineIndex(visibleLength) : -1

  useLayoutEffect(() => {
    if (!layoutLocked) {
      setLockedLayoutWidth(null)
      return
    }
    if (lockedLayoutWidth !== null) return

    const wrap = textWrapRef.current
    if (!wrap) return

    setLockedLayoutWidth(wrap.getBoundingClientRect().width)
  }, [layoutLocked, lockedLayoutWidth])

  useEffect(() => {
    if (!isAnimating) {
      if (currentStep >= 2) {
        setPhase("pause")
        setVisibleLength(FULL_QUOTE.length)
        setChomping(false)
      }
      return
    }

    setPhase("typing")
    setVisibleLength(0)
    setChomping(false)
    charPositionsRef.current = []
    setLockedLayoutWidth(null)
  }, [isAnimating, currentStep])

  useEffect(() => {
    if (!isAnimating) return

    let timeoutId: ReturnType<typeof setTimeout>

    if (phase === "typing") {
      if (visibleLength < FULL_QUOTE.length) {
        timeoutId = setTimeout(() => setVisibleLength((n) => n + 1), TYPE_MS)
      } else {
        setPhase("pause")
      }
      return () => clearTimeout(timeoutId)
    }

    if (phase === "pause") {
      timeoutId = setTimeout(() => {
        setChomping(false)
        charPositionsRef.current = []
        setPhase("eating")
      }, PAUSE_MS)
      return () => clearTimeout(timeoutId)
    }

    if (phase === "eating") {
      const biteIndex = getBiteIndex(visibleLength)

      if (biteIndex < 0) {
        setChomping(false)
        setVisibleLength(0)
        setPhase("empty")
        return
      }

      setChomping(true)
      timeoutId = setTimeout(() => {
        setChomping(false)
        setVisibleLength(biteIndex)
      }, CHOMP_MS)
      return () => clearTimeout(timeoutId)
    }

    if (phase === "empty") {
      timeoutId = setTimeout(() => setPhase("typing"), POST_EAT_MS)
      return () => clearTimeout(timeoutId)
    }

    return () => clearTimeout(timeoutId)
  }, [isAnimating, phase, visibleLength])

  useLayoutEffect(() => {
    if (!isAnimating || phase !== "eating") {
      charPositionsRef.current = []
      setMonsterPos(null)
      return
    }

    const wrap = textWrapRef.current
    if (!wrap) return

    if (charPositionsRef.current.length === 0) {
      const wrapRect = wrap.getBoundingClientRect()
      charPositionsRef.current = QUOTE_CHARS.map((char, i) => {
        if (char === "\n") return null
        const el = charRefs.current[i]
        if (!el) return null
        const rect = el.getBoundingClientRect()
        return {
          left: rect.left - wrapRect.left + rect.width / 2,
          top: rect.bottom - wrapRect.top - 20,
        }
      })
    }

    const biteIndex = getBiteIndex(visibleLength)
    if (biteIndex < 0) {
      setMonsterPos(null)
      return
    }

    const pos = charPositionsRef.current[biteIndex]
    setMonsterPos(pos ?? null)
  }, [isAnimating, phase, visibleLength, chomping])


  const renderChar = (index: number, char: string) => {
    const revealed = index < visibleLength
    const beingEaten = phase === "eating" && chomping && index === biteIndex
    const showGlyph = revealed || beingEaten
    const collapse = !layoutLocked && !revealed && !beingEaten

    const isSpace = char === " "

    return (
      <span
        key={`ch-${index}`}
        ref={(el) => {
          charRefs.current[index] = el
        }}
        className={beingEaten ? "hero-char-being-eaten inline-block" : "inline-block"}
        style={{
          opacity: showGlyph ? 1 : 0,
          visibility: showGlyph ? "visible" : "hidden",
          width: collapse ? 0 : undefined,
          minWidth: isSpace && !collapse ? WORD_SPACE_CH : undefined,
          marginRight: letterMarginRight(index, collapse, char),
          overflow: collapse ? "hidden" : undefined,
        }}
        aria-hidden={!showGlyph}
      >
        {displayChar(char)}
      </span>
    )
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-8 md:px-16">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#22D3EE]/5 blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#A855F7]/5 blur-[150px]" />
      </div>

      <div className="relative z-10 text-center max-w-6xl">
        <StepElement step={1} animation="fadeUp" className="mb-16">
          <div className="text-3xl md:text-5xl lg:text-7xl font-mono font-light leading-tight text-[#94A3B8]">
            <motion.span
              ref={textWrapRef}
              initial={false}
              animate={{ opacity: showFinal ? 0.35 : 1 }}
              transition={FINAL_REVEAL}
              className="relative inline-flex flex-col items-center gap-[0.375em]"
              style={lockedLayoutWidth ? { minWidth: lockedLayoutWidth } : undefined}
            >
              {QUOTE_LINE_SEGMENTS.map((line, lineIdx) => (
                <span key={`line-${lineIdx}`} className="block text-center">
                  <span className={showFinal ? "relative inline-block hero-quote-line-struck" : "inline-block"}>
                    {line.chars.map(({ index, char }) => renderChar(index, char))}
                    {cursorLineIndex === lineIdx && (
                      <span className="ml-0.5 inline-block w-[0.05em] animate-pulse text-[#22D3EE]">
                        |
                      </span>
                    )}
                  </span>
                </span>
              ))}

              {monsterPos && (
                <span
                  className="pointer-events-none absolute z-20 -translate-x-1/2 scale-x-[-1] drop-shadow-[0_0_10px_rgba(168,85,247,0.55)]"
                  style={{
                    left: monsterPos.left,
                    top: monsterPos.top,
                    transition: "left 0.12s linear, top 0.12s linear",
                  }}
                >
                  <PixelMonster chomping={chomping} />
                </span>
              )}
            </motion.span>
          </div>
        </StepElement>

        <StepElement step={3} animation="scale" duration={0.5} className="mb-10">
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold tracking-tight leading-none">
            <span className="gradient-text text-glow-cyan">
              Now, talk IS the code.
            </span>
          </h1>
        </StepElement>
      </div>
    </div>
  )
}
