class NoteList extends HTMLElement {
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

    this.innerHTML = `
      <section class="note-list">
        ${notes
          .map(
            (n) => `
            <div class="note-card ${n.id === selectedId ? "note-card--selected" : ""}" data-id="${n.id}">
              <h3>${n.title}</h3>
              <p>${n.body}</p>
            </div>
          `,
          )
          .join("")}
      </section>
    `;

    this.querySelectorAll(".note-card").forEach((el) => {
      el.addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("note-selected", {
            detail: { id: el.dataset.id },
            bubbles: true,
          }),
        );
      });
    });
  }
}

customElements.define("note-list", NoteList);
