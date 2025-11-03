// API wrapper using fetch with credentials included for httpOnly cookie
// If served from a static server (e.g., http://localhost:5500), target backend at 5000
const API_BASE = (typeof window !== 'undefined' && window.location.origin.includes(':5500'))
  ? 'http://localhost:5000/api'
  : '/api';

function getHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  // Optional: fallback token for environments where cookies are blocked
  const token = localStorage.getItem('ipt_token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`, { method: 'GET', credentials: 'include', headers: getHeaders() });
  if (!res.ok) throw await res.json().catch(() => new Error('Request failed'));
  return res.json();
}

export async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, { method: 'POST', credentials: 'include', headers: getHeaders(), body: JSON.stringify(body) });
  if (!res.ok) throw await res.json().catch(() => new Error('Request failed'));
  return res.json();
}

export async function apiPut(path, body) {
  const res = await fetch(`${API_BASE}${path}`, { method: 'PUT', credentials: 'include', headers: getHeaders(), body: JSON.stringify(body) });
  if (!res.ok) throw await res.json().catch(() => new Error('Request failed'));
  return res.json();
}

export async function apiDelete(path) {
  const res = await fetch(`${API_BASE}${path}`, { method: 'DELETE', credentials: 'include', headers: getHeaders() });
  if (!res.ok) throw await res.json().catch(() => new Error('Request failed'));
  return res.json();
}

export async function requireAuthOrRedirect() {
  try {
    return await apiGet('/user/me');
  } catch (e) {
    window.location.href = '/login.html';
    return null;
  }
}


