type FrameCallback = (timestamp: number) => void

export class AnimationLoop {
  private callbacks = new Set<FrameCallback>()
  private rafId: number | null = null

  add(cb: FrameCallback): void {
    this.callbacks.add(cb)
    if (this.rafId === null) this.start()
  }

  remove(cb: FrameCallback): void {
    this.callbacks.delete(cb)
    if (this.callbacks.size === 0) this.stop()
  }

  private start(): void {
    const loop = (ts: number) => {
      this.callbacks.forEach(cb => cb(ts))
      this.rafId = requestAnimationFrame(loop)
    }
    this.rafId = requestAnimationFrame(loop)
  }

  private stop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  }

  dispose(): void {
    this.callbacks.clear()
    this.stop()
  }
}
