const DEFAULT_LOCAL = "http://localhost:5000";
// In production prefer a relative base (''), otherwise use env var or localhost
const BASE_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === "production" ? "" : DEFAULT_LOCAL);

/*  Build headers automatically */
function getAuthHeaders() {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

/* Handle auth failure globally */
function handleAuthFail(res, onLogout) {
  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("token");
    if (onLogout) onLogout();
    return null;
  }
  return res.json();
}

/*ONE function to replace fetch everywhere */
async function apiRequest(method, endpoint, body, onLogout) {
  const options = {
    method,
    headers: getAuthHeaders(),
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  return handleAuthFail(res, onLogout);
}

/*Export everything */
export { BASE_URL, getAuthHeaders, handleAuthFail, apiRequest };
