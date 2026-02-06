class ToastMessage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this._initElement();
  }

  _initElement() {
    this.classList.add('toast-message');
    this.innerHTML = `
      <div class="toast-message__container"></div>
    `;
  }

  show(message, type = 'error', duration = 5000) {
    const container = this.querySelector('.toast-message__container');

    const toastItem = document.createElement('div');
    toastItem.classList.add(
      'toast-message__item',
      `toast-message__item--${type}`
    );

    const icon = type === 'error' ? '✕' : '✓';
    toastItem.innerHTML = `
      <div class="toast-message__icon">${icon}</div>
      <div class="toast-message__content">
        <p class="toast-message__text">${message}</p>
      </div>
      <button class="toast-message__close" aria-label="Tutup notifikasi">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;

    container.appendChild(toastItem);

    setTimeout(() => {
      toastItem.classList.add('toast-message__item--visible');
    }, 10);

    const closeBtn = toastItem.querySelector('.toast-message__close');
    closeBtn.addEventListener('click', () => {
      this._removeToast(toastItem);
    });

    if (duration > 0) {
      setTimeout(() => {
        this._removeToast(toastItem);
      }, duration);
    }
  }

  _removeToast(toastItem) {
    toastItem.classList.remove('toast-message__item--visible');
    setTimeout(() => {
      toastItem.remove();
    }, 300);
  }

  showError(message, duration = 5000) {
    this.show(message, 'error', duration);
  }

  showSuccess(message, duration = 5000) {
    this.show(message, 'success', duration);
  }
}

customElements.define('toast-message', ToastMessage);
