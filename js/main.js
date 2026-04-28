/* ============================================
   main.js - homepage logic
   ============================================ */
import { getAll, getStats, seedIfEmpty, COLORS } from './storage.js';
import { initNav, formatDate } from './nav.js';

initNav('home');
seedIfEmpty();

renderJarPapers();
renderStats();
renderRecent();

function renderJarPapers() {
  const container = document.querySelector('.jar__papers');
  if (!container) return;
  const memories = getAll().slice(0, 18);
  container.innerHTML = '';
  memories.forEach((m) => {
    const paper = document.createElement('div');
    paper.className = 'jar__paper';
    const colorMap = Object.fromEntries(COLORS.map(c => [c.id, c.value]));
    paper.style.background = colorMap[m.color] || colorMap.yellow;
    paper.style.setProperty('--r', `${(Math.random() * 8 - 4).toFixed(1)}deg`);
    paper.style.setProperty('--r2', `${(Math.random() * 8 - 4).toFixed(1)}deg`);
    container.appendChild(paper);
  });
}

function renderStats() {
  const stats = getStats();
  const totalEl = document.querySelector('[data-stat="total"]');
  const monthsEl = document.querySelector('[data-stat="months"]');
  const topEl = document.querySelector('[data-stat="top"]');

  if (totalEl) totalEl.textContent = stats.total;

  const monthCount = Object.keys(stats.byMonth).length;
  if (monthsEl) monthsEl.textContent = monthCount;

  let topMood = '—';
  let max = 0;
  Object.entries(stats.byMood).forEach(([mood, count]) => {
    if (count > max) { max = count; topMood = mood; }
  });
  if (topEl) topEl.textContent = topMood;
}

function renderRecent() {
  const container = document.querySelector('.recent-strip');
  if (!container) return;
  const recent = getAll().slice(0, 4);
  if (recent.length === 0) {
    container.innerHTML = '<p class="empty-state__text" style="grid-column:1/-1">Your jar is empty. Add your first memory →</p>';
    return;
  }
  container.innerHTML = recent.map(m => `
    <article class="memory-card memory-card--${m.color}" style="--rotate:${(Math.random() * 4 - 2).toFixed(1)}deg">
      <div class="memory-card__mood">${m.mood}</div>
      <h3 class="memory-card__title">${escapeHtml(m.title)}</h3>
      <p class="memory-card__body">${escapeHtml(m.body)}</p>
      <div class="memory-card__footer">
        <span class="memory-card__category">${m.category}</span>
        <span>${formatDate(m.date)}</span>
      </div>
    </article>
  `).join('');
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
