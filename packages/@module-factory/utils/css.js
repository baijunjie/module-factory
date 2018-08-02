// 设置样式
const isObject = require('./isObject');
const isNumber = require('./isNumber');

const cssNumber = {
    'animationIterationCount': true,
    'columnCount': true,
    'fillOpacity': true,
    'flexGrow': true,
    'flexShrink': true,
    'fontWeight': true,
    'lineHeight': true,
    'opacity': true,
    'order': true,
    'orphans': true,
    'widows': true,
    'zIndex': true,
    'zoom': true
};

module.exports = function(elem, prop, value) {
    if (isObject(prop)) {
        for (let p in prop) {
            value = prop[p];
            if (isNumber(value) && !cssNumber[prop]) value += 'px';
            elem.style[p] = value;
        }
        return elem;
    }

    if (value === undefined) {
        return window.getComputedStyle(elem)[prop];
    } else {
        if (isNumber(value) && !cssNumber[prop]) value += 'px';
        elem.style[prop] = value;
        return elem;
    }
}