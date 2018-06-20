import $ from 'jquery';
import isObject from '@module-factory/utils/isObject';
import isFunction from '@module-factory/utils/isFunction';
import isString from '@module-factory/utils/isString';
import createApi from '@module-factory/utils/createApi';
import destroy from '@module-factory/utils/destroy';

const defaultOptions = {

};

$.fn.<%= moduleName %> = function(options) {
    let className = '<%= moduleName %>',
        inst = this.data(className);

    if (isObject(options)) {
        if (inst && isFunction(inst.destroy)) inst.destroy();
        inst = new <%= moduleName %>(this, options);
        this.data(className, inst);
    } else if (isString(options)) {
        if (isFunction(inst[options])) inst[options]();
        if (options === 'destroy') this.removeData(className);
    }

    return this;
};

class BaseClass {}

export default class <%= moduleName %> extends BaseClass {
    /**
     * [<%= moduleName %> description]
     * @param container {[type]} [description]
     * @param options   {[type]} [description]
     */
    constructor(container, options) {
        super();
        this._container = container;
        this._options = Object.assign({}, defaultOptions, options);
        this._init();
    }

    _init() {
        this._addEvent();
        createApi('destroy');
    }

    _addEvent() {

    }

    _removeEvent() {

    }

    _destroy() {
        this._removeEvent();
        destroy(this);
    }
};
