// 互動式文章元素功能
const InteractiveElements = {
    // 初始化標記，防止重複初始化
    initialized: false,
    
    // 初始化互動元素
    init: function() {
        if (this.initialized) {
            console.log('InteractiveElements 已經初始化過了');
            return;
        }
        
        this.initRestaurantSearch();
        this.initLocationSearch();
        this.initMenuItems();
        this.initTooltips();
        this.initImageInteractions();
        this.initQuoteInteractions();
        this.processArticleContent();
        
        this.initialized = true;
        console.log('InteractiveElements 初始化完成');
    },

    // 自動檢測並轉換文章中的店名
    processArticleContent: function() {
        // 暫時停用自動檢測功能，直到問題解決
        // const postContent = document.querySelector('.post-content');
        // if (!postContent) return;

        // 事件監聽器已經在 init() 中註冊，這裡不需要重複調用
        console.log('文章內容處理完成');
    },

    // 店名Google搜尋功能
    initRestaurantSearch: function() {
        // 使用事件委託確保動態內容也能響應點擊
        document.addEventListener('click', (e) => {
            // 檢查是否點擊了餐廳名稱
            if (e.target.classList.contains('restaurant-name') || e.target.closest('.restaurant-name')) {
                e.preventDefault(); // 防止默認行為
                
                const target = e.target.classList.contains('restaurant-name') ? e.target : e.target.closest('.restaurant-name');
                const restaurantName = target.dataset.name || target.textContent.trim();
                
                console.log('點擊餐廳:', restaurantName); // 調試用
                
                this.searchOnGoogle(restaurantName + ' 餐廳');
                
                // 添加點擊效果
                target.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    target.style.transform = '';
                }, 150);
            }
        });
    },

    // 地點Google Maps搜尋
    initLocationSearch: function() {
        // 使用事件委託確保動態內容也能響應點擊
        document.addEventListener('click', (e) => {
            // 檢查是否點擊了地點標籤
            if (e.target.classList.contains('location-tag') || e.target.closest('.location-tag')) {
                e.preventDefault(); // 防止默認行為
                
                const target = e.target.classList.contains('location-tag') ? e.target : e.target.closest('.location-tag');
                const location = target.dataset.location || target.textContent.trim();
                
                console.log('點擊地點:', location); // 調試用
                
                this.searchOnGoogleMaps(location);
                
                // 添加點擊效果
                target.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    target.style.transform = '';
                }, 150);
            }
        });
    },

    // 菜品展示功能（移除搜尋）
    initMenuItems: function() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('menu-item')) {
                // 只添加點擊效果，不進行搜尋
                e.target.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    e.target.style.transform = '';
                }, 150);
            }
        });
    },

    // 提示框功能
    initTooltips: function() {
        document.querySelectorAll('.tooltip').forEach(tooltip => {
            tooltip.addEventListener('mouseenter', () => {
                const content = tooltip.querySelector('.tooltip-content');
                if (content) {
                    content.style.zIndex = '1001';
                }
            });
        });
    },

    // 圖片互動功能
    initImageInteractions: function() {
        document.querySelectorAll('.interactive-image').forEach(img => {
            img.addEventListener('click', () => {
                const src = img.querySelector('img')?.src;
                if (src) {
                    this.openImageModal(src);
                }
            });
        });
    },

    // 引用互動功能
    initQuoteInteractions: function() {
        document.querySelectorAll('.interactive-quote').forEach(quote => {
            quote.addEventListener('click', () => {
                this.shareQuote(quote.textContent);
            });
        });
    },

    // Google搜尋功能
    searchOnGoogle: function(query) {
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        window.open(searchUrl, '_blank', 'noopener,noreferrer');
    },

    // Google Maps搜尋功能
    searchOnGoogleMaps: function(location) {
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
        window.open(mapsUrl, '_blank', 'noopener,noreferrer');
    },

    // 圖片模態框
    openImageModal: function(imageSrc) {
        // 創建模態框
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <img src="${imageSrc}" alt="放大圖片" />
                    <button class="modal-close">&times;</button>
                </div>
            </div>
        `;
        
        // 添加樣式
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.cssText = `
            position: relative;
            max-width: 90%;
            max-height: 90%;
        `;
        
        const img = modal.querySelector('img');
        img.style.cssText = `
            max-width: 100%;
            max-height: 100%;
            border-radius: 8px;
        `;
        
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.style.cssText = `
            position: absolute;
            top: -40px;
            right: 0;
            background: none;
            border: none;
            color: white;
            font-size: 30px;
            cursor: pointer;
            padding: 5px 10px;
        `;
        
        document.body.appendChild(modal);
        
        // 顯示動畫
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
        
        // 關閉功能
        const closeModal = () => {
            modal.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        };
        
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        document.addEventListener('keydown', function escapeHandler(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        });
    },

    // 分享引用功能
    shareQuote: function(text) {
        if (navigator.share) {
            navigator.share({
                title: '來自 raythelp\'s blog 的引用',
                text: text,
                url: window.location.href
            });
        } else {
            // 複製到剪貼板
            navigator.clipboard.writeText(text).then(() => {
                this.showNotification('引用已複製到剪貼板！');
            });
        }
    },

    // 顯示通知
    showNotification: function(message, duration = 3000) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--accent-blue);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 2001;
            font-size: 0.9rem;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // 顯示動畫
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // 自動隱藏
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, duration);
    },

    // 輔助函數：創建互動元素
    createInteractiveElement: function(type, content, data = {}) {
        const element = document.createElement('span');
        element.className = type;
        element.textContent = content;
        
        // 添加數據屬性
        Object.keys(data).forEach(key => {
            element.dataset[key] = data[key];
        });
        
        return element;
    }
};

// 工具函數：手動標記互動元素
window.markAsRestaurant = function(text, name) {
    return `<span class="restaurant-name" data-name="${name || text}">${text}</span>`;
};

window.markAsLocation = function(text, location) {
    return `<span class="location-tag" data-location="${location || text}">${text}</span>`;
};

window.markAsMenuItem = function(text, item) {
    return `<span class="menu-item" data-item="${item || text}">${text}</span>`;
};

window.createRating = function(stars, text) {
    const starText = '★'.repeat(stars) + '☆'.repeat(5 - stars);
    return `<div class="rating">
        <span class="stars">${starText}</span>
        <span class="rating-text">(${text})</span>
    </div>`;
};

window.createPrice = function(price) {
    return `<span class="price-tag">NT$ ${price}</span>`;
};

window.createRecommendation = function(level, text) {
    const levels = {
        'high': 'highly-recommended',
        'medium': 'recommended', 
        'low': 'neutral',
        'none': 'not-recommended'
    };
    return `<span class="recommendation-level ${levels[level] || 'neutral'}">${text}</span>`;
};

window.createTooltip = function(text, tooltip) {
    return `<span class="tooltip">${text}
        <span class="tooltip-content">${tooltip}</span>
    </span>`;
};

// 當DOM載入完成時初始化
document.addEventListener('DOMContentLoaded', () => {
    InteractiveElements.init();
});

// 導出功能供其他模組使用
window.InteractiveElements = InteractiveElements;
