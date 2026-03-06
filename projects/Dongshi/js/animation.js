// 動畫效果

// Fade In Animation
const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeInObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// 文字浮現動畫
document.addEventListener('DOMContentLoaded', function() {
    // 為特定元素添加 fade-in 效果
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-delay, .fade-in-delay-2');
    animatedElements.forEach(el => {
        fadeInObserver.observe(el);
    });

    // 卡片動畫
    const cards = document.querySelectorAll('.spot-card, .event-card, .route-card, .link-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.5s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // 標題動畫
    const headings = document.querySelectorAll('h1, h2');
    headings.forEach((heading, index) => {
        heading.style.opacity = '0';
        heading.style.transform = 'translateY(-20px)';
        
        fadeInObserver.observe(heading);
    });
});

// 滾動顯示動畫
const scrollAnimationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

// CSS 動畫樣式（動態插入）
const style = document.createElement('style');
style.textContent = `
    .fade-in, .fade-in-delay, .fade-in-delay-2 {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.8s ease;
    }

    .fade-in.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .fade-in-delay.visible {
        opacity: 1;
        transform: translateY(0);
        transition-delay: 0.2s;
    }

    .fade-in-delay-2.visible {
        opacity: 1;
        transform: translateY(0);
        transition-delay: 0.4s;
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* 滾動進度條 */
    .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #00a8cc, #ffa500);
        z-index: 9999;
        transition: width 0.1s ease;
    }
`;
document.head.appendChild(style);

// 滾動進度條
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / documentHeight) * 100;
    
    progressBar.style.width = progress + '%';
});

// 平滑返回頂部
const createBackToTop = () => {
    const button = document.createElement('button');
    button.className = 'back-to-top';
    button.innerHTML = 'TOP';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 60px;
        height: 60px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 16px;
        font-weight: 700;
        letter-spacing: 1px;
        cursor: pointer;
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
    `;

    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    document.body.appendChild(button);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            button.style.opacity = '1';
            button.style.transform = 'scale(1)';
        } else {
            button.style.opacity = '0';
            button.style.transform = 'scale(0.8)';
        }
    });
};

// 初始化返回頂部按鈕
document.addEventListener('DOMContentLoaded', createBackToTop);

// 數字計數動畫
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// 視差滾動效果
window.addEventListener('scroll', () => {
    const parallaxElements = document.querySelectorAll('.hero-video, .hero-overlay');
    const scrolled = window.scrollY;
    
    parallaxElements.forEach(el => {
        if (el) {
            el.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
});
