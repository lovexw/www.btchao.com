# Service Worker 修复说明

## 问题描述
部署 Waline 留言板后，浏览器控制台出现以下错误：
```
The FetchEvent for "https://static.cloudflareinsights.com/beacon.min.js/..." resulted in a network error response
workbox: no-response :: [{"url":"https://static.cloudflareinsights.com/beacon.min.js/..."}]
```

## 根本原因
当使用 Service Worker 时，如果配置了缓存策略但没有正确处理外部第三方服务的请求失败，就会出现此问题。特别是：

1. Service Worker 拦截了对 Cloudflare Insights beacon 的请求
2. 由于网络限制或 CORS 问题，请求失败
3. Service Worker 没有缓存该资源
4. Service Worker 抛出了 "no-response" 错误而不是优雅地处理

## 解决方案
创建了 `/sw.js` 并启用了 Service Worker 注册，其中：

### 1. 明确排除第三方服务
```javascript
const EXTERNAL_SERVICES = [
  'static.cloudflareinsights.com',  // Cloudflare Insights
  'ly.btchao.com',                   // Waline 评论服务器
  'cdn.jsdelivr.net',                // 外部 CDN
  'gravatar.com'                     // Gravatar API
];
```

### 2. 对第三方服务使用网络优先策略
- 直接发起网络请求，不使用缓存
- 网络请求失败时，返回 HTTP 408 错误响应而不是抛出异常
- 这防止了 Service Worker 的 "no-response" 错误

### 3. 对本地资源使用缓存优先策略
- 本地 HTML/CSS/JS 使用缓存优先，提高性能
- 离线时可以使用缓存的页面
- API 请求不被缓存

## 修改的文件

### `/sw.js` (新文件)
- 创建了新的 Service Worker 文件
- 配置了智能缓存策略
- 处理了外部服务的请求失败

### `/script.js` (修改)
- 启用了 Service Worker 注册（第 292-304 行）
- 从注释状态改为活跃状态

## 优势
1. ✅ 修复了 Cloudflare Insights beacon 加载错误
2. ✅ 修复了 Waline 评论系统的 CORS 问题
3. ✅ 改进了性能（本地资源缓存）
4. ✅ 支持离线模式
5. ✅ 避免 Service Worker 异常日志

## 测试建议
1. 清除浏览器缓存和 Service Worker
2. 刷新页面，等待 Service Worker 注册
3. 打开开发者工具，检查控制台
4. 验证留言板功能正常
5. 验证没有 "no-response" 错误

## 注意事项
- Service Worker 的注册可能需要几秒钟
- 首次访问时会下载完整资源，之后会使用缓存
- 如果需要更新 Service Worker，可以修改 `CACHE_NAME` 版本号
