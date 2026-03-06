// 照片輪播功能
class PhotoCarousel {
    constructor(container) {
        this.container = container;
        this.track = container.querySelector('.photo-carousel-track');
        this.slides = Array.from(this.track.children);
        this.prevBtn = container.querySelector('.photo-carousel-btn.prev');
        this.nextBtn = container.querySelector('.photo-carousel-btn.next');
        this.dotsContainer = document.querySelector('.photo-carousel-dots');
        this.dots = Array.from(this.dotsContainer.children);
        
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        
        this.init();
    }
    
    init() {
        // 設定按鈕事件
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
        
        // 設定指示點事件
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // 啟動自動播放
        this.startAutoPlay();
        
        // 滑鼠懸停時暫停自動播放
        this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.container.addEventListener('mouseleave', () => this.startAutoPlay());
        
        // 觸控支援
        this.addTouchSupport();
        
        // 鍵盤支援
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });
    }
    
    goToSlide(index) {
        // 確保索引在有效範圍內
        if (index < 0) index = this.slides.length - 1;
        if (index >= this.slides.length) index = 0;
        
        this.currentIndex = index;
        const offset = -100 * index;
        this.track.style.transform = `translateX(${offset}%)`;
        
        // 更新指示點
        this.updateDots();
    }
    
    prev() {
        this.goToSlide(this.currentIndex - 1);
    }
    
    next() {
        this.goToSlide(this.currentIndex + 1);
    }
    
    updateDots() {
        this.dots.forEach((dot, index) => {
            if (index === this.currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, 4000); // 每4秒切換一次
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    addTouchSupport() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            this.stopAutoPlay();
        });
        
        this.track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        });
        
        this.track.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            
            const diff = startX - currentX;
            
            // 滑動超過50px才切換
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
            
            this.startAutoPlay();
        });
    }
}

// 當頁面載入時初始化照片輪播
document.addEventListener('DOMContentLoaded', () => {
    const photoCarouselContainer = document.querySelector('.photo-carousel-container');
    if (photoCarouselContainer) {
        new PhotoCarousel(photoCarouselContainer);
        console.log('✓ 照片輪播已啟動');
    }
});
