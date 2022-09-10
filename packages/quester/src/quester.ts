import { Utils } from '@introfit/core'
import qs from 'qs'
import { Adapter, AdapterConstructor } from './adapter'

export type QueryPromise<T, Q> = Promise<T> & {
  query(q: Q): Promise<T>
}

type promiseMethod = 'then' | 'catch' | 'finally'
const promiseMethods = [ 'then', 'catch', 'finally' ]

function getPromiseProp (p: Promise<any>, prop: promiseMethod) {
  return p[prop].bind(p)
}

function requestProxy<
  A extends Adapter<any>,
  AC extends AdapterConstructor<any, A>
  >(q: Quester<A>, path: string, cPath = ''): Function {
  const p = `${path}${Utils.String.pluralize(cPath)}`
  return new Proxy(() => {}, {
    get(_, prop: string) {
      if (promiseMethods.includes(prop))
        return getPromiseProp(
          q.$adapter.request(path + cPath), prop as promiseMethod
        )
      else {
        if (prop === 'query') {
          return new Proxy(() => {}, {
            apply(target, thisArg, [ query ]): any {
              return q.$adapter.request(`${p}?${qs.stringify(query, { encode: false })}`)
            }
          })
        }
        for (const f in Quester.FORWARDS) {
          if (prop === f) {
            return (...args: any[]) => q.$adapter.request({
              url: p,
              method: Quester.FORWARDS[f],
            })
          }
        }
        return requestProxy(q, path, `/${prop}`)
      }
    },
    apply(_, __, [id, ..._args]) {
      return requestProxy(q, `${p}/${id}`)
    }
  })
}

export class Quester<
  A extends Adapter<any>,
  C extends Adapter.Config = A extends Adapter<infer C> ? C : never,
  > {
  $adapter: A

  constructor(AC: AdapterConstructor<C, A>, config: C) {
    this.$adapter = new AC(config)
    return new Proxy(this, {
      get(target, path: keyof typeof this) {
        if (path in target)
          // @ts-ignore
          return target[path]

        return requestProxy(target as any, `/${path}`)
      }
    })
  }

  get $request() {
    return this.$adapter.request
  }
}

export namespace Quester {
  export interface EventMap {
    'resp.fulfilled': (resp: Adapter.Response) => void
    'resp.rejected': (error: Adapter.ErrorItf) => void
  }
  export type Events = keyof EventMap
  export enum FORWARDS {
    add   = Adapter.METHODS.POST,
    del   = Adapter.METHODS.DELETE,
    upd   = Adapter.METHODS.PATCH,
    get   = Adapter.METHODS.GET,
    query = Adapter.METHODS.GET,
  }
}
