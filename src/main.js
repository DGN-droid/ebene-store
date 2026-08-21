import { initTheme, getThemeChoice, setTheme } from './theme.js';
import { setLanguage } from './i18n.js';
import { changeQuantity, getCart, removeFromCart, updateCartCount } from './cart.js';
import { initSearch } from './search.js';
import { initCarousels } from './carousel.js';
import { initHeaderInteractions } from './layout.js';
import { loadPartial } from './partials.js';
import { renderIcons } from './icons.js';

const productsUrl = new URL('./data/products.json', import.meta.url);
const loadProducts = () => fetch(productsUrl).then((response) => response.json());
const currency = (value) => new Intl.NumberFormat(document.documentElement.lang || 'fr', { style: 'currency', currency: 'EUR' }).format(value);
const card = (product) => `<article class="product-card" data-product-card data-origin="${product.origin}"><a class="product-card__image" href="produit.html?id=${product.id}"><img src="${product.image}" alt="${product.name}" loading="lazy" decoding="async" width="480" height="600"></a><div class="product-card__body"><p>${product.category}</p><h3>${product.name}</h3><p class="price">${currency(product.price)}</p><a class="button" href="produit.html?id=${product.id}">Voir le produit</a></div></article>`;
function initVideoObserver() { const videos = document.querySelectorAll('video[data-lazy-video]'); if (!videos.length) return; const observer = new IntersectionObserver((entries) => entries.forEach(({ target, isIntersecting }) => isIntersecting ? target.play().catch(() => {}) : target.pause()), { threshold: .15 }); videos.forEach((video) => { video.pause(); observer.observe(video); }); }
async function renderProducts() {
  const target = document.querySelector('[data-products]');
  const occidentalTarget = document.querySelector('[data-products-occidental]');
  const africainTarget = document.querySelector('[data-products-africain]');
  const vestesTarget = document.querySelector('[data-products-vestes]');
  const robesTarget = document.querySelector('[data-products-robes]');
  const accessoiresTarget = document.querySelector('[data-products-accessoires]');
  if (!target && !occidentalTarget && !africainTarget && !vestesTarget && !robesTarget && !accessoiresTarget) return;
  const products = await loadProducts();
  const renderGroup = (items, container) => { if (container) container.innerHTML = items.map(card).join(''); };
  renderGroup(products, target);
  renderGroup(products.filter((product) => product.origin === 'occidental'), occidentalTarget);
  renderGroup(products.filter((product) => product.origin === 'africain'), africainTarget);
  renderGroup(products.filter((product) => product.category === 'Vestes'), vestesTarget);
  renderGroup(products.filter((product) => product.category === 'Robes'), robesTarget);
  renderGroup(products.filter((product) => product.category === 'Accessoires'), accessoiresTarget);
}
async function renderProductPage() { const target = document.querySelector('[data-product-detail]'); if (!target) return; const products = await loadProducts(); const id = new URLSearchParams(location.search).get('id') || '1'; const product = products.find((item) => item.id === id) || products[0]; const productBackgroundVideos = { '1': 'assets/videos/veste.mp4', '2': 'assets/videos/robe3D.mp4', '3': 'assets/videos/sac.mp4', '4': 'assets/videos/pareil_ici (1).mp4', '5': 'assets/videos/pareil_ici.mp4', '6': 'assets/videos/fais_pareil_pour_cette_robe_st.mp4' }; const videoSrc = productBackgroundVideos[product.id]; const productBackdrop = videoSrc ? `<video class="product-detail-background" data-lazy-video autoplay loop muted playsinline preload="auto" aria-hidden="true"><source src="${videoSrc}" type="video/mp4"></video><div class="product-detail-video-scrim" aria-hidden="true"></div>` : '';
  const detailItems = product.details.map((detail) => `<li>${detail}</li>`).join('');
  target.innerHTML = `${productBackdrop}<div class="product-detail-content"><div class="media-frame"><img class="product-detail-image" src="${product.image}" alt="${product.name}" loading="eager" decoding="async" width="900" height="1200"></div><div class="product-detail-info"><p>${product.category}</p><h1>${product.name}</h1><p class="price">${currency(product.price)}</p><div class="quantity-control"><button data-detail-change="-1" aria-label="Diminuer"><i data-lucide="minus"></i></button><span data-detail-quantity>0</span><button data-detail-change="1" aria-label="Augmenter"><i data-lucide="plus"></i></button></div><div class="product-detail-actions"><button class="button button--accent" data-add-product="${product.id}">Ajouter au panier</button></div></div><div class="product-accordion"><details class="accordion-item"><summary>Description</summary><div class="accordion-content"><p>${product.description}</p></div></details><details class="accordion-item"><summary>Composition</summary><div class="accordion-content"><p>${product.composition}</p></div></details><details class="accordion-item"><summary>Détails</summary><div class="accordion-content"><ul>${detailItems}</ul></div></details><details class="accordion-item"><summary>Livraison & retours</summary><div class="accordion-content"><p>Livraison standard offerte dès 100 €. Retours acceptés sous 30 jours, dans leur état d'origine.</p></div></details></div></div>`; const refresh = () => { document.querySelector('[data-detail-quantity]').textContent = getCart().find((item) => item.id === product.id)?.quantity || 0; }; target.addEventListener('click', (event) => { const amount = event.target.closest('[data-detail-change]')?.dataset.detailChange; if (amount) { changeQuantity(product.id, Number(amount)); refresh(); } if (event.target.closest('[data-add-product]')) { changeQuantity(product.id, 1); refresh(); } }); refresh(); renderIcons(); initVideoObserver(); }
async function renderCart() { const target = document.querySelector('[data-cart-items]'); if (!target) return; const products = await loadProducts(); const cart = getCart(); if (!cart.length) { target.innerHTML = '<p class="empty-state">Votre panier est vide.</p>'; return; } target.innerHTML = cart.map((item) => { const product = products.find((p) => p.id === item.id); return `<article class="cart-row"><div><h2>${product.name}</h2><p class="price">${currency(product.price)}</p></div><div><div class="quantity-control"><button data-cart-action="minus" data-id="${item.id}" aria-label="Diminuer"><i data-lucide="minus"></i></button><span>${item.quantity}</span><button data-cart-action="plus" data-id="${item.id}" aria-label="Augmenter"><i data-lucide="plus"></i></button></div><button class="icon-button" data-cart-action="remove" data-id="${item.id}">Supprimer</button></div></article>`; }).join(''); renderIcons(); target.onclick = (event) => { const control = event.target.closest('[data-cart-action]'); if (!control) return; const { cartAction: action, id } = control.dataset; if (action === 'plus') changeQuantity(id, 1); if (action === 'minus') changeQuantity(id, -1); if (action === 'remove') removeFromCart(id); renderCart(); }; }
function initThemeMenu() {
  const toggle = document.querySelector('[data-theme-toggle]');
  const menu = document.querySelector('[data-theme-menu]');
  if (!toggle || !menu) return;
  const icons = { light: 'sun', dark: 'moon', system: 'monitor' };
  const closeMenu = () => { menu.hidden = true; toggle.setAttribute('aria-expanded', 'false'); };
  const refresh = () => {
    const choice = getThemeChoice();
    const previous = document.querySelector('[data-theme-icon]');
    if (previous) previous.outerHTML = '<i data-theme-icon data-lucide="' + icons[choice] + '"></i>';
    document.querySelectorAll('[data-theme-option]').forEach((option) => option.classList.toggle('is-active', option.dataset.themeOption === choice));
    renderIcons();
  };
  toggle.addEventListener('click', () => { const open = menu.hidden; menu.hidden = !open; toggle.setAttribute('aria-expanded', String(open)); });
  menu.addEventListener('click', (event) => { const option = event.target.closest('[data-theme-option]'); if (!option) return; setTheme(option.dataset.themeOption); refresh(); closeMenu(); });
  document.addEventListener('click', (event) => { if (!event.target.closest('.theme-control')) closeMenu(); });
  refresh();
}

function initOriginFilters() {
  const buttons = [...document.querySelectorAll('[data-origin-filter]')];
  if (!buttons.length) return;

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const choice = button.dataset.originFilter;
      buttons.forEach((item) => item.classList.toggle('is-active', item === button));
      document.querySelectorAll('.origin-group').forEach((group) => {
        const isOccidental = Boolean(group.querySelector('[data-products-occidental]'));
        const isAfricain = Boolean(group.querySelector('[data-products-africain]'));
        if (choice === 'all') group.hidden = false;
        else if (choice === 'occidental') group.hidden = !isOccidental;
        else if (choice === 'africain') group.hidden = !isAfricain;
      });
    });
  });
}
document.addEventListener('DOMContentLoaded', async () => { initTheme(); try { await loadPartial('#header-slot', '/partials/header.html'); initHeaderInteractions(); initThemeMenu(); const language = localStorage.getItem('ebene-language') || 'fr'; await setLanguage(language); document.querySelector('[data-language]').value = language; document.querySelector('[data-language]').addEventListener('change', (event) => setLanguage(event.target.value)); document.addEventListener('cartchange', () => { renderCart(); updateCartCount(); }); initSearch(); initOriginFilters(); initCarousels(); initVideoObserver(); renderIcons(); updateCartCount(); await renderProducts(); await renderProductPage(); await renderCart(); } finally { document.body.classList.remove('is-loading'); document.body.classList.add('is-ready'); } });
