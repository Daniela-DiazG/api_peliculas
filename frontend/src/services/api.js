
const BASE_URL = 'http://localhost:3000'

async function apiFetch(method, path, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, options);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Error ${res.status} en ${path}`);
  }

  if (res.status === 204) return null;

  if(method === 'POST' || method === 'PUT' || method === 'DELETE') return body; 

  return res?.json()||res;
}

export default apiFetch;