// src/main.js
import { notes as initialNotes } from "./data/notes.js";

import "./components/app-bar.js";
import "./components/search-bar.js";
import "./components/note-form.js";
import "./components/note-list.js";
import "./components/note-detail.js";

let notes = [...initialNotes];
let selectedId = notes[0]?.id ?? null;
let query = ""; // ✅ state search

const noteListEl = document.querySelector("note-list");
const noteDetailEl = document.querySelector("note-detail");

function render() {
  const q = query.trim().toLowerCase();

  // ✅ filter list berdasarkan title + body
  const filtered = !q
    ? notes
    : notes.filter((n) => {
        const hay = `${n.title} ${n.body}`.toLowerCase();
        return hay.includes(q);
      });

  noteListEl.notes = filtered;
  noteListEl.selectedId = selectedId;

  // ✅ detail: kosongkan kalau selected note sedang tidak muncul di hasil filter
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
  };

  notes = [newNote, ...notes];
  selectedId = newNote.id;

  // ✅ optional: reset search biar note baru kelihatan
  // query = "";

  render();
});

// ✅ listener search
document.addEventListener("search-changed", (e) => {
  query = e.detail.query ?? "";
  render();
});

render();