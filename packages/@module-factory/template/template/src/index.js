import createApi from 'utils/createApi';
import destroy from 'utils/destroy';
<% if (useJQuery) { %>import isObject from 'utils/isObject';
import isFunction from 'utils/isFunction';
import isString from 'utils/isString';
import $ from 'jquery';

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
<% } %>
const defaultOptions = {

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
        createApi(this, 'destroy');
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
