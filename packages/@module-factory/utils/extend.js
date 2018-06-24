const isArray = require('./isArray');
const isObject = require('./isObject');
const isBoolean = require('./isBoolean');
const isFunction = require('./isFunction');
const isPlainObject = require('./isPlainObject');

module.exports = function extend() {
    let options, name, src, copy, copyIsArray,
        target = arguments[0] || {},
        toString = Object.prototype.toString,
        i = 1,
        length = arguments.length,
        deep = false;

    // 处理深拷贝
    if (isBoolean(target)) {
        deep = target;

        // Skip the boolean and the target
        target = arguments[i] || {};
        i++;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if (!isObject(target) && !isFunction(target)) {
        target = {};
    }

    // 如果没有合并的对象，则表示 target 为合并对象，将 target 合并给当前函数的持有者
    if (i === length) {
        target = this;
        i--;
    }

    for (; i < length; i++) {

        // Only deal with non-null/undefined values
        if ((options = arguments[i]) != null) {

            // Extend the base object
            for (name in options) {
                src = target[name];
                copy = options[name];

                // 防止死循环
                if (target === copy) {
                    continue;
                }

                // 深拷贝对象或者数组
                if (deep && copy &&
                    ((copyIsArray = isArray(copy)) || isPlainObject(copy))) {

                    if (copyIsArray) {
                        copyIsArray = false;
                        src = src && isArray(src) ? src : [];
                    } else {
                        src = src && isPlainObject(src) ? src : {};
                    }

                    target[name] = extend(deep, src, copy);

                } else if (copy !== undefined) { // 仅忽略未定义的值
                    target[name] = copy;
                }
            }
        }
    }

    // Return the modified object
    return target;
}
