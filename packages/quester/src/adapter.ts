export interface AdapterConstructor<
  C extends Adapter.Config,
  A extends Adapter<C>,
  > {
  new(config: C): A
}

export interface Adapter<C extends Adapter.Config> {
  config: C
  request:
    /**
     * default request should is a GET request
     * @param url
     */
    & (<T = any, R extends Adapter.Response<T> = Adapter.Response<T>, D = any>(url: string) => Promise<R>)
    /**
     * complex request
     * @param config
     */
    & (<T = any, R extends Adapter.Response<T> = Adapter.Response<T>, D = any>(config: Adapter.RequestConfig<D>) => Promise<R>)
}

export namespace Adapter {
  export const enum METHODS {
    GET     = 'GET',
    POST    = 'POST',
    PUT     = 'PUT',
    DELETE  = 'DELETE',
    PATCH   = 'PATCH',
    OPTIONS = 'OPTIONS',
    HEAD    = 'HEAD',
  }

  export interface Config {
    baseURL?: string
  }

  export type RequestHeaders = Record<string, string>

  export interface RequestConfig<D = any> {
    /**
     * The URL to send the request to.
     */
    url?: string
    /**
     * payload body
     */
    data?: D
    /**
     * The HTTP method to use for the request.
     */
    method?: keyof typeof METHODS | string
    /**
     * The headers to send with the request.
     */
    headers?: RequestHeaders
    /**
     * query params.
     */
    params?: any
  }

  export interface Response<T = any, D = any>  {
    data: T
    status: number
    statusText: string
    config: RequestConfig<D>
    headers: RequestHeaders
    request?: any
  }

  export interface ErrorItf<T = unknown, D = any> extends Error {
    new(
      message?: string,
      code?: string,
      config?: RequestConfig<D>,
      request?: any,
      response?: Response<T, D>
    ): ErrorItf

    code?: string
    status?: string
    request?: any
    config: RequestConfig<D>
    response?: Response<T, D>
  }
}
