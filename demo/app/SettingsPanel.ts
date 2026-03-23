import type { CardEntry } from './CardShowcase'
import type { PatternId, PatternOptions } from 'dassprism'
import { CARDDASS_COLORS } from '../../src/utils/colorInterpolate'

interface Controls {
  patternSelect: HTMLSelectElement
  tileSizeRow: HTMLElement
  tileSizeInput: HTMLInputElement
  tileSizeValue: HTMLElement
  lineSpacingRow: HTMLElement
  lineSpacingInput: HTMLInputElement
  lineSpacingValue: HTMLElement
  raysRow: HTMLElement
  raysInput: HTMLInputElement
  raysValue: HTMLElement
  patchSizeRow: HTMLElement
  patchSizeInput: HTMLInputElement
  patchSizeValue: HTMLElement
  shimmerToggle: HTMLInputElement
  shimmerSpeedInput: HTMLInputElement
  shimmerSpeedValue: HTMLElement
  alphaInput: HTMLInputElement
  alphaValue: HTMLElement
  betaInput: HTMLInputElement
  betaValue: HTMLElement
  gammaInput: HTMLInputElement
  gammaValue: HTMLElement
}

export class SettingsPanel {
  private container: HTMLElement
  private controls!: Controls
  private active: CardEntry | null = null
  private onSnippetChange: (snippet: string) => void

  constructor(container: HTMLElement, onSnippetChange: (snippet: string) => void) {
    this.container = container
    this.onSnippetChange = onSnippetChange
    this.build()
  }

  private build(): void {
    this.container.innerHTML = `
      <div class="panel-section">
        <h3>Pattern</h3>
        <div class="field">
          <select id="pattern-select">
            <option value="conic-rainbow">Rainbow Holo</option>
            <option value="line-prism">Line Prism</option>
            <option value="starburst">StarBurst</option>
            <option value="holo-patch">Holo Patch</option>
          </select>
        </div>
      </div>

      <div class="panel-section">
        <h3>Pattern Options</h3>
        <div class="field" id="tile-size-row">
          <label>Tile Size <span id="tile-size-val">40</span>px</label>
          <input type="range" id="tile-size" min="10" max="120" value="40">
        </div>
        <div class="field" id="line-spacing-row" style="display:none">
          <label>Line Spacing <span id="line-spacing-val">8</span>px</label>
          <input type="range" id="line-spacing" min="2" max="32" value="8">
        </div>
        <div class="field" id="rays-row" style="display:none">
          <label>Rays <span id="rays-val">12</span></label>
          <input type="range" id="rays" min="4" max="36" value="12">
        </div>
        <div class="field" id="patch-size-row" style="display:none">
          <label>Patch Size <span id="patch-size-val">60</span>px</label>
          <input type="range" id="patch-size" min="20" max="120" value="60">
        </div>
      </div>

      <div class="panel-section">
        <h3>Shimmer</h3>
        <div class="toggle-row">
          <span>Enable shimmer</span>
          <label class="toggle">
            <input type="checkbox" id="shimmer-toggle" checked>
            <span class="slider"></span>
          </label>
        </div>
        <div class="field">
          <label>Speed <span id="shimmer-speed-val">2000</span>ms</label>
          <input type="range" id="shimmer-speed" min="500" max="6000" step="100" value="2000">
        </div>
      </div>

      <div class="panel-section">
        <h3>Motion Weights</h3>
        <div class="field">
          <label>Alpha (z-axis) <span id="alpha-val">0.5</span></label>
          <input type="range" id="alpha-weight" min="0" max="4" step="0.1" value="0.5">
        </div>
        <div class="field">
          <label>Beta (x-axis) <span id="beta-val">0.5</span></label>
          <input type="range" id="beta-weight" min="0" max="4" step="0.1" value="0.5">
        </div>
        <div class="field">
          <label>Gamma (y-axis) <span id="gamma-val">2.0</span></label>
          <input type="range" id="gamma-weight" min="0" max="8" step="0.1" value="2.0">
        </div>
      </div>
    `

    this.controls = {
      patternSelect:    this.container.querySelector<HTMLSelectElement>('#pattern-select')!,
      tileSizeRow:      this.container.querySelector<HTMLElement>('#tile-size-row')!,
      tileSizeInput:    this.container.querySelector<HTMLInputElement>('#tile-size')!,
      tileSizeValue:    this.container.querySelector<HTMLElement>('#tile-size-val')!,
      lineSpacingRow:   this.container.querySelector<HTMLElement>('#line-spacing-row')!,
      lineSpacingInput: this.container.querySelector<HTMLInputElement>('#line-spacing')!,
      lineSpacingValue: this.container.querySelector<HTMLElement>('#line-spacing-val')!,
      raysRow:          this.container.querySelector<HTMLElement>('#rays-row')!,
      raysInput:        this.container.querySelector<HTMLInputElement>('#rays')!,
      raysValue:        this.container.querySelector<HTMLElement>('#rays-val')!,
      patchSizeRow:     this.container.querySelector<HTMLElement>('#patch-size-row')!,
      patchSizeInput:   this.container.querySelector<HTMLInputElement>('#patch-size')!,
      patchSizeValue:   this.container.querySelector<HTMLElement>('#patch-size-val')!,
      shimmerToggle:    this.container.querySelector<HTMLInputElement>('#shimmer-toggle')!,
      shimmerSpeedInput: this.container.querySelector<HTMLInputElement>('#shimmer-speed')!,
      shimmerSpeedValue: this.container.querySelector<HTMLElement>('#shimmer-speed-val')!,
      alphaInput:       this.container.querySelector<HTMLInputElement>('#alpha-weight')!,
      alphaValue:       this.container.querySelector<HTMLElement>('#alpha-val')!,
      betaInput:        this.container.querySelector<HTMLInputElement>('#beta-weight')!,
      betaValue:        this.container.querySelector<HTMLElement>('#beta-val')!,
      gammaInput:       this.container.querySelector<HTMLInputElement>('#gamma-weight')!,
      gammaValue:       this.container.querySelector<HTMLElement>('#gamma-val')!,
    }

    this.bindEvents()
  }

  private bindEvents(): void {
    const c = this.controls

    c.patternSelect.addEventListener('change', () => {
      if (!this.active) return
      const pid = c.patternSelect.value as PatternId
      const opts = this.currentPatternOptions(pid)
      this.active.instance.setPattern(pid, opts)
      this.showPatternRows(pid)
      this.emitSnippet()
    })

    const rangeHandler = (input: HTMLInputElement, display: HTMLElement, decimals = 0) => {
      input.addEventListener('input', () => {
        const v = parseFloat(input.value)
        display.textContent = decimals > 0 ? v.toFixed(decimals) : String(v)
        this.applyPatternOptions()
        this.emitSnippet()
      })
    }

    rangeHandler(c.tileSizeInput, c.tileSizeValue)
    rangeHandler(c.lineSpacingInput, c.lineSpacingValue)
    rangeHandler(c.raysInput, c.raysValue)
    rangeHandler(c.patchSizeInput, c.patchSizeValue)
    rangeHandler(c.shimmerSpeedInput, c.shimmerSpeedValue)
    rangeHandler(c.alphaInput, c.alphaValue, 1)
    rangeHandler(c.betaInput, c.betaValue, 1)
    rangeHandler(c.gammaInput, c.gammaValue, 1)

    c.shimmerToggle.addEventListener('change', () => {
      // shimmer変更はmount/unmountが必要なため、角度で再描画するだけに留める
      this.emitSnippet()
    })
  }

  load(entry: CardEntry): void {
    this.active = entry
    const { pattern, defaultOptions } = entry.def
    const c = this.controls

    c.patternSelect.value = pattern
    this.showPatternRows(pattern)

    if (defaultOptions.tileSize != null) c.tileSizeInput.value = String(defaultOptions.tileSize)
    if (defaultOptions.lineSpacing != null) c.lineSpacingInput.value = String(defaultOptions.lineSpacing)
    if (defaultOptions.rays != null) c.raysInput.value = String(defaultOptions.rays)
    if (defaultOptions.patchSize != null) c.patchSizeInput.value = String(defaultOptions.patchSize)

    c.tileSizeValue.textContent = c.tileSizeInput.value
    c.lineSpacingValue.textContent = c.lineSpacingInput.value
    c.raysValue.textContent = c.raysInput.value
    c.patchSizeValue.textContent = c.patchSizeInput.value

    this.emitSnippet()
  }

  private showPatternRows(pattern: PatternId): void {
    const c = this.controls
    c.tileSizeRow.style.display    = pattern === 'conic-rainbow' || pattern === 'holo-patch' ? '' : 'none'
    c.lineSpacingRow.style.display = pattern === 'line-prism' ? '' : 'none'
    c.raysRow.style.display        = pattern === 'starburst' ? '' : 'none'
    c.patchSizeRow.style.display   = pattern === 'holo-patch' ? '' : 'none'
  }

  private currentPatternOptions(pattern: PatternId): PatternOptions {
    const c = this.controls
    switch (pattern) {
      case 'conic-rainbow': return { tileSize: parseInt(c.tileSizeInput.value) }
      case 'line-prism':    return { lineSpacing: parseInt(c.lineSpacingInput.value) }
      case 'starburst':     return { rays: parseInt(c.raysInput.value) }
      case 'holo-patch':    return { patchSize: parseInt(c.patchSizeInput.value), tileSize: parseInt(c.tileSizeInput.value) }
    }
  }

  private applyPatternOptions(): void {
    if (!this.active) return
    const pid = this.controls.patternSelect.value as PatternId
    this.active.instance.setPattern(pid, this.currentPatternOptions(pid))
  }

  private emitSnippet(): void {
    if (!this.active) return
    const c = this.controls
    const pid = c.patternSelect.value as PatternId
    const opts = this.currentPatternOptions(pid)
    const motionOpts = {
      alphaWeight: parseFloat(c.alphaInput.value),
      betaWeight: parseFloat(c.betaInput.value),
      gammaWeight: parseFloat(c.gammaInput.value),
    }
    const shimmer = c.shimmerToggle.checked
    const shimmerSpeed = parseInt(c.shimmerSpeedInput.value)

    const optsStr = JSON.stringify({
      pattern: pid,
      patternOptions: opts,
      motion: motionOpts,
      shimmer,
      shimmerSpeed,
    }, null, 2)

    const snippet = `createHologram('#my-card', ${optsStr})`
    this.onSnippetChange(snippet)
  }

  updateMotionForAll(entries: { instance: { setMotion: (o: object) => void } }[]): void {
    const c = this.controls
    const motionOpts = {
      alphaWeight: parseFloat(c.alphaInput.value),
      betaWeight: parseFloat(c.betaInput.value),
      gammaWeight: parseFloat(c.gammaInput.value),
    }
    entries.forEach(e => e.instance.setMotion(motionOpts))
  }
}

// suppress unused import warning
void CARDDASS_COLORS
