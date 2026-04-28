/* ============================================
   jar.js - interactive jar page (shake & open)
   ============================================ */
import { getAll, pickRandom, remove, COLORS } from './storage.js';
import { initNav, showToast, formatDate } from './nav.js';

initNav('jar');

const jar = document.getElementById('big-jar');
const papersGrid = document.getElementById('papers-grid');
const emptyState = document.getElementById('empty-state');
const shakeBtn = document.getElementById('shake-btn');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');

const colorMap = Object.fromEntries(COLORS.map(c => [c.id, c.value]));

renderPapers();

shakeBtn.addEventListener('click', () => {
  const memory = pickRandom();
  if (!memory) {
    showToast('Jar is empty — add a memory first!');
    return;
  }
  jar.classList.add('shaking');
  setTimeout(() => {
    jar.classList.remove('shaking');
    openMemory(memory);
  }, 600);
});

if (jar) {
  jar.addEventListener('click', (e) => {
    const paper = e.target.closest('.jar-paper-mini');
    if (!paper) return;
    const id = paper.dataset.id;
    const memory = getAll().find(m => m.id === id);
    if (memory) openMemory(memory);
  });
}

modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
  if (e.target.matches('[data-close]')) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

function renderPapers() {
  const list = getAll();
  if (list.length === 0) {
    papersGrid.innerHTML = '';
    emptyState.style.display = 'flex';
    return;
  }
  emptyState.style.display = 'none';
  papersGrid.innerHTML = list.map(m => `
    <div class="jar-paper-mini"
      data-id="${m.id}"
      style="background:${colorMap[m.color] || colorMap.yellow}; animation-delay:-${(Math.random() * 4).toFixed(2)}s; --r:${(Math.random()*8-4).toFixed(1)}deg; --r2:${(Math.random()*8-4).toFixed(1)}deg;"
      title="${escapeAttr(m.title)}"></div>
  `).join('');
}

function openMemory(memory) {
  modalContent.className = `modal modal--${memory.color}`;
  modalContent.innerHTML = `
    <button class="modal__close" data-close aria-label="Close">×</button>
    <div class="modal__mood">${memory.mood}</div>
    <h2 class="modal__title">${escapeHtml(memory.title)}</h2>
    <div class="modal__date">${formatDate(memory.date)}</div>
    <div class="modal__body">${escapeHtml(memory.body)}</div>
    <div class="modal__footer">
      <span class="modal__meta">${memory.category}</span>
      <button class="btn btn--ghost" data-delete="${memory.id}">Delete</button>
    </div>
  `;

  modalContent.querySelector('[data-delete]').addEventListener('click', (e) => {
    const id = e.currentTarget.dataset.delete;
    if (confirm('Remove this memory from the jar forever?')) {
      remove(id);
      closeModal();
      renderPapers();
      showToast('Memory removed.');
    }
  });

  modal.classList.add('modal-backdrop--open');
}

function closeModal() {
  modal.classList.remove('modal-backdrop--open');
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function escapeAttr(s) {
  return escapeHtml(s);
}
