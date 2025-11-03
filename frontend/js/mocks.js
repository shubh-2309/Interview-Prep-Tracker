import { requireAuthOrRedirect, apiGet, apiPost } from './api.js';

function renderTable(items) {
  const tbody = document.querySelector('[data-mock-tbody]');
  if (!tbody) return;
  tbody.innerHTML = '';
  items.forEach((m) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${new Date(m.date).toLocaleDateString()}</td>
      <td>${m.role || ''}</td>
      <td>${m.rating}/5</td>
      <td>${m.notes || ''}</td>
    `;
    tbody.appendChild(tr);
  });
  drawRatings(items);
}

function drawRatings(items) {
  const canvas = document.querySelector('#ratingsChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const w = canvas.width;
  const h = canvas.height;
  const barW = Math.max(8, Math.floor(w / Math.max(1, items.length * 1.5)));
  items.slice(-20).forEach((m, i) => {
    const x = 10 + i * (barW + 6);
    const barH = (m.rating / 5) * (h - 20);
    ctx.fillStyle = '#3A86FF';
    ctx.fillRect(x, h - barH - 10, barW, barH);
  });
}

async function loadMocks() {
  const data = await apiGet('/mocks/');
  renderTable(data);
}

document.addEventListener('DOMContentLoaded', async () => {
  const session = await requireAuthOrRedirect();
  if (!session) return;
  await loadMocks();

  const form = document.querySelector('[data-mock-form]');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const date = form.querySelector('[name="date"]').value;
      const role = form.querySelector('[name="role"]').value;
      const rating = Number(form.querySelector('[name="rating"]').value || 3);
      const notes = form.querySelector('[name="notes"]').value;
      await apiPost('/mocks/', { date, role, rating, notes });
      form.reset();
      await loadMocks();
    });
  }
});


