// 移动设备和浏览器检测工具
window.mobileUtil = (function(win, doc) {
    const UA = navigator.userAgent,
    isAndroid = /android|adr/gi.test(UA),
    isIOS = /iphone|ipod|ipad/gi.test(UA) && !(/android|adr/gi.test(UA)),
    isBlackBerry = /BlackBerry/i.test(UA),
    isWindowPhone = /IEMobile/i.test(UA),
    isMobile = isAndroid || isIOS || isBlackBerry || isWindowPhone;
    return {
        isAndroid: isAndroid,
        isIOS: isIOS,
        isMobile: isMobile,
        isWeixin: /MicroMessenger/gi.test(UA),
        isQQ: /QQ/gi.test(UA)
    };
})(window, document);

// 检测微信浏览器
function isWeChatBrowser() {
    return window.mobileUtil.isWeixin;
}

// 显示微信浏览器警告
function showWeChatWarning() {
    const warningElement = document.getElementById('wechat-warning');
    if (warningElement) {
        warningElement.classList.remove('hidden');
        // 阻止背景滚动
        document.body.style.overflow = 'hidden';
        
        // 根据平台设置不同的提示文本
        updateWarningContent();
    }
}

// 根据平台更新警告内容
function updateWarningContent() {
    const stepText2 = document.querySelector('.step:nth-child(2) .step-text');
    if (stepText2) {
        if (mobileUtil.isIOS) {
            stepText2.innerHTML = '选择 <strong>「在Safari中打开」</strong>';
        } else if (mobileUtil.isAndroid) {
            stepText2.innerHTML = '选择 <strong>「在浏览器中打开」</strong>';
        }
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

// 复制当前网址
function copyCurrentUrl(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const currentUrl = window.location.href;
    const toastElement = document.getElementById('copy-toast');
    
    // 尝试使用现代 Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(currentUrl)
            .then(() => {
                showCopySuccessToast(toastElement);
            })
            .catch((err) => {
                // 如果失败，尝试传统方法
                fallbackCopyTextToClipboard(currentUrl, toastElement);
            });
    } else {
        // 不支持 Clipboard API，使用传统方法
        fallbackCopyTextToClipboard(currentUrl, toastElement);
    }
}

// 传统复制方法（兼容性更好）
function fallbackCopyTextToClipboard(text, toastElement) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '-9999px';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful && toastElement) {
            // 只在传入toast元素时显示提示
            showCopySuccessToast(toastElement);
        } else if (!successful) {
            console.error('复制失败');
        }
    } catch (err) {
        console.error('复制出错:', err);
    }
    
    document.body.removeChild(textArea);
}

// 显示复制成功提示
function showCopySuccessToast(toastElement) {
    if (toastElement) {
        toastElement.classList.remove('hidden');
        
        // 3秒后自动隐藏
        setTimeout(() => {
            toastElement.classList.add('hidden');
        }, 3000);
    }
}

// 配置：iOS微信跳转服务URL（可选）
// 如果你有自己的跳转服务，请在这里配置
// 留空则提示用户手动操作
const IOS_JUMP_SERVICE_URL = ""; // 例如: "https://your-jump-service.com/jump?url="

// 继续访问 - 尝试跳转到系统浏览器
function continueToVisit(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const currentUrl = window.location.href;
    
    if (mobileUtil.isWeixin) {
        if (mobileUtil.isIOS) {
            // iOS微信：尝试跳转到中间服务或提示用户
            if (IOS_JUMP_SERVICE_URL) {
                // 如果配置了跳转服务，使用它
                const jumpUrl = IOS_JUMP_SERVICE_URL + encodeURIComponent(currentUrl);
                window.location.href = jumpUrl;
            } else {
                // 否则，尝试通过Universal Link或提示用户
                // 创建一个临时链接尝试打开Safari
                const tempLink = document.createElement('a');
                tempLink.href = currentUrl;
                tempLink.target = '_blank';
                tempLink.rel = 'noopener noreferrer';
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
                
                // 显示提示
                setTimeout(() => {
                    alert('请点击右上角「···」菜单，选择「在Safari中打开」');
                }, 500);
            }
            
            // iOS也自动复制链接，方便用户手动粘贴
            copyUrlSilently(currentUrl);
            
        } else if (mobileUtil.isAndroid) {
            // Android微信：使用intent协议尝试调起Chrome浏览器
            // 这是最可靠的方法，可以直接调起系统默认浏览器或Chrome
            try {
                // 移除协议头，构造intent URL
                const urlWithoutProtocol = currentUrl.replace(/^https?:\/\//i, '');
                const scheme = currentUrl.startsWith('https') ? 'https' : 'http';
                
                // 方法1：使用intent协议尝试调起Chrome
                const intentUrl = `intent://${urlWithoutProtocol}#Intent;scheme=${scheme};package=com.android.chrome;end`;
                window.location.href = intentUrl;
                
                // 备用方案：尝试调起系统默认浏览器
                setTimeout(() => {
                    const intentUrlDefault = `intent://${urlWithoutProtocol}#Intent;scheme=${scheme};action=android.intent.action.VIEW;end`;
                    window.location.href = intentUrlDefault;
                }, 800);
                
                // 方法2：尝试使用window.open作为备用
                setTimeout(() => {
                    window.open(currentUrl, '_blank');
                }, 1500);
                
            } catch (err) {
                console.error('Intent调用失败:', err);
            }
            
            // 自动复制链接到剪贴板，方便用户手动粘贴
            copyUrlSilently(currentUrl);
            
            // 延迟提示用户
            setTimeout(() => {
                alert('链接已复制！如未自动打开，请点击右上角「···」菜单，选择「在浏览器中打开」或手动粘贴链接到浏览器访问');
            }, 2000);
        }
    } else {
        // 非微信浏览器，关闭警告
        closeWarning();
    }
}

// 静默复制URL（不显示提示）
function copyUrlSilently(url) {
    // 尝试使用现代 Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).catch(() => {
            // 失败时使用传统方法
            fallbackCopyTextToClipboard(url, null);
        });
    } else {
        // 不支持 Clipboard API，使用传统方法
        fallbackCopyTextToClipboard(url, null);
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

    // 点击背景关闭警告（已通过 onclick 处理）
    // 但保持兼容性代码
    const warningElement = document.getElementById('wechat-warning');
    if (warningElement) {
        // 阻止警告内容区域的点击事件冒泡
        const warningContent = warningElement.querySelector('.warning-content');
        if (warningContent) {
            warningContent.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
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
