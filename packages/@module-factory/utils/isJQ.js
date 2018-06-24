// 判断对象是否为jQuery对象
module.exports = function isJQ(jq) {
    return jq instanceof window.jQuery;
}