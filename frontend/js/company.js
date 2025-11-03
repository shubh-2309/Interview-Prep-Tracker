import { requireAuthOrRedirect, apiGet, apiPost, apiPut } from './api.js';

function renderCompanies(items) {
  const container = document.querySelector('[data-company-list]');
  if (!container) return;
  container.innerHTML = '';
  items.forEach((c) => {
    const card = document.createElement('div');
    card.className = 'company-card';
    const rounds = (c.rounds || []).map((r) => `${r.name}: ${r.status}`).join(' • ');
    card.innerHTML = `<h3>${c.companyName}</h3><p class="mb-1">${c.role || ''}</p><p>${rounds}</p>`;
    container.appendChild(card);
  });
}

async function loadCompanies() {
  const data = await apiGet('/companies/');
  renderCompanies(data);
}

document.addEventListener('DOMContentLoaded', async () => {
  const session = await requireAuthOrRedirect();
  if (!session) return;
  await loadCompanies();

  const form = document.querySelector('[data-company-form]');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const companyName = form.querySelector('[name="companyName"]').value;
      const role = form.querySelector('[name="role"]').value;
      await apiPost('/companies/', { companyName, role, rounds: [] });
      form.reset();
      await loadCompanies();
    });
  }
});


