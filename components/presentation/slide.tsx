"use client"

import type { ReactNode } from "react"

interface SlideProps {
  slideIndex: number
  children: ReactNode
  className?: string
}

export function Slide({ children, className = "" }: SlideProps) {
  return (
    <div className={`h-full w-full flex flex-col ${className}`}>
      {children}
    </div>
  )
}
