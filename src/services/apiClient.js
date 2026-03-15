// Module-level token store — set by AuthContext on login/logout.
// Services are plain JS modules (can't use hooks), so the token
// is kept here and injected into every outgoing request.

let _accessToken = null;

export function setToken(token) {
  _accessToken = token;
}

/**
 * Drop-in replacement for fetch() that automatically adds:
 *   Authorization: Bearer <AT>
 *   Content-Type: application/json  (unless overridden)
 */
export function apiFetch(url, options = {}) {
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(_accessToken ? { Authorization: `Bearer ${_accessToken}` } : {}),
    },
  });
}
