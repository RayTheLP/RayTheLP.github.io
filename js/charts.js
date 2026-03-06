// ═══════════════════════════════════════════════════
// Charts — Pure SVG data visualization module
// ═══════════════════════════════════════════════════

const Charts = (() => {

    // ─── Color palette (matches Cosmos theme) ───
    const COLORS = [
        '#7c6aef', '#c084fc', '#22d3ee', '#34d399',
        '#fbbf24', '#f87171', '#fb923c', '#a78bfa',
        '#67e8f9', '#6ee7b7', '#fde68a', '#fca5a5'
    ];

    // ─── Animated Counter ───
    function animateCounter(el, target, duration = 1200) {
        const start = 0;
        const startTime = performance.now();

        function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutExpo
            const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = Math.round(start + (target - start) * ease);
            el.textContent = current.toLocaleString();
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    // ─── Donut Chart (SVG) ───
    function createDonutChart(container, data, options = {}) {
        const size = options.size || 180;
        const strokeWidth = options.strokeWidth || 28;
        const radius = (size - strokeWidth) / 2;
        const cx = size / 2;
        const cy = size / 2;
        const circumference = 2 * Math.PI * radius;

        const total = data.reduce((sum, d) => sum + d.value, 0);
        if (total === 0) return;

        let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="donut-chart">`;

        // Background ring
        svg += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" 
                 stroke="var(--border-color)" stroke-width="${strokeWidth}" opacity="0.5"/>`;

        let offset = 0;
        data.forEach((d, i) => {
            const pct = d.value / total;
            const dashLen = circumference * pct;
            const gapLen = circumference - dashLen;
            const color = d.color || COLORS[i % COLORS.length];

            svg += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none"
                     stroke="${color}" stroke-width="${strokeWidth}"
                     stroke-dasharray="${dashLen} ${gapLen}"
                     stroke-dashoffset="${-offset}"
                     stroke-linecap="butt"
                     transform="rotate(-90 ${cx} ${cy})"
                     class="donut-segment" style="--delay: ${i * 0.1}s">
                     <title>${d.label}: ${d.value} (${(pct * 100).toFixed(0)}%)</title>
                    </circle>`;
            offset += dashLen;
        });

        // Center text
        svg += `<text x="${cx}" y="${cy - 6}" text-anchor="middle" class="donut-center-value">${total}</text>`;
        svg += `<text x="${cx}" y="${cy + 14}" text-anchor="middle" class="donut-center-label">${options.centerLabel || '總計'}</text>`;
        svg += `</svg>`;

        // Legend
        let legend = '<div class="chart-legend">';
        data.forEach((d, i) => {
            const pct = ((d.value / total) * 100).toFixed(0);
            const color = d.color || COLORS[i % COLORS.length];
            legend += `<div class="legend-item">
                <span class="legend-dot" style="background:${color}"></span>
                <span class="legend-label">${d.label}</span>
                <span class="legend-value">${d.value}</span>
                <span class="legend-pct">${pct}%</span>
            </div>`;
        });
        legend += '</div>';

        container.innerHTML = svg + legend;
    }

    // ─── Horizontal Bar Chart (SVG) ───
    function createBarChart(container, data, options = {}) {
        const barHeight = options.barHeight || 28;
        const gap = options.gap || 8;
        const maxItems = options.maxItems || 8;
        const items = data.slice(0, maxItems);

        const maxVal = Math.max(...items.map(d => d.value));
        if (maxVal === 0) return;

        let html = '<div class="bar-chart">';
        items.forEach((d, i) => {
            const pct = (d.value / maxVal) * 100;
            const color = d.color || COLORS[i % COLORS.length];
            html += `
                <div class="bar-row" style="--delay: ${i * 0.06}s">
                    <span class="bar-label">${d.label}</span>
                    <div class="bar-track">
                        <div class="bar-fill" style="width:${pct}%; background:${color}"></div>
                    </div>
                    <span class="bar-value">${d.value}</span>
                </div>`;
        });
        html += '</div>';
        container.innerHTML = html;
    }

    // ─── Mini Sparkline (SVG) ───
    function createSparkline(container, points, options = {}) {
        const width = options.width || 200;
        const height = options.height || 48;
        const color = options.color || '#7c6aef';

        if (!points.length) return;
        const max = Math.max(...points, 1);
        const step = width / Math.max(points.length - 1, 1);

        let pathD = '';
        let areaD = '';
        points.forEach((v, i) => {
            const x = i * step;
            const y = height - (v / max) * (height - 4) - 2;
            if (i === 0) {
                pathD += `M${x},${y}`;
                areaD += `M${x},${height} L${x},${y}`;
            } else {
                // smooth curve
                const prevX = (i - 1) * step;
                const prevY = height - (points[i - 1] / max) * (height - 4) - 2;
                const cpx = (prevX + x) / 2;
                pathD += ` C${cpx},${prevY} ${cpx},${y} ${x},${y}`;
                areaD += ` C${cpx},${prevY} ${cpx},${y} ${x},${y}`;
            }
        });
        areaD += ` L${(points.length - 1) * step},${height} Z`;

        const svg = `
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" class="sparkline-chart">
            <defs>
                <linearGradient id="sparkGrad_${container.id}" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="${color}" stop-opacity="0.25"/>
                    <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
                </linearGradient>
            </defs>
            <path d="${areaD}" fill="url(#sparkGrad_${container.id})" class="sparkline-area"/>
            <path d="${pathD}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" class="sparkline-path"/>
        </svg>`;
        container.innerHTML = svg;
    }

    // ─── Rating distribution bar chart (for food blog) ───
    function createRatingBars(container, ratings) {
        // ratings: { '5': count, '4.9': count, ... }
        // Group into buckets: 5, 4.5-4.9, 4-4.4, <4
        const buckets = [
            { label: '5.0 ★', range: [5, 5], color: '#34d399', count: 0 },
            { label: '4.5–4.9 ★', range: [4.5, 4.9], color: '#22d3ee', count: 0 },
            { label: '4.0–4.4 ★', range: [4.0, 4.4], color: '#fbbf24', count: 0 },
            { label: '< 4.0 ★', range: [0, 3.9], color: '#f87171', count: 0 }
        ];

        Object.entries(ratings).forEach(([score, count]) => {
            const s = parseFloat(score);
            for (const b of buckets) {
                if (s >= b.range[0] && s <= b.range[1]) {
                    b.count += count;
                    break;
                }
            }
        });

        const data = buckets.filter(b => b.count > 0).map(b => ({
            label: b.label,
            value: b.count,
            color: b.color
        }));

        createBarChart(container, data, { barHeight: 32, gap: 10 });
    }

    // ─── Price distribution donut (for food blog) ───
    function createPriceDonut(container, prices) {
        const data = Object.entries(prices)
            .filter(([, v]) => v > 0)
            .map(([label, value], i) => ({
                label,
                value,
                color: ['#34d399', '#22d3ee', '#fbbf24', '#fb923c', '#f87171'][i % 5]
            }));

        createDonutChart(container, data, { size: 160, strokeWidth: 24, centerLabel: '間' });
    }

    // ─── Parse food blog content for stats ───
    function parseFoodBlogStats(content) {
        const restaurants = [];
        // Match restaurant blocks: ## Restaurant name ... 評分：X/5 ... 價格：X
        const blocks = content.split(/---/).filter(b => b.includes('restaurant-name'));

        blocks.forEach(block => {
            const nameMatch = block.match(/data-name="([^"]+)"/);
            const ratingMatch = block.match(/評分：([\d.]+)\/5/);
            const priceMatch = block.match(/價格：(.+?)(?:\n|$)/);

            if (nameMatch) {
                const r = {
                    name: nameMatch[1],
                    rating: ratingMatch ? parseFloat(ratingMatch[1]) : null,
                    priceRange: priceMatch ? priceMatch[1].trim() : null
                };
                restaurants.push(r);
            }
        });

        // Aggregate ratings
        const ratings = {};
        restaurants.forEach(r => {
            if (r.rating !== null) {
                const key = r.rating.toString();
                ratings[key] = (ratings[key] || 0) + 1;
            }
        });

        // Aggregate price ranges
        const prices = {};
        restaurants.forEach(r => {
            if (r.priceRange) {
                const p = r.priceRange.replace(/元$/, '').trim();
                prices[p] = (prices[p] || 0) + 1;
            }
        });

        const rated = restaurants.filter(r => r.rating !== null);
        const avgRating = rated.length > 0
            ? (rated.reduce((s, r) => s + r.rating, 0) / rated.length).toFixed(1)
            : '—';

        return {
            total: restaurants.length,
            rated: rated.length,
            recommended: restaurants.length - rated.length,
            avgRating,
            ratings,
            prices,
            restaurants
        };
    }

    // ─── Build Blog Stats Dashboard ───
    function renderDashboard(containerId, posts) {
        const container = document.getElementById(containerId);
        if (!container || !posts || !posts.length) return;

        // Calculate stats
        let totalWords = 0;
        const catMap = {};
        const tagMap = {};

        posts.forEach(post => {
            // Word count — 使用預先計算的 wordCount
            totalWords += post.wordCount || 0;

            if (post.category) catMap[post.category] = (catMap[post.category] || 0) + 1;
            if (post.tags) post.tags.forEach(t => { tagMap[t] = (tagMap[t] || 0) + 1; });
        });

        const totalPosts = posts.length;
        const totalCats = Object.keys(catMap).length;
        const totalTags = Object.keys(tagMap).length;

        // Render dashboard HTML
        container.innerHTML = `
            <div class="dashboard">
                <div class="dash-stats">
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-file-alt"></i></div>
                        <div class="stat-number" data-target="${totalPosts}">0</div>
                        <div class="stat-label">篇文章</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-font"></i></div>
                        <div class="stat-number" data-target="${totalWords}">0</div>
                        <div class="stat-label">總字數</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-folder"></i></div>
                        <div class="stat-number" data-target="${totalCats}">0</div>
                        <div class="stat-label">個分類</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-tags"></i></div>
                        <div class="stat-number" data-target="${totalTags}">0</div>
                        <div class="stat-label">個標籤</div>
                    </div>
                </div>
                <div class="dash-charts">
                    <div class="chart-card">
                        <h3 class="chart-title"><i class="fas fa-chart-pie"></i> 文章分類</h3>
                        <div class="chart-body" id="dashCategoryChart"></div>
                    </div>
                    <div class="chart-card">
                        <h3 class="chart-title"><i class="fas fa-chart-bar"></i> 標籤統計</h3>
                        <div class="chart-body" id="dashTagChart"></div>
                    </div>
                </div>
            </div>
        `;

        // Animate counters with IntersectionObserver
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counters = container.querySelectorAll('.stat-number');
                    counters.forEach(el => {
                        const target = parseInt(el.dataset.target) || 0;
                        animateCounter(el, target);
                    });
                    observer.disconnect();
                }
            });
        }, { threshold: 0.3 });
        observer.observe(container);

        // Category donut
        const catData = Object.entries(catMap)
            .sort((a, b) => b[1] - a[1])
            .map(([label, value]) => ({ label, value }));
        const catContainer = document.getElementById('dashCategoryChart');
        if (catContainer && catData.length) {
            createDonutChart(catContainer, catData, { size: 160, strokeWidth: 22, centerLabel: '分類' });
        }

        // Tag bars
        const tagData = Object.entries(tagMap)
            .sort((a, b) => b[1] - a[1])
            .map(([label, value]) => ({ label, value }));
        const tagContainer = document.getElementById('dashTagChart');
        if (tagContainer && tagData.length) {
            createBarChart(tagContainer, tagData, { maxItems: 6 });
        }
    }

    // ─── Build Food Blog Charts Section ───
    function renderFoodCharts(containerId, content) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const stats = parseFoodBlogStats(content);
        if (stats.total === 0) return;

        container.innerHTML = `
            <div class="food-viz">
                <h2 class="food-viz-title"><i class="fas fa-chart-line"></i> 美食數據總覽</h2>
                <div class="food-viz-stats">
                    <div class="fv-stat">
                        <span class="fv-num" data-target="${stats.total}">0</span>
                        <span class="fv-label">收錄餐廳</span>
                    </div>
                    <div class="fv-stat">
                        <span class="fv-num" data-target="${stats.rated}">0</span>
                        <span class="fv-label">已評分</span>
                    </div>
                    <div class="fv-stat">
                        <span class="fv-num" data-target="${stats.recommended}">0</span>
                        <span class="fv-label">別人推薦</span>
                    </div>
                    <div class="fv-stat accent">
                        <span class="fv-num">${stats.avgRating}</span>
                        <span class="fv-label">平均評分</span>
                    </div>
                </div>
                <div class="food-viz-charts">
                    <div class="chart-card">
                        <h3 class="chart-title"><i class="fas fa-star"></i> 評分分佈</h3>
                        <div class="chart-body" id="foodRatingChart"></div>
                    </div>
                    <div class="chart-card">
                        <h3 class="chart-title"><i class="fas fa-coins"></i> 價位分佈</h3>
                        <div class="chart-body" id="foodPriceChart"></div>
                    </div>
                </div>
            </div>
        `;

        // Animate food stat counters
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    container.querySelectorAll('.fv-num[data-target]').forEach(el => {
                        animateCounter(el, parseInt(el.dataset.target) || 0);
                    });
                    observer.disconnect();
                }
            });
        }, { threshold: 0.3 });
        observer.observe(container);

        // Render charts
        const ratingContainer = document.getElementById('foodRatingChart');
        if (ratingContainer) createRatingBars(ratingContainer, stats.ratings);

        const priceContainer = document.getElementById('foodPriceChart');
        if (priceContainer) createPriceDonut(priceContainer, stats.prices);
    }

    return {
        animateCounter,
        createDonutChart,
        createBarChart,
        createSparkline,
        renderDashboard,
        renderFoodCharts,
        parseFoodBlogStats,
        COLORS
    };
})();
