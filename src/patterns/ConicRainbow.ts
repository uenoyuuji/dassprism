import type { Pattern } from '../core/PatternEngine'
import type { PatternOptions } from '../types'
import { CARDDASS_COLORS } from '../utils/colorInterpolate'
import { conicStops } from '../utils/cssGradient'

export class ConicRainbow implements Pattern {
  private colors: string[]
  private tileSize: number

  constructor(opts: PatternOptions) {
    this.colors = opts.colors ?? CARDDASS_COLORS
    this.tileSize = opts.tileSize ?? 40
  }

  render(element: HTMLElement, angle: number): void {
    const stops = conicStops(this.colors)
    element.style.backgroundImage = `repeating-conic-gradient(from ${angle}deg, ${stops})`
    element.style.backgroundSize = `${this.tileSize}px ${this.tileSize}px`
  }
}
