process.env.DEBUG = 'template'

const getTemplateFiles = require('../index')

async function getTemplate () {
  const files = await getTemplateFiles({
    name: 'test-module'
  })
}

getTemplate()