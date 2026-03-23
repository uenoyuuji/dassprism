import type { MotionOptions, AngleChangeHandler, PermissionDeniedHandler } from '../types'

const DEFAULTS: Required<MotionOptions> = {
  gyroscope: true,
  mouse: true,
  alphaWeight: 0.5,
  betaWeight: 0.5,
  gammaWeight: 2.0,
  mouseSensitivity: 0.3,
}

export class MotionController {
  private opts: Required<MotionOptions>
  private angle = 0
  private onAngleChange: AngleChangeHandler
  private onPermissionDenied: PermissionDeniedHandler

  private orientationHandler: ((e: DeviceOrientationEvent) => void) | null = null
  private mouseMoveHandler: ((e: MouseEvent) => void) | null = null

  constructor(
    opts: MotionOptions,
    onAngleChange: AngleChangeHandler,
    onPermissionDenied: PermissionDeniedHandler,
  ) {
    this.opts = { ...DEFAULTS, ...opts }
    this.onAngleChange = onAngleChange
    this.onPermissionDenied = onPermissionDenied
  }

  async start(): Promise<void> {
    if (this.opts.gyroscope) {
      await this.setupGyroscope()
    }
    if (this.opts.mouse) {
      this.setupMouse()
    }
  }

  stop(): void {
    if (this.orientationHandler) {
      window.removeEventListener('deviceorientation', this.orientationHandler, true)
      this.orientationHandler = null
    }
    if (this.mouseMoveHandler) {
      window.removeEventListener('mousemove', this.mouseMoveHandler)
      this.mouseMoveHandler = null
    }
  }

  setOptions(opts: Partial<MotionOptions>): void {
    this.opts = { ...this.opts, ...opts }
  }

  getAngle(): number {
    return this.angle
  }

  setAngle(degrees: number): void {
    this.angle = degrees
    this.onAngleChange(this.angle)
  }

  private async setupGyroscope(): Promise<void> {
    const needsPermission =
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function'

    if (needsPermission) {
      try {
        const state = await (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission()
        if (state !== 'granted') {
          this.onPermissionDenied()
          return
        }
      } catch {
        this.onPermissionDenied()
        return
      }
    }

    this.orientationHandler = (e: DeviceOrientationEvent) => {
      const { alphaWeight, betaWeight, gammaWeight } = this.opts
      const alpha = (e.alpha ?? 0) * alphaWeight
      const beta = (e.beta ?? 0) * betaWeight
      const gamma = (e.gamma ?? 0) * gammaWeight
      this.angle = alpha + beta + gamma
      this.onAngleChange(this.angle)
    }
    window.addEventListener('deviceorientation', this.orientationHandler, true)
  }

  private setupMouse(): void {
    this.mouseMoveHandler = (e: MouseEvent) => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      this.angle = (dx + dy) * this.opts.mouseSensitivity
      this.onAngleChange(this.angle)
    }
    window.addEventListener('mousemove', this.mouseMoveHandler)
  }
}
