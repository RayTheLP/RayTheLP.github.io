// 簡單的 Markdown 轉 HTML 轉換器
class MarkdownConverter {
    constructor() {
        // 定義轉換規則陣列
        this.rules = [
            // 標題轉換規則
            { pattern: /^### (.*$)/gim, replacement: '<h3>$1</h3>' }, // 三級標題
            { pattern: /^## (.*$)/gim, replacement: '<h2>$1</h2>' }, // 二級標題
            { pattern: /^# (.*$)/gim, replacement: '<h1>$1</h1>' }, // 一級標題
            
            // 粗體和斜體轉換規則
            { pattern: /\*\*\*(.*?)\*\*\*/g, replacement: '<strong><em>$1</em></strong>' }, // 粗斜體
            { pattern: /\*\*(.*?)\*\*/g, replacement: '<strong>$1</strong>' }, // 粗體
            { pattern: /\*(.*?)\*/g, replacement: '<em>$1</em>' }, // 斜體
            
            // 程式碼區塊轉換規則
            { pattern: /```([\s\S]*?)```/g, replacement: '<pre><code>$1</code></pre>' }, // 多行程式碼
            { pattern: /`([^`]+)`/g, replacement: '<code>$1</code>' }, // 單行程式碼
            
            // 連結轉換規則
            { pattern: /\[([^\]]+)\]\(([^)]+)\)/g, replacement: '<a href="$2" target="_blank">$1</a>' },
            
            // 圖片轉換規則
            { pattern: /!\[([^\]]*)\]\(([^)]+)\)/g, replacement: '<img src="$2" alt="$1" style="max-width: 100%; height: auto;">' },
            
            // 列表轉換規則
            { pattern: /^\* (.*$)/gim, replacement: '<li>$1</li>' }, // 無序列表
            { pattern: /^- (.*$)/gim, replacement: '<li>$1</li>' }, // 無序列表（破折號）
            { pattern: /^\d+\. (.*$)/gim, replacement: '<li>$1</li>' }, // 有序列表
            
            // 引用區塊轉換規則
            { pattern: /^> (.*$)/gim, replacement: '<blockquote>$1</blockquote>' },
            
            // 水平分隔線轉換規則
            { pattern: /^---$/gim, replacement: '<hr>' },
            
            // 換行轉換規則
            { pattern: /  \n/g, replacement: '<br>' }, // 行尾雙空格轉換行
            { pattern: /\n\n/g, replacement: '</p><p>' }, // 雙換行轉段落
        ];
    }
    
    // 主要轉換函數
    convert(markdown) {
        if (!markdown) return '';
        
        // 統一換行符號為 \n
        markdown = markdown.replace(/\r\n/g, '\n');
        
        // 先套用所有轉換規則，不預先包裝 <p>，
        // 避免 <p># 或 <p>--- 破壞行首正則匹配
        let html = markdown;
        
        // 應用所有轉換規則
        this.rules.forEach(rule => {
            html = html.replace(rule.pattern, rule.replacement);
        });
        
        // 規則套用完畢後再包裝段落標籤
        html = '<p>' + html + '</p>';
        
        // 清理空段落
        html = html.replace(/<p><\/p>/g, '');
        html = html.replace(/<p><\/p>/g, '');
        
        // 正確包裝列表
        html = this.wrapLists(html);
        
        return html;
    }
    
    // 包裝列表項目到 ul/ol 標籤中
    wrapLists(html) {
        // 尋找連續的列表項目並用 ul/ol 標籤包裝
        const listItemPattern = /<li>.*?<\/li>/g;
        const listItems = html.match(listItemPattern);
        
        if (listItems) {
            let currentList = '';
            let inList = false;
            let result = '';
            
            const lines = html.split('\n');
            
            for (let line of lines) {
                if (line.includes('<li>')) {
                    if (!inList) {
                        currentList = '<ul>';
                        inList = true;
                    }
                    currentList += line;
                } else {
                    if (inList) {
                        currentList += '</ul>';
                        result += currentList;
                        currentList = '';
                        inList = false;
                    }
                    result += line;
                }
            }
            
            if (inList) {
                currentList += '</ul>';
                result += currentList;
            }
            
            return result;
        }
        
        return html;
    }
    
    // Convert a single line of markdown
    convertLine(line) {
        let result = line;
        
        // Apply inline formatting
        result = result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        result = result.replace(/\*(.*?)\*/g, '<em>$1</em>');
        result = result.replace(/`([^`]+)`/g, '<code>$1</code>');
        result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
        
        return result;
    }
}

// Create global instance
window.markdownConverter = new MarkdownConverter();

// ═══════════════════════════════════════════════════
// YAML Frontmatter 解析器
// ═══════════════════════════════════════════════════
function parseFrontmatter(raw) {
    const result = { metadata: {}, content: raw };
    if (!raw.startsWith('---')) return result;

    const endIdx = raw.indexOf('---', 3);
    if (endIdx === -1) return result;

    const yamlBlock = raw.substring(3, endIdx).trim();
    const content = raw.substring(endIdx + 3).trim();

    const metadata = {};
    yamlBlock.split('\n').forEach(line => {
        const colonIdx = line.indexOf(':');
        if (colonIdx === -1) return;
        const key = line.substring(0, colonIdx).trim();
        let val = line.substring(colonIdx + 1).trim();

        // 移除引號
        if ((val.startsWith('"') && val.endsWith('"')) ||
            (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
        }

        // 解析陣列 [a, b, c]
        if (val.startsWith('[') && val.endsWith(']')) {
            val = val.slice(1, -1).split(',').map(s => s.trim());
        }

        metadata[key] = val;
    });

    return { metadata, content };
}

// 從 .md 檔案載入文章（fetch + 解析 frontmatter）
async function fetchPost(filePath) {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error('Failed to load ' + filePath);
    const raw = await response.text();
    return parseFrontmatter(raw);
}

window.markdownUtils = {
    parseFrontmatter,
    fetchPost,
    MarkdownConverter
}; 