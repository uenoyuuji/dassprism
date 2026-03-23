export type PatternId = 'conic-rainbow' | 'line-prism' | 'starburst' | 'holo-patch'

export interface PatternOptions {
  /** グラデーションカラーパレット（デフォルト: カードダスカラー） */
  colors?: string[]
  /** conic-rainbow: コニックセグメント数 (default: 6) */
  segments?: number
  /** conic-rainbow / holo-patch: タイルサイズpx (default: 40) */
  tileSize?: number
  /** line-prism: ライン間隔px (default: 8) */
  lineSpacing?: number
  /** starburst: 放射線の本数 (default: 12) */
  rays?: number
  /** holo-patch: パッチサイズpx (default: 60) */
  patchSize?: number
  /** holo-patch: パッチ間隔px (default: 4) */
  patchGap?: number
}

export interface MotionOptions {
  /** ジャイロスコープ使用 (default: true) */
  gyroscope?: boolean
  /** マウスfallback使用 (default: true) */
  mouse?: boolean
  /** alpha軸の重み (default: 0.5) */
  alphaWeight?: number
  /** beta軸の重み (default: 0.5) */
  betaWeight?: number
  /** gamma軸の重み (default: 2.0) */
  gammaWeight?: number
  /** マウス感度 degrees/px (default: 0.3) */
  mouseSensitivity?: number
}

export interface DassPrismOptions {
  /** ホログラムパターン (default: 'conic-rainbow') */
  pattern?: PatternId
  /** パターン固有オプション */
  patternOptions?: PatternOptions
  /** モーション設定 */
  motion?: MotionOptions
  /** シマーオーバーレイ (default: true) */
  shimmer?: boolean
  /** シマーアニメーション周期ms (default: 2000) */
  shimmerSpeed?: number
}

export type AngleChangeHandler = (angle: number) => void
export type PermissionDeniedHandler = () => void
