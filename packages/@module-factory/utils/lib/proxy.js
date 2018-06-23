// 使用方法一：
// 第一个参数为调用的方法
// 第二个参数为该方法调用时 this 的引用对象，如果传入 null，则不会改变 this 的引用
// 使用方法二：
// 第一个参数为调用方法时 this 的引用对象，如果传入 null，则不会改变 this 的引用
// 第二个参数为将要调用 this 引用对象的方法的名称字符串
// 以上两种用法从第三个参数开始可以为调用函数传入若干个参数
// 如果该函数本身就有默认参数，比如 .each() 方法会给函数传入两个参数，分别为索引号和对应的对象，那么通过代理设置的参数会插在原函数的参数前
let guid = 0;
module.exports = function(func, target) {
    if (typeof target === 'string') {
        let tmp = func[target];
        target = func;
        func = tmp;
    }

    if (typeof func !== 'function') {
        return undefined;
    }

    let slice = Array.prototype.slice,
        args = slice.call(arguments, 2),
        proxy = function() {
            return func.apply(target || this, args.concat(slice.call(arguments)));
        };

    proxy.guid = func.guid = func.guid || guid++;

    return proxy;
}