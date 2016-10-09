/**
 * @file: viewManager.js
 * @desc:
 * @author yongxiang.li @ 2016-04-17 23:28:34
 */

function ViewManager(){
    if(this._instance) {
        return this._instance;
    }
    this._instance = this;
    this.views = {};
    return this;
}

ViewManager.prototype = {
    getView: function(name) {
        return this.views[name] || null;
    },

    setView: function(name, instance) {
        this.views[name] = instance;
        return instance;
    }
};

ViewManager.getInstance = function() {
    return new ViewManager();
}

var viewManager = ViewManager.getInstance();

module.exports = viewManager;
