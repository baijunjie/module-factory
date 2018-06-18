// 'request' must be installed
// npm install request --save
const request = require('request-promise-native')

exports.get = async (uri) => {
  const reqOpts = {
    method: 'GET',
    resolveWithFullResponse: true,
    json: true,
    uri
  }

  return request(reqOpts)
}