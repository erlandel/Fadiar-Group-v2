import { server_url } from "@/lib/apiClient";
import { AuthPayload } from "../store/authStore";

export const refreshToken = async (
  auth: AuthPayload | null,
  setAuth: (payload: AuthPayload) => void
): Promise<string | null> => {
  if (!auth) return null;

  try {
    const refreshResponse = await fetch(`${server_url}/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: auth.refresh_token,
      }),
    });

    console.log("refreshResponse:", refreshResponse);
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
  } catch (error) {
    console.error("Error refreshing token:", error);
  }
  
  return auth.access_token;
};
