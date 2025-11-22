// 检测微信浏览器
function isWeChatBrowser() {
    const ua = navigator.userAgent.toLowerCase();
    return /micromessenger/.test(ua);
}

// 显示微信浏览器警告
function showWeChatWarning() {
    const warningElement = document.getElementById('wechat-warning');
    if (warningElement) {
        warningElement.classList.remove('hidden');
        // 阻止背景滚动
        document.body.style.overflow = 'hidden';
    }
}

// 关闭警告提示
function closeWarning() {
    const warningElement = document.getElementById('wechat-warning');
    if (warningElement) {
        warningElement.classList.add('hidden');
        // 恢复背景滚动
        document.body.style.overflow = '';
    }
}

// 页面加载时检测浏览器
document.addEventListener('DOMContentLoaded', function() {
    if (isWeChatBrowser()) {
        showWeChatWarning();
    }

    // 添加卡片点击追踪（可选）
    const cards = document.querySelectorAll('.card:not(.card-placeholder)');
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            console.log('访问:', this.href);
        });
    });

    // 添加键盘导航支持
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeWarning();
        }
    });

    // 点击背景关闭警告
    const warningElement = document.getElementById('wechat-warning');
    if (warningElement) {
        warningElement.addEventListener('click', function(e) {
            if (e.target === this) {
                closeWarning();
            }
        });
    }

    // 添加平滑滚动效果
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 添加入场动画观察器（可选增强效果）
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // 为每个卡片添加观察
        const cardsToObserve = document.querySelectorAll('.card');
        cardsToObserve.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(card);
        });
    }

    // 性能优化：预加载链接
    const links = document.querySelectorAll('a[href^="https://"]');
    links.forEach(link => {
        const prefetchLink = document.createElement('link');
        prefetchLink.rel = 'dns-prefetch';
        prefetchLink.href = new URL(link.href).origin;
        document.head.appendChild(prefetchLink);
    });
});

// 添加网络状态监测（可选）
window.addEventListener('online', function() {
    console.log('网络连接已恢复');
});

window.addEventListener('offline', function() {
    console.log('网络连接已断开');
});

// Service Worker 注册（可选，用于离线支持）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // 取消注释以启用 Service Worker
        // navigator.serviceWorker.register('/sw.js').then(
        //     function(registration) {
        //         console.log('ServiceWorker registration successful');
        //     },
        //     function(err) {
        //         console.log('ServiceWorker registration failed: ', err);
        //     }
        // );
    });
}
