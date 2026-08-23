export function initSearch() {
  const input = document.querySelector('[data-product-search]');
  const originButtons = [...document.querySelectorAll('[data-origin-filter]')];
  const originGroups = [...document.querySelectorAll('.origin-group')];
  if (!input && !originButtons.length) return;

  const filterProducts = () => {
    const term = input?.value.trim().toLocaleLowerCase() || '';
    const activeOrigin = document.querySelector('[data-origin-filter].is-active')?.dataset.originFilter || 'all';
    document.querySelectorAll('[data-product-card]').forEach((card) => {
      const matchesText = !term || card.textContent.toLocaleLowerCase().includes(term);
      const matchesOrigin = activeOrigin === 'all' || card.dataset.origin === activeOrigin;
      card.hidden = !(matchesText && matchesOrigin);
    });
    originGroups.forEach((group) => {
      const isOccidental = group.querySelector('[data-products-occidental]');
      const isAfricain = group.querySelector('[data-products-africain]');
      if (activeOrigin === 'all') {
        group.hidden = false;
      } else if (activeOrigin === 'occidental') {
        group.hidden = !isOccidental;
      } else if (activeOrigin === 'africain') {
        group.hidden = !isAfricain;
      }
    });
  };

  input?.addEventListener('input', filterProducts);
  originButtons.forEach((button) => button.addEventListener('click', () => {
    originButtons.forEach((item) => item.classList.toggle('is-active', item === button));
    filterProducts();
  }));
}