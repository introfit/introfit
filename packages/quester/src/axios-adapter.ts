import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { Adapter } from './adapter'

export class AxiosAdapter implements Adapter<AxiosRequestConfig> {
  readonly #inner: AxiosInstance
  readonly config: AxiosRequestConfig
  constructor(config: AxiosRequestConfig) {
    this.config = config
    this.#inner = axios.create(config)
  }
  request<
    T = any,
    R extends AxiosResponse<T> = AxiosResponse<T>,
    D = any,
    >(arg: string | AxiosRequestConfig<D>): Promise<R> {
    if (typeof arg === 'string')
      return this.#inner.get(arg)
    else
      return this.#inner.request(arg)
  }
}
