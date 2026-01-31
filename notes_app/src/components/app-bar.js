// src/components/app-bar.js
class AppBar extends HTMLElement {
  static observedAttributes = ["title"];

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const title = this.getAttribute("title") ?? "Notes App";
    this.innerHTML = `
      <header class="appbar">
        <div class="appbar__title">${title}</div>
        <button class="appbar__btn" type="button" aria-label="Login">
          Login
        </button>
      </header>
    `;
  }
}

customElements.define("app-bar", AppBar);
