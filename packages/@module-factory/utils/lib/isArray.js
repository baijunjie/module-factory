// 判断对象是否为数组
module.exports = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}