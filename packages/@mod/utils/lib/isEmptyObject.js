// 判断对象是否是否为空
export default function(obj) {
    for (let key in obj) return false;
    return true;
}