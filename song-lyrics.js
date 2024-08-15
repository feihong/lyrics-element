class SongLyrics extends HTMLElement {
  static body = `<style>
    .root {
      display: flex;
      flex-direction: column;
      gap: 1em;
    }
    .title {
      font-size: 2em;
    }
    .line {
      font-size: 1.3em;
    }
    .explanation {
      color: gray;
    }
  </style>
  <div class="root">
    <div class="head">
      <div class="title"></div>
      <div class="explanation"></div>
    </div>
  </div>`


  constructor() {
    super()
    this.attachShadow({mode: 'open'})
    this.shadowRoot.innerHTML = SongLyrics.body
    this.onMutation = this.onMutation.bind(this)
  }

  connectedCallback() {
    this.observer = new MutationObserver(this.onMutation);
    this.observer.observe(this, {childList: true})

    this.title = this.getAttribute('title')
    this.explanation = this.getAttribute('explanation')
  }

  onMutation(_mutations) {
    this.observer.disconnect();
    if (this.firstChild.nodeType === Node.TEXT_NODE) {
      this.init(this.firstChild.nodeValue)
    }
  }

  init(text) {
    const root = this.shadowRoot.querySelector('.root')

    root.querySelector('.title').innerText = this.title
    root.querySelector('.explanation').innerText = '“' + this.explanation + '”'

    const stanzas = text.trim().split(/\n{2,}/g)
    for (const stanza of stanzas) {
      const sdiv = document.createElement('div')
      sdiv.className = 'stanza'
      root.appendChild(sdiv)

      for (const line of stanza.split(/\n/g)) {
        const ldiv = document.createElement('div')
        if (line.startsWith(';')) {
          ldiv.className = 'explanation'
          ldiv.innerText = line.substring(1).trim()
        } else {
          ldiv.className = 'line'
          ldiv.innerText = line
        }
        sdiv.appendChild(ldiv)
      }
    }
  }
}

customElements.define('song-lyrics', SongLyrics)
