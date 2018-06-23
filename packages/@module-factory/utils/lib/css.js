// 设置样式
module.exports = function(elem, prop, value) {
    if (typeof prop === 'object') {
        for (let p in prop) {
            value = prop[p];
            if (typeof value === 'number') value += 'px';
            elem.style[p] = value;
        }
        return elem;
    }

    if (value === undefined) {
        return window.getComputedStyle(elem)[prop];
    } else {
        if (typeof value === 'number') value += 'px';
        elem.style[prop] = value;
        return elem;
    }
}