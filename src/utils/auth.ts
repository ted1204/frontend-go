export function isAuthenticated() {
  const username = localStorage.getItem("username");
  return !!username;
}