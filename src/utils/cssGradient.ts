/**
 * 色配列からrepeating-conic-gradientのカラーストップ文字列を生成する。
 * 例: '#f00 0%, #0f0 50%, #f00 100%'
 */
export function conicStops(colors: string[]): string {
  const n = colors.length
  return colors
    .map((c, i) => `${c} ${Math.round((i / n) * 100)}%`)
    .concat([`${colors[0]} 100%`])
    .join(', ')
}

/**
 * 色配列からlinear-gradientのカラーストップ文字列を生成する。
 */
export function linearStops(colors: string[]): string {
  const n = colors.length - 1
  return colors.map((c, i) => `${c} ${Math.round((i / n) * 100)}%`).join(', ')
}
