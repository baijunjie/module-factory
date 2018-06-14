/**
 * 让隐藏元素正确执行程序（IE9及以上浏览器）
 * @param elems  {DOM|Array} DOM元素或者DOM元素组成的数组
 * @param func   {Function}  需要执行的程序函数
 * @param target {Object}    执行程序时函数中 this 的指向
 */
const defaultDisplayMap = {};
export default function(elems, func, target) {
    if (typeof elems !== 'object') {
        elems = [];
    }

    if (typeof elems.length === 'undefined') {
        elems = [elems];
    }

    const hideElems = [],
        hideElemsDisplay = [];

    for (let i = 0, elem; elem = elems[i++];) {

        while (elem instanceof HTMLElement) {

            const nodeName = elem.nodeName;

            if (!elem.getClientRects().length) {
                hideElems.push(elem);
                hideElemsDisplay.push(elem.style.display);

                let display = defaultDisplayMap[nodeName];
                if (!display) {
                    const temp = document.createElement(nodeName);
                    document.body.appendChild(temp);
                    display = window.getComputedStyle(temp).display;
                    temp.parentNode.removeChild(temp);

                    if (display === 'none') display = 'block';
                    defaultDisplayMap[nodeName] = display;
                }

                elem.style.display = display;
            }

            if (nodeName === 'BODY') break;
            elem = elem.parentNode;
        }
    }

    if (typeof(func) === 'function') func.call(target || this);

    let l = hideElems.length;
    while (l--) {
        hideElems.pop().style.display = hideElemsDisplay.pop();
    }
}