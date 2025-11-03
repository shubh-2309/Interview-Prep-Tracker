import { requireAuthOrRedirect, apiGet } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
  const session = await requireAuthOrRedirect();
  if (!session) return;
  try {
    const metrics = await apiGet('/analytics/progress');
    const dsaEl = document.querySelector('[data-metric="dsaProgress"]');
    const ratingEl = document.querySelector('[data-metric="avgRating"]');
    const companiesEl = document.querySelector('[data-metric="companiesApplied"]');
    if (dsaEl) {
      dsaEl.textContent = `${metrics.dsaProgressPct}%`;
      const fill = document.querySelector('[data-metric="dsaProgressFill"]');
      if (fill) fill.style.width = `${metrics.dsaProgressPct}%`;
    }
    if (ratingEl) ratingEl.textContent = metrics.avgRating?.toString();
    if (companiesEl) companiesEl.textContent = metrics.companiesApplied?.toString();
  } catch (e) {
    // noop
  }
});


