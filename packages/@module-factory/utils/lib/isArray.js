// 判断对象是否为数组
export default function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}