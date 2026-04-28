/* ============================================
   storage.js - localStorage data layer
   Acts as the lightweight client-side database
   for all memory records.
   ============================================ */

const STORAGE_KEY = 'memoryjar.memories.v1';

/**
 * Returns all memories sorted by date (newest first).
 */
export function getAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    return list.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (e) {
    console.error('storage.getAll failed', e);
    return [];
  }
}

export function getById(id) {
  return getAll().find(m => m.id === id) || null;
}

export function add(memory) {
  const list = getAll();
  const record = {
    id: crypto.randomUUID(),
    title: memory.title.trim(),
    body: memory.body.trim(),
    mood: memory.mood || '😊',
    category: memory.category || 'random',
    color: memory.color || 'yellow',
    date: memory.date || new Date().toISOString(),
    createdAt: new Date().toISOString()
  };
  list.unshift(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return record;
}

export function remove(id) {
  const list = getAll().filter(m => m.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function clearAll() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Returns a random memory or null when the jar is empty.
 */
export function pickRandom() {
  const list = getAll();
  if (list.length === 0) return null;
  const idx = Math.floor(Math.random() * list.length);
  return list[idx];
}

/**
 * Computes summary statistics for the dashboard.
 */
export function getStats() {
  const list = getAll();
  const total = list.length;
  const byCategory = {};
  const byMood = {};
  const byMonth = {};

  list.forEach(m => {
    byCategory[m.category] = (byCategory[m.category] || 0) + 1;
    byMood[m.mood] = (byMood[m.mood] || 0) + 1;
    const month = (m.date || '').slice(0, 7);
    if (month) byMonth[month] = (byMonth[month] || 0) + 1;
  });

  const firstDate = list.length ? list[list.length - 1].date : null;
  const lastDate = list.length ? list[0].date : null;

  return { total, byCategory, byMood, byMonth, firstDate, lastDate };
}

/**
 * Seeds 6 example memories the first time a visitor opens the site
 * so demo screenshots aren't empty. Real users overwrite them.
 */
export function seedIfEmpty() {
  if (getAll().length > 0) return;
  const samples = [
    { title: 'Coffee with Mom', body: 'We sat by the window for two hours and talked about everything and nothing. She laughed at my jokes for once.', mood: '🥰', category: 'family', color: 'pink', date: daysAgo(2) },
    { title: 'Finished the algorithm project', body: 'Three weeks of debugging and it finally compiled clean. I yelled in my room.', mood: '🎉', category: 'achievement', color: 'yellow', date: daysAgo(7) },
    { title: 'Rainy walk', body: 'Forgot the umbrella, did not care. The smell of wet asphalt felt like childhood.', mood: '✨', category: 'self', color: 'blue', date: daysAgo(12) },
    { title: 'Grandmas borek', body: 'She showed me her trick with the yufka. I almost cried at the table.', mood: '😍', category: 'food', color: 'orange', date: daysAgo(20) },
    { title: 'Late night with Ali', body: 'We talked about our plans for the summer until 4am. I forgot how good a real conversation feels.', mood: '💖', category: 'friends', color: 'purple', date: daysAgo(34) },
    { title: 'First time on a ferry alone', body: 'Stood at the back and watched Istanbul shrink. Felt brave for no reason.', mood: '🌟', category: 'travel', color: 'green', date: daysAgo(60) }
  ];
  samples.forEach(add);
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export const CATEGORIES = [
  { id: 'family', label: 'Family' },
  { id: 'friends', label: 'Friends' },
  { id: 'achievement', label: 'Achievement' },
  { id: 'travel', label: 'Travel' },
  { id: 'food', label: 'Food' },
  { id: 'self', label: 'Self' },
  { id: 'random', label: 'Random' }
];

export const MOODS = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '🥰', label: 'Loved' },
  { emoji: '🎉', label: 'Proud' },
  { emoji: '😍', label: 'Wow' },
  { emoji: '💖', label: 'Warm' },
  { emoji: '✨', label: 'Calm' },
  { emoji: '🌟', label: 'Brave' },
  { emoji: '☕', label: 'Cozy' }
];

export const COLORS = [
  { id: 'yellow', value: '#fff5b8' },
  { id: 'pink', value: '#ffd6db' },
  { id: 'blue', value: '#c8e0ec' },
  { id: 'green', value: '#cee3c3' },
  { id: 'purple', value: '#ddd0e8' },
  { id: 'orange', value: '#ffd4b8' }
];
