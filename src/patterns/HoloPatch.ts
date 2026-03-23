import type { Pattern } from '../core/PatternEngine'
import type { PatternOptions } from '../types'
import { CARDDASS_COLORS } from '../utils/colorInterpolate'

/**
 * パッチグリッドホログラムパターン。
 * 各パッチが独立して色をシフトするホログラムシールを模倣する。
 * canvasで描画しdata URLとして背景に設定する。
 */
export class HoloPatch implements Pattern {
  private colors: string[]
  private patchSize: number
  private patchGap: number
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private lastDataUrl = ''

  constructor(opts: PatternOptions) {
    this.colors = opts.colors ?? CARDDASS_COLORS
    this.patchSize = opts.patchSize ?? 60
    this.patchGap = opts.patchGap ?? 4
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')!
  }

  render(element: HTMLElement, angle: number): void {
    const { patchSize, patchGap, colors } = this
    const total = patchSize + patchGap
    const cols = Math.ceil(element.clientWidth / total) + 1
    const rows = Math.ceil(element.clientHeight / total) + 1

    this.canvas.width = cols * total
    this.canvas.height = rows * total

    const ctx = this.ctx
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const phase = (r * cols + c) * 37 // 各パッチの位相オフセット
        const hueShift = ((angle * 3 + phase) % 360 + 360) % 360

        const x = c * total
        const y = r * total

        const grad = ctx.createConicGradient((hueShift * Math.PI) / 180, x + patchSize / 2, y + patchSize / 2)
        const n = colors.length
        colors.forEach((color, i) => {
          grad.addColorStop(i / n, color)
        })
        grad.addColorStop(1, colors[0])

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.roundRect(x, y, patchSize, patchSize, 4)
        ctx.fill()
      }
    }

    const dataUrl = this.canvas.toDataURL()
    if (dataUrl !== this.lastDataUrl) {
      this.lastDataUrl = dataUrl
      element.style.backgroundImage = `url("${dataUrl}")`
      element.style.backgroundSize = `${cols * total}px ${rows * total}px`
      element.style.backgroundPosition = '0 0'
    }
  }

  dispose(): void {
    this.lastDataUrl = ''
  }
}
