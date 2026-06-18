---
schema: "vibe-thief/1.0"
source: "https://www.cssdesignawards.com"
extracted_at: "2026-06-17T15:33:39.141Z"
confidence: 0.75
generator: "vibe-thief@0.1.0"
mood: "清冷极简，偶有雅致"
style_archetype: "minimal-portfolio"
---


# Design System: Cssdesignawards

## Design Narrative

一个以呼吸感和书卷气为核心的极简风格。它使用独特的淡蓝色背景作为画布，通过极大比例的留白和中心对齐的布局，将用户的注意力强制聚焦于核心内容。设计的趣味性体现在字体的大胆混搭（现代无衬线体标题与经典衬线体正文的结合）以及线性、扁平的视觉元素上，整体追求一种理性、冷静又不失优雅的氛围。

**风格关键词**: `呼吸感` `中心对齐` `字体混搭` `线性扁平` `留白优先`

## Visual Vocabulary

### 色彩哲学
色彩策略极其克制，形成低对比度的和谐画面。淡蓝背景（#b0e0e9）是情绪的底色，所有元素都在其上展开。唯一的信号色（#226d7a）源自背景色系的深色变体，仅用于关键交互，避免了色彩滥用。整体色彩服务于‘清冷’与‘专注’的氛围。

### 排版哲学
采用一种‘冲突性混搭’策略来创造个性。标题使用现代、中性的无衬线体（Roboto），正文则使用传统、带有书卷气的衬线体（Times New Roman）。这种混搭打破了常规，是‘playful’特质的关键来源。字号跨度较大（16px-36px），层级分明。

### 留白哲学
间距系统以10px为基础，但真正的设计语言在于对超大留白（100px，350px，450px）的使用。这些值不属于常规的组件间距，而是用于定义页面级的布局节奏，通过大幅拉长元素间的垂直距离，强化‘稀疏’、‘专注’和‘呼吸感’的视觉哲学。

### 深度哲学
深度表达策略是‘去深度化’。几乎完全摒弃阴影和厚重的圆角，代之以清晰的黑色细线边框来定义形状和边界。这使得界面非常干净、理性，所有元素仿佛存在于同一平面，依赖布局和留白创造秩序。

## Design Tokens

### Colors

#### Background Layers（表达页面深度结构）
| Token | Value | Usage |
|-------|-------|-------|
| `bg-canvas` | `#b0e0e9` | 页面主背景色。这是一个非常规的淡蓝色，为整个设计奠定了清冷、干净的基调，是风格的核心识别要素之一。 |
| `bg-surface` | `#f8f8f8` | 次级表面背景。用于可能存在的卡片或内容区块，与主背景形成微妙区分。 |

#### Signal Colors（仅用于需要用户注意的地方）
| Token | Value | Usage |
|-------|-------|-------|
| `signal-primary` | `#226d7a` | 用于需要用户注意的交互元素，如主按钮、可点击文字的边框、选中状态。它与背景色属于同一色系（青色系），确保整体和谐，同时通过明度对比提供足够的交互信号。 |

#### Text Hierarchy
| Token | Value | Usage |
|-------|-------|-------|
| `text-primary` | `#000000` | 用于所有主要内容文字。黑色在淡蓝背景上保证了极高的可读性，是信息传达的基石。 |

### Typography

#### Font Stack
| Role | Family |
|------|--------|
| Heading | `Roboto, system-ui, sans-serif` |
| Body | `'Times New Roman', serif` |
| Code | `monospace` |

#### Type Scale
| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| `text-body` | `20px` | 400 | 用于主要段落文本。选择较大的正文字号（20px）和宽松的行高，配合衬线体，营造舒适、易读的长文阅读体验。 |
| `text-display` | `36px` | 700 | 用于页面主标题或重要章节标题。使用无衬线体Roboto的粗体，与正文的衬线体形成对比，突出现代感与结构层次。 |
| `text-caption` | `16px` | 400 | 用于辅助性说明、注释或小标签。 |

### Spacing

Base: `10px`

| Token | Value | Usage |
|-------|-------|-------|
| `space-xs` | `10px` | 用于紧密相关的元素间距，如图标与文字。 |
| `space-md` | `20px` | 用于组件内部间距，或段落之间的间距。 |
| `space-xl` | `60px` | 用于区块之间的明显分隔。 |
| `space-section` | `100px` | 用于页面主要区块之间的超大留白，是创造‘呼吸感’的关键。 |
| `space-page-top` | `350px` | 页面顶部留白，将内容沉到视觉重心下方。 |
| `space-page-bottom` | `450px` | 页面底部留白，平衡顶部留白，并给予页面结束的呼吸空间。 |

### Depth & Hierarchy

#### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | `4px` | 用于需要极轻微圆角的元素，如按钮、输入框，保持克制。 |
| `radius-md` | `8px` | 用于卡片等容器，但根据视觉分析，整体倾向无圆角或小圆角。 |

#### Shadows
| Token | Value | Usage |
|-------|-------|-------|
| `shadow-none` | `none` | 主要风格。根据视觉感知‘无阴影’，设计追求极致的扁平化，元素层级通过留白、颜色和边框而非阴影来区分。 |

#### Borders
| Token | Value | Usage |
|-------|-------|-------|
| `border-default` | `1px solid #000000` | 用于勾勒交互元素（如按钮、输入框）或划分区域。使用纯黑色细线，与整体线性风格一致。 |

### Motion

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `motion-fast` | `150ms` | `ease-out` | 用于最基础的交互反馈，如按钮颜色变化。 |
| `motion-normal` | `250ms` | `ease` | 用于常规过渡，如元素位移或尺寸变化。 |

> 动效极为克制，追求‘功能性’而非‘装饰性’。速度中等，缓动曲线平缓，确保动效不会干扰以文字和静态布局为主的内容体验。

## Motion Language

### 滚动行为
无特殊滚动行为，为简单的原生页面滚动。

### 交互反馈
交互反馈通过颜色和边框变化实现。例如，按钮hover时，背景色可能从透明变为信号色（#226d7a）的浅色变体，边框颜色可能加深。反馈追求‘含蓄的确认’。

### 页面转场
无页面级转场。

### 微交互
无明显的加载动画、toast或tooltip动效，整体保持静态和极简。

### 动效性格
> 温和而含蓄。动效速度适中（150-250ms），不追求炫技，其存在仅为了提供基本的、不干扰注意力的交互反馈。缓动曲线偏平缓，动作看起来自然且不突兀。

## Visual Language

### 布局哲学
极致的中心对齐和垂直留白驱动。内容在水平和垂直方向上都居中，通过巨大的顶部和底部留白（350px， 450px）创造强烈的沉浸感和呼吸感。每屏通常只聚焦于一个核心信息单元，视觉重心下沉。

### 图像使用
推测为线条艺术（line art）和抽象图形，与扁平化风格一致。图像可能作为纯粹的装饰或隐喻元素出现，风格克制，避免写实或复杂场景。

### 图标风格
无明显图标体系。如存在，预计为细线条、无填充的线性图标，与整体边框风格统一。

### 信息密度
极低密度。设计刻意放慢节奏，每屏承载的信息非常有限，大量空间被留白占据，引导用户进行专注、深度的阅读或思考。

### 品牌个性
`清冷` `专注` `雅致` `理性` `略带学术气质`

## Component Patterns

### Button

与背景形成对比的交互元素，线条感强。

**Default:**
| Property | Value |
|----------|-------|
| bg | `transparent` |
| color | `#226d7a` |
| border | `1px solid #226d7a` |
| border-radius | `4px` |
| height | `auto` |
| padding | `10px 20px` |

**Hover:**
| Property | Value |
|----------|-------|
| bg | `rgba(34, 109, 122, 0.1)` |
| color | `#226d7a` |

**Focus:**
| Property | Value |
|----------|-------|
| outline | `2px solid #226d7a` |
| outline-offset | `2px` |

**Variants:**
- **Primary**: bg: `#226d7a`, color: `#ffffff`, border: `1px solid #226d7a`

## Interaction Patterns

| State | Style |
|-------|-------|
| Hover | 通过背景色的微妙变化和边框颜色的明确来提供反馈。强调色彩的透明度和明度变化。 |
| Focus | 使用轮廓（outline）来清晰指示键盘焦点，轮廓颜色使用信号色，宽度为2px，偏移2px。 |
| Active | 可能包含轻微的颜色加深或位移。 |
| Loading | 无明显加载状态，与极简静态风格一致。 |
| Transition | 过渡速度在150ms到250ms之间，使用平缓的缓动函数。 |

## Layout

布局核心是‘中心感’和‘垂直流动’。内容在1200px的最大宽度内居中，但其垂直方向的节奏由巨大的非标准留白值主导。网格系统存在但可能并不密集使用，留白本身就是布局的一部分。

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
- 始终使用淡蓝色(#b0e0e9)作为页面主背景。
- 将主要内容在视口内进行水平和垂直居中。
- 使用巨大的垂直留白（100px， 350px， 450px）来分隔页面区块，创造呼吸感。
- 字体标题用Roboto，正文用Times New Roman，利用这种混搭创造个性。
- 交互元素（按钮等）使用细边框和信号色(#226d7a)，保持线条感。

### ❌ Don't
- 不要使用阴影或厚重的圆角，保持绝对扁平。
- 不要使用高饱和度的多种颜色，整个界面色彩应高度克制。
- 不要填充页面，留白是设计的核心，信息密度要低。
- 不要使用过于花哨或快速的动画，动效应温和且含蓄。
- 不要破坏中心对齐的布局原则。

### Code Snippets

**创建主容器** — 页面主体内容容器，实现居中和垂直节奏
```css
max-width: 1200px; margin: 350px auto 450px auto; text-align: center;
```

**创建主按钮** — 带边框的线性按钮，主交互态
```css
display: inline-block; padding: 10px 20px; border: 1px solid #226d7a; border-radius: 4px; color: #226d7a; background: transparent; font-family: 'Roboto', sans-serif; transition: all 150ms ease-out;
```

**创建标题文本** — 使用无衬线体标题
```css
font-family: 'Roboto', system-ui, sans-serif; font-size: 36px; font-weight: 700; line-height: 1.28; color: #000000; margin-bottom: 60px;
```

**创建正文段落** — 使用衬线体正文，营造阅读感
```css
font-family: 'Times New Roman', serif; font-size: 20px; font-weight: 400; line-height: 1.4; color: #000000; max-width: 680px; margin: 0 auto;
```
