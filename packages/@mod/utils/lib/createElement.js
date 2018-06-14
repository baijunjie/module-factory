// 创建元素
export default function(parentNode, className, id, prop) {
    let elem = document.createElement('DIV');

    if (typeof className === 'object') {
        prop = className;
        className = null;
    }

    if (typeof id === 'object') {
        prop = id;
        id = null;
    }

    if (typeof prop === 'object') {
        for (let p in prop) {
            elem.style[p] = prop[p];
        }
    }

    if (className) elem.className = className;
    if (id) elem.id = id;

    parentNode.appendChild(elem);

    return elem;
}