import { getCSRFCookie } from "./cookies";

const BASE_URL = "http://127.0.0.1:8000/api";

interface FetchOptions {
  method: string;
  headers?: Record<string, string>;
  body?: any;
  credentials?: RequestCredentials;
}

const fetchAPI = async (
  endpoint: string,
  { method, headers = {}, body = null, credentials = "include" }: FetchOptions
): Promise<any> => {
  try {
    const csrfToken = getCSRFCookie("csrftoken") || "";

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
        ...headers,
      },
      credentials,
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export default fetchAPI;
