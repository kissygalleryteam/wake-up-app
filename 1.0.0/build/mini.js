/*
combined files : 

gallery/wake-up-app/1.0.0/mini

*/
KISSY.add('gallery/wake-up-app/1.0.0/mini',['event', 'ua', 'uri', 'node'], function (S, require) {
    var Event = require('event');
    var ua = require('ua');
    var Uri = require('uri');
    var Node  = require('node');
    var $ = Node.all;
    var EventTarget = Event.Target;
    var EMPTY = '';
    /**
     * 手机浏览器页面唤醒客户端
     * @class WakeUpApp
     * @constructor
     * 参考 http://gitlab.alibaba-inc.com/mtb/lib-callapp/tree/master 实现
     */
    function WakeUpApp(config) {
        var defaultConfig = WakeUpApp.defaultConfig;
        this.config = S.merge(defaultConfig,config);
    }

    S.mix(WakeUpApp,{
        defaultConfig:{
            //要跳转的页面url
            url:location.href,
            //使用location.replace跳转
            replace:false,
            //app配置实例
            app: EMPTY
        }
    });

    S.augment(WakeUpApp, EventTarget, /** @lends WakeUpApp.prototype*/{
        
        render:function(url){
            var self = this;
            var app = self.app;
            //如果是在app中无需跳转
            if(app && app.isIn){
                return false;
            }

            if(!url){
                url = self.url;
            }else{
                self.url = url;
            }

            var oUrl = new Uri(url);
            var scheme =  oUrl.getScheme();
            //如果url是http或https，拼接成webview跳转的形式
            //taobaowebview://m.taobao.com/?weburl=http://test.html
            if(scheme === 'http' || scheme === 'https'){
                //demo: 'taobaowebview://m.taobao.com/'
                var defaultWebView = app.defaultWebView;
                oUrl = new Uri(defaultWebView);
                oUrl.setQuery('weburl='+url);
            }
            if(ua.chrome && ua.android > 4.4){
                var packageName = app.package;
                //低版本安卓需要设置hash
                //https://developers.google.com/chrome/mobile/docs/intents
                oUrl.setFragment('Intent;scheme=' + oUrl.getScheme() + ';'+packageName+';end');
                oUrl.setScheme('intent');
            }
            //安卓直接跳转
            //其他的生成个iframe，设置iframe的src
            if(ua.chrome && ua.android){
                setTimeout(function(){
                    _location(oUrl.toString());
                }, 100);
            }else{
                self._callInIframe(oUrl.toString());
            }
        },
        /**
         * 下载app
         * @returns {boolean}
         */
        download:function(url,option){
            var self = this;
            var app = self.app;
            //如果是在app中无需跳到下载页面
            if(app && app.isIn){
                return false;
            }
            //如果用户没有指定下载页面url，直接使用App实例中的配置
            if(!url){
                url = app.downloadPath();
            }

            var oUrl = new Uri(url);
            if(ua.android && url.test(/\.apk$/)){
                //清理掉hash
                oUrl.setFragment('');
            }

            self._location(oUrl.toString(),option.replace || self.replace);

            return true;
        },

        _callInIframe:function(url){
            var $iframe = $('<iframe id="wake-up-iframe-'+ S.guid()+'" frameborder="0" style="display:none;border:0;width:0;height:0;" src="'+url+'" />');
            $iframe.appendTo('body');
        },
        /**
         * 跳转页面
         * @private
         */
        _location:function(url,isReplace){
            var self = this;
            var replace = isReplace || self.replace;
            var app = self.app;
            if (replace === true) {
                location.replace(url);
            } else {
                location.href = url;
            }
        }
    });

    return WakeUpApp;

});




