// Utility to check token status and auto-logout if expired
export async function checkTokenStatus() {
  try {
    const res = await fetch('/auth/status', { credentials: 'include' });
    if (res.status === 401) {
      // Token expired
      localStorage.removeItem('userData');
      localStorage.removeItem('username');
      window.location.href = '/signin';
      return false;
    }
    const data = await res.json();
    if (data.status !== 'valid') {
      localStorage.removeItem('userData');
      localStorage.removeItem('username');
      window.location.href = '/signin';
      return false;
    }
    return true;
  } catch {
    // Network or other error, treat as expired for safety
    localStorage.removeItem('userData');
    localStorage.removeItem('username');
    window.location.href = '/signin';
    return false;
  }
}
