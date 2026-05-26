"use client"

import type { ReactNode } from "react"

interface SlideProps {
  slideIndex: number
  children: ReactNode
  className?: string
}

export function Slide({ children, className = "" }: SlideProps) {
  return (
    <div className={`flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden ${className}`}>
      {children}
    </div>
  )
}
