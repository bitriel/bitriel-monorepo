import type { AxiosInstance } from 'axios';

export type TokenSupplier = () => string | undefined | Promise<string | undefined>;

export const attachAuthToken = (client: AxiosInstance, getToken: TokenSupplier) => {
  const interceptorId = client.interceptors.request.use(async (config) => {
    const token = await getToken();

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  return () => client.interceptors.request.eject(interceptorId);
};
