---
schema: "vibe-thief/1.0"
source: "https://open.spotify.com"
extracted_at: "2026-06-17T10:23:58.449Z"
confidence: 0.75
generator: "vibe-thief@0.1.0"
mood: "专业、克制、清晰"
style_archetype: "developer-docs"
---


# Design System: Open

## Design Narrative

这是一个以内容为核心、极度克制的系统。它的设计哲学是“少即是多”。通过近乎单色的调色板（只有黑、白、灰）和经典的衬线字体，它将所有注意力都引导到信息本身。界面像一个安静的阅读器，用留白和排版层次来呼吸，而不是用颜色和动效来喧哗。它的目标是提供无干扰的、高度可读的体验，让结构自己说话。

**风格关键词**: `克制` `清晰` `内容优先` `经典` `无干扰`

## Visual Vocabulary

### 色彩哲学
色彩策略是“极度克制的单色体系”。整个系统建立在黑色 (#000000) 和浅灰 (#f8f8f8) 的二元对比上。功能色彩（成功、警告、错误）被有意省略，以维持视觉的绝对宁静。层级通过黑色的不同透明度（而非不同色相）来表达，确保所有信息都在同一视觉频率上，突出结构和内容本身。

### 排版哲学
排版策略是“经典的衬线体与清晰的层级”。选择 Times New Roman 作为全站字体，是为了唤起一种永恒的、专注于文字内容的阅读感，类似于书籍或学术文档。层次结构完全通过字号 (size) 和字重 (weight) 来建立，搭配高行高 (line-height: 1.5 或更高) 以确保长文阅读的舒适度。字体本身没有个性，而是作为信息透明载体。

### 留白哲学
间距策略是“规律与呼吸”。所有间距都基于 4px 的基础单元，确保布局的节奏感和可预测性。关键原则是：**呼吸在组件之间，而非组件之内**。组件内部（如按钮文字周围）使用 8-12px 的紧凑间距，保持内聚；而组件与组件之间则使用 16-24px 的标准间距，创造清晰的视觉停顿和内容分组。

### 深度哲学
深度表达策略是“低调的层级”。系统极少使用阴影，卡片通常与背景平级或仅通过极淡的 1px 边框 (`rgba(0,0,0,0.1)`) 来定义。层级关系主要依靠 **背景色差异**（页面背景 vs 卡片表面）和 **间距** 来隐式表达。阴影 (`shadow-sm`, `shadow-dropdown`) 只用于明确需要与当前界面分离的临时层（如下拉菜单），且效果非常克制。这确保了界面的整体平整和专注感。

## Design Tokens

### Colors

#### Background Layers（表达页面深度结构）
| Token | Value | Usage |
|-------|-------|-------|
| `bg-page` | `#f8f8f8` | 页面或主容器的背景，提供最底层、最宽广的浅色画布。 |
| `bg-surface` | `#ffffff` | 卡片、输入框等需要与页面背景区分的组件表面。建议使用纯白，与页面背景形成细微但清晰的层级。 |

#### Signal Colors（仅用于需要用户注意的地方）
| Token | Value | Usage |
|-------|-------|-------|
| `signal-primary` | `#1a1a1a` | 主按钮、关键操作、最重要的文字链接。在极简系统中，最强烈的信号往往来自纯黑与背景的高对比。 |
| `signal-link` | `#000000` | 可点击的文字链接，通过下划线或字重变化与普通文本区分，颜色本身与文本主色相同。 |

#### Text Hierarchy
| Token | Value | Usage |
|-------|-------|-------|
| `text-primary` | `#000000` | 页面标题、章节标题、最重要的正文内容。 |
| `text-secondary` | `rgba(0,0,0,0.65)` | 次级正文、描述性文字、标签。通过降低透明度创建层次，而非改变色相。 |
| `text-tertiary` | `rgba(0,0,0,0.45)` | 辅助信息、说明文字、占位符。 |
| `text-disabled` | `rgba(0,0,0,0.25)` | 禁用状态的文字。 |

### Typography

#### Font Stack
| Role | Family |
|------|--------|
| Heading | `Times New Roman, Georgia, serif` |
| Body | `Times New Roman, Georgia, serif` |
| Code | `SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace` |

#### Type Scale
| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| `text-hero` | `2.5rem` | 700 | 核心页面标题或数字展示。 |
| `text-heading` | `1.5rem` | 600 | 章节标题。 |
| `text-subheading` | `1.25rem` | 600 | 子章节标题。 |
| `text-body` | `1rem` | 400 | 基础正文文本，1rem = 16px。 |
| `text-caption` | `0.875rem` | 400 | 辅助性说明、脚注。 |

### Spacing

Base: `4px`

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | `4px` | 极小的内部间距，如图标与文字的微调。 |
| `space-2` | `8px` | 组件内部的标准间距，如按钮内边距。 |
| `space-3` | `12px` | 紧凑的组件间距。 |
| `space-4` | `16px` | 标准组件间距，是系统中最常用的呼吸单元。 |
| `space-6` | `24px` | 宽松的组件间距，用于分隔不同区块。 |
| `space-8` | `32px` | 大区块的间距。 |

### Depth & Hierarchy

#### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | `4px` | 按钮、输入框等小组件的圆角，提供柔和感。 |
| `radius-md` | `8px` | 卡片、容器等较大组件的圆角。 |

#### Shadows
| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | `0 1px 2px 0 rgba(0,0,0,0.05)` | 用于非常轻微的层次提升，例如按钮的默认状态。 |
| `shadow-dropdown` | `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)` | 下拉菜单、悬浮面板等需要明确脱离文档流的元素。 |

#### Borders
| Token | Value | Usage |
|-------|-------|-------|
| `border-default` | `1px solid rgba(0,0,0,0.1)` | 卡片、输入框的默认边框，颜色极淡，几乎隐形，仅用于定义边界。 |
| `border-strong` | `1px solid rgba(0,0,0,0.2)` | 聚焦状态或需要强调边界的元素。 |

### Motion

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `motion-fast` | `150ms` | `ease-out` | 悬停(hover)、聚焦(focus)等需要即时反馈的状态变化。 |
| `motion-normal` | `250ms` | `ease-in-out` | 面板展开/收起、模态框出现等中等复杂度的动效。 |

> 动效策略是“功能性反馈，而非装饰”。动效仅用于确认用户操作（如按钮悬停变色）和引导注意力（如下拉菜单出现），且遵循“快速、直接”的原则。默认使用 `ease-out` 缓动，让动作在结束时有自然的停顿感。避免任何复杂、分散注意力或拖慢用户操作的动效。

## Component Patterns

### Button

核心交互元素，承载主要操作。

**Default:**
| Property | Value |
|----------|-------|
| bg | `#ffffff` |
| color | `#000000` |
| border | `1px solid rgba(0,0,0,0.1)` |
| border-radius | `4px` |
| height | `36px` |
| padding | `0 12px` |
| font-weight | `500` |

**Hover:**
| Property | Value |
|----------|-------|
| bg | `#f8f8f8` |
| border-color | `rgba(0,0,0,0.2)` |

**Focus:**
| Property | Value |
|----------|-------|
| outline | `2px solid rgba(0,0,0,0.3)` |
| outline-offset | `2px` |

**Disabled:**
| Property | Value |
|----------|-------|
| bg | `#f8f8f8` |
| color | `rgba(0,0,0,0.25)` |
| border-color | `rgba(0,0,0,0.05)` |

**Variants:**
- **Primary**: bg: `#1a1a1a`, color: `#ffffff`, border-color: `transparent`
- **Secondary**: bg: `transparent`, border: `1px solid rgba(0,0,0,0.15)`

### Input

文本输入框，用于收集用户信息。

**Default:**
| Property | Value |
|----------|-------|
| bg | `#ffffff` |
| color | `#000000` |
| border | `1px solid rgba(0,0,0,0.1)` |
| border-radius | `4px` |
| height | `36px` |
| padding | `0 12px` |
| placeholder-color | `rgba(0,0,0,0.45)` |

**Hover:**
| Property | Value |
|----------|-------|
| border-color | `rgba(0,0,0,0.2)` |

**Focus:**
| Property | Value |
|----------|-------|
| border-color | `rgba(0,0,0,0.5)` |
| outline | `2px solid rgba(0,0,0,0.1)` |
| outline-offset | `1px` |

### Card

内容容器，用于分组相关信息。

**Default:**
| Property | Value |
|----------|-------|
| bg | `#ffffff` |
| border | `1px solid rgba(0,0,0,0.1)` |
| border-radius | `8px` |
| padding | `24px` |

**Hover:**
| Property | Value |
|----------|-------|
| border-color | `rgba(0,0,0,0.2)` |

## Interaction Patterns

| State | Style |
|-------|-------|
| Hover | 元素（如按钮、卡片）在悬停时，背景色略微变深（如从白到浅灰），边框颜色略微加深，提供即时的可操作反馈。 |
| Focus | 通过 `outline` 属性显示一个柔和、偏移的轮廓线（如 `outline: 2px solid rgba(0,0,0,0.3)`），与边框区分开，明确标识当前聚焦的元素。 |
| Active | 元素被点击时，通常会瞬间变得更深或更灰，产生“按下”的效果。 |
| Loading | 加载状态使用简单的淡入淡出或指示器（如文字从“提交”变为“提交中...”），避免复杂的动画。 |
| Transition | 所有状态变化（hover, focus, active）都使用 `transition: all 150ms ease-out;`，确保反馈快速而流畅。 |

## Layout

布局策略是“基于网格的中心对齐内容”。采用标准的 12 列网格系统，为复杂布局提供灵活性，同时所有内容容器都受 `max-width: 1200px` 约束并在页面中居中，营造出聚焦、舒适的阅读区域。断点 (breakpoints) 遵循标准尺寸，确保从移动端到桌面端的一致体验。

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
- 严格遵守单色（黑、白、灰）体系，不要引入任何额外的颜色。
- 使用 4px 的倍数作为所有间距、尺寸的基础。
- 用透明度（rgba）来创建文字和边框的层次，而不是新颜色。
- 确保所有交互元素（按钮、链接、输入框）都有清晰、一致的 hover 和 focus 状态。
- 组件内部使用 8-12px 间距，组件之间使用 16-24px 间距。
- 主要使用 `border` 和 `background` 的差异来表达层级，谨慎使用 `box-shadow`。
- 为所有可聚焦元素设置明显的、可访问的 focus 样式（如 outline）。

### ❌ Don't
- 不要使用除了黑白灰以外的任何功能性颜色（如蓝色链接、绿色成功提示）。
- 不要使用复杂的渐变、图案或装饰性背景。
- 不要使用过于夸张的阴影或圆角（`border-radius` 保持在 4px-8px）。
- 不要创建会分散用户对内容注意力的复杂动效。
- 不要使用过小的字号（正文不小于 16px）或过紧的行高（不低于 1.5）。
- 不要忽略禁用状态的视觉表现（应显著降低对比度）。

### Code Snippets

**创建一个主按钮** — 使用深灰背景和白色文字，提供最高的视觉权重。
```css
background-color: #1a1a1a; color: #ffffff; border: 1px solid transparent; border-radius: 4px; height: 36px; padding: 0 12px; font-weight: 500; transition: all 150ms ease-out;
```

**创建一个卡片** — 使用白色背景和极淡边框，与页面背景形成微妙区隔。
```css
background-color: #ffffff; border: 1px solid rgba(0,0,0,0.1); border-radius: 8px; padding: 24px;
```

**设置正文文本样式** — 使用基础字号、标准字重和舒适的行高。
```css
font-family: Times New Roman, Georgia, serif; font-size: 16px; line-height: 1.5; color: #000000;
```

**创建一个聚焦状态** — 使用偏移的轮廓线，与元素边框区分开。
```css
&:focus { outline: 2px solid rgba(0,0,0,0.3); outline-offset: 2px; }
```

**布局一个两栏页面** — 使用CSS Grid，并利用间距token。
```css
.container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 2fr; gap: 24px; padding: 24px; }
```
