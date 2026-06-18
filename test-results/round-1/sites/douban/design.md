---
schema: "vibe-thief/1.0"
source: "https://www.douban.com"
extracted_at: "2026-06-17T15:20:46.847Z"
confidence: 0.85
generator: "vibe-thief@0.1.0"
mood: "professional, approachable"
style_archetype: "light-saas"
---


# Design System: Douban

## Design Narrative

这是一个面向社区的轻量级平台设计系统，强调清晰的结构和友好的交互。绿色作为主品牌色传达信任和活力，蓝色用于辅助信息，橙色用于关键提示。布局以文本为核心，通过合理的间距和层级创造舒适的阅读体验，平衡专业感与社区亲和力。

**风格关键词**: `community` `professional` `clean` `approachable` `structured`

## Visual Vocabulary

### 色彩哲学
色彩策略以白色和浅灰为背景，营造干净、专业的空间。绿色是品牌主色，只用于关键交互元素以保持信号强度。蓝色和橙色作为辅助和强调色，确保信息层次分明。中性灰系列用于文字和边框，维持整体的柔和对比，避免视觉疲劳。

### 排版哲学
采用系统字体栈确保跨平台一致性和快速加载。字号层次从 11px 到 25px，用于区分文本的重要性。基础正文为 13px，提供舒适的阅读密度，标题使用更大字号突出结构，所有字号使用常规 weight 以保持轻松感。

### 留白哲学
间距系统基于 2px 基础单位，但实际值不严格遵循倍数，反映了真实使用中的灵活性。用于创建紧凑而清晰的布局，在组件内部保持亲密性，在组件之间提供呼吸空间，确保内容密度适中。

### 深度哲学
深度表达主要依赖背景色分层和细微边框，而非阴影。圆角较小，保持专业感。这种策略减少视觉噪声，让内容成为焦点，通过颜色和边框创建清晰的信息层级。

## Design Tokens

### Colors

#### Background Layers（表达页面深度结构）
| Token | Value | Usage |
|-------|-------|-------|
| `bg-page` | `#ffffff` | 页面主背景，提供干净的基础 |
| `bg-surface` | `#f8f8f8` | 卡片和内容区域背景，创造浅层层次 |

#### Signal Colors（仅用于需要用户注意的地方）
| Token | Value | Usage |
|-------|-------|-------|
| `signal-primary` | `#007722` | 主按钮、积极操作、成功状态，确保关键交互突出 |
| `signal-secondary` | `#3377aa` | 辅助操作、信息提示，如链接和通知 |
| `signal-accent` | `#d57b0f` | 警告、强调元素，如提示或次要行动 |

#### Text Hierarchy
| Token | Value | Usage |
|-------|-------|-------|
| `text-primary` | `#111111` | 标题、正文主要文字，确保高可读性 |
| `text-secondary` | `#666666` | 描述性文字、辅助信息，降低视觉权重 |
| `text-disabled` | `#999999` | 不可用状态文字，表达交互限制 |

### Typography

#### Font Stack
| Role | Family |
|------|--------|
| Heading | `Helvetica, Arial, sans-serif` |
| Body | `Helvetica, Arial, sans-serif` |
| Code | `Courier, monospace` |

#### Type Scale
| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| `text-xs` | `11px` | 400 | 最小文本、注释，用于次要细节 |
| `text-sm` | `12px` | 400 | 小号文本、次要信息，如时间戳 |
| `text-base` | `13px` | 400 | 正文基准文本，平衡可读性和空间效率 |
| `text-md` | `14px` | 400 | 正文内容，用于帖子或描述 |
| `text-lg` | `15px` | 400 | 小标题、强调文本，引导阅读流 |
| `text-xl` | `25px` | 400 | 大标题、展示性文本，如页面标题 |

### Spacing

Base: `2px`

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | `2px` | 最小间距，如图标与文字 |
| `space-2` | `3px` | 紧凑间距，用于紧密元素 |
| `space-3` | `5px` | 小间距，如内边距调整 |
| `space-4` | `7px` | 标准间距，用于元素内部 |
| `space-5` | `10px` | 中等间距，如列表项间 |
| `space-6` | `12px` | 大间距，用于分组 |
| `space-7` | `13px` | 更大间距，用于组件内部 |
| `space-8` | `14px` | 组件内部间距，如卡片内容 |
| `space-9` | `18px` | 组件之间间距，创造呼吸空间 |

### Depth & Hierarchy

#### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | `3px` | 小元素如输入框、按钮，保持专业感 |
| `radius-md` | `8px` | 卡片、容器，提供柔和边界 |
| `radius-lg` | `12px` | 较大元素，如模态框 |
| `radius-full` | `9999px` | 圆形元素，如头像 |

#### Borders
| Token | Value | Usage |
|-------|-------|-------|
| `border-thin` | `1px solid #c3c3c3` | 输入框、分隔线，提供结构 |
| `border-subtle` | `1px solid #f0f0f0` | 卡片边框、轻微分隔，增强层次而不显眼 |

### Motion

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `motion-fast` | `150ms` | `ease-out` | hover 反馈、微交互，提供即时响应 |
| `motion-normal` | `250ms` | `ease` | 一般状态过渡，如按钮点击 |
| `motion-slow` | `400ms` | `ease-in-out` | 复杂动画、页面切换，确保平滑 |

> 动效以中等速度为主，确保流畅但不干扰用户。使用 ease-out 用于快速反馈，ease-in-out 用于平滑过渡。动效旨在增强交互感知，而非吸引注意力，保持界面响应迅速。

## Component Patterns

### Button

按钮组件，用于触发操作，提供清晰的状态反馈。

**Default:**
| Property | Value |
|----------|-------|
| bg | `#007722` |
| color | `#ffffff` |
| border-radius | `3px` |
| height | `28px` |

**Hover:**
| Property | Value |
|----------|-------|
| bg | `#005f1a` |

**Focus:**
| Property | Value |
|----------|-------|
| outline | `2px solid #3377aa` |

**Variants:**
- **Primary**: bg: `#007722`, color: `#ffffff`
- **Secondary**: bg: `transparent`, border: `1px solid #c3c3c3`, color: `#494949`
- **Accent**: bg: `#d57b0f`, color: `#ffffff`

### Input

输入框组件，用于文本输入，设计 minimal 以减少干扰。

**Default:**
| Property | Value |
|----------|-------|
| bg | `#ffffff` |
| color | `#111111` |
| border | `1px solid #c3c3c3` |
| border-radius | `3px` |
| height | `28px` |

**Hover:**
| Property | Value |
|----------|-------|
| border-color | `#999999` |

**Focus:**
| Property | Value |
|----------|-------|
| border-color | `#3377aa` |
| outline | `none` |

### Card

卡片组件，用于内容容器，无边框设计以保持简洁。

**Default:**
| Property | Value |
|----------|-------|
| bg | `#ffffff` |
| border | `none` |
| border-radius | `8px` |
| padding | `12px` |

## Interaction Patterns

| State | Style |
|-------|-------|
| Hover | 按钮和链接颜色变暗，提供 subtle 视觉反馈，如主按钮从 #007722 到 #005f1a。 |
| Focus | 输入框获得焦点时，边框变为 secondary 蓝色 (#3377aa)，无轮廓或细微轮廓，确保可访问性。 |
| Active | 按钮按下时，背景色进一步变暗，模拟按压效果，增强交互真实感。 |
| Loading | 使用 spinner 或进度条，颜色使用 primary 绿色 (#007722)，保持一致性。 |
| Transition | 所有交互过渡使用 150ms 到 250ms 的中等速度，确保流畅体验。 |

## Layout

布局采用左对齐主内容，右侧辅助模块，如登录面板。使用 12 列网格和 24px 间距，确保内容对齐和一致性。双栏布局用于内容 feed，顶部导航栏水平分布，创造清晰的信息结构。

| Property | Value |
|----------|-------|
| Max Width | `1200px` |
| Grid Columns | 12 |
| Grid Gap | `24px` |

## Agent Usage Guide

### ✅ Do
- 使用 #007722 绿色作为主信号色，仅用于关键操作如主按钮和成功状态。
- 在白色背景上使用 #f8f8f8 作为 surface 色，为卡片创建层次而不破坏干净感。
- 保持文字层次：标题用 #111111，正文用 #494949，辅助信息用 #666666。
- 使用 2px 基础单位进行间距计算，但实际值可灵活调整以适应真实需求。
- 为输入框和按钮使用 3px 圆角，卡片使用 8px 圆角，保持专业一致性。
- 确保交互状态清晰：hover 变暗，focus 使用蓝色边框 (#3377aa)。
- 布局优先使用 12 列网格和 24px 间距，确保模块化设计。
- 动效使用 150ms-250ms 速度，提供流畅但不干扰的反馈。

### ❌ Don't
- 不要过度使用阴影，优先使用背景色和边框表达深度。
- 不要在正文使用小于 13px 的字号，以确保可读性。
- 不要将绿色 (#007722) 用于非交互元素，以免削弱其信号作用。
- 避免使用超过 250ms 的动画，除非是复杂过渡，如页面切换。
- 不要在卡片上添加边框，使用背景色 (#f8f8f8) 和圆角 (8px) 来区分。
- 不要使用花哨字体，坚持系统字体栈 (Helvetica, Arial, sans-serif)。

### Code Snippets

**创建主按钮** — 使用 primary 绿色背景，白色文字，3px 圆角，高度 28px。
```css
background: #007722; color: white; border-radius: 3px; height: 28px; border: none; cursor: pointer;
```

**创建卡片** — 白色背景，无边框，8px 圆角，内边距 12px，用于内容容器。
```css
background: white; border-radius: 8px; padding: 12px; border: none; box-shadow: none;
```

**创建输入框** — 白色背景，细灰边框，3px 圆角，聚焦时边框变蓝。
```css
background: white; border: 1px solid #c3c3c3; border-radius: 3px; padding: 8px; outline: none;
```

**设置页面布局** — 最大宽度 1200px，12 列网格，24px 间距，左对齐主内容。
```css
max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(12, 1fr); gap: 24px;
```
