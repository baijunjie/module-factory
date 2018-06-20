const resolve = require('resolve')

exports.resolveModule = (request, context) => {
  let resolvedPath
  try {
    resolvedPath = resolve.sync(request, { basedir: context })
  } catch (e) {}
  return resolvedPath
}

exports.loadModule = (request, context) => {
  const resolvedPath = exports.resolveModule(request, context)
  if (resolvedPath) {
    return require(resolvedPath)
  }
}
