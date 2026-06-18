---
schema: "vibe-thief/1.0"
source: "https://www.taobao.com"
extracted_at: "2026-06-17T15:25:11.786Z"
confidence: 0.65
generator: "vibe-thief@0.1.0"
mood: "高效、清晰、专注"
style_archetype: "modern-tool"
---


# Design System: Taobao

## Design Narrative

这是一个以功能和效率为核心的设计系统。它采用干净的白色背景，将用户的注意力完全集中在内容本身。鲜艳的橙色被克制地用作“信号色”，像一个智能的指针，只在最关键的时刻（如主要操作按钮、强调信息）出现，确保用户视线始终知道下一步该做什么。整个系统通过克制的阴影、精确的间距和清晰的层级，营造出一种冷静、可靠、值得信赖的专业感。

**风格关键词**: `效率` `清晰` `平衡` `信号` `系统化`

## Visual Vocabulary

### 色彩哲学
色彩策略的核心是‘平衡与焦点’。白色（#FFFFFF）和浅灰（#EBEBEB）构成了平静、中性的画布。#1F1F1F 和 #7A7A7A 提供了足够对比度的文字层级。橙色（#FF5000）被从背景和文字系统中抽离出来，仅作为‘行动信号’存在，确保它永远能第一时间抓住用户注意力。这种克制的用色方式，让界面既专业又不失活力。

### 排版哲学
排版策略追求‘清晰与效率’。使用系统字体栈确保在各平台上的最佳渲染性能和熟悉感。字号体系并不遵循严格的数学比例，而是基于实际使用场景（如输入框、正文、标题）进行定义，这是一种实用主义的选择。通过 font-weight（400 和 700）和字号的组合，构建出直观的信息层级，让内容易于扫描。

### 留白哲学
间距系统基于一个 4px 的基础单元，保证所有间距都能对齐到像素网格，实现整洁的视觉效果。策略是‘呼吸在组件之间，而非组件之内’：组件内部（如按钮、输入框）使用 8px, 12px 等相对紧凑的间距保持凝聚力；而组件与组件之间、区块与区块之间则使用 16px, 24px 甚至更大的间距，创造出明确的结构和视觉层次。

### 深度哲学
深度表达主要依赖于‘阴影’而非厚重的边框或巨大的颜色变化。系统通过四级精心设计的阴影（subtle, card, modal, overlay）来模拟物理世界的层级关系，让元素从平面中“浮起”。border-radius 被控制在 4px 到 12px 之间，保持一种温和、不分散注意力的现代感，避免过度圆润带来的玩具感。边框主要用于定义元素边界和分隔线，颜色非常浅，保持整体界面的清爽。

## Design Tokens

### Colors

#### Background Layers（表达页面深度结构）
| Token | Value | Usage |
|-------|-------|-------|
| `bg-page` | `#FFFFFF` | 页面主背景，提供最大亮度和清晰度 |
| `bg-surface` | `#EBEBEB` | 卡片、面板、独立区块，与页面背景形成浅层分离 |

#### Signal Colors（仅用于需要用户注意的地方）
| Token | Value | Usage |
|-------|-------|-------|
| `signal-primary` | `#FF5000` | 主行动按钮（CTA）、当前选中项、关键高亮链接。这是视觉焦点，必须谨慎使用，确保其稀缺性带来真正的紧迫感。 |

#### Text Hierarchy
| Token | Value | Usage |
|-------|-------|-------|
| `text-primary` | `#1F1F1F` | 标题、核心内容、关键信息，确保最高可读性 |
| `text-secondary` | `#7A7A7A` | 辅助说明、标签、次级信息、占位符 |
| `text-disabled` | `#EBEBEB` | 禁用状态的文本和元素，明确传达不可交互性 |

### Typography

#### Font Stack
| Role | Family |
|------|--------|
| Heading | `system-ui` |
| Body | `system-ui` |
| Code | `Roboto` |

#### Type Scale
| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| `text-caption` | `12px` | 400 | 小字标签、辅助说明、时间戳 |
| `text-sm` | `14px` | 400 | 输入框、按钮文字、表格内容等高频次级文本 |
| `text-body` | `16px` | 400 | 段落正文，确保舒适的阅读体验 |
| `text-heading` | `18px` | 700 | 区块标题、卡片标题 |
| `text-display` | `24px` | 700 | 页面主标题、英雄区域标题 |

### Spacing

Base: `4px`

| Token | Value | Usage |
|-------|-------|-------|
| `space-xxs` | `2px` | 极小的调整，如图标与文字的微间距 |
| `space-xs` | `4px` | 紧密元素间的内部间距 |
| `space-sm` | `8px` | 组件内部元素间距（如按钮内图标与文字） |
| `space-md` | `12px` | 组件内部元素的标准间距 |
| `space-base` | `16px` | 标准间距，用于元素组之间 |
| `space-lg` | `24px` | 主要内容区块之间的间距 |
| `space-xl` | `32px` | 大型区块的分隔 |
| `space-2xl` | `48px` | 页面主要部分（如 Hero 与 Feature Grid）的间距 |

### Depth & Hierarchy

#### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | `4px` | 小元素，如输入框、小标签 |
| `radius-md` | `8px` | 卡片、面板、标准容器，这是最常用的圆角 |
| `radius-lg` | `12px` | 较大的容器或需要更柔和感觉的元素 |
| `radius-full` | `9999px` | 圆形元素，如头像、状态指示点 |

#### Shadows
| Token | Value | Usage |
|-------|-------|-------|
| `shadow-subtle` | `0px 1px 2px rgba(0,0,0,0.1)` | 微抬升，用于按钮、输入框的默认状态或细微层次 |
| `shadow-card` | `0px 4px 24px rgba(10,10,51,0.12), 0px 0px 8px rgba(0,0,0,0.04)` | 卡片、下拉菜单、弹出层，定义主要界面层级 |
| `shadow-modal` | `0px 8px 32px rgba(10,10,51,0.15), 0px 0px 12px rgba(0,0,0,0.06)` | 模态框、侧边栏等更高层级的面板 |
| `shadow-overlay` | `0px 16px 48px rgba(10,10,51,0.2), 0px 0px 16px rgba(0,0,0,0.08)` | 对话框、全屏覆盖层，表达最高层级 |

#### Borders
| Token | Value | Usage |
|-------|-------|-------|
| `border-subtle` | `1px solid #E5E5E5` | 分隔线、卡片内部的分隔 |
| `border-default` | `1px solid #EBEBEB` | 输入框、按钮的边框，提供清晰的边界 |

### Motion

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `motion-fast` | `200ms` | `ease-out` | 交互反馈，如 hover、focus 状态变化，追求即时响应感 |
| `motion-normal` | `500ms` | `ease` | 状态切换、元素进入/退出，平衡流畅与效率 |
| `motion-slow` | `1200ms` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | 复杂的序列动画或需要用户留意的重要状态变化 |

> 动效策略遵循‘有目的的高效’原则。快速动效（200ms）用于确保 UI 对用户操作的即时反馈，让界面感觉敏捷。标准动效（500ms）用于状态变化和布局调整，提供平滑但不过于拖沓的体验。缓动曲线（尤其是自定义的 cubic-bezier）被用来模拟自然的运动，避免生硬的线性运动。整体上，动效是功能性的，旨在引导注意力和确认操作，而非纯粹的装饰。

## Component Patterns

### Button

核心行动触发器，通过颜色和形态清晰传达其重要性。

**Default:**
| Property | Value |
|----------|-------|
| bg | `#FF5000` |
| color | `#FFFFFF` |
| border-radius | `6px` |
| height | `28px` |
| font-weight | `600` |
| font-size | `14px` |
| padding | `0 12px` |

**Hover:**
| Property | Value |
|----------|-------|
| bg | `#E04800` |
| box-shadow | `0 2px 8px rgba(255, 80, 0, 0.3)` |

**Focus:**
| Property | Value |
|----------|-------|
| outline | `2px solid #FF5000` |
| outline-offset | `2px` |

**Active:**
| Property | Value |
|----------|-------|
| bg | `#C04000` |
| transform | `translateY(1px)` |

**Disabled:**
| Property | Value |
|----------|-------|
| bg | `#EBEBEB` |
| color | `#7A7A7A` |
| cursor | `not-allowed` |

**Variants:**
- **Primary**: bg: `#FF5000`, color: `#FFFFFF`
- **Secondary**: bg: `transparent`, color: `#1F1F1F`, border: `1px solid #EBEBEB`
- **Ghost**: bg: `transparent`, color: `#FF5000`, border: `none`

### Card

承载独立内容的容器，通过阴影与背景分离。

**Default:**
| Property | Value |
|----------|-------|
| bg | `#EBEBEB` |
| border-radius | `8px` |
| padding | `16px` |
| box-shadow | `0px 4px 24px rgba(10,10,51,0.12), 0px 0px 8px rgba(0,0,0,0.04)` |

**Hover:**
| Property | Value |
|----------|-------|
| box-shadow | `0px 8px 32px rgba(10,10,51,0.15), 0px 0px 12px rgba(0,0,0,0.06)` |
| transform | `translateY(-2px)` |

**Variants:**
- **Surface**: bg: `#EBEBEB`, box-shadow: `none`

### Input

用户文本输入控件，样式清晰，状态明确。

**Default:**
| Property | Value |
|----------|-------|
| bg | `#FFFFFF` |
| color | `#1F1F1F` |
| border | `1px solid #EBEBEB` |
| border-radius | `4px` |
| height | `36px` |
| padding | `0 12px` |
| font-size | `14px` |

**Hover:**
| Property | Value |
|----------|-------|
| border-color | `#7A7A7A` |

**Focus:**
| Property | Value |
|----------|-------|
| outline | `2px solid #FF5000` |
| outline-offset | `2px` |
| border-color | `#FF5000` |

**Disabled:**
| Property | Value |
|----------|-------|
| bg | `#F5F5F5` |
| color | `#7A7A7A` |
| border-color | `#E5E5E5` |

## Interaction Patterns

| State | Style |
|-------|-------|
| Hover | 大多数交互元素（如卡片、按钮）通过轻微的阴影增强和/或背景色变化（变暗）来提供反馈，明确表达‘可交互’状态。 |
| Focus | 使用清晰的橙色（#FF5000）outline 定义 focus 状态，确保键盘导航的可见性和可访问性。 |
| Active | 按下（active）时，元素会有轻微的下沉效果（translateY(1px)）和更深的背景色，模拟物理按压感。 |
| Loading | 加载状态通常通过禁用按钮并替换为一个旋转的指示器（如 spinner）或进度条来表达。 |
| Transition | 状态过渡使用 `200ms` 的快速时长和 `ease-out` 缓动，确保即时反馈。 |

## Layout

布局采用经典的 12 列网格系统，提供灵活而严谨的内容组织方式。最大宽度 1200px 在大多数显示器上提供了良好的行宽，平衡了内容密度和阅读舒适度。24px 的栅格间距与间距系统一致，确保了视觉节奏的统一。布局追求‘严格的对齐’，所有元素都应锚定在网格上，创造出一种有序、专业的视觉感受。

| Property | Value |
|----------|-------|
| Max Width | `1200px` |
| Grid Columns | 12 |
| Grid Gap | `24px` |

### Breakpoints
| Name | Min Width |
|------|-----------|
| `sm` | `640px` |
| `md` | `768px` |
| `lg` | `1024px` |
| `xl` | `1280px` |

## Agent Usage Guide

### ✅ Do
- 将橙色（#FF5000）严格限制用于主要的行动号召（CTA）按钮和需要用户立即注意的关键信息上。
- 利用从 `shadow-subtle` 到 `shadow-overlay` 的四级阴影来清晰地表达界面元素的物理层级关系。
- 始终使用间距系统（4px, 8px, 16px, 24px...）来控制元素间的距离，保持视觉一致性。
- 为所有可交互元素（按钮、链接、输入框）定义完整的状态（default, hover, focus, active, disabled）样式。
- 使用 `system-ui` 字体栈以保证最佳的跨平台性能和可读性。
- 布局严格遵循 12 列网格，确保所有内容对齐。

### ❌ Don't
- 不要将橙色用于大面积的背景、文本或装饰性元素，这会削弱其信号作用。
- 不要使用超过 `radius-lg`（12px）的圆角，以免破坏系统的专业感。
- 不要忽略 disabled 状态，必须明确传达元素不可交互。
- 不要使用线性（linear）的动画缓动，应使用 `ease-out` 或 `ease` 等更自然的曲线。
- 不要随意定义新的阴影值，始终从现有的四级阴影 token 中选择。

### Code Snippets

**创建一个主操作按钮** — 使用信号色作为背景，白色文字，标准高度和圆角，并添加 hover 和 focus 状态。
```css
.btn-primary {
  background: #FF5000;
  color: #FFFFFF;
  border-radius: 6px;
  height: 28px;
  padding: 0 12px;
  font-weight: 600;
  font-size: 14px;
  transition: background 200ms ease-out, box-shadow 200ms ease-out;
}
.btn-primary:hover {
  background: #E04800;
  box-shadow: 0 2px 8px rgba(255, 80, 0, 0.3);
}
.btn-primary:focus-visible {
  outline: 2px solid #FF5000;
  outline-offset: 2px;
}
```

**创建一张内容卡片** — 使用表面色作为背景，应用中等强度的阴影和标准圆角，添加悬停时的阴影增强效果。
```css
.card {
  background: #EBEBEB;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0px 4px 24px rgba(10,10,51,0.12), 0px 0px 8px rgba(0,0,0,0.04);
  transition: transform 200ms ease-out, box-shadow 200ms ease-out;
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0px 8px 32px rgba(10,10,51,0.15), 0px 0px 12px rgba(0,0,0,0.06);
}
```

**创建一个文本输入框** — 使用白底、浅灰边框和小圆角，通过 focus 时的橙色 outline 与系统保持一致。
```css
.input {
  background: #FFFFFF;
  color: #1F1F1F;
  border: 1px solid #EBEBEB;
  border-radius: 4px;
  height: 36px;
  padding: 0 12px;
  font-size: 14px;
  transition: border-color 200ms ease-out;
}
.input:hover {
  border-color: #7A7A7A;
}
.input:focus {
  outline: 2px solid #FF5000;
  outline-offset: 2px;
  border-color: #FF5000;
}
```

**设置基础页面布局** — 使用页面背景，将内容限制在最大宽度内，并利用网格和间距系统进行排列。
```css
body {
  background: #FFFFFF;
  margin: 0;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px; /* 使用 space-lg 作为边距 */
}
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px; /* 使用 space-lg 作为网格间距 */
}
```
