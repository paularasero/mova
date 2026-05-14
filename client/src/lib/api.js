function resolveApiUrl() {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL.replace(/\/$/, '');
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    if (window.location.hostname === 'mova-t928.vercel.app') return '/api';
    return 'https://mova-t928.vercel.app/api';
  }
  return 'http://localhost:4000/api';
}

const API_URL = resolveApiUrl();

export async function apiRequest(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
  } catch {
    throw new Error('No pudimos conectarnos. Revisá tu conexión e intentá nuevamente.');
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || data?.error || 'No pudimos completar la operación. Probá nuevamente.');
  }

  return data;
}
