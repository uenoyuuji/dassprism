import type { PatternId, PatternOptions } from 'dassprism'

export interface CardDef {
  id: string
  label: string
  pattern: PatternId
  defaultOptions: PatternOptions
}

export const CARDS: CardDef[] = [
  {
    id: 'card-rainbow',
    label: 'Rainbow Holo',
    pattern: 'conic-rainbow',
    defaultOptions: { tileSize: 40 },
  },
  {
    id: 'card-prism',
    label: 'Line Prism',
    pattern: 'line-prism',
    defaultOptions: { lineSpacing: 8 },
  },
  {
    id: 'card-starburst',
    label: 'StarBurst',
    pattern: 'starburst',
    defaultOptions: { rays: 12 },
  },
  {
    id: 'card-patch',
    label: 'Holo Patch',
    pattern: 'holo-patch',
    defaultOptions: { patchSize: 60, patchGap: 4 },
  },
]
