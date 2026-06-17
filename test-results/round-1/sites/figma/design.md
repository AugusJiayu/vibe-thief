---
schema: "vibe-thief/1.0"
source: "https://figma.com"
extracted_at: "2026-06-17T10:29:26.728Z"
confidence: 0.75
generator: "vibe-thief@0.1.0"
mood: "clean, professional, functional"
style_archetype: "light-saas"
---


# Design System: Figma

## Design Narrative

这是一个以清晰信息层级和克制设计为核心的设计系统。它避免使用强烈的色彩或复杂的效果来吸引注意力，而是通过精细的排版阶梯、一致的间距和极低的色彩饱和度来构建一个平静、可信赖的专业工具界面。设计的‘信号’非常微弱，只在真正需要用户注意的地方（如错误状态）才出现，其余一切都服务于内容的清晰呈现。

**风格关键词**: `minimalist` `clarity` `hierarchy` `professional` `functional`

## Visual Vocabulary

### 色彩哲学
色彩策略极度克制，核心是‘单色黑+透明度’。主背景为纯白，通过混合不同程度透明的黑色来创建层次（surface, elevated）。唯一的‘信号’是用于错误的深红色。这种策略让界面极度干净，所有视觉焦点都留给了内容本身和排版。

### 排版哲学
排版是建立层级的主要手段。所有 font-weight 均为 400 (Regular)，完全依靠字号和透明度（text-secondary）来区分信息重要性。这创造出一种平静、无压迫感的阅读体验，让内容本身成为主角。字号阶梯不是严格的数学比例，而是经过设计的视觉阶梯，确保在不同上下文中都有良好的可读性。

### 留白哲学
间距系统基于 4px 基数，但阶梯中有 12px, 24px 等非 4 的整数倍，这是一个设计导向的、灵活的间距系统。策略是：组件内部使用紧凑的 8px 和 12px，保持信息密度；组件之间使用 16px 及以上，创造呼吸感。这样既保证了界面的紧凑和效率，又避免了元素之间的拥挤。

### 深度哲学
深度表达非常克制。主要依赖背景色层级（bg-page vs bg-surface）来区分层次，而非强烈的阴影。阴影极淡，几乎只作为提示。边框同样极淡，主要功能是划分区域而非强调。圆角使用 4px 和 8px 为主，保持现代感但不过分圆润。整体策略是‘平面的层次感’。

## Design Tokens

### Colors

#### Background Layers（表达页面深度结构）
| Token | Value | Usage |
|-------|-------|-------|
| `bg-page` | `#FFFFFF` | 页面最底层背景 |
| `bg-surface` | `color-mix(in oklch, #000000, transparent 92%)` | 卡片、输入框、组件内部背景，与页面背景形成微妙的层次 |
| `bg-elevated` | `color-mix(in oklch, #000000, transparent 96%)` | 按钮透明背景、悬浮菜单等需要更浅背景的交互元素 |

#### Signal Colors（仅用于需要用户注意的地方）
| Token | Value | Usage |
|-------|-------|-------|
| `signal-error` | `#972121` | 唯一且仅用于错误状态。这是系统中最强烈的色彩，确保它能立即被感知到错误，但又不破坏整体的平静感。 |
| `signal-primary-action` | `#000000` | 主按钮、强调性操作。使用纯黑而非彩色，强调的是操作的严肃性和基础性，而非愉悦感。 |
| `signal-success` | `#4CAF50` | 成功状态（推断） |
| `signal-warning` | `#FF9800` | 警告状态（推断） |
| `signal-info` | `#2196F3` | 信息状态、focus 轮廓（推断） |

#### Text Hierarchy
| Token | Value | Usage |
|-------|-------|-------|
| `text-primary` | `#000000` | 标题、关键信息、主要内容 |
| `text-secondary` | `color-mix(in oklch, #000000, transparent 46%)` | 次要说明、辅助信息、占位符 |
| `text-disabled` | `color-mix(in oklch, #000000, transparent 60%)` | 禁用状态的文字 |

### Typography

#### Font Stack
| Role | Family |
|------|--------|
| Heading | `figmaSans, system-ui, sans-serif` |
| Body | `figmaSans, system-ui, sans-serif` |
| Code | `figmaMono, ui-monospace, monospace` |

#### Type Scale
| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| `text-display-xl` | `84px` | 400 | 最大展示型标题，用于营销页面或超大数字 |
| `text-display` | `44px` | 400 | 次级展示标题 |
| `text-heading-1` | `36px` | 400 | 页面主标题 |
| `text-heading-2` | `32px` | 400 | 章节标题 |
| `text-heading-3` | `24px` | 400 | 子章节标题 |
| `text-heading-4` | `22px` | 400 | 卡片标题 |
| `text-body-xl` | `18px` | 400 | 引言、突出正文 |
| `text-body-lg` | `16px` | 400 | 大段落正文 |
| `text-body` | `14px` | 400 | 标准正文，最常用尺寸 |
| `text-caption` | `14px` | 400 | 说明文字、注释 |
| `text-button` | `16px` | 400 | 标准按钮文字 |
| `text-button-sm` | `14px` | 400 | 小按钮文字 |
| `text-badge` | `12px` | 400 | 标签、徽章 |
| `text-form-input` | `14px` | 400 | 表单输入文字 |
| `text-form-label` | `11px` | 400 | 表单标签文字，非常小，强调其辅助性 |

### Spacing

Base: `4px`

| Token | Value | Usage |
|-------|-------|-------|
| `space-0` | `0` | 无间距 |
| `space-1` | `4px` | 图标与文字、紧凑元素内部间距 |
| `space-2` | `8px` | 组件内部标准间距、列表项间距 |
| `space-3` | `12px` | 输入框内边距 |
| `space-4` | `16px` | 组件之间标准间距、卡片内边距 |
| `space-6` | `24px` | 区块间距、章节标题与内容间距 |
| `space-8` | `32px` | 大区块间距 |
| `space-10` | `40px` | 页面主要区块间距 |
| `space-14` | `56px` | 超大间距，用于页面标题与内容分隔 |
| `space-16` | `64px` | 极特殊情况下的大间距 |
| `space-20` | `80px` | 营销页面区块间距 |
| `space-30` | `120px` | 营销页面超大间距 |

### Depth & Hierarchy

#### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| `radius-none` | `0` | 无圆角 |
| `radius-sm` | `2px` | 标签、小元素 |
| `radius-md` | `4px` | 按钮、输入框 |
| `radius-lg` | `8px` | 卡片、弹窗 |
| `radius-xl` | `12px` | 大型卡片、模态框 |
| `radius-2xl` | `16px` | 特殊强调的容器 |
| `radius-full` | `9999px` | 圆形头像、圆形按钮 |

#### Shadows
| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | `0 0.25rem 2rem 0 color-mix(in oklch, #000000, transparent 90%)` | 极淡的阴影，用于卡片的轻微悬浮感 |
| `shadow-md` | `0 1.5rem 4.375rem 0 color-mix(in oklch, #000000, transparent 90%)` | 下拉菜单、模态框等需要明确浮于页面之上的元素 |

#### Borders
| Token | Value | Usage |
|-------|-------|-------|
| `border-subtle` | `1px solid color-mix(in oklch, #000000, transparent 84%)` | 输入框、分隔线、卡片边框。使用极淡的灰色，几乎不可见，仅用于结构划分。 |

### Motion

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `motion-fast` | `150ms` | `ease-out` | 微交互反馈，如按钮 hover、状态切换 |
| `motion-normal` | `250ms` | `ease` | 元素展开/收起，如折叠面板、下拉菜单 |
| `motion-slow` | `400ms` | `ease-in-out` | 页面级过渡或复杂动画 |

> 动效是功能性的，而非装饰性的。目的是提供即时的反馈和状态转换的流畅感。速度很快，不会让用户等待。使用 ease-out 和 ease 作为主要缓动，让动画感觉灵敏且自然。避免任何可能分散注意力的复杂或弹跳效果。

## Component Patterns

### Button

核心交互元素，用于触发操作。样式克制，强调清晰性和可操作性。

**Default:**
| Property | Value |
|----------|-------|
| bg | `#000000` |
| color | `#FFFFFF` |
| border-radius | `4px` |
| height | `36px` |
| padding | `0 16px` |
| font-size | `16px` |
| font-weight | `400` |
| border | `none` |

**Hover:**
| Property | Value |
|----------|-------|
| bg | `color-mix(in oklch, #000000, #FFFFFF 15%)` |
| filter | `brightness(1.1)` |

**Focus:**
| Property | Value |
|----------|-------|
| outline | `2px solid #2196F3` |
| outline-offset | `2px` |

**Active:**
| Property | Value |
|----------|-------|
| transform | `scale(0.98)` |

**Disabled:**
| Property | Value |
|----------|-------|
| bg | `color-mix(in oklch, #000000, transparent 60%)` |
| color | `color-mix(in oklch, #FFFFFF, transparent 40%)` |
| cursor | `not-allowed` |

**Variants:**
- **Primary**: bg: `#000000`, color: `#FFFFFF`
- **Secondary**: bg: `transparent`, color: `#000000`, border: `1px solid color-mix(in oklch, #000000, transparent 84%)`

### Card

用于分组相关内容和信息的容器。通过背景色与页面背景形成微妙对比。

**Default:**
| Property | Value |
|----------|-------|
| bg | `color-mix(in oklch, #000000, transparent 92%)` |
| border-radius | `8px` |
| padding | `16px` |
| border | `none` |

**Hover:**
| Property | Value |
|----------|-------|
| bg | `color-mix(in oklch, #000000, transparent 90%)` |
| box-shadow | `0 0.25rem 2rem 0 color-mix(in oklch, #000000, transparent 90%)` |

### Input

用于文本输入的表单元素。边框极淡，聚焦时有明确状态指示。

**Default:**
| Property | Value |
|----------|-------|
| bg | `color-mix(in oklch, #000000, transparent 92%)` |
| color | `#000000` |
| border | `1px solid color-mix(in oklch, #000000, transparent 84%)` |
| border-radius | `4px` |
| height | `36px` |
| padding | `0 12px` |
| font-size | `14px` |

**Hover:**
| Property | Value |
|----------|-------|
| border-color | `color-mix(in oklch, #000000, transparent 60%)` |

**Focus:**
| Property | Value |
|----------|-------|
| outline | `2px solid #2196F3` |
| outline-offset | `-1px` |
| border-color | `#2196F3` |

**Disabled:**
| Property | Value |
|----------|-------|
| bg | `color-mix(in oklch, #000000, transparent 96%)` |
| color | `color-mix(in oklch, #000000, transparent 60%)` |
| border-color | `color-mix(in oklch, #000000, transparent 92%)` |
| cursor | `not-allowed` |

### Navigation

用于页面导航。基于推断，应保持与整体一致的克制风格。

**Default:**
| Property | Value |
|----------|-------|
| bg | `transparent` |
| color | `color-mix(in oklch, #000000, transparent 46%)` |
| font-size | `14px` |

**Hover:**
| Property | Value |
|----------|-------|
| color | `#000000` |
| background-color | `color-mix(in oklch, #000000, transparent 96%)` |

**Active:**
| Property | Value |
|----------|-------|
| color | `#000000` |
| font-weight | `500` |
| background-color | `color-mix(in oklch, #000000, transparent 92%)` |

## Interaction Patterns

| State | Style |
|-------|-------|
| Hover | 通过微妙的背景色变化、亮度提升 (filter: brightness) 或边框颜色加深提供反馈。变化幅度小，确保整体视觉稳定。 |
| Focus | 统一使用 2px solid #2196F3 的蓝色轮廓 (outline)，偏移 2px，确保在各种背景下都清晰可见且不干扰布局。 |
| Active | 通过轻微的 scale 变换 (scale(0.98)) 或更暗的背景色来模拟物理按压感，给予用户即时操作反馈。 |
| Loading | 应使用与主色调一致的 spinner 或 skeleton 屏，避免引入新色彩。动效应平滑、循环。 |
| Transition | 绝大多数交互动效使用 150ms (fast) 或 250ms (normal) 完成，确保快速响应。 |

## Layout

布局以灵活性和内容优先为核心。基于 4 列的网格系统提供基本对齐，但允许内容自适应。最大宽度 1440px 确保在大屏上的可读性。间距一致（主要为 16px 的倍数），创造秩序感，同时通过合理的留白避免界面拥挤，平衡信息密度与舒适度。

| Property | Value |
|----------|-------|
| Max Width | `1440px` |
| Grid Columns | 4 |
| Grid Gap | `16px` |

### Breakpoints
| Name | Min Width |
|------|-----------|
| `sm` | `640px` |
| `md` | `768px` |
| `lg` | `1024px` |
| `xl` | `1440px` |

## Agent Usage Guide

### ✅ Do
- 使用 color-mix 和透明度值 (如 color-mix(in oklch, #000000, transparent X%)) 来创建背景和文字的层次，这是该系统的核心视觉语言。
- 严格遵守 font-weight: 400，完全依靠字号大小和透明度来建立信息层级。
- 将 #972121 (Error Red) 视为珍贵的信号资源，只用于错误状态。
- 主按钮使用 #000000 作为背景，以强调其基础性和严肃性。
- 使用 4px 作为基础间距单位，优先使用 scale 中的 8, 12, 16, 24px 等值。
- 交互反馈（hover, focus）变化要非常微妙，避免破坏整体的平静感。
- focus 状态必须使用 2px solid #2196F3 的轮廓，这是系统唯一的、明确的视觉焦点指示。

### ❌ Don't
- 不要使用鲜艳的、非语义性的颜色作为主色或装饰色。系统主色是黑、白、灰。
- 不要为按钮、卡片等元素添加厚重的阴影或复杂的边框。深度由背景色和极淡的阴影/边框暗示。
- 不要在正文中使用粗体 (font-weight: 500/600)，这会破坏排版的平静感。强调应通过字号、颜色或空间来实现。
- 不要过度使用圆角。按钮 4px，卡片 8px 是标准，避免无处不在的大圆角。
- 不要在动效中使用弹性、弹跳等非功能性效果。动效必须快速、直接、有目的。

### Code Snippets

**创建主操作按钮** — 使用纯黑背景和白色文字，圆角 4px，高度 36px。
```css
.btn-primary {
  background: #000000;
  color: #FFFFFF;
  border-radius: 4px;
  height: 36px;
  padding: 0 16px;
  font-size: 16px;
  font-weight: 400;
  border: none;
  transition: all 150ms ease-out;
}
.btn-primary:hover {
  background: color-mix(in oklch, #000000, #FFFFFF 15%);
}
.btn-primary:focus-visible {
  outline: 2px solid #2196F3;
  outline-offset: 2px;
}
```

**创建信息卡片** — 使用 surface 背景色，无边框，标准内边距。
```css
.card {
  background: color-mix(in oklch, #000000, transparent 92%);
  border-radius: 8px;
  padding: 16px;
  border: none;
  transition: box-shadow 150ms ease-out;
}
.card:hover {
  box-shadow: 0 0.25rem 2rem 0 color-mix(in oklch, #000000, transparent 90%);
}
```

**创建文本输入框** — 使用与卡片相同的 surface 背景，极淡边框，清晰的 focus 状态。
```css
.input {
  background: color-mix(in oklch, #000000, transparent 92%);
  color: #000000;
  border: 1px solid color-mix(in oklch, #000000, transparent 84%);
  border-radius: 4px;
  height: 36px;
  padding: 0 12px;
  font-size: 14px;
  font-weight: 400;
  transition: border-color 150ms ease-out;
}
.input:hover {
  border-color: color-mix(in oklch, #000000, transparent 60%);
}
.input:focus {
  outline: 2px solid #2196F3;
  outline-offset: -1px;
  border-color: #2196F3;
}
```

**设置页面主体布局** — 使用最大宽度容器和标准间距。
```css
.page-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px 24px; /* space-10 space-6 */
}
.section {
  margin-bottom: 32px; /* space-8 */
}
.section-title {
  font-size: 36px; /* text-heading-1 */
  font-weight: 400;
  margin-bottom: 16px; /* space-4 */
  color: #000000;
}
```
