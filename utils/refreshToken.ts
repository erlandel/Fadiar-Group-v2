import { refresh_tokenUrl } from "@/urlApi/urlApi";
import { AuthPayload } from "../store/authStore";

let refreshPromise: Promise<string | null> | null = null;

export const refreshToken = async (
  auth: AuthPayload | null,
  setAuth: (payload: AuthPayload) => void
): Promise<string | null> => {
  if (!auth) return null;

  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const refreshResponse = await fetch(`${refresh_tokenUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh_token: auth.refresh_token,
        }),
      });
   console.log("Rerefresh_token:", refreshResponse);
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        
        if (refreshData.access_token) {
          const newAccessToken = refreshData.access_token;
          const newRefreshToken = refreshData.refresh_token || auth.refresh_token;
          
          setAuth({
            ...auth,
            access_token: newAccessToken,
            refresh_token: newRefreshToken,
          });

          return newAccessToken;
        }
      }
      
      if (refreshResponse.status === 403 || refreshResponse.status === 401) {
        console.error("Refresh token inválido o expirado");
        return null;
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
    } finally {
      refreshPromise = null;
    }
    
    return auth.access_token;
  })();

  return refreshPromise;
};
