const key = 'ebene-theme';

export function applyTheme(choice = localStorage.getItem(key) || 'system') {
  const resolved = choice === 'system' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : choice;
  document.documentElement.dataset.theme = resolved;
  document.documentElement.dataset.themeChoice = choice;
  return choice;
}

export function initTheme() {
  applyTheme();
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if ((localStorage.getItem(key) || 'system') === 'system') applyTheme('system');
  });
}

export function setTheme(choice) { localStorage.setItem(key, choice); return applyTheme(choice); }
export const getThemeChoice = () => localStorage.getItem(key) || 'system';
