import { apiRequest } from './api';

const USERS_KEY = 'mova_users';
const CURRENT_USER_KEY = 'mova_current_user';

function safeParse(value, fallback) {
  try {
    return JSON.parse(value) ?? fallback;
  } catch {
    return fallback;
  }
}

function normalizeUser(user) {
  if (!user) return null;
  return {
    ...user,
    id: user.id || user._id || null,
    name: user.name || user.nombre || '',
    nombre: user.nombre || user.name || '',
    city: user.city || user.ciudad || 'Montevideo',
    ciudad: user.ciudad || user.city || 'Montevideo',
    savedExperiences: Array.isArray(user.savedExperiences) ? user.savedExperiences : [],
  };
}

export function getStoredUsers() {
  return safeParse(localStorage.getItem(USERS_KEY), []);
}

export function saveStoredUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser() {
  return normalizeUser(safeParse(localStorage.getItem(CURRENT_USER_KEY), null));
}

export function setCurrentUser(user) {
  const normalized = normalizeUser(user);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(normalized));
  if (normalized?.preferences?.theme && typeof document !== 'undefined') {
    const savedTheme = localStorage.getItem('mova_theme');
    const nextTheme = savedTheme || normalized.preferences.theme || 'light';
    localStorage.setItem('mova_theme', nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }
}

export function clearCurrentUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export async function registerUser({ name, email, city, password }) {
  try {
    const user = await apiRequest('/users/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, city, password }),
    });

    setCurrentUser(user);
    return { ok: true, user };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

export async function loginUser({ email, password }) {
  try {
    const user = await apiRequest('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    setCurrentUser(user);
    return { ok: true, user };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}
