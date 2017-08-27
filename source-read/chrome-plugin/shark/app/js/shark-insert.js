(function () {
    var preHighLightKey = null;
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        console.log(request);
        if (request.name === "delcookie"){            
            delCookie('shark_plugin');
            window.removeEventListener('click',clickHandler);
            window.location.reload();
        } else if (request.name === "addcookie"){
            insertCookie('shark_plugin');
            window.removeEventListener('click',clickHandler);
            window.location.reload();
        } else if (request.name === "refresh"){
            window.location.reload();
        } else if (request.name === "doshark"){
            window.addEventListener('click',clickHandler);
            replaceSharkDomContent();
        } else if (request.name === "preview") {
            var doms = document.querySelectorAll('[data-key]')
            for (var i = 0; i < doms.length; i++) {
                var dom = doms[i]
                if (dom.getAttribute('data-key') === request.key) {
                    if (dom.type === 'text') {
                        dom.setAttribute('placeholder', request.value)
                    } else {
                        dom.innerText = request.value
                    }
                }
            }
        } else if (request.name === "active") {
            //active
            var content = {};
            var idInput = document.getElementById('shark_appid');
            content.appID = idInput ? idInput.value : '';
            if (content.appID){
                window.addEventListener('click',clickHandler);
            }else {
                window.removeEventListener('click',clickHandler);
            }
            content.url = location.href;
            content.name = 'activeCallBack';
            chrome.runtime.sendMessage(content, function (response) {
                //console.log(response);
            });
        } else {
            //inspect
            sendResponse({inspect:true})
        }
    });
    function insertCookie(name) {
        if (!getCookie(name)) {
            var date = new Date();
            date.setDate(date.getDate() + 90);
            setCookie(name, 1, date.toGMTString());
        }
    }
    function delCookie(name) {
        var exp = new Date();
        exp.setTime(exp.getTime()-1);
        setCookie(name,'',exp.toGMTString());
    }
    function getCookie(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    }
    function setCookie(name, value, expiretime) {
        document.cookie = name + '=' + value + ';expires=' + expiretime + ';path=/'+';domain='+document.domain
    }

    function setHighlight(key) {
        var doms = document.querySelectorAll('[data-key]')
        for (var i = 0; i < doms.length; i++) {
            var dom = doms[i]
            if (dom.getAttribute('data-key') === key) {
                if (dom.tagName.toLowerCase() === 'input' && (dom.type === 'text' || dom.type === 'password') ) {
                    dom.className += " shark-input-highlight";
                } else {
                    var html = "<span class='shark-highlight'>"+dom.innerText+"</span>"
                    dom.innerHTML = html
                }
            }
        }
    }

    function cancelHighlight() {
        var doms = document.getElementsByClassName('shark-highlight');
        // for循环改变了doms的长度，循环会提前终止
        // for (var i =0;i<doms.length;i++){
        //     var text = doms[i].innerText;
        //     doms[i].parentNode.innerHTML=text
        // }
        // 改为 while 循环
        while(doms.length>0){
            var text = doms[0].innerText;
            doms[0].parentNode.innerHTML = text;
        }

        var inputs = document.getElementsByClassName('shark-input-highlight')
        // for(var i=0;i<inputs.length;i++){
        //     var classVal = inputs[i].getAttribute("class")
        //     classVal = classVal.replace("shark-input-highlight","");
        //     inputs[i].setAttribute("class",classVal );
        // }
        while(inputs.length>0){
            var classVal = inputs[0].getAttribute("class")
            classVal = classVal.replace("shark-input-highlight","");
            inputs[0].setAttribute("class",classVal );
        }
    }

    function clickHandler(e) {
        e.preventDefault()
        e.stopPropagation()
        if (e.target.getAttribute("data-key") == null) return
        var key = e.target.getAttribute("data-key")
        var value = e.target.innerText;
        cancelHighlight(); // 取消其它元素的高亮状态
        setHighlight(key); // 高亮当前元素
        var content = {}
        content.key = key;
        content.value = value;
        content.name = 'keyCallBack';
        chrome.runtime.sendMessage(content, function (response) {
            console.log(response);
        });
    }

    function replaceSharkDomContent(){
        var nodes = document.all;
        for(var i=0;i<nodes.length;i++){
            try{
                var o = nodes[i];            
                if(o.childNodes.length > 1
                    ||o.tagName.toLowerCase()==='style'
                    ||o.tagName.toLowerCase()==='audio'
                    ||o.tagName.toLowerCase()==='object'
                    ||o.tagName.toLowerCase()==='vedio'
                    ||o.tagName.toLowerCase()==='meta'
                    ||o.tagName.toLowerCase()==='link'
                    ||o.tagName.toLowerCase()==='script'
                    ||o.tagName.toLowerCase()===''){
                    continue;
                }
                if(o.tagName.toLocaleLowerCase()==='input'){
                    if(o.type){
                        switch(o.type.toLowerCase()){
                            case 'hidden':
                                break;
                            case 'button':
                                if(o.value.indexOf('data-key')>-1){
                                    var _innerHTML = decodeURIComponent(o.value);
                                    var _newNode =  document.createElement('span');
                                    _newNode.innerHTML = _innerHTML;
                                    o.attributes['data-key'] = _newNode.childNodes[0].attributes['data-key'];
                                    o.value = _newNode.childNodes[0].innerText;
                                }
                                break;
                            case 'radio':
                            case 'checkbox':
                                if(o.nextSibling && o.nextSibling.nodeName  === '#text'){
                                    var _innerHTML = decodeURIComponent(o.nextSibling.textContent);
                                    var _newNode =  document.createElement('span');
                                    _newNode.innerHTML = _innerHTML;
                                    o.parentNode.removeChild(o.nextSibling);
                                    o.parentNode.appendChild(_newNode);
                                }
                                break;
                            case 'text':
                            case 'password':
                            default:
                                if(o.placeholder.indexOf('data-key')>-1){
                                    var _innerHTML = decodeURIComponent(decodeURIComponent(o.placeholder));
                                    var _newNode =  document.createElement('span');
                                    _newNode.innerHTML = _innerHTML;
                                    if(_newNode.childNodes[0]){
                                        o.attributes['data-key'] = _newNode.childNodes[0].attributes['data-key'];
                                        o.placeholder = _newNode.childNodes[0].innerText;
                                    }
                                }
                                if(o.value.indexOf('data-key')>-1){
                                    var _innerHTML = decodeURIComponent(decodeURIComponent(o.value));
                                    var _newNode =  document.createElement('span');
                                    _newNode.innerHTML = _innerHTML;
                                    if(_newNode.childNodes[0]){
                                        o.attributes['data-key'] = _newNode.childNodes[0].attributes['data-key'];
                                        o.value = _newNode.childNodes[0].innerText;
                                    }
                                }
                                break;
                        }
                    }else{ }             
                }else if(o.innerText.indexOf('data-key') < 0){
                    if(o.tagName.toLocaleLowerCase()==='a'
                        ||o.tagName.toLocaleLowerCase()==='em'
                        ||o.tagName.toLocaleLowerCase()==='span'){                
                        if(o.nextSibling && o.nextSibling.nodeName  === '#text' && o.nextSibling.textContent.indexOf('data-key')>-1){
                            //debugger;
                            var _innerHTML = decodeURIComponent(o.nextSibling.textContent);
                            var _newNode =  document.createElement('span');
                            _newNode.innerHTML = _innerHTML;
                            o.parentNode.replaceChild(_newNode,o.nextSibling);
                        }
                        if(o.previousSibling && o.previousSibling.nodeName  === '#text' && o.previousSibling.textContent.indexOf('data-key')>-1){
                            //debugger;
                            var _innerHTML = decodeURIComponent(o.previousSibling.textContent);
                            var _newNode =  document.createElement('span');
                            _newNode.innerHTML = _innerHTML;
                            o.parentNode.replaceChild(_newNode,o.previousSibling);
                        }
                    }
                    continue;
                }else{
                    o.innerHTML = decodeURIComponent(o.innerText);
                }
                
            }
            catch(e){}
        } 
        //document.body.childNodes = nodes;
    }
})()
