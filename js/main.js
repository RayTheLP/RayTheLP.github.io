// 全域變數
let posts = []; // 儲存所有文章資料
let categories = {}; // 儲存分類統計
let tags = {}; // 儲存標籤統計
let currentPosts = []; // 當前顯示的文章（可能經過篩選）
let currentPage = 1; // 當前頁碼
const POSTS_PER_PAGE = 8; // 每頁顯示的文章數量

// 初始化應用程式
document.addEventListener('DOMContentLoaded', function() {
    // 等待共用元件初始化完成
    setTimeout(() => {
        loadPosts(); // 載入文章
        setupBackToTop(); // 設定回到頂部按鈕
        updateProfileInfo(); // 更新個人資料
        
        // 檢查 URL 參數是否有篩選條件
        checkUrlFilters();
    }, 200); // 增加延遲時間確保共用元件完全載入
});

// 檢查 URL 參數中的篩選條件
function checkUrlFilters() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const tag = urlParams.get('tag');
    const page = parseInt(urlParams.get('page')) || 1;
    
    currentPage = page;
    
    if (category) {
        // 延遲執行，確保分類已渲染完成
        setTimeout(() => {
            filterPostsByCategory(category);
        }, 300);
    } else if (tag) {
        // 延遲執行，確保標籤已渲染完成
        setTimeout(() => {
            filterPostsByTag(tag);
        }, 300);
    } else {
        // 沒有篩選條件，顯示所有文章
        currentPosts = [...posts];
    }
}

// 從 posts.json 載入文章資料
async function loadPosts() {
    try {
        const response = await fetch('posts.json');
        const data = await response.json();
        posts = data.posts || [];
        
        // 處理分類和標籤統計
        processCategoriesAndTags();
        
        // 設定當前文章列表
        currentPosts = [...posts];
        
        // 檢查 URL 參數是否有篩選條件
        checkUrlFilters();
        
        // 渲染文章列表（帶分頁）
        renderPostsWithPagination();
        
        // 渲染側邊欄
        renderCategories();
        renderTags();
        
    } catch (error) {
        console.error('載入文章時發生錯誤:', error);
        document.getElementById('postsContainer').innerHTML = 
            '<div class="loading">載入文章中...</div>';
    }
}

// 處理文章的分類和標籤統計
function processCategoriesAndTags() {
    categories = {};
    tags = {};
    
    posts.forEach(post => {
        // 處理分類統計
        if (post.category) {
            categories[post.category] = (categories[post.category] || 0) + 1;
        }
        
        // 處理標籤統計
        if (post.tags) {
            post.tags.forEach(tag => {
                tags[tag] = (tags[tag] || 0) + 1;
            });
        }
    });
}

// 渲染文章列表（帶分頁）
function renderPostsWithPagination() {
    // 計算分頁資訊
    const totalPosts = currentPosts.length;
    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
    
    // 確保當前頁碼在有效範圍內
    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    }
    if (currentPage < 1) {
        currentPage = 1;
    }
    
    // 計算當前頁要顯示的文章
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    const postsToShow = currentPosts.slice(startIndex, endIndex);
    
    // 渲染文章
    renderPosts(postsToShow);
    
    // 渲染分頁控制項
    renderPagination(totalPages);
    
    // 初始化互動功能
    if (window.InteractiveElements) {
        setTimeout(() => {
            InteractiveElements.init();
        }, 100);
    }
}

// 渲染文章列表
function renderPosts(postsToRender) {
    const container = document.getElementById('postsContainer');
    if (!container) return;
    
    if (postsToRender.length === 0) {
        container.innerHTML = '<div class="loading">沒有找到文章</div>';
        return;
    }
    
    const postsHTML = postsToRender.map(post => createPostCard(post)).join('');
    container.innerHTML = postsHTML;
    
    // 為文章卡片添加點擊事件處理器
    document.querySelectorAll('.post-card').forEach(card => {
        card.addEventListener('click', function() {
            const postId = this.dataset.postId;
            window.location.href = `post.html?id=${postId}`;
        });
    });
    
    // 初始化互動功能
    if (window.InteractiveElements) {
        setTimeout(() => {
            InteractiveElements.init();
        }, 100);
    }
}

// 渲染分頁控制項
function renderPagination(totalPages) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // 上一頁按鈕
    paginationHTML += `
        <button class="pagination-button ${currentPage === 1 ? 'disabled' : ''}" 
                onclick="goToPage(${currentPage - 1})" 
                ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    // 頁碼按鈕
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    // 第一頁
    if (startPage > 1) {
        paginationHTML += `
            <button class="pagination-button" onclick="goToPage(1)">1</button>
        `;
        if (startPage > 2) {
            paginationHTML += `<span class="pagination-ellipsis">...</span>`;
        }
    }
    
    // 中間頁碼
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="pagination-button ${i === currentPage ? 'active' : ''}" 
                    onclick="goToPage(${i})">${i}</button>
        `;
    }
    
    // 最後一頁
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span class="pagination-ellipsis">...</span>`;
        }
        paginationHTML += `
            <button class="pagination-button" onclick="goToPage(${totalPages})">${totalPages}</button>
        `;
    }
    
    // 下一頁按鈕
    paginationHTML += `
        <button class="pagination-button ${currentPage === totalPages ? 'disabled' : ''}" 
                onclick="goToPage(${currentPage + 1})" 
                ${currentPage === totalPages ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    // 頁面資訊
    const startItem = (currentPage - 1) * POSTS_PER_PAGE + 1;
    const endItem = Math.min(currentPage * POSTS_PER_PAGE, currentPosts.length);
    paginationHTML += `
        <div class="pagination-info">
            ${startItem}-${endItem} / ${currentPosts.length}
        </div>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
}

// 跳轉到指定頁面
function goToPage(page) {
    if (page < 1 || page > Math.ceil(currentPosts.length / POSTS_PER_PAGE)) {
        return;
    }
    
    currentPage = page;
    
    // 更新 URL
    const urlParams = new URLSearchParams(window.location.search);
    if (page === 1) {
        urlParams.delete('page');
    } else {
        urlParams.set('page', page);
    }
    
    const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
    window.history.pushState({}, '', newUrl);
    
    // 重新渲染
    renderPostsWithPagination();
    
    // 捲動到頂部
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 創建文章卡片 HTML
function createPostCard(post) {
    // 計算字數的函數
    function countWords(content) {
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
    
    // 使用本地字數計算函數或 Analytics.countWords
    const wordCount = window.Analytics && typeof Analytics.countWords === 'function' 
        ? Analytics.countWords(post.content) 
        : countWords(post.content);
    const readingSpeed = window.SITE_CONFIG?.posts?.readingSpeed || 200;
    const readingTime = Math.ceil(wordCount / readingSpeed) || 1; // 至少顯示 1 分鐘
    
    const tagsHTML = post.tags ? post.tags.map(tag => 
        `<span class="tag">${tag}</span>`
    ).join('') : '';
    
    return `
        <article class="post-card" data-post-id="${post.id}">
            <h2 class="post-title">${post.title}</h2>
            <div class="post-meta">
                <span><i class="fas fa-calendar"></i> ${post.date}</span>
                <span><i class="fas fa-folder"></i> ${post.category || '未分類'}</span>
            </div>
            <div class="post-tags">
                <i class="fas fa-tags"></i>
                ${tagsHTML}
            </div>
            <p class="post-excerpt">${post.excerpt || '沒有摘要'}</p>
            <div class="post-stats">
                <span>${wordCount} 字 | ${readingTime} 分鐘</span>
            </div>
            <div class="post-arrow">
                <i class="fas fa-arrow-right"></i>
            </div>
        </article>
    `;
}

// 渲染分類側邊欄
function renderCategories() {
    const container = document.getElementById('categoryList');
    if (!container) return;
    
    const categoriesArray = Object.entries(categories);
    const visibleCategories = categoriesArray.slice(0, 3);
    const hiddenCategories = categoriesArray.slice(3);
    
    // 渲染可見的分類
    const visibleCategoriesList = visibleCategories
        .map(([category, count]) => `
            <li class="category-item" data-category="${category}">
                <span class="category-name">${category}</span>
                <span class="category-count">${count}</span>
            </li>
        `).join('');
    
    // 渲染隱藏的分類
    const hiddenCategoriesList = hiddenCategories
        .map(([category, count]) => `
            <li class="category-item category-hidden" data-category="${category}" style="display: none;">
                <span class="category-name">${category}</span>
                <span class="category-count">${count}</span>
            </li>
        `).join('');
    
    // 添加 More 按鈕（只有當有隱藏分類時才顯示）
    const moreButton = hiddenCategories.length > 0 ? `
        <li class="category-more" id="categoryMore">
            <span class="more-text">
                <i class="fas fa-ellipsis-h"></i> More
            </span>
        </li>
    ` : '';
    
    container.innerHTML = visibleCategoriesList + hiddenCategoriesList + moreButton;
    
    // 添加 More 按鈕的點擊事件
    const moreBtn = document.getElementById('categoryMore');
    if (moreBtn) {
        moreBtn.addEventListener('click', function() {
            const hiddenItems = document.querySelectorAll('.category-hidden');
            const isExpanded = hiddenItems[0]?.style.display !== 'none';
            
            hiddenItems.forEach(item => {
                item.style.display = isExpanded ? 'none' : 'block';
            });
            
            this.querySelector('.more-text').innerHTML = isExpanded 
                ? '<i class="fas fa-ellipsis-h"></i> More'
                : '<i class="fas fa-minus"></i> Less';
        });
    }
    
    // 添加分類項目的點擊事件處理器
    document.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', function() {
            const category = this.dataset.category;
            filterPostsByCategory(category);
        });
    });
}

// 渲染標籤雲側邊欄
function renderTags() {
    const container = document.getElementById('tagCloud');
    if (!container) return;
    
    const tagsList = Object.entries(tags)
        .map(([tag, count]) => `
            <span class="tag" data-tag="${tag}">
                ${tag} <span class="tag-count">${count}</span>
            </span>
        `).join('');
    
    container.innerHTML = tagsList;
    
    // 添加點擊事件處理器
    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', function() {
            const tagName = this.dataset.tag;
            filterPostsByTag(tagName);
        });
    });
}

// 根據分類篩選文章
function filterPostsByCategory(category) {
    console.log('篩選分類:', category); // 除錯用
    currentPosts = posts.filter(post => post.category === category);
    currentPage = 1; // 重設到第一頁
    renderPostsWithPagination();
    
    // 更新激活狀態
    document.querySelectorAll('.category-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.category === category) {
            item.classList.add('active');
        }
    });
}

// 根據標籤篩選文章
function filterPostsByTag(tag) {
    console.log('篩選標籤:', tag); // 除錯用
    currentPosts = posts.filter(post => 
        post.tags && post.tags.includes(tag)
    );
    currentPage = 1; // 重設到第一頁
    renderPostsWithPagination();
    
    // 更新激活狀態
    document.querySelectorAll('.tag').forEach(tagEl => {
        tagEl.classList.remove('active');
        if (tagEl.dataset.tag === tag) {
            tagEl.classList.add('active');
        }
    });
}

// 設定回到頂部按鈕
function setupBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTop);
    
    // 監聽滾動事件
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    
    // 點擊回到頂部
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 更新個人資料
function updateProfileInfo() {
    if (window.commonComponents && window.SITE_CONFIG) {
        // 更新網站標題
        window.commonComponents.updateSiteTitle(window.SITE_CONFIG.siteTitle);
        
        // 更新個人資料
        const profile = window.SITE_CONFIG.profile;
        window.commonComponents.updateProfile(
            profile.name,
            profile.bio,
            profile.socialLinks
        );
    }
}

// 檢查 URL 篩選參數
function checkUrlFilters() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const tag = urlParams.get('tag');
    const search = urlParams.get('search');
    const page = urlParams.get('page');
    
    // 設定頁面
    if (page) {
        currentPage = parseInt(page) || 1;
    }
    
    if (category) {
        applyFilter('category', category);
    } else if (tag) {
        applyFilter('tag', tag);
    } else if (search) {
        applyFilter('search', search);
    }
}

// 應用篩選器
function applyFilter(filterType, filterValue) {
    if (filterType === 'category') {
        currentPosts = posts.filter(post => post.category === filterValue);
    } else if (filterType === 'tag') {
        currentPosts = posts.filter(post => 
            post.tags && post.tags.includes(filterValue)
        );
    } else if (filterType === 'search') {
        const searchTerm = filterValue.toLowerCase();
        currentPosts = posts.filter(post => 
            post.title.toLowerCase().includes(searchTerm) || 
            post.excerpt.toLowerCase().includes(searchTerm) ||
            post.content.toLowerCase().includes(searchTerm) ||
            (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
        );
    }
    
    // 確保頁面不超出範圍
    const totalPages = Math.ceil(currentPosts.length / POSTS_PER_PAGE);
    if (currentPage > totalPages) {
        currentPage = 1;
    }
}

// 清除篩選器
function clearFilters() {
    currentPosts = [...posts];
    currentPage = 1;
    
    // 清除 URL 參數
    const url = new URL(window.location.href);
    url.search = '';
    window.history.pushState({}, '', url);
    
    renderPostsWithPagination();
}

// 依分類篩選文章（供外部調用）
function filterPostsByCategory(category) {
    currentPosts = posts.filter(post => post.category === category);
    currentPage = 1;
    
    // 更新 URL
    const urlParams = new URLSearchParams();
    urlParams.set('category', category);
    const newUrl = window.location.pathname + '?' + urlParams.toString();
    window.history.pushState({}, '', newUrl);
    
    renderPostsWithPagination();
}

// 依標籤篩選文章（供外部調用）
function filterPostsByTag(tag) {
    currentPosts = posts.filter(post => post.tags && post.tags.includes(tag));
    currentPage = 1;
    
    // 更新 URL
    const urlParams = new URLSearchParams();
    urlParams.set('tag', tag);
    const newUrl = window.location.pathname + '?' + urlParams.toString();
    
    renderPostsWithPagination();
}

// 搜尋功能（供共用元件調用）
function performSearch(searchTerm) {
    if (!searchTerm.trim()) {
        clearFilters();
        return;
    }
    
    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
    );
    
    currentPosts = filteredPosts;
    currentPage = 1;
    
    // 更新 URL
    const urlParams = new URLSearchParams();
    urlParams.set('search', searchTerm);
    const newUrl = window.location.pathname + '?' + urlParams.toString();
    window.history.pushState({}, '', newUrl);
    
    renderPostsWithPagination();
}

// 工具函數：格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// 工具函數：計算閱讀時間
function calculateReadingTime(content) {
    const wordsPerMinute = window.SITE_CONFIG?.posts?.readingSpeed || 200;
    
    // 本地字數計算函數
    function countWords(content) {
        if (!content) return 0;
        const text = content
            .replace(/```[\s\S]*?```/g, '')
            .replace(/`.*?`/g, '')
            .replace(/\[.*?\]/g, '')
            .replace(/\(.*?\)/g, '')
            .replace(/[#*_~]/g, '');
        const chineseCount = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
        const englishCount = (text.match(/[a-zA-Z]+/g) || []).length;
        return chineseCount + englishCount;
    }
    
    const wordCount = window.Analytics && typeof Analytics.countWords === 'function' 
        ? Analytics.countWords(content) 
        : countWords(content);
    return Math.ceil(wordCount / wordsPerMinute);
}

// 導出函數供其他文件使用
window.blogUtils = {
    formatDate,
    calculateReadingTime,
    performSearch,
    filterPostsByCategory,
    filterPostsByTag,
    clearFilters,
    goToPage
};