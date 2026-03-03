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
            { pattern: /\n\n/g, replacement: '</p><p>' }, // 雙換行轉段落
        ];
    }
    
    // 主要轉換函數
    convert(markdown) {
        if (!markdown) return '';
        
        // 用段落標籤包裝內容
        let html = '<p>' + markdown + '</p>';
        
        // 應用所有轉換規則
        this.rules.forEach(rule => {
            html = html.replace(rule.pattern, rule.replacement);
        });
        
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

// Utility function to convert markdown to HTML
function markdownToHtml(markdown) {
    return window.markdownConverter.convert(markdown);
}

// Export for use in other files
window.markdownUtils = {
    markdownToHtml,
    MarkdownConverter
}; 