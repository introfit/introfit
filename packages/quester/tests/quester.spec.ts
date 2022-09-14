import { expect, use } from 'chai'
import cap from 'chai-as-promised'
import Quester from '@introfit/quester'
import { AxiosAdapter } from '../src/axios-adapter'

use(cap)

type DefProp<N extends string, P> = { [K in N]: Promise<P> }

describe('Quester', function () {
  interface User {
    id: number
    name: string
  }
  interface Guild {
    id: number
    name: string
  }
  interface Api {
    user(id: string):
      & Promise<User>
      & DefProp<'friend', User>
      & DefProp<'friends', User[]>
      & DefProp<'guilds', Guild[]>
    users: Promise<User[]>
  }
  class Api extends Quester<AxiosAdapter> {
  }
  const api = new Api(AxiosAdapter, {});
  it('should travel simple property and simple method.', async () => {
    const users = await api.users
    const user001 = await api.user('001')
    const user001Friends = await api.user('001').friends
  })
  it('should travel nest property and nest method.', () => {
  })
  it('should travel other method request.', () => {
  })
  it('should stringify query object.', () => {
  })
})
