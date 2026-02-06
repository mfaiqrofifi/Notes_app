class LoadingIndicator extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <div class="loading">
        <div class="spinner" aria-label="Loading"></div>
        <p>Loading...</p>
      </div>
    `;
  }
}

customElements.define('loading-indicator', LoadingIndicator);
