import { notes as initialNotes } from "./data/notes.js";

import "./components/app-bar.js";
import "./components/search-bar.js";
import "./components/note-form.js";
import "./components/note-list.js";
import "./components/note-detail.js";

let notes = [...initialNotes].sort(
  (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
);
let selectedId = notes[0]?.id ?? null;
let query = "";

const noteListEl = document.querySelector("note-list");
const noteDetailEl = document.querySelector("note-detail");

function render() {
  const q = query.trim().toLowerCase();

  const filtered = !q
    ? notes
    : notes.filter((n) => {
        const hay = `${n.title} ${n.body}`.toLowerCase();
        return hay.includes(q);
      });

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  noteListEl.notes = sorted;
  noteListEl.selectedId = selectedId;

  const selected = notes.find((n) => n.id === selectedId) ?? null;
  const selectedStillVisible = filtered.some((n) => n.id === selectedId);

  noteDetailEl.note = selectedStillVisible ? selected : null;
}

document.addEventListener("note-selected", (e) => {
  selectedId = e.detail.id;
  render();
});

document.addEventListener("note-added", (e) => {
  const { title, body } = e.detail;

  const newNote = {
    id: `note-${crypto.randomUUID?.() ?? Date.now()}`,
    title,
    body,
    createdAt: new Date().toISOString(),
    archived: false,
  };

  notes = [newNote, ...notes];
  selectedId = newNote.id;

  render();
});

document.addEventListener("search-changed", (e) => {
  query = e.detail.query ?? "";
  render();
});

render();
