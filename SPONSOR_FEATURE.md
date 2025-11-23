# 赞助支持功能实现文档

## 功能概述
在"比特币地址查询"元素旁边新增了"赞助支持"功能模块，允许用户通过点击复制BTC地址，并在鼠标悬停时显示二维码。

## 实现位置
位于 `index.html` 中，在"比特币地址查询"（`.btc-search-section`）和"导航卡片区域"（`.main-content`）之间。

## 功能特性

### 1. 基本信息
- **标题**: 赞助支持 💝
- **说明文字**: 欢迎走过路过的朋友，赞助支持本站长久运行
- **BTC地址**: 3KLy733p6vQDyaKdEY61iGdQPf9pYt9hPv
- **二维码图片**: https://tc.xiaowuleyi.com/file/1763893479341_image.png

### 2. 交互功能

#### 点击复制
- 点击BTC地址即可自动复制到剪贴板
- 复制成功后显示绿色提示消息："✓ 地址已复制"
- 提示消息自动消失（2.5秒后）
- 支持现代浏览器的 Clipboard API
- 提供传统浏览器的降级方案（execCommand）

#### 悬停显示二维码
- 鼠标悬停在BTC地址上时显示二维码
- 二维码显示位置智能调整：
  - **桌面端**: 在地址文本右侧显示（不遮挡地址）
  - **移动端**: 在地址文本下方显示
- 二维码尺寸：150x150px
- 带有白色边框和阴影效果
- 平滑的透明度过渡动画

### 3. 视觉设计

#### 容器样式
- 白色卡片背景，与地址查询区域保持一致
- 圆角边框（16px）
- 柔和阴影效果
- 顶部装饰渐变线：粉色(#FF6B9D)到橙色(#FF9900)

#### 地址样式
- 等宽字体（Courier New）
- 橙色文字（#FF9900）
- 鼠标悬停时背景色变化
- 点击时有轻微的按压效果

#### 响应式设计
- 在移动设备上自动调整布局
- 地址框在小屏幕上垂直堆叠
- 二维码位置自适应屏幕尺寸

## 技术实现

### HTML结构
```html
<section class="sponsor-section">
    <div class="sponsor-container">
        <div class="sponsor-header">
            <span class="sponsor-icon">💝</span>
            <h2>赞助支持</h2>
        </div>
        <p class="sponsor-description">欢迎走过路过的朋友，赞助支持本站长久运行</p>
        <div class="sponsor-address-box">
            <span class="sponsor-label">BTC：</span>
            <span class="sponsor-address" onclick="copySponsorAddress()" 
                  data-address="3KLy733p6vQDyaKdEY61iGdQPf9pYt9hPv">
                3KLy733p6vQDyaKdEY61iGdQPf9pYt9hPv
                <img class="sponsor-qrcode" 
                     src="https://tc.xiaowuleyi.com/file/1763893479341_image.png" 
                     alt="BTC地址二维码">
            </span>
        </div>
        <div class="sponsor-copy-toast hidden" id="sponsor-copy-toast">✓ 地址已复制</div>
    </div>
</section>
```

### CSS样式要点
- `.sponsor-section`: 主容器，带淡入动画
- `.sponsor-container`: 卡片样式，带渐变顶部边框
- `.sponsor-address`: 可点击地址，相对定位容器
- `.sponsor-qrcode`: 绝对定位的二维码图片
- `.sponsor-copy-toast`: 复制成功提示，绝对定位
- 媒体查询 `@media (max-width: 768px)`: 移动端样式调整

### JavaScript函数
1. **copySponsorAddress()**: 主复制函数
   - 获取地址元素和数据
   - 尝试使用 Clipboard API
   - 失败时降级到传统方法
   
2. **fallbackCopySponsorAddress(text, toastElement)**: 降级复制方法
   - 创建临时textarea元素
   - 使用 execCommand('copy')
   - 清理临时元素
   
3. **showSponsorCopyToast(toastElement)**: 显示提示
   - 移除hidden类
   - 2.5秒后自动隐藏

## 浏览器兼容性
- 现代浏览器（Chrome, Firefox, Safari, Edge）: 完全支持
- 老旧浏览器: 通过降级方案支持
- 移动浏览器: 完全支持，带响应式布局

## 测试方法
1. 打开 `test-sponsor.html` 进行独立测试
2. 或访问 `index.html` 查看完整页面效果
3. 测试项目：
   - 点击地址是否成功复制
   - 提示消息是否正常显示和隐藏
   - 鼠标悬停是否显示二维码
   - 二维码位置是否正确（不遮挡文字）
   - 移动端布局是否正常

## 文件修改清单
- `index.html`: 添加赞助支持HTML结构
- `styles.css`: 添加赞助支持样式（约165行）
- `script.js`: 添加复制功能（约50行）
- `test-sponsor.html`: 添加独立测试页面（新文件）

## 注意事项
1. 二维码图片托管在外部服务器，确保图片链接有效
2. BTC地址存储在 `data-address` 属性中，便于修改
3. 复制功能需要HTTPS环境或localhost才能使用Clipboard API
4. 移动端测试时注意二维码显示位置
5. 确保 `.sponsor-container` 的 `overflow` 设置为 `visible` 以显示二维码

## 未来优化建议
1. 可以添加二维码加载失败的降级处理
2. 可以考虑添加更多加密货币地址支持
3. 可以添加赞助金额统计展示
4. 可以优化移动端的二维码显示体验
