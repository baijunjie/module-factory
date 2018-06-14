import isString from './isString';
import isArray from './isArray';

export function createApi(context, ...args) {
    args.forEach(arg => {
        let privateName, publicName;

        if (isString(arg)) {
            privateName = publicName = arg;
        } else if (isArray(arg)) {
            privateName = arg[0];
            publicName = arg[1];
        }

        if (privateName.indexOf('_')) privateName = '_' + privateName;
        if (!publicName.indexOf('_')) publicName = publicName.substr(1);

        context[publicName] = (...args) => {
            context[privateName](context, ...args);
            return context;
        };
    });
}