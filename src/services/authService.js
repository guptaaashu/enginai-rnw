// ─── Auth service ─────────────────────────────────────────────────────────────

const BACKEND_URL = 'http://localhost:8080';

export function login() {
  // Save current page so AuthCallback can redirect back after login
  localStorage.setItem('redirect_after_login', window.location.pathname);
  window.location.href = `${BACKEND_URL}/api/authn/login`;
}

export function logout() {
  // Clear RT cookie via backend (httpOnly — can't delete from JS)
  fetch(`${BACKEND_URL}/api/authn/logout`, { method: 'POST', credentials: 'include' });
}
