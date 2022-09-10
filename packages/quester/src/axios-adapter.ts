import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { Adapter } from './adapter'

export class AxiosAdapter implements Adapter<AxiosRequestConfig> {
  readonly #inner: AxiosInstance
  readonly config: AxiosRequestConfig
  constructor(config: AxiosRequestConfig) {
    this.config = config
    this.#inner = axios.create(config)
  }
  request(arg: string | any): Adapter.Response {
    if (typeof arg === 'string')
      return this.#inner.get(arg)
    else
      return this.#inner.request(arg)
  }
}
