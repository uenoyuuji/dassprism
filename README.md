# dassprism

Holographic card effects for the web, inspired by the iridescent foil patterns of 90s Carddass trading cards.

Tilt your device — or move your mouse — and watch the colors shift just like the real thing.

**[Live Demo →](https://uenoyuuji.github.io/dassprism)**

---

## Patterns

| Pattern | Description |
|---|---|
| `conic-rainbow` | Repeating conic gradient. The classic rainbow holo seen on Dragon Ball / Saint Seiya cards. |
| `line-prism` | Parallel spectral stripes that sweep across as the angle changes. Diffraction-grating style. |
| `starburst` | Radial burst over a gold/silver base. Matches the foil treatment on rare boss cards. |
| `holo-patch` | Grid of independently-phased patches. Replicates discrete hologram sticker foil from mid-90s specials. |

---

## Usage

### CDN (no build step)

```html
<div id="card" style="width:180px;height:252px;border-radius:12px;"></div>

<script src="https://cdn.jsdelivr.net/gh/uenoyuuji/dassprism@main/dist/dassprism.umd.js"></script>
<script>
  dassprism.createHologram('#card')
</script>
```

### ESM / bundler

```js
import { createHologram } from 'https://cdn.jsdelivr.net/gh/uenoyuuji/dassprism@main/dist/dassprism.es.js'

await createHologram('#card', {
  pattern: 'starburst',
  patternOptions: { rays: 16 },
})
```

---

## API

### `createHologram(target, options?)`

Convenience function. Accepts a CSS selector string or an `HTMLElement`, applies the hologram effect, and returns a mounted `DassPrism` instance.

```js
const card = await createHologram('#card', options)
```

### `new DassPrism(element, options?)`

Full class API for lifecycle control.

```js
import { DassPrism } from 'https://cdn.jsdelivr.net/gh/uenoyuuji/dassprism@main/dist/dassprism.es.js'

const card = new DassPrism(document.getElementById('card'), {
  pattern: 'line-prism',
  shimmer: true,
})

await card.mount()

// Later:
card.setPattern('holo-patch', { patchSize: 50 })
card.unmount()
```

#### Methods

| Method | Description |
|---|---|
| `mount(): Promise<void>` | Attach listeners and start rendering. Requests gyroscope permission on iOS 13+. |
| `unmount(): void` | Remove listeners and stop rendering. |
| `setPattern(id, options?)` | Switch to a different pattern at runtime. |
| `setMotion(options)` | Update motion weights or sensitivity. |
| `setAngle(degrees)` | Manually set the hologram angle (useful for screenshots or animations). |
| `on(event, handler)` | Subscribe to `'angleChange'` or `'permissionDenied'`. |
| `off(event, handler)` | Unsubscribe. |

---

## Options

### `DassPrismOptions`

| Option | Type | Default | Description |
|---|---|---|---|
| `pattern` | `PatternId` | `'conic-rainbow'` | Which hologram pattern to use. |
| `patternOptions` | `PatternOptions` | `{}` | Per-pattern settings (see below). |
| `motion` | `MotionOptions` | `{}` | Gyroscope and mouse settings. |
| `shimmer` | `boolean` | `true` | Animated light-sweep overlay. |
| `shimmerSpeed` | `number` | `2000` | Shimmer cycle duration in ms. |

### `PatternOptions`

| Option | Patterns | Default | Description |
|---|---|---|---|
| `colors` | all | Carddass palette | Array of CSS color strings. |
| `tileSize` | `conic-rainbow`, `holo-patch` | `40` | Tile size in px. |
| `lineSpacing` | `line-prism` | `8` | Line width in px. |
| `rays` | `starburst` | `12` | Number of radial rays. |
| `patchSize` | `holo-patch` | `60` | Individual patch size in px. |
| `patchGap` | `holo-patch` | `4` | Gap between patches in px. |

### `MotionOptions`

| Option | Default | Description |
|---|---|---|
| `gyroscope` | `true` | Use device orientation sensor. |
| `mouse` | `true` | Use mouse position as fallback on desktop. |
| `alphaWeight` | `0.5` | Contribution of the α axis (device z-rotation). |
| `betaWeight` | `0.5` | Contribution of the β axis (front-back tilt). |
| `gammaWeight` | `2.0` | Contribution of the γ axis (left-right tilt). |
| `mouseSensitivity` | `0.3` | Degrees of angle change per pixel of mouse movement. |

---

## Examples

### Custom colors

```js
createHologram('#card', {
  pattern: 'conic-rainbow',
  patternOptions: {
    colors: ['#00f', '#0ff', '#0f0', '#ff0', '#f00'],
    tileSize: 60,
  },
})
```

### Manual angle control (no motion)

```js
const card = await createHologram('#card', {
  motion: { gyroscope: false, mouse: false },
})

// Drive the angle yourself, e.g. from a scroll position
card.setAngle(window.scrollY * 0.1)
```

### Reacting to permission denial on iOS

```js
const card = new DassPrism(el)
card.on('permissionDenied', () => {
  showPermissionBanner()
})
await card.mount()
```

---

## Browser support

| Feature | Requirement |
|---|---|
| CSS conic gradients | Chrome 69+, Safari 12.1+, Firefox 83+ |
| Canvas conic gradient (`holo-patch`) | Chrome 99+, Safari 16+, Firefox 112+ |
| Device orientation | iOS 13+ requires a user gesture before calling `mount()` |
| `canvas.roundRect` (`holo-patch`) | Chrome 99+, Safari 15.4+, Firefox 112+ |

All patterns except `holo-patch` work in any browser that supports CSS conic gradients.

---

## Local development

```sh
git clone https://github.com/uenoyuuji/dassprism.git
cd dassprism
npm install

npm run dev          # dev server at localhost:5173
npm run build        # build library (dist/) and demo (docs/)
npm run typecheck    # TypeScript check without emitting
npm run preview      # preview the built demo
```

---

## License

MIT
