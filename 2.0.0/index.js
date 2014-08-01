/**
 * @fileoverview
 * @author
 * @module wake-up-app
 **/
KISSY.add(function (S, Node,Base) {
    var EMPTY = '';
    var $ = Node.all;
    /**
     *
     * @class WakeUpApp
     * @constructor
     * @extends Base
     */
    function WakeUpApp(comConfig) {
        var self = this;
        //调用父类构造函数
        WakeUpApp.superclass.constructor.call(self, comConfig);
    }
    S.extend(WakeUpApp, Base, /** @lends WakeUpApp.prototype*/{

    }, {ATTRS : /** @lends WakeUpApp*/{

    }});
    return WakeUpApp;
}, {requires:['node', 'base']});



