import './styles/style.css';

import './components/app-bar.js';
import './components/search-bar.js';
import './components/note-form.js';
import './components/note-list.js';
import './components/note-detail.js';
import './components/loading-indicator.js';
import './components/toast-message.js';

import {
  getNotes,
  deleteNote,
  createNote,
  archiveNote,
  unarchiveNote,
  getArchivedNotes,
} from './data/notes-api.mjs';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector('#app');

  app.innerHTML = `
    <toast-message></toast-message>

    <app-bar title="Notes App"></app-bar>

    <section class="top">
      <search-bar placeholder="Search notes..."></search-bar>
    </section>

    <main class="layout">
      <note-form></note-form>

      <section class="notes-panel">
        <div class="tabs">
          <button class="tab tab--active" data-mode="active">Active</button>
          <button class="tab" data-mode="archived">Archived</button>
        </div>

        <section id="notesSection">
          <loading-indicator></loading-indicator>
        </section>
      </section>

      <note-detail></note-detail>
    </main>
  `;

  const notesSection = app.querySelector('#notesSection');
  const noteDetailEl = app.querySelector('note-detail');
  const noteFormEl = app.querySelector('note-form');
  const searchBarEl = app.querySelector('search-bar');
  const tabButtons = app.querySelectorAll('.tab');
  const toastEl = app.querySelector('toast-message');

  const setActiveTab = (mode) => {
    tabButtons.forEach((b) => b.classList.remove('tab--active'));
    const active = app.querySelector(`.tab[data-mode="${mode}"]`);
    if (active) active.classList.add('tab--active');
  };

  let notesState = [];
  let archivedState = [];
  let searchQuery = '';
  let currentMode = 'active';

  const showLoading = () => {
    notesSection.innerHTML = `<loading-indicator></loading-indicator>`;
  };

  const renderNotes = (notes) => {
    if (currentMode === 'active') {
      notesState = notes;
    } else {
      archivedState = notes;
    }

    const sorted = [...notes].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    let filtered = sorted;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      filtered = sorted.filter((n) => {
        const hay = `${n.title} ${n.body}`.toLowerCase();
        return hay.includes(q);
      });
    }

    notesSection.innerHTML = `<note-list></note-list>`;
    const noteListEl = notesSection.querySelector('note-list');

    noteListEl.mode = currentMode;
    noteListEl.notes = filtered;

    const displayNotes = currentMode === 'active' ? notesState : archivedState;
    if (displayNotes.length > 0) {
      noteListEl.selectedId = displayNotes[0].id;
      noteDetailEl.mode = currentMode;
      noteDetailEl.note = displayNotes[0];
    } else {
      noteDetailEl.note = null;
    }

    const handleSelect = (e) => {
      const id = e.detail.id;
      noteListEl.selectedId = id;

      const displayNotes =
        currentMode === 'active' ? notesState : archivedState;
      const found = displayNotes.find((n) => n.id === id);
      noteDetailEl.mode = currentMode;
      noteDetailEl.note = found;
    };

    const handleDelete = async (e) => {
      const id = e.detail.id;

      const ok = confirm('Hapus catatan ini?');
      if (!ok) return;

      try {
        showLoading();
        await deleteNote(id);

        const updated =
          currentMode === 'active'
            ? await getNotes()
            : await getArchivedNotes();
        renderNotes(updated);
      } catch (err) {
        toastEl.showError(`Gagal menghapus catatan: ${err.message}`);
        const displayNotes =
          currentMode === 'active' ? notesState : archivedState;
        renderNotes(displayNotes);
      }
    };

    const handleArchive = async (e) => {
      const id = e.detail.id;
      const isArchived = currentMode === 'archived';

      try {
        showLoading();
        if (isArchived) {
          await unarchiveNote(id);
        } else {
          await archiveNote(id);
        }

        const updated =
          currentMode === 'active'
            ? await getNotes()
            : await getArchivedNotes();
        renderNotes(updated);
      } catch (err) {
        toastEl.showError(`Gagal mengarsipkan catatan: ${err.message}`);
        const displayNotes =
          currentMode === 'active' ? notesState : archivedState;
        renderNotes(displayNotes);
      }
    };

    noteListEl.addEventListener('note-selected', handleSelect);
    noteListEl.addEventListener('note-delete', handleDelete);
    noteListEl.addEventListener('note-archive', handleArchive);
  };

  noteFormEl.addEventListener('note-added', async (e) => {
    const { title, body } = e.detail;

    try {
      showLoading();
      await createNote({ title, body });

      if (currentMode !== 'active') {
        currentMode = 'active';
        setActiveTab('active');
      }

      const updated = await getNotes();
      renderNotes(updated);
      toastEl.showSuccess('Catatan berhasil ditambahkan');
    } catch (err) {
      toastEl.showError(`Gagal menambahkan catatan: ${err.message}`);
      renderNotes(notesState);
    }
  });

  searchBarEl.addEventListener('search-changed', (e) => {
    searchQuery = e.detail.query ?? '';
    renderNotes(currentMode === 'active' ? notesState : archivedState);
  });

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const mode = btn.dataset.mode;
      currentMode = mode;

      setActiveTab(mode);

      try {
        showLoading();
        const notes =
          mode === 'active' ? await getNotes() : await getArchivedNotes();
        renderNotes(notes);
      } catch (err) {
        toastEl.showError(`Gagal memuat catatan: ${err.message}`);
      }
    });
  });

  const loadNotes = async () => {
    try {
      showLoading();
      const notes = await getNotes();
      renderNotes(notes);
    } catch (err) {
      toastEl.showError(`Gagal memuat catatan: ${err.message}`);
      notesSection.innerHTML = `
        <div class="loading">
          <p>Gagal memuat data. Coba refresh.</p>
        </div>
      `;
    }
  };

  loadNotes();
});
