# 赞助支持功能 - 变更日志

## 版本信息
- **分支**: feat/add-btc-sponsor-copy-qr-hover
- **日期**: 2024
- **功能**: 添加BTC赞助支持模块

## 新增功能

### 1. 赞助支持区域
- 位置：比特币地址查询和导航卡片之间
- 标题：赞助支持 💝
- 说明：欢迎走过路过的朋友，赞助支持本站长久运行
- BTC地址：3KLy733p6vQDyaKdEY61iGdQPf9pYt9hPv

### 2. 交互功能
✅ **点击复制**: 点击BTC地址自动复制到剪贴板
✅ **复制提示**: 显示绿色"✓ 地址已复制"消息（2.5秒自动消失）
✅ **悬停二维码**: 鼠标悬停地址时显示二维码
✅ **智能定位**: 
   - 桌面端：二维码显示在地址右侧
   - 移动端：二维码显示在地址下方
✅ **浏览器兼容**: 支持现代和传统浏览器

### 3. 视觉设计
- 粉橙渐变顶部边框（#FF6B9D → #FF9900）
- 白色卡片设计，与地址查询区域风格一致
- 等宽字体显示BTC地址
- 橙色主题色匹配整体风格
- 平滑过渡动画效果

## 文件修改

### index.html
- 添加 `.sponsor-section` 区域（第107-124行）
- 包含标题、描述、地址框和提示消息

### styles.css  
- 添加赞助支持样式（第486-648行，约163行）
- 包含桌面端和移动端响应式样式
- 二维码悬停效果和动画

### script.js
- 添加 `copySponsorAddress()` 函数
- 添加 `fallbackCopySponsorAddress()` 降级方案
- 添加 `showSponsorCopyToast()` 提示函数
- 总计约50行新代码（第352-402行）

## 新增测试文件
- `test-sponsor.html`: 独立测试页面
- `SPONSOR_FEATURE.md`: 详细功能文档
- `CHANGELOG_SPONSOR.md`: 本变更日志

## 技术要点

### HTML
```html
<section class="sponsor-section">
  <!-- 赞助支持内容 -->
</section>
```

### CSS关键类
- `.sponsor-section`: 主区域
- `.sponsor-container`: 卡片容器
- `.sponsor-address`: 可点击地址
- `.sponsor-qrcode`: 悬停显示的二维码
- `.sponsor-copy-toast`: 复制成功提示

### JavaScript关键函数
- `copySponsorAddress()`: 复制地址主函数
- `fallbackCopySponsorAddress()`: 降级复制方案
- `showSponsorCopyToast()`: 显示提示消息

## 测试清单
- [ ] 点击地址成功复制
- [ ] 复制提示正确显示和隐藏
- [ ] 桌面端悬停显示二维码（右侧）
- [ ] 移动端悬停显示二维码（下方）
- [ ] 二维码不遮挡地址文本
- [ ] 响应式布局正常工作
- [ ] 各浏览器兼容性测试

## 依赖项
- **外部资源**: 二维码图片（https://tc.xiaowuleyi.com/file/1763893479341_image.png）
- **浏览器API**: Clipboard API（带降级方案）
- **样式依赖**: 使用现有的CSS变量和动画

## 浏览器支持
- ✅ Chrome 63+
- ✅ Firefox 53+
- ✅ Safari 13.1+
- ✅ Edge 79+
- ✅ 移动浏览器（iOS Safari, Chrome Mobile）

## 注意事项
1. Clipboard API在非HTTPS环境下可能不可用，已提供降级方案
2. 二维码图片需要确保外部链接有效
3. 移动端测试时注意二维码显示位置
4. BTC地址存储在 `data-address` 属性中，易于修改

## 后续优化建议
- [ ] 添加二维码加载失败处理
- [ ] 支持更多加密货币地址
- [ ] 添加赞助统计展示
- [ ] 优化移动端二维码体验
- [ ] 添加地址验证功能
