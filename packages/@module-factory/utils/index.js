[
    'extend',
    'proxy',
    'bind',
    'createApi',
    'destroy',
    'hideAction',

    'createElement',
    'removeElement',

    '$',
    'attr',
    'css',

    'toArray',

    'isArray',
    'isObject',
    'isPlainObject',
    'isEmptyObject',
    'isNumber',
    'isString',
    'isBoolean',
    'isFunction',
    'isUndefined',
    'isDate',
    'isDOM',
    'isJQ'
].forEach(m => {
    exports[m] = require(`./${m}`)
})
