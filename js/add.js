/* ============================================
   add.js - "Add Memory" form page
   ============================================ */
import { add, MOODS, CATEGORIES, COLORS } from './storage.js';
import { initNav, showToast } from './nav.js';

initNav('add');

const form = document.getElementById('memory-form');
const moodPicker = document.getElementById('mood-picker');
const colorPicker = document.getElementById('color-picker');
const categorySelect = document.getElementById('category');
const dateInput = document.getElementById('date');

let selectedMood = '😊';
let selectedColor = 'yellow';

renderMoodPicker();
renderColorPicker();
renderCategoryOptions();
setDefaultDate();

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = document.getElementById('title').value.trim();
  const body = document.getElementById('body').value.trim();

  if (!title || !body) {
    showToast('Please fill in both title and memory.');
    return;
  }

  add({
    title,
    body,
    mood: selectedMood,
    category: categorySelect.value,
    color: selectedColor,
    date: new Date(dateInput.value || Date.now()).toISOString()
  });

  showToast('Dropped into the jar ✨');
  form.reset();
  setDefaultDate();
  selectedMood = '😊';
  selectedColor = 'yellow';
  renderMoodPicker();
  renderColorPicker();

  setTimeout(() => { window.location.href = 'jar.html'; }, 900);
});

function renderMoodPicker() {
  moodPicker.innerHTML = MOODS.map(m => `
    <button type="button" class="mood-option ${m.emoji === selectedMood ? 'mood-option--selected' : ''}" data-mood="${m.emoji}">
      ${m.emoji}
      <span class="mood-option__label">${m.label}</span>
    </button>
  `).join('');

  moodPicker.querySelectorAll('.mood-option').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedMood = btn.dataset.mood;
      renderMoodPicker();
    });
  });
}

function renderColorPicker() {
  colorPicker.innerHTML = COLORS.map(c => `
    <button type="button" class="color-option ${c.id === selectedColor ? 'color-option--selected' : ''}"
      data-color="${c.id}" style="background:${c.value}" aria-label="Pick ${c.id}"></button>
  `).join('');

  colorPicker.querySelectorAll('.color-option').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedColor = btn.dataset.color;
      renderColorPicker();
    });
  });
}

function renderCategoryOptions() {
  categorySelect.innerHTML = CATEGORIES
    .map(c => `<option value="${c.id}">${c.label}</option>`)
    .join('');
}

function setDefaultDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  dateInput.value = `${yyyy}-${mm}-${dd}`;
}
