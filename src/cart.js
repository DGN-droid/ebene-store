const key = 'ebene-cart';
export const getCart = () => JSON.parse(localStorage.getItem(key) || '[]');
const save = (cart) => { localStorage.setItem(key, JSON.stringify(cart)); document.dispatchEvent(new Event('cartchange')); };
export function changeQuantity(id, amount) { const cart = getCart(); const item = cart.find((entry) => entry.id === id); if (item) item.quantity += amount; else if (amount > 0) cart.push({ id, quantity: amount }); save(cart.filter((entry) => entry.quantity > 0)); }
export const removeFromCart = (id) => save(getCart().filter((entry) => entry.id !== id));
export const itemCount = () => getCart().reduce((total, item) => total + item.quantity, 0);
export function updateCartCount() { document.querySelectorAll('[data-cart-count]').forEach((node) => { node.textContent = itemCount(); }); }
