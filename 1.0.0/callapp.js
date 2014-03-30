;
(function(window, lib) {
    lib.env = lib.env || {};

    function Version(string){
        this.string = string.toString();
    };

    Version.prototype.toString = function(){
        return this.string;
    };

    Version.prototype.valueOf = function(){
        var v = this.toString().split('.');
        var r = [];
        for(var i = 0; i < v.length; i++) {
            var n = parseInt(v[i],10);
            if(window.isNaN(n)) {
                n = 0;
            }
            var s = n.toString();
            if(s.length < 5) {
                s = Array(6-s.length).join('0') + s;
            }
            r.push(s);
            if(r.length === 1) {
                r.push('.');
            }
        }
        return window.parseFloat(r.join(''));
    };

    Version.prototype.gt = function(v) {
        return Version.compare(this,v) > 0;
    };

    Version.prototype.gte = function(v) {
        return Version.compare(this,v) >= 0;
    };

    Version.prototype.lt = function(v) {
        return Version.compare(this,v) < 0;
    };

    Version.prototype.lte = function(v) {
        return Version.compare(this,v) <= 0;
    };

    Version.prototype.eq = function(v) {
        return Version.compare(this,v) === 0;
    };

    Version.compare = function (v1,v2){
        v1 = v1.toString().split('.');
        v2 = v2.toString().split('.');

        for(var i = 0; i < v1.length || i < v2.length; i++) {
            var n1 = parseInt(v1[i],10),  n2 = parseInt(v2[i],10);

            if(window.isNaN(n1)) {
                n1 = 0;
            }
            if(window.isNaN(n2)) {
                n2 = 0;
            }
            if( n1 < n2 ) {
                return -1;
            }
            else if( n1 > n2) {
                return 1;
            }
        }
        return 0;
    }


    lib.version = function(string){
        return new Version(string);
    };

})(window, window['lib'] || (window['lib'] = {}));
;
(function(window, lib) {
    lib.env = lib.env || {};

    var search = window.location.search.replace(/^\?/,'')
    lib.env.params = {};
    if(search) {
        var params = search.split('&');
        for(var i = 0 ; i < params.length; i++) {
            params[i] = params[i].split('=');
            try{
                lib.env.params[params[i][0]] = decodeURIComponent(params[i][1]);
            } catch(e) {
                lib.env.params[params[i][0]] = params[i][1];
            }
        }
    }

})(window, window['lib'] || (window['lib'] = {}));
;
(function(window, lib) {
    lib.env = lib.env || {};

    var ua = window.navigator.userAgent;
    var matched;

    if((matched = ua.match(/Android[\s\/]([\d\.]+)/))) {
        lib.env.os = {
            name: 'Android',
            isAndroid: true,
            version: matched[1]
        }
    } else if((matched = ua.match(/(iPhone|iPad|iPod)/))) {
        var name = matched[1];

        matched = ua.match(/OS ([\d_\.]+) like Mac OS X/);

        lib.env.os = {
            name: name,
            isIPhone: (name === 'iPhone' || name === 'iPod'),
            isIPad: name === 'iPad',
            isIOS: true,
            version: matched[1].split('_').join('.')
        }
    } else {
        lib.env.os = {
            name:'unknown',
            version:'0.0.0'
        }
    }

    if (lib.version) {
        lib.env.os.version = lib.version(lib.env.os.version);
    }

})(window, window['lib'] || (window['lib'] = {}));
;
(function(window, lib) {
    lib.env = lib.env || {};

    var ua = window.navigator.userAgent;
    var matched;

    if((matched = ua.match(/(?:UCWEB|UCBrowser\/)([\d\.]+)/))) {
        lib.env.browser = {
            name: 'UC',
            isUC: true,
            version: matched[1]
        }
    } else if((matched = ua.match(/MQQBrowser\/([\d\.]+)/))) {
        lib.env.browser = {
            name: 'QQ',
            isQQ: true,
            version: matched[1]
        }
    } else if((matched = ua.match(/(?:Chrome|CriOS)\/([\d\.]+)/))) {
        lib.env.browser = {
            name: 'Chrome',
            isChrome: true,
            version: matched[1]
        }
    } else if(ua.match(/Mobile Safari/) && (matched = ua.match(/Android[\s\/]([\d\.]+)/))) {
        lib.env.browser = {
            name: 'Android',
            isAndroid: true,
            version: matched[1]
        }
    } else if(ua.match(/iPhone|iPad|iPod/)) {
        if(ua.match(/Safari/)) {
            matched = ua.match(/Version\/([\d\.]+)/)
            lib.env.browser = {
                name: 'Safari',
                isSafari: true,
                version: matched[1]
            }
        } else {
            matched = ua.match(/OS ([\d_\.]+) like Mac OS X/);
            lib.env.browser = {
                name: 'iOS Webview',
                isWebview: true,
                version: matched[1].replace(/\_/, '.')
            }
        }
    } else {
        lib.env.browser = {
            name:'unknown',
            version:'0.0.0'
        }
    }

    if (lib.version) {
        lib.env.browser.version = lib.version(lib.env.browser.version);
    }

})(window, window['lib'] || (window['lib'] = {}));
;
(function(window, lib) {
    lib.env = lib.env || {};

    var ttid = lib.env.params['ttid'];
    var ua = window.navigator.userAgent;

    var windvine;
    var matched;
    if ((matched = ua.match(/WindVane[\/\s]([\d\.\_]+)/))) {
        windvine = matched[1];
    }

    var platform;
    var version;
    if ((matched = ua.match(/@taobao_(iphone|android|ipad|apad)_([\d\.]+)/))) {
        platform = matched[1].replace(/^ip/, 'iP').replace(/^a/, 'A');
        version = matched[2];
    } else if (ttid && (matched = ttid.match(/@taobao_(iphone|android|ipad|apad)_([\d\.]+)/))) {
        platform = matched[1].replace(/^ip/, 'iP').replace(/^a/, 'A');
        version = matched[2];
    } else if (windvine) {
        windvine = lib.version(windvine);
        platform = lib.env.os.name;

        if (lib.env.os.isAndroid) {
            if (windvine.gte('2.5.1') && windvine.lte('2.5.5')) {
                version = '3.9.2';
            } else if (windvine.eq('2.5.6')) {
                version = '3.9.3';
            } else if (windvine.eq('2.6.0')) {
                version = '3.9.5';
            }
        } else if (lib.env.os.isIOS) {
            if (windvine.gte('2.5.0') && windvine.lt('2.6.0')) {
                version = '3.4.0';
            } else if (windvine.eq('2.6.0')) {
                version = '3.4.5';
            }
        }
    }

    if (platform && version) {
        lib.env.taobaoApp = {
            windvine: lib.version(windvine || '0.0.0'),
            version: lib.version(version || '0.0.0'),
            platform: platform
        }
    }

})(window, window['lib'] || (window['lib'] = {}));
;
(function(win, lib) {
    function HttpURL(string){
        var params = {};
        Object.defineProperty(this, 'params', {
            set: function(v){
                if (typeof v === 'object'){
                    for(var p in params) {
                        delete params[p];
                    }
                    for(var p in v) {
                        params[p] = v[p];
                    }
                }
            },
            get: function() {
                return params;
            },
            enumerable: false
        });

        Object.defineProperty(this, 'search', {
            set: function(v) {
                if(typeof v === 'string') {
                    if (v.indexOf('?') === 0) {
                        v = v.substr(1);
                    }
                    var search = v.split('&');
                    for(var p in params) {
                        delete params[p];
                    }
                    for(var i = 0 ; i < search.length; i++) {
                        var pair = search[i].split('=');
                        if (pair[0] && pair[1]) {
                            try {
                                params[pair[0]] = decodeURIComponent(pair[1]);
                            } catch(e) {
                                params[pair[0]] = pair[1];
                            }
                        }
                    }
                }
            },
            get: function(){
                var search = [];
                for(var p in params) {
                    try {
                        search.push(p +'=' + encodeURIComponent(params[p]));
                    } catch(e) {
                        search.push(p +'=' + params[p]);
                    }
                }
                if (search.length) {
                    return '?' + search.join('&');
                } else {
                    return '';
                }

            },
            enumerable: true
        });

        var hash;
        Object.defineProperty(this, 'hash', {
            set: function(v) {
                if (v && v.indexOf('#') < 0) {
                    v = '#' + v;
                }
                hash = v || '';
            },
            get: function() {
                return hash;
            },
            enumerable: true
        });

        this.set = function(v) {
            v = v || '';
            var matchArr;
            if((matchArr = v.match(new RegExp('^(https?):[/]{2}' + //protocal
                '(?:([^@/:]+)(?::([^@/:]+))?@)?' +    //username:password@
                '([^:/?#]+)' +                        //hostname
                '(?:[:]([0-9]+))?' +                  //port
                '([/][^?#;]*)?' +                     //pathname
                '(?:[?]([^?#]*))?' +                //search
                '(#[^#]*)?$'                          //hash
            )))){
                this.protocal = matchArr[1];
                this.username = matchArr[2] || '';
                this.password = matchArr[3] || '';
                this.hostname = this.host = matchArr[4] ;
                this.port = matchArr[5] || '';
                this.pathname = matchArr[6] || '/';
                this.search = matchArr[7] || '';
                this.hash = matchArr[8] || '';
                this.origin = this.protocal + '://' + this.hostname;
            } else {
                throw new Error('Wrong uri scheme.');
            }
        }

        this.toString = function(){
            var string = this.protocal + '://';
            if(this.username) {
                string += this.username;
                if(this.password) {
                    string += ':' + this.password;
                }
                string += '@';
            }
            string += this.host;
            if(this.port && this.port !== '80') {
                string += ':' + this.port;
            }
            if(this.pathname) {
                string += this.pathname;
            }
            if(this.search) {
                string += this.search;
            }
            if(this.hash) {
                string += this.hash;
            }
            return string;
        }


        if (string) {
            this.set(string.toString());
        }
    }

    lib.httpurl = HttpURL;
})(window, window['lib'] || (window['lib'] = {}));
;
(function(win, lib) {
    var doc = win.document;
    var HttpURL = lib.httpurl;
    var os = lib.env.os;
    var params = lib.env.params;
    var taobaoApp = lib.env.taobaoApp;
    var browser = lib.env.browser;

    lib.callapp = {};

    function appendPoint(url, extraPoint) {
        var currentUrl = new HttpURL(location.href);
        var hiddenInput = doc.getElementById('buried');
        var ttid = currentUrl.params.ttid;
        var adid = currentUrl.params.ad_id;
        var sourceType = currentUrl.params.source_type;
        var refpid = currentUrl.params.refpid;
        var actparam = currentUrl.params.actparam;
        var actname = currentUrl.params.actname;
        var aliTrackid = currentUrl.params.ali_trackid;
        var pid = currentUrl.params.pid;
        var h5Uid = doc.cookie.match(/(?:^|\s)cna=([^;]+)(?:;|$)/);

        currentUrl.search = '';
        currentUrl.hash = '';

        var params = {};

        if (hiddenInput) {// 椤甸潰涓鍏ョ殑ttid
            ttid = hiddenInput.value;
        }

        params.from = 'h5';

        if (ttid) {
            params.ttid = ttid;
        }

        if (refpid) {
            params.refpid = refpid;
        }

        if (actparam) {
            params.actparam = actparam;
        }

        if (actname) {
            params.actname = actname;
        }

        params.url = currentUrl.toString();

        if (pid) {
            params.pid = pid;
        }

        if (adid) {
            params.ad_id = adid;
        }

        if (sourceType) {
            params.source_type = sourceType;
        }

        if (aliTrackid) {
            params.ali_trackid = aliTrackid;
        }

        if (h5Uid) {
            params.h5_uid = h5Uid[1];
        }

        if (typeof extraPoint === 'object') {
            for (var key in extraPoint) {
                params[key] = extraPoint[key];
            }
        }

        url.params.point = JSON.stringify(params);

        return url;
    }

    function appendParam(url, extraParam) {
        var currentUrl = new HttpURL(location.href);
        var hiddenInput = doc.getElementById('buried');

        // 褰撳墠椤甸潰href涓殑鍙傛暟閫忎紶锛屼紭鍏堢骇浣庝簬宸叉湁鐨勫弬鏁�
        for (var key in currentUrl.params) {
            if (!url.params.hasOwnProperty(key)) {
                url.params[key] = currentUrl.params[key];
            }
        }

        if (hiddenInput) {// 椤甸潰涓鍏ョ殑ttid
            url.params.ttid = hiddenInput.value;
        }

        // 棰濆鐨勫弬鏁帮紝浼樺厛绾ч珮浜庡凡鏈夌殑鍙傛暟
        if (typeof extraParam === 'object') {
            for (var key in extraParam) {
                url.params[key] = extraParam[key];
            }
        }

        return url;
    }

    var iframe;
    function callInIframe(url) {
        if (!iframe) {
            iframe = doc.createElement('iframe');
            iframe.id = 'callapp_iframe_' + Date.now();
            iframe.frameborder = '0';
            iframe.style.cssText = 'display:none;border:0;width:0;height:0;';
            doc.body.appendChild(iframe);
        }

        iframe.src = url;
    }

    function setLocation(url, options) {
        if (options.replace !== false && (taobaoApp || options.replace === true)) {
            location.replace(url);
        } else {
            location.href = url;
        }
    }

    lib.callapp.gotoPage = function(url, options) {
        options = options || {};

        if (typeof options.point === 'undefined') {
            options.point = true; // 榛樿涓簍rue
        }
        if (typeof options.params === 'undefined') {
            options.params = true; // 榛樿涓簍rue
        }

        var originUrl = url || location.href;
        var originProtocal = originUrl.match(/^(https?|taobao(?:webview)?)\:\/\//);
        if (originProtocal) {
            originProtocal = originProtocal[1];
            url = originUrl.replace(/^taobao(?:webview)?\:\/\//, 'http://');
        } else {
            throw new Error('protocal invalid');
        }

        url = new HttpURL(url);
        url.protocal = originProtocal;

        if ((url.protocal === 'http' || url.protocal === 'https')) {  // 涓轰簡缁熶竴缁欏鎴风鎵撶偣锛岄兘鐢╰aobaowebview鍗忚
            //&& (!taobaoApp || taobaoApp && taobaoApp.platform === 'Apad')) { // http(s)鍗忚锛屼笖涓嶅湪webview涓紝浼氬敜璧峰鎴风骞跺湪webview涓墦寮€
            url = new HttpURL('http://m.taobao.com/');
            url.protocal = 'taobaowebview';
            url.params.weburl = originUrl;
        }/* else if (url.protocal === 'taobaowebview' && taobaoApp && taobaoApp.platform !== 'Apad') { //taobaowebview鍗忚锛屼笖鍦╳ebview涓紝鐩存帴鏀规垚http璁块棶
         url = new HttpURL(url.params.weburl);
         }*/

        if (url.protocal === 'taobao') {
            if (options.point) {
                appendPoint(url, options.point);
            }

            if (options.params) {
                appendParam(url, options.params);
            }
        } else if (url.protocal === 'taobaowebview') {
            if (options.point) {
                appendPoint(url, options.point);
            }

            var weburl = new HttpURL(url.params.weburl);
            if (options.params) {
                appendParam(weburl, options.params);
            }
            url.params.weburl = weburl.toString();
        } else {
            if (options.params) {
                appendParam(url, options.params);
            }
        }

        if (browser.isChrome && os.isAndroid && os.version.lt('4.4')) {
            url.hash = 'Intent;scheme=' + url.protocal + ';package=com.taobao.taobao;end';
            url.protocal = 'intent';
        }

        if (taobaoApp && taobaoApp.platform != 'Apad' || (!taobaoApp && browser.isChrome && os.isAndroid)) {
            setTimeout(function(){
                setLocation(url.toString(), options);
            }, 100);
        } else {
            callInIframe(url.toString());
        }
    }

    lib.callapp.download = function(url, options){
        options = options || {};
        if (!url) {
            url = os.isIPhone?'http://itunes.apple.com/cn/app/id387682726?mt=8':
                (os.isIPad?'https://itunes.apple.com/app/id438865278':
                    (os.isAndroid?'http://download.taobaocdn.com/wireless/taobao4android/latest/taobao4android_703248.apk':''));
        }

        url = new HttpURL(url);

        if (os.isAndroid && url.pathname.match(/\.apk$/)) {
            url.search = '';
            url.hash = '';
        } else if (options.params) {
            appendParam(url, options.params);
        }

        url = url.toString();
        setLocation(url, options);
    }

})(window, window['lib'] || (window['lib'] = {}));