[
  'env',
  'getVersions',
  'installDeps',
  'module',
  'request',
  'sortObject',
  'spinner',
  'writeFileTree'
].forEach(m => {
  Object.assign(exports, require(`./lib/${m}`))
})
