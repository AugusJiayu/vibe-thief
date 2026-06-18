---
schema: "vibe-thief/1.0"
source: "https://www.accio-ai.com/work"
extracted_at: "2026-06-17T15:37:53.916Z"
confidence: 0.8
generator: "vibe-thief@0.1.0"
mood: "专业、清晰、高效"
style_archetype: "light-saas"
---


# Design System: Accio-ai

## Design Narrative

这是一个为B端工具场景设计的视觉系统，核心是在清晰、专业的基础上建立可信赖感。设计语言克制而高效，通过精心的排版层级和一致的间距韵律，引导用户快速理解复杂信息。绿色作为唯一的信号色，仅在关键时刻出现，确保了界面的安静和专注。

**风格关键词**: `专业` `清晰` `可信赖` `高效` `克制`

## Visual Vocabulary

### 色彩哲学
色彩策略服务于“清晰”与“聚焦”。背景采用近乎无色的白与浅灰，为内容提供安静的画布。文字层级明确，通过灰度的微妙变化（#222到#767676）构建信息优先级，而非使用多种颜色。唯一的例外是信号绿，它像聚光灯，只打在最重要的交互点上。

### 排版哲学
排版系统旨在建立清晰的视觉层级。使用单一无衬线字体家族（Alibaba_B2B_Sans），确保跨平台一致性和专业感。字号从14px到48px，形成明显的阶梯。标题使用粗体（600-700）建立权威感，正文使用常规体（400）保证易读性。行高随字号增大而收紧，使大标题更凝聚有力。

### 留白哲学
基于4px的倍数系统，创造一致而有节奏的留白。策略是“呼吸在组件之间，而非之内”：组件内部（如按钮、输入框）使用紧凑的8-12px padding，保证信息密度；组件之间则使用16-24px甚至更大的间距，让界面有呼吸感，帮助用户区分信息模块。

### 深度哲学
深度表达非常克制。优先使用微妙的阴影（sm, md）和1px的浅色边框来划分层级，而不是依赖厚重的边框或强烈的立体感。圆角统一使用柔和的4-12px，避免直角带来的生硬感。焦点状态使用信号色边框，这是除主按钮外唯一使用强烈色彩边框的地方，以确保无障碍访问。

## Design Tokens

### Colors

#### Background Layers（表达页面深度结构）
| Token | Value | Usage |
|-------|-------|-------|
| `bg-surface` | `#ffffff` | 主背景，所有卡片、模态框、内容区的基底 |
| `bg-dim` | `#f4f4f4` | 次级背景，用于侧边栏、非活动区域或与主内容形成对比 |

#### Signal Colors（仅用于需要用户注意的地方）
| Token | Value | Usage |
|-------|-------|-------|
| `signal-primary` | `#10b981` | 仅用于：1. 主要操作按钮（CTA）；2. 选中/激活态；3. 成功状态的图标或文本。滥用会削弱其指引力。 |
| `signal-primary-hover` | `#059669` | 主按钮和主要交互元素的hover状态，提供明确的交互反馈。 |
| `signal-primary-light` | `#ecfdf5` | 信号色的浅底色，用于标签、徽章或需要轻微强调的区域背景，不用于大面积。 |

#### Text Hierarchy
| Token | Value | Usage |
|-------|-------|-------|
| `text-primary` | `#222222` | 页面标题、核心内容标题、重要数据 |
| `text-secondary` | `#444444` | 正文、描述性文本、表单标签 |
| `text-muted` | `#666666` | 占位符、非关键说明、禁用态文本 |
| `text-helper` | `#767676` | 极辅助信息，如脚注、元数据、极次要提示 |
| `text-disabled` | `#767676` | 明确的禁用状态文本 |

### Typography

#### Font Stack
| Role | Family |
|------|--------|
| Heading | `"Alibaba_B2B_Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif` |
| Body | `"Alibaba_B2B_Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif` |
| Code | `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace` |

#### Type Scale
| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| `text-xs` | `14px` | 400 | 辅助说明、元数据、标签 |
| `text-sm` | `16px` | 400 | 正文基准尺寸，适用于所有主要段落文本 |
| `text-base` | `18px` | 400 | 介绍性段落、需要稍作强调的正文 |
| `text-lg` | `28px` | 600 | 卡片标题、小节标题（H3, H4） |
| `text-xl` | `30px` | 600 | 主要章节标题（H2, H3） |
| `text-2xl` | `36px` | 700 | 大章节标题（H2） |
| `text-3xl` | `48px` | 700 | 页面主标题（H1），用于确立页面主题 |

### Spacing

Base: `4px`

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | `4px` | 极小间距，图标与文字、紧凑元素内部 |
| `space-2` | `8px` | 组件内部标准间距，如按钮内边距、输入框内文字留白 |
| `space-3` | `12px` | 相关内容组间距，如表单标签与输入框、列表项间 |
| `space-4` | `16px` | 标准组件间距，如卡片内边距、模块内元素间 |
| `space-5` | `20px` | 中等区块间距 |
| `space-6` | `24px` | 主要区块间距，如不同卡片之间、页面主要分区 |
| `space-8` | `32px` | 大区块间距，用于分隔独立的功能模块 |
| `space-12` | `48px` | 页面级大间距，如页眉与内容、主要章节之间 |

### Depth & Hierarchy

#### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | `4px` | 标签、小按钮、输入框等微小组件 |
| `radius-md` | `8px` | 标准卡片、对话框、大部分组件 |
| `radius-lg` | `12px` | 较大卡片或需要更柔和视觉效果的容器 |
| `radius-full` | `9999px` | 胶囊形标签、圆形按钮、头像 |

#### Shadows
| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` | 极其轻微的提升，用于hover态或微小组件 |
| `shadow-md` | `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)` | 标准卡片、下拉菜单的默认阴影 |
| `shadow-lg` | `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)` | 模态框、弹出窗口等需要强烈层级分离的元素 |
| `shadow-xl` | `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)` | 极少数顶层浮层 |

#### Borders
| Token | Value | Usage |
|-------|-------|-------|
| `border-default` | `1px solid #dddddd` | 卡片、输入框、分隔线的标准边框 |
| `border-focus` | `2px solid #10b981` | 可交互元素获得焦点时的轮廓，使用信号色确保可访问性 |

### Motion

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `motion-fast` | `150ms` | `cubic-bezier(0.4, 0, 0.2, 1)` | 即时的交互反馈，如按钮颜色变化、勾选框激活 |
| `motion-normal` | `250ms` | `cubic-bezier(0.4, 0, 0.2, 1)` | 常规过渡，如面板展开/收起、内容切换 |
| `motion-slow` | `400ms` | `cubic-bezier(0.4, 0, 0.2, 1)` | 更流畅或更复杂的动画，如页面转场、大型组件变形 |

> 动效追求“干脆的确认感”。所有缓动都基于 `cubic-bezier(0.4, 0, 0.2, 1)`（ease-in-out的变体），开头和结尾都比较干脆，没有过多的回弹或余韵。速度分三级，绝大多数交互（hover, click）使用150ms的快速反馈，确保界面响应灵敏。

## Motion Language

### 滚动行为
无特殊滚动行为，标准浏览器原生滚动。

### 交互反馈
hover：信号色按钮/链接颜色变深（从#10b981到#059669），150ms内完成。focus：显示2px宽的绿色（#10b981）轮廓，轮廓偏移2-3px。active：可能伴有轻微的压下效果（如1px的位移或阴影变化），强调“按下”感。

### 页面转场
无页面级转场，假设为传统多页面应用或客户端路由，内容切换时可能有轻微的淡入效果（250ms）。

### 微交互
loading状态可能使用信号色的进度条或微动效。toast通知可能从顶部或侧边滑入，停留一段时间后淡出。tooltip瞬时出现，无动画。

### 动效性格
> 务实且高效。动效的唯一目的是提供清晰的视觉反馈，而不是装饰。速度偏快（150-250ms为主），缓动曲线统一且干脆，旨在让用户感觉到界面的即时响应和可靠。

## Visual Language

### 布局哲学
遵循12列网格系统，最大宽度1320px。布局强调水平对齐和垂直节奏，内容块之间通过一致的间距（16-24px）组织，创造整洁、有序的视觉流。信息密度“舒适”，既不空旷也不拥挤，旨在降低用户的认知负荷。

### 图像使用
数据中未体现明确的图像风格。在工具类产品中，预期以功能性图标、数据图表和用户头像为主，少用装饰性场景图。

### 图标风格
根据交互描述推断，应为线性（line）风格，线宽适中，圆角端点，与整体圆润、清晰的风格一致。

### 信息密度
中等密度。每屏可能承载多个功能卡片或数据表格，但通过充足的内边距和区块间距来保持可读性，避免信息过载。

### 品牌个性
`可靠` `高效` `专注` `清晰` `专业`

## Component Patterns

### Button

界面中的主要行动召唤元素，风格扁平、圆角，依赖颜色和微妙的阴影变化区分层级和状态。

**Default:**
| Property | Value |
|----------|-------|
| bg | `#ffffff` |
| color | `#444444` |
| border | `1px solid #dddddd` |
| border-radius | `8px` |
| height | `36px` |

**Hover:**
| Property | Value |
|----------|-------|
| bg | `#f4f4f4` |
| color | `#222222` |

**Focus:**
| Property | Value |
|----------|-------|
| outline | `2px solid #10b981` |
| outline-offset | `2px` |

**Active:**
| Property | Value |
|----------|-------|
| transform | `translateY(1px)` |
| box-shadow | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` |

**Variants:**
- **Primary**: bg: `#10b981`, color: `#ffffff`, border: `none`
- **Ghost**: bg: `transparent`, color: `#444444`, border: `1px solid transparent`

## Interaction Patterns

| State | Style |
|-------|-------|
| Hover | 颜色和背景的温和变化。主要交互元素（按钮、链接）会变为更深的同色系（如绿色变深）或更浅的背景色（如白卡片悬停时变灰）。变化在150ms内完成。 |
| Focus | 清晰的可访问性轮廓。所有可聚焦元素在键盘导航时显示2px宽的绿色（#10b981）轮廓，轮廓与元素保持约2px的偏移，确保在不同背景上都清晰可见。 |
| Active | 模拟物理“按压”感。通常表现为轻微的向下位移（1px）和/或阴影减弱，给予用户“触发成功”的即时反馈。 |
| Loading | 使用信号色（绿色）进行反馈，可能是按钮内文字变为加载动画（如三点循环），或独立的进度条。 |
| Transition | 快速（150ms）用于状态反馈（hover, active），正常（250ms）用于尺寸/位置变化（展开收起）。 |

## Layout

采用经典的12列网格，便于创建对齐一致的多列布局（如仪表板）。最大宽度1320px确保在宽屏显示器上内容依然集中、可读。24px的列间距与整体间距系统协调，提供统一的呼吸感。

| Property | Value |
|----------|-------|
| Max Width | `1320px` |
| Grid Columns | 12 |
| Grid Gap | `24px` |

### Breakpoints
| Name | Min Width |
|------|-----------|
| `sm` | `640px` |
| `md` | `768px` |
| `lg` | `1024px` |
| `xl` | `1280px` |
| `2xl` | `1320px` |

## Agent Usage Guide

### ✅ Do
- 始终将信号绿色（#10b981）保留给最重要的交互（如主按钮）和成功状态。
- 使用设计好的文字层级（#222222 -> #767676）来构建信息优先级，而不是用颜色。
- 保持8px的基准间距习惯：组件内部用8或12的倍数，组件之间用16、24、32的倍数。
- 给所有可聚焦元素设置清晰的绿色轮廓（2px solid #10b981）以确保无障碍访问。
- 使用150ms作为默认的交互反馈过渡时间。

### ❌ Don't
- 不要将信号绿色用于大面积背景或装饰性元素，这会削弱其指示作用。
- 不要使用过于复杂的阴影，保持阴影柔和、克制（主要使用sm和md）。
- 不要混用多种字体，坚持使用阿里巴巴普惠体（或其替代方案）。
- 不要打破4px为基准的间距系统，避免使用如10px、15px等‘不整齐’的值。
- 不要为纯装饰目的添加动效，所有动画都应有明确的功能目的（如反馈、引导注意力）。

### Code Snippets

**创建主操作按钮** — 使用信号色背景，无边框，白色文字。hover时变深，focus时显示绿色轮廓。
```css
background: #10b981; color: #ffffff; border: none; border-radius: 8px; height: 36px; transition: background 150ms; &:hover { background: #059669; } &:focus-visible { outline: 2px solid #10b981; outline-offset: 2px; }
```

**创建内容卡片** — 白色背景，1px浅灰边框，8px圆角，中等阴影。内边距使用16px。
```css
background: #ffffff; border: 1px solid #dddddd; border-radius: 8px; padding: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
```

**设置页面主布局** — 使用12列网格，最大宽度1320px居中，列间距24px。
```css
max-width: 1320px; margin: 0 auto; display: grid; grid-template-columns: repeat(12, 1fr); gap: 24px;
```
