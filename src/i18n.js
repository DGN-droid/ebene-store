const key = 'ebene-language';
let strings = {};

export async function setLanguage(lang = localStorage.getItem(key) || 'fr') {
  const response = await fetch(new URL(`./data/${lang}.json`, import.meta.url));
  strings = await response.json(); localStorage.setItem(key, lang);
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach((node) => { node.textContent = strings[node.dataset.i18n] || node.dataset.i18n; });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => { node.placeholder = strings[node.dataset.i18nPlaceholder] || ''; });
  document.dispatchEvent(new CustomEvent('languagechange', { detail: { lang, strings } }));
}
export const t = (name) => strings[name] || name;
