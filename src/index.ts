export { DassPrism } from './core/DassPrism'
export type {
  PatternId,
  PatternOptions,
  MotionOptions,
  DassPrismOptions,
  AngleChangeHandler,
  PermissionDeniedHandler,
} from './types'
import { DassPrism } from './core/DassPrism'
import type { DassPrismOptions } from './types'

/**
 * CDN向け便利関数。
 * CSSセレクタ文字列またはHTMLElementを受け取り、ホログラムを適用してmount済みのDassPrismを返す。
 */
export async function createHologram(
  target: HTMLElement | string,
  options?: DassPrismOptions,
): Promise<DassPrism> {
  const element = typeof target === 'string'
    ? (document.querySelector<HTMLElement>(target) ?? (() => { throw new Error(`dassprism: element not found: "${target}"`) })())
    : target
  const instance = new DassPrism(element, options)
  await instance.mount()
  return instance
}
