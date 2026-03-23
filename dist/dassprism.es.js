const x = {
  gyroscope: !0,
  mouse: !0,
  alphaWeight: 0.5,
  betaWeight: 0.5,
  gammaWeight: 2,
  mouseSensitivity: 0.3
};
class A {
  constructor(t, e, s) {
    this.angle = 0, this.orientationHandler = null, this.mouseMoveHandler = null, this.opts = { ...x, ...t }, this.onAngleChange = e, this.onPermissionDenied = s;
  }
  async start() {
    this.opts.gyroscope && await this.setupGyroscope(), this.opts.mouse && this.setupMouse();
  }
  stop() {
    this.orientationHandler && (window.removeEventListener("deviceorientation", this.orientationHandler, !0), this.orientationHandler = null), this.mouseMoveHandler && (window.removeEventListener("mousemove", this.mouseMoveHandler), this.mouseMoveHandler = null);
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
      const { alphaWeight: s, betaWeight: n, gammaWeight: h } = this.opts, o = (e.alpha ?? 0) * s, r = (e.beta ?? 0) * n, l = (e.gamma ?? 0) * h;
      this.angle = o + r + l, this.onAngleChange(this.angle);
    }, window.addEventListener("deviceorientation", this.orientationHandler, !0);
  }
  setupMouse() {
    this.mouseMoveHandler = (t) => {
      const e = window.innerWidth / 2, s = window.innerHeight / 2, n = t.clientX - e, h = t.clientY - s;
      this.angle = (n + h) * this.opts.mouseSensitivity, this.onAngleChange(this.angle);
    }, window.addEventListener("mousemove", this.mouseMoveHandler);
  }
}
function D(i, t = 100, e = 60) {
  return `hsl(${i % 360}, ${t}%, ${e}%)`;
}
function I(i) {
  return Array.from({ length: i }, (t, e) => D(360 / i * e));
}
const b = [
  "#ff7eb3",
  // hot pink
  "#ff65a3",
  // pink
  "#7afcff",
  // cyan
  "#feff9c"
  // pale yellow
];
function M(i) {
  const t = i.length;
  return i.map((e, s) => `${e} ${Math.round(s / t * 100)}%`).concat([`${i[0]} 100%`]).join(", ");
}
class E {
  constructor(t) {
    this.colors = t.colors ?? b, this.tileSize = t.tileSize ?? 40;
  }
  render(t, e) {
    const s = M(this.colors);
    t.style.backgroundImage = `repeating-conic-gradient(from ${e}deg, ${s})`, t.style.backgroundSize = `${this.tileSize}px ${this.tileSize}px`;
  }
}
class P {
  constructor(t) {
    this.colors = t.colors ?? I(7), this.lineSpacing = t.lineSpacing ?? 8;
  }
  render(t, e) {
    const { colors: s, lineSpacing: n } = this, h = (e % 360 + 360) % 360, o = Math.round(h / 360 * s.length), r = [...s.slice(o), ...s.slice(0, o)], l = r.map((c, d) => {
      const a = d / r.length * 100;
      return `${c} ${a.toFixed(1)}%`;
    }).join(", ");
    t.style.backgroundImage = `repeating-linear-gradient(${e}deg, ${l}, ${r[0]} 100%)`, t.style.backgroundSize = `${n * s.length}px ${n * s.length}px`;
  }
}
const z = ["#ffd700", "#fff8dc", "#ffa500", "#ff69b4", "#7afcff", "#ffd700"];
class L {
  constructor(t) {
    this.colors = t.colors ?? z, this.rays = t.rays ?? 12;
  }
  render(t, e) {
    const { colors: s, rays: n } = this, o = `radial-gradient(ellipse at center, ${s.map((d, a) => `${d} ${(a / (s.length - 1) * 100).toFixed(1)}%`).join(", ")})`, r = 360 / n, l = Array.from({ length: n }, (d, a) => {
      const p = (a * r + e).toFixed(1), g = ((a + 0.4) * r + e).toFixed(1);
      return `rgba(255,255,255,0.25) ${p}deg, transparent ${g}deg`;
    }).join(", "), c = `repeating-conic-gradient(from ${e}deg, ${l})`;
    t.style.backgroundImage = `${c}, ${o}`, t.style.backgroundSize = "cover";
  }
}
class O {
  constructor(t) {
    this.lastDataUrl = "", this.colors = t.colors ?? b, this.patchSize = t.patchSize ?? 60, this.patchGap = t.patchGap ?? 4, this.canvas = document.createElement("canvas"), this.ctx = this.canvas.getContext("2d");
  }
  render(t, e) {
    const { patchSize: s, patchGap: n, colors: h } = this, o = s + n, r = Math.ceil(t.clientWidth / o) + 1, l = Math.ceil(t.clientHeight / o) + 1;
    this.canvas.width = r * o, this.canvas.height = l * o;
    const c = this.ctx;
    c.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let a = 0; a < l; a++)
      for (let p = 0; p < r; p++) {
        const g = (a * r + p) * 37, $ = ((e * 3 + g) % 360 + 360) % 360, v = p * o, S = a * o, f = c.createConicGradient($ * Math.PI / 180, v + s / 2, S + s / 2), k = h.length;
        h.forEach((H, C) => {
          f.addColorStop(C / k, H);
        }), f.addColorStop(1, h[0]), c.fillStyle = f, c.beginPath(), c.roundRect(v, S, s, s, 4), c.fill();
      }
    const d = this.canvas.toDataURL();
    d !== this.lastDataUrl && (this.lastDataUrl = d, t.style.backgroundImage = `url("${d}")`, t.style.backgroundSize = `${r * o}px ${l * o}px`, t.style.backgroundPosition = "0 0");
  }
  dispose() {
    this.lastDataUrl = "";
  }
}
class u {
  constructor(t, e) {
    this.currentId = t, this.pattern = u.create(t, e);
  }
  setPattern(t, e) {
    var s, n;
    (n = (s = this.pattern).dispose) == null || n.call(s), this.currentId = t, this.pattern = u.create(t, e);
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
        return new E(e);
      case "line-prism":
        return new P(e);
      case "starburst":
        return new L(e);
      case "holo-patch":
        return new O(e);
    }
  }
}
class F {
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
const w = "dassprism-shimmer";
let m = null, y = 0;
function R() {
  return m || (m = new F()), y++, m;
}
function U() {
  y--, y === 0 && (m == null || m.dispose(), m = null);
}
class W {
  constructor(t, e = {}) {
    this.angle = 0, this.dirty = !1, this.mounted = !1, this.frameCallback = () => {
      this.dirty && (this.engine.render(this.element, this.angle), this.dirty = !1);
    }, this.eventHandlers = /* @__PURE__ */ new Map(), this.element = t, this.opts = {
      pattern: e.pattern ?? "conic-rainbow",
      patternOptions: e.patternOptions ?? {},
      motion: e.motion ?? {},
      shimmer: e.shimmer ?? !0,
      shimmerSpeed: e.shimmerSpeed ?? 2e3
    }, this.engine = new u(this.opts.pattern, this.opts.patternOptions), this.loop = R(), this.motion = new A(
      this.opts.motion,
      (s) => {
        this.angle = s, this.dirty = !0, this.emit("angleChange", s);
      },
      () => {
        this.emit("permissionDenied");
      }
    );
  }
  async mount() {
    this.mounted || (this.mounted = !0, this.element.style.position = "relative", this.element.style.overflow = "hidden", this.opts.shimmer && this.attachShimmer(), this.engine.render(this.element, 0), this.loop.add(this.frameCallback), await this.motion.start());
  }
  unmount() {
    this.mounted && (this.mounted = !1, this.motion.stop(), this.loop.remove(this.frameCallback), U(), this.engine.dispose(), this.removeShimmer());
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
    if (t.className = w, t.style.cssText = `
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
    (t = this.element.querySelector(`.${w}`)) == null || t.remove();
  }
}
async function q(i, t) {
  const e = typeof i == "string" ? document.querySelector(i) ?? (() => {
    throw new Error(`dassprism: element not found: "${i}"`);
  })() : i, s = new W(e, t);
  return await s.mount(), s;
}
export {
  W as DassPrism,
  q as createHologram
};
