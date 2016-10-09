## chaos 框架使用说明

> chaos 是一个组件化的页面渲染框架，可实现页面数据绑定，数据渲染，事件绑定以及组件通信

### 如何使用
1. 引入 Component 基类
```
var Component = require('_libs/chaos/Component.js');
```

2. 通过 Component.create 创建一个组件

3. 通过 new Example(model, [options]) 生成组件实例

```
var model = {
    number: 12,
    time: '20160-12-12'
}

/**
 * 实例化一个组件
 * @param {Object} model 组件渲染所需的数据
 * @param {组件一些配置参数} {}    可选
 */
var linkItem = new LinkItem(model, {})
```



### Example

```
var Component = require('_libs/chaos/Component.js');
var Tpl = require('./tpl');
var ProjectType = require('./../../config').ProjectType;

var LinkItem = Component.create({

    /**
     * 非必须
     * 如果未设置el和$el属性，默认会将模板数据render到这个节点下
     * 自动生成 li 节点赋值给el 和 $el 属性
     * @type {String}
     */
    tagName: 'li',

    /**
     * 非必须
     * 如果提供了tagName，那么可以通过这个设置组件外层的样式
     * @type {String}
     */
    className: 'step',

    /**
     * 必须
     * 模板
     * @type {[type]}
     */
    template: Tpl,

    /**
     * 非必须
     * DOM 节点，如果提供了此属性，那么重新render处理的html会插入到此节点下
     * 用法参照module/LogInfo
     * @param  {[type]} '#app' [description]
     * @return {[type]}        [description]
     */
    el: $('#app').find('.mod-logs')[0],

    /**
     * 非必须
     * 在通过new LinkItem() 生成的时候会执行 initialize
     * 基类有此方法，如果不写会执行默认值
     * 可以覆盖掉，自己写一些操作
     * @return {[type]} [description]
     */
    initialize: function(options) {
        this.options = options;
        this.render();
    },

    /**
     * 事件绑定，每个Component组件都可以写自己的事件绑定
     * 负责本组件的所有事件处理
     * 事件map的形式
     * '事件 选择器': '处理函数名'
     * 类似 this.$el.on('click', '.el', delete);
     * @type {Object}
     */
    events: {
        'click .del': 'delete'
    },

    /**
     * 模块之间通信，绑定action的执行函数
     * 别的组件通过调用 this.dispatch('project:show', {id: 10}) 来发布事件
     * @type {Object}
     */
    actions: {
        'project:show': 'handleProjectShow'
    },

    // 自定义的一些方法，供events调用
    delete: function() {
        this.$el.append('<h3>hello</h3>');
    },

    /**
     * 非必须
     * 解析本组件的数据, 如果写了次方法，组件会在每次render的时候重新自动调用
     * @param  {Object} model 原始数据
     * @return {Object}       [解析之后的数据]
     */
    parse: function(model) {
        if(!model){
            return null;
        }
        model.typeName = ProjectType[model.stepType];
        model.updateTime = model.lastUpdat ? new Date(model.lastUpdat) : '';
        return model;
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
});


/**
 * 实例化一个组件
 * @param {Object} model 组件渲染所需的数据
 * @param {组件一些配置参数} {}    可选
 */
var linkItem = new LinkItem(model, {})

```
