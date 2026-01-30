import { useAuthContext } from "@/context/AuthContext";

export function useApi() {
  const { accessToken, refreshAccessToken, logout } = useAuthContext();

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    let currentToken = accessToken;

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${currentToken}`,
    };

    let res = await fetch(url, { ...options, headers });

    if (res.status === 401) {
      // Try to refresh the token
      const newToken = await refreshAccessToken();
      if (newToken) {
        // Retry the request with the new token
        const newHeaders = {
          ...options.headers,
          Authorization: `Bearer ${newToken}`,
        };
        res = await fetch(url, { ...options, headers: newHeaders });
      } else {
        // Refresh failed, logout
        logout();
      }
    }

    return res;
  };

  return { fetchWithAuth };
}
