// 判断对象是否为日期对象
export default function(date) {
    return Object.prototype.toString.call(date) === '[object Date]';
}