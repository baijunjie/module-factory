[
  'env',
  'installDeps',
  'logger',
  'module',
  'request',
  'sortObject',
  'spinner',
  'Version',
  'writeFileTree'
].forEach(m => {
  Object.assign(exports, require(`./lib/${m}`))
})
