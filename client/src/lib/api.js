const API_BASE = (import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api").replace(/\/+$/,"");


function qs(query) {
  if (!query) return "";
  if (typeof query === "string") return query.startsWith("?") ? query : `?${query}`;
  const s = new URLSearchParams(query);
  const q = s.toString();
  return q ? `?${q}` : "";
}


async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include", 
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = null;
  try { data = await res.json(); } catch { /* no body */ }

  if (!res.ok) {
    const msg = data?.message || `API ${res.status}: ${res.statusText}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

/* MENU */
export const menuAPI = {
  list: (query) => request(`/menuitems${qs(query)}`),
  get: (id) => request(`/menuitems/${id}`),
  create: (body) => request(`/menuitems`, { method: "POST", body: JSON.stringify(body) }),
  update: (id, body) => request(`/menuitems/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  delete: (id) => request(`/menuitems/${id}`, { method: "DELETE" }),
};

/* TABLES */
export const tablesAPI = {
  list: () => request(`/tables`),
  get: (id) => request(`/tables/${id}`),
  update: (id, body) => request(`/tables/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  availability: (params) => request(`/tables/availability${qs(params)}`),
};

/* RESERVATIONS */
export const reservationsAPI = {
  list: () => request(`/reservations`),
  get: (id) => request(`/reservations/${id}`),
  create: (body) => request(`/reservations`, { method: "POST", body: JSON.stringify(body) }),
  update: (id, body) => request(`/reservations/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  delete: (id) => request(`/reservations/${id}`, { method: "DELETE" }),
  my: () => request(`/reservations/my`),
};

/* AUTH */
export const authAPI = {
  login: (body) => request(`/auth/login`, { method: "POST", body: JSON.stringify(body) }),
  register: (body) => request(`/auth/register`, { method: "POST", body: JSON.stringify(body) }),
  logout: () => request(`/auth/logout`, { method: "POST" }),
  me: () => request(`/auth/me`),
};


const api = { menuAPI, tablesAPI, reservationsAPI, authAPI };
export default api;
export { reservationsAPI as reservationAPI };
export { tablesAPI as tableAPI };
export { authAPI as userAPI };
