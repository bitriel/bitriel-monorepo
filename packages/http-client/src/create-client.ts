import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

export type CreateHttpClientOptions = AxiosRequestConfig;

const DEFAULT_TIMEOUT_MS = 10_000;

export const createHttpClient = (options: CreateHttpClientOptions = {}): AxiosInstance => {
  return axios.create({
    timeout: DEFAULT_TIMEOUT_MS,
    withCredentials: false,
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
};

export const httpClient = createHttpClient();
