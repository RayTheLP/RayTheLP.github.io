// ═══════════════════════════════════════════════════
// projects.js — 專案列表渲染邏輯
// ═══════════════════════════════════════════════════

(async function initProjects() {

    // ── 工具：讀取 projects.json ──
    async function fetchProjects() {
        const res = await fetch('projects.json');
        if (!res.ok) throw new Error('無法讀取 projects.json');
        const data = await res.json();
        return data.projects || [];
    }

    // ── 工具：依 type 取圖示 ──
    function typeIcon(type) {
        const map = {
            web:   'fas fa-globe',
            tool:  'fas fa-wrench',
            app:   'fas fa-mobile-alt',
            other: 'fas fa-box'
        };
        return map[type] || map.other;
    }

    // ── 工具：依 status 取中文與樣式 ──
    function statusLabel(status) {
        const map = {
            completed:   { text: '已完成',  cls: 'status-done' },
            'in-progress': { text: '進行中', cls: 'status-wip'  },
            archived:    { text: '已封存',  cls: 'status-archived' }
        };
        return map[status] || { text: status, cls: '' };
    }

    // ── 渲染單張卡片 ──
    function renderCard(project, index) {
        const s = statusLabel(project.status);
        const hasDemo   = project.demo   && project.demo.trim()   !== '';
        const hasGithub = project.github && project.github.trim() !== '';

        const tagHtml = (project.tags || [])
            .map(t => `<span class="pj-tag">${t}</span>`)
            .join('');

        const featuredBadge = project.featured
            ? `<span class="pj-featured-badge"><i class="fas fa-star"></i> Featured</span>`
            : '';

        const demoBtnHtml = hasDemo
            ? `<a href="${project.demo}" class="pj-card-btn pj-btn-primary" target="_blank" rel="noopener">
                   <i class="fas fa-play"></i> 開啟專案
               </a>`
            : '';

        const githubBtnHtml = hasGithub
            ? `<a href="${project.github}" class="pj-card-btn pj-btn-secondary" target="_blank" rel="noopener">
                   <i class="fab fa-github"></i> GitHub
               </a>`
            : '';

        const noBtns = !hasDemo && !hasGithub
            ? `<span class="pj-no-link"><i class="fas fa-lock"></i> 暫無連結</span>`
            : '';

        return `
        <article class="pj-card reveal" data-type="${project.type || 'other'}"
                 data-revealDelay="${index * 80}" style="--card-idx:${index}">
            <div class="pj-card-top">
                <div class="pj-card-icon">
                    <i class="${typeIcon(project.type)}"></i>
                </div>
                <div class="pj-card-meta">
                    <span class="pj-status ${s.cls}">${s.text}</span>
                    ${featuredBadge}
                </div>
            </div>

            <h2 class="pj-card-title">${project.title}</h2>
            <p class="pj-card-desc">${project.description}</p>

            <div class="pj-tag-row">${tagHtml}</div>

            <div class="pj-card-footer">
                <span class="pj-card-date">
                    <i class="fas fa-calendar-alt"></i>
                    ${project.date || ''}
                </span>
                <div class="pj-card-btns">
                    ${demoBtnHtml}
                    ${githubBtnHtml}
                    ${noBtns}
                </div>
            </div>
        </article>`;
    }

    // ── 渲染統計列 ──
    function renderStats(projects) {
        const total      = projects.length;
        const completed  = projects.filter(p => p.status === 'completed').length;
        const inProgress = projects.filter(p => p.status === 'in-progress').length;
        const featured   = projects.filter(p => p.featured).length;

        const statsEl = document.getElementById('pjStats');
        if (!statsEl) return;
        statsEl.innerHTML = `
            <div class="pj-stat"><span class="pj-stat-num">${total}</span><span class="pj-stat-label">Total</span></div>
            <div class="pj-stat"><span class="pj-stat-num">${completed}</span><span class="pj-stat-label">Completed</span></div>
            <div class="pj-stat"><span class="pj-stat-num">${inProgress}</span><span class="pj-stat-label">In Progress</span></div>
            <div class="pj-stat"><span class="pj-stat-num">${featured}</span><span class="pj-stat-label">Featured</span></div>
        `;
    }

    // ── 過濾並渲染卡片 ──
    function renderGrid(projects, filter) {
        const grid  = document.getElementById('pjGrid');
        const empty = document.getElementById('pjEmpty');
        if (!grid) return;

        const filtered = filter === 'all'
            ? projects
            : projects.filter(p => p.type === filter);

        if (filtered.length === 0) {
            grid.innerHTML  = '';
            empty.style.display = 'flex';
        } else {
            empty.style.display = 'none';
            grid.innerHTML = filtered.map((p, i) => renderCard(p, i)).join('');
        }
    }

    // ── 過濾按鈕事件 ──
    function initFilters(projects) {
        document.querySelectorAll('.pj-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.pj-filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderGrid(projects, btn.dataset.filter);
            });
        });
    }

    // ── 主入口 ──
    try {
        const projects = await fetchProjects();
        renderStats(projects);
        renderGrid(projects, 'all');
        initFilters(projects);
    } catch (err) {
        console.error('[projects.js]', err);
        const grid = document.getElementById('pjGrid');
        if (grid) {
            grid.innerHTML = `<div class="pj-loading error">
                <i class="fas fa-exclamation-circle"></i>
                <span>載入失敗：${err.message}</span>
            </div>`;
        }
    }

})();
