// Module-level token store — set by AuthContext on login/logout.
// Services are plain JS modules (can't use hooks), so the token
// is kept here and injected into every outgoing request.

const BACKEND_URL = 'http://localhost:8080';

let _accessToken = null;

export function setToken(token) {
  _accessToken = token;
}

/**
 * Drop-in replacement for fetch() that automatically:
 *   - Adds Authorization: Bearer <AT>
 *   - On 401, tries POST /api/authn/refresh (RT in httpOnly cookie) once,
 *     stores the new AT, then retries the original request.
 */
export async function apiFetch(url, options = {}) {
  const res = await fetch(url, buildOptions(options));

  if (res.status === 401) {
    const newAt = await refreshAccessToken();
    if (newAt) {
      _accessToken = newAt;
      return fetch(url, buildOptions(options)); // retry once with new AT
    }
  }

  return res;
}

function buildOptions(options) {
  return {
    ...options,
    credentials: 'include', // send RT cookie on every request
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(_accessToken ? { Authorization: `Bearer ${_accessToken}` } : {}),
    },
  };
}

async function refreshAccessToken() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/authn/refresh`, {
      method: 'POST',
      credentials: 'include', // sends RT httpOnly cookie
    });
    if (!res.ok) return null;
    const { accessToken } = await res.json();
    return accessToken;
  } catch {
    return null;
  }
}
