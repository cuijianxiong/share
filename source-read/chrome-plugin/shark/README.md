#shark chrome插件第二版
## 说明
### 插件的打包
1. 点击 Chrome菜单-更多工具-扩展程序
2. 勾选右上角的开发者模式 点击加载已解压的扩展程序 选择ibu-shark-client2下sharkPlugin的路径
3. 点击打包扩展程序
4. ibu-shark-client2路径下的sharkPlugin.crx即为打包后的插件

### 插件的安装
1. 点击 Chrome菜单-更多工具-扩展程序
2. 把下载好的.crx文件拖入chrome浏览器“扩展程序”页面。就会提示“拖放以安装”-“添加xxx吗？”，点“添加扩展程序”就安装好了
具体步骤可参考 [ref]: https://jingyan.baidu.com/article/e4511cf35c2df92b845eafb3.html

### 插件API地址
- 测试环境：http://gateway.m.fws.qa.nt.ctripcorp.com/restapi/soa2/12110/json/getTranslationContentByAppIDAndStatus
- 生产环境：http://m.ctrip.com/restapi/soa2/12110/json/getTranslationContentByAppIDAndStatus

### 测试账号
- 用户名 test
- 密码 test1

### 使用说明
1. 安装完成后 在需要使用插件的页面按下F12 点击sharkPlugin选项 登录后进入操作界面
2. 点击页面元素 操作界面会显示该元素的key和transvalue