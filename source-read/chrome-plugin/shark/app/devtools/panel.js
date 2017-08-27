(function (window, $) {
    'use strict';
    function SharkPlugin(cfg) {
        var config = cfg || {};
        this.get = function (n) {
            return config[n];
        };
        this.set = function (n, v) {
            config[n] = v;
        };
        this.init();
    }
    SharkPlugin.prototype = {
        appID: 10086,
        uploadTranstion : 'http://m.ctrip.com/restapi/soa2/12110/bjjson/updatetranslationcontentbyid',
        loginUrl : 'http://m.ctrip.com/restapi/soa2/12110/bjjson/login',
        getValueByKey: 'http://m.ctrip.com/restapi/soa2/12110/bjjson/listTranslationContentByCondition',
        backgroundPageConnection: null,
        currentTrans: null,
        selectLang: null,
        init: function () {
            var _this = this;
            _this.loginClick = false
            _this.connect()
        },
        //建立连接
        connect:function () {
            this.backgroundPageConnection = chrome.runtime.connect({
                name: "panel"
            });
            this.messageHandler()
            this.backgroundPageConnection.postMessage({
                name: 'init',
                tabId: chrome.devtools.inspectedWindow.tabId
            });
            this.backgroundPageConnection.postMessage({
                name: 'active',
                tabId: chrome.devtools.inspectedWindow.tabId
            });
            this.backgroundPageConnection.postMessage({
                name: 'addcookie',
                tabId: chrome.devtools.inspectedWindow.tabId
            });
            this.backgroundPageConnection.postMessage({
                name: 'delcookie',
                tabId: chrome.devtools.inspectedWindow.tabId
            });
        },
        //通信处理
        messageHandler:function() {
            var _this = this;
            _this.backgroundPageConnection.onMessage.addListener(function (message) {
                switch (message.name){
                    case 'keyCallBack':
                        _this.keyCallBack(message)
                        break
                    case 'activeCallBack':
                        _this.activeCallBack(message)
                        break
                    default:
                        break
                }
            })
        },
        keyCallBack: function (message) {
            var _this = this;
            var key = message.key;
            var value = message.value;
            $("#mask").hide();
            $('#key').val(key);
            $('#value').val(value);
            var params = {};
            params.queryBean ={};
            params.queryBean.appID = _this.appID;
            params.queryBean.transKey = key;
            
            _this.getData(_this.getValueByKey,params).then(function (res) {
                if (res && res.translationContentList){
                    _this.currentTrans = res.translationContentList;
                    _this.updateTable(_this.currentTrans);
                }else {
                    _this.selectLang = null;
                    $('table').html('');
                    $('#transVaule').val('');
                }
            },function (res) {
                console.log(res)
                // $('.loadingWrapper').hide()
            })
        },
        activeCallBack:function (message) {
            var _this = this
            if (!message.appID){
                $('.loginwrapper').hide()
                $("body").append("<h1>This page doesn't have shark_appid</h1>")
                return
            }
            $("#loginBtn").click(function () {

                if (_this.loginClick) return
                _this.loginClick = true
                // $('.loadingWrapper').show()

                var params = {}
                params.username = $('#username').val()
                params.password = $('#password').val()
                params.region = $('.regionContent').text()
                _this.getData(_this.loginUrl, params).then(function (res) {
                    _this.loginClick = false
                    var user = res.user
                    _this.setCookie('pluginToken', user.token, user.tokenExpireTime)                    
                    _this.tolistPage()
                }, function () {
                    _this.loginClick = false
                    // $('.loadingWrapper').hide()
                    $('.loginTip').show()
                    setTimeout(function () {
                        $('.loginTip').hide()
                    }, 2000)
                })
            });
            var url = message.url.toLowerCase()
            if (url.indexOf('env=fws') > 0) {
                _this.loginUrl = 'http://gateway.m.fws.qa.nt.ctripcorp.com/restapi/soa2/12110/bjjson/login'
                _this.uploadTranstion = 'http://gateway.m.fws.qa.nt.ctripcorp.com/restapi/soa2/12110/bjjson/updatetranslationcontentbyid'
                _this.getValueByKey = 'http://gateway.m.fws.qa.nt.ctripcorp.com/restapi/soa2/12110/bjjson/listTranslationContentByCondition/?subEnv=fat90'
            } else {
                _this.loginUrl = 'http://m.ctrip.com/restapi/soa2/12110/bjjson/login'
                _this.uploadTranstion = 'http://m.ctrip.com/restapi/soa2/12110/bjjson/updatetranslationcontentbyid'
                _this.getValueByKey = 'http://m.ctrip.com/restapi/soa2/12110/bjjson/listTranslationContentByCondition'
            }
            _this.appID = parseInt(message.appID)
            if(_this.getCookie('pluginToken')){
                _this.tolistPage()
            }else {
                //$('.loginwrapper').html($('#login').html())
                $('.regionItem').click(function () {
                    $('.regionContent').text($(this).find("a").text())
                })

            }
        },
        updateTable:function (trans) {
            var _this = this;
            if (!trans){
                return;
            }
            var html = '<thead><tr><th>languange</th><th>transValue</th></tr></thead><tbody>';
            trans.forEach(function (item,i) {
                if(item.locale.toLowerCase()!=='origin'){
                    var row = '<tr class="transtr" lang="' + item.locale + '" >' +
                        '<td class="firstColunm">' + item.locale + '</td>' +
                        '<td class="secondColumn">' + item.transValue + '</td>' +
                        '</tr>';
                    html += row;
                }
            })
            html += '</tbody>';
            $('table').html(html);
            _this.selectLang = null;
            _this.renderInput();

            $('.transtr').click(function () {
                var _lang = $(this).attr('lang');
                if (_this.selectLang === _lang) return;
                $('.transtr').removeClass('transselected');
                $(this).addClass('transselected');
                _this.selectLang = _lang;
                _this.renderInput();
            });
        },
        //渲染下面输入框
        renderInput:function () {
            var _this = this
            if (_this.selectLang === null){
                $('#transVauleLabel').text('')
                $('#transVaule').val('')
                $('#description').val('')
            }else {
                var item = _this.getTransItemByLang(_this.currentTrans, _this.selectLang);
                $('#transVaule').val(item.transValue);
                $('#description').val(item.transDesc);
                $('#transVauleLabel').text(item.locale);
            }
        },
        getTransItemByLang:function(trans,lang){
            var val;
            if(trans && lang){
               trans.forEach(function(item,index){
                    if(item.locale === lang){
                        val = item;
                    }
               });
            }
            return val;
        },
        getCookie: function (name) {
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
            if (arr = document.cookie.match(reg))
                return unescape(arr[2])
            else
                return null;
        },
        setCookie: function (name, value, expiretime) {
            document.cookie = name + '=' + value + ';expires=' + expiretime
        },
        delCookie: function (name) {
            var exp = new Date()
            exp.setTime(exp.getTime()-1)
            this.setCookie(name,'',exp.toGMTString())
        },
        tolistPage: function () {
            var _this = this
            $('.loginwrapper').hide();
            $('.listPage').html($('#content').html());
            // $('.loadingWrapper').hide()
            _this.initListPage()
        },
        getData: function (url, params) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var head = {
                    language: "ENGLISH",
                    source: "ANDROID",
                    currency: "CNY",
                    paymentCurrency: "CNY",
                    paymentCurrencyList: ["CNY"],
                    version: "String",
                    uID: "String",
                    token: "String",
                    tokenValidTime: "String",
                    iP: "String",
                    isQuickBooking: 0,
                    deviceID: "String",
                    aPIKey: "String",
                    clientSign: "String",
                    clientSignTime: 0,
                    clientID: "String",
                    brand: "String",
                    model: "String",
                    osVer: 0
                }
                params.head = head
                params.head.token = _this.getCookie('pluginToken') || 'String'
                // alert(url)
                // alert(JSON.stringify(params))
                $.ajax({
                    type: 'post',
                    url: url,
                    data: JSON.stringify(params),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        // alert(JSON.stringify(data))
                        if (data.resultType.resultCode === "10000") {
                            resolve(data);
                        } else {
                            reject(data);
                        }
                    },
                    error: function (e) {
                        reject(e);
                    }
                });
            })
        },
        //一些初始化动作
        initListPage: function () {
            var _this = this;

            _this.backgroundPageConnection.postMessage({
                name: 'addcookie',
                tabId: chrome.devtools.inspectedWindow.tabId
            });

            $('#preview').click(function () {
                _this.backgroundPageConnection.postMessage({
                    name : "preview",
                    key: $('#key').val(),
                    value: $('#transVaule').val(),
                    tabId: chrome.devtools.inspectedWindow.tabId
                });
            });
            $('#discard').click(function () {
                var item = _this.getTransItemByLang(_this.currentTrans, _this.selectLang);
                $('#transVaule').val(item.transValue||'');
                $('#description').val(item.transDesc||'');
            });

            $('#save').click(function () {
                var params = {};
                var queryBean = {};
                var transValue = $('#transVaule').val();
                if (transValue === ''){ 
                    $('#message').text('TransValue is required.');
                    $('#mask').show();
                    return;
                }
                if(_this.selectLang == null) {
                    $('#message').text('Please select a Transvalue.');
                    $('#mask').show();
                    return;
                }
                var selectItem = _this.getTransItemByLang(_this.currentTrans, _this.selectLang);
                if(!selectItem){
                    $('#message').text('Fail, Transvalue is not existed.');
                    $('#mask').show();
                    return;
                }
                queryBean.transID = selectItem.transID;
                queryBean.transDesc = $('#description').val();
                queryBean.transValue = transValue;
                params.queryBean = queryBean;
                _this.getData(_this.uploadTranstion, params).then(function (res) {
                    $('#message').text('Save successfully.');
                    $('#mask').show();
                    setTimeout(function(){
                        _this.keyCallBack({key:$('#key').val(),value:$('#value').val()});
                        $('#mask').hide();
                    },500);
                }, function (res) {
                    $('#message').text('Failed, please try again later.');
                    $('#mask').show();
                });
            });

            $('#mask').click(function(){
                $("#mask").hide();
            });

            $('#loginout').click(function () {
                _this.backgroundPageConnection.postMessage({
                    name: 'delcookie',
                    tabId: chrome.devtools.inspectedWindow.tabId
                });

                _this.delCookie('pluginToken')
                $('.listPage').html('')
                $('.loginwrapper').show()
            })
            $("#doshark").click(function(){
                _this.backgroundPageConnection.postMessage({
                    name: 'doshark',
                    tabId: chrome.devtools.inspectedWindow.tabId
                });
            })
        }
    }
    new SharkPlugin();
})(window, $)