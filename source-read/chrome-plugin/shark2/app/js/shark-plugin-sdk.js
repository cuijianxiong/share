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
        transLists: [],
        filterdArray: [],
        selectedArray: [],
        isMinisize: false,
        page: 0,
        pagesize: 4,
        language: 'en-US',
        appID: 10000,
        pageID: 31,
        editNo: null,
        isHistoryShow: false,
        getTranslationPublished: null,
        uploadTranstion : 'http://m.ctrip.com/restapi/soa2/12110/bjjson/updatetranslationcontentbyid',
        getHistoryTrans : 'http://m.ctrip.com/restapi/soa2/12110/bjjson/gettranslationhistorylistbytranspkid',
        loginUrl : 'http://m.ctrip.com/restapi/soa2/12110/bjjson/login',
        init: function () {
            var _this = this;
            $('.regionItem').click(function () {
                $('.regionContent').text($(this).find("a").text())
            })
            $(".loginBtn").click(function () {
                chrome.tabs.query(
                    {active: true, currentWindow: true, windowType: 'normal'},
                    function (tabs) {
                        console.log(tabs);
                        console.log(tabs[0].id);
                        chrome.tabs.sendMessage(tabs[0].id,
                            {message: "active"},
                            function (response) {
                                console.log(response);
                                var url = tabs[0].url.toLowerCase();
                                if (url.indexOf('env=fws') > 0) {
                                    // if (1>0){
                                    _this.loginUrl = 'http://gateway.m.fws.qa.nt.ctripcorp.com/restapi/soa2/12110/bjjson/login';
                                } else {
                                    _this.loginUrl = 'http://m.ctrip.com/restapi/soa2/12110/bjjson/login';
                                }
                                var params = {};
                                params.username = $('#username').val();
                                params.password = $('#password').val();
                                params.region = $('.regionContent').text();
                                _this.getData(_this.loginUrl, params).then(function (res) {
                                    var user = res.user
                                    _this.setCookie('pluginToken', user.token, user.tokenExpireTime)
                                    _this.tolistPage()
                                }, function () {
                                    $('.loginTip').show()
                                    setTimeout(function () {
                                        $('.loginTip').hide()
                                    }, 2000)
                                })
                            }
                        )
                    }
                )

            });
            this.hasLogin();
        },
        getCookie: function (name) {
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg))
                return unescape(arr[2]);
            else
                return null;
        },
        setCookie: function (name, value, expiretime) {
            document.cookie = name + '=' + value + ';expires=' + expiretime
        },
        delCookie: function (name) {
            var exp = new Date()
            exp.setTime(exp.getTime()-1)
            this.setCookie(name,'',exp)
        },
        hasLogin: function () {
            var _this = this;
            if (_this.getCookie('pluginToken')) {
                _this.tolistPage();
            }
        },
        tolistPage: function () {
            var _this = this
            $('.login').hide();
            $('.listPage').html($('#content').html());
            $("[data-toggle='tooltip']").tooltip();
            $(".icon-spinner11").click(function () {
                $('.listPage').html($('#content').html());
                _this.getTab()
            })
            _this.getTab()
        },
        //获取tab页信息
        getTab: function() {
            var _this = this
            chrome.tabs.query(
                {active: true, currentWindow: true, windowType: 'normal'},
                function (tabs) {
                    console.log(tabs);
                    console.log(tabs[0].id);
                    chrome.tabs.sendMessage(tabs[0].id,
                        {message: "active"},
                        function (response) {
                            console.log(response);
                            if (response == null){
                               document.body.innerHTML='<div class="alert alert-warning" role="alert" style="margin-bottom: 0">please refresh or reopen your web page！</div>'
                                return
                            }
                            var url = tabs[0].url.toLowerCase();
                            if (url.indexOf('env=fws') > 0) {
                                // if (1>0){
                                _this.getTranslationPublished = 'http://gateway.m.fws.qa.nt.ctripcorp.com/restapi/soa2/12110/bjjson/getTranslationContentByAppIDAndStatus'
                                _this.uploadTranstion = 'http://gateway.m.fws.qa.nt.ctripcorp.com/restapi/soa2/12110/bjjson/updatetranslationcontentbyid';
                                _this.getHistoryTrans = 'http://gateway.m.fws.qa.nt.ctripcorp.com/restapi/soa2/12110/bjjson/gettranslationhistorylistbytranspkid';
                                _this.loginUrl = 'http://gateway.m.fws.qa.nt.ctripcorp.com/restapi/soa2/12110/bjjson/login';
                            } else {
                                _this.getTranslationPublished = 'http://m.ctrip.com/restapi/soa2/12110/bjjson/gettranslationcontentbyappidandstatus';
                                _this.uploadTranstion = 'http://m.ctrip.com/restapi/soa2/12110/bjjson/updatetranslationcontentbyid';
                                _this.getHistoryTrans = 'http://m.ctrip.com/restapi/soa2/12110/bjjson/gettranslationhistorylistbytranspkid';
                                _this.loginUrl = 'http://m.ctrip.com/restapi/soa2/12110/bjjson/login';
                            }
                            _this.language = response.language ? response.language : '';
                            _this.appID = response.appID ? response.appID : 0;
                            _this.pageID = response.pageID ? response.pageID : 0;
                            _this.initListPage();
                        }
                    )
                }
            )
        },
        getData: function (url, params) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var head = {
                    language: "ENGLISH",
                    source: "ANDROID",
                    currency: "CNY",
                    paymentCurrency: "CNY",
                    paymentCurrencyList: [],
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
                    osVer: 0,
                }
                params.head = head
                params.head.token = _this.getCookie('pluginToken') || 'String'
                $.ajax({
                    type: 'post',
                    url: url,
                    data: JSON.stringify(params),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        if (data.resultType.resultCode === "10000") {
                            resolve(data);
                        } else {
                            reject();
                        }
                    },
                    error: function (e) {
                        reject();
                    }
                });
            })
        },
        //一些初始化动作
        initListPage: function () {
            var _this = this
            $(".translation").text(_this.language);
            _this.getLists();
            $(".historyContent").hide();
            //点击了history
            $('.historynav').click(function () {
                if ( _this.isHistoryShow) return;
                _this.isHistoryShow = ! _this.isHistoryShow;
                $('.keyContent').hide();
                $('.historyContent').show();
                _this.getHistory();
            });
            //点击了key
            $('.keynav').click(function () {
                if (!_this.isHistoryShow) return;
                _this.isHistoryShow = !_this.isHistoryShow;
                $('.historyContent').hide();
                $('.keyContent').show();
            });
            $('.icon-search').click(function () {
                _this.filterTrans($('#search').val());
            })
            $('.nextPage').click(function () {
                var totolPages = Math.floor((_this.selectedArray.length - 1) / _this.pagesize);
                if (_this.page + 1 > totolPages) return;
                _this.page = _this.page + 1;
                _this.updateLists(_this.page)
            });
            $('.prePage').click(function () {
                if (_this.page === 0) return;
                _this.page = _this.page - 1;
                _this.updateLists(_this.page);
            });
            //最小化按钮点击
            $('.miniBtn').click(function (e) {
                if (_this.isMinisize) {
                    $('.main').show()
                    $(this).text('-');
                } else {
                    $('.main').hide();
                    $(this).text('+');
                }
                _this.isMinisize = !_this.isMinisize;
            });

            //save按钮点击
            $('.save').click(function () {
                if (checkInputs()) {
                    $('#myModal').modal()
                }
            });
            function checkInputs() {
                if (!$('#source').val() && !$('#language').val()) {
                    return false;
                }
                return true;
            };
            $('.discard').click(function () {
                $('.keyContent input').val('');
            })
            $('.modalCancel').click(function () {
                $('.keyContent input').val('');
            });
            $('.modalConfirm').click(function () {
                _this.saveEdit();
                $('#myModal').modal('hide');
            });
            $('.prev').click(function () {
                _this.prevEdit();
            });
            $('.loginout').click(function () {
                _this.delCookie('pluginToken')
                $('.listPage').html('')
                $('.login').show()
            })
        },
        //获取数据
        getLists: function () {
            var _this = this;
            var params = {};
            var queryBean = {};
            queryBean.appID = Number(_this.appID);
            queryBean.pageID = Number(_this.pageID);
            params.queryBean = queryBean
            _this.getData(_this.getTranslationPublished, params).then(function (res) {
                _this.transLists = res.translationContentList;
                _this.MergeDatas(_this.transLists);
                _this.filterTrans();
            }, function () {
                console.log('接口错误');
            });
        },
        //根据输入的值筛选出符合条件的数组
        filterTrans: function (val) {
            var _this = this
            if (!val) {
                _this.selectedArray = _this.filterdArray.concat();
            } else {
                var temparr = [];
                for (var i = 0; i < _this.filterdArray.length; i++) {
                    var trans = _this.filterdArray[i];
                    //大小写不敏感
                    var re = new RegExp(val, 'gi');
                    if (re.test(trans.firstColunm) || re.test(trans.secondColunm)) {
                        temparr.push(trans);
                    }
                }
                _this.selectedArray = temparr;
            }
            _this.updateLists(0);
            if (_this.selectedArray.length > 0) {
                _this.editNo = 0;
                _this.editTrans(_this.editNo);
            }
        },
        //合并
        MergeDatas: function (datas) {
            var _this = this
            var copyarr = datas.concat();
            if (_this.language === 'en-US') {
                var firstColunm = 'ORIGIN';
                var seconfColunm = 'en-US';
            } else {
                var firstColunm = 'en-US';
                var seconfColunm = _this.language;
            }
            for (var i = 0; i < copyarr.length; i++) {
                var trans = copyarr[i];
                if (trans.locale !== firstColunm && trans.locale !== seconfColunm) {
                    continue
                } else {
                    var newtrans = new Object();
                    newtrans.firstColunm = '';
                    newtrans.secondColunm = '';
                    _this.filterdArray.push(newtrans);
                    if (trans.locale === firstColunm) {
                        newtrans.firstColunm = trans.transValue;

                    }
                    if (trans.locale === seconfColunm) {
                        newtrans.secondColunm = trans.transValue;
                        newtrans.transPKID = trans.transID;
                        newtrans.transDesc = trans.transDesc;
                    }
                    newtrans.transKey = trans.transKey;
                    for (var j = i + 1; j < copyarr.length; j++) {
                        if (copyarr[j].transKey === newtrans.transKey) {
                            if (copyarr[j].locale === firstColunm) {
                                newtrans.firstColunm = copyarr[j].transValue;

                            }
                            if (copyarr[j].locale === seconfColunm) {
                                newtrans.secondColunm = copyarr[j].transValue;
                                newtrans.transPKID = copyarr[j].transID;
                                newtrans.transDesc = copyarr[j].transDesc;
                            }
                            copyarr.splice(j, 1);
                            // break;
                        }
                    }
                }
            }
            _this.filterdArray = _this.filterdArray.filter(function (item) {
                return item.hasOwnProperty('transPKID');
            });
        },
        //根据页码更新表格
        updateLists: function (page) {
            var _this = this
            if (_this.language === 'en-US') {
                var firstColunm = 'ORIGIN';
                var seconfColunm = 'en-US';
            } else {
                var firstColunm = 'en-US';
                var seconfColunm = _this.language;
            }
            var html = '<thead><tr><th>' + firstColunm + '</th><th>' + seconfColunm + '</th><th>&nbsp</th></tr></thead><tbody>';
            var start = _this.page * _this.pagesize;
            var end = (_this.page * _this.pagesize + _this.pagesize - 1) > _this.selectedArray.length - 1 ? _this.selectedArray.length - 1 : _this.page * _this.pagesize + _this.pagesize - 1;
            var temparr = _this.selectedArray.slice(start, end + 1);
            temparr.forEach(function (item, i) {
                var firstColumn = item.firstColunm || '&nbsp';
                var secondColumn = item.secondColunm || '&nbsp';
                var number = start + i;
                var row = '<tr class="transtr" key="' + number + '" >' +
                    '<td class="firstColunm">' + firstColumn + '</td>' +
                    '<td class="secondColumn">' + secondColumn + '</td>' +
                    '<td class="keyOptions">' +
                    '<span class="icon-eye"></span>' +
                    '</td>' +
                    '</tr>';
                html += row;
            });
            html += '</tbody>'
            $('table').html(html);
            $('.transtr').click(function () {
                _this.editTrans($(this).attr('key'));
            })
            $('.icon-eye').click(function (e) {
                //e.stopPropagation();
                if ($(this).hasClass('icon-eye-select')) {
                    $(this).removeClass('icon-eye-select')
                } else {
                    $('.icon-eye').removeClass('icon-eye-select');
                    $(this).addClass('icon-eye-select')
                }
                var key = $(this).parents('tr').attr('key');
                console.log(key);
                _this.hightlightTrans(key);
            });
        },
        //保存修改
        saveEdit: function () {
            var editTrans = this.selectedArray[this.editNo];
            editTrans = JSON.parse(JSON.stringify(editTrans));
            editTrans.firstColunm = $('#source').val();
            editTrans.secondColunm = $('#language').val();
            editTrans.transDesc = $('#comments').val();
            this.uploadChanges(editTrans);
        },
        //预览修改
        prevEdit: function () {
            var editTrans = this.selectedArray[this.editNo];
            var content = {}
            content.transKey = editTrans.transKey
            content.prev = editTrans.secondColunm;
            content.next = $('#language').val();
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {message: "prev", content: content});
            })
        },
        //提交修改
        uploadChanges: function (trans) {
            var _this = this
            var params = {};
            var queryBean = {};
            queryBean.transID = trans.transPKID;
            queryBean.transValue = trans.secondColunm;
            queryBean.transDesc = trans.transDesc;
            params.queryBean = queryBean
            _this.getData(_this.uploadTranstion, params).then(function (res) {
                $(".transtr").each(function () {
                    if ($(this).attr("key") == _this.editNo) {
                        $(this).find(".firstColunm").text($('#source').val());
                        $(this).find(".secondColumn").text($('#language').val());
                    }
                });
                _this.selectedArray[_this.editNo].secondColunm = $('#language').val();
                _this.selectedArray[_this.editNo].transDesc = $('#language').val();
                for (var i = 0; i < filterdArray.length; i++) {
                    if (_this.filterdArray[i].transKey === editTrans.transKey) {
                        //filterdArray[i].firstColunm=$('#source').val();
                        _this.filterdArray[i].secondColunm = $('#language').val();
                        _this.filterdArray[i].transDesc = $('#comments').val();
                    }
                }
                // notifyContentScript()
            }, function () {
                alert('接口错误')
            });
        },
        //编辑
        editTrans: function (key) {
            this.editNo = key;
            if (this.isHistoryShow){
                this.getHistory();
            }
            var item = this.selectedArray[key];
            $('#source').val(item.firstColunm);
            $("#language").val(item.secondColunm);
            $("#comments").val(item.transDesc);
            $('.keynav').text(item.transKey);
        },
        //获取历史记录数据
        getHistory: function () {
            var _this = this
            var params = {};
            var queryBean = {};
            queryBean.transPKID = _this.selectedArray[_this.editNo].transPKID;
            params.queryBean = queryBean
            _this.getData(_this.getHistoryTrans, params).then(function (res) {
                _this.updateHistorylist(res.translationContentHistoryList.splice(0, 5));
            }, function (res) {
                alert("interface error.")
            });
        },
        //更新历史数据列表
        updateHistorylist: function (data) {
            var html = '';
            data.forEach(function (item,index) {
                var row = '<li class="list-group-item"><span class="item-no">' + (index+1) + '</span>' + item.transValue + '</li>';
                html += row;
            });
            $('.list-group').html(html);
        },
        //高亮
        hightlightTrans: function (key) {
            var item = this.selectedArray[key];
            var content = {};
            content.text = item.secondColunm;
            content.transKey = item.transKey;
            console.log(content);
            console.log('||---------------------------------------||');
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {message: "highlight", content: content});
            })
        }
    }
    new SharkPlugin();
})(window, $)