class NoteDetail extends HTMLElement {
  set note(value) {
    this._note = value;
    this.render();
  }

  render() {
    const note = this._note;

    if (!note) {
      this.innerHTML = `
        <section class="card">
          <h2 class="card__title">Details</h2>
          <p class="muted">Pilih catatan untuk melihat detail.</p>
        </section>
      `;
      return;
    }

    this.innerHTML = `
      <section class="card">
        <h2 class="card__title">Details</h2>

        <p class="muted">Title</p>
        <p><b>${note.title}</b></p>

        <br />

        <p class="muted">Description</p>
        <p>${note.body}</p>
      </section>
    `;
  }
}

customElements.define("note-detail", NoteDetail);
