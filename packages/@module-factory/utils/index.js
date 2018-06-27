[
    'extend',
    'proxy',
    'bind',
    'createApi',
    'destroy',

    '$',
    'attr',
    'css',
    'support',
    'createElement',
    'removeElement',
    'hideAction',

    'toArray',
    'isArray',
    'isObject',
    'isPlainObject',
    'isEmptyObject',
    'isNumber',
    'isPercent',
    'isString',
    'isBoolean',
    'isFunction',
    'isUndefined',
    'isDate',
    'isDOM',
    'isJQ',
].forEach(m => {
    exports[m] = require(`./${m}`)
})
