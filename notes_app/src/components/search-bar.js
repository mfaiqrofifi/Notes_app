class SearchBar extends HTMLElement {
  connectedCallback() {
    const placeholder = this.getAttribute('placeholder') ?? 'Search...';
    this.innerHTML = `
      <div class="search">
        <input class="search__input" type="search" placeholder="${placeholder}" />
      </div>
    `;

    const input = this.querySelector('.search__input');
    input.addEventListener('input', () => {
      this.dispatchEvent(
        new CustomEvent('search-changed', {
          detail: { query: input.value },
          bubbles: true,
        })
      );
    });
  }
}

customElements.define('search-bar', SearchBar);
