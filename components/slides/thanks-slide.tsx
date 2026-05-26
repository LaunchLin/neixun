"use client"

import { StepElement } from "@/components/presentation/step-element"
import { usePresentation } from "@/components/presentation/presentation-context"
import { motion } from "framer-motion"
import Image from "next/image"

// Steps: 1=thank you card, 2=layout shift + QR codes
export const THANKS_STEPS = 2

function QRCard({
  title,
  qrSrc,
}: {
  title: string
  qrSrc?: string
}) {
  return (
    <div className="flex flex-col items-center gap-4 md:gap-5" data-no-advance>
      <div
        className="glass-card relative flex aspect-square w-36 items-center justify-center overflow-hidden rounded-2xl border border-[#1E293B]/60 p-3 sm:w-40 md:w-44 md:p-3.5 lg:w-48 lg:p-4"
        style={{
          boxShadow: "0 0 32px rgba(34, 211, 238, 0.06), 0 0 40px rgba(168, 85, 247, 0.05)",
        }}
      >
        {qrSrc ? (
          <div className="relative h-full w-full overflow-hidden rounded-xl bg-white">
            <Image
              src={qrSrc}
              alt={`${title}二维码`}
              fill
              className="object-contain p-1.5"
              sizes="(max-width: 768px) 144px, 192px"
            />
          </div>
        ) : (
          <>
            <svg
              viewBox="0 0 100 100"
              className="h-[78%] w-[78%] text-[#94A3B8]/35"
              shapeRendering="crispEdges"
              aria-hidden
            >
              <rect x="8" y="8" width="24" height="24" fill="currentColor" />
              <rect x="68" y="8" width="24" height="24" fill="currentColor" />
              <rect x="8" y="68" width="24" height="24" fill="currentColor" />
              <rect x="14" y="14" width="12" height="12" fill="#0B0F19" />
              <rect x="74" y="14" width="12" height="12" fill="#0B0F19" />
              <rect x="14" y="74" width="12" height="12" fill="#0B0F19" />
              {[
                [40, 12], [48, 12], [56, 12], [36, 20], [44, 28], [52, 36], [60, 44],
                [40, 44], [48, 52], [56, 60], [44, 68], [52, 76], [60, 84], [68, 52],
                [76, 60], [84, 68], [36, 52], [28, 44], [20, 36],
              ].map(([x, y], i) => (
                <rect key={i} x={x} y={y} width="6" height="6" fill="currentColor" />
              ))}
            </svg>
            <span className="absolute bottom-2 text-[10px] font-mono uppercase tracking-widest text-[#64748B]/80">
              占位
            </span>
          </>
        )}
      </div>
      <p className="max-w-[12rem] text-center text-lg font-semibold leading-snug tracking-wide text-[#E8EDF5] md:max-w-none md:text-xl lg:text-2xl">
        {title}
      </p>
    </div>
  )
}

export function ThanksSlide() {
  const { isStepVisible } = usePresentation()
  const showQr = isStepVisible(2)

  return (
    <div className="relative flex h-full w-full items-center justify-center px-6 py-10 md:px-12 lg:px-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-1/4 h-[420px] w-[420px] rounded-full bg-[#22D3EE]/8 blur-[120px]" />
        <div className="absolute -right-16 bottom-1/4 h-[380px] w-[380px] rounded-full bg-[#A855F7]/8 blur-[120px]" />
      </div>

      <motion.div
        className="relative z-10 flex w-full max-w-5xl flex-col items-center"
        animate={{
          y: showQr ? -48 : 0,
        }}
        transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <StepElement step={1} animation="fadeUp" className="w-full">
          <motion.div
            animate={{ scale: showQr ? 0.88 : 1 }}
            transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="glass-card relative overflow-hidden rounded-3xl px-8 py-14 text-center md:px-16 md:py-20 lg:px-20 lg:py-24"
            style={{
              border: "1px solid rgba(168, 85, 247, 0.18)",
              boxShadow:
                "0 0 60px rgba(34, 211, 238, 0.08), 0 0 80px rgba(168, 85, 247, 0.06)",
            }}
          >
            <div className="absolute left-0 top-0 h-px w-28 bg-gradient-to-r from-[#22D3EE] to-transparent" />
            <div className="absolute right-0 bottom-0 h-px w-28 bg-gradient-to-l from-[#A855F7] to-transparent" />

            <motion.h1
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-6xl font-bold leading-none tracking-tight gradient-text text-glow-cyan sm:text-7xl md:text-8xl lg:text-9xl"
            >
              Thank you
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mx-auto mt-8 h-px w-16 origin-center bg-gradient-to-r from-transparent via-[#A855F7]/60 to-transparent md:mt-10"
            />

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mx-auto mt-8 max-w-2xl text-xl font-normal leading-relaxed text-[#94A3B8] md:mt-10 md:text-2xl lg:text-3xl"
            >
              for sharing a piece of your life with me.
            </motion.p>
          </motion.div>
        </StepElement>

        {showQr && (
          <StepElement step={2} animation="fadeUp" duration={0.6} className="mt-10 w-full md:mt-12">
            <div className="mx-auto grid max-w-2xl grid-cols-2 gap-8 sm:gap-10 md:gap-14">
              <QRCard title="查看课件" qrSrc="/qr-course-materials.png" />
              <QRCard title="提点意见" qrSrc="/qr-feedback.png" />
            </div>
          </StepElement>
        )}
      </motion.div>
    </div>
  )
}
