const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

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
    throw new Error('Error al conectar con el servidor. Verificá que el backend esté funcionando.');
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || 'No pudimos completar la operación. Probá nuevamente.');
  }

  return data;
}
