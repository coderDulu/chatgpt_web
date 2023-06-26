import axios from 'axios';
import type  { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

interface ResponseData<T = any> {
  code: number;
  message: string;
  data: T;
}

axios.defaults.headers.common['Authorization'] = localStorage.getItem('token') || '';

const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 5000,
});

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在请求发送之前做一些处理
    return config;
  },
  (error: any) => {
    // 处理请求错误
    Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;
    if (res.code !== 200) {
      // 处理请求错误
      return Promise.reject(new Error(res.message || 'Error'));
    } else {
      return res;
    }
  },
  (error: any) => {
    // 处理响应错误
    return Promise.reject(error);
  }
);

export default function request<T = any>(config: AxiosRequestConfig): Promise<ResponseData<T>> {
  return service(config);
}

// 封装get请求
export function get<T = any>(url: string, params?: any): Promise<ResponseData<T>> {
  return service.get(url, { params });
}

// 封装post请求
export function post<T = any>(url: string, data?: any): Promise<ResponseData<T>> {
  return service.post(url, data);
}