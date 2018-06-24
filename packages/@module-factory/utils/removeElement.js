// 移除元素
module.exports = function(elem) {
    elem.parentNode && elem.parentNode.removeChild(elem);
}