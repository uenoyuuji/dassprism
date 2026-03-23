import type { Pattern } from '../core/PatternEngine'
import type { PatternOptions } from '../types'

const DEFAULT_COLORS = ['#ffd700', '#fff8dc', '#ffa500', '#ff69b4', '#7afcff', '#ffd700']

/**
 * 放射バーストパターン。
 * 金銀箔ベースのホログラムフォイル（レアカード）を模倣する。
 */
export class StarBurst implements Pattern {
  private colors: string[]
  private rays: number

  constructor(opts: PatternOptions) {
    this.colors = opts.colors ?? DEFAULT_COLORS
    this.rays = opts.rays ?? 12
  }

  render(element: HTMLElement, angle: number): void {
    const { colors, rays } = this
    const stops = colors.map((c, i) => `${c} ${(i / (colors.length - 1) * 100).toFixed(1)}%`).join(', ')

    // 放射グラデーション（ベース）
    const radial = `radial-gradient(ellipse at center, ${stops})`

    // repeating-conic で放射線を追加
    const segDeg = 360 / rays
    const conicStops = Array.from({ length: rays }, (_, i) => {
      const start = (i * segDeg + angle).toFixed(1)
      const end = ((i + 0.4) * segDeg + angle).toFixed(1)
      return `rgba(255,255,255,0.25) ${start}deg, transparent ${end}deg`
    }).join(', ')
    const conic = `repeating-conic-gradient(from ${angle}deg, ${conicStops})`

    element.style.backgroundImage = `${conic}, ${radial}`
    element.style.backgroundSize = 'cover'
  }
}
