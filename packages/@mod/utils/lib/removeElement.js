// 移除元素
export default function(elem) {
    elem.parentNode && elem.parentNode.removeChild(elem);
}