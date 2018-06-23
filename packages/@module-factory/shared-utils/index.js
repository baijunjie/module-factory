[
  'env',
  'installDeps',
  'logger',
  'module',
  'request',
  'sortObject',
  'spinner',
  'version',
  'writeFileTree'
].forEach(m => {
  Object.assign(exports, require(`./lib/${m}`))
})
