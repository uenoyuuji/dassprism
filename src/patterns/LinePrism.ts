import type { Pattern } from '../core/PatternEngine'
import type { PatternOptions } from '../types'
import { rainbowPalette } from '../utils/colorInterpolate'

/**
 * 回折格子パターン。
 * 平行ストライプが角度に応じてスペクトル色をシフトする。
 */
export class LinePrism implements Pattern {
  private colors: string[]
  private lineSpacing: number

  constructor(opts: PatternOptions) {
    this.colors = opts.colors ?? rainbowPalette(7)
    this.lineSpacing = opts.lineSpacing ?? 8
  }

  render(element: HTMLElement, angle: number): void {
    const { colors, lineSpacing } = this
    // angle を 0–360 に正規化してカラーオフセットに変換
    const offset = ((angle % 360) + 360) % 360
    const shift = Math.round((offset / 360) * colors.length)
    const shifted = [...colors.slice(shift), ...colors.slice(0, shift)]

    // repeating-linear-gradient を lineSpacing px幅で繰り返す
    const stops = shifted.map((c, i) => {
      const pct = (i / shifted.length) * 100
      return `${c} ${pct.toFixed(1)}%`
    }).join(', ')

    element.style.backgroundImage = `repeating-linear-gradient(${angle}deg, ${stops}, ${shifted[0]} 100%)`
    element.style.backgroundSize = `${lineSpacing * colors.length}px ${lineSpacing * colors.length}px`
  }
}
