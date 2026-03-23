import type { PatternId, PatternOptions } from '../types'
import { ConicRainbow } from '../patterns/ConicRainbow'
import { LinePrism } from '../patterns/LinePrism'
import { StarBurst } from '../patterns/StarBurst'
import { HoloPatch } from '../patterns/HoloPatch'

export interface Pattern {
  render(element: HTMLElement, angle: number): void
  dispose?(): void
}

export class PatternEngine {
  private pattern: Pattern
  private currentId: PatternId

  constructor(id: PatternId, opts: PatternOptions) {
    this.currentId = id
    this.pattern = PatternEngine.create(id, opts)
  }

  setPattern(id: PatternId, opts: PatternOptions): void {
    this.pattern.dispose?.()
    this.currentId = id
    this.pattern = PatternEngine.create(id, opts)
  }

  getId(): PatternId {
    return this.currentId
  }

  render(element: HTMLElement, angle: number): void {
    this.pattern.render(element, angle)
  }

  dispose(): void {
    this.pattern.dispose?.()
  }

  private static create(id: PatternId, opts: PatternOptions): Pattern {
    switch (id) {
      case 'conic-rainbow': return new ConicRainbow(opts)
      case 'line-prism':    return new LinePrism(opts)
      case 'starburst':     return new StarBurst(opts)
      case 'holo-patch':    return new HoloPatch(opts)
    }
  }
}
