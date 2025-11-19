// Frontend API client for backend endpoints discovered in backend/app/api
// Auto-generated: provides helpers for all routes under /login, /user, /chat, messages and documents.

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const STORAGE_KEY = 'token';

let authToken = null;
// Try to load token from localStorage (guard for SSR)
try {
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored) authToken = stored;
} catch (e) {
	// ignore (e.g., SSR or privacy mode)
}

export function setAuthToken(token) {
	authToken = token;
	try { localStorage.setItem(STORAGE_KEY, token); } catch (e) {}
}

export function clearAuthToken() {
	authToken = null;
	try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
}

function buildQuery(params = {}) {
	const qs = Object.entries(params)
		.filter(([, v]) => v !== undefined && v !== null)
		.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
		.join('&');
	return qs ? `?${qs}` : '';
}

async function request(method, path, { params, body, headers } = {}) {
	const url = `${BASE_URL}${path}${buildQuery(params)}`;
	const opts = { method, headers: { ...(headers || {}) } };

	if (authToken) opts.headers.Authorization = `Bearer ${authToken}`;

	// If body is a FormData (for file upload), don't set content-type and let browser set multipart boundary
	if (body instanceof FormData) {
		opts.body = body;
	} else if (body !== undefined && body !== null && method !== 'GET' && method !== 'HEAD') {
		opts.headers['Content-Type'] = 'application/json';
		opts.body = JSON.stringify(body);
	}

	const res = await fetch(url, opts);
	const text = await res.text();
	let data = null;
	try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }

	if (!res.ok) {
		const err = new Error(data?.detail || data?.message || res.statusText || 'API error');
		err.status = res.status;
		err.body = data;
		throw err;
	}

	return data;
}

// --- API surface ---
const api = {
	// Authentication
	auth: {
		// POST /login (form-encoded OAuth2 password flow expected by backend)
		// Accepts: { username, password } as application/x-www-form-urlencoded
		login: async ({ username, password } = {}) => {
			// backend expects OAuth2PasswordRequestForm — use URLSearchParams
			const params = new URLSearchParams();
			if (username !== undefined) params.append('username', username);
			if (password !== undefined) params.append('password', password);

			const res = await fetch(`${BASE_URL}/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: params.toString(),
			});
			const text = await res.text();
			const data = text ? JSON.parse(text) : null;
			if (!res.ok) {
				const err = new Error(data?.detail || data?.message || res.statusText || 'Login failed');
				err.status = res.status;
				err.body = data;
				throw err;
			}
			// Persist token so subsequent requests include Authorization header
			if (data && data.access_token) {
				setAuthToken(data.access_token);
			}
			return data; // { access_token, token_type }
		}
	},

	// User routes (/user)
	users: {
		// POST /user  (create user)
		create: async (user) => {
			const data = await request('POST', '/user', { body: user });
			if (data && data.access_token) setAuthToken(data.access_token);
			return data;
		},
		// GET /user/{id}
		get: (id) => request('GET', `/user/${encodeURIComponent(id)}`),
	},

	// Chat routes (/chat)
	chat: {
		// POST /chat
		create: (chat) => request('POST', '/chat', { body: chat }),
		// GET /chat
		list: () => request('GET', '/chat'),
		// GET /chat/{id}
		get: (id) => request('GET', `/chat/${encodeURIComponent(id)}`),
		// DELETE /chat/{chat_id}
		remove: (chat_id) => request('DELETE', `/chat/${encodeURIComponent(chat_id)}`),
	},

	// Messages under /chat/{chat_id}/messages
	messages: {
		// POST /chat/{chat_id}/messages
		create: (chat_id, message) => request('POST', `/chat/${encodeURIComponent(chat_id)}/messages`, { body: message }),
		// GET /chat/{chat_id}/messages
		list: (chat_id) => request('GET', `/chat/${encodeURIComponent(chat_id)}/messages`),
		// DELETE /chat/{chat_id}/messages/{message_id}
		remove: (chat_id, message_id) => request('DELETE', `/chat/${encodeURIComponent(chat_id)}/messages/${encodeURIComponent(message_id)}`),
	},

	// Documents under /chat/{chat_id}/document
	documents: {
		// POST /chat/{chat_id}/document  (file upload)
		upload: (chat_id, file /* File or Blob */) => {
			const fd = new FormData();
			fd.append('file', file);
			return request('POST', `/chat/${encodeURIComponent(chat_id)}/document`, { body: fd });
		},
		// DELETE /chat/{chat_id}/document
		remove: (chat_id) => request('DELETE', `/chat/${encodeURIComponent(chat_id)}/document`),
	}
};

export default api;

