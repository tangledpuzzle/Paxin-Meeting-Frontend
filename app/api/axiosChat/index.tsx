import axiosClient from "axios";
import type { AxiosRequestConfig } from "axios";

/**
 * Creates an initial 'axios' instance with custom settings.
 */
const instance = axiosClient.create({
  baseURL: "https://openrouter.ai/api/v1/chat",
  headers: {
    Accept: "application/json",
    "HTTP-Referer": "http://localhost:5173",
    Authorization: `Bearer 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`,
  },
});

/**
 * Handle all responses. It is possible to add handlers
 * for requests, but it is omitted here for brevity.
 */
instance.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.request) {
      return Promise.reject(err.request);
    }
    return Promise.reject(err.message);
  }
);

/**
 * Replaces main `axios` instance with the custom one.
 *
 * @param cfg - Axios configuration object.
 * @returns A promise object of a response of the HTTP request with the 'data' object already
 * destructured.
 */
const axiosChat = <T=any>(cfg: AxiosRequestConfig): Promise<T> => {
  instance.defaults.headers.common[
    "Authorization"
  ] = `Bearer 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`;
  return instance.request<unknown, T>(cfg);
};

export default axiosChat; // Export the axiosPrivate function as the default export
