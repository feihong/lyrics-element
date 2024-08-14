class SongLyrics extends HTMLElement {
  static body = `<style>
    .root {
      display: flex;
      flex-direction: column;
      gap: 1em;
    }
    .line {
      font-size: 1.5em;
    }
    .explanation {
      color: gray;
    }
  </style>
  <div class="root"></div>`


  constructor() {
    super()
    this.attachShadow({mode: 'open'})
    this.shadowRoot.innerHTML = SongLyrics.body
    this.onMutation = this.onMutation.bind(this)
  }

  connectedCallback() {
    this.observer = new MutationObserver(this.onMutation);
    this.observer.observe(this, {
      childList: true
    })
  }

  disconnectedCallback() {
    this.observer.disconnect();
  }

  onMutation(mutations) {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType == Node.TEXT_NODE) {
          this.init(node.nodeValue)
          return
        }
      }
    }
  }

  init(text) {
    const root = this.shadowRoot.querySelector('.root')

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
