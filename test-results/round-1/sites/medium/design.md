---
schema: "vibe-thief/1.0"
source: "https://medium.com"
extracted_at: "2026-06-17T10:12:04.428Z"
confidence: 0.75
generator: "vibe-thief@0.1.0"
mood: "clean, professional, organized"
style_archetype: "light-saas"
---


# Design System: Medium

## Design Narrative

这是一个以清晰和效率为核心的专业级设计系统。它的灵魂在于用克制的视觉语言传达信任感和可靠性。主色调 #30a840 被严格控制，仅用作需要用户立即注意的信号，如主按钮和成功状态，确保其始终具有指引力。整体背景和表面使用温暖的灰调，营造出舒适、不刺眼的阅读环境，避免纯白带来的疲劳感。信息层级通过背景色、细微的边框和极轻的阴影来表达，而非依赖强烈的视觉冲击。

**风格关键词**: `专业` `克制` `清晰` `效率` `可靠`

## Visual Vocabulary

### 色彩哲学
色彩策略的核心是‘温暖的中性基底 + 精准的绿色信号’。背景和表面采用带有轻微黄色调的灰阶（#f0f0e8, #e8e8e0, #e0e0d8），区别于冷峻的纯灰，营造出更友好、更不易疲劳的专业环境。唯一具有强烈情感的 #30a840 绿色被严格限定为‘信号色’，像交通灯一样，只用于引导用户进行关键操作，避免因过度使用而丧失注意力引导作用。

### 排版哲学
排版遵循‘清晰高于装饰’的原则。采用中性、高可读性的无衬线字体栈，优先使用 Inter 以获得优秀的屏幕显示效果。字号阶梯温和，从14px的正文到24px的大标题，层级分明但不夸张。强调使用 font-weight 和颜色（text-primary vs text-secondary）来区分信息重要性，而非仅靠字号大小，这使得界面在保持紧凑信息密度的同时依然层次清晰。

### 留白哲学
间距系统基于 4px 网格，但在应用时遵循‘呼吸感’原则：组件内部（如按钮内部）使用 8px 保持紧凑感，而组件之间（如卡片与卡片）则使用 16px 或 24px 创造充足的呼吸空间。这种策略确保了在舒适密度下，内容既不会显得松散，也不会过于拥挤。所有间距都是基础单元的倍数，便于维护一致性。

### 深度哲学
层级表达优先使用背景色差异（从画布到表面到交替表面），其次是边框，最后才是阴影。阴影非常克制且轻量，仅用于表达临时浮起状态（如下拉菜单、模态框）。边框颜色与背景色调和，使用 #d8d8d0 这样的中性色，仅作区隔而非强调。圆角根据组件类型严格区分，小元素用小圆角，大容器用大圆角，形成视觉节奏。

## Design Tokens

### Colors

#### Background Layers（表达页面深度结构）
| Token | Value | Usage |
|-------|-------|-------|
| `bg-canvas` | `#f0f0e8` | 页面最底层画布背景，提供温暖的基底 |
| `bg-surface` | `#e8e8e0` | 卡片、模态框等需要从画布中浮起的容器背景 |
| `bg-surface-alt` | `#e0e0d8` | 交替行、表单容器或需要轻微区隔的次级表面 |
| `bg-inset` | `#d8d8d0` | 输入框内部、下拉菜单等需要内陷感的区域 |

#### Signal Colors（仅用于需要用户注意的地方）
| Token | Value | Usage |
|-------|-------|-------|
| `signal-primary` | `#30a840` | 主按钮、选中态、成功状态、关键行动点 |
| `signal-primary-hover` | `#38b54a` | 主按钮悬停态，比主信号色稍亮 |

#### Text Hierarchy
| Token | Value | Usage |
|-------|-------|-------|
| `text-primary` | `#202020` | 主标题、关键正文内容，确保最高可读性 |
| `text-secondary` | `#404040` | 次级标题、描述性文字、标签 |
| `text-tertiary` | `#303030` | 占位符、辅助说明文字 |
| `text-disabled` | `#c8c8c0` | 禁用状态的文字、不可交互元素 |

### Typography

#### Font Stack
| Role | Family |
|------|--------|
| Heading | `Inter, SF Pro Display, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif` |
| Body | `Inter, SF Pro Text, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif` |
| Code | `SF Mono, Monaco, Inconsolata, 'Roboto Mono', 'Source Code Pro', monospace` |

#### Type Scale
| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| `text-heading-lg` | `24px` | 600 | 页面主标题、数据概览数字 |
| `text-heading` | `20px` | 600 | 区域标题、卡片标题 |
| `text-body-lg` | `16px` | 400 | 大段落正文、说明文档 |
| `text-body` | `14px` | 400 | 默认正文字体、表格内容 |
| `text-caption` | `12px` | 400 | 标签、注释、辅助信息 |
| `text-button` | `14px` | 500 | 按钮内文字 |

### Spacing

Base: `4px`

| Token | Value | Usage |
|-------|-------|-------|
| `space-2xs` | `4px` | 图标与文字内联间距、最小间隔 |
| `space-xs` | `8px` | 组件内部元素间距（如按钮内图标与文字）、紧凑列表行间距 |
| `space-s` | `12px` | 表单项内标签与输入框间距、小卡片内填充 |
| `space-m` | `16px` | 卡片内填充、表单组间距、常规组件间距 |
| `space-l` | `24px` | 区域间距、主要网格间隙（grid-gap） |
| `space-xl` | `32px` | 大区块分隔、页面主模块间距 |

### Depth & Hierarchy

#### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | `4px` | 小按钮、标签、微小交互元素 |
| `radius-md` | `8px` | 常规按钮、输入框、小卡片 |
| `radius-lg` | `12px` | 卡片、面板、模态框 |
| `radius-xl` | `16px` | 大型容器、特色区块 |
| `radius-full` | `9999px` | 圆形头像、圆形按钮 |

#### Shadows
| Token | Value | Usage |
|-------|-------|-------|
| `shadow-s` | `0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)` | 轻量浮起，如卡片悬停、下拉菜单 |
| `shadow-m` | `0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)` | 显著浮起，如模态框、弹出面板 |

#### Borders
| Token | Value | Usage |
|-------|-------|-------|
| `border-subtle` | `1px solid #d8d8d0` | 卡片边框、分隔线、表单输入框默认边框 |
| `border-focus` | `2px solid #30a840` | 输入框获得焦点时的边框，使用信号色明确状态 |

### Motion

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `motion-fast` | `150ms` | `ease-out` | 颜色变化、微交互反馈（如按钮悬停） |
| `motion-normal` | `250ms` | `ease-in-out` | 布局变化、元素展开/收起 |
| `motion-slow` | `400ms` | `ease-in-out` | 复杂动画、页面过渡 |

> 动效遵循‘快速且有目的’的原则。绝大多数交互反馈（如悬停）使用 150ms 的 ease-out，确保响应感觉即时。布局和状态变化使用 250ms 的 ease-in-out，过程平滑且自然。动效的核心是强化交互的确定性，而非装饰，因此避免使用复杂、夸张的动画。

## Component Patterns

### Button

用于触发动作的主要交互元素。有主次之分。

**Default:**
| Property | Value |
|----------|-------|
| bg | `#e8e8e0` |
| color | `#202020` |
| border-radius | `8px` |
| height | `36px` |
| font-weight | `500` |
| border | `1px solid transparent` |

**Hover:**
| Property | Value |
|----------|-------|
| bg | `#d8d8d0` |

**Focus:**
| Property | Value |
|----------|-------|
| outline | `2px solid #30a840` |
| outline-offset | `2px` |

**Active:**
| Property | Value |
|----------|-------|
| bg | `#d0d0c8` |

**Disabled:**
| Property | Value |
|----------|-------|
| bg | `#e8e8e0` |
| color | `#c8c8c0` |
| cursor | `not-allowed` |

**Variants:**
- **Primary**: bg: `#30a840`, color: `#ffffff`, hover_bg: `#38b54a`
- **Secondary**: bg: `transparent`, border: `1px solid #d8d8d0`, color: `#202020`, hover_bg: `#f0f0e8`

### Card

用于分组和承载信息的容器，带有轻微浮起感。

**Default:**
| Property | Value |
|----------|-------|
| bg | `#e0e0d8` |
| border-radius | `12px` |
| padding | `16px` |
| border | `1px solid #d8d8d0` |
| shadow | `none` |

**Hover:**
| Property | Value |
|----------|-------|
| shadow | `0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)` |

**Focus:**
| Property | Value |
|----------|-------|
| outline | `2px solid #30a840` |
| outline-offset | `2px` |

### Input

用于文本输入的表单控件。

**Default:**
| Property | Value |
|----------|-------|
| bg | `#f0f0e8` |
| border | `1px solid #d8d8d0` |
| border-radius | `6px` |
| height | `36px` |
| padding | `0 12px` |
| color | `#202020` |
| placeholder-color | `#c8c8c0` |

**Hover:**
| Property | Value |
|----------|-------|
| border | `1px solid #c8c8c0` |

**Focus:**
| Property | Value |
|----------|-------|
| border | `2px solid #30a840` |
| shadow | `none` |

**Disabled:**
| Property | Value |
|----------|-------|
| bg | `#e8e8e0` |
| color | `#c8c8c0` |
| border | `1px solid #d8d8d0` |

## Interaction Patterns

| State | Style |
|-------|-------|
| Hover | 平滑的颜色变暗或变亮，例如按钮背景色从 #e8e8e0 变为 #d8d8d0，或主按钮从 #30a840 变为 #38b54a。 |
| Focus | 使用 2px 宽的信号色 (#30a840) 轮廓，配合 2px 的 outline-offset，清晰而不侵入内部空间。 |
| Active | 比 hover 状态更深一级的颜色，例如按钮按下时背景为 #d0d0c8，提供明确的‘按下’反馈。 |
| Loading | 主按钮进入加载状态时，内容替换为轻量的圆形 spinner，颜色为按钮文字颜色 (白色或深灰)，按钮本身背景色变暗或保持。 |
| Transition | 所有交互状态变化都应用 transition: all 0.2s ease-in-out; 确保动效一致、平滑。 |

## Layout

布局基于 12 列的强网格系统，配合 24px 的间隙，构建出稳定、对齐清晰的结构。整体左对齐，符合从左到右的阅读习惯。最大宽度限制为 1200px，在超宽屏上保持内容的可读性和集中度。‘舒适密度’是核心：内容区域留有足够的 padding，元素之间保持充足间距，让用户在高效获取信息的同时不感到压迫。

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

## Agent Usage Guide

### ✅ Do
- 使用背景色层级 (#f0f0e8 -> #e8e8e0 -> #e0e0d8) 来表达界面的深度结构，而非依赖阴影。
- 将信号色 #30a840 严格限制用于主按钮、成功提示、选中态和关键链接。它应是页面上的视觉‘惊叹号’。
- 始终遵循 4px 网格系统的倍数 (8, 12, 16, 24, 32) 来定义间距，确保布局节奏一致。
- 为按钮、输入框、卡片等组件严格定义并应用 hover, focus, active, disabled 全部状态样式。
- 所有可交互元素必须提供清晰的 focus 轮廓样式 (#30a840)，确保键盘可访问性。
- 动效要克制：使用 150ms ease-out 用于 hover，250ms ease-in-out 用于状态变化。
- 优先使用 font-weight (400, 500, 600) 和 text color (text-primary, text-secondary) 来创建文本层级。

### ❌ Don't
- 不要在非关键操作的按钮或装饰性元素上滥用信号色 #30a840，这会削弱其引导力。
- 不要使用深色或强烈的 box-shadow。阴影应仅用于表达临时浮起状态，且颜色要非常浅 (rgba(0,0,0,0.08) 级别)。
- 不要为禁用状态只改变颜色透明度，必须同时应用禁用的背景色 (#e8e8e0) 和文字色 (#c8c8c0)。
- 不要使用过于复杂或时间过长 (>400ms) 的动画，这会拖慢用户体验。
- 不要混用不同的圆角风格。小按钮用 8px，大卡片用 12px，保持一致性。
- 不要忽略组件的 focus 态，它是可访问性的底线。

### Code Snippets

**创建一个主操作按钮 (Primary Button)** — 使用信号色作为背景，白色文字，确保有完整的状态变化。
```css
.btn-primary {
  background: #30a840;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  height: 36px;
  padding: 0 16px;
  font-weight: 500;
  transition: all 0.2s ease-out;
}
.btn-primary:hover {
  background: #38b54a;
}
.btn-primary:focus {
  outline: 2px solid #30a840;
  outline-offset: 2px;
}
.btn-primary:active {
  background: #2d9a3a;
}
.btn-primary:disabled {
  background: #e8e8e0;
  color: #c8c8c0;
  cursor: not-allowed;
}
```

**创建一个信息卡片 (Card)** — 使用次级表面色作为背景，配合微妙的边框和悬停阴影。
```css
.card {
  background: #e0e0d8;
  border: 1px solid #d8d8d0;
  border-radius: 12px;
  padding: 16px;
  transition: box-shadow 0.2s ease-in-out;
}
.card:hover {
  box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06);
}
```

**创建一个标准文本输入框 (Input)** — 使用画布色作为背景，焦点时切换为信号色边框。
```css
.input {
  background: #f0f0e8;
  border: 1px solid #d8d8d0;
  border-radius: 6px;
  height: 36px;
  padding: 0 12px;
  color: #202020;
  transition: border-color 0.2s ease-out;
}
.input::placeholder {
  color: #c8c8c0;
}
.input:hover {
  border-color: #c8c8c0;
}
.input:focus {
  outline: none;
  border-color: #30a840;
  border-width: 2px;
  padding: 0 11px; /* 补偿边框宽度变化 */
}
```

**设置一个典型的页面布局区域** — 使用空间标记和网格间隙来构建结构。
```css
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px; /* 页面水平内边距 */
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px; /* 核心网格间隙 */
  padding: 32px 0; /* 区域垂直间距 */
}

.content-block {
  grid-column: span 8; /* 示例：主内容占8列 */
}
```
