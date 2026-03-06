// 心理測驗功能

// 測驗題目
const questions = [
    {
        id: 1,
        question: "你 理 想 中 的 旅 行 步 調 是 ?",
        options: [
            { text: "走 到 哪 算 哪 ， 餓 了 就 吃", answer: "A" },
            { text: "會 一 直 被 路 邊 的 東 西 吸 引 停 下 來", answer: "B" },
            { text: "希 望 慢 慢 走 ， 最 好 有 風 、 有 光", answer: "C" },
            { text: "會 特 地 查 資 料 ， 想 知 道 背 後 的 故 事", answer: "D" }
        ]
    },
    {
        id: 2,
        question: "如 果 只 拍 一 張 照 片 帶 回 家 ， 你 會 選 ？",
        options: [
            { text: "剛 買 到 的 在 地 小 吃", answer: "A" },
            { text: "有 趣 的 動 植 物 或 自 然 畫 面", answer: "B" },
            { text: "夕 陽 、 天 空 或 海 平 線", answer: "C" },
            { text: "老 建 築 的 一 角 或 細 節", answer: "D" }
        ]
    },
    {
        id: 3,
        question: "朋 友 臨 時 改 行 程 ， 你 的 反 應 是 ？",
        options: [
            { text: "沒 差 ， 順 著 走 就 好", answer: "A" },
            { text: "那 剛 好 可 以 看 看 別 的 地 方", answer: "B" },
            { text: "有 點 可 惜 原 本 的 氛 圍", answer: "C" },
            { text: "會 想 重 新 確 認 整 個 安 排", answer: "D" }
        ]
    },
    {
        id: 4,
        question: "你 比 較 享 受 哪 一 種 「 聲 音 」 ？",
        options: [
            { text: "漁 港 的 聊 天 聲 與 攤 販 聲", answer: "A" },
            { text: "海 浪 、 風 吹 、 自 然 的 聲 音", answer: "B" },
            { text: "黃 昏 時 的 安 靜 與 空 氣 感", answer: "C" },
            { text: "室 內 安 靜 、 翻 資 料 的 聲 音", answer: "D" }
        ]
    },
    {
        id: 5,
        question: "旅 行 時 你 最 不 能 沒 有 的 是 ？",
        options: [
            { text: "賀 呷 的", answer: "A" },
            { text: "新 鮮 感", answer: "B" },
            { text: "心 情 被 治 癒", answer: "C" },
            { text: "有 意 義 的 內 容", answer: "D" }
        ]
    },
    {
        id: 6,
        question: "你 對 「 導 覽 解 說 」 的 態 度 ？",
        options: [
            { text: "有 就 聽 ， 沒 有 也 沒 關 係", answer: "A" },
            { text: "希 望 有 互 動 或 實 際 體 驗", answer: "B" },
            { text: "不 用 多 說 ， 感 覺 到 就 好", answer: "C" },
            { text: "很 重 要 ， 會 影 響 整 個 體 驗", answer: "D" }
        ]
    },
    {
        id: 7,
        question: "你 比 較 常 在 哪 個 時 間 點 拍 照 ？",
        options: [
            { text: "吃 飯 前", answer: "A" },
            { text: "發 現 有 趣 東 西 的 時 候", answer: "B" },
            { text: "快 日 落 的 時 候", answer: "C" },
            { text: "進 到 特 別 空 間 時", answer: "D" }
        ]
    },
    {
        id: 8,
        question: "結束旅行後，你希望留下的是？",
        options: [
            { text: "「 該 吃 的 有 沒 有 都 吃 到 了 」", answer: "A" },
            { text: "「 我 看 到 好 多 特 別 的 東 西 」", answer: "B" },
            { text: "「 心 情 被 好 好 治 癒 了 」", answer: "C" },
            { text: "「 我 更 懂 這 個 地 方 了 」", answer: "D" }
        ]
    }
];

// 測驗結果對應
const results = {
    A: {
        type: "budget",
        title: "一日漁港輕旅行（小浪）",
        description: "你適合輕鬆自在的旅行風格，享受在地體驗與美食！",
        details: [
            "東石漁港散步",
            "在地海產、烤蚵",
            "漁港看夕陽",
            "漁人碼頭",
            "東石大橋",
            "水中古厝",
            "漁港烤蚵",
            "漁港夕陽"
        ]
    },
    B: {
        type: "family",
        title: "親子海岸探索行（招潮蟹）",
        description: "你喜歡大自然與生態體驗，適合帶著家人一起探索！",
        details: [
            "潮間帶、海岸觀察、散步",
            "生態解說、導覽點",
            "親子友善步道",
            "東石漁港散步",
            "紅樹林（朴子溪）",
            "鰲鼓濕地",
            "東石海盜村",
            "朵拉拉夢想花園",
            "東石自然生態館"
        ]
    },
    C: {
        type: "leisure",
        title: "漫遊黃昏路線（黑面琵鷺）",
        description: "你追求悠閒放鬆，享受慢活步調的旅行！",
        details: [
            "睡到自然醒",
            "中午吃個烤蚵",
            "下午抵達濕地或海岸",
            "漫步、拍照、吹海風",
            "觀賞夕陽",
            "塭仔烤蚵",
            "沿路買小吃",
            "白水湖壽島"
        ]
    },
    D: {
        type: "culture",
        title: "文藝古蹟路線（海龜）",
        description: "你對文化歷史充滿興趣，喜歡深度的人文探索！",
        details: [
            "老建築、廟宇景點",
            "地方故事介紹",
            "主打室內、靜態",
            "慢慢離開",
            "廟宇",
            "水中古厝",
            "余順豐花生工廠"
        ]
    },
    E: {
        type: "all",
        title: "小孩子才做選擇，我要全部（奇美拉）",
        description: "你想體驗所有東石的特色，從美食到自然到文化，一個都不能少！",
        details: [
            "東石漁港散步",
            "中午吃烤蚵",
            "鰲鼓濕地",
            "重點廟宇",
            "漫遊觀賞夕陽",
            "結合美食、自然、文化的完整體驗"
        ]
    }
};

// 當前狀態
let currentQuestion = 0;
let answers = [];
let quizSkipped = false;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 操作按鈕（回到預設 / 重做測驗）
    const backToDefaultRoutesBtn = document.getElementById('backToDefaultRoutes');
    const redoQuizBtn = document.getElementById('redoQuiz');

    if (backToDefaultRoutesBtn) {
        backToDefaultRoutesBtn.addEventListener('click', function() {
            sessionStorage.setItem('quizCompleted', 'true');
            sessionStorage.setItem('quizResult', 'skipped');
            showAllRoutes();
        });
    }

    if (redoQuizBtn) {
        redoQuizBtn.addEventListener('click', function() {
            resetQuiz();
        });
    }

    // 檢查是否已完成測驗
    const quizCompleted = sessionStorage.getItem('quizCompleted');
    const quizResult = sessionStorage.getItem('quizResult');
    
    if (quizCompleted === 'true') {
        if (quizResult && quizResult !== 'skipped') {
            showRecommendedRoute(quizResult);
        } else {
            showAllRoutes();
        }
        document.getElementById('quizModal').style.display = 'none';
    } else {
        // 顯示測驗模態框
        document.getElementById('quizModal').style.display = 'flex';
        setRoutesActionsMode('all');
        showQuestion();
    }

    // 跳過按鈕
    document.getElementById('skipQuiz').addEventListener('click', function() {
        quizSkipped = true;
        sessionStorage.setItem('quizCompleted', 'true');
        sessionStorage.setItem('quizResult', 'skipped');
        document.getElementById('quizModal').style.display = 'none';
        showAllRoutes();
    });

    // 上一題按鈕
    document.getElementById('prevBtn').addEventListener('click', function() {
        if (currentQuestion > 0) {
            currentQuestion--;
            answers.pop();
            showQuestion();
        }
    });

    // 下一題按鈕
    document.getElementById('nextBtn').addEventListener('click', function() {
        const selected = document.querySelector('input[name="answer"]:checked');
        if (!selected) {
            alert('請選擇一個答案');
            return;
        }

        answers.push(selected.value);
        
        if (currentQuestion < questions.length - 1) {
            currentQuestion++;
            showQuestion();
        } else {
            showResult();
        }
    });

    // 查看路線按鈕
    document.getElementById('viewRoutes').addEventListener('click', function() {
        document.getElementById('quizModal').style.display = 'none';
    });
});

// 顯示問題
function showQuestion() {
    const question = questions[currentQuestion];
    const container = document.getElementById('questionContainer');
    
    // 更新進度條
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.getElementById('progress').style.width = progress + '%';
    
    // 生成問題HTML
    let html = `
        <div class="question">
            <h3>Q${question.id}. ${question.question}</h3>
            <div class="options">
    `;
    
    question.options.forEach((option, index) => {
        const letter = String.fromCharCode(65 + index); // A, B, C, D
        html += `
            <label class="option">
                <input type="radio" name="answer" value="${option.answer}">
                <span class="option-text">${letter}. ${option.text}</span>
            </label>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    
    // 顯示/隱藏按鈕
    document.getElementById('prevBtn').style.display = currentQuestion > 0 ? 'inline-block' : 'none';
    document.getElementById('nextBtn').textContent = currentQuestion === questions.length - 1 ? '查看結果' : '下一題';
}

// 顯示結果
function showResult() {
    // 計算答案分數
    const scores = { A: 0, B: 0, C: 0, D: 0 };
    answers.forEach(answer => {
        scores[answer]++;
    });
    
    // 檢查是否所有分數相同
    const uniqueScores = [...new Set(Object.values(scores))];
    const allScoresEqual = uniqueScores.length === 1;
    
    let resultType = 'A';
    
    if (allScoresEqual) {
        // 如果所有分數相同，顯示 E 類型（全部路線）
        resultType = 'E';
    } else {
        // 找出最高分
        let maxScore = 0;
        for (let key in scores) {
            if (scores[key] > maxScore) {
                maxScore = scores[key];
                resultType = key;
            }
        }
    }
    
    const result = results[resultType];
    
    // 儲存結果
    sessionStorage.setItem('quizCompleted', 'true');
    sessionStorage.setItem('quizResult', result.type);
    
    // 顯示結果
    document.getElementById('quizContent').style.display = 'none';
    document.getElementById('resultContent').style.display = 'block';
    document.getElementById('skipQuiz').style.display = 'none';
    
    let detailsHtml = `
        <div class="result-card">
            <h3>${result.title}</h3>
            <p class="result-description">${result.description}</p>
            <div class="result-details">
                <h4>推薦行程包含：</h4>
                <ul>
    `;
    
    result.details.forEach(detail => {
        detailsHtml += `<li>${detail}</li>`;
    });
    
    detailsHtml += `
                </ul>
            </div>
        </div>
    `;
    
    document.getElementById('resultDetails').innerHTML = detailsHtml;
    
    // 更新路線顯示
    showRecommendedRoute(result.type);
}

// 顯示推薦路線
function showRecommendedRoute(type) {
    const allCards = document.querySelectorAll('.route-card');
    allCards.forEach(card => {
        if (card.getAttribute('data-type') === type) {
            card.style.display = 'block';
            card.classList.add('recommended');
        } else {
            card.style.display = 'none';
        }
    });
    
    // 調整容器樣式以居中顯示單個卡片
    const container = document.getElementById('routesContainer');
    container.style.justifyContent = 'center';

    setRoutesActionsMode('recommended');
}

// 顯示所有路線
function showAllRoutes() {
    const allCards = document.querySelectorAll('.route-card');
    allCards.forEach(card => {
        card.style.display = 'block';
        card.classList.remove('recommended');
    });
    
    const container = document.getElementById('routesContainer');
    container.style.justifyContent = '';

    setRoutesActionsMode('all');
}

function setRoutesActionsMode(mode) {
    const backToDefaultRoutesBtn = document.getElementById('backToDefaultRoutes');
    const redoQuizBtn = document.getElementById('redoQuiz');
    if (!backToDefaultRoutesBtn || !redoQuizBtn) return;

    if (mode === 'recommended') {
        backToDefaultRoutesBtn.style.display = 'inline-block';
        redoQuizBtn.style.display = 'none';
        return;
    }

    backToDefaultRoutesBtn.style.display = 'none';
    redoQuizBtn.style.display = 'inline-block';
}

// 重新測驗功能（可選）
function resetQuiz() {
    currentQuestion = 0;
    answers = [];
    quizSkipped = false;
    sessionStorage.removeItem('quizCompleted');
    sessionStorage.removeItem('quizResult');
    location.reload();
}
