import { requireAuthOrRedirect, apiGet, apiPost } from './api.js';

function renderResources(items) {
  const container = document.querySelector('[data-resource-list]');
  if (!container) return;
  container.innerHTML = '';
  items.forEach((r) => {
    const card = document.createElement('div');
    card.className = 'card';
    const tags = (r.tags || []).join(', ');
    card.innerHTML = `
      <h3 style="margin-bottom:.25rem;">${r.title}</h3>
      <p class="mb-1"><strong>Type:</strong> ${r.type}</p>
      <p class="mb-1"><strong>Tags:</strong> ${tags}</p>
      <a class="btn btn-primary" href="${r.url}" target="_blank">Visit</a>
    `;
    container.appendChild(card);
  });
}

async function loadResources() {
  const data = await apiGet('/resources/');
  renderResources(data);
}

document.addEventListener('DOMContentLoaded', async () => {
  const session = await requireAuthOrRedirect();
  if (!session) return;
  await loadResources();

  const form = document.querySelector('[data-resource-form]');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = form.querySelector('[name="title"]').value;
      const url = form.querySelector('[name="url"]').value;
      const type = form.querySelector('[name="type"]').value;
      const tagsStr = form.querySelector('[name="tags"]').value || '';
      const tags = tagsStr.split(',').map((t) => t.trim()).filter(Boolean);
      await apiPost('/resources/', { title, url, type, tags });
      form.reset();
      await loadResources();
    });
  }
});


