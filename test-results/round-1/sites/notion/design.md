---
schema: "vibe-thief/1.0"
source: "https://notion.so"
extracted_at: "2026-06-17T10:10:53.320Z"
confidence: 0.7
generator: "vibe-thief@0.1.0"
mood: "专业、清晰、可靠"
style_archetype: "light-saas"
---


# Design System: Notion

## Design Narrative

这个设计系统的灵魂在于通过克制的视觉语言建立信任感。它不是要炫技，而是创造一个干净、专注的画布，让用户的内容和操作成为主角。中性色是这个画布的基调，而唯一的强信号色——橙色——就像聚光灯，只在最需要用户注意力的关键时刻亮起。排版追求清晰易读，但通过细微的字号和行高变化建立层次，让信息自然流动。

**风格关键词**: `克制` `清晰` `信任` `专注` `结构化`

## Visual Vocabulary

### 色彩哲学
色彩策略的核心是“少即是多”。整个系统建立在从近白到深灰的暖色系中性色谱之上，通过微妙的色阶差异构建空间深度，而非依赖强烈的阴影。唯一的强信号色——橙色(#ff6d00)——被严格限制用途，只用于最关键的操作点和状态，确保它每次出现都能被用户立即识别。文字颜色通过透明度控制层级，从100%到40%，清晰地表达了信息的重要性梯度。

### 排版哲学
排版系统追求极致的清晰和可读性。字体栈以通用无衬线体Inter为核心，确保跨平台的一致性。字号阶梯并非严格的数学比例，而是根据阅读舒适度和信息层级精心调整。行高宽松，为文本留出呼吸空间。字体粗细(w300, w400, w500, w600, w700)与字号明确对应，共同构建出清晰、稳定且有节奏感的视觉层次，避免花哨的字体效果。

### 留白哲学
间距系统基于4px网格，确保所有尺寸和定位都保持像素级的精确对齐。策略是“呼吸在组件之间，而非组件之内”。组件内部使用8-12px的紧凑间距保持内聚性，而组件之间则使用16-24px或更大的间距来创造清晰的视觉分离和流动的布局节奏。通过阶梯式的空间分配，页面自然形成了从紧凑到舒展的呼吸节奏。

### 深度哲学
深度和层级表达主要依靠背景色阶的细微差异和柔和的阴影，而非粗重的边框。阴影被设计得非常柔和，旨在模拟自然光照下的轻微抬升效果，而不是制造强烈的3D感。边框颜色与背景色系保持一致，非常克制，主要用于定义元素的物理边界（如输入框）或对内容进行轻量分组。圆角(radius)的使用遵循“越重要/越大，圆角越明显”的原则。

## Design Tokens

### Colors

#### Background Layers（表达页面深度结构）
| Token | Value | Usage |
|-------|-------|-------|
| `bg-page` | `#f9f9f8` | 页面最底层背景，营造温暖、不刺眼的阅读环境 |
| `bg-surface` | `#f6f5f4` | 卡片、侧边栏等需要轻微抬起的元素背景，与页面背景有细微色差 |
| `bg-elevated` | `#ffffff` | 模态框、弹出层等最高层级的表面（如需要更白） |

#### Signal Colors（仅用于需要用户注意的地方）
| Token | Value | Usage |
|-------|-------|-------|
| `signal-primary` | `#ff6d00` | 主CTA按钮、重要链接、需要用户立即注意的标记（如“新”）。这是系统中唯一的强烈视觉焦点。 |
| `signal-warning` | `#ff6d00` | 警告状态、需要注意的提示。复用主信号色以保持统一。 |
| `signal-error` | `#f64932` | 错误状态、破坏性操作确认。 |
| `signal-success` | `#1aae39` | 成功状态、正向反馈。 |
| `signal-info` | `#097fe8` | 信息性提示、帮助链接。 |

#### Text Hierarchy
| Token | Value | Usage |
|-------|-------|-------|
| `text-heading` | `#111111` | 页面主标题、最重要的信息。 |
| `text-body` | `rgb(17 17 17)` | 正文内容，高可读性。 |
| `text-secondary` | `rgb(0 0 0 / 60%)` | 副标题、辅助说明、标签。 |
| `text-tertiary` | `rgb(0 0 0 / 40%)` | 占位符文本、禁用状态文字、最次要的信息。 |

### Typography

#### Font Stack
| Role | Family |
|------|--------|
| Heading | `NotionInter, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, 'Apple Color Emoji', Arial, sans-serif, 'Segoe UI Emoji', 'Segoe UI Symbol'` |
| Body | `NotionInter, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, 'Apple Color Emoji', Arial, sans-serif, 'Segoe UI Emoji', 'Segoe UI Symbol'` |
| Code | `'iA Writer Mono', Nitti, Menlo, Courier, monospace` |

#### Type Scale
| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| `text-xs` | `12px` | 400 | 小标签、注释、辅助信息 |
| `text-sm` | `14px` | 400 | 次要内容、列表项、按钮文字 |
| `text-base` | `16px` | 400 | 正文默认尺寸，最佳阅读体验 |
| `text-lg` | `18px` | 400 | 引导性段落、副标题 |
| `text-xl` | `22px` | 500 | 区块标题、卡片标题 |
| `text-2xl` | `26px` | 600 | 页面子标题 |
| `text-3xl` | `32px` | 700 | 主要章节标题 |
| `text-4xl` | `42px` | 700 | 页面大标题 |
| `text-5xl` | `54px` | 700 | 首屏英雄区大标题 |
| `text-6xl` | `64px` | 700 | 超大展示文字 |

### Spacing

Base: `4px`

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | `4px` | 极小间距，用于图标与文字之间、紧凑列表的行间距 |
| `space-2` | `8px` | 组件内部元素的标准间距，如输入框的内边距 |
| `space-3` | `12px` | 次级间距，用于相关元素的分组 |
| `space-4` | `16px` | 组件内部的标准内边距，或相邻组件之间的基础间距 |
| `space-6` | `24px` | 组件之间的标准间距，创造清晰的区块分离 |
| `space-8` | `32px` | 较大区块之间的间距 |
| `space-12` | `48px` | 页面级内容区块的间距 |
| `space-20` | `80px` | 首屏或重要章节之间的间距，创造强烈的节奏感 |

### Depth & Hierarchy

#### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | `4px` | 小元素，如标签、小型按钮 |
| `radius-md` | `6px` | 中等元素，如输入框、中型按钮 |
| `radius-lg` | `8px` | 标准卡片、主要按钮 |
| `radius-xl` | `12px` | 大型卡片、模态框 |
| `radius-full` | `624.9375rem` | 圆形，如头像、图标按钮 |

#### Shadows
| Token | Value | Usage |
|-------|-------|-------|
| `shadow-subtle` | `0px 0.7px 1.462px 0px rgb(0% 0% 0%/0.015), 0px 3px 9px 0px rgb(0% 0% 0%/0.03)` | 卡片悬停、下拉菜单出现时的轻微抬升效果 |
| `shadow-dropdown` | `0px 0.175px 1.041px 0px rgb(0% 0% 0%/0.013), 0px 0.8px 2.925px 0px rgb(0% 0% 0%/0.02), 0px 2.025px 7.847px 0px rgb(0% 0% 0%/0.027), 0px 4px 18px 0px rgb(0% 0% 0%/0.04)` | 下拉框、弹出菜单、Toast通知 |
| `shadow-modal` | `0px 0.667px 3.502px 0px rgb(0% 0% 0%/0.0096), 0px 2.933px 7.252px 0px rgb(0% 0% 0%/0.0157), 0px 7.2px 14.462px 0px rgb(0% 0% 0%/0.02), 0px 13.867px 28.348px 0px rgb(0% 0% 0%/0.0243), 0px 23.333px 52.123px 0px rgb(0% 0% 0%/0.0304), 0px 36px 89px 0px rgb(0% 0% 0%/0.04)` | 模态对话框、全屏覆盖层 |

#### Borders
| Token | Value | Usage |
|-------|-------|-------|
| `border-subtle` | `1px solid #dfdcd9` | 卡片边框、分隔线、输入框默认边框 |
| `border-strong` | `2px solid #dfdcd9` | 需要强调的容器边框 |
| `border-focus` | `1px solid #097fe8` | 输入框、按钮聚焦状态 |

### Motion

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `motion-fast` | `150ms` | `cubic-bezier(0.42, 0, 1, 1)` | 微交互反馈，如hover效果、开关切换 |
| `motion-normal` | `250ms` | `cubic-bezier(0.45, 0, 0.55, 1)` | 常规状态过渡，如展开/折叠、面板滑入 |
| `motion-slow` | `300ms` | `cubic-bezier(0, 0, 0.58, 1)` | 页面级动画，如模态框出现 |

> 动效策略是“快速且有意义”。动效的主要目的是提供即时的状态反馈（如按钮按下）和流畅的界面过渡（如面板打开），而不是成为装饰。所有动效都采用简洁的缓动曲线，避免弹跳或过度夸张的物理效果，以保持界面的专业感和响应速度。

## Component Patterns

### Button

核心交互元素，根据重要性分为不同层级。

**Default:**
| Property | Value |
|----------|-------|
| bg | `#f6f5f4` |
| color | `#111111` |
| border-radius | `8px` |
| height | `36px` |
| padding | `0 16px` |
| font-size | `14px` |
| font-weight | `500` |

**Hover:**
| Property | Value |
|----------|-------|
| bg | `#dfdcd9` |
| color | `#111111` |

**Focus:**
| Property | Value |
|----------|-------|
| outline | `2px solid #097fe8` |
| outline-offset | `2px` |

**Active:**
| Property | Value |
|----------|-------|
| bg | `#a39e98` |

**Disabled:**
| Property | Value |
|----------|-------|
| opacity | `0.4` |
| cursor | `not-allowed` |

**Variants:**
- **Primary**: bg: `#ff6d00`, color: `#ffffff`, hover-bg: `#e56200`
- **Secondary**: bg: `transparent`, border: `1px solid #dfdcd9`, color: `#111111`
- **Ghost**: bg: `transparent`, color: `#78736f`, hover-bg: `#f6f5f4`

### Input

文本输入框，用于表单数据收集。

**Default:**
| Property | Value |
|----------|-------|
| bg | `#ffffff` |
| color | `#111111` |
| border | `1px solid #dfdcd9` |
| border-radius | `6px` |
| height | `36px` |
| padding | `0 12px` |
| font-size | `14px` |

**Hover:**
| Property | Value |
|----------|-------|
| border-color | `#a39e98` |

**Focus:**
| Property | Value |
|----------|-------|
| border-color | `#097fe8` |
| box-shadow | `0 0 0 2px rgba(9, 127, 232, 0.15)` |

**Disabled:**
| Property | Value |
|----------|-------|
| bg | `#f6f5f4` |
| color | `#a39e98` |
| cursor | `not-allowed` |

### Card

内容容器，用于信息分组和视觉分离。

**Default:**
| Property | Value |
|----------|-------|
| bg | `#ffffff` |
| border | `1px solid #dfdcd9` |
| border-radius | `12px` |
| padding | `24px` |
| shadow | `none` |

**Hover:**
| Property | Value |
|----------|-------|
| shadow | `0px 0.7px 1.462px 0px rgb(0% 0% 0%/0.015), 0px 3px 9px 0px rgb(0% 0% 0%/0.03)` |

**Focus:**
| Property | Value |
|----------|-------|
| outline | `none` |

### NavigationItem

侧边栏或顶部导航中的链接项。

**Default:**
| Property | Value |
|----------|-------|
| bg | `transparent` |
| color | `#494744` |
| padding | `8px 12px` |
| border-radius | `6px` |

**Hover:**
| Property | Value |
|----------|-------|
| bg | `#f6f5f4` |
| color | `#111111` |

**Active:**
| Property | Value |
|----------|-------|
| bg | `#f6f5f4` |
| color | `#111111` |
| font-weight | `600` |

## Interaction Patterns

| State | Style |
|-------|-------|
| Hover | 背景色从透明或浅灰变为稍深的灰色(#dfdcd9)，产生微妙的按压感。卡片等容器增加柔和阴影。颜色过渡平滑。 |
| Focus | 使用2px宽的蓝色(#097fe8)轮廓线，轮廓与元素本身有2px间距。输入框内部可能有淡淡的蓝色光晕。 |
| Active | 背景色进一步变暗，模拟按钮被按下的瞬间，提供坚实的触觉反馈。 |
| Loading | 使用颜色与当前背景或文字对比度适中的旋转加载器，或在按钮文字上显示“加载中...”并禁用交互。 |
| Transition | 大部分交互过渡使用150ms的ease-in曲线，确保反馈快速而不突兀。 |

## Layout

布局以内容为核心，采用居中对齐的最大宽度容器(60rem/960px)，确保在宽屏上也能保持舒适的阅读行长。12栏网格系统提供了灵活而结构化的布局能力。整体密度为“舒适型”，在信息呈现和留白之间取得平衡，让界面看起来不拥挤也不空旷。

| Property | Value |
|----------|-------|
| Max Width | `60rem` |
| Grid Columns | 12 |
| Grid Gap | `28px` |

### Breakpoints
| Name | Min Width |
|------|-----------|
| `sm` | `640px` |
| `md` | `768px` |
| `lg` | `1024px` |
| `xl` | `1280px` |

## Agent Usage Guide

### ✅ Do
- 用背景色层级(#f9f9f8 -> #f6f5f4 -> #ffffff)来表达界面深度，而非依赖浓重阴影。
- 将橙色(#ff6d00)严格限制在最重要的操作点上，如主提交按钮、关键警告。一个界面通常不超过1-2处。
- 确保文字层级清晰：标题用#111111，正文用rgb(17,17,17)，辅助信息用rgba(0,0,0,0.6)。
- 所有间距和尺寸尽量使用4px的倍数，如8px, 12px, 16px, 24px, 32px，保持网格对齐。
- 按钮、输入框等交互元素必须定义清晰的hover, focus, active, disabled状态。
- 阴影仅用于轻微的抬升效果（如卡片hover、下拉菜单），避免用于普通元素的静态状态。

### ❌ Don't
- 不要将橙色作为大面积背景色或装饰色，这会稀释其作为信号的力量。
- 不要使用过重或扩散范围过大的阴影，保持界面的轻盈和现代感。
- 不要在浅色背景上使用纯黑(#000000)文字，使用#111111或#31302e等深灰以获得更好的阅读舒适度。
- 不要随意使用边框来分隔内容，优先使用间距和背景色差。边框应非常细微且颜色协调。
- 避免使用非4px倍数的间距值，这会导致视觉上的不协调和对齐问题。
- 不要过度使用动效，所有过渡都应快速(150-300ms)且有明确的功能目的。

### Code Snippets

**创建一个主操作按钮** — 使用唯一的强信号色作为背景，白色文字，确保其在中性背景中脱颖而出。
```css
background-color: #ff6d00; color: #ffffff; border: none; border-radius: 8px; height: 36px; padding: 0 16px; font-size: 14px; font-weight: 500; cursor: pointer;
```

**创建一个信息卡片** — 使用白色背景，极其细微的边框，较大的圆角，内部通过宽松的内边距容纳内容。
```css
background-color: #ffffff; border: 1px solid #dfdcd9; border-radius: 12px; padding: 24px;
```

**创建一个文本输入框** — 白色背景，灰色边框，适中的圆角。聚焦时边框变为蓝色并带有光晕。
```css
background-color: #ffffff; border: 1px solid #dfdcd9; border-radius: 6px; height: 36px; padding: 0 12px; font-size: 14px; color: #111111;
```

**设置页面主布局** — 内容居中，最大宽度受限。主体内容与侧边栏通过网格系统并排，使用28px的间距。
```css
.container { max-width: 60rem; margin: 0 auto; } .main-layout { display: grid; grid-template-columns: 240px 1fr; gap: 28px; padding: 24px; }
```
