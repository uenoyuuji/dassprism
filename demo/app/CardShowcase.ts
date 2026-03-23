import { DassPrism } from 'dassprism'
import type { CardDef } from './cards'

export interface CardEntry {
  def: CardDef
  element: HTMLElement
  instance: DassPrism
}

export class CardShowcase {
  private entries: CardEntry[] = []
  private activeEntry: CardEntry | null = null
  private onSelect: (entry: CardEntry) => void

  constructor(container: HTMLElement, cards: CardDef[], onSelect: (entry: CardEntry) => void) {
    this.onSelect = onSelect

    const grid = document.createElement('div')
    grid.className = 'card-grid'
    container.appendChild(grid)

    for (const def of cards) {
      const el = document.createElement('div')
      el.className = 'holo-card'
      el.id = def.id

      const label = document.createElement('div')
      label.className = 'card-label'
      label.textContent = def.label
      el.appendChild(label)

      grid.appendChild(el)

      const instance = new DassPrism(el, {
        pattern: def.pattern,
        patternOptions: def.defaultOptions,
        shimmer: true,
      })

      const entry: CardEntry = { def, element: el, instance }
      this.entries.push(entry)

      el.addEventListener('click', () => this.activate(entry))
    }
  }

  async mountAll(): Promise<void> {
    await Promise.all(this.entries.map(e => e.instance.mount()))
    this.activate(this.entries[0])
  }

  activate(entry: CardEntry): void {
    this.entries.forEach(e => e.element.classList.remove('active'))
    entry.element.classList.add('active')
    this.activeEntry = entry
    this.onSelect(entry)
  }

  getActive(): CardEntry | null {
    return this.activeEntry
  }

  getEntries(): CardEntry[] {
    return this.entries
  }
}
