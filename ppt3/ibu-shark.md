title: IBU Shark 2.0
speaker: gy.wang
url: http://shark.ibu.ctripcorp.com/
transition: slide3
theme: moon
usemathjax: no

[slide]
<img src="/img/shark-logo.png" style="margin: 0 auto;width:200px;height:200px;" />
# [IBU Shark 2.0](http://shark.ibu.ctripcorp.com/)


[slide]
# [http://shark.ibu.ctripcorp.com/](http://shark.ibu.ctripcorp.com/)
## <iframe data-src="http://shark.ibu.ctripcorp.com/" src="about:blank;"></iframe>

[slide]
# 整体设计
<img src="/img/shark-model-v2.png" style="margin: 0 auto;width:547px;height:795px;" />

[slide]
# 服务器部署
<img src="/img/shark-server-v2.png" style="margin: 0 auto;width:678px;height:602px;" />

[slide]
# 功能模块
## [Shark Portal](#5)
## [IBU Mobile Service](#6)
## [IBU Shark Service](#7)
## [Shark Sketch plugin](#8)
## [Shark JS SDK](#9)
## [Shark Chrome Plugin](#10)
## [Shark JAVA & .NET SDK](#11)

[slide]
# Shark Portal
<img src="/img/shark-portal-com.png" style="margin: 0 auto;width:1035px;height:590px;" />

[slide]
# IBU Mobile Service
## 允许外网访问，接入Redis缓存服务
```html
查询列表：http://m.ctrip.com/restapi/soa2/12110/json/getTranslationContentByAppIDAndStatus
获取增量：http://m.ctrip.com/restapi/soa2/12110/json/getTranslationContentPublishByAppIdAndStatusOrVersion
更新翻译：http://m.ctrip.com/restapi/soa2/12110/bjjson/updatetranslationcontentbyid
翻译历史：http://m.ctrip.com/restapi/soa2/12110/bjjson/gettranslationhistorylistbytranspkid
插件登录：http://m.ctrip.com/restapi/soa2/12110/bjjson/login
```
[slide]
# IBU Shark Service
## 仅支持内网访问

[slide]
# Shark Sketch plugin

* Installing Plugins
- [Download the ZIP file](http://git.dev.sh.ctripcorp.com/ibu/ibu-sketch-i18n-editor/repository/archive.zip?ref=master) and unzip
- Open `IBUI18nEditor.sketchplugin`
* How to
* [Video Demo](https://cdrive.cloud.ctripcorp.com/s/7M7gdB54JL5U31e)

[slide]
# Shark JS SDK
```html
<input type="hidden" id="shark_appid" value="10000" />
<input type="hidden" id="shark_language" value="en-US" />
<input type="hidden" id="shark_pageid" value="31" />
<script src="shark-client-sdk.js"></script>
```
```javascript
$(function(){
    i18n_json = JSON.parse(window.localStorage.i18n);
    console.log(i18n_json["en-US"]["key.add.passengerInfo"]);
});
```
<img src="/img/js-sdk.png" style="margin: 0 auto;width:653px;height:168px;" />
<img src="/img/shark-localstorage.png" style="margin: 0 auto;width:527px;height:232px;" />

[slide]
# Shark Chrome Plugin
<img src="/img/shark-chrome-plugin.png" style="margin: 0 auto;width:1563px;height:982px;" />

[slide]
# Shark JAVA & .NET SDK
http://conf.ctripcorp.com/display/gjwz/01.+Shark+SDK

[slide]
# Q&A