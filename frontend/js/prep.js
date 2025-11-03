// Simple personal notes for HR/Tech prep stored locally (per-browser)
import { requireAuthOrRedirect } from './api.js';

function renderNotes() {
  const key = 'ipt_prep_notes_v1';
  const notes = JSON.parse(localStorage.getItem(key) || '[]');
  const container = document.querySelector('#prepNotes');
  if (!container) return;
  container.innerHTML = '';
  notes.forEach((n, i) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<h4>${n.title}</h4><p>${n.content}</p><button class="btn btn-secondary" data-del="${i}">Delete</button>`;
    container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await requireAuthOrRedirect();
  renderNotes();
  const form = document.querySelector('#prepNotesForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const key = 'ipt_prep_notes_v1';
      const notes = JSON.parse(localStorage.getItem(key) || '[]');
      const title = form.querySelector('[name="title"]').value;
      const content = form.querySelector('[name="content"]').value;
      notes.push({ title, content });
      localStorage.setItem(key, JSON.stringify(notes));
      form.reset();
      renderNotes();
    });
  }

  document.body.addEventListener('click', (e) => {
    const t = e.target;
    if (t.matches('[data-del]')) {
      const idx = Number(t.getAttribute('data-del'));
      const key = 'ipt_prep_notes_v1';
      const notes = JSON.parse(localStorage.getItem(key) || '[]');
      notes.splice(idx, 1);
      localStorage.setItem(key, JSON.stringify(notes));
      renderNotes();
    }
  });
});


