export function bind(context, ...methods) {
    methods.forEach(method => {
        context[method] = context[method].bind(context);
    });
}