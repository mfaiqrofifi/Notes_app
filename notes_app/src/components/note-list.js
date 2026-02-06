class NoteList extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  set mode(value) {
    this._mode = value;
    this.render();
  }

  set notes(value) {
    this._notes = value;
    this.render();
  }

  set selectedId(value) {
    this._selectedId = value;
    this.render();
  }

  render() {
    const notes = this._notes ?? [];
    const selectedId = this._selectedId ?? null;
    const mode = this._mode ?? 'active';

    this.innerHTML = `
      <section class="note-list">
        ${notes
          .map(
            (n) => `
              <div class="note-card ${n.id === selectedId ? 'note-card--selected' : ''} ${mode === 'archived' ? 'note-card--archived' : ''}" data-id="${n.id}">
                <button class="note-delete" type="button" aria-label="Delete note" data-delete-id="${n.id}">×</button>
                <button
                  class="note-archive"
                  type="button"
                  aria-label="Archive note"
                  data-archive-id="${n.id}"
                >
                  ${mode === 'archived' ? 'Unarchive' : 'Archive'}
                </button>

                <h3>${n.title}</h3>
                <p>${n.body}</p>
                <small class="note-date">
                  ${new Date(n.createdAt).toLocaleString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </small>
              </div>
            `
          )
          .join('')}
      </section>
    `;

    this._attachListeners();
  }

  _attachListeners() {
    this.querySelectorAll('.note-card').forEach((card) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.note-delete')) return;

        const id = card.dataset.id;
        this.dispatchEvent(
          new CustomEvent('note-selected', {
            detail: { id },
            bubbles: true,
          })
        );
      });
    });

    this.querySelectorAll('.note-delete').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();

        const id = btn.dataset.deleteId;
        this.dispatchEvent(
          new CustomEvent('note-delete', {
            detail: { id },
            bubbles: true,
          })
        );
      });
    });

    this.querySelectorAll('.note-archive').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();

        const id = btn.dataset.archiveId;
        this.dispatchEvent(
          new CustomEvent('note-archive-toggle', {
            detail: { id },
            bubbles: true,
          })
        );
      });
    });

    this.querySelectorAll('.note-archive').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();

        const id = btn.dataset.archiveId;
        this.dispatchEvent(
          new CustomEvent('note-archive', {
            detail: { id },
            bubbles: true,
          })
        );
      });
    });
  }
}

customElements.define('note-list', NoteList);
