import { AxiosInstance } from 'axios';
import { ISession } from '../types';

export const applyInterceptors = (
  client: AxiosInstance,
  session: ISession | null,
  clearSession: () => void
) => {
  const requestInterceptor = client.interceptors.request.use((request) => {
    if (session) {
      Object.assign(request.headers, session);
    }

    return request;
  });

  const responseInterceptor = client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (!error.response || !error.response.data) {
        return Promise.reject({ errors: ['Connection error'] });
      }

      if (error.response.status === 401) {
        clearSession();
      }

      return Promise.reject(error.response.data);
    }
  );

  return [requestInterceptor, responseInterceptor];
};

export const clearInterceptors = (
  client: AxiosInstance,
  interceptors: Array<number>
) => {
  const [requestInterceptor, responseInterceptor] = interceptors;

  client.interceptors.request.eject(requestInterceptor);
  client.interceptors.response.eject(responseInterceptor);
};
