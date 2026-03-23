import type {
  DassPrismOptions,
  PatternId,
  PatternOptions,
  MotionOptions,
  AngleChangeHandler,
  PermissionDeniedHandler,
} from '../types'
import { MotionController } from './MotionController'
import { PatternEngine } from './PatternEngine'
import { AnimationLoop } from './AnimationLoop'

const SHIMMER_CLASS = 'dassprism-shimmer'

let sharedLoop: AnimationLoop | null = null
let loopRefCount = 0

function getSharedLoop(): AnimationLoop {
  if (!sharedLoop) sharedLoop = new AnimationLoop()
  loopRefCount++
  return sharedLoop
}

function releaseSharedLoop(): void {
  loopRefCount--
  if (loopRefCount === 0) {
    sharedLoop?.dispose()
    sharedLoop = null
  }
}

export class DassPrism {
  private element: HTMLElement
  private opts: Required<DassPrismOptions>
  private motion: MotionController
  private engine: PatternEngine
  private loop: AnimationLoop
  private angle = 0
  private dirty = false
  private mounted = false

  private frameCallback = () => {
    if (this.dirty) {
      this.engine.render(this.element, this.angle)
      this.dirty = false
    }
  }

  private eventHandlers = new Map<string, Set<Function>>()

  constructor(element: HTMLElement, options: DassPrismOptions = {}) {
    this.element = element
    this.opts = {
      pattern: options.pattern ?? 'conic-rainbow',
      patternOptions: options.patternOptions ?? {},
      motion: options.motion ?? {},
      shimmer: options.shimmer ?? true,
      shimmerSpeed: options.shimmerSpeed ?? 2000,
    }

    this.engine = new PatternEngine(this.opts.pattern, this.opts.patternOptions)
    this.loop = getSharedLoop()

    this.motion = new MotionController(
      this.opts.motion,
      (angle) => { this.angle = angle; this.dirty = true; this.emit('angleChange', angle) },
      () => { this.emit('permissionDenied') },
    )
  }

  async mount(): Promise<void> {
    if (this.mounted) return
    this.mounted = true

    this.element.style.position = 'relative'
    this.element.style.overflow = 'hidden'

    if (this.opts.shimmer) this.attachShimmer()

    this.engine.render(this.element, 0)
    this.loop.add(this.frameCallback)

    await this.motion.start()
  }

  unmount(): void {
    if (!this.mounted) return
    this.mounted = false

    this.motion.stop()
    this.loop.remove(this.frameCallback)
    releaseSharedLoop()
    this.engine.dispose()
    this.removeShimmer()
  }

  setPattern(id: PatternId, options: PatternOptions = {}): void {
    this.opts.pattern = id
    this.opts.patternOptions = options
    this.engine.setPattern(id, options)
    this.dirty = true
  }

  setMotion(options: Partial<MotionOptions>): void {
    this.opts.motion = { ...this.opts.motion, ...options }
    this.motion.setOptions(options)
  }

  setAngle(degrees: number): void {
    this.motion.setAngle(degrees)
  }

  on(event: 'permissionDenied' | 'angleChange', handler: Function): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set())
    }
    this.eventHandlers.get(event)!.add(handler)
  }

  off(event: string, handler: Function): void {
    this.eventHandlers.get(event)?.delete(handler)
  }

  private emit(event: string, ...args: unknown[]): void {
    this.eventHandlers.get(event)?.forEach(h => h(...args))
  }

  private attachShimmer(): void {
    const shimmer = document.createElement('div')
    shimmer.className = SHIMMER_CLASS
    shimmer.style.cssText = `
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: linear-gradient(
        105deg,
        transparent 20%,
        rgba(255,255,255,0.35) 50%,
        transparent 80%
      );
      background-size: 200% 200%;
      animation: dassprism-shimmer var(--dassprism-shimmer-speed, 2000ms) linear infinite;
    `
    this.element.style.setProperty('--dassprism-shimmer-speed', `${this.opts.shimmerSpeed}ms`)

    if (!document.getElementById('dassprism-keyframes')) {
      const style = document.createElement('style')
      style.id = 'dassprism-keyframes'
      style.textContent = `
        @keyframes dassprism-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `
      document.head.appendChild(style)
    }

    this.element.appendChild(shimmer)
  }

  private removeShimmer(): void {
    this.element.querySelector(`.${SHIMMER_CLASS}`)?.remove()
  }
}
