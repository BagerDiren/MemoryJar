/* ============================================
   wall.js - "Memory Wall" listing page
   Search, category filter, and stats chart.
   ============================================ */
import { getAll, getStats, remove, CATEGORIES } from './storage.js';
import { initNav, showToast, formatDate } from './nav.js';

initNav('wall');

const grid = document.getElementById('wall-grid');
const searchInput = document.getElementById('search');
const categoryChips = document.getElementById('category-chips');
const statsContainer = document.getElementById('stats-container');
const chartContainer = document.getElementById('chart-container');

let activeCategory = 'all';
let searchTerm = '';

renderChips();
render();

searchInput.addEventListener('input', (e) => {
  searchTerm = e.target.value.toLowerCase();
  render();
});

function renderChips() {
  const all = [{ id: 'all', label: 'All' }, ...CATEGORIES];
  categoryChips.innerHTML = all.map(c => `
    <button class="chip ${c.id === activeCategory ? 'chip--active' : ''}" data-cat="${c.id}">${c.label}</button>
  `).join('');

  categoryChips.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      activeCategory = chip.dataset.cat;
      renderChips();
      render();
    });
  });
}

function render() {
  const all = getAll();
  const filtered = all.filter(m => {
    const matchesCat = activeCategory === 'all' || m.category === activeCategory;
    const matchesSearch = !searchTerm
      || m.title.toLowerCase().includes(searchTerm)
      || m.body.toLowerCase().includes(searchTerm);
    return matchesCat && matchesSearch;
  });

  if (all.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-state__icon">🫙</div>
        <p class="empty-state__text">No memories yet — your jar is waiting.</p>
        <a class="btn btn--primary" href="add.html">Add the first one</a>
      </div>`;
  } else if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-state__icon">🔍</div>
        <p class="empty-state__text">No memories match that filter.</p>
      </div>`;
  } else {
    grid.innerHTML = filtered.map(m => `
      <article class="memory-card memory-card--${m.color}" data-id="${m.id}" style="--rotate:${(Math.random()*4-2).toFixed(1)}deg">
        <div class="memory-card__mood">${m.mood}</div>
        <h3 class="memory-card__title">${escapeHtml(m.title)}</h3>
        <p class="memory-card__body">${escapeHtml(m.body)}</p>
        <div class="memory-card__footer">
          <span class="memory-card__category">${m.category}</span>
          <span>${formatDate(m.date)}</span>
        </div>
        <button class="btn btn--ghost" data-delete="${m.id}" style="margin-top:0.75rem; padding:0.4rem 0.8rem; font-size:0.8rem;">Remove</button>
      </article>
    `).join('');

    grid.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = e.currentTarget.dataset.delete;
        if (confirm('Remove this memory from the jar forever?')) {
          remove(id);
          showToast('Memory removed.');
          render();
          renderStatsAndChart();
        }
      });
    });
  }

  renderStatsAndChart();
}

function renderStatsAndChart() {
  const stats = getStats();
  statsContainer.innerHTML = `
    <div class="stat"><span class="stat__value">${stats.total}</span><span class="stat__label">Total memories</span></div>
    <div class="stat"><span class="stat__value">${Object.keys(stats.byMonth).length}</span><span class="stat__label">Active months</span></div>
    <div class="stat"><span class="stat__value">${Object.keys(stats.byCategory).length}</span><span class="stat__label">Categories used</span></div>
    <div class="stat"><span class="stat__value">${formatRange(stats.firstDate, stats.lastDate)}</span><span class="stat__label">Range</span></div>
  `;

  const entries = Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) {
    chartContainer.innerHTML = '<p class="form-help">Add memories to see your category breakdown.</p>';
    return;
  }
  const max = Math.max(...entries.map(e => e[1]));
  chartContainer.innerHTML = `
    <div class="bar-chart">
      ${entries.map(([cat, count]) => `
        <div class="bar-row">
          <div class="bar-label">${cat}</div>
          <div class="bar-track">
            <div class="bar-fill" style="width:${(count / max) * 100}%"></div>
          </div>
          <div class="bar-value">${count}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function formatRange(first, last) {
  if (!first || !last) return '—';
  const f = new Date(first);
  const l = new Date(last);
  const days = Math.round((l - f) / (1000 * 60 * 60 * 24));
  if (days <= 0) return 'today';
  return `${days}d`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
