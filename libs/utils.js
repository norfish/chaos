/**
 * @file: utils.js
 * @desc:
 * @author yongxiang.li @ 4/13/2016, 5:10:57 PM
 */

var Utils = {};
var _cid = 0;

var regType = /^\[\w+\s+(\w+)\]$/;

Utils.type = function(source) {
    var type = Object.prototype.toString.call(source).match(regType)[1].toLowerCase();
    return type;
};

Utils.getId = function(prefix){
    _cid++;
    return (prefix || '') + '_' + _cid;
};

/**
 * Object assign pollyfill
 * @param  {Object} typeof Object.assign === 'undefined' [description]
 * @return {Object}
 */
if(typeof Object.assign === 'undefined') {
    Object.assign = function(target) {
        if(Utils.type(target) !== 'object') {
            throw 'target must be an object';
        }

        for(var i = 1, len = arguments.length; i < l; i++) {
            var obj = arguments[i];
            for(var k in obj) {
                if(obj.hasOwnPropoty(k)) {
                    target[k] = obj[k];
                }
            }
        }

        return target;
    };
}

module.exports = Utils;
