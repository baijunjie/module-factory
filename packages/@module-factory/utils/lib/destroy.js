export function destroy(context) {
    // 清除所有属性
    Object.getOwnPropertyNames(context).forEach(prop => {
        delete context[prop];
    });

    context.__proto__ = Object.prototype;
}