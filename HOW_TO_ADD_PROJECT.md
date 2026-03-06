# 如何新增專案到部落格 — 操作指南

> 閱讀本文後，你可以在 5 分鐘內讓自己的專案出現在 `projects.html` 頁面上。

---

## 目錄結構一覽

```
Blog/
├── projects/                 ← 所有專案放這裡
│   ├── demo-counter/         ← 每個專案一個資料夾
│   │   └── index.html
│   └── your-project/         ← 你的新專案資料夾
│       ├── index.html        ← 專案入口（必要）
│       └── ...其他檔案
├── projects.json             ← 專案清單（你需要編輯的地方）
├── projects.html             ← 自動從 projects.json 讀取，不需修改
└── js/projects.js            ← 自動渲染邏輯，不需修改
```

---

## 步驟一：建立專案資料夾

在 `Blog/projects/` 底下新增一個資料夾，資料夾名稱即為專案 ID，**只能使用英文、數字和連字號**：

```
projects/
└── my-awesome-project/    ← 你的資料夾
    ├── index.html         ← 必要：專案的入口頁面
    ├── style.css          ← 選用
    └── script.js          ← 選用
```

### 範本：基礎 index.html

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>我的專案名稱</title>
    <!-- 加入你自己的樣式 -->
</head>
<body>

    <!-- 返回按鈕（建議保留，方便使用者回到列表） -->
    <a href="../../projects.html"
       style="position:fixed;top:16px;left:16px;padding:7px 16px;
              background:rgba(124,106,239,0.15);border:1px solid rgba(124,106,239,0.3);
              border-radius:980px;color:#a89cf5;font-size:13px;font-weight:600;
              text-decoration:none;font-family:system-ui">
        ← 回到專案列表
    </a>

    <!-- 你的專案內容 -->

</body>
</html>
```

---

## 步驟二：編輯 `projects.json`

開啟 `Blog/projects.json`，在 `"projects"` 陣列中加入一筆物件：

```json
{
  "projects": [
    {
      "id": "my-awesome-project",
      "title": "我的超棒專案",
      "description": "簡短說明這個專案做什麼、用了哪些技術、能解決什麼問題。",
      "date": "2026-03-06",
      "tags": ["HTML", "CSS", "JavaScript"],
      "type": "web",
      "status": "completed",
      "featured": false,
      "demo": "projects/my-awesome-project/index.html",
      "github": "https://github.com/raythelp/my-awesome-project"
    }
  ]
}
```

### 欄位說明

| 欄位 | 必填 | 說明 |
|------|------|------|
| `id` | ✅ | 與資料夾名稱相同，請用英數字和連字號 |
| `title` | ✅ | 顯示在卡片上的專案名稱 |
| `description` | ✅ | 專案說明，建議 30–80 字 |
| `date` | ✅ | 建立日期，格式 `YYYY-MM-DD` |
| `tags` | ✅ | 技術標籤陣列，顯示為藥丸 |
| `type` | ✅ | 專案類型（見下方） |
| `status` | ✅ | 專案狀態（見下方） |
| `featured` | ✅ | `true` 會顯示 ⭐ Featured 標籤 |
| `demo` | ⬜ | 本地 demo 路徑；留空或省略則不顯示「開啟專案」按鈕 |
| `github` | ⬜ | GitHub 網址；留空或省略則不顯示 GitHub 按鈕 |

### `type` 可選值

| 值 | 圖示 | 說明 |
|----|------|------|
| `web` | 🌐 | 網頁、前端作品 |
| `tool` | 🔧 | 工具、腳本 |
| `app` | 📱 | 應用程式 |
| `other` | 📦 | 其他 |

### `status` 可選值

| 值 | 標籤顯示 | 顏色 |
|----|----------|------|
| `completed` | 已完成 | 綠色 |
| `in-progress` | 進行中 | 黃色 |
| `archived` | 已封存 | 灰色 |

---

## 步驟三：確認完成

儲存 `projects.json` 後，開啟 `projects.html` 確認卡片是否正確顯示：

```
✅ 卡片出現在頁面上
✅ 「開啟專案」按鈕點擊後可進入 projects/your-project/index.html
✅ 過濾按鈕（全部 / 網頁 / 工具…）能正確篩選
```

---

## 範例：新增多個專案

```json
{
  "projects": [
    {
      "id": "demo-counter",
      "title": "互動計數器",
      "description": "一個有彈跳動畫的互動計數器示範專案。",
      "date": "2026-03-06",
      "tags": ["HTML", "CSS", "JavaScript"],
      "type": "web",
      "status": "completed",
      "featured": true,
      "demo": "projects/demo-counter/index.html",
      "github": ""
    },
    {
      "id": "python-scraper",
      "title": "Python 爬蟲工具",
      "description": "自動抓取網頁資料並輸出 CSV 的命令列工具。",
      "date": "2026-04-01",
      "tags": ["Python", "BeautifulSoup", "CSV"],
      "type": "tool",
      "status": "completed",
      "featured": false,
      "demo": "",
      "github": "https://github.com/raythelp/python-scraper"
    }
  ]
}
```

---

## 注意事項

- **路徑規則**：`demo` 欄位的路徑是相對於 `Blog/` 的根目錄，例如 `"demo": "projects/my-project/index.html"`。
- **外部連結**：若你的專案部署在 Vercel / GitHub Pages / Netlify 等平台，`demo` 也可以填外部 URL（`https://...`）。
- **只有 GitHub 連結、沒有 demo**：`demo` 留空字串即可，只會顯示 GitHub 按鈕。
- **兩個都沒有**：兩個都留空，卡片會顯示「暫無連結」。
- **JSON 格式**：多個專案之間記得用逗號 `,` 分隔，最後一個不加逗號，否則頁面會讀取失敗。

---

*如有問題歡迎查閱 [js/projects.js](js/projects.js) 的原始碼了解渲染邏輯。*
