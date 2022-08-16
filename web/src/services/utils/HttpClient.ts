import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class HttpClient {
  private httpClient: AxiosInstance;

  constructor() {
    this.httpClient = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
    });
  }

  async get<T>(path: string, config?: AxiosRequestConfig) {
    return this.httpClient.get<T>(path, config);
  }

  async post<T>(path: string, body?: any, config?: AxiosRequestConfig) {
    return this.httpClient.post<T>(path, body, config);
  }

  async put<T>(path: string, body?: any, config?: AxiosRequestConfig) {
    return this.httpClient.put<T>(path, body, config);
  }

  async delete<T>(path: string, config?: AxiosRequestConfig) {
    return this.httpClient.delete<T>(path, config);
  }
}

export default new HttpClient();
