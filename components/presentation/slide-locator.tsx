"use client"

import { motion, AnimatePresence } from "framer-motion"
import { usePresentation } from "./presentation-context"

export interface SlideLocatorItem {
  id: string
  label: string
}

export function SlideLocator({
  open,
  items,
}: {
  open: boolean
  items: readonly SlideLocatorItem[]
}) {
  const { currentSlide, goToSlide } = usePresentation()

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 12 }}
          transition={{ duration: 0.2 }}
          className="fixed right-2 top-1/2 z-[60] -translate-y-1/2 sm:right-3"
          data-no-advance
        >
          <div className="rounded-lg border border-[#1E293B]/50 bg-[#0B0F19]/80 px-1 py-1 shadow-md backdrop-blur-md">
            <div className="flex flex-col items-center gap-1">
              {items.map((item, index) => {
                const isActive = index === currentSlide
                return (
                  <button
                    key={item.id}
                    type="button"
                    data-no-advance
                    onClick={() => goToSlide(index)}
                    className={[
                      "flex shrink-0 items-center justify-center rounded-full p-1 transition-colors",
                      "hover:bg-[#22D3EE]/10",
                    ].join(" ")}
                    aria-current={isActive ? "page" : undefined}
                    aria-label={`第 ${index + 1} 页：${item.label}`}
                  >
                    <span
                      className={[
                        "block rounded-full transition-all",
                        isActive
                          ? "h-2 w-2 bg-[#22D3EE] shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                          : "h-1.5 w-1.5 bg-[#475569] hover:bg-[#64748B]",
                      ].join(" ")}
                    />
                  </button>
                )
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

