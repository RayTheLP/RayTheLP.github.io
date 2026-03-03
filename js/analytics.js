// 訪問統計功能
const Analytics = {
    // 增加頁面瀏覽次數
    incrementPageView: function(pageId) {
        if (!SITE_CONFIG.analytics.enabled) return;
        
        const key = SITE_CONFIG.analytics.storageKey + pageId;
        let views = parseInt(localStorage.getItem(key)) || 0;
        views++;
        localStorage.setItem(key, views.toString());
        this.updateViewCount(pageId, views);
    },

    // 獲取頁面瀏覽次數
    getPageViews: function(pageId) {
        if (!SITE_CONFIG.analytics.enabled) return 0;
        
        const key = SITE_CONFIG.analytics.storageKey + pageId;
        return parseInt(localStorage.getItem(key)) || 0;
    },

    // 更新頁面上的瀏覽次數顯示
    updateViewCount: function(pageId, count) {
        const viewCountElements = document.querySelectorAll('.view-count');
        viewCountElements.forEach(element => {
            if (element.dataset.pageId === pageId) {
                element.textContent = `${count} 次瀏覽`;
            }
        });
    },

    // 計算字數
    countWords: function(content) {
        if (!content) return 0;
        // 移除 Markdown 語法並計算中文字和英文字
        const text = content
            .replace(/```[\s\S]*?```/g, '') // 移除程式碼區塊
            .replace(/`.*?`/g, '')          // 移除行內程式碼
            .replace(/\[.*?\]/g, '')        // 移除連結文字
            .replace(/\(.*?\)/g, '')        // 移除連結網址
            .replace(/[#*_~]/g, '');        // 移除其他 Markdown 語法

        // 計算中文字數（每個中文字算一個字）
        const chineseCount = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
        
        // 計算英文單字數（連續的英文字母算一個字）
        const englishCount = (text.match(/[a-zA-Z]+/g) || []).length;
        
        return chineseCount + englishCount;
    }
};

// 當頁面載入時自動增加瀏覽次數
document.addEventListener('DOMContentLoaded', function() {
    // 根據當前頁面類型設置 pageId
    let pageId = window.location.pathname.split('/').pop() || 'index.html';
    
    // 如果是文章頁面，使用文章 ID 作為 pageId
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    if (postId) {
        pageId = `post_${postId}`;
    }
    
    Analytics.incrementPageView(pageId);
});
