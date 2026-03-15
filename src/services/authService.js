// ─── SWAP THIS FILE when Spring Boot is ready ───────────────────────────────
// Current: mock mode — generates random tokens locally
// Future:  just uncomment the real login line below

const BACKEND_URL = 'http://localhost:8080';

function randomToken(length = 40) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function setRefreshTokenCookie(rt) {
  // httpOnly can't be set from JS — in real flow Spring Boot sets it
  // For mock: using a regular cookie (same interface, just not httpOnly)
  document.cookie = `refresh_token=${rt}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;
}

export function login() {
  // ── REAL (uncomment when Spring Boot is ready) ──
  // localStorage.setItem('redirect_after_login', window.location.pathname);
  // window.location.href = `${BACKEND_URL}/oauth2/authorization/google`;

  // ── MOCK ──
  const at = randomToken(40);
  const rt = randomToken(60);
  setRefreshTokenCookie(rt);
  window.location.href = `/auth/callback?access_token=${at}`;
}

export function logout() {
  document.cookie = 'refresh_token=; path=/; max-age=0';
}
