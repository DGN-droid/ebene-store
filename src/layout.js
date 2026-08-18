export function initHeaderInteractions() {
  const header = document.querySelector('[data-site-header]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const menuButton = document.querySelector('[data-menu-toggle]');
  const setMobileMenu = (open) => { mobileMenu.classList.toggle('is-open', open); mobileMenu.setAttribute('aria-hidden', String(!open)); menuButton.setAttribute('aria-expanded', String(open)); document.body.classList.toggle('menu-open', open); };
  menuButton?.addEventListener('click', () => setMobileMenu(!mobileMenu.classList.contains('is-open')));
  document.querySelector('[data-menu-close]')?.addEventListener('click', () => setMobileMenu(false));
  mobileMenu?.addEventListener('click', (event) => { if (event.target === mobileMenu || event.target.closest('a')) setMobileMenu(false); });
  const updateScrollState = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  updateScrollState(); window.addEventListener('scroll', updateScrollState, { passive: true });
}
