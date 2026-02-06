const BASE_URL = 'https://notes-api.dicoding.dev/v2';

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      data?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
}

export async function getNotes() {
  const result = await request(`${BASE_URL}/notes`, { method: 'GET' });
  return result.data || [];
}

export async function deleteNote(id) {
  const result = await request(`${BASE_URL}/notes/${id}`, { method: 'DELETE' });
  return result;
}

export async function createNote({ title, body }) {
  const result = await request(`${BASE_URL}/notes`, {
    method: 'POST',
    body: JSON.stringify({ title, body }),
  });

  return result;
}

export async function getArchivedNotes() {
  const result = await request(`${BASE_URL}/notes/archived`, { method: 'GET' });
  return result.data || [];
}

export async function archiveNote(id) {
  return request(`${BASE_URL}/notes/${id}/archive`, { method: 'POST' });
}

export async function unarchiveNote(id) {
  return request(`${BASE_URL}/notes/${id}/unarchive`, { method: 'POST' });
}
