// 導入頁動畫控制

// 等待頁面載入完成
document.addEventListener('DOMContentLoaded', function() {
    // 設定自動跳轉時間（3.5秒後）
    const autoRedirectTime = 3500;
    
    // 自動跳轉到首頁
    setTimeout(() => {
        redirectToHome();
    }, autoRedirectTime);
    
    // 添加額外的視覺效果
    addSparkles();
});

// 跳過介紹，直接進入首頁
function skipIntro() {
    redirectToHome();
}

// 跳轉到首頁的函數
function redirectToHome() {
    // 添加淡出效果
    const container = document.querySelector('.welcome-container');
    container.style.transition = 'opacity 0.8s ease-out';
    container.style.opacity = '0';
    
    // 等待淡出動畫完成後跳轉
    setTimeout(() => {
        window.location.href = 'welcome.html';
    }, 800);
}

// 添加閃爍的星星效果
function addSparkles() {
    const container = document.querySelector('.welcome-container');
    const sparkleCount = 30;
    
    for (let i = 0; i < sparkleCount; i++) {
        setTimeout(() => {
            createSparkle(container);
        }, i * 100);
    }
}

// 創建單個星星元素
function createSparkle(container) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.innerHTML = '<i class="fas fa-star"></i>';
    
    // 隨機位置
    sparkle.style.position = 'absolute';
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.top = Math.random() * 100 + '%';
    sparkle.style.fontSize = (Math.random() * 20 + 15) + 'px';
    sparkle.style.opacity = '0';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '5';
    
    container.appendChild(sparkle);
    
    // 動畫效果
    setTimeout(() => {
        sparkle.style.transition = 'all 1.5s ease-out';
        sparkle.style.opacity = '0.8';
        sparkle.style.transform = 'translateY(-50px) scale(1.5)';
    }, 50);
    
    // 移除元素
    setTimeout(() => {
        sparkle.style.opacity = '0';
        setTimeout(() => {
            sparkle.remove();
        }, 1500);
    }, 1000);
}

// 添加鍵盤事件：按下 Enter 或 Space 跳過
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Escape') {
        skipIntro();
    }
});

// 點擊任意位置也可以跳過（除了跳過按鈕本身）
document.querySelector('.welcome-container').addEventListener('click', function(event) {
    if (!event.target.classList.contains('skip-btn')) {
        skipIntro();
    }
});

// 防止載入時的閃爍
window.addEventListener('load', function() {
    document.body.style.opacity = '1';
});

// 控制台輸出歡迎訊息
console.log('%c歡迎來到浪在東石站！', 'color: #0099cc; font-size: 20px; font-weight: bold;');
console.log('%c跟著牡蠣寶寶一起探索東石的美好！', 'color: #00d4ff; font-size: 14px;');
