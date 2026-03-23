(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function t(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(n){if(n.ep)return;n.ep=!0;const s=t(n);fetch(n.href,s)}})();const L=[{id:"card-rainbow",label:"Rainbow Holo",pattern:"conic-rainbow",defaultOptions:{tileSize:40}},{id:"card-prism",label:"Line Prism",pattern:"line-prism",defaultOptions:{lineSpacing:8}},{id:"card-starburst",label:"StarBurst",pattern:"starburst",defaultOptions:{rays:12}},{id:"card-patch",label:"Holo Patch",pattern:"holo-patch",defaultOptions:{patchSize:60,patchGap:4}}],M={gyroscope:!0,mouse:!0,alphaWeight:.5,betaWeight:.5,gammaWeight:2,mouseSensitivity:.3};class q{constructor(e,t,i){this.angle=0,this.orientationHandler=null,this.mouseMoveHandler=null,this.resizeHandler=null,this.cx=0,this.cy=0,this.opts={...M,...e},this.onAngleChange=t,this.onPermissionDenied=i}async start(){this.opts.gyroscope&&await this.setupGyroscope(),this.opts.mouse&&this.setupMouse()}stop(){this.orientationHandler&&(window.removeEventListener("deviceorientation",this.orientationHandler,!0),this.orientationHandler=null),this.mouseMoveHandler&&(window.removeEventListener("mousemove",this.mouseMoveHandler),this.mouseMoveHandler=null),this.resizeHandler&&(window.removeEventListener("resize",this.resizeHandler),this.resizeHandler=null)}setOptions(e){this.opts={...this.opts,...e}}getAngle(){return this.angle}setAngle(e){this.angle=e,this.onAngleChange(this.angle)}async setupGyroscope(){if(typeof DeviceOrientationEvent<"u"&&typeof DeviceOrientationEvent.requestPermission=="function")try{if(await DeviceOrientationEvent.requestPermission()!=="granted"){this.onPermissionDenied();return}}catch{this.onPermissionDenied();return}this.orientationHandler=t=>{const{alphaWeight:i,betaWeight:n,gammaWeight:s}=this.opts,a=(t.alpha??0)*i,o=(t.beta??0)*n,l=(t.gamma??0)*s;this.angle=a+o+l,this.onAngleChange(this.angle)},window.addEventListener("deviceorientation",this.orientationHandler,!0)}setupMouse(){this.cx=window.innerWidth/2,this.cy=window.innerHeight/2,this.resizeHandler=()=>{this.cx=window.innerWidth/2,this.cy=window.innerHeight/2},window.addEventListener("resize",this.resizeHandler),this.mouseMoveHandler=e=>{this.angle=(e.clientX-this.cx+e.clientY-this.cy)*this.opts.mouseSensitivity,this.onAngleChange(this.angle)},window.addEventListener("mousemove",this.mouseMoveHandler)}}function A(r,e=100,t=60){return`hsl(${r%360}, ${e}%, ${t}%)`}function $(r){return Array.from({length:r},(e,t)=>A(360/r*t))}const I=["#ff7eb3","#ff65a3","#7afcff","#feff9c"];function R(r){const e=r.length;return r.map((t,i)=>`${t} ${Math.round(i/e*100)}%`).concat([`${r[0]} 100%`]).join(", ")}function k(r){const e=r.length-1;return r.map((t,i)=>`${t} ${Math.round(i/e*100)}%`).join(", ")}class V{constructor(e){this.colors=e.colors??I,this.tileSize=e.tileSize??40}render(e,t){const i=R(this.colors);e.style.backgroundImage=`repeating-conic-gradient(from ${t}deg, ${i})`,e.style.backgroundSize=`${this.tileSize}px ${this.tileSize}px`}}class F{constructor(e){this.colors=e.colors??$(7),this.lineSpacing=e.lineSpacing??8}render(e,t){const{colors:i,lineSpacing:n}=this,s=(t%360+360)%360,a=Math.round(s/360*i.length),o=[...i.slice(a),...i.slice(0,a)],l=o.map((c,h)=>{const d=h/o.length*100;return`${c} ${d.toFixed(1)}%`}).join(", ");e.style.backgroundImage=`repeating-linear-gradient(${t}deg, ${l}, ${o[0]} 100%)`,e.style.backgroundSize=`${n*i.length}px ${n*i.length}px`}}const D=["#ffd700","#fff8dc","#ffa500","#ff69b4","#7afcff","#ffd700"];class T{constructor(e){this.colors=e.colors??D,this.rays=e.rays??12,this.radial=`radial-gradient(ellipse at center, ${k(this.colors)})`}render(e,t){const{rays:i,radial:n}=this,s=360/i,a=Array.from({length:i},(o,l)=>{const c=(l*s+t).toFixed(1),h=((l+.4)*s+t).toFixed(1);return`rgba(255,255,255,0.25) ${c}deg, transparent ${h}deg`}).join(", ");e.style.backgroundImage=`repeating-conic-gradient(from ${t}deg, ${a}), ${n}`,e.style.backgroundSize="cover"}}class W{constructor(e){this.cachedCols=0,this.cachedRows=0,this.colors=e.colors??I,this.patchSize=e.patchSize??60,this.patchGap=e.patchGap??4,this.canvas=document.createElement("canvas"),this.canvas.style.cssText="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;",this.ctx=this.canvas.getContext("2d")}render(e,t){const{patchSize:i,patchGap:n,colors:s,canvas:a}=this,o=i+n,l=Math.ceil(e.clientWidth/o)+1,c=Math.ceil(e.clientHeight/o)+1;a.parentElement||e.appendChild(a),(l!==this.cachedCols||c!==this.cachedRows)&&(a.width=l*o,a.height=c*o,this.cachedCols=l,this.cachedRows=c);const h=this.ctx;h.clearRect(0,0,a.width,a.height);const d=s.length;for(let u=0;u<c;u++)for(let m=0;m<l;m++){const O=(u*l+m)*37,H=((t*3+O)%360+360)%360,b=m*o,w=u*o,f=h.createConicGradient(H*Math.PI/180,b+i/2,w+i/2);for(let g=0;g<d;g++)f.addColorStop(g/d,s[g]);f.addColorStop(1,s[0]),h.fillStyle=f,h.beginPath(),h.roundRect(b,w,i,i,4),h.fill()}}dispose(){this.canvas.remove(),this.cachedCols=0,this.cachedRows=0}}class v{constructor(e,t){this.currentId=e,this.pattern=v.create(e,t)}setPattern(e,t){var i,n;(n=(i=this.pattern).dispose)==null||n.call(i),this.currentId=e,this.pattern=v.create(e,t)}getId(){return this.currentId}render(e,t){this.pattern.render(e,t)}dispose(){var e,t;(t=(e=this.pattern).dispose)==null||t.call(e)}static create(e,t){switch(e){case"conic-rainbow":return new V(t);case"line-prism":return new F(t);case"starburst":return new T(t);case"holo-patch":return new W(t)}}}class B{constructor(){this.callbacks=new Set,this.rafId=null}add(e){this.callbacks.add(e),this.rafId===null&&this.start()}remove(e){this.callbacks.delete(e),this.callbacks.size===0&&this.stop()}start(){const e=t=>{this.callbacks.forEach(i=>i(t)),this.rafId=requestAnimationFrame(e)};this.rafId=requestAnimationFrame(e)}stop(){this.rafId!==null&&(cancelAnimationFrame(this.rafId),this.rafId=null)}dispose(){this.callbacks.clear(),this.stop()}}const z="dassprism-shimmer";let p=null,y=0;function G(){return p||(p=new B),y++,p}function N(){y--,y===0&&(p==null||p.dispose(),p=null)}class j{constructor(e,t={}){this.loop=null,this.dirty=!1,this.mounted=!1,this.frameCallback=()=>{this.dirty&&(this.engine.render(this.element,this.motion.getAngle()),this.dirty=!1)},this.eventHandlers=new Map,this.element=e,this.opts={pattern:t.pattern??"conic-rainbow",patternOptions:t.patternOptions??{},motion:t.motion??{},shimmer:t.shimmer??!0,shimmerSpeed:t.shimmerSpeed??2e3},this.engine=new v(this.opts.pattern,this.opts.patternOptions),this.motion=new q(this.opts.motion,i=>{this.dirty=!0,this.emit("angleChange",i)},()=>{this.emit("permissionDenied")})}async mount(){this.mounted||(this.mounted=!0,this.loop=G(),this.element.style.position="relative",this.element.style.overflow="hidden",this.opts.shimmer&&this.attachShimmer(),this.engine.render(this.element,0),this.loop.add(this.frameCallback),await this.motion.start())}unmount(){this.mounted&&(this.mounted=!1,this.motion.stop(),this.loop.remove(this.frameCallback),N(),this.loop=null,this.engine.dispose(),this.removeShimmer())}setPattern(e,t={}){this.opts.pattern=e,this.opts.patternOptions=t,this.engine.setPattern(e,t),this.dirty=!0}setMotion(e){this.opts.motion={...this.opts.motion,...e},this.motion.setOptions(e)}setAngle(e){this.motion.setAngle(e)}on(e,t){this.eventHandlers.has(e)||this.eventHandlers.set(e,new Set),this.eventHandlers.get(e).add(t)}off(e,t){var i;(i=this.eventHandlers.get(e))==null||i.delete(t)}emit(e,...t){var i;(i=this.eventHandlers.get(e))==null||i.forEach(n=>n(...t))}attachShimmer(){const e=document.createElement("div");if(e.className=z,e.style.cssText=`
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
    `,this.element.style.setProperty("--dassprism-shimmer-speed",`${this.opts.shimmerSpeed}ms`),!document.getElementById("dassprism-keyframes")){const t=document.createElement("style");t.id="dassprism-keyframes",t.textContent=`
        @keyframes dassprism-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `,document.head.appendChild(t)}this.element.appendChild(e)}removeShimmer(){var e;(e=this.element.querySelector(`.${z}`))==null||e.remove()}}class _{constructor(e,t,i){this.entries=[],this.activeEntry=null,this.onSelect=i;const n=document.createElement("div");n.className="card-grid",e.appendChild(n);for(const s of t){const a=document.createElement("div");a.className="holo-card",a.id=s.id;const o=document.createElement("div");o.className="card-label",o.textContent=s.label,a.appendChild(o),n.appendChild(a);const l=new j(a,{pattern:s.pattern,patternOptions:s.defaultOptions,shimmer:!0}),c={def:s,element:a,instance:l};this.entries.push(c),a.addEventListener("click",()=>this.activate(c))}}async mountAll(){await Promise.all(this.entries.map(e=>e.instance.mount())),this.activate(this.entries[0])}activate(e){this.entries.forEach(t=>t.element.classList.remove("active")),e.element.classList.add("active"),this.activeEntry=e,this.onSelect(e)}getActive(){return this.activeEntry}getEntries(){return this.entries}}class U{constructor(e,t){this.active=null,this.container=e,this.onSnippetChange=t,this.build()}build(){this.container.innerHTML=`
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
    `,this.controls={patternSelect:this.container.querySelector("#pattern-select"),tileSizeRow:this.container.querySelector("#tile-size-row"),tileSizeInput:this.container.querySelector("#tile-size"),tileSizeValue:this.container.querySelector("#tile-size-val"),lineSpacingRow:this.container.querySelector("#line-spacing-row"),lineSpacingInput:this.container.querySelector("#line-spacing"),lineSpacingValue:this.container.querySelector("#line-spacing-val"),raysRow:this.container.querySelector("#rays-row"),raysInput:this.container.querySelector("#rays"),raysValue:this.container.querySelector("#rays-val"),patchSizeRow:this.container.querySelector("#patch-size-row"),patchSizeInput:this.container.querySelector("#patch-size"),patchSizeValue:this.container.querySelector("#patch-size-val"),shimmerToggle:this.container.querySelector("#shimmer-toggle"),shimmerSpeedInput:this.container.querySelector("#shimmer-speed"),shimmerSpeedValue:this.container.querySelector("#shimmer-speed-val"),alphaInput:this.container.querySelector("#alpha-weight"),alphaValue:this.container.querySelector("#alpha-val"),betaInput:this.container.querySelector("#beta-weight"),betaValue:this.container.querySelector("#beta-val"),gammaInput:this.container.querySelector("#gamma-weight"),gammaValue:this.container.querySelector("#gamma-val")},this.bindEvents()}bindEvents(){const e=this.controls;e.patternSelect.addEventListener("change",()=>{if(!this.active)return;const i=e.patternSelect.value,n=this.currentPatternOptions(i);this.active.instance.setPattern(i,n),this.showPatternRows(i),this.emitSnippet()});const t=(i,n,s=0)=>{i.addEventListener("input",()=>{const a=parseFloat(i.value);n.textContent=s>0?a.toFixed(s):String(a),this.applyPatternOptions(),this.emitSnippet()})};t(e.tileSizeInput,e.tileSizeValue),t(e.lineSpacingInput,e.lineSpacingValue),t(e.raysInput,e.raysValue),t(e.patchSizeInput,e.patchSizeValue),t(e.shimmerSpeedInput,e.shimmerSpeedValue),t(e.alphaInput,e.alphaValue,1),t(e.betaInput,e.betaValue,1),t(e.gammaInput,e.gammaValue,1),e.shimmerToggle.addEventListener("change",()=>{this.emitSnippet()})}load(e){this.active=e;const{pattern:t,defaultOptions:i}=e.def,n=this.controls;n.patternSelect.value=t,this.showPatternRows(t),i.tileSize!=null&&(n.tileSizeInput.value=String(i.tileSize)),i.lineSpacing!=null&&(n.lineSpacingInput.value=String(i.lineSpacing)),i.rays!=null&&(n.raysInput.value=String(i.rays)),i.patchSize!=null&&(n.patchSizeInput.value=String(i.patchSize)),n.tileSizeValue.textContent=n.tileSizeInput.value,n.lineSpacingValue.textContent=n.lineSpacingInput.value,n.raysValue.textContent=n.raysInput.value,n.patchSizeValue.textContent=n.patchSizeInput.value,this.emitSnippet()}showPatternRows(e){const t=this.controls;t.tileSizeRow.style.display=e==="conic-rainbow"||e==="holo-patch"?"":"none",t.lineSpacingRow.style.display=e==="line-prism"?"":"none",t.raysRow.style.display=e==="starburst"?"":"none",t.patchSizeRow.style.display=e==="holo-patch"?"":"none"}currentPatternOptions(e){const t=this.controls;switch(e){case"conic-rainbow":return{tileSize:parseInt(t.tileSizeInput.value)};case"line-prism":return{lineSpacing:parseInt(t.lineSpacingInput.value)};case"starburst":return{rays:parseInt(t.raysInput.value)};case"holo-patch":return{patchSize:parseInt(t.patchSizeInput.value),tileSize:parseInt(t.tileSizeInput.value)}}}applyPatternOptions(){if(!this.active)return;const e=this.controls.patternSelect.value;this.active.instance.setPattern(e,this.currentPatternOptions(e))}readMotionOpts(){const e=this.controls;return{alphaWeight:parseFloat(e.alphaInput.value),betaWeight:parseFloat(e.betaInput.value),gammaWeight:parseFloat(e.gammaInput.value)}}emitSnippet(){if(!this.active)return;const e=this.controls,t=e.patternSelect.value,i=JSON.stringify({pattern:t,patternOptions:this.currentPatternOptions(t),motion:this.readMotionOpts(),shimmer:e.shimmerToggle.checked,shimmerSpeed:parseInt(e.shimmerSpeedInput.value)},null,2);this.onSnippetChange(`createHologram('#my-card', ${i})`)}updateMotionForAll(e){const t=this.readMotionOpts();e.forEach(i=>i.instance.setMotion(t))}}const J=document.getElementById("app");J.innerHTML=`
  <header>
    <span class="logo">dassprism</span>
    <div class="header-links">
      <a href="https://github.com/uenot/dassprism" target="_blank" rel="noopener">GitHub</a>
    </div>
  </header>
  <main>
    <section id="showcase"></section>
    <aside id="settings"></aside>
  </main>
  <div id="snippet-section">
    <h3>Usage</h3>
    <div class="snippet-wrapper">
      <pre id="snippet-code"></pre>
      <button class="copy-btn" id="copy-btn">Copy</button>
    </div>
  </div>
  <footer>
    90s Carddass hologram effects for the web &mdash; MIT License
  </footer>
`;const K=document.getElementById("showcase"),C=document.getElementById("settings"),x=document.getElementById("snippet-code"),S=document.getElementById("copy-btn"),E=new U(C,r=>{x.textContent=r}),P=new _(K,L,r=>{E.load(r)});C.addEventListener("input",r=>{const e=r.target;["alpha-weight","beta-weight","gamma-weight"].includes(e.id)&&E.updateMotionForAll(P.getEntries())});S.addEventListener("click",()=>{navigator.clipboard.writeText(x.textContent??"").then(()=>{S.textContent="Copied!",setTimeout(()=>{S.textContent="Copy"},1500)})});P.mountAll();
