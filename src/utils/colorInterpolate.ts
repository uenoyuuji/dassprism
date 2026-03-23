/** 0–360のhue値からCSSのhsl文字列を返す */
export function hsl(h: number, s = 100, l = 60): string {
  return `hsl(${h % 360}, ${s}%, ${l}%)`
}

/** n色のレインボーパレットを等間隔で生成 */
export function rainbowPalette(n: number): string[] {
  return Array.from({ length: n }, (_, i) => hsl((360 / n) * i))
}

/** カードダス標準カラー */
export const CARDDASS_COLORS = [
  '#ff7eb3', // hot pink
  '#ff65a3', // pink
  '#7afcff', // cyan
  '#feff9c', // pale yellow
]
