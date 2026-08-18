export function initSearch() {
  const input = document.querySelector('[data-product-search]'); if (!input) return;
  input.addEventListener('input', () => { const term = input.value.trim().toLocaleLowerCase(); document.querySelectorAll('[data-product-card]').forEach((card) => { card.hidden = !card.textContent.toLocaleLowerCase().includes(term); }); });
}
