import { requireAuthOrRedirect, apiGet, apiPost, apiPut, apiDelete } from './api.js';

function renderList(items) {
  const container = document.querySelector('[data-dsa-list]');
  if (!container) return;
  container.innerHTML = '';
  items.forEach((it) => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <h4>${it.title} <span class="tag" style="margin-left:8px;">${it.level}</span></h4>
      <p class="mb-1">Status: <strong>${it.status}</strong></p>
      <div class="progress-bar mb-2"><div class="progress-fill" style="width:${it.status==='Completed'?100:it.status==='In progress'?50:5}%"></div></div>
      <div style="display:flex; gap:.5rem; flex-wrap:wrap;">
        <button class="btn btn-secondary" data-edit="${it._id}">Edit</button>
        <button class="btn btn-primary" data-complete="${it._id}">Mark Completed</button>
        <button class="btn btn-secondary" data-delete="${it._id}">Delete</button>
      </div>
    `;
    container.appendChild(div);
  });
}

async function loadList() {
  const list = await apiGet('/dsa/');
  renderList(list);
}

document.addEventListener('DOMContentLoaded', async () => {
  const session = await requireAuthOrRedirect();
  if (!session) return;
  await loadList();

  const form = document.querySelector('[data-dsa-form]');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = form.querySelector('[name="title"]').value;
      const level = form.querySelector('[name="level"]').value;
      const status = form.querySelector('[name="status"]').value;
      try {
        await apiPost('/dsa/', { title, level, status });
        form.reset();
        await loadList();
      } catch (err) {
        alert('Create failed');
      }
    });
  }

  document.body.addEventListener('click', async (e) => {
    const t = e.target;
    if (t.matches('[data-delete]')) {
      const id = t.getAttribute('data-delete');
      await apiDelete(`/dsa/${id}`);
      await loadList();
    }
    if (t.matches('[data-complete]')) {
      const id = t.getAttribute('data-complete');
      await apiPut(`/dsa/${id}`, { status: 'Completed' });
      await loadList();
    }
  });
});


