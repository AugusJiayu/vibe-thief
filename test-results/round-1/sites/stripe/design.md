---
schema: "vibe-thief/1.0"
source: "https://stripe.com"
extracted_at: "2026-06-17T10:20:17.432Z"
confidence: 0.8
generator: "vibe-thief@0.1.0"
mood: "专业,高效,清晰"
style_archetype: "light-saas"
---


# Design System: Stripe

## Design Narrative

这是一个高效、清晰、以内容为中心的设计系统。它的核心不是视觉炫技，而是通过极度克制的色彩运用、明确的信息层次和舒适的间距，让界面自己‘消失’，让用户专注于任务本身。它追求一种‘安静的专业感’，信任感来自清晰的结构而非繁复的装饰。

**风格关键词**: `清晰` `高效` `克制` `专业` `内容优先`

## Visual Vocabulary

### 色彩哲学
色彩策略是‘少即是多’。背景使用带有细微蓝调的 #f8fafd，营造出冷静、专业的氛围。一个紫色（#533afd）作为绝对核心的信号色，只用于最关键的交互点，确保其‘信号’价值。文字系统用单一的深海军蓝 #061b31 承载了从标题到正文的全部主要信息，通过字号和粗细区分层次，而非颜色，这强化了系统的整体性和一致性。

### 排版哲学
排版策略的核心是建立清晰、无干扰的信息流。统一使用 sohne-var 字体族，确保从标题到正文的视觉一致性。通过显著的字号差异（16px 正文 vs 44px 标题）和较紧的行高（约 1.1）来构建强有力的视觉层次，让读者能瞬间抓住重点。几乎不使用装饰性字体，让内容本身成为主角。

### 留白哲学
间距遵循 4px 基础单位，创造稳定、可预测的节奏。设计哲学是‘呼吸在组件之间，而非组件之内’：组件内部使用 8-12px 保持紧凑感，组件之间则使用 16-24px 提供清晰的视觉分隔。这种明确的规则避免了随意的间距带来的混乱，提升了界面的秩序感和扫描效率。

### 深度哲学
深度表达采用‘微妙分层’策略。主要依靠 #f8fafd 和 #ffffff 的背景色差异来创造页面层级。阴影非常克制，仅用于需要明确浮起的交互元素（如下拉菜单、悬停卡片），且强度递进清晰（sm -> md -> lg）。圆角规则统一，4px 用于小型控件，8px 用于内容容器，避免了风格混杂。整体效果是干净、有序，而非立体感突出。

## Design Tokens

### Colors

#### Background Layers（表达页面深度结构）
| Token | Value | Usage |
|-------|-------|-------|
| `bg-page` | `#f8fafd` | 页面最底层背景，提供微妙的冷色调环境，比纯白更柔和。 |
| `bg-surface` | `#ffffff` | 卡片、面板、内容区块的表面，与页面背景形成自然深度。 |

#### Signal Colors（仅用于需要用户注意的地方）
| Token | Value | Usage |
|-------|-------|-------|
| `signal-purple` | `#533afd` | 核心交互色，用于主按钮、活动状态指示、重要的品牌标识。 |
| `signal-blue` | `#000eff` | 辅助强调色，用于链接、信息提示、需要轻微区分但不主导的元素。 |

#### Text Hierarchy
| Token | Value | Usage |
|-------|-------|-------|
| `text-strong` | `#061b31` | 标题、重要数据、主导航文字。最高视觉权重。 |
| `text-default` | `#061b31` | 正文、段落内容。与 strong 相同，确保极佳可读性。 |
| `text-secondary` | `#64748d` | 辅助说明、标签、时间戳、次要信息。 |
| `text-disabled` | `#b9b9f9` | 不可操作的禁用文字。 |

### Typography

#### Font Stack
| Role | Family |
|------|--------|
| Heading | `sohne-var` |
| Body | `sohne-var` |
| Code | `monospace` |

#### Type Scale
| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| `text-xs` | `14px` | 400 | 标签、表头、辅助信息。 |
| `text-body` | `16px` | 400 | 正文、段落、主要内容。 |
| `text-sm-heading` | `22px` | 600 | 卡片标题、区块标题。 |
| `text-md-heading` | `26px` | 600 | 章节标题。 |
| `text-lg-heading` | `32px` | 600 | 页面标题。 |
| `text-display` | `44px` | 600 | Landing page 主标题、英雄区标题。 |

### Spacing

Base: `4px`

| Token | Value | Usage |
|-------|-------|-------|
| `space-xs` | `4px` | 图标与文字、紧凑元素的内边距。 |
| `space-sm` | `8px` | 组件内部的通用间距，如按钮内文字与边框。 |
| `space-md` | `12px` | 列表项内间距、表单标签与输入框间距。 |
| `space-base` | `16px` | 组件之间的基础间隔、段落间距。 |
| `space-lg` | `24px` | 网格列间距、主要区块之间的分隔。 |
| `space-xl` | `32px` | 页面主要区块的顶部/底部外边距。 |

### Depth & Hierarchy

#### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | `4px` | 按钮、输入框、小卡片。 |
| `radius-md` | `8px` | 主要卡片、模态框、容器。 |
| `radius-lg` | `12px` | 大型卡片、特定强调元素。 |
| `radius-full` | `9999px` | 头像、状态点、胶囊形标签。 |

#### Shadows
| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | `rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px` | 卡片悬停、轻微浮起的元素。 |
| `shadow-md` | `rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px` | 下拉菜单、弹出面板。 |
| `shadow-lg` | `rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px` | 模态框、通知气泡。 |

#### Borders
| Token | Value | Usage |
|-------|-------|-------|
| `border-subtle` | `1px solid #e0e0e0` | 输入框、卡片边框、分隔线。 |
| `border-strong` | `1px solid #ccc` | 活动选项卡底部边框、强调边框。 |

### Motion

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `motion-fast` | `150ms` | `ease-out` | 按钮悬停、微交互反馈。 |
| `motion-normal` | `250ms` | `ease-in-out` | 面板展开、状态切换过渡。 |
| `motion-slow` | `400ms` | `ease-in-out` | 复杂动画、页面过渡。 |

> 动效策略是‘快速、有用、克制’。目的不是炫技，而是提供即时反馈和引导用户注意力。150ms 的快速响应让交互感觉灵敏；250ms 的过渡平滑自然，不拖沓。动效幅度小，方向性明确（如从下方滑入），始终服务于功能的清晰性，避免任何可能分散注意力的装饰性动画。

## Component Patterns

### Button

核心交互元素，承载明确的行动号召。

**Default:**
| Property | Value |
|----------|-------|
| bg | `#533afd` |
| color | `#ffffff` |
| border-radius | `4px` |
| height | `36px` |
| padding | `0 16px` |
| font-weight | `600` |

**Hover:**
| Property | Value |
|----------|-------|
| bg | `#4530d1` |

**Focus:**
| Property | Value |
|----------|-------|
| outline | `2px solid #533afd` |
| outline-offset | `2px` |

**Active:**
| Property | Value |
|----------|-------|
| bg | `#3a29b0` |

**Disabled:**
| Property | Value |
|----------|-------|
| bg | `#f0f0f5` |
| color | `#b9b9f9` |

**Variants:**
- **Primary**: bg: `#533afd`, color: `#ffffff`
- **Secondary**: bg: `transparent`, color: `#533afd`, border: `1px solid #533afd`
- **Ghost**: bg: `transparent`, color: `#061b31`

### Card

用于组织和展示相关内容块的基础容器。

**Default:**
| Property | Value |
|----------|-------|
| bg | `#ffffff` |
| border-radius | `8px` |
| border | `1px solid #e0e0e0` |
| padding | `16px` |

**Hover:**
| Property | Value |
|----------|-------|
| shadow | `rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px` |

### Input

用于用户输入文本信息的表单控件。

**Default:**
| Property | Value |
|----------|-------|
| bg | `#ffffff` |
| color | `#061b31` |
| border | `1px solid #ccc` |
| border-radius | `4px` |
| height | `36px` |
| padding | `0 12px` |

**Hover:**
| Property | Value |
|----------|-------|
| border-color | `#999` |

**Focus:**
| Property | Value |
|----------|-------|
| outline | `2px solid #533afd` |
| outline-offset | `1px` |
| border-color | `#533afd` |

**Disabled:**
| Property | Value |
|----------|-------|
| bg | `#f8f8f8` |
| color | `#b9b9f9` |
| border-color | `#e0e0e0` |

### Navigation

主导航或侧边栏导航容器。

**Default:**
| Property | Value |
|----------|-------|
| bg | `#ffffff` |
| border-right | `1px solid #e0e0e0` |

## Interaction Patterns

| State | Style |
|-------|-------|
| Hover | 轻柔的背景色变化或极浅的阴影浮现，提供即时反馈，不突兀。 |
| Focus | 明确的紫色 (#533afd) 轮廓线，配合轻微的轮廓偏移，确保键盘导航的可访问性。 |
| Active | 背景色比 hover 态更深一级，模拟按下的物理反馈。 |
| Loading | 使用简洁的加载指示器（如 spinner），颜色为信号色或文字次要色。 |
| Transition | 使用 150ms 的 ease-out 进行快速反馈，250ms 的 ease-in-out 进行状态过渡。 |

## Layout

布局基于 12 列弹性网格，最大宽度限制在 1200px，确保在大屏幕上的可读性和内容聚焦。24px 的网格间距与间距系统一致，创造了统一的节奏。响应式断点采用常见的移动优先策略，布局会优雅地重组，在小屏幕上可能合并为单列，在大屏幕上利用多列空间。整体追求清晰、对齐和一致性。

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
- 用背景色层级（#f8fafd 页面 vs #ffffff 表面）来表达页面深度，而不是过度依赖阴影。
- 将紫色 (#533afd) 严格限制用于核心行动号召（CTA）和关键交互状态，确保其‘信号’作用。
- 使用字号和 font-weight 的巨大差异（如 16px body vs 44px display）来建立强烈的视觉层次。
- 始终遵循 4px 的倍数间距系统，组件内用 8-12px，组件间用 16-24px。
- 为所有交互元素（按钮、输入框、链接）提供清晰、一致的 focus 状态（紫色轮廓），确保可访问性。
- 使用 4px 圆角于小控件（按钮、输入框），8px 圆角于容器（卡片、面板）。
- 动画要快速（150ms）、有意义，仅用于反馈和引导，避免装饰性动画。

### ❌ Don't
- 不要在大面积的背景或文字上使用紫色或蓝色信号色，这会削弱其价值并造成视觉疲劳。
- 不要使用复杂或强烈的阴影系统。阴影是微妙的辅助手段，不是主要的深度构建工具。
- 不要在字体排版上使用过多颜色。用 #061b31 深色处理主要文字，#64748d 灰色处理次要文字，足以建立层次。
- 不要随意混用圆角值。确立规则并严格执行（小控件 4px，容器 8px）。
- 不要让过渡动画持续时间超过 400ms，除非是特殊的页面级过渡。大多数交互反馈应在 250ms 内完成。
- 不要在没有明确交互目的的情况下添加动效。

### Code Snippets

**创建一个主行动按钮 (CTA)** — 使用紫色信号色作为背景，白色文字，确保高对比度和可点击感。
```css
background-color: #533afd; color: #ffffff; border-radius: 4px; height: 36px; padding: 0 16px; font-weight: 600; border: none; cursor: pointer; transition: background-color 150ms ease-out;
```

**创建一个内容卡片** — 使用白色表面色，配合 8px 圆角和微妙的边框。悬停时添加轻微阴影。
```css
background-color: #ffffff; border-radius: 8px; border: 1px solid #e0e0e0; padding: 16px; transition: box-shadow 250ms ease-in-out; /* Hover: box-shadow: rgba(0,0,0,0.1) 0px 4px 6px -1px; */
```

**创建一个文本输入框** — 白色背景，灰色边框，聚焦时显示紫色轮廓以提升可访问性。
```css
background-color: #ffffff; color: #061b31; border: 1px solid #ccc; border-radius: 4px; height: 36px; padding: 0 12px; transition: border-color 150ms ease-out; /* Focus: outline: 2px solid #533afd; outline-offset: 1px; border-color: #533afd; */
```

**设置主内容区域布局** — 使用 12 列网格，限制最大宽度，确保内容居中且可读。
```css
max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(12, 1fr); gap: 24px; padding: 0 24px;
```
