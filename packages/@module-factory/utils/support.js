// 返回指定属性在当前浏览器中的兼容前缀
// 如果无需兼容前缀，则返回一个空字符串
// all 是一个布尔值，如果为 true，则会返回包含前缀的属性名
module.exports = function(prop, all) {
    const returnProp = all ? prop : '';
    const testElem = document.documentElement;
    if (prop in testElem.style) return returnProp;

    const testProp = prop.charAt(0).toUpperCase() + prop.substr(1),
        prefixs = [ 'Webkit', 'Moz', 'ms', 'O' ];

    for (let i = 0, prefix; prefix = prefixs[i++];) {
        if ((prefix + testProp) in testElem.style) {
            return '-' + prefix.toLowerCase() + '-' + returnProp;
        }
    }

    return returnProp;
}