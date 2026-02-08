// [优先级 1] 移动设备和浏览器检测工具 - 核心功能
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

// [优先级 2] 检测微信浏览器 - 安全提示展示
function isWeChatBrowser() {
    return window.mobileUtil.isWeixin;
}

// [优先级 3] 显示微信浏览器警告 - UI提示
function showWeChatWarning() {
    const warningElement = document.getElementById('wechat-warning');
    if (warningElement) {
        warningElement.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        updateWarningContent();
    }
}

// [优先级 4] 根据平台更新警告内容 - 平台适配
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

// [优先级 5] 关闭警告提示 - 用户交互
function closeWarning() {
    const warningElement = document.getElementById('wechat-warning');
    if (warningElement) {
        warningElement.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// [优先级 6] 复制当前网址 - 用户功能
function copyCurrentUrl(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const currentUrl = window.location.href;
    const toastElement = document.getElementById('copy-toast');
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(currentUrl)
            .then(() => {
                showCopySuccessToast(toastElement);
            })
            .catch((err) => {
                fallbackCopyTextToClipboard(currentUrl, toastElement);
            });
    } else {
        fallbackCopyTextToClipboard(currentUrl, toastElement);
    }
}

// [优先级 7] 传统复制方法 - 兼容性支持
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
            showCopySuccessToast(toastElement);
        } else if (!successful) {
            console.error('复制失败');
        }
    } catch (err) {
        console.error('复制出错:', err);
    }
    
    document.body.removeChild(textArea);
}

// [优先级 8] 显示复制成功提示 - 用户反馈
function showCopySuccessToast(toastElement) {
    if (toastElement) {
        toastElement.classList.remove('hidden');
        setTimeout(() => {
            toastElement.classList.add('hidden');
        }, 3000);
    }
}

// [优先级 9] 配置：iOS微信跳转服务URL - 可选配置
const IOS_JUMP_SERVICE_URL = "";

// [优先级 10] 继续访问 - 尝试跳转到系统浏览器 - 核心跳转逻辑
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

// [优先级 11] 静默复制URL - 后台功能
function copyUrlSilently(url) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).catch(() => {
            fallbackCopyTextToClipboard(url, null);
        });
    } else {
        fallbackCopyTextToClipboard(url, null);
    }
}

// [优先级 12] 页面加载时检测浏览器 - 初始化
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

    // 直接显示所有卡片（移除懒加载，立即显示所有内容）
    const cardsToShow = document.querySelectorAll('.card');
    cardsToShow.forEach((card, index) => {
        // 直接设置卡片为可见状态
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        card.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
    });

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

// Service Worker 注册（用于缓存支持和离线访问）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(
            function(registration) {
                console.log('ServiceWorker registration successful');
            },
            function(err) {
                console.log('ServiceWorker registration failed: ', err);
            }
        );
    });
}

// ===== 比特币地址查询功能 =====
function searchBTCAddress() {
    const input = document.getElementById('btc-address-input');
    const address = input.value.trim();
    
    if (!address) {
        alert('请输入比特币地址');
        input.focus();
        return;
    }
    
    if (!validateBTCAddress(address)) {
        alert('请输入有效的比特币地址\n\n支持的地址格式：\n- Legacy (以1开头)\n- SegWit (以3开头)\n- Native SegWit/Bech32 (以bc1开头)');
        input.focus();
        input.select();
        return;
    }
    
    const okLinkUrl = `https://www.oklink.com/cn/btc/address/${address}`;
    window.open(okLinkUrl, '_blank', 'noopener,noreferrer');
}

function validateBTCAddress(address) {
    if (!address || typeof address !== 'string') {
        return false;
    }
    
    const legacy = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
    const segwit = /^3[a-km-zA-HJ-NP-Z1-9]{25,34}$/;
    const bech32 = /^(bc1|tb1)[a-z0-9]{25,87}$/i;
    
    return legacy.test(address) || segwit.test(address) || bech32.test(address);
}

document.addEventListener('DOMContentLoaded', function() {
    const addressInput = document.getElementById('btc-address-input');
    if (addressInput) {
        addressInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchBTCAddress();
            }
        });
    }
});

// ===== 赞助支持功能 =====
function copySponsorAddress() {
    const addressElement = document.querySelector('.sponsor-address');
    const address = addressElement.getAttribute('data-address');
    const toastElement = document.getElementById('sponsor-copy-toast');
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(address)
            .then(() => {
                showSponsorCopyToast(toastElement);
            })
            .catch((err) => {
                fallbackCopySponsorAddress(address, toastElement);
            });
    } else {
        fallbackCopySponsorAddress(address, toastElement);
    }
}

function fallbackCopySponsorAddress(text, toastElement) {
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
            showSponsorCopyToast(toastElement);
        } else if (!successful) {
            console.error('复制失败');
        }
    } catch (err) {
        console.error('复制出错:', err);
    }
    
    document.body.removeChild(textArea);
}

function showSponsorCopyToast(toastElement) {
    if (toastElement) {
        toastElement.classList.remove('hidden');
        setTimeout(() => {
            toastElement.classList.add('hidden');
        }, 2500);
    }
}

// ===== 留言板功能 =====
function toggleCommentsPanel() {
    const sidebar = document.getElementById('comments-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

function initializeWaline() {
    const container = document.getElementById('waline-container');
    if (!container) {
        return;
    }

    if (window.Waline && window.Waline.init) {
        try {
            window.Waline.init({
                el: '#waline-container',
                serverURL: 'https://ly.btchao.com',
                path: '/',
                placeholder: '留下你的想法...',
                avatar: 'gravatar',
                dark: false,
                meta: ['nick', 'mail'],
                requiredMeta: [],
                avatarCDN: 'https://www.gravatar.com/avatar/',
                pageSize: 10,
                pageview: false
            });
        } catch (error) {
            console.error('Waline 初始化错误:', error);
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWaline);
} else {
    setTimeout(initializeWaline, 100);
}
