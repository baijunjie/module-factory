// 判断对象是否为纯粹的对象（通过 "{}" 或者 "new Object" 创建的）
module.exports = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}