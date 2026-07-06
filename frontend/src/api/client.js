//client.js
export const BASE_URL = import.meta.env.VITE_API_URL || "https://portfolio-db-1jg2.onrender.com";

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("admin_token");
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers,
  };

  console.log(`[API Request] Calling: ${url}`, { method: options.method || "GET" });

  try {
    const res = await fetch(url, config);
    console.log(`[API Response] Status: ${res.status} for ${url}`);
    
    if (res.status === 401) {
      console.warn(`[API Unauthorized] Token invalid or expired. Logging out...`);
      localStorage.removeItem("admin_token");
      window.dispatchEvent(new Event("auth-unauthorized"));
      throw new Error("Unauthorized access. Please login again.");
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const message = errorData.error || errorData.errors?.join(", ") || `Request failed with status ${res.status}`;
      console.error(`[API Error Response] Message: ${message}`);
      throw new Error(message);
    }

    if (res.status === 204) return null;
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`[API Network Error] URL: ${url}, Error:`, error);
    throw error;
  }
}
