# vibe-thief 🎨

> Good artists copy, great artists steal.

从任何网站提取设计系统，生成结构化的 `DESIGN.md` 文件。同时服务于人类开发者和 AI Agent。

## Features

- **CSS 硬数据提取**：通过 Playwright 采集 CSS Variables、字体栈、字号梯度、间距节奏、圆角、阴影
- **像素级色彩分析**：从渲染截图中提取实际调色板（支持不使用 CSS Variables 的网站）
- **视觉感知分析**：多模态 LLM 分析 UI 的情绪、风格、组件交互特征
- **两阶段 LLM 编译**：结构化分析 → 感知融合，生成高质量 Design Token
- **双输出格式**：Markdown（人类可读）+ JSON（Agent 可解析）
- **CLI + MCP Server**：面向终端和 IDE Agent 的双重调用方式

## Quick Start

### 安装

```bash
npm install -g vibe-thief
# 或
npx vibe-thief <url>
```

### 配置

创建 `.env` 文件或设置环境变量：

```bash
# 使用 Anthropic API
ANTHROPIC_API_KEY=sk-ant-...
LLM_MODEL=claude-sonnet-4-20250514
LLM_VISION_MODEL=claude-sonnet-4-20250514

# 或使用自定义 endpoint（如 mimo）
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=your-api-key
LLM_BASE_URL=https://your-endpoint.com/anthropic
LLM_MODEL=mimo-v2.5-pro
LLM_VISION_MODEL=mimo-v2.5
```

### 使用

```bash
# 从 URL 提取（完整流程）
vibe-thief https://stripe.com

# 指定输出文件
vibe-thief https://linear.app -o linear-design.md

# 从截图提取
vibe-thief --screenshot ./ui.png

# 输出 JSON 格式（给 Agent 用）
vibe-thief https://shadcn.com --format json

# 仅提取 CSS 硬数据（不需要 LLM，速度快）
vibe-thief https://tailwindcss.com --extract-only

# 使用系统 Chrome（跳过 Playwright 下载）
vibe-thief https://vercel.com --channel chrome

# 指定多模态模型和文本模型
vibe-thief https://stripe.com --model mimo-v2.5-pro --vision-model mimo-v2.5
```

## Programmatic API

```typescript
import { extractFromURL, extractFromScreenshot, extractOnly } from 'vibe-thief';

// 完整提取（含 LLM 编译）
const result = await extractFromURL('https://stripe.com', {
  llm: {
    provider: 'anthropic',
    model: 'mimo-v2.5-pro',
    visionModel: 'mimo-v2.5',
    apiKey: process.env.ANTHROPIC_API_KEY!,
    baseUrl: process.env.LLM_BASE_URL,
  },
  browser: { channel: 'chrome' },
  output: { language: 'zh' },
});

console.log(result.markdown);  // DESIGN.md 内容
console.log(result.tokens);    // 结构化 token 数据
console.log(result.meta);      // { duration, llmTokensUsed, confidence, degraded }

// 仅提取（不调用 LLM）
const raw = await extractOnly({ type: 'url', url: 'https://example.com' }, config);
console.log(raw.css);   // CSS 提取数据
console.log(raw.pixel); // 像素提取数据
```

## MCP Server 配置

在 Cursor / Claude Desktop 中配置：

```json
{
  "mcpServers": {
    "vibe-thief": {
      "command": "node",
      "args": ["path/to/vibe-thief/dist/mcp/server.js"],
      "env": {
        "LLM_PROVIDER": "anthropic",
        "ANTHROPIC_API_KEY": "your-api-key",
        "LLM_BASE_URL": "https://your-endpoint.com/anthropic",
        "LLM_MODEL": "mimo-v2.5-pro",
        "LLM_VISION_MODEL": "mimo-v2.5"
      }
    }
  }
}
```

### 可用工具

| Tool | 说明 | 需要 LLM |
|------|------|----------|
| `extract_design` | 完整提取：URL/截图 → DESIGN.md | ✅ |
| `extract_css_only` | 仅 CSS 提取（快速，无 LLM 调用） | ❌ |
| `analyze_screenshot` | 纯视觉分析（多模态 LLM） | ✅ |

## DESIGN.md 输出格式

```markdown
---
schema: "vibe-thief/1.0"
source: "https://stripe.com"
extracted_at: "2026-06-16T10:30:00Z"
confidence: 0.87
generator: "vibe-thief@1.0"
---

# Design System: Stripe

> Stripe 的设计传达一种「精密的优雅感」。大量使用渐变和微阴影...

## Colors
| Token | Value | Name | Usage |
|-------|-------|------|-------|
| `color-primary` | `#635BFF` | Electric Purple | 主按钮、链接 |

## Typography
| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| `text-2xl` | `36px` | 700 | 页面标题 |

## Spacing
Base unit: `4px`
| Token | Value |
|-------|-------|
| `space-1` | `4px` |
| `space-2` | `8px` |

## Perception Analysis
| Dimension | Assessment |
|-----------|------------|
| **Mood** | Professional, Premium |
| **Design Principle** | 用渐变和阴影代替边框创造层次 |
```

## Architecture

```
Input (URL/Screenshot)
    ↓
Extraction Layer (并行)
    ├── CSS Extractor (Playwright 注入 JS)
    ├── Pixel Extractor (截图色彩聚类)
    └── Vision Analyzer (多模态 LLM)
    ↓
Compilation Layer (两阶段 LLM)
    ├── Stage 1: 结构化分析 → JSON
    └── Stage 2: 感知融合 → DesignTokens
    ↓
Output Layer
    └── DESIGN.md (Markdown + YAML frontmatter)
```

## CLI 参数

| 参数 | 缩写 | 默认值 | 说明 |
|------|------|--------|------|
| `--output` | `-o` | `DESIGN.md` | 输出文件路径 |
| `--screenshot` | `-s` | - | 截图文件路径 |
| `--llm` | | `anthropic` | LLM provider |
| `--model` | `-m` | provider 默认 | 文本模型 |
| `--vision-model` | | - | 多模态模型 |
| `--api-key` | | 环境变量 | API Key |
| `--base-url` | | - | 自定义 LLM endpoint |
| `--format` | `-f` | `md` | 输出格式：md / json |
| `--extract-only` | | false | 仅提取，不编译 |
| `--channel` | | - | 系统浏览器：chrome / msedge |
| `--debug` | `-d` | false | 调试模式 |
| `--lang` | `-l` | `zh` | 输出语言：zh / en |

## Development

```bash
npm install           # 安装依赖
npm run build         # 构建
npm test              # 运行测试
npm run dev           # 开发模式 (watch)
```

## License

MIT
