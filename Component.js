/**
 * @file: Component.js
 * @desc:
 * @author yongxiang.li @ 4/13/2016, 5:09:53 PM
 */

/**
 * usage
 *
 * var Demo = Component.create({
 *
 *  // 仨选一 可不传
 *  el: dom,
 *  $el: $dom,
 *  tagName: 'div',
 *  template: homeTpl, // 模板
 *
 * 	static: { //静态属性和方法
 * 		time: '123'
 * 	},
 *
 *  constructor: { //构造器
 *  	this.name = 'haha';
 *  },
 *
 *  events: {
 *  	"eventType selector": "handleName"
 *  },
 *
 *  actions: {
 *  	"actionName": "handleMethod"
 *  },
 *
 *  dos: function(){}
 *  ...
 * });
 *
 * // instance
 * var demo = new Demo({
 * 	model: {}
 * });
 */



var Utils = require('./utils.js');
var Channel = require('./Event.js');
var viewManager = require('./viewManager.js');

var APPEND_TYPE = {
    inner: 'html',
    append: 'append',
    prepend: 'prepend',
    replace: 'replace'
};

var Component = function(model, options){
    this.cid = Utils.getId();
    this.viewManager = viewManager;
    this.model = model || {};
    this._applyOptions(model, options);

    this._setElement();
    this._bindEvents();
    this._bindActions();
    this._initViewManager();
    this.set(this.getInitialModel());

    this.initialize.apply(this, arguments);
};

// 静态方法 jquery $
Component.$ = $;

var DEFAULT_OPTIONS = {

};

Component.prototype = {

    /**
     * DOM 节点，如果提供了此属性，那么重新render处理的html会插入到此节点下
     * 用法参照module/LogInfo
     * @param  {DomNode}
     */
    el: null,

    /**
     * jQuery 节点，如果提供了此属性，那么重新render处理的html会插入到此节点下
     * 用法参照module/LogInfo
     * @param  {jQuery Object}
     */
    $el: null,

    /**
     * 如果未设置el和$el属性，默认会将模板数据render到这个节点下
     * 自动生成 li 节点赋值给el 和 $el 属性
     * @type {String}
     */
    tagName: 'div',

    /**
     * 如果提供了tagName，那么可以通过这个设置组件外层的样式
     * @type {String}
     */
    className: '', //样式

    /**
     * 必须
     * 模板
     * @type {template}
     */
    template: null,

    initialize: function(options) {
        //this._applyOptions(options);
        //this.render();
    },

    $: function(selector) {
        return this.$el.find(selector);
    },

    render: function() {
        var element = this.template(this.model);

        this.$el[APPEND_TYPE[this.appendType] || 'html'](element);
        this.el = this.$el[0];

        return this;
    },

    /**
     * 非必须
     * 解析本组件的数据, 如果写了次方法，组件会在每次render的时候重新自动调用
     * @param  {Object} model 原始数据
     * @return {Object}       [解析之后的数据]
     */
    parse: function(data) {
        return data;
    },

    template: function(){},

    appendType: 'inner', // html 插入方式 append prepend inner replace

    set: function(key, val) {
		if (key == null) return this;

        // Handle both `"key", value` and `{key: value}` -style arguments.
        var attrs;
        if (typeof key === 'object') {
            attrs = key;
        } else {
            (attrs = {})[key] = val;
        }

        var current = this.model;

        // For each `set` attribute, update or delete the current value.
        for (var attr in attrs) {
            val = attrs[attr];
            if(current[attr] !== val) {
            	current[attr] = val;
            }
        }

        return this;
	},

	get: function(key) {
		return key ? this.model[key] : this.model;
	},

    getInitialModel: function() {
        return {};
    },

    /**
     * 生命周期函数
     * 如果提供了此方法，会在组件渲染之前调用
     * @type {function}
     */
    onWillUpdate: NOOP,

    /**
     * 生命周期函数
     * 如果提供了此方法，会在组件渲染之后调用
     * @type {function}
     */
    onDidUpdate: NOOP,

    /**
     * 事件绑定，每个Component组件都可以写自己的事件绑定
     * 负责本组件的所有事件处理
     * 事件map的形式
     * '事件 选择器': '处理函数名'
     * 类似 this.$el.on('click', '.el', delete);
     * @type {Object}
     */
    events: {
        //click .el: handleClick,
        //click .name changeNamge
    },

    /**
     * 模块之间通信，绑定action的执行函数
     * 别的组件通过调用 this.dispatch('project:show', {id: 10}) 来发布事件
     * @type {Object}
     */
    actions: {
        //project:save-brantch: handleSave
    },

    // 事件绑定
    _bindEvents: function() {
        this._unbindEvents();

        var events = this.events;
        var cid = this.cid;
        for(var listener in events) {
            var handler = this[events[listener]] || NOOP;
            listener = listener.split(/\s+/);
            var name = listener[0];
            var tag = listener[1] || '';

            tag ?
                this.$el.on(name + '.chaosEvent' + cid, tag, handler.bind(this)) :
                this.$el.on(name + '.chaosEvent' + cid, handler.bind(this));
        }

        return this;
    },

    // action 绑定
    _bindActions: function() {
        var actions = this.actions;
        var cid = this.cid;
        for(var actionName in actions) {
            var handler = this[ actions[actionName] ];

            this.on(actionName, handler.bind(this));
        }

        return this;
    },

    // 解绑
    _unbindEvents: function() {
        this.$el.off('.chaosEvent' + this.cid);
        return this;
    },

    // 参数格式化
    _fixOptions: function(model, options) {
        if(!Utils.type(options) !== 'object') {
            options = {};
        }

        var keys = Object.keys(DEFAULT_OPTIONS);
        var filter;

        for(var k in options) {
            if(k in keys) {
                filter[k] = options[k];
            }
        }

        return Object.assign({}, DEFAULT_OPTIONS, filter);
    },

    _applyOptions: function(options) {
        options = this._fixOptions(options);
        Object.assign(this, options);
        return this;
    },

    // 抹平$el, el tagName的差异
    _setElement: function() {
        if(!this.el) {
            this.el = this._createElement(this.tagName);
            this.$el = Component.$(this.el);
        } else if(this.$el){
            this.el = this.$el[0];
            this.$el = Component.$(this.el);
        } else {
            this.$el = Component.$(this.el);
            this.el = this.$el[0];
        }
        this.$el.addClass(this.className);
        this.el = this.$el[0];
        return this;
    },

    _createElement: function(tag) {
        return document.createElement(tag || 'div');
    },

    // 视图管理器
    _initViewManager: function() {
        this.viewName = this.viewName || ('Component' + this.cid);
        this.viewManager.setView(this.viewName, this);
    }
};

/*###########################
 * 扩展 event
 *##########################*/
Channel._useDebug(true);
Object.assign(Component.prototype, Channel);


/*###########################*
 * 类继承
 *##########################*/

/**
 * create
 * @param  {Object} props  子类属性
 *                 constructor: 构造器属性
 *                 static: 静态属性
 * @return {Object}        子类
 */
var create = function(props) {

    var parent = this;
    var child;

    if(props && props.hasOwnProperty('constructor')) {
        child = function(){
            parent.apply(this, arguments);
            props.constructor.apply(this, arguments);
        }

        //delete props.constructor;
    } else {
        child = function() {
            return parent.apply(this, arguments);
        }
    }

    // staticProps
    if(props && props.hasOwnProperty('static')) {
        Object.assign(child, parent, props.static);
        delete props.static;
    };

    // extend
    child.prototype = Object.create(this.prototype);

    // child props
    if(props) {
        Object.assign(child.prototype, props);
    }

    // inject props
    injectChild(child);

    child.__super__ = parent.prototype;

    return child;
};


function injectChild(child) {
    if(!child) {
        throw 'must apply the class';
    }

    var prevRender = child.prototype.render;

    child.prototype.render = function() {
        var parsedData = this.parse(this.model);
        this.set(parsedData);
        this.onWillUpdate.call(this, this.model);
        prevRender.call(this, parsedData);
        this._setElement();
        setTimeout(function(){
            this.onDidUpdate.call(this, this.model);
        }.bind(this), 0);
        return this;
    };

    return child;
}

Component.create = create;

//
// ext
//

// noop function
function NOOP(){};

module.exports = Component;
