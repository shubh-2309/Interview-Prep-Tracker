import { requireAuthOrRedirect, apiGet, apiPut } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
  const session = await requireAuthOrRedirect();
  if (!session) return;
  const nameInput = document.querySelector('#fullName');
  const emailInput = document.querySelector('#email');
  if (session?.user) {
    if (nameInput) nameInput.value = session.user.name || '';
    if (emailInput) emailInput.value = session.user.email || '';
  }
  const btn = document.querySelector('.btn.btn-primary');
  if (btn) {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        await apiPut('/user/me', { name: nameInput?.value });
        alert('Profile updated');
      } catch (_) {
        alert('Update failed');
      }
    });
  }
});


