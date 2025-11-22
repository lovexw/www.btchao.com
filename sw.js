// Service Worker - 处理缓存策略，排除第三方服务和外部资源
const CACHE_NAME = 'bitcoin-nav-v1';

// 第三方服务和外部资源 - 不使用缓存策略，直接网络请求
const EXTERNAL_SERVICES = [
  'static.cloudflareinsights.com',
  'ly.btchao.com', // Waline 评论服务器
  'cdn.jsdelivr.net', // 外部 CDN
  'gravatar.com', // Gravatar 头像
  'www.gravatar.com'
];

// 检查 URL 是否是外部第三方服务
function isExternalService(url) {
  return EXTERNAL_SERVICES.some(service => url.includes(service));
}

// 检查 URL 是否应该被缓存
function shouldCache(url) {
  // 不缓存 XHR/API 请求
  if (url.includes('api') || url.includes('comment')) {
    return false;
  }
  // 不缓存外部服务
  if (isExternalService(url)) {
    return false;
  }
  return true;
}

// 安装事件 - 缓存基础资源
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/script.js'
      ]).catch(err => {
        console.log('缓存基础资源时出错:', err);
      });
    })
  );
});

// 激活事件 - 清理旧缓存并接管所有客户端
self.addEventListener('activate', event => {
  self.clients.claim();
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch 事件 - 智能缓存策略
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // 忽略非 HTTP(S) 请求
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // 对于外部服务，直接使用网络请求（不缓存）
  if (isExternalService(url.href)) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // 只返回成功的响应
          return response;
        })
        .catch(() => {
          // 网络请求失败时，返回空响应让浏览器处理
          // 这样可以避免 Service Worker 报错，浏览器会自然处理失败
          return new Response('', { 
            status: 0,
            statusText: '',
            headers: new Headers({ 'Content-Type': 'application/octet-stream' })
          });
        })
    );
    return;
  }
  
  // 对于本地资源，使用缓存优先策略
  if (shouldCache(url.href)) {
    event.respondWith(
      caches.match(event.request).then(response => {
        if (response) {
          return response;
        }
        
        return fetch(event.request).then(response => {
          // 只缓存成功的响应
          if (!response || response.status !== 200) {
            return response;
          }
          
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          
          return response;
        }).catch(() => {
          // 网络请求失败且没有缓存时，返回缓存的 HTML 或错误页面
          if (event.request.destination === 'document') {
            return caches.match('/index.html').catch(() => {
              return new Response('离线状态', { status: 503 });
            });
          }
          return new Response('资源不可用', { status: 503 });
        });
      })
    );
    return;
  }
  
  // 其他请求（如 API）使用网络优先策略
  event.respondWith(
    fetch(event.request).then(response => {
      // 克隆响应以便后续使用
      const responseClone = response.clone();
      
      // 如果是成功的文档或数据请求，尝试缓存
      if (response.status === 200 && event.request.method === 'GET') {
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
      }
      
      return response;
    }).catch(() => {
      // 网络失败时尝试使用缓存
      return caches.match(event.request).catch(() => {
        // 返回空响应，让浏览器处理
        return new Response('', { 
          status: 0,
          statusText: '',
          headers: new Headers({ 'Content-Type': 'application/json' })
        });
      });
    })
  );
});
