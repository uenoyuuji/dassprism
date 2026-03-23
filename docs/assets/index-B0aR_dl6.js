(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const a of n.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(s){if(s.ep)return;s.ep=!0;const n=t(s);fetch(s.href,n)}})();const H=[{id:"card-rainbow",label:"Rainbow Holo",pattern:"conic-rainbow",defaultOptions:{tileSize:40}},{id:"card-prism",label:"Line Prism",pattern:"line-prism",defaultOptions:{lineSpacing:8}},{id:"card-starburst",label:"StarBurst",pattern:"starburst",defaultOptions:{rays:12}},{id:"card-patch",label:"Holo Patch",pattern:"holo-patch",defaultOptions:{patchSize:60,patchGap:4}}],A={gyroscope:!0,mouse:!0,alphaWeight:.5,betaWeight:.5,gammaWeight:2,mouseSensitivity:.3};class q{constructor(e,t,i){this.angle=0,this.orientationHandler=null,this.mouseMoveHandler=null,this.opts={...A,...e},this.onAngleChange=t,this.onPermissionDenied=i}async start(){this.opts.gyroscope&&await this.setupGyroscope(),this.opts.mouse&&this.setupMouse()}stop(){this.orientationHandler&&(window.removeEventListener("deviceorientation",this.orientationHandler,!0),this.orientationHandler=null),this.mouseMoveHandler&&(window.removeEventListener("mousemove",this.mouseMoveHandler),this.mouseMoveHandler=null)}setOptions(e){this.opts={...this.opts,...e}}getAngle(){return this.angle}setAngle(e){this.angle=e,this.onAngleChange(this.angle)}async setupGyroscope(){if(typeof DeviceOrientationEvent<"u"&&typeof DeviceOrientationEvent.requestPermission=="function")try{if(await DeviceOrientationEvent.requestPermission()!=="granted"){this.onPermissionDenied();return}}catch{this.onPermissionDenied();return}this.orientationHandler=t=>{const{alphaWeight:i,betaWeight:s,gammaWeight:n}=this.opts,a=(t.alpha??0)*i,r=(t.beta??0)*s,l=(t.gamma??0)*n;this.angle=a+r+l,this.onAngleChange(this.angle)},window.addEventListener("deviceorientation",this.orientationHandler,!0)}setupMouse(){this.mouseMoveHandler=e=>{const t=window.innerWidth/2,i=window.innerHeight/2,s=e.clientX-t,n=e.clientY-i;this.angle=(s+n)*this.opts.mouseSensitivity,this.onAngleChange(this.angle)},window.addEventListener("mousemove",this.mouseMoveHandler)}}function k(o,e=100,t=60){return`hsl(${o%360}, ${e}%, ${t}%)`}function M(o){return Array.from({length:o},(e,t)=>k(360/o*t))}const I=["#ff7eb3","#ff65a3","#7afcff","#feff9c"];function R(o){const e=o.length;return o.map((t,i)=>`${t} ${Math.round(i/e*100)}%`).concat([`${o[0]} 100%`]).join(", ")}class F{constructor(e){this.colors=e.colors??I,this.tileSize=e.tileSize??40}render(e,t){const i=R(this.colors);e.style.backgroundImage=`repeating-conic-gradient(from ${t}deg, ${i})`,e.style.backgroundSize=`${this.tileSize}px ${this.tileSize}px`}}class V{constructor(e){this.colors=e.colors??M(7),this.lineSpacing=e.lineSpacing??8}render(e,t){const{colors:i,lineSpacing:s}=this,n=(t%360+360)%360,a=Math.round(n/360*i.length),r=[...i.slice(a),...i.slice(0,a)],l=r.map((c,p)=>{const h=p/r.length*100;return`${c} ${h.toFixed(1)}%`}).join(", ");e.style.backgroundImage=`repeating-linear-gradient(${t}deg, ${l}, ${r[0]} 100%)`,e.style.backgroundSize=`${s*i.length}px ${s*i.length}px`}}const D=["#ffd700","#fff8dc","#ffa500","#ff69b4","#7afcff","#ffd700"];class W{constructor(e){this.colors=e.colors??D,this.rays=e.rays??12}render(e,t){const{colors:i,rays:s}=this,a=`radial-gradient(ellipse at center, ${i.map((p,h)=>`${p} ${(h/(i.length-1)*100).toFixed(1)}%`).join(", ")})`,r=360/s,l=Array.from({length:s},(p,h)=>{const u=(h*r+t).toFixed(1),g=((h+.4)*r+t).toFixed(1);return`rgba(255,255,255,0.25) ${u}deg, transparent ${g}deg`}).join(", "),c=`repeating-conic-gradient(from ${t}deg, ${l})`;e.style.backgroundImage=`${c}, ${a}`,e.style.backgroundSize="cover"}}class T{constructor(e){this.lastDataUrl="",this.colors=e.colors??I,this.patchSize=e.patchSize??60,this.patchGap=e.patchGap??4,this.canvas=document.createElement("canvas"),this.ctx=this.canvas.getContext("2d")}render(e,t){const{patchSize:i,patchGap:s,colors:n}=this,a=i+s,r=Math.ceil(e.clientWidth/a)+1,l=Math.ceil(e.clientHeight/a)+1;this.canvas.width=r*a,this.canvas.height=l*a;const c=this.ctx;c.clearRect(0,0,this.canvas.width,this.canvas.height);for(let h=0;h<l;h++)for(let u=0;u<r;u++){const g=(h*r+u)*37,P=((t*3+g)%360+360)%360,y=u*a,b=h*a,v=c.createConicGradient(P*Math.PI/180,y+i/2,b+i/2),O=n.length;n.forEach((L,$)=>{v.addColorStop($/O,L)}),v.addColorStop(1,n[0]),c.fillStyle=v,c.beginPath(),c.roundRect(y,b,i,i,4),c.fill()}const p=this.canvas.toDataURL();p!==this.lastDataUrl&&(this.lastDataUrl=p,e.style.backgroundImage=`url("${p}")`,e.style.backgroundSize=`${r*a}px ${l*a}px`,e.style.backgroundPosition="0 0")}dispose(){this.lastDataUrl=""}}class m{constructor(e,t){this.currentId=e,this.pattern=m.create(e,t)}setPattern(e,t){var i,s;(s=(i=this.pattern).dispose)==null||s.call(i),this.currentId=e,this.pattern=m.create(e,t)}getId(){return this.currentId}render(e,t){this.pattern.render(e,t)}dispose(){var e,t;(t=(e=this.pattern).dispose)==null||t.call(e)}static create(e,t){switch(e){case"conic-rainbow":return new F(t);case"line-prism":return new V(t);case"starburst":return new W(t);case"holo-patch":return new T(t)}}}class B{constructor(){this.callbacks=new Set,this.rafId=null}add(e){this.callbacks.add(e),this.rafId===null&&this.start()}remove(e){this.callbacks.delete(e),this.callbacks.size===0&&this.stop()}start(){const e=t=>{this.callbacks.forEach(i=>i(t)),this.rafId=requestAnimationFrame(e)};this.rafId=requestAnimationFrame(e)}stop(){this.rafId!==null&&(cancelAnimationFrame(this.rafId),this.rafId=null)}dispose(){this.callbacks.clear(),this.stop()}}const w="dassprism-shimmer";let d=null,S=0;function G(){return d||(d=new B),S++,d}function U(){S--,S===0&&(d==null||d.dispose(),d=null)}class N{constructor(e,t={}){this.angle=0,this.dirty=!1,this.mounted=!1,this.frameCallback=()=>{this.dirty&&(this.engine.render(this.element,this.angle),this.dirty=!1)},this.eventHandlers=new Map,this.element=e,this.opts={pattern:t.pattern??"conic-rainbow",patternOptions:t.patternOptions??{},motion:t.motion??{},shimmer:t.shimmer??!0,shimmerSpeed:t.shimmerSpeed??2e3},this.engine=new m(this.opts.pattern,this.opts.patternOptions),this.loop=G(),this.motion=new q(this.opts.motion,i=>{this.angle=i,this.dirty=!0,this.emit("angleChange",i)},()=>{this.emit("permissionDenied")})}async mount(){this.mounted||(this.mounted=!0,this.element.style.position="relative",this.element.style.overflow="hidden",this.opts.shimmer&&this.attachShimmer(),this.engine.render(this.element,0),this.loop.add(this.frameCallback),await this.motion.start())}unmount(){this.mounted&&(this.mounted=!1,this.motion.stop(),this.loop.remove(this.frameCallback),U(),this.engine.dispose(),this.removeShimmer())}setPattern(e,t={}){this.opts.pattern=e,this.opts.patternOptions=t,this.engine.setPattern(e,t),this.dirty=!0}setMotion(e){this.opts.motion={...this.opts.motion,...e},this.motion.setOptions(e)}setAngle(e){this.motion.setAngle(e)}on(e,t){this.eventHandlers.has(e)||this.eventHandlers.set(e,new Set),this.eventHandlers.get(e).add(t)}off(e,t){var i;(i=this.eventHandlers.get(e))==null||i.delete(t)}emit(e,...t){var i;(i=this.eventHandlers.get(e))==null||i.forEach(s=>s(...t))}attachShimmer(){const e=document.createElement("div");if(e.className=w,e.style.cssText=`
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
      `,document.head.appendChild(t)}this.element.appendChild(e)}removeShimmer(){var e;(e=this.element.querySelector(`.${w}`))==null||e.remove()}}class j{constructor(e,t,i){this.entries=[],this.activeIndex=0,this.onSelect=i;const s=document.createElement("div");s.className="card-grid",e.appendChild(s);for(const n of t){const a=document.createElement("div");a.className="holo-card",a.id=n.id;const r=document.createElement("div");r.className="card-label",r.textContent=n.label,a.appendChild(r),s.appendChild(a);const l=new N(a,{pattern:n.pattern,patternOptions:n.defaultOptions,shimmer:!0}),c={def:n,element:a,instance:l};this.entries.push(c),a.addEventListener("click",()=>this.activate(c))}}async mountAll(){await Promise.all(this.entries.map(e=>e.instance.mount())),this.activate(this.entries[0])}activate(e){this.entries.forEach(t=>t.element.classList.remove("active")),e.element.classList.add("active"),this.activeIndex=this.entries.indexOf(e),this.onSelect(e)}getActive(){return this.entries[this.activeIndex]}syncAngle(e){this.entries.forEach(t=>t.instance.setAngle(e))}getEntries(){return this.entries}}class _{constructor(e,t){this.active=null,this.container=e,this.onSnippetChange=t,this.build()}build(){this.container.innerHTML=`
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
    `,this.controls={patternSelect:this.container.querySelector("#pattern-select"),tileSizeRow:this.container.querySelector("#tile-size-row"),tileSizeInput:this.container.querySelector("#tile-size"),tileSizeValue:this.container.querySelector("#tile-size-val"),lineSpacingRow:this.container.querySelector("#line-spacing-row"),lineSpacingInput:this.container.querySelector("#line-spacing"),lineSpacingValue:this.container.querySelector("#line-spacing-val"),raysRow:this.container.querySelector("#rays-row"),raysInput:this.container.querySelector("#rays"),raysValue:this.container.querySelector("#rays-val"),patchSizeRow:this.container.querySelector("#patch-size-row"),patchSizeInput:this.container.querySelector("#patch-size"),patchSizeValue:this.container.querySelector("#patch-size-val"),shimmerToggle:this.container.querySelector("#shimmer-toggle"),shimmerSpeedInput:this.container.querySelector("#shimmer-speed"),shimmerSpeedValue:this.container.querySelector("#shimmer-speed-val"),alphaInput:this.container.querySelector("#alpha-weight"),alphaValue:this.container.querySelector("#alpha-val"),betaInput:this.container.querySelector("#beta-weight"),betaValue:this.container.querySelector("#beta-val"),gammaInput:this.container.querySelector("#gamma-weight"),gammaValue:this.container.querySelector("#gamma-val")},this.bindEvents()}bindEvents(){const e=this.controls;e.patternSelect.addEventListener("change",()=>{if(!this.active)return;const i=e.patternSelect.value,s=this.currentPatternOptions(i);this.active.instance.setPattern(i,s),this.showPatternRows(i),this.emitSnippet()});const t=(i,s,n=0)=>{i.addEventListener("input",()=>{const a=parseFloat(i.value);s.textContent=n>0?a.toFixed(n):String(a),this.applyPatternOptions(),this.emitSnippet()})};t(e.tileSizeInput,e.tileSizeValue),t(e.lineSpacingInput,e.lineSpacingValue),t(e.raysInput,e.raysValue),t(e.patchSizeInput,e.patchSizeValue),t(e.shimmerSpeedInput,e.shimmerSpeedValue),t(e.alphaInput,e.alphaValue,1),t(e.betaInput,e.betaValue,1),t(e.gammaInput,e.gammaValue,1),e.shimmerToggle.addEventListener("change",()=>{this.emitSnippet()})}load(e){this.active=e;const{pattern:t,defaultOptions:i}=e.def,s=this.controls;s.patternSelect.value=t,this.showPatternRows(t),i.tileSize!=null&&(s.tileSizeInput.value=String(i.tileSize)),i.lineSpacing!=null&&(s.lineSpacingInput.value=String(i.lineSpacing)),i.rays!=null&&(s.raysInput.value=String(i.rays)),i.patchSize!=null&&(s.patchSizeInput.value=String(i.patchSize)),s.tileSizeValue.textContent=s.tileSizeInput.value,s.lineSpacingValue.textContent=s.lineSpacingInput.value,s.raysValue.textContent=s.raysInput.value,s.patchSizeValue.textContent=s.patchSizeInput.value,this.emitSnippet()}showPatternRows(e){const t=this.controls;t.tileSizeRow.style.display=e==="conic-rainbow"||e==="holo-patch"?"":"none",t.lineSpacingRow.style.display=e==="line-prism"?"":"none",t.raysRow.style.display=e==="starburst"?"":"none",t.patchSizeRow.style.display=e==="holo-patch"?"":"none"}currentPatternOptions(e){const t=this.controls;switch(e){case"conic-rainbow":return{tileSize:parseInt(t.tileSizeInput.value)};case"line-prism":return{lineSpacing:parseInt(t.lineSpacingInput.value)};case"starburst":return{rays:parseInt(t.raysInput.value)};case"holo-patch":return{patchSize:parseInt(t.patchSizeInput.value),tileSize:parseInt(t.tileSizeInput.value)}}}applyPatternOptions(){if(!this.active)return;const e=this.controls.patternSelect.value;this.active.instance.setPattern(e,this.currentPatternOptions(e))}emitSnippet(){if(!this.active)return;const e=this.controls,t=e.patternSelect.value,i=this.currentPatternOptions(t),s={alphaWeight:parseFloat(e.alphaInput.value),betaWeight:parseFloat(e.betaInput.value),gammaWeight:parseFloat(e.gammaInput.value)},n=e.shimmerToggle.checked,a=parseInt(e.shimmerSpeedInput.value),l=`createHologram('#my-card', ${JSON.stringify({pattern:t,patternOptions:i,motion:s,shimmer:n,shimmerSpeed:a},null,2)})`;this.onSnippetChange(l)}updateMotionForAll(e){const t=this.controls,i={alphaWeight:parseFloat(t.alphaInput.value),betaWeight:parseFloat(t.betaInput.value),gammaWeight:parseFloat(t.gammaInput.value)};e.forEach(s=>s.instance.setMotion(i))}}const J=document.getElementById("app");J.innerHTML=`
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
`;const K=document.getElementById("showcase"),z=document.getElementById("settings"),x=document.getElementById("snippet-code"),f=document.getElementById("copy-btn"),C=new _(z,o=>{x.textContent=o}),E=new j(K,H,o=>{C.load(o)});z.addEventListener("input",o=>{const e=o.target;["alpha-weight","beta-weight","gamma-weight"].includes(e.id)&&C.updateMotionForAll(E.getEntries())});f.addEventListener("click",()=>{navigator.clipboard.writeText(x.textContent??"").then(()=>{f.textContent="Copied!",setTimeout(()=>{f.textContent="Copy"},1500)})});E.mountAll();
