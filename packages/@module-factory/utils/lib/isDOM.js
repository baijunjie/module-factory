// 判断对象是否为DOM
module.exports = function(dom) {
    return /^\[object HTML.*\]$/.test(Object.prototype.toString.call(dom));
}