// src/lib/apiClient.ts

const BASE_URL = "https://app.fadiar.com:444/prueba/api";

async function request<T>(url: string, options?: RequestInit, authoptions?: Record<string, string>): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${url}`, {
      headers: {
        "Content-Type": "application/json",
        ...authoptions
      },
      ...options,
    });

    if (!res.ok) {
      throw new Error(`Error HTTP: ${res.status}`);
    }

    return res.json() as Promise<T>;
  } catch (error) {
    console.error("❌ Error en petición:", error);
    throw error;
  }
}


  export const server_url = 'https://app.fadiar.com:444/prueba/api'
 


export const api = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body: any) =>
    request<T>(url, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(url: string, body: any) =>
    request<T>(url, { method: "PUT", body: JSON.stringify(body) }),
  delete: <T>(url: string) =>
    request<T>(url, { method: "DELETE" }),
};
