export class HueDemo extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    if (!this.shadowRoot) {
      return;
    }

    const supportsOKLCH = CSS.supports("color", "oklch(0 0 150)");

    const demo = supportsOKLCH
      ? `<input type="range" min="0" max="360" step="5" /><div>oklch(0.5 0.37&nbsp;<span id="hue">150</span>)</div>`
      : '<div>Your browser&nbsp;<a href="https://caniuse.com/mdn-css_types_color_oklch">does not support OKLCH</a></div>';

    this.shadowRoot.innerHTML = `
      <style>
        div {
          color: #fff;
          display:flex;
          justify-content: center;
          align-items: center;
          width:100%;
          max-width: 400px;
          aspect-ratio: 16/9;
          background-color: green;
        }

        @supports(color: oklch(0 0 150)) {
          div {
            background-color: oklch(0.5 0.37 var(--demo-hue, 150));
          }
        }

        #hue {
          font-size: larger;
          font-weight: bold;
        }
      </style>
      ${demo}`;

    this.shadowRoot
      .querySelector('input[type="range"]')
      ?.addEventListener("input", (ev) => {
        this.shadowRoot?.querySelector("div")?.style.setProperty(
          "--demo-hue",
          // @ts-ignore
          ev.target.value
        );
        // @ts-ignore
        this.shadowRoot.querySelector("#hue").innerText = ev.target.value;
      });
  }
}

customElements.define("hue-demo", HueDemo);
