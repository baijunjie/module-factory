// 类似数组对象转数组
module.exports = function(obj) {
    return Array.prototype.map.call(obj, function(n) { return n });
}