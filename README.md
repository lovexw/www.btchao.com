# www.btchao.com — 比特囤币导航主页

> 比特币导航站，精选比特币相关工具与资源。长期主义者的入口。

🌐 线上地址：[https://www.btchao.com](https://www.btchao.com)

## 技术栈

- 纯静态前端：HTML + CSS + JavaScript（无框架、无构建工具）
- Service Worker（PWA 离线缓存）
- 部署平台：Cloudflare Pages
- 域名：btchao.com

## 文件结构

```
www.btchao.com/
├── index.html              # 主页入口
├── styles.css              # 全部样式
├── script.js               # 全部脚本逻辑
├── sw.js                   # Service Worker（离线缓存）
├── _headers                # Cloudflare Pages 缓存策略
├── ads.txt                 # Google AdSense 验证
├── d50b90d0089f0c2dbcc4d6259d2c7829.txt  # 搜索引擎域名验证
└── .gitignore
```

## 核心功能

- 🔍 **比特币地址查询** — 链上地址信息查询
- 💱 **比特币汇率换算** — 实时 BTC/法币 双向换算
- ⚡ **购买比特币指南** — 快闪版购买入口（get.btchao.com）
- 📰 **内容导航卡片** — 白皮书、技术百科、公众号文章等资源导航
- 💬 **留言板** — Waline 评论系统
- ⚠️ **微信浏览器检测** — 引导用户在系统浏览器中打开
- 📱 **PWA 支持** — 可添加到主屏幕，支持离线访问
- 📱 **移动端适配** — 响应式设计

## 本地开发

```bash
# 克隆仓库
git clone https://github.com/lovexw/www.btchao.com.git
cd www.btchao.com

# 任意静态服务器启动即可，例如
python3 -m http.server 8080
# 或
npx serve .
```

浏览器访问 `http://localhost:8080` 即可。

## 部署

仓库关联 Cloudflare Pages，`main` 分支推送后自动部署。

### 缓存策略（`_headers`）

- `index.html` / `sw.js`：不缓存（`max-age=0, must-revalidate`）
- CSS / JS / 图片：长期缓存（`max-age=31536000, immutable`）

## 相关项目

- [btchao.com 工具站](https://btchao.com) — 比特币工具集合
- [get.btchao.com](https://get.btchao.com) — 购买比特币指南
- [blog.btchao.com](https://blog.btchao.com) — 比特币博客

---

*以上是个人投资思考，不作为你的投资依据。*
