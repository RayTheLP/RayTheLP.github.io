// 共用元件管理
class CommonComponents {
    constructor() {
        this.initTemplates();
        this.initComponents();
        this.initVisitorCount();
    }

    // 初始化所有元件
    initComponents() {
        this.initHeader();
        this.initSidebar();
        this.initFooter();
    }

    // 初始化訪客計數
    initVisitorCount() {
        // 從 localStorage 獲取訪客計數
        let count = parseInt(localStorage.getItem('visitorCount') || '0');
        
        // 如果是新的瀏覽階段，增加計數
        if (!sessionStorage.getItem('visited')) {
            count++;
            localStorage.setItem('visitorCount', count.toString());
            sessionStorage.setItem('visited', 'true');
        }
        
        // 更新顯示
        const visitorCountElement = document.getElementById('visitorCount');
        if (visitorCountElement) {
            visitorCountElement.textContent = count.toString();
        }
    }

    // 初始化模板
    initTemplates() {
        // 頁尾 HTML 模板
        this.footerTemplate = `
            <footer class="footer">
                <div class="footer-content">
                    <div class="visitor-count">
                        <i class="fas fa-users"></i>
                        <span>Blog Visitors: <span id="visitorCount">0</span></span>
                    </div>
                    <p>© ${new Date().getFullYear()} ${window.SITE_CONFIG?.profile?.name || 'raythelp'} All Rights Reserved.</p>
                    <p>Built by <a href="https://pages.github.com/" target="_blank" rel="noopener">Github Pages</a></p>
                </div>
            </footer>
        `;

        // 頁首 HTML 模板
        this.headerTemplate = `
            <header class="header">
                <div class="header-content">
                    <a href="index.html" class="logo">
                        <i class="fas fa-home"></i>
                        <span id="siteTitle">${window.SITE_CONFIG?.siteTitle || '我的部落格'}</span>
                    </a>
                    <nav class="nav">
                        ${this.generateNavigation()}
                    </nav>
                    <div class="header-controls">
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input type="text" placeholder="搜尋..." id="searchInput">
                        </div>
                        <div class="color-picker-container">
                            <button class="color-picker-toggle" id="colorPickerToggle" title="自定義顏色">
                                <i class="fas fa-palette"></i>
                            </button>
                            <div class="color-picker-panel" id="colorPickerPanel">
                                <div class="color-picker-header">日間模式背景色調</div>
                                <div class="color-preview" id="colorPreview"></div>
                                <div class="hue-slider-container">
                                    <label class="hue-slider-label" for="hueSlider">色調 (Hue)</label>
                                    <input type="range" id="hueSlider" class="hue-slider" min="0" max="360" value="250">
                                    <div class="hue-value" id="hueValue">250°</div>
                                </div>
                                <div class="color-actions">
                                    <button class="color-btn" id="applyColor">套用</button>
                                    <button class="color-btn reset" id="resetColor">重設</button>
                                </div>
                            </div>
                        </div>
                        <button class="theme-toggle" id="themeToggle">
                            <i class="fas fa-moon"></i>
                        </button>
                    </div>
                </div>
            </header>
        `;

        // 側邊欄 HTML 模板
        this.sidebarTemplate = `
            <aside class="sidebar">
                <!-- 個人資料卡片 -->
                <div class="profile-card">
                    <div class="profile-avatar">
                        <img src="AVATAR_URL_PLACEHOLDER" alt="${window.SITE_CONFIG?.profile?.name || '頭像'}" onerror="this.parentNode.innerHTML='<i class=&quot;fas fa-dog&quot;></i>';">
                    </div>
                    <h3 class="profile-name" id="profileName">${window.SITE_CONFIG?.profile?.name || '你的名字'}</h3>
                    <p class="profile-bio" id="profileBio">${window.SITE_CONFIG?.profile?.bio || '你的簡介'}</p>
                    <div class="social-links">
                        ${this.generateSocialLinks()}
                    </div>
                </div>

                <!-- 分類列表 -->
                <div class="sidebar-section">
                    <h3 class="section-title">Categories</h3>
                    <ul class="category-list" id="categoryList">
                        <!-- 分類將由 JavaScript 動態生成 -->
                    </ul>
                </div>

                <!-- 標籤雲 -->
                <div class="sidebar-section">
                    <h3 class="section-title">Tags</h3>
                    <div class="tag-cloud" id="tagCloud">
                        <!-- 標籤將由 JavaScript 動態生成 -->
                    </div>
                </div>
            </aside>
        `;
    }

    // 生成導航選單
    generateNavigation() {
        const navigation = window.SITE_CONFIG?.navigation || [
            { name: '首頁', url: 'index.html', icon: 'fas fa-home' },
            { name: '文章', url: '#', icon: 'fas fa-file-alt' },
            { name: '關於', url: 'about.html', icon: 'fas fa-user' },
            { name: 'GitHub', url: '#', icon: 'fab fa-github', external: true }
        ];

        return navigation.map(item => {
            const externalIcon = item.external ? ' <i class="fas fa-external-link-alt"></i>' : '';
            return `<a href="${item.url}" class="nav-link" ${item.external ? 'target="_blank"' : ''}>
                ${item.name}${externalIcon}
            </a>`;
        }).join('');
    }

    // 生成社交連結
    generateSocialLinks() {
        const socialLinks = window.SITE_CONFIG?.profile?.socialLinks || {};
        const socialIcons = {
            github: 'fab fa-github',
            linkedin: 'fab fa-linkedin',
            twitter: 'fab fa-twitter',
            instagram: 'fab fa-instagram',
            email: 'fas fa-envelope'
        };

        return Object.entries(socialLinks).map(([platform, url]) => {
            const icon = socialIcons[platform];
            if (!icon) return '';
            
            return `<a href="${url}" class="social-link" target="_blank"><i class="${icon}"></i></a>`;
        }).join('');
    }

    // 初始化頁首
    initHeader() {
        const headerContainer = document.querySelector('#headerContainer');
        if (headerContainer) {
            headerContainer.innerHTML = this.headerTemplate;
            this.setupHeaderControls();
        }
    }

    // 初始化側邊欄
    initSidebar() {
        const sidebarContainer = document.querySelector('#sidebarContainer');
        if (sidebarContainer) {
            // 生成帶時間戳的圖片 URL 避免緩存
            const timestamp = Date.now();
            const avatarUrl = (window.SITE_CONFIG?.profile?.avatarImage || 'images/avatar.jpg') + '?v=' + timestamp;
            
            // 替換模板中的圖片 URL 占位符
            const sidebarHtml = this.sidebarTemplate.replace('AVATAR_URL_PLACEHOLDER', avatarUrl);
            
            sidebarContainer.innerHTML = sidebarHtml;
            
            console.log('側邊欄已渲染，頭像 URL:', avatarUrl);
            console.log('檢查圖片路徑是否正確:', avatarUrl);
        }
    }

    // 初始化頁尾
    initFooter() {
        const footerContainer = document.querySelector('#footerContainer');
        if (footerContainer) {
            footerContainer.innerHTML = this.footerTemplate;
        }
    }

    // 設定頁首控制項
    setupHeaderControls() {
        // 主題切換
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const savedTheme = localStorage.getItem('theme') || window.SITE_CONFIG?.theme?.default || 'dark';
            document.documentElement.setAttribute('data-theme', savedTheme);
            this.updateThemeIcon(themeToggle.querySelector('i'), savedTheme);

            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                this.updateThemeIcon(themeToggle.querySelector('i'), newTheme);
                
                // 根據主題套用或重設自定義顏色
                if (newTheme === 'light') {
                    const savedHue = localStorage.getItem('customHue') || '250';
                    this.applyCustomColor(savedHue);
                } else {
                    this.resetToDefaultColors();
                }
            });
        }

        // 搜尋功能
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            let searchTimeout;
            const debounceTime = window.SITE_CONFIG?.search?.debounceTime || 300;
            
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    const searchTerm = e.target.value.toLowerCase();
                    this.performSearch(searchTerm);
                }, debounceTime);
            });
        }

        // 調色盤功能
        this.setupColorPicker();
    }

    // 設定調色盤功能
    setupColorPicker() {
        const colorPickerToggle = document.getElementById('colorPickerToggle');
        const colorPickerPanel = document.getElementById('colorPickerPanel');
        const hueSlider = document.getElementById('hueSlider');
        const hueValue = document.getElementById('hueValue');
        const colorPreview = document.getElementById('colorPreview');
        const applyButton = document.getElementById('applyColor');
        const resetButton = document.getElementById('resetColor');

        if (!colorPickerToggle || !colorPickerPanel) return;

        // 從 localStorage 載入儲存的色調值，預設為 250
        const savedHue = localStorage.getItem('customHue') || '250';
        hueSlider.value = savedHue;
        this.updateColorPreview(savedHue);
        this.updateHueValue(savedHue);

        // 套用儲存的顏色
        if (document.documentElement.getAttribute('data-theme') === 'light') {
            this.applyCustomColor(savedHue);
        }

        // 切換調色盤面板
        colorPickerToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            colorPickerPanel.classList.toggle('show');
        });

        // 點擊外部關閉面板
        document.addEventListener('click', (e) => {
            if (!colorPickerPanel.contains(e.target) && !colorPickerToggle.contains(e.target)) {
                colorPickerPanel.classList.remove('show');
            }
        });

        // 色調滑桿變更
        hueSlider.addEventListener('input', (e) => {
            const hue = e.target.value;
            this.updateColorPreview(hue);
            this.updateHueValue(hue);
        });

        // 套用顏色
        applyButton.addEventListener('click', () => {
            const hue = hueSlider.value;
            localStorage.setItem('customHue', hue);
            if (document.documentElement.getAttribute('data-theme') === 'light') {
                this.applyCustomColor(hue);
            }
            colorPickerPanel.classList.remove('show');
        });

        // 重設顏色
        resetButton.addEventListener('click', () => {
            hueSlider.value = '250';
            this.updateColorPreview('250');
            this.updateHueValue('250');
            localStorage.removeItem('customHue');
            if (document.documentElement.getAttribute('data-theme') === 'light') {
                this.applyCustomColor('250');
            }
            colorPickerPanel.classList.remove('show');
        });
    }

    // 更新顏色預覽
    updateColorPreview(hue) {
        const colorPreview = document.getElementById('colorPreview');
        if (colorPreview) {
            const bgColor = `hsl(${hue}, 15%, 95%)`;
            colorPreview.style.backgroundColor = bgColor;
        }
    }

    // 更新色調數值顯示
    updateHueValue(hue) {
        const hueValue = document.getElementById('hueValue');
        if (hueValue) {
            hueValue.textContent = `${hue}°`;
        }
    }

    // 套用自定義顏色
    applyCustomColor(hue) {
        const root = document.documentElement;
        const bgPrimary = `hsl(${hue}, 15%, 95%)`;
        const bgSecondary = `hsl(${hue}, 20%, 98%)`;
        const bgCard = `hsl(${hue}, 25%, 99%)`;
        const borderColor = `hsl(${hue}, 10%, 88%)`;

        root.style.setProperty('--bg-primary', bgPrimary);
        root.style.setProperty('--bg-secondary', bgSecondary);
        root.style.setProperty('--bg-card', bgCard);
        root.style.setProperty('--border-color', borderColor);
    }

    // 重設為預設顏色
    resetToDefaultColors() {
        const root = document.documentElement;
        root.style.removeProperty('--bg-primary');
        root.style.removeProperty('--bg-secondary');
        root.style.removeProperty('--bg-card');
        root.style.removeProperty('--border-color');
    }

    // 更新主題圖標
    updateThemeIcon(icon, theme) {
        if (theme === 'light') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }

    // 執行搜尋
    performSearch(searchTerm) {
        const minLength = window.SITE_CONFIG?.search?.minSearchLength || 2;
        if (searchTerm.length < minLength) {
            if (window.blogUtils && window.blogUtils.performSearch) {
                window.blogUtils.performSearch('');
            }
            return;
        }
        
        // 搜尋邏輯將由 main.js 處理
        if (window.blogUtils && window.blogUtils.performSearch) {
            window.blogUtils.performSearch(searchTerm);
        }
    }

    // 更新個人資料
    updateProfile(name, bio, socialLinks = {}) {
        const profileName = document.getElementById('profileName');
        const profileBio = document.getElementById('profileBio');
        
        if (profileName) profileName.textContent = name;
        if (profileBio) profileBio.textContent = bio;

        // 更新社交連結
        if (socialLinks.github) {
            const githubLink = document.querySelector('.social-link[href="#"]');
            if (githubLink) githubLink.href = socialLinks.github;
        }
    }

    // 更新網站標題
    updateSiteTitle(title) {
        const siteTitle = document.getElementById('siteTitle');
        if (siteTitle) siteTitle.textContent = title;
    }
}

// 創建全域實例
window.commonComponents = new CommonComponents();

// 頁面載入時自動初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化頁首
    window.commonComponents.initHeader();
    
    // 初始化側邊欄（如果存在）
    const sidebarContainer = document.querySelector('#sidebarContainer');
    if (sidebarContainer) {
        const timestamp = Date.now();
        const avatarUrl = (window.SITE_CONFIG?.profile?.avatarImage || 'images/avatar.jpg') + '?v=' + timestamp;
        
        const sidebarHtml = window.commonComponents.sidebarTemplate.replace('AVATAR_URL_PLACEHOLDER', avatarUrl);
        
        sidebarContainer.innerHTML = sidebarHtml;
        console.log('側邊欄已渲染，頭像 URL:', avatarUrl);
    }

    // 初始化頁尾
    window.commonComponents.initFooter();

    // 初始化訪客計數
    window.commonComponents.initVisitorCount();
}); 