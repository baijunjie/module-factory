// 判断对象是否为DOM
export default function(dom) {
    return /^\[object HTML.*\]$/.test(Object.prototype.toString.call(dom));
}