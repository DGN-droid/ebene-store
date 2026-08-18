export function initCarousels() {
  document.querySelectorAll('[data-carousel-controls]').forEach((controls) => {
    const carousel = document.querySelector(controls.dataset.carouselControls); if (!carousel) return;
    controls.querySelectorAll('[data-scroll]').forEach((button) => button.addEventListener('click', () => carousel.scrollBy({ left: carousel.clientWidth * Number(button.dataset.scroll), behavior: 'smooth' })));
  });
}
