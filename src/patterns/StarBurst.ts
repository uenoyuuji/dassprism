import type { Pattern } from '../core/PatternEngine'
import type { PatternOptions } from '../types'
import { linearStops } from '../utils/cssGradient'

const DEFAULT_COLORS = ['#ffd700', '#fff8dc', '#ffa500', '#ff69b4', '#7afcff', '#ffd700']

export class StarBurst implements Pattern {
  private colors: string[]
  private rays: number
  private radial: string

  constructor(opts: PatternOptions) {
    this.colors = opts.colors ?? DEFAULT_COLORS
    this.rays = opts.rays ?? 12
    this.radial = `radial-gradient(ellipse at center, ${linearStops(this.colors)})`
  }

  render(element: HTMLElement, angle: number): void {
    const { rays, radial } = this
    const segDeg = 360 / rays
    const conicStops = Array.from({ length: rays }, (_, i) => {
      const start = (i * segDeg + angle).toFixed(1)
      const end = ((i + 0.4) * segDeg + angle).toFixed(1)
      return `rgba(255,255,255,0.25) ${start}deg, transparent ${end}deg`
    }).join(', ')

    element.style.backgroundImage = `repeating-conic-gradient(from ${angle}deg, ${conicStops}), ${radial}`
    element.style.backgroundSize = 'cover'
  }
}
