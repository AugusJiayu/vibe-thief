# vibe-thief 🎨

> Good artists copy, great artists steal.

从任何网站提取设计系统，生成 AI Coding Agent 可直接使用的 `DESIGN.md` 文件。Agent 读取后能设计出与目标网站视觉风格一致的 UI。

## 核心理念

截几张图发给 AI，它做出来的效果往往差强人意。vibe-thief 的解决方案是：**提取可执行的设计代码，而不是描述性语言**。

DESIGN.md 不只是 token 列表——它包含：
- **设计感觉**：目标网站的视觉氛围描述
- **Design Tokens**：色彩、排版、间距的精确数值
- **页面结构**：区块顺序和每块的内容
- **CSS/JS 代码片段**：动画、交互、组件样式，Agent 可直接复用
- **媒体呈现规则**：图片/视频的展示方式

## Features

- **CSS 硬数据提取**：通过 Playwright 采集 CSS Variables、字体栈、字号梯度、间距节奏、圆角、阴影
- **CSS 代码级提取**：`@keyframes` 动画、`:hover`/`:focus` 交互规则、布局模式（grid/flex）、组件样式
- **页面结构提取**：DOM 结构分析，识别 header/nav/main/section/footer 等语义区块
- **像素级色彩分析**：从渲染截图中提取实际调色板
- **视觉感知分析**：多模态 LLM 分析 UI 的情绪、风格
- **两阶段 LLM 编译**：结构化分析 → 设计文档生成
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

# 使用系统 Edge（跳过 Playwright 下载）
vibe-thief https://vercel.com --channel msedge
```

## Programmatic API

```typescript
import { extractFromURL } from 'vibe-thief';

const result = await extractFromURL('https://stripe.com', {
  llm: {
    provider: 'anthropic',
    model: 'mimo-v2.5-pro',
    visionModel: 'mimo-v2.5',
    apiKey: process.env.ANTHROPIC_API_KEY!,
    baseUrl: process.env.LLM_BASE_URL,
  },
  browser: { channel: 'msedge' },
  output: { language: 'zh' },
});

console.log(result.markdown);  // DESIGN.md 内容
console.log(result.doc);       // 结构化数据
console.log(result.meta);      // { duration, llmTokensUsed, confidence }
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

## DESIGN.md 输出结构

```markdown
---
schema: "vibe-thief/1.0"
source: "https://stripe.com"
confidence: 0.87
style_archetype: "playful-brand"
---

# Design System

## 设计感觉
暗色背景 + 渐变强调色 = 专业、前沿、有科技感。Stripe 的设计传达一种
「精密的优雅感」，通过微妙的渐变和阴影创造层次...

## Colors
> 黑白灰为主，紫蓝渐变仅用在需要视觉冲击的地方

| Token | Value | Usage |
|-------|-------|-------|
| `bg-primary` | `#0A2540` | 主背景 |
| `accent` | `#635BFF` | 按钮、链接 |

## Typography
> 通过极大的字号对比（4:1）建立视觉层级

| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| `display` | `56px` | 700 | Hero 标题 |
| `body` | `16px` | 400 | 正文 |

## Page Structure
### 1. Hero
**用途**: 第一印象，传达核心价值
**包含元素**: 大标题、副标题、CTA 按钮
**布局**: 居中单列

### 2. Features
**用途**: 展示核心功能
**包含元素**: 图标、功能标题、功能描述
**布局**: 3 列网格

## CSS Code
### 滚动进入动画
```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-in {
  animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
```

## Media Presentation
**图片风格**: 高质量产品截图，纯色背景
**图标风格**: 线条图标，线宽 1.5px
```

## Architecture

Input (URL/Screenshot)
    ↓
Extraction Layer (并行)
    ├── CSS Extractor (Playwright 注入 JS)
    │   ├── Token 数据（颜色、字号、间距）
    │   ├── @keyframes 动画定义
    │   ├── :hover/:focus 交互规则
    │   ├── 布局模式（grid/flex）
    │   └── 组件样式
    ├── Pixel Extractor (截图色彩聚类)
    ├── Vision Analyzer (多模态 LLM)
    └── DOM Structure (页面结构分析)
    ↓
Compilation Layer (两阶段 LLM)
    ├── Stage 1: 结构化分析 → JSON
    └── Stage 2: 设计文档生成 → DESIGN.md
    ↓
Output Layer
    └── DESIGN.md (Markdown + YAML frontmatter)

## CLI 参数

| 参数 | 缩写 | 默认值 | 说明 |
|------|------|--------|------|
| `--output` | `-o` | `DESIGN.md` | 输出文件路径 |
| `--screenshot` | `-s` | - | 截图文件路径 |
| `--model` | `-m` | provider 默认 | 文本模型 |
| `--vision-model` | | - | 多模态模型 |
| `--api-key` | | 环境变量 | API Key |
| `--base-url` | | - | 自定义 LLM endpoint |
| `--format` | `-f` | `md` | 输出格式：md / json |
| `--extract-only` | | false | 仅提取，不编译 |
| `--channel` | | msedge | 系统浏览器：chrome / msedge |
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
