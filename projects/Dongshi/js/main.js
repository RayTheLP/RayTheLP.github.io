// 全站共用 JavaScript

// Mobile Menu Toggle - 優化版（僅手機端）
document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('nav');
    const navContainer = document.querySelector('.nav-container');
    const navMenus = document.querySelectorAll('.nav-menu');
    let isMenuOpen = false;
    let mobileMenuWrapper = null;
    
    // 防抖函數
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // 創建手機端統一選單
    function createMobileMenu() {
        if (mobileMenuWrapper) return;
        
        mobileMenuWrapper = document.createElement('div');
        mobileMenuWrapper.className = 'mobile-menu-wrapper';
        
        // 收集所有導航項目
        const allItems = [];
        navMenus.forEach(menu => {
            const items = menu.querySelectorAll('li');
            items.forEach(item => {
                allItems.push(item.cloneNode(true));
            });
        });
        
        // 創建統一的選單列表
        const mobileMenu = document.createElement('ul');
        mobileMenu.className = 'mobile-menu';
        allItems.forEach(item => {
            mobileMenu.appendChild(item);
        });
        
        mobileMenuWrapper.appendChild(mobileMenu);
        navContainer.appendChild(mobileMenuWrapper);
    }
    
    // 移除手機端統一選單
    function removeMobileMenu() {
        if (mobileMenuWrapper) {
            mobileMenuWrapper.remove();
            mobileMenuWrapper = null;
        }
    }
    
    // 初始化手機選單功能
    function initMobileMenu() {
        // 只在手機螢幕下創建漢堡選單按鈕
        if (window.innerWidth <= 768 && !document.querySelector('.menu-toggle')) {
            // 創建統一的手機選單
            createMobileMenu();
            
            const menuToggle = document.createElement('button');
            menuToggle.className = 'menu-toggle';
            menuToggle.setAttribute('aria-label', '選單');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.innerHTML = '<span></span><span></span><span></span>';
            navContainer.appendChild(menuToggle);
            
            // 點擊漢堡選單切換
            menuToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                isMenuOpen = !isMenuOpen;
                this.classList.toggle('active');
                this.setAttribute('aria-expanded', isMenuOpen);
                if (mobileMenuWrapper) {
                    mobileMenuWrapper.classList.toggle('active');
                }
                document.body.style.overflow = isMenuOpen ? 'hidden' : '';
            });
        }
    }
    
    // 關閉選單函數
    function closeMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        if (menuToggle && isMenuOpen) {
            isMenuOpen = false;
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            if (mobileMenuWrapper) {
                mobileMenuWrapper.classList.remove('active');
            }
            document.body.style.overflow = '';
        }
    }

    // 初始化
    initMobileMenu();

    // 點擊導覽連結後關閉選單（包括手機選單）
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'A' && window.innerWidth <= 768) {
            const isInsideMenu = e.target.closest('.mobile-menu-wrapper') || 
                                 e.target.closest('.nav-menu');
            if (isInsideMenu) {
                closeMenu();
            }
        }
    });

    // 點擊選單外部關閉選單
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && isMenuOpen) {
            const isClickInsideNav = nav.contains(e.target);
            if (!isClickInsideNav) {
                closeMenu();
            }
        }
    });

    // 視窗大小改變時處理 (使用防抖)
    const handleResize = debounce(function() {
        const menuToggle = document.querySelector('.menu-toggle');
        
        if (window.innerWidth > 768) {
            // 電腦端：移除漢堡按鈕和手機選單，重置狀態
            if (menuToggle) {
                menuToggle.remove();
            }
            removeMobileMenu();
            document.body.style.overflow = '';
            isMenuOpen = false;
        } else {
            // 手機端：確保漢堡按鈕和手機選單存在
            initMobileMenu();
        }
    }, 250);

    window.addEventListener('resize', handleResize);

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
});

// 防止表單重複提交
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', function(e) {
        const submitBtn = this.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            setTimeout(() => {
                submitBtn.disabled = false;
            }, 3000);
        }
    });
});

// 圖片延遲載入
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });

    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Utility Functions
const utils = {
    // 格式化日期
    formatDate: function(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString('zh-TW', options);
    },

    // 顯示通知
    showNotification: function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            border-radius: 5px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
};

// Export utils for other scripts
window.utils = utils;
