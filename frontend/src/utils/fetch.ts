import { getCSRFCookie } from "./cookies";
import APIError from "../types/apierror.models";

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
    const csrfToken = getCSRFCookie() || "";

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

      const errorData = await response.json().catch(() => ({}));
      throw new APIError(`HTTP error! Status: ${response.status}`, response.status, errorData);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export default fetchAPI;
