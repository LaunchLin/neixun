"use client"

type PixelMonsterProps = {
  chomping: boolean
  className?: string
}

/** 10×8 像素小怪兽，chomping 时切换张嘴帧 */
export function PixelMonster({ chomping, className = "" }: PixelMonsterProps) {
  const body = "#A855F7"
  const bodyDark = "#7C3AED"
  const eye = "#22D3EE"
  const pupil = "#0B0F19"
  const mouth = "#EF4444"
  const tooth = "#F8FAFC"

  const px = (x: number, y: number, fill: string, w = 1, h = 1) => (
    <rect key={`${x}-${y}-${fill}`} x={x} y={y} width={w} height={h} fill={fill} />
  )

  const pixels = [
    px(2, 0, bodyDark), px(3, 0, bodyDark), px(4, 0, bodyDark), px(5, 0, bodyDark), px(6, 0, bodyDark),
    px(1, 1, body), px(2, 1, body), px(3, 1, body), px(4, 1, body), px(5, 1, body), px(6, 1, body), px(7, 1, body),
    px(0, 2, bodyDark), px(1, 2, body), px(2, 2, eye), px(3, 2, pupil), px(4, 2, body), px(5, 2, eye), px(6, 2, pupil), px(7, 2, body), px(8, 2, bodyDark),
    px(0, 3, bodyDark), px(1, 3, body), px(2, 3, body), px(3, 3, body), px(4, 3, body), px(5, 3, body), px(6, 3, body), px(7, 3, body), px(8, 3, bodyDark),
    px(1, 4, body), px(2, 4, body), px(3, 4, body), px(4, 4, body), px(5, 4, body), px(6, 4, body), px(7, 4, body),
    ...(chomping
      ? [
          px(2, 5, mouth, 6, 1),
          px(1, 6, bodyDark), px(2, 6, mouth), px(3, 6, tooth), px(4, 6, mouth), px(5, 6, tooth), px(6, 6, mouth), px(7, 6, bodyDark),
          px(0, 7, bodyDark), px(1, 7, bodyDark), px(7, 7, bodyDark), px(8, 7, bodyDark),
        ]
      : [
          px(3, 5, mouth, 4, 1),
          px(1, 6, bodyDark), px(2, 6, body), px(3, 6, body), px(4, 6, body), px(5, 6, body), px(6, 6, body), px(7, 6, bodyDark),
          px(0, 7, bodyDark), px(1, 7, bodyDark), px(7, 7, bodyDark), px(8, 7, bodyDark),
        ]),
  ]

  return (
    <span
      className={`pointer-events-none inline-block select-none ${className}`}
      style={{ width: 48, height: 38, imageRendering: "pixelated" }}
      aria-hidden
    >
      <svg
        viewBox="0 0 9 8"
        shapeRendering="crispEdges"
        className={`h-full w-full ${chomping ? "pixel-monster-chomp" : "pixel-monster-idle"}`}
      >
        {pixels}
      </svg>
    </span>
  )
}
