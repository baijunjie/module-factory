const toArray = require('./toArray');

// 获取元素（IE8及以上浏览器）
module.exports = function(selector, context) {
    if (selector instanceof HTMLElement) {
        return [selector];
    } else if (typeof selector === 'object' && selector.length) {
        return toArray(selector);
    } else if (!selector || typeof selector !== 'string') {
        return [];
    }

    if (typeof context === 'string') {
        context = document.querySelector(context);
    }

    if (!(context instanceof HTMLElement)) {
        context = document;
    }

    return toArray(context.querySelectorAll(selector));
}