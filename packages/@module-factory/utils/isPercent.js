// 判断是否为百分比
module.exports = function(value) {
    return /%$/.test(value + '');
}