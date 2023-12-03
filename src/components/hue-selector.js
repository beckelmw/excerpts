class HueSelector extends HTMLElement {
  /** @type {number} */
  _hue;

  constructor() {
    super();
    this.toggleHueSelector = this.toggleHueSelector.bind(this);

    const supported = CSS.supports("color", "oklch(0 0 150)");
    if (!supported) {
      return;
    }

    this.attachShadow({ mode: "open" });
    const hue = window.localStorage.getItem("hue");
    const hasStoredHue = typeof hue === "string";

    // If the viewer has a stored hue then use that
    if (hasStoredHue) {
      this.hue = Number(hue);
    }

    this.render();
  }

  connectedCallback() {
    if (!this.shadowRoot) {
      return;
    }

    this.shadowRoot
      .querySelector("#dropper")
      ?.addEventListener("click", this.toggleHueSelector);
    this.shadowRoot
      .querySelector("#dropper")
      ?.addEventListener("keypress", (ev) => {
        // @ts-ignore
        if (ev.keyCode === 13) {
          this.toggleHueSelector(ev);
        }
      });

    this.shadowRoot
      .querySelector('input[type="range"]')
      ?.addEventListener("input", (evt) => {
        // @ts-ignore
        this.hue = evt.target.value;
        window.localStorage.setItem("hue", this.hue.toString());
      });
  }

  /**
   *
   * @param {Event} ev
   */
  toggleHueSelector(ev) {
    const background = this.shadowRoot?.querySelector("#inputBackground");
    if (background?.classList.contains("hidden")) {
      background.classList.remove("hidden");
    } else {
      background?.classList.add("hidden");
    }
  }

  render() {
    if (!this.shadowRoot) {
      return;
    }
    this.shadowRoot.innerHTML = this.dropperIcon;
  }

  /** @returns {number} */
  get hue() {
    return this._hue ?? 250;
  }

  /** @param {number} value */
  set hue(value) {
    this._hue = value;

    if (!value) {
      return;
    }

    const root = window.document.documentElement;
    root.style.setProperty("--hue", this._hue.toString());
  }

  get dropperIcon() {
    return `
    <style>
      svg { 
        width: 24px; 
        height: 24px;
        padding: 10px;
        pointer-events: none;
      } 
      div {
        overflow:hidden;
        cursor: pointer;
        display: flex;
      }
      input[type="range"] {
        position: absolute;
        inset: -4px -8px;
        border-radius: 4px;
        background-color: transparent;
        appearance: none;
        cursor: pointer;

        &:focus-visible {
          outline-offset: 2px;
          outline-color: oklch(80% 0.2 var(--hue));
        }
        
        &:active::-webkit-slider-thumb {
          transform: scale(2);
        }

        &::-webkit-slider-thumb {
          width: 16px;
          height: 16px;
          appearance: none;
          cursor: grab;
          background: oklch(80% 0.2 var(--hue));
          border: 1px solid #fff;
          border-radius: 4px;
          transition: transform 0.3s ease;
        }
      }
      #inputBackground {
        box-sizing: border-box;
        position: absolute;
        top: 0;
        left: 0;
        height: 20px;
        width: 100%;
        padding: 4px;
        background: linear-gradient(to right in oklch, oklch(0.6 0.2 0), oklch(0.6 0.2 90), oklch(0.6 0.2 180), oklch(0.6 0.2 270), oklch(0.6 0.2 360));
        transition: opacity 1s; 
      }

      .hidden {
        opacity: 0;
      }
    </style>
    <div id="dropper" tabindex="0" title="Choose color hue">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 11.25l1.5 1.5.75-.75V8.758l2.276-.61a3 3 0 10-3.675-3.675l-.61 2.277H12l-.75.75 1.5 1.5M15 11.25l-8.47 8.47c-.34.34-.8.53-1.28.53s-.94.19-1.28.53l-.97.97-.75-.75.97-.97c.34-.34.53-.8.53-1.28s.19-.94.53-1.28L12.75 9M15 11.25L12.75 9" />
      </svg>
    </div>
    <div id="inputBackground" class="hidden">
      <input type="range" min="0" max="360" step="5" value="${this.hue}" />
    </div>
  `;
  }
}

customElements.define("hue-selector", HueSelector);
