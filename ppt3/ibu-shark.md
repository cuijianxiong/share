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
# 整体设计
<img src="/img/shark-model-v2.png" style="margin: 0 auto;width:547px;height:795px;" />

[slide]
# Shark Portal #1
<img src="/img/shark-portal-com.png" style="margin: 0 auto;width:1035px;height:590px;" />

[slide]
# Shark Portal #2
<img src="/img/shark-portal-com-2.png" style="margin: 0 auto;width:1035px;height:590px;" />

[slide]
# Shark Portal #3
<img src="/img/shark-portal-com-3.png" style="margin: 0 auto;width:1035px;height:590px;" />

[slide]
# Shark Portal #4
<img src="/img/shark-portal-com-4.png" style="margin: 0 auto;width:1035px;height:590px;" />

[slide]
# Shark Portal #5
<img src="/img/shark-portal-com-5.png" style="margin: 0 auto;width:1035px;height:590px;" />

[slide]
# IBU Mobile Service
## 允许外网访问，接入Redis缓存服务
## 各客户端可以通过访问以下服务取得应用的多语言信息
```html
查询列表：http://m.ctrip.com/restapi/soa2/12110/json/getTranslationContentByAppIDAndStatus
获取增量：http://m.ctrip.com/restapi/soa2/12110/json/getTranslationContentPublishByAppIdAndStatusOrVersion
更新翻译：http://m.ctrip.com/restapi/soa2/12110/bjjson/updatetranslationcontentbyid
翻译历史：http://m.ctrip.com/restapi/soa2/12110/bjjson/gettranslationhistorylistbytranspkid
插件登录：http://m.ctrip.com/restapi/soa2/12110/bjjson/login
```
[slide]
# Shark Sketch plugin for Mac

* Installing Plugins
- Download the ZIP file and unzip
- http://git.dev.sh.ctripcorp.com/ibu/ibu-sketch-i18n-editor/repository/archive.zip?ref=master
- Open `IBUI18nEditor.sketchplugin`
* How to ?
* View Video Demo
- https://cdrive.cloud.ctripcorp.com/s/7M7gdB54JL5U31e


[slide]
# Shark Chrome Plugin
<img src="/img/shark-chrome-plugin.png" style="margin: 0 auto;width:1563px;height:982px;" />

[slide]
# Shark Chrome Plugin HTML Page Config
``` html
<div class="header">
    <span id="key-demo-done" class="left" data-key="key.demo.done">Done-v11</span>
    <span id="key-demo-passener" class="title" data-key="key.demo.passengerInfo">Passenger Info</span>
    <span id="key-demo-change" class="right"  data-key="key.demo.change">Change1</span>
</div>
```

```html
<input type="hidden" id="shark_appid" value="10000" />
<input type="hidden" id="shark_language" value="en-US" />
<input type="hidden" id="shark_pageid" value="31" />
```

[slide]
# Download Shark Chrome Plugin
### https://chrome.google.com/webstore/search/shark-plugin
<img src="/img/shark-chrome-plugin-down.png" style="margin: 0 auto;width:1563px;height:982px;" />

[slide]
# Shark JAVA & .NET SDK
http://conf.ctripcorp.com/display/gjwz/01.+Shark+SDK

[slide]
# Q&A