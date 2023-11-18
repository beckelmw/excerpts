import { COLORS } from "../constants.js";

class ColorMode extends HTMLElement {
  /** @type {'light' | 'dark' | null} */
  _colorMode = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.toggleColorMode = this.toggleColorMode.bind(this);

    const colorMode = window.localStorage.getItem("color-mode");
    const hasStoredColorMode = typeof colorMode === "string";
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const hasMediaQueryPreference = typeof mql.matches === "boolean";

    // If the viewer has a stored color mode then use that
    if (hasStoredColorMode) {
      this.colorMode = colorMode === "dark" ? "dark" : "light";
    } else if (hasMediaQueryPreference) {
      // Otherwise check if there is a media query preference
      const mediaMatch = mql.matches ? "dark" : "light";
      this.colorMode = mediaMatch;
    }

    this.render();
  }

  connectedCallback() {
    if (this.shadowRoot) {
      this.shadowRoot.addEventListener("click", this.toggleColorMode);
    }
  }

  disconnectedCallback() {
    if (this.shadowRoot) {
      this.shadowRoot.removeEventListener("click", this.toggleColorMode);
    }
  }

  render() {
    if (!this.shadowRoot) {
      return;
    }

    /** @type {HTMLLinkElement | null} */
    const codeTheme = document.querySelector("#code-theme");
    if (codeTheme?.href) {
      if (this.colorMode === "dark") {
        codeTheme.href = codeTheme.href.replace(
          "github-dark.min",
          "github.min"
        );
      } else {
        codeTheme.href = codeTheme.href.replace(
          "github.min",
          "github-dark.min"
        );
      }
    }

    const icon = this.colorMode === "light" ? this.sun : this.moon;
    const oppositeMode = this.colorMode === "light" ? "dark" : "light";
    this.shadowRoot.innerHTML = `<style>
      svg { 
        width: 24px; 
        height: 24px;
        padding: 10px;
        cursor: pointer;
      } 
      div {
        display:flex;
      }
    </style>
    <div title="Activate ${oppositeMode} theme">${icon}</div>`;
  }

  toggleColorMode() {
    const newMode = this.colorMode === "light" ? "dark" : "light";
    window.localStorage.setItem("color-mode", newMode);
    this.colorMode = newMode;
    this.render();
  }

  get colorMode() {
    return this._colorMode;
  }

  /** @param {'light' | 'dark' | null} mode */
  set colorMode(mode) {
    this._colorMode = mode;

    if (!mode) {
      return;
    }

    const root = window.document.documentElement;

    Object.entries(COLORS).forEach(([name, colorByTheme]) => {
      const cssVarName = `--color-${name}`;
      root.style.setProperty(cssVarName, colorByTheme[mode]);
    });
  }

  get moon() {
    // https://heroicons.com/ MIT
    return `<svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="w-6 h-6"
      >
        <path
          fill-rule="evenodd"
          d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
          clip-rule="evenodd"
        />
      </svg>`;
  }

  get sun() {
    // https://heroicons.com/ MIT
    return `<svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="w-6 h-6"
    >
      <path
        d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"
      />
    </svg> `;
  }
}

customElements.define("color-mode", ColorMode);
