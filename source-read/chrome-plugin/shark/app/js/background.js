/**
 * Created by qujingkun on 17/5/2.
 */
var connections = {};
chrome.runtime.onConnect.addListener(function (port) {
    var extensionListener = function (message, sender, sendResponse) {
        //监听devtools的事件
        switch (message.name){
            case 'init':
                connections[message.tabId] = port;
                chrome.tabs.query(
                    // {active: true, currentWindow: true, windowType: 'normal'},
                    {active: true, windowType: 'normal'},
                    function (tabs) {
                        //检测内容脚本是否插入页面
                        var message = {}
                        message.name = 'inspect'
                        chrome.tabs.sendMessage(tabs[0].id,message, function(response) {
                            if (response == null){
                                alert('please close the devtools and refresh your website!')
                            }
                        });
                    })
                return;
            case 'active':
                chrome.tabs.query(
                    // {active: true, currentWindow: true, windowType: 'normal'},
                    {active: true, windowType: 'normal'},
                    function (tabs) {
                        chrome.tabs.sendMessage(tabs[0].id,message, function(response) {
                            console.log(response);
                        });
                    })
                break
            case 'preview':
                chrome.tabs.query(
                    // {active: true, currentWindow: true, windowType: 'normal'},
                    {active: true, windowType: 'normal'},
                    function (tabs) {
                        chrome.tabs.sendMessage(tabs[0].id,message, function(response) {
                            console.log(response);
                        });
                    })
                break
            case 'delcookie':
                chrome.tabs.query(
                    // {active: true, currentWindow: true, windowType: 'normal'},
                    {active: true, windowType: 'normal'},
                    function (tabs) {
                        chrome.tabs.sendMessage(tabs[0].id,message, function(response) {
                            console.log(response);
                        });
                    })
                break
            case 'addcookie':
                chrome.tabs.query(
                    // {active: true, currentWindow: true, windowType: 'normal'},
                    {active: true, windowType: 'normal'},
                    function (tabs) {
                        chrome.tabs.sendMessage(tabs[0].id,message, function(response) {
                            console.log(response);
                        });
                    })
                break
            case 'refresh':
                chrome.tabs.query(
                    // {active: true, currentWindow: true, windowType: 'normal'},
                    {active: true, windowType: 'normal'},
                    function (tabs) {
                        chrome.tabs.sendMessage(tabs[0].id,message, function(response) {
                            console.log(response);
                        });
                    })
                break
            case 'doshark':
                chrome.tabs.query(
                    // {active: true, currentWindow: true, windowType: 'normal'},
                    {active: true, windowType: 'normal'},
                    function (tabs) {
                        chrome.tabs.sendMessage(tabs[0].id,message, function(response) {
                            console.log(response);
                        });
                    })
                break
            default:
                break
        }
    }
    port.onMessage.addListener(extensionListener);
    port.onDisconnect.addListener(function(port) {
        port.onMessage.removeListener(extensionListener);
        var tabs = Object.keys(connections);
        for (var i=0, len=tabs.length; i < len; i++) {
            if (connections[tabs[i]] == port) {
                delete connections[tabs[i]]
                break;
            }
        }
    });
});
//传递内容脚本的请求
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (sender.tab) {
        var tabId = sender.tab.id;
        if (tabId in connections) {
            connections[tabId].postMessage(request);
        } else {
            console.log("Tab not found in connection list.");
        }
    } else {
        console.log("sender.tab not defined.");
    }
    return true;
});
