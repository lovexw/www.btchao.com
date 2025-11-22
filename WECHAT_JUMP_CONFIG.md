# 微信跳转配置说明

## 功能概述

本项目已集成智能微信浏览器跳转功能，可自动检测用户设备并采用不同策略帮助用户跳转到系统浏览器。

## 工作原理

### iOS 微信浏览器
- 检测到iOS微信浏览器后，可配置跳转服务URL
- 如果配置了跳转服务，点击"点此继续访问"按钮将自动跳转
- 如果未配置，会尝试打开新窗口并弹出引导提示

### Android 微信浏览器
- 自动尝试多种方法触发系统浏览器打开：
  1. 模拟文件下载触发浏览器切换
  2. 通过iframe加载带`?open=1`参数的URL
  3. 使用`window.open`打开新窗口
- 同时显示操作引导提示

### 其他浏览器
- 直接关闭警告弹窗，正常访问

## 配置方法

### 步骤1：打开 script.js 文件

找到文件顶部（约第120行左右）的配置常量：

```javascript
// 配置：iOS微信跳转服务URL（可选）
// 如果你有自己的跳转服务，请在这里配置
// 留空则提示用户手动操作
const IOS_JUMP_SERVICE_URL = ""; // 例如: "https://your-jump-service.com/jump?url="
```

### 步骤2：配置跳转服务URL（可选）

如果你有iOS跳转服务，可以这样配置：

```javascript
const IOS_JUMP_SERVICE_URL = "https://your-jump-service.com/jump?url=";
```

跳转服务会接收当前URL作为参数，格式如：
```
https://your-jump-service.com/jump?url=https%3A%2F%2Fyoursite.com%2F
```

### 步骤3：留空使用默认行为

如果留空（推荐），系统会：
1. 尝试通过`target="_blank"`打开新窗口
2. 显示操作引导弹窗，提示用户手动在Safari中打开

```javascript
const IOS_JUMP_SERVICE_URL = ""; // 默认行为
```

## UI组件说明

### 警告弹窗包含：
1. **右上角动画箭头** - 指向微信菜单位置，带"点击这里"文字
2. **标题和说明** - "请使用浏览器打开"
3. **步骤说明** - 根据设备动态显示：
   - iOS: "在Safari中打开"
   - Android: "在浏览器中打开"
4. **三个按钮**：
   - 🚀 **点此继续访问** (绿色) - 触发自动跳转逻辑
   - 📋 **复制网址** (白色) - 复制当前URL到剪贴板
   - **我知道了** (半透明) - 关闭弹窗

## 技术实现细节

### 设备检测
```javascript
window.mobileUtil = {
    isAndroid: boolean,    // 是否Android设备
    isIOS: boolean,        // 是否iOS设备
    isMobile: boolean,     // 是否移动设备
    isWeixin: boolean,     // 是否微信浏览器
    isQQ: boolean          // 是否QQ浏览器
}
```

### 核心函数
- `isWeChatBrowser()` - 检测微信浏览器
- `showWeChatWarning()` - 显示警告弹窗
- `updateWarningContent()` - 根据平台更新提示文字
- `continueToVisit(event)` - 处理继续访问逻辑
- `copyCurrentUrl(event)` - 复制网址功能
- `closeWarning()` - 关闭警告弹窗

## 参考的PHP实现

原始PHP代码逻辑：
```php
// Android微信：设置文件下载头，触发浏览器打开
if($_GET['open']==1 && strpos($_SERVER['HTTP_USER_AGENT'], 'MicroMessenger')!==false){
    header("Content-Disposition: attachment; filename=\"load.doc\"");
    header("Content-Type: application/vnd.ms-word;charset=utf-8");
}
```

```javascript
// iOS微信：跳转到中间服务
if(mobileUtil.isIOS){
    url = "https://jump-service.com/page?backurl=" + encodeURIComponent(url);
}
// Android微信：使用?open=1参数
else if(mobileUtil.isAndroid){
    url = '?open=1';
    // 通过iframe触发
}
```

**注意**：由于本项目是纯静态网站（无PHP后端），Android的文件下载头方案无法完全实现，但我们采用了多种客户端方案作为替代。

## 测试建议

1. **iOS微信测试**：
   - 在微信中打开网站
   - 查看是否显示警告弹窗
   - 点击"点此继续访问"测试跳转
   - 验证是否正确跳转到Safari

2. **Android微信测试**：
   - 在微信中打开网站
   - 点击"点此继续访问"
   - 查看是否触发浏览器选择或自动打开

3. **Safari/Chrome直接访问**：
   - 验证不会显示警告弹窗
   - 正常浏览网站内容

## 常见问题

**Q: iOS跳转服务从哪里获取？**
A: 你可以自己搭建跳转页面，或使用第三方服务。也可以留空使用默认的引导提示。

**Q: Android为什么不能完全自动跳转？**
A: 由于是纯静态站点，无法发送服务器端的HTTP头，只能尝试客户端方法。效果因微信版本而异。

**Q: 可以关闭微信检测吗？**
A: 可以。在`script.js`中注释掉检测代码：
```javascript
// document.addEventListener('DOMContentLoaded', function() {
//     if (isWeChatBrowser()) {
//         showWeChatWarning();
//     }
//     ...
// });
```

## 相关资源

- [微信开放平台文档](https://developers.weixin.qq.com/)
- [Universal Links (iOS)](https://developer.apple.com/ios/universal-links/)
- [Android Intent Filter](https://developer.android.com/guide/components/intents-filters)

## 更新日志

- **2024-11**: 初始实现，基于PHP跳转逻辑改造为纯JavaScript方案
- 支持iOS/Android平台检测
- 添加多种跳转fallback方法
- 优化UI和用户体验
