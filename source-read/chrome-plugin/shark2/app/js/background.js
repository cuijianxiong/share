/**
 * Created by gy.wang on 17/5/2.
 */

var loginFlag = false
function loginSuccess() {
    loginFlag = true
}
chrome.windows.onRemoved.addListener(function(windowId) {
    loginFlag = false
})