// 時間主題切換系統

class ThemeManager {
    constructor() {
        this.themes = {
            morning: { start: 5, end: 10, name: 'morning', icon: '<i class="fas fa-cloud-sun"></i>', label: '早晨' },
            day: { start: 10, end: 16, name: 'day', icon: '<i class="fas fa-sun"></i>', label: '白天' },
            sunset: { start: 16, end: 19, name: 'sunset', icon: '<i class="fas fa-cloud-sun"></i>', label: '夕陽' },
            night: { start: 19, end: 24, name: 'night', icon: '<i class="fas fa-moon"></i>', label: '夜晚' },
            lateNight: { start: 0, end: 5, name: 'night', icon: '<i class="fas fa-moon"></i>', label: '深夜' }
        };
        
        this.currentTheme = null;
        this.stars = [];
        this.init();
    }

    init() {
        this.createDynamicElements();
        this.applyTheme();
        
        // 每10秒檢查一次時間（以防跨越主題時間段）
        setInterval(() => {
            this.applyTheme();
        }, 10000);

        // 添加主題切換動畫
        this.addThemeTransitionEffects();
    }

    createDynamicElements() {
        // 創建雲朵
        const cloudContainer = document.createElement('div');
        cloudContainer.className = 'cloud-container';
        
        for (let i = 1; i <= 3; i++) {
            const cloud = document.createElement('div');
            cloud.className = `dynamic-cloud cloud-${i}`;
            cloudContainer.appendChild(cloud);
        }
        
        document.body.insertBefore(cloudContainer, document.body.firstChild);

        // 創建星星
        const starContainer = document.createElement('div');
        starContainer.className = 'star-container';
        
        for (let i = 0; i < 30; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 3}s`;
            starContainer.appendChild(star);
            this.stars.push(star);
        }
        
        document.body.insertBefore(starContainer, document.body.firstChild);
    }

    getCurrentHour() {
        return new Date().getHours();
    }

    getThemeByTime(hour) {
        for (let key in this.themes) {
            const theme = this.themes[key];
            if (hour >= theme.start && hour < theme.end) {
                return theme;
            }
        }
        return this.themes.night; // 預設返回夜晚主題
    }

    applyTheme() {
        const hour = this.getCurrentHour();
        const theme = this.getThemeByTime(hour);

        // 如果主題沒有改變，則不做處理
        if (this.currentTheme === theme.name) {
            return;
        }

        // 移除所有主題類別
        document.body.classList.remove('theme-morning', 'theme-day', 'theme-sunset', 'theme-night');
        
        // 添加新主題類別
        document.body.classList.add(`theme-${theme.name}`);
        
        this.currentTheme = theme.name;

        console.log(`主題已切換至: ${theme.label} (${hour}:00)`);
    }

    addThemeTransitionEffects() {
        // 為頁面添加平滑過渡效果
        const style = document.createElement('style');
        style.textContent = `
            .theme-icon {
                font-size: 24px;
                animation: themeIconPulse 2s ease-in-out infinite;
            }

            @keyframes themeIconPulse {
                0%, 100% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.1);
                }
            }

            body.theme-night .hero-content h1,
            body.theme-night .hero-content p {
                text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
            }

            body.theme-sunset .hero-content h1,
            body.theme-sunset .hero-content p {
                text-shadow: 0 0 20px rgba(255, 107, 107, 0.5);
            }

            body.theme-morning .hero-content h1,
            body.theme-morning .hero-content p {
                text-shadow: 0 0 20px rgba(255, 183, 71, 0.3);
            }

            /* 夜晚模式下的文字顏色調整 */
            body.theme-night {
                color: #e8eaf6;
            }

            body.theme-night h1,
            body.theme-night h2,
            body.theme-night h3,
            body.theme-night h4 {
                color: #B0E7FF;
            }

            body.theme-night p {
                color: rgba(255, 255, 255, 0.9);
            }

            body.theme-night footer {
                background: rgba(26, 35, 126, 0.9);
                color: rgba(255, 255, 255, 0.9);
            }

            /* 主題過渡動畫 */
            body * {
                transition: color 0.5s ease, background-color 0.5s ease;
            }


        `;
        document.head.appendChild(style);
    }
}

// 當頁面載入完成時初始化主題管理器
document.addEventListener('DOMContentLoaded', function() {
    window.themeManager = new ThemeManager();
    console.log('時間主題系統已啟動');
});

// Export for use in other scripts
window.ThemeManager = ThemeManager;
