// src/components/note-form.js
class NoteForm extends HTMLElement {
  connectedCallback() {
    this.render();
    this._wire();
    this._validate(); // set initial state
  }

  render() {
    this.innerHTML = `
      <section class="card">
        <h2 class="card__title">Add Note</h2>

        <form class="form" novalidate>
          <div>
            <input class="input" name="title" placeholder="Write your title here..." />
            <p class="error" data-error="title" hidden>Title minimal 3 karakter.</p>
          </div>

          <div>
            <textarea class="textarea" name="body" placeholder="Write your note here..."></textarea>
            <p class="error" data-error="body" hidden>Body minimal 10 karakter.</p>
          </div>

          <button class="btn" type="submit" disabled>+ Add</button>
        </form>
      </section>
    `;
  }

  _wire() {
    this._form = this.querySelector("form");
    this._title = this.querySelector('input[name="title"]');
    this._body = this.querySelector('textarea[name="body"]');
    this._btn = this.querySelector('button[type="submit"]');
    this._errTitle = this.querySelector('[data-error="title"]');
    this._errBody = this.querySelector('[data-error="body"]');

    // realtime validation
    this._title.addEventListener("input", () => this._validate());
    this._body.addEventListener("input", () => this._validate());

    // submit
    this._form.addEventListener("submit", (e) => {
      e.preventDefault();
      const valid = this._validate();
      if (!valid) return;

      const title = this._title.value.trim();
      const body = this._body.value.trim();

      this.dispatchEvent(
        new CustomEvent("note-added", {
          detail: { title, body },
          bubbles: true,
        })
      );

      // reset form
      this._form.reset();
      this._validate();
    });
  }

  _validate() {
    const title = this._title?.value.trim() ?? "";
    const body = this._body?.value.trim() ?? "";

    const titleOk = title.length >= 3;
    const bodyOk = body.length >= 10;

    if (this._errTitle) this._errTitle.hidden = titleOk || title.length === 0;
    if (this._errBody) this._errBody.hidden = bodyOk || body.length === 0;

    const ok = titleOk && bodyOk;
    if (this._btn) this._btn.disabled = !ok;

    return ok;
  }
}

customElements.define("note-form", NoteForm);
