/** 在 cw×ch 的矩形内，容纳 vw:vh 比例的最大轴对齐矩形（与 object-fit: contain 一致） */
export function fitVideoBox(cw: number, ch: number, vw: number, vh: number): { w: number; h: number } {
  if (cw <= 0 || ch <= 0 || vw <= 0 || vh <= 0) return { w: cw, h: ch }
  const r = vw / vh
  const cr = cw / ch
  if (cr > r) {
    const h = ch
    const w = h * r
    return { w, h }
  }
  const w = cw
  const h = w / r
  return { w, h }
}
