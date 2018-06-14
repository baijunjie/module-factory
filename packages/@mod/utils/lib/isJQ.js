// 判断对象是否为jQuery对象
export default function isJQ(jq) {
    return jq instanceof window.jQuery;
}