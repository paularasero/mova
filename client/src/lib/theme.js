const THEME_KEY = 'mova_theme';

export function getTheme() {
  return localStorage.getItem(THEME_KEY) || 'light';
}

export function applyTheme(theme) {
  const nextTheme = theme === 'dark' ? 'dark' : 'light';
  localStorage.setItem(THEME_KEY, nextTheme);
  document.documentElement.dataset.theme = nextTheme;
  return nextTheme;
}

export function initializeTheme() {
  applyTheme(getTheme());
}
