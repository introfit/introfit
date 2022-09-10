import { expect, use } from 'chai'
import cap from 'chai-as-promised'
import Quester from '@introfit/quester'
import { AxiosAdapter } from '../src/axios-adapter'

use(cap)

describe('Quester', function () {
  class Api extends Quester<AxiosAdapter> {
  }
  it('should travel simple property and simple method.', () => {
  })
  it('should travel nest property and nest method.', () => {
  })
  it('should travel other method request.', () => {
  })
  it('should stringify query object.', () => {
  })
})
