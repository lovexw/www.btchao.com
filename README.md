# 比特币导航 - Bitcoin Navigation

一个优雅的卡片风格比特币工具导航网站，提供精选的比特币相关资源和工具。

## ✨ 特性

- 🎨 **优雅设计** - 采用现代化卡片布局，渐变背景，流畅动画效果
- 📱 **完全响应式** - 完美适配桌面端、平板和手机端
- ⚠️ **智能微信浏览器处理** - 自动检测微信浏览器，提供多种跳转方案：
  - iOS微信：支持配置跳转服务或引导用户在Safari中打开
  - Android微信：尝试多种方法触发系统浏览器打开
  - 提供"继续访问"、"复制网址"等便捷操作
- 🚀 **性能优化** - DNS 预加载、懒加载动画、平滑滚动
- ♿ **可访问性** - 键盘导航支持、减弱动画模式支持
- 🔧 **易于扩展** - 预留卡片位置，方便添加更多导航链接

## 📋 包含的工具

1. **比特币 AHR999 定投指数** - 自动获取并展示 AHR999 囤比特币指标数据的投资参考
2. **比特币白皮书** - 保持原文基础上，扩展更多内容、技术概念、演示等
3. **比特币百科** - 关于比特币技术细节、概念的丰富解释
4. **比特币助记词离线生成** - 可以断网离线生成基于 BIP39 标准生成的助记词，安全放心

## 🚀 使用方法

### 直接使用

1. 克隆或下载本仓库
2. 在浏览器中打开 `index.html` 文件即可

### 部署到服务器

可以部署到任何静态网站托管服务：

- GitHub Pages
- Cloudflare Pages
- Vercel
- Netlify
- 或任何 Web 服务器

## 📝 添加新的导航链接

要添加新的导航链接，只需在 `index.html` 中添加新的卡片：

```html
<a href="你的网址" class="card" target="_blank" rel="noopener noreferrer">
    <div class="card-icon">图标</div>
    <h3 class="card-title">标题</h3>
    <p class="card-description">描述文字</p>
    <div class="card-footer">
        <span class="card-link">访问链接 →</span>
    </div>
</a>
```

## ⚙️ 配置微信跳转服务（可选）

如果你在iOS设备上需要更好的微信跳转体验，可以配置跳转服务URL。

在 `script.js` 文件顶部找到以下配置：

```javascript
// 配置：iOS微信跳转服务URL（可选）
const IOS_JUMP_SERVICE_URL = ""; // 例如: "https://your-jump-service.com/jump?url="
```

将跳转服务URL填入即可。如果留空，系统会提示用户手动在Safari中打开。

**跳转服务说明：**
- 跳转服务可以帮助iOS微信用户更方便地跳转到Safari浏览器
- 你可以使用第三方跳转服务，或自己搭建跳转页面
- Android微信会自动尝试多种方法打开系统浏览器，无需额外配置

## 🎨 自定义样式

可以在 `styles.css` 中修改以下 CSS 变量来自定义配色方案：

```css
:root {
    --primary-color: #f7931a;        /* 主色调（比特币橙色）*/
    --secondary-color: #4a4a4a;      /* 次要颜色 */
    --bg-gradient-start: #0f0c29;    /* 背景渐变起始色 */
    --bg-gradient-mid: #302b63;      /* 背景渐变中间色 */
    --bg-gradient-end: #24243e;      /* 背景渐变结束色 */
}
```

## 🔧 技术栈

- 纯 HTML5
- CSS3（使用 CSS Grid、Flexbox、自定义属性）
- 原生 JavaScript（ES6+）
- 无任何外部依赖

## 📱 浏览器支持

- Chrome/Edge (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- iOS Safari (iOS 12+)
- Android Chrome (Android 5+)

## 📄 许可证

本项目采用 MIT 许可证。

## 🤝 贡献

欢迎提交 Issues 和 Pull Requests！

---

**Bitcoin: A Peer-to-Peer Electronic Cash System**
