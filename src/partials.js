export async function loadPartial(selector, path) {
  const container = document.querySelector(selector);
  if (!container) throw new Error(`Conteneur introuvable : ${selector}`);
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Impossible de charger le fragment : ${path}`);
  container.innerHTML = await response.text();
}
