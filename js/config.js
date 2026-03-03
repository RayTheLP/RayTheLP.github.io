// 網站設定檔
const SITE_CONFIG = {
    // 基本資訊
    siteTitle: 'raythelp' + "'s Blog",
    siteDescription: '分享技術心得和學習筆記的地方',
    
    // 個人資料
    profile: {
        name: 'raythelp',
        bio: 'Basically an useless college student',
        avatar: 'fas fa-dog', // Font Awesome 圖標（備用）
        avatarImage: 'images/avatar.jpg', // 頭像圖片路徑
        socialLinks: {
            github: 'https://github.com/raythelp',
            instagram: 'https://www.instagram.com/_ray0530/',
            email: 'mailto:ray079099@gmail.com'
        }
    },
    
    // 導航選單
    navigation: [
        { name: 'Home', url: 'index.html', icon: 'fas fa-home' },
        { name: 'Timeline', url: 'posts.html', icon: 'fas fa-file-alt' },
        { name: 'About', url: 'about.html', icon: 'fas fa-user' },
        { name: 'GitHub', url: 'https://github.com/raythelp', icon: 'fab fa-github', external: true }
    ],
    
    // 主題設定
    theme: {
        default: 'dark', // 'dark' 或 'light'
        autoSwitch: false // 是否根據系統主題自動切換
    },
    
    // 文章設定
    posts: {
        postsPerPage: 10,
        excerptLength: 150,
        readingSpeed: 200 // 每分鐘閱讀字數
    },
    
    // 搜尋設定
    search: {
        debounceTime: 300, // 搜尋防抖時間（毫秒）
        minSearchLength: 2 // 最小搜尋字數
    },
    
    // 統計設定
    analytics: {
        storageKey: 'blog_views_',  // localStorage 的鍵值前綴
        enabled: true  // 是否啟用統計功能
    }
};

// 個人化設定函數
function updateSiteConfig(newConfig) {
    Object.assign(SITE_CONFIG, newConfig);
}

// 獲取設定值
function getConfig(key) {
    return key.split('.').reduce((obj, k) => obj && obj[k], SITE_CONFIG);
}

// 設定個人資料
function setProfile(name, bio, socialLinks = {}) {
    SITE_CONFIG.profile.name = name;
    SITE_CONFIG.profile.bio = bio;
    Object.assign(SITE_CONFIG.profile.socialLinks, socialLinks);
}

// 設定網站標題
function setSiteTitle(title) {
    SITE_CONFIG.siteTitle = title;
}

// 設定導航選單
function setNavigation(navigation) {
    SITE_CONFIG.navigation = navigation;
}

// 導出設定
window.SITE_CONFIG = SITE_CONFIG;
window.updateSiteConfig = updateSiteConfig;
window.getConfig = getConfig;
window.setProfile = setProfile;
window.setSiteTitle = setSiteTitle;
window.setNavigation = setNavigation; 