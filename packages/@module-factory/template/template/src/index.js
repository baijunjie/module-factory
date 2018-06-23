import $ from 'jquery';
import isObject from '@module-factory/utils/isObject';
import isFunction from '@module-factory/utils/isFunction';
import isString from '@module-factory/utils/isString';
import createApi from '@module-factory/utils/createApi';
import destroy from '@module-factory/utils/destroy';

const defaultOptions = {

};

$.fn.<%= className %> = function(options) {
    let className = '<%= className %>',
        inst = this.data(className);

    if (isObject(options)) {
        if (inst && isFunction(inst.destroy)) inst.destroy();
        inst = new <%= className %>(this, options);
        this.data(className, inst);
    } else if (isString(options)) {
        if (isFunction(inst[options])) inst[options]();
        if (options === 'destroy') this.removeData(className);
    }

    return this;
};

export default class <%= className %> {
    /**
     * [<%= className %> description]
     * @param element {[type]} [description]
     * @param options {[type]} [description]
     */
    constructor(element, options) {
        this._element = element;
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
