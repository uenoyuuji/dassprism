const k = {
  gyroscope: !0,
  mouse: !0,
  alphaWeight: 0.5,
  betaWeight: 0.5,
  gammaWeight: 2,
  mouseSensitivity: 0.3
};
class x {
  constructor(t, e, s) {
    this.angle = 0, this.orientationHandler = null, this.mouseMoveHandler = null, this.resizeHandler = null, this.cx = 0, this.cy = 0, this.opts = { ...k, ...t }, this.onAngleChange = e, this.onPermissionDenied = s;
  }
  async start() {
    this.opts.gyroscope && await this.setupGyroscope(), this.opts.mouse && this.setupMouse();
  }
  stop() {
    this.orientationHandler && (window.removeEventListener("deviceorientation", this.orientationHandler, !0), this.orientationHandler = null), this.mouseMoveHandler && (window.removeEventListener("mousemove", this.mouseMoveHandler), this.mouseMoveHandler = null), this.resizeHandler && (window.removeEventListener("resize", this.resizeHandler), this.resizeHandler = null);
  }
  setOptions(t) {
    this.opts = { ...this.opts, ...t };
  }
  getAngle() {
    return this.angle;
  }
  setAngle(t) {
    this.angle = t, this.onAngleChange(this.angle);
  }
  async setupGyroscope() {
    if (typeof DeviceOrientationEvent < "u" && typeof DeviceOrientationEvent.requestPermission == "function")
      try {
        if (await DeviceOrientationEvent.requestPermission() !== "granted") {
          this.onPermissionDenied();
          return;
        }
      } catch {
        this.onPermissionDenied();
        return;
      }
    this.orientationHandler = (e) => {
      const { alphaWeight: s, betaWeight: n, gammaWeight: h } = this.opts, o = (e.alpha ?? 0) * s, r = (e.beta ?? 0) * n, a = (e.gamma ?? 0) * h;
      this.angle = o + r + a, this.onAngleChange(this.angle);
    }, window.addEventListener("deviceorientation", this.orientationHandler, !0);
  }
  setupMouse() {
    this.cx = window.innerWidth / 2, this.cy = window.innerHeight / 2, this.resizeHandler = () => {
      this.cx = window.innerWidth / 2, this.cy = window.innerHeight / 2;
    }, window.addEventListener("resize", this.resizeHandler), this.mouseMoveHandler = (t) => {
      this.angle = (t.clientX - this.cx + t.clientY - this.cy) * this.opts.mouseSensitivity, this.onAngleChange(this.angle);
    }, window.addEventListener("mousemove", this.mouseMoveHandler);
  }
}
function z(i, t = 100, e = 60) {
  return `hsl(${i % 360}, ${t}%, ${e}%)`;
}
function A(i) {
  return Array.from({ length: i }, (t, e) => z(360 / i * e));
}
const H = [
  "#ff7eb3",
  // hot pink
  "#ff65a3",
  // pink
  "#7afcff",
  // cyan
  "#feff9c"
  // pale yellow
];
function E(i) {
  const t = i.length;
  return i.map((e, s) => `${e} ${Math.round(s / t * 100)}%`).concat([`${i[0]} 100%`]).join(", ");
}
function M(i) {
  const t = i.length - 1;
  return i.map((e, s) => `${e} ${Math.round(s / t * 100)}%`).join(", ");
}
class I {
  constructor(t) {
    this.colors = t.colors ?? H, this.tileSize = t.tileSize ?? 40;
  }
  render(t, e) {
    const s = E(this.colors);
    t.style.backgroundImage = `repeating-conic-gradient(from ${e}deg, ${s})`, t.style.backgroundSize = `${this.tileSize}px ${this.tileSize}px`;
  }
}
class P {
  constructor(t) {
    this.colors = t.colors ?? A(7), this.lineSpacing = t.lineSpacing ?? 8;
  }
  render(t, e) {
    const { colors: s, lineSpacing: n } = this, h = (e % 360 + 360) % 360, o = Math.round(h / 360 * s.length), r = [...s.slice(o), ...s.slice(0, o)], a = r.map((l, c) => {
      const m = c / r.length * 100;
      return `${l} ${m.toFixed(1)}%`;
    }).join(", ");
    t.style.backgroundImage = `repeating-linear-gradient(${e}deg, ${a}, ${r[0]} 100%)`, t.style.backgroundSize = `${n * s.length}px ${n * s.length}px`;
  }
}
const L = ["#ffd700", "#fff8dc", "#ffa500", "#ff69b4", "#7afcff", "#ffd700"];
class D {
  constructor(t) {
    this.colors = t.colors ?? L, this.rays = t.rays ?? 12, this.radial = `radial-gradient(ellipse at center, ${M(this.colors)})`;
  }
  render(t, e) {
    const { rays: s, radial: n } = this, h = 360 / s, o = Array.from({ length: s }, (r, a) => {
      const l = (a * h + e).toFixed(1), c = ((a + 0.4) * h + e).toFixed(1);
      return `rgba(255,255,255,0.25) ${l}deg, transparent ${c}deg`;
    }).join(", ");
    t.style.backgroundImage = `repeating-conic-gradient(from ${e}deg, ${o}), ${n}`, t.style.backgroundSize = "cover";
  }
}
class O {
  constructor(t) {
    this.cachedCols = 0, this.cachedRows = 0, this.colors = t.colors ?? H, this.patchSize = t.patchSize ?? 60, this.patchGap = t.patchGap ?? 4, this.canvas = document.createElement("canvas"), this.canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;", this.ctx = this.canvas.getContext("2d");
  }
  render(t, e) {
    const { patchSize: s, patchGap: n, colors: h, canvas: o } = this, r = s + n, a = Math.ceil(t.clientWidth / r) + 1, l = Math.ceil(t.clientHeight / r) + 1;
    o.parentElement || t.appendChild(o), (a !== this.cachedCols || l !== this.cachedRows) && (o.width = a * r, o.height = l * r, this.cachedCols = a, this.cachedRows = l);
    const c = this.ctx;
    c.clearRect(0, 0, o.width, o.height);
    const m = h.length;
    for (let p = 0; p < l; p++)
      for (let u = 0; u < a; u++) {
        const $ = (p * a + u) * 37, C = ((e * 3 + $) % 360 + 360) % 360, y = u * r, S = p * r, w = c.createConicGradient(C * Math.PI / 180, y + s / 2, S + s / 2);
        for (let f = 0; f < m; f++)
          w.addColorStop(f / m, h[f]);
        w.addColorStop(1, h[0]), c.fillStyle = w, c.beginPath(), c.roundRect(y, S, s, s, 4), c.fill();
      }
  }
  dispose() {
    this.canvas.remove(), this.cachedCols = 0, this.cachedRows = 0;
  }
}
class g {
  constructor(t, e) {
    this.currentId = t, this.pattern = g.create(t, e);
  }
  setPattern(t, e) {
    var s, n;
    (n = (s = this.pattern).dispose) == null || n.call(s), this.currentId = t, this.pattern = g.create(t, e);
  }
  getId() {
    return this.currentId;
  }
  render(t, e) {
    this.pattern.render(t, e);
  }
  dispose() {
    var t, e;
    (e = (t = this.pattern).dispose) == null || e.call(t);
  }
  static create(t, e) {
    switch (t) {
      case "conic-rainbow":
        return new I(e);
      case "line-prism":
        return new P(e);
      case "starburst":
        return new D(e);
      case "holo-patch":
        return new O(e);
    }
  }
}
class R {
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.rafId = null;
  }
  add(t) {
    this.callbacks.add(t), this.rafId === null && this.start();
  }
  remove(t) {
    this.callbacks.delete(t), this.callbacks.size === 0 && this.stop();
  }
  start() {
    const t = (e) => {
      this.callbacks.forEach((s) => s(e)), this.rafId = requestAnimationFrame(t);
    };
    this.rafId = requestAnimationFrame(t);
  }
  stop() {
    this.rafId !== null && (cancelAnimationFrame(this.rafId), this.rafId = null);
  }
  dispose() {
    this.callbacks.clear(), this.stop();
  }
}
const b = "dassprism-shimmer";
let d = null, v = 0;
function W() {
  return d || (d = new R()), v++, d;
}
function F() {
  v--, v === 0 && (d == null || d.dispose(), d = null);
}
class q {
  constructor(t, e = {}) {
    this.loop = null, this.dirty = !1, this.mounted = !1, this.frameCallback = () => {
      this.dirty && (this.engine.render(this.element, this.motion.getAngle()), this.dirty = !1);
    }, this.eventHandlers = /* @__PURE__ */ new Map(), this.element = t, this.opts = {
      pattern: e.pattern ?? "conic-rainbow",
      patternOptions: e.patternOptions ?? {},
      motion: e.motion ?? {},
      shimmer: e.shimmer ?? !0,
      shimmerSpeed: e.shimmerSpeed ?? 2e3
    }, this.engine = new g(this.opts.pattern, this.opts.patternOptions), this.motion = new x(
      this.opts.motion,
      (s) => {
        this.dirty = !0, this.emit("angleChange", s);
      },
      () => {
        this.emit("permissionDenied");
      }
    );
  }
  async mount() {
    this.mounted || (this.mounted = !0, this.loop = W(), this.element.style.position = "relative", this.element.style.overflow = "hidden", this.opts.shimmer && this.attachShimmer(), this.engine.render(this.element, 0), this.loop.add(this.frameCallback), await this.motion.start());
  }
  unmount() {
    this.mounted && (this.mounted = !1, this.motion.stop(), this.loop.remove(this.frameCallback), F(), this.loop = null, this.engine.dispose(), this.removeShimmer());
  }
  setPattern(t, e = {}) {
    this.opts.pattern = t, this.opts.patternOptions = e, this.engine.setPattern(t, e), this.dirty = !0;
  }
  setMotion(t) {
    this.opts.motion = { ...this.opts.motion, ...t }, this.motion.setOptions(t);
  }
  setAngle(t) {
    this.motion.setAngle(t);
  }
  on(t, e) {
    this.eventHandlers.has(t) || this.eventHandlers.set(t, /* @__PURE__ */ new Set()), this.eventHandlers.get(t).add(e);
  }
  off(t, e) {
    var s;
    (s = this.eventHandlers.get(t)) == null || s.delete(e);
  }
  emit(t, ...e) {
    var s;
    (s = this.eventHandlers.get(t)) == null || s.forEach((n) => n(...e));
  }
  attachShimmer() {
    const t = document.createElement("div");
    if (t.className = b, t.style.cssText = `
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: linear-gradient(
        105deg,
        transparent 20%,
        rgba(255,255,255,0.35) 50%,
        transparent 80%
      );
      background-size: 200% 200%;
      animation: dassprism-shimmer var(--dassprism-shimmer-speed, 2000ms) linear infinite;
    `, this.element.style.setProperty("--dassprism-shimmer-speed", `${this.opts.shimmerSpeed}ms`), !document.getElementById("dassprism-keyframes")) {
      const e = document.createElement("style");
      e.id = "dassprism-keyframes", e.textContent = `
        @keyframes dassprism-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `, document.head.appendChild(e);
    }
    this.element.appendChild(t);
  }
  removeShimmer() {
    var t;
    (t = this.element.querySelector(`.${b}`)) == null || t.remove();
  }
}
async function G(i, t) {
  const e = typeof i == "string" ? document.querySelector(i) ?? (() => {
    throw new Error(`dassprism: element not found: "${i}"`);
  })() : i, s = new q(e, t);
  return await s.mount(), s;
}
export {
  q as DassPrism,
  G as createHologram
};
