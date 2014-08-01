## 综述

WakeUpApp用于手机或pad浏览器页面唤醒app，没有ui层，预置了手机淘宝客户端的判断处理。


实现思路参考[callApp](http://gitlab.alibaba-inc.com/mtb/lib-callapp/tree/master)，callApp耦合了手机淘宝的业务判断，不够通用，WakeUpApp基于kissy mini做了重构和业务抽离，能够应用于其他客户端跳转。

* 版本：2.0.0
* 作者：明河
* demo：[http://kg.kissyui.com/wake-up-app/2.0.0/demo/mini.html](http://kg.kissyui.com/wake-up-app/2.0.0/demo/mini.html)

## 初始化组件
		
    S.use('kg/wake-up-app/2.0.0/mini,kg/wake-up-app/2.0.0/app/taobao', function (S, WakeUpApp,Taobao) {
        new WakeUpApp({app: new Taobao()}).render('taobaowebview://m.taobao.com/?weburl='+location.href);
    })

**kg/wake-up-app/2.0.0/app/taobao**模块是针对手机淘宝的处理，如果是其他客户端，需要复写这个类方法和配置。

实例化组件：

    new WakeUpApp({app: new Taobao()})

app 参数为客户端业务模块实例，必不可少。

调用**render()**方法，在手机装有客户端的情况下就会唤醒客户端，没有的话跳转到下载页面。

render()的第一个参数为要跳转的url，必不可少。

## 方法说明

### render(url)

唤醒客户端,并跳转到指定页面。

    wakeUpApp.render('taobaowebview://m.taobao.com/?weburl='+location.href);

### download(url)

跳转到下载页面，如果没有传递参数，会使用app类中的配置地址。

    wakeUpApp.download();

## App实例

    var app = new Taobao();

**app.isIn** ：页面是否在客户端内。

**app.inAppReg** : 判断app的正则表达式，可以复写，默认为 /@taobao_(iphone|android|ipad|apad)_([\d\.]+)/
**app.package** : 安卓的包名，可以复写，默认为 com.taobao.taobao
