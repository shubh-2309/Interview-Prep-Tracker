import { apiPost, apiGet } from './api.js';

// Attach to login/register forms if present
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('form[action="/login"]') || document.querySelector('#loginForm') || document.querySelector('form');
  const registerForm = document.querySelector('#registerForm');
  const logoutBtn = document.querySelector('[data-action="logout"]');

  if (loginForm && (window.location.pathname.includes('login') || window.location.href.includes('login'))) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = loginForm.querySelector('input[name="email"]').value;
      const password = loginForm.querySelector('input[name="password"]').value;
      try {
        const user = await apiPost('/auth/login', { email, password });
        // optionally store bearer fallback
        if (user && user.id) localStorage.setItem('ipt_token', '');
        window.location.href = '/dashboard.html';
      } catch (err) {
        alert((err && err.error) || 'Login failed');
      }
    });
  }

  if (registerForm && (window.location.pathname.includes('register') || window.location.href.includes('register'))) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = registerForm.querySelector('input[name="fullName"]').value;
      const email = registerForm.querySelector('input[name="email"]').value;
      const password = registerForm.querySelector('input[name="password"]').value;
      try {
        await apiPost('/auth/register', { name, email, password });
        window.location.href = '/dashboard.html';
      } catch (err) {
        alert((err && (err.error || err.errors?.[0]?.msg)) || 'Registration failed');
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        await apiPost('/auth/logout', {});
        localStorage.removeItem('ipt_token');
        window.location.href = '/login.html';
      } catch (_) {
        window.location.href = '/login.html';
      }
    });
  }
});

export async function getCurrentUser() {
  try {
    const me = await apiGet('/user/me');
    return me;
  } catch (e) {
    return null;
  }
}


