class WheelOfSurf {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.spinButton = document.getElementById('spinButton');
        this.resultDisplay = document.getElementById('resultDisplay');
        this.resultText = document.getElementById('resultText');
        this.resultInfo = document.getElementById('resultInfo');
        this.spotSelect = document.getElementById('spotSelect');
        this.addSpotBtn = document.getElementById('addSpotBtn');
        this.selectedSpotsList = document.getElementById('selectedSpotsList');
        this.mascotCheer = document.getElementById('mascotCheer');

        // 從 map.js 獲取景點數據
        this.allSpots = this.getMapSpots();
        
        // 用戶選擇的景點
        this.selectedSpots = [];
        
        // 預設景點（如果用戶沒有選擇）
        this.defaultSpots = [
            { id: 2, name: '東石漁人碼頭', type: '觀光碼頭', desc: '海風步道與拍照點，適合悠閒走走看海景。', color: 'rgba(65, 145, 130, 0.65)' },
            { id: 5, name: '鰲鼓濕地森林園區', type: '濕地生態', desc: '濕地與林帶交織的自然區域，適合散步與生態觀察。', color: 'rgba(75, 140, 120, 0.65)' },
            { id: 1, name: '東石漁港', type: '漁港', desc: '港邊散步看船景，感受東石海港日常。', color: 'rgba(70, 130, 150, 0.65)' },
            { id: 10, name: '東石先天宮', type: '廟宇', desc: '在地信仰中心之一，路過可參拜祈福、感受廟埕氛圍。', color: 'rgba(165, 120, 120, 0.65)' },
            { id: 101, name: '塭ㄚ烤蚵', type: '烤蚵', desc: '主打烤蚵等海味料理，適合安排用餐補充體力。', color: 'rgba(180, 140, 100, 0.65)' },
            { id: 7, name: '紅樹林生態公園', type: '生態公園', desc: '紅樹林景觀帶，適合散步賞景、觀察潮間帶生態。', color: 'rgba(120, 130, 150, 0.65)' }
        ];

        this.currentRotation = 0;
        this.isSpinning = false;
        this.selectedIndex = -1; // 記錄最終選中的索引

        this.spinButtonDefaultText = this.spinButton ? this.spinButton.textContent : '開始轉動！';
        
        this.init();
    }

    getMapSpots() {
        // 從 map.js 獲取景點數據（map.js 會掛到 window.spots）
        const rawSpots = (typeof window !== 'undefined' && Array.isArray(window.spots)) ? window.spots : [];
        if (rawSpots.length > 0) {
            return rawSpots.map(spot => ({
                id: spot.id,
                name: spot.name,
                type: spot.type,
                desc: spot.desc,
                color: this.getColorByType(spot.type)
            }));
        }
        return [];
    }

    getColorByType(type) {
        // 低調沉穩色調 - 降低亮度和飽和度
        const colorMap = {
            '漁港': 'rgba(70, 130, 150, 0.65)',
            '觀光碼頭': 'rgba(65, 145, 130, 0.65)',
            '橋樑': 'rgba(100, 130, 150, 0.65)',
            '歷史建築': 'rgba(160, 125, 110, 0.65)',
            '濕地生態': 'rgba(75, 140, 120, 0.65)',
            '生態教育': 'rgba(175, 150, 100, 0.65)',
            '生態公園': 'rgba(120, 130, 150, 0.65)',
            '休閒農漁': 'rgba(85, 140, 145, 0.65)',
            '沙洲景觀': 'rgba(180, 155, 110, 0.65)',
            '廟宇': 'rgba(165, 120, 120, 0.65)',
            '觀光工廠': 'rgba(105, 145, 140, 0.65)',
            '烤蚵': 'rgba(180, 140, 100, 0.65)',
            '吃到飽': 'rgba(175, 145, 115, 0.65)',
            '餐廳': 'rgba(95, 145, 120, 0.65)',
            '小吃': 'rgba(185, 160, 120, 0.65)',
            '民宿': 'rgba(135, 120, 140, 0.65)'
        };
        return colorMap[type] || 'rgba(70, 130, 150, 0.65)';
    }

    init() {
        if (this.mascotCheer) {
            this.mascotCheer.classList.remove('show');
            this.mascotCheer.setAttribute('aria-hidden', 'true');
        }

        // 自製下拉選單元素
        this.selectWrapper = document.getElementById('spotSelectWrapper');
        this.selectTrigger = document.getElementById('spotSelectTrigger');
        this.selectOptions = document.getElementById('spotSelectOptions');

        // 初始化景點下拉選單
        this.populateSpotSelect();
        
        // 載入儲存的景點或使用預設
        this.loadSavedSpots();
        if (this.selectedSpots.length === 0) {
            this.selectedSpots = [...this.defaultSpots];
        }
        
        this.updateSelectedSpotsList();
        this.drawWheel();
        
        // 事件監聽
        this.addSpotBtn.addEventListener('click', () => this.addSpot());
        this.spinButton.addEventListener('click', () => this.spin());

        // 自製下拉選單事件
        this.selectTrigger.addEventListener('click', () => this.toggleSelect());
        document.addEventListener('click', (e) => {
            if (!this.selectWrapper.contains(e.target)) {
                this.closeSelect();
            }
        });
    }

    toggleSelect() {
        this.selectWrapper.classList.toggle('open');
    }

    closeSelect() {
        this.selectWrapper.classList.remove('open');
    }

    selectOption(spotId, spotName) {
        this.spotSelect.value = spotId;
        this.selectTrigger.querySelector('span').textContent = spotName;
        this.closeSelect();
        // 移除其他 selected 狀態
        this.selectOptions.querySelectorAll('.custom-select-option').forEach(opt => {
            opt.classList.toggle('selected', opt.dataset.id === String(spotId));
        });
    }

    populateSpotSelect() {
        if (this.allSpots.length === 0) return;
        
        // 按類型分組
        const grouped = {};
        this.allSpots.forEach(spot => {
            if (!grouped[spot.type]) {
                grouped[spot.type] = [];
            }
            grouped[spot.type].push(spot);
        });
        
        // 建立自製下拉選項
        let html = '';
        Object.keys(grouped).sort().forEach(type => {
            html += `<div class="custom-select-group">`;
            html += `<div class="custom-select-group-label">${type}</div>`;
            grouped[type].forEach(spot => {
                html += `<div class="custom-select-option" data-id="${spot.id}" data-name="${spot.name}">${spot.name}</div>`;
            });
            html += `</div>`;
        });
        this.selectOptions.innerHTML = html;

        // 綁定選項點擊事件
        this.selectOptions.querySelectorAll('.custom-select-option').forEach(opt => {
            opt.addEventListener('click', () => {
                this.selectOption(opt.dataset.id, opt.dataset.name);
            });
        });
    }

    addSpot() {
        const selectedId = parseInt(this.spotSelect.value);
        if (!selectedId) {
            alert('請先選擇一個景點！');
            return;
        }
        
        const spot = this.allSpots.find(s => s.id === selectedId);
        if (!spot) return;
        
        // 檢查是否已存在
        if (this.selectedSpots.find(s => s.id === spot.id)) {
            alert('這個景點已經在轉盤上了！');
            return;
        }
        
        // 限制最多 12 個景點
        if (this.selectedSpots.length >= 12) {
            alert('轉盤最多只能放 12 個景點哦！');
            return;
        }
        
        this.selectedSpots.push(spot);
        this.updateSelectedSpotsList();
        this.drawWheel();
        this.saveSpots();
        
        // 重置選單
        this.spotSelect.value = '';
        this.selectTrigger.querySelector('span').textContent = '從地圖選擇景點...';
        this.selectOptions.querySelectorAll('.custom-select-option').forEach(opt => {
            opt.classList.remove('selected');
        });
    }

    removeSpot(spotId) {
        this.selectedSpots = this.selectedSpots.filter(s => s.id !== spotId);
        this.updateSelectedSpotsList();
        this.drawWheel();
        this.saveSpots();
    }

    updateSelectedSpotsList() {
        if (this.selectedSpots.length === 0) {
            this.selectedSpotsList.innerHTML = '<p class="no-spots">還沒有選擇景點，將使用預設景點</p>';
            return;
        }
        
        this.selectedSpotsList.innerHTML = this.selectedSpots.map(spot => `
            <div class="spot-tag">
                <span>${spot.name}</span>
                <button onclick="wheelInstance.removeSpot(${spot.id})" class="remove-spot">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }

    drawWheel() {
        const spots = this.selectedSpots.length > 0 ? this.selectedSpots : this.defaultSpots;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 15;
        const numSegments = spots.length;
        const anglePerSegment = (2 * Math.PI) / numSegments;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 繪製外圈裝飾
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius + 8, 0, 2 * Math.PI);
        this.ctx.strokeStyle = '#ffa500';
        this.ctx.lineWidth = 8;
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius + 12, 0, 2 * Math.PI);
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        // 繪製每個區塊
        spots.forEach((spot, index) => {
            const startAngle = index * anglePerSegment + this.currentRotation;
            const endAngle = startAngle + anglePerSegment;

            // 繪製扇形
            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY);
            this.ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            this.ctx.closePath();
            
            // 玻璃質感漸層效果
            const gradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
            gradient.addColorStop(0, this.lightenColorRgba(spot.color, 0.25));
            gradient.addColorStop(0.5, spot.color);
            gradient.addColorStop(1, this.darkenColorRgba(spot.color, 0.15));
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
            
            // 柔和半透明邊框
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            // 繪製文字
            this.ctx.save();
            this.ctx.translate(centerX, centerY);
            this.ctx.rotate(startAngle + anglePerSegment / 2);
            this.ctx.textAlign = 'center';
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 18px "Noto Sans TC", sans-serif';
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
            this.ctx.shadowBlur = 4;
            this.ctx.shadowOffsetX = 2;
            this.ctx.shadowOffsetY = 2;
            this.ctx.fillText(spot.name, radius * 0.65, 6);
            this.ctx.restore();
        });

        // 繪製中心圓外圈 - 低調玻璃質感
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 50, 0, 2 * Math.PI);
        const centerGradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 50);
        centerGradient.addColorStop(0, 'rgba(240, 245, 248, 0.92)');
        centerGradient.addColorStop(0.6, 'rgba(220, 230, 235, 0.88)');
        centerGradient.addColorStop(1, 'rgba(190, 210, 220, 0.85)');
        this.ctx.fillStyle = centerGradient;
        this.ctx.fill();
        this.ctx.strokeStyle = 'rgba(70, 130, 145, 0.5)';
        this.ctx.lineWidth = 4;
        this.ctx.stroke();

        // 內圈裝飾 - 低調色調
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 44, 0, 2 * Math.PI);
        this.ctx.strokeStyle = 'rgba(80, 130, 140, 0.35)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // 中心文字 - 低調色調
        this.ctx.fillStyle = 'rgba(60, 110, 125, 0.85)';
        this.ctx.font = 'bold 16px "Noto Sans TC", sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.shadowColor = 'transparent';
        this.ctx.fillText('SPIN', centerX, centerY + 6);
    }

    lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    }

    // 玻璃質感輔助函數 - 讓 rgba 顏色變亮
    lightenColorRgba(rgbaColor, amount) {
        const match = rgbaColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (!match) return rgbaColor;
        const r = Math.min(255, parseInt(match[1]) + Math.round(255 * amount));
        const g = Math.min(255, parseInt(match[2]) + Math.round(255 * amount));
        const b = Math.min(255, parseInt(match[3]) + Math.round(255 * amount));
        const a = match[4] ? parseFloat(match[4]) : 1;
        return `rgba(${r}, ${g}, ${b}, ${Math.min(1, a + 0.1)})`;
    }

    // 玻璃質感輔助函數 - 讓 rgba 顏色變暗
    darkenColorRgba(rgbaColor, amount) {
        const match = rgbaColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (!match) return rgbaColor;
        const r = Math.max(0, parseInt(match[1]) - Math.round(255 * amount));
        const g = Math.max(0, parseInt(match[2]) - Math.round(255 * amount));
        const b = Math.max(0, parseInt(match[3]) - Math.round(255 * amount));
        const a = match[4] ? parseFloat(match[4]) : 1;
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    normalizeAngle(angle) {
        const twoPi = Math.PI * 2;
        return ((angle % twoPi) + twoPi) % twoPi;
    }

    getIndexAtPointer(numSegments) {
        const twoPi = Math.PI * 2;
        const anglePerSegment = twoPi / numSegments;
        const pointerAngle = -Math.PI / 2; // 12點鐘方向
        const relative = this.normalizeAngle(pointerAngle - this.currentRotation);
        return Math.floor(relative / anglePerSegment);
    }

    spin() {
        if (this.isSpinning) return;
        
        const spots = this.selectedSpots.length > 0 ? this.selectedSpots : this.defaultSpots;
        if (spots.length < 2) {
            alert('至少需要 2 個景點才能轉動轉盤！');
            return;
        }

        this.isSpinning = true;
        this.spinButton.disabled = true;
        this.spinButton.textContent = '轉動中…';
        this.spinButton.setAttribute('aria-busy', 'true');
        this.resultDisplay.classList.remove('show');
        if (this.mascotCheer) {
            this.mascotCheer.classList.remove('show');
            this.mascotCheer.setAttribute('aria-hidden', 'true');
        }

        // 真正隨機選擇一個結果
        const randomIndex = Math.floor(Math.random() * spots.length);
        this.selectedIndex = randomIndex;
        
        const twoPi = Math.PI * 2;
        const anglePerSegment = twoPi / spots.length;

        // 重要：Canvas 的 0 度在 3 點鐘方向，指針在 12 點鐘方向（-π/2）。
        // 區塊中心角 = rotation + (index + 0.5) * anglePerSegment
        // 令區塊中心對準指針：rotation = -π/2 - (index + 0.5) * anglePerSegment
        const targetCenter = (randomIndex + 0.5) * anglePerSegment;
        const desiredRotation = this.normalizeAngle(-Math.PI / 2 - targetCenter);
        const currentRotationNorm = this.normalizeAngle(this.currentRotation);
        let delta = this.normalizeAngle(desiredRotation - currentRotationNorm);

        // 加上多圈旋轉效果（順時針）
        const spins = 5;
        delta += twoPi * spins;

        const startRotation = this.currentRotation;
        const totalRotation = delta;

        const duration = 4800; // 4.8 秒
        const startTime = Date.now();

        const animate = () => {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // 使用 easeOutCubic 效果
            const easeOut = 1 - Math.pow(1 - progress, 3);
            this.currentRotation = startRotation + (totalRotation * easeOut);

            this.drawWheel();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.currentRotation = this.normalizeAngle(this.currentRotation);
                const landedIndex = this.getIndexAtPointer(spots.length);
                this.selectedIndex = landedIndex;
                this.showResult(landedIndex);
                this.isSpinning = false;
                this.spinButton.disabled = false;
                this.spinButton.textContent = this.spinButtonDefaultText;
                this.spinButton.setAttribute('aria-busy', 'false');
            }
        };

        animate();
    }

    showResult(index) {
        const spots = this.selectedSpots.length > 0 ? this.selectedSpots : this.defaultSpots;
        const spot = spots[index];
        
        this.resultText.textContent = spot.name;
        this.resultInfo.innerHTML = `
            <p><strong>類型：</strong>${spot.type}</p>
            <p class="spot-description">${spot.desc}</p>
        `;

        // 設定前往地圖按鈕的連結
        const goToMapBtn = document.getElementById('goToMapBtn');
        if (goToMapBtn) {
            const mapUrl = `map.html?spotId=${spot.id}&spotName=${encodeURIComponent(spot.name)}`;
            goToMapBtn.href = mapUrl;
            
            // 移除舊的事件監聽器並添加新的
            goToMapBtn.onclick = function(e) {
                e.preventDefault();
                window.location.href = mapUrl;
            };
        }

        setTimeout(() => {
            this.resultDisplay.classList.add('show');
            if (this.mascotCheer) {
                this.mascotCheer.classList.add('show');
                this.mascotCheer.setAttribute('aria-hidden', 'false');
            }
        }, 500);
    }

    saveSpots() {
        localStorage.setItem('wheelSelectedSpots', JSON.stringify(this.selectedSpots));
    }

    loadSavedSpots() {
        const saved = localStorage.getItem('wheelSelectedSpots');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    // 更新每個景點的顏色為最新配色
                    this.selectedSpots = parsed.map(spot => ({
                        ...spot,
                        color: this.getColorByType(spot.type)
                    }));
                }
            } catch (e) {
                console.error('載入儲存的景點失敗:', e);
            }
        }
    }
}

// 初始化轉盤
let wheelInstance;
document.addEventListener('DOMContentLoaded', function() {
    const wheelCanvas = document.getElementById('wheelCanvas');
    if (wheelCanvas) {
        wheelInstance = new WheelOfSurf('wheelCanvas');
    }
});
