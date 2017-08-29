/**
 * Created by gy.wang on 17/5/3.
 */

var preHighLightText = null;

(function(){
    chrome.extension.onMessage.addListener(
        function (request,sender,sendResponse) {
            if (request.message=="change"){
                return;
            }
            if (request.message == "active"){
                var response =getIDandLanguage();
                insertCookie()
                sendResponse(response);
                return;
            }
            if (request.message == "prev"){
                changeDom(request.content)
                return;
            }
            if (request.message == "highlight"){
                highlight(request.content);
                return;
            }

            //高亮DOM
            function highlight(content){
                var text = content.text;
                if (preHighLightText === text){
                    console.log('点击了同一个')
                    //点击的是同一个 取消该元素的高亮状态 并把preHighLightText置成空
                    cancelHighlight()
                    preHighLightText = null
                }else if (!preHighLightText){
                    console.log('没有元素被选中')
                    //当前没有元素被选中
                    setHighlight(content)
                    preHighLightText = text
                }else {
                    //当前有元素被选中
                    console.log('当前有元素被选中')
                    cancelHighlight()
                    setHighlight(content)
                    preHighLightText = text
                }
            }
            function setHighlight(content) {
                var text = content.text;
                var key = content.transKey;
                var doms = filterDoms()
                for(var j=0;j<doms.length;j++){
                    var dom = doms[j]
                    highLightDom(dom,text,key)
                }
            }
            //检测元素
            function highLightDom(dom,text,key) {
                if (dom.getAttribute('data-key')===key) {
                    console.log(dom)
                    var bgColor = "yellow";
                    //var html = "<span class='highlight' style='background-color: "+bgColor+";'>"+dom.innerText+"</span>"
                    var html = "<span class='shark-highlight'>"+dom.innerText+"</span>"
                    dom.innerHTML = html
                } else if (dom.tagName === 'INPUT' && dom.type === 'text'&&dom.getAttribute('placeholder') === text){
                    dom.className += " shark-input-highlight";
                }else if (dom.innerText&&dom.innerText===text){
                    var bgColor = "yellow";
                    //var html = "<span class='highlight' style='background-color: "+bgColor+";'>"+dom.innerText+"</span>"
                    var html = "<span class='shark-highlight'>"+dom.innerText+"</span>"
                    dom.innerHTML = html
                }
            }
            //取消高亮
            function cancelHighlight() {
                var doms = document.getElementsByClassName('shark-highlight');
                for (var i =0;i<doms.length;i++){
                    var text = doms[i].innerText;
                    doms[i].parentNode.innerHTML=text
                }
                var inputs = document.getElementsByClassName('shark-input-highlight')
                for(var i=0;i<inputs.length;i++){
                    var classVal = inputs[i].getAttribute("class")
                    classVal = classVal.replace("shark-input-highlight","");
                    inputs[i].setAttribute("class",classVal );
                }
            }
            //获取id和语言
            function getIDandLanguage() {
                var response = new Object();
                response.pageID = document.getElementById('shark_pageid').value;
                response.language = document.getElementById('shark_language').value;
                response.appID = document.getElementById('shark_appid').value;
                console.log(response);
                return response;
            }
            function changeDom(content) {
                var text = content.prev;
                var next = content.next
                var key = content.transKey;
                var doms = filterDoms()
                for(var i=0;i<doms.length;i++){
                    var dom = doms[i]
                    changeDomValue(dom,text,key,next)
                }
            }
            function changeDomValue(dom,text,key,next) {
                if (dom.getAttribute('data-key')===key) {
                    dom.innerText = next
                } else if (dom.tagName === 'INPUT' && dom.type === 'text'&&dom.getAttribute('placeholder') === text){
                    dom.setAttribute('placeholder',next);
                }else if (dom.innerText&&dom.innerText===text){
                    dom.innerText = next
                }
            }
            function filterDoms() {
                var excludeNodes = ["SCRIPT","STYLE","AUDIO"]
                var body = document.getElementsByTagName('body')[0]
                var doms = body.getElementsByTagName('*')
                var eledoms = []
                for(var i = 0;i<doms.length;i++){
                    if (doms[i].nodeType === 1&&excludeNodes.indexOf(doms[i].tagName)<0){
                        eledoms.push(doms[i])
                    }
                }
                return eledoms;
            }
            function insertCookie() {
                if (!getCookie('shark_plugin')){
                    var date = new Date()
                    date.setDate(date.getDate()+90)
                    setCookie('shark_plugin',1,date.toGMTString())
                }
            }
            function getCookie(name) {
                var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
                if (arr = document.cookie.match(reg))
                    return unescape(arr[2]);
                else
                    return null;
            }
            function setCookie (name, value, expiretime) {
                document.cookie = name + '=' + value + ';expires=' + expiretime
            }
        }
    );
})();

