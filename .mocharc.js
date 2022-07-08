process.env.NODE_ENV = 'test'

module.exports = {
  extension: [ 'ts', 'tsx' ],
  require: [
    'ts-node/register'
  ]
}
