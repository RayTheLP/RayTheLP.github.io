// 美食頁面功能 - 「了解更多」按鈕

document.addEventListener('DOMContentLoaded', function() {
    // 取得所有「了解更多」按鈕
    const learnMoreButtons = document.querySelectorAll('.event-card .btn-primary');
    
    learnMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 找到該按鈕所屬的卡片
            const card = this.closest('.event-card');
            
            // 取得餐廳名稱
            const restaurantName = card.querySelector('h3').textContent.trim();
            
            // 建立 Google 搜尋 URL
            const searchQuery = encodeURIComponent(`${restaurantName} 東石`);
            const googleSearchURL = `https://www.google.com/search?q=${searchQuery}`;
            
            // 在新分頁開啟搜尋結果
            window.open(googleSearchURL, '_blank');
        });
    });
});
