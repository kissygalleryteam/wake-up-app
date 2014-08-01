/*
combined files : 

gallery/wake-up-app/1.0.0/app/taobao

*/
KISSY.add('gallery/wake-up-app/1.0.0/app/taobao',['ua', 'event', 'uri'], function (S, require) {
    var ua = require('ua');
    var Event = require('event');
    var EventTarget = Event.Target;
    var Uri = require('uri');
    /**
     * 处理设备名称字符串
     * @param name
     * @private
     */
    function deviceName(name){
        return name.replace(/^ip/, 'iP').replace(/^a/, 'A')
    }

    function Taobao(config) {
        S.mix(this,Taobao.defaultConfig,config);
        this._init();
    }
    Taobao.defaultConfig = {
        //判断页面是否在app内的正则
        inAppReg : /@taobao_(iphone|android|ipad|apad)_([\d\.]+)/,
        //判断页面是否处于WV环境
        windvineReg: /WindVane[\/\s]([\d\.\_]+)/,
        //安卓的包
        package:'com.taobao.taobao',
        //默认webview的地址
        defaultWebView:'taobaowebview://m.taobao.com/',
        //给url增加ttid等参数
        point:true
    };

    S.augment(Taobao, EventTarget, {
        /**
         * 是否在app内
         */
        _init:function(){
            var self = this;
            var ua = window.navigator.userAgent;
            var isIn = false;
            var inAppReg = self.inAppReg;
            var ttid = self._ttid();

            //优先使用UA来判断app
            if ((matched = ua.match(inAppReg))) {
                isIn = true;
                self._setDevice(matched);
            }
            //通过url中的ttid来判断是否在客户端内
            else if(ttid && (matched = ttid.match(inAppReg))){
                isIn = true;
                self._setDevice(matched);
            }
            self.package = Taobao.package;
            return self.isIn = isIn;
        },
        /**
         * 设置设备信息，名称、版本号
         * @private
         */
        _setDevice:function(infos){
            if(!S.isArray(infos)) return false;
            var self = this;
            //设备名称
            self.device = deviceName(infos[1]);
            //app版本
            self.version = infos[2];
            return true;
        },
        /**
         * 通过url来获取ttid
         * @private
         */
        _ttid:function(){
            var url = new Uri(location.href);
            return url.getQuery('ttid');
        },
        _setPoint:function(){
            var url = new Uri(location.href);
            
        },
        /**
         * app下载路径
         * @returns {*}
         */
        downloadPath:function(){
            var path;
            if(ua.android){
                path = 'http://download.taobaocdn.com/wireless/taobao4android/latest/taobao4android_703248.apk';
            }else if(ua.iphone){
                path = 'http://itunes.apple.com/cn/app/id387682726?mt=8';
            }else if(ua.ipad){
                path = 'https://itunes.apple.com/app/id438865278';
            }
            return path;
        }
    })

    return Taobao;

})
