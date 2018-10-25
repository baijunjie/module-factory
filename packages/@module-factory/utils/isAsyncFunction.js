// 判断是否为同步函数
module.exports = function(func) {
    return Object.prototype.toString.call(func) === '[object AsyncFunction]';
}