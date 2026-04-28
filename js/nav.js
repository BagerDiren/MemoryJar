/* ============================================
   nav.js - shared navigation behaviours
   ============================================ */

export function initNav(activePage) {
  const links = document.querySelectorAll('.nav__link');
  links.forEach(link => {
    if (link.dataset.page === activePage) {
      link.classList.add('nav__link--active');
    }
  });

  const toggle = document.querySelector('.nav__toggle');
  const list = document.querySelector('.nav__links');
  if (toggle && list) {
    toggle.addEventListener('click', () => {
      list.classList.toggle('nav__links--open');
    });
  }
}

export function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('toast--show');
  setTimeout(() => toast.classList.remove('toast--show'), 2400);
}

export function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}
