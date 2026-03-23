import './styles/base.css'
import './styles/panel.css'
import { CARDS } from './app/cards'
import { CardShowcase } from './app/CardShowcase'
import { SettingsPanel } from './app/SettingsPanel'

const app = document.getElementById('app')!

app.innerHTML = `
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
`

const showcaseEl = document.getElementById('showcase')!
const settingsEl = document.getElementById('settings')!
const snippetEl = document.getElementById('snippet-code')!
const copyBtn = document.getElementById('copy-btn')!

const panel = new SettingsPanel(settingsEl, (snippet) => {
  snippetEl.textContent = snippet
})

const showcase = new CardShowcase(showcaseEl, CARDS, (entry) => {
  panel.load(entry)
})

// モーション重み変更時に全カードへ反映
settingsEl.addEventListener('input', (e) => {
  const target = e.target as HTMLInputElement
  if (['alpha-weight', 'beta-weight', 'gamma-weight'].includes(target.id)) {
    panel.updateMotionForAll(showcase.getEntries())
  }
})

copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(snippetEl.textContent ?? '').then(() => {
    copyBtn.textContent = 'Copied!'
    setTimeout(() => { copyBtn.textContent = 'Copy' }, 1500)
  })
})

showcase.mountAll()
