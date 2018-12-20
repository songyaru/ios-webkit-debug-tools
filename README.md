##
IOS 设备远程调试工具

### 安装
依赖 [ios-webkit-debug-proxy](https://github.com/google/ios-webkit-debug-proxy)

MacOS,需要先安装[homebrew](http://brew.sh/)
```shell
brew install ios-webkit-debug-proxy
```

### 问题
执行 ```  ios_webkit_debug_proxy ``` 发现类似这样的错误
Could not connect to lockdownd, error code -3. Exiting.

需要执行下面的脚本重新更新一下

```shell
brew update
brew reinstall --HEAD usbmuxd
brew reinstall --HEAD libimobiledevice
brew reinstall -s ios-webkit-debug-proxy
```

Windows 未测试，暂不支持



