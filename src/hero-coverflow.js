import { renderIcons } from './icons.js';

const productsUrl = new URL('./data/products.json', import.meta.url);
const currency = (value) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);

async function initHeroCoverflow() {
  const coverflow = document.querySelector('[data-hero-coverflow]');
  if (!coverflow) return;
  const track = coverflow.querySelector('[data-coverflow-track]');
  const products = await fetch(productsUrl).then((response) => response.json());
  const selected = products.filter((product) => product.featured).slice(0, 5);
  const items = (selected.length ? selected : products.slice(0, 5));
  if (!items.length) return;

  track.innerHTML = items.map((product) => `<article class="coverflow-card"><div class="coverflow-card__image"><img src="${product.image}" alt="" onerror="this.hidden=true"></div><div class="coverflow-card__body"><p class="coverflow-card__category">${product.category}</p><h2>${product.name}</h2><p>${product.category} · <strong>${currency(product.price)}</strong></p></div></article>`).join('');
  const cards = [...track.children]; let active = 0; let timer; let hovering = false;
  const isMobile = () => matchMedia('(max-width: 767px)').matches;
  const update = () => { cards.forEach((card, index) => { const offset = (index - active + cards.length) % cards.length; const position = offset === 0 ? 'is-active' : offset <= Math.floor(cards.length / 2) ? 'is-right' : 'is-left'; card.className = `coverflow-card ${position}`; }); };
  const schedule = (delay = 4600) => { clearTimeout(timer); if (!hovering && !isMobile()) timer = setTimeout(() => { active = (active + 1) % cards.length; update(); schedule(); }, delay); };
  const move = (direction) => { active = (active + direction + cards.length) % cards.length; update(); schedule(3500); };
  coverflow.querySelector('[data-coverflow-prev]').addEventListener('click', () => move(-1));
  coverflow.querySelector('[data-coverflow-next]').addEventListener('click', () => move(1));
  coverflow.addEventListener('mouseenter', () => { hovering = true; clearTimeout(timer); });
  coverflow.addEventListener('mouseleave', () => { hovering = false; schedule(2200); });
  matchMedia('(max-width: 767px)').addEventListener('change', () => { update(); schedule(2200); });
  update(); schedule(); renderIcons();
}

document.addEventListener('DOMContentLoaded', () => initHeroCoverflow().catch(console.error));
