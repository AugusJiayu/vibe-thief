---
schema: "vibe-thief/1.0"
source: "https://www.apple.com.cn"
extracted_at: "2026-06-17T15:14:53.867Z"
confidence: 0.92
generator: "vibe-thief@0.1.0"
mood: "professional, immersive"
style_archetype: "immersive-landing"
---


# Design System: Apple

## Design Narrative

设计遵循克制与聚焦的哲学。通过极简的界面元素（如纯文字导航、药丸形按钮）和高保真的沉浸式视觉内容，将用户的注意力完全引导至产品本身。界面是安静的画布，产品是舞台上的主角，每处交互都为了强化产品价值与高级感。

**风格关键词**: `沉浸式` `克制` `产品聚焦` `精致` `叙事驱动`

## Visual Vocabulary

### 色彩哲学
色彩策略极度克制。大面积使用中性色（#1d1d1f， #6e6e73， #ffffff， #f5f5f7）构建冷静、专业的基调。唯一的‘信号’——品牌蓝(#0071e3)——被严格限制在需要用户立即注意的交互点上，如主操作和焦点指示器。这种稀缺性使其成为真正的强引导信号。

### 排版哲学
统一使用 SF Pro 字体家族，传达纯粹的现代感和系统级一致性。字号 scale 从 12px 到 44px，跨度较大，专为沉浸式叙事设计：常规页面内容使用可读性强的 17px 基础字号，而英雄区域则使用 40-44px 的巨大字号形成视觉冲击。字重主要通过 400 (Regular) 和 600 (Semi-Bold) 来区分层级，避免使用过重的字重破坏轻盈感。

### 留白哲学
间距策略服务于‘呼吸感’。基础单位为 4px，但 scale 中包含非严格倍数（如9px， 11px），表明实际应用中允许基于内容微调，追求视觉平衡而非数学严格性。大量留白（通常为 24px 及以上）被用在组件之间和区块之间，创造开阔、从容的布局节奏。

### 深度哲学
深度表达极为克制，几乎不使用阴影。层级关系主要通过背景色的微妙差异（如白色与#f5f5f7）和充足的留白来实现，营造出干净、平面且高级的视觉感受。圆角（border-radius）具有明确的功能指向：药丸形是CTA按钮的标识性特征，而其他元素的圆角则保持适度、不张扬。

## Design Tokens

### Colors

#### Background Layers（表达页面深度结构）
| Token | Value | Usage |
|-------|-------|-------|
| `bg-canvas` | `#ffffff` | 页面主背景，提供最干净的基底 |
| `bg-surface` | `#f5f5f7` | 卡片、信息区块等需要轻微分层的表面 |

#### Signal Colors（仅用于需要用户注意的地方）
| Token | Value | Usage |
|-------|-------|-------|
| `signal-primary` | `#0071e3` | 唯一的强信号色，仅用于主按钮、关键链接和焦点状态，确保这些元素从大量留白和中性色调中脱颖而出。 |

#### Text Hierarchy
| Token | Value | Usage |
|-------|-------|-------|
| `text-primary` | `#1d1d1f` | 标题和正文，高对比度确保在浅色背景下的最佳可读性。 |
| `text-secondary` | `#6e6e73` | 副标题、标签、说明文字，与主文字形成明确的层级。 |
| `text-tertiary` | `#86868b` | 占位符、禁用状态文字、非必要辅助信息。 |
| `text-disabled` | `#86868b` | 仅用于交互元素的禁用态，降低视觉重要性。 |

### Typography

#### Font Stack
| Role | Family |
|------|--------|
| Heading | `SF Pro SC, -apple-system, BlinkMacSystemFont, sans-serif` |
| Body | `SF Pro SC, -apple-system, BlinkMacSystemFont, sans-serif` |
| Code | `SF Mono, monospace` |

#### Type Scale
| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| `text-caption` | `12px` | 400 | 脚注、极小标签、版权信息 |
| `text-small` | `13.3333px` | 400 | 输入框提示文字、紧凑型UI内部文字 |
| `text-body` | `17px` | 400 | 默认段落文字，确保舒适的阅读行高 (line-height: 28px) |
| `text-subheading` | `21px` | 400 | 强调性段落或小节标题 |
| `text-heading-3` | `24px` | 600 | 三级标题 |
| `text-heading-2` | `28px` | 600 | 二级标题 |
| `text-heading-1` | `34px` | 600 | 页面主标题 |
| `text-display` | `40px` | 600 | 英雄区域的大标题、展示性文字 |
| `text-hero` | `44px` | 600 | 最大尺寸的展示文字，用于沉浸式首屏 |

### Spacing

Base: `4px`

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | `2px` | 最小间距，用于内联元素的微调 |
| `space-2` | `4px` | 组件内部最小间距 |
| `space-3` | `6px` | 紧凑组件内部间距 |
| `space-4` | `8px` | 组件内部标准间距（如按钮内边距） |
| `space-5` | `9px` | 特定场景下的精细间距 |
| `space-6` | `11px` | 特定场景下的精细间距 |
| `space-7` | `14px` | 组件与相关元素间的标准间距 |
| `space-8` | `18px` | 主要区块间的分隔间距 |

### Depth & Hierarchy

#### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | `4px` | 小卡片、标签等需要轻微圆润感的元素 |
| `radius-md` | `8px` | 中等卡片、对话框 |
| `radius-lg` | `12px` | 大型卡片或面板 |
| `radius-pill` | `9999px` | 主要行动按钮（CTA），标志性的药丸形状，塑造友好、现代的形象 |

#### Shadows
| Token | Value | Usage |
|-------|-------|-------|
| `shadow-none` | `none` | 默认状态，界面元素通过留白和背景色差建立层级，完全依赖平面设计语言。 |

#### Borders
| Token | Value | Usage |
|-------|-------|-------|
| `border-subtle` | `1px solid #d2d2d7` | 用于需要极轻度分隔的地方，如下拉菜单、表格行 |
| `border-default` | `1px solid #e8e8ed` | 表单输入框的默认边框，非常不显眼 |

### Motion

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `motion-fast` | `200ms` | `cubic-bezier(0.4, 0, 0.6, 1)` | 简单的状态变化，如按钮 hover 颜色变化 |
| `motion-normal` | `300ms` | `ease-in-out` | 大多数UI过渡，如菜单展开、面板滑入 |
| `motion-slow` | `400ms` | `ease-in-out` | 更大范围的页面内滚动动画或关键转场 |

> 动效追求精致、平滑和有目的性的感觉。时间偏慢（200-400ms），缓动曲线以 `ease-in-out` 为主，强调开始和结束时的从容感。动效不用于吸引注意力，而是为了确认交互、平滑状态转换和提升操作过程的流畅度与高级感。

## Motion Language

### 滚动行为
平滑滚动（smooth scroll）是基础。当页面包含大型视觉区块时，滚动会触发图像的轻微视差效果（parallax）或元素的渐入（fade-in）动画，以增强叙事节奏和沉浸感。

### 交互反馈
hover 交互以缓慢、温和的变化为主：按钮背景色会缓慢（300-400ms ease-in-out）地从白色变为灰色（如 #f5f5f7），或链接文字颜色缓慢变深。focus 状态使用品牌蓝的 outline 进行清晰标识。active 状态反馈不明显，保持整体的平静感。

### 页面转场
页面间的切换通常是硬切（hard cut），没有花哨的转场动画，以保证性能和直接感。但在同一页面内，不同区块的出现会采用滚动触发的渐入动画。

### 微交互
loading 状态倾向于使用简洁的旋转动画或进度条，颜色单一（灰色或蓝色）。tooltip 和 toast 的出现/消失动画是简单的淡入淡出，速度中等。

### 动效性格
> 整体动效性格是‘从容的确认者’。它不急不缓，用平滑的过渡告诉用户‘你的操作已被接收’，而非‘看我看我’。它服务于内容，通过微妙的运动来提升浏览体验的流畅感和高级感，绝不喧宾夺主。

## Visual Language

### 布局哲学
布局极度稀疏，信息密度低。采用中心对齐的叙事流，每屏通常只承载1-2个核心信息单元（如一个大标题+一张大图，或一组产品特性）。通过巨大的垂直留白（80-120px以上）来划分章节，将用户的视线强制聚焦于当前屏幕的视觉重心——通常是高质量的产品图或简洁的标语。

### 图像使用
产品图使用高精度渲染或真实场景摄影，构图精致，光线柔和自然，突出产品的质感和细节。图片通常占据大面积甚至全屏，成为视觉主导。避免复杂的边框或装饰，让图像本身说话。

### 图标风格
无明显图标体系。界面极度精简，大部分功能通过文字链或按钮文本表达。如果使用图标，会是线性（outline）、极其简洁的风格，与整体克制氛围一致。

### 信息密度
极低密度。这是一种为沉浸式体验和品牌叙事服务的设计，而非信息密集型工具。大量留白不是浪费空间，而是构建高级感、专注度和呼吸感的核心手段。

### 品牌个性
`专业` `简约` `沉浸式` `高级` `自信`

## Component Patterns

### Button (CTA)

主要行动按钮，是页面上少数使用信号色的强引导元素。

**Default:**
| Property | Value |
|----------|-------|
| bg | `#0071e3` |
| color | `#ffffff` |
| border-radius | `9999px` |
| height | `36px` |
| padding | `0 24px` |
| font-size | `17px` |
| font-weight | `600` |
| transition | `background-color 300ms ease-in-out` |

**Hover:**
| Property | Value |
|----------|-------|
| bg | `#0077ed` |

**Focus:**
| Property | Value |
|----------|-------|
| outline | `3px solid rgba(0, 113, 227, 0.3)` |

**Active:**
| Property | Value |
|----------|-------|
| bg | `#006edb` |

**Variants:**
- **Secondary**: bg: `transparent`, color: `#0071e3`, border: `1px solid #0071e3`
- **Text**: bg: `transparent`, color: `#0071e3`, border: `none`, padding: `0 10px`, height: `auto`

### Navigation Bar

顶部导航，极其简约，纯文字导航，与背景融为一体。

**Default:**
| Property | Value |
|----------|-------|
| bg | `rgba(255, 255, 255, 0.8)` |
| backdrop-filter | `saturate(180%) blur(20px)` |
| height | `44px` |
| padding | `0 24px` |
| font-size | `12px` |
| color | `#1d1d1f` |

**Hover:**
| Property | Value |
|----------|-------|
| color | `#0071e3` |

### Content Section

一个内容区块，通常包含标题、描述和可能的媒体，用于滚动叙事。

**Default:**
| Property | Value |
|----------|-------|
| padding | `80px 24px` |
| max-width | `930px` |
| margin | `0 auto` |

## Interaction Patterns

| State | Style |
|-------|-------|
| Hover | 温和且克制。文本链接 hover 时，文字颜色从 #1d1d1f 缓慢过渡到 #0071e3。按钮 hover 时，背景色发生微妙变亮或变暗（如白变灰），过程平滑（300-400ms）。目标是提供可感知的反馈，而非突兀的跳动。 |
| Focus | 清晰、可访问。使用 3px 宽度的蓝色（#0071e3）虚线 outline 进行标识，与品牌色一致，确保键盘用户的可访问性。outline 偏移量足够，不与元素本身粘连。 |
| Active | 反馈非常轻微，通常仅比 hover 状态颜色再深一点，或有一个几乎不可察觉的 scale(0.98) 变化。目的是确认操作，而非庆祝。 |
| Loading | 使用简洁的UI反馈，如按钮内出现旋转的 loading 图标（颜色与按钮文字一致），或使用进度条。避免大型、炫酷的加载动画。 |
| Transition | 中等偏慢（300-400ms）是主流。使用 ease-in-out 曲线，营造平滑、从容的感觉。 |

## Layout

布局采用中心对齐（center-aligned）的内容流，最大宽度限制在 930px，确保在大屏上文本行长度仍然易于阅读。12列网格系统提供灵活性，但实际内容常采用单列或两列的宽松布局，大量空间留给留白和视觉内容。

| Property | Value |
|----------|-------|
| Max Width | `930px` |
| Grid Columns | 12 |
| Grid Gap | `24px` |

### Breakpoints
| Name | Min Width |
|------|-----------|
| `sm` | `320px` |
| `md` | `834px` |
| `lg` | `1024px` |

## Agent Usage Guide

### ✅ Do
- 将 #0071e3 作为神圣的信号色，只用于主按钮、重要链接和焦点指示器，其他交互元素使用中性色。
- 充分利用白色 (#ffffff) 和浅灰 (#f5f5f7) 的层次差来构建界面深度，放弃使用阴影。
- 字体大小大胆地使用从 34px 到 44px 的标题，与 17px 的正文形成鲜明对比，营造叙事感。
- 保持极大的垂直留白（80px+），让每个内容区块都像呼吸一样独立且从容。
- 所有按钮尽量采用药丸形 (border-radius: 9999px) 设计，这是该风格的标志之一。

### ❌ Don't
- 不要在非关键路径上使用 #0071e3，避免信号疲劳。
- 不要使用 box-shadow 来创造层级，应通过背景色和留白。
- 不要让界面元素显得拥挤，宁可少放内容，也要保证留白。
- 避免使用过于花哨或快速的动效，所有过渡都应平滑、克制。
- 不要在导航或辅助按钮上使用强烈的背景色，保持它们的低调和文字化。

### Code Snippets

**创建主行动按钮 (CTA Button)** — 使用信号色背景、白色文字、药丸形圆角和适中的内边距。
```css
background-color: #0071e3; color: #ffffff; border: none; border-radius: 9999px; height: 36px; padding: 0 24px; font-size: 17px; font-weight: 600; transition: background-color 300ms ease-in-out;
```

**创建一个内容区块 (Content Section)** — 使用大量上下内边距和居中的最大宽度容器来创造呼吸感。
```css
padding: 80px 24px; max-width: 930px; margin: 0 auto;
```

**设置基础页面布局** — 使用系统字体栈、白色的画布背景和居中对齐的内容。
```css
font-family: 'SF Pro SC', -apple-system, BlinkMacSystemFont, sans-serif; background-color: #ffffff; color: #1d1d1f; line-height: 1.47;
```
