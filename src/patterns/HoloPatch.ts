import type { Pattern } from '../core/PatternEngine'
import type { PatternOptions } from '../types'
import { CARDDASS_COLORS } from '../utils/colorInterpolate'

/**
 * パッチグリッドホログラムパターン。
 * 各パッチが独立して色をシフトするホログラムシールを模倣する。
 * canvas要素を直接子要素として配置し、toDataURL()によるPNGエンコードを回避する。
 */
export class HoloPatch implements Pattern {
  private colors: string[]
  private patchSize: number
  private patchGap: number
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private cachedCols = 0
  private cachedRows = 0

  constructor(opts: PatternOptions) {
    this.colors = opts.colors ?? CARDDASS_COLORS
    this.patchSize = opts.patchSize ?? 60
    this.patchGap = opts.patchGap ?? 4
    this.canvas = document.createElement('canvas')
    this.canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;'
    this.ctx = this.canvas.getContext('2d')!
  }

  render(element: HTMLElement, angle: number): void {
    const { patchSize, patchGap, colors, canvas } = this
    const total = patchSize + patchGap
    const cols = Math.ceil(element.clientWidth / total) + 1
    const rows = Math.ceil(element.clientHeight / total) + 1

    if (!canvas.parentElement) {
      element.appendChild(canvas)
    }

    // Only reallocate backing store when grid size changes
    if (cols !== this.cachedCols || rows !== this.cachedRows) {
      canvas.width = cols * total
      canvas.height = rows * total
      this.cachedCols = cols
      this.cachedRows = rows
    }

    const ctx = this.ctx
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const n = colors.length
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const phase = (r * cols + c) * 37
        const hueShift = ((angle * 3 + phase) % 360 + 360) % 360
        const x = c * total
        const y = r * total

        const grad = ctx.createConicGradient((hueShift * Math.PI) / 180, x + patchSize / 2, y + patchSize / 2)
        for (let i = 0; i < n; i++) {
          grad.addColorStop(i / n, colors[i])
        }
        grad.addColorStop(1, colors[0])

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.roundRect(x, y, patchSize, patchSize, 4)
        ctx.fill()
      }
    }
  }

  dispose(): void {
    this.canvas.remove()
    this.cachedCols = 0
    this.cachedRows = 0
  }
}
