---
schema: "vibe-thief/1.0"
source: "https://music.163.com"
extracted_at: "2026-06-17T15:13:33.100Z"
confidence: 0.88
generator: "vibe-thief@0.1.0"
mood: "专业、活力、克制"
style_archetype: "consumer-app"
---


# Design System: Music

## Design Narrative

这是一个面向年轻音乐爱好者的设计系统。设计的核心矛盾是「专业感」与「活力感」的平衡——用深灰+白色的克制配色建立信任基础，再用红色强调色注入能量。排版以 Arial 为主保持中性，内容密度适中，给封面图和多媒体内容留出视觉呼吸空间。整体追求「功能清晰，情绪到位」的体验。

**风格关键词**: `音乐` `年轻化` `简洁` `活力` `网格秩序`

## Visual Vocabulary

### 色彩哲学
色彩策略的核心是「克制的活力」。大面积使用白色和深灰建立专业基底，红色只出现在需要用户注意的地方——主按钮、当前播放、导航激活态。如果红色到处都是，它就不再是信号了。语义色（成功、警告、错误、信息）保持标准用法，不与品牌色混淆。

### 排版哲学
排版系统保持简洁克制。使用 Arial 作为全局字体，保证跨平台一致性和可读性。字号层级只有 3 级，避免过度设计——在音乐平台中，视觉焦点应该是封面和内容本身，而非花哨的排版。标题用加粗（600-700）区分权重，正文保持 400 常规。

### 留白哲学
间距遵循 4px 基础网格，组件内部用 8px 保持紧凑但不拥挤，组件之间用 16-24px 创造呼吸感。视觉分析显示整体密度为 comfortable，意味着不要把内容塞得太满——尤其在封面图和歌曲列表之间，需要足够的留白让用户能「扫视」而非「搜索」。

### 深度哲学
层级表达主要依赖阴影而非边框。内容卡片采用无边框设计，用轻柔阴影（shadow-sm）营造浮起感，让内容区与背景区分开。只有输入框和分割线才使用边框。圆角策略是「越重要的越圆」——圆形播放按钮吸引点击，卡片用适度圆角保持现代感，分割线保持方正。

## Design Tokens

### Colors

#### Background Layers（表达页面深度结构）
| Token | Value | Usage |
|-------|-------|-------|
| `bg-page` | `#ffffff` | 页面主背景，干净明亮的基调 |
| `bg-surface` | `#f8f8f8` | 卡片、区块的背景色，与页面背景形成微妙层级差异 |

#### Signal Colors（仅用于需要用户注意的地方）
| Token | Value | Usage |
|-------|-------|-------|
| `signal-brand` | `#fe5555` | 品牌主色，用于主操作按钮、导航激活态、播放按钮等需要用户注意的地方 |
| `signal-error` | `#fe5555` | 错误状态指示（与品牌色共用，保持一致性） |
| `signal-success` | `#28a745` | 成功状态，谨慎使用，仅用于操作反馈 |
| `signal-warning` | `#ffc107` | 警告状态，如音量过高、网络中断 |
| `signal-info` | `#17a2b8` | 信息提示，如新功能引导 |

#### Text Hierarchy
| Token | Value | Usage |
|-------|-------|-------|
| `text-primary` | `#333333` | 标题、关键信息、正文主色，确保可读性 |
| `text-secondary` | `#cccccc` | 次要信息、辅助说明、占位符文字 |
| `text-disabled` | `#9b9b9b` | 禁用状态文字，降低视觉权重 |
| `text-muted` | `#787878` | 辅助文字，如标签、描述 |

### Typography

#### Font Stack
| Role | Family |
|------|--------|
| Heading | `Arial, Helvetica, sans-serif` |
| Body | `Arial, Helvetica, sans-serif` |
| Code | `Arial, Helvetica, sans-serif` |

#### Type Scale
| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| `text-xs` | `12px` | 400 | 标签、输入框文字、列表项、时间戳 |
| `text-base` | `14px` | 400 | 正文、链接、段落、导航项 |
| `text-lg` | `16px` | 400 | 大标题辅助、强调文本 |

### Spacing

Base: `4px`

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | `4px` | 图标与文字间距、紧凑元素内部 |
| `space-2` | `8px` | 列表项内间距、按钮内边距 |
| `space-3` | `12px` | 卡片内边距、中等间距 |
| `space-4` | `16px` | 区块间距、表单元素间距 |
| `space-5` | `20px` | 标题与内容间距 |
| `space-6` | `24px` | 网格列间距、区块间呼吸空间 |
| `space-7` | `28px` | 导航项高度、按钮高度 |
| `space-8` | `32px` | 大区块间距、页面边距 |

### Depth & Hierarchy

#### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| `radius-none` | `0` | 分割线、边框 |
| `radius-sm` | `4px` | 小按钮、标签 |
| `radius-md` | `8px` | 搜索框、输入框 |
| `radius-lg` | `12px` | 卡片、弹窗 |
| `radius-full` | `9999px` | 圆形按钮、头像 |

#### Shadows
| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | `0 2px 4px rgba(0,0,0,0.1)` | 卡片轻柔阴影，营造浮起感 |
| `shadow-md` | `0 8px 24px rgba(0,0,0,0.5)` | 下拉菜单、弹出层 |
| `shadow-lg` | `0 12px 36px rgba(0,0,0,0.6)` | 模态框、大弹窗 |

#### Borders
| Token | Value | Usage |
|-------|-------|-------|
| `border-subtle` | `1px solid #e0e0e0` | 分割线、输入框边框 |
| `border-focus` | `2px solid #fe5555` | 聚焦状态边框，使用品牌色强调 |

### Motion

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `motion-fast` | `200ms` | `ease-out` | hover 反馈、颜色切换 |
| `motion-normal` | `300ms` | `ease` | 页面过渡、面板展开 |
| `motion-slow` | `400ms` | `ease` | 大型动画、进入退出效果 |

> 动效追求「自然流畅」而非「炫技」。200ms 用于快速反馈（hover、点击），让用户感觉界面「活」着；300ms 用于结构性变化（展开/收起、页面切换）；400ms 只用于大场景过渡。easing 以 ease 和 ease-out 为主，避免生硬的 linear 和过于弹性的 spring 效果——音乐平台需要流畅感，而不是游戏感。

## Component Patterns

### Button

按钮组件，支持多种形态。主操作按钮使用品牌红色，次要按钮使用中性色或透明背景。小圆角保持现代感，播放按钮为标准圆形。

**Default:**
| Property | Value |
|----------|-------|
| bg | `transparent` |
| color | `#333333` |
| border-radius | `4px` |
| height | `36px` |
| padding | `0 16px` |
| font-size | `14px` |
| font-weight | `500` |

**Hover:**
| Property | Value |
|----------|-------|
| bg | `rgba(254,85,85,0.1)` |
| color | `#fe5555` |

**Focus:**
| Property | Value |
|----------|-------|
| outline | `2px solid #fe5555` |
| outline-offset | `2px` |

**Active:**
| Property | Value |
|----------|-------|
| bg | `rgba(254,85,85,0.2)` |

**Disabled:**
| Property | Value |
|----------|-------|
| color | `#9b9b9b` |
| cursor | `not-allowed` |

**Variants:**
- **Primary**: bg: `#fe5555`, color: `#ffffff`, border-radius: `4px`
- **Play**: bg: `#ffffff`, color: `#fe5555`, border-radius: `9999px`, width: `48px`, height: `48px`, padding: `0`
- **Ghost**: bg: `transparent`, color: `#787878`

### Input

输入框组件，用于搜索和表单。圆角矩形设计，内嵌图标时保持简洁。

**Default:**
| Property | Value |
|----------|-------|
| bg | `#f8f8f8` |
| color | `#333333` |
| border | `1px solid transparent` |
| border-radius | `8px` |
| height | `36px` |
| padding | `0 12px` |
| font-size | `14px` |

**Hover:**
| Property | Value |
|----------|-------|
| border-color | `#cccccc` |

**Focus:**
| Property | Value |
|----------|-------|
| bg | `#ffffff` |
| border-color | `#fe5555` |
| box-shadow | `0 0 0 2px rgba(254,85,85,0.1)` |

**Disabled:**
| Property | Value |
|----------|-------|
| bg | `#f0f0f0` |
| color | `#9b9b9b` |

### Card

内容卡片，用于歌曲列表、专辑展示等。无边框设计，轻柔阴影营造层次。

**Default:**
| Property | Value |
|----------|-------|
| bg | `#ffffff` |
| border-radius | `12px` |
| padding | `16px` |
| box-shadow | `0 2px 4px rgba(0,0,0,0.1)` |
| border | `none` |

**Hover:**
| Property | Value |
|----------|-------|
| transform | `translateY(-2px)` |
| box-shadow | `0 8px 24px rgba(0,0,0,0.15)` |

**Variants:**
- **Media**: padding: `0`, overflow: `hidden`
- **Compact**: padding: `8px 12px`, border-radius: `8px`

### Navigation

激活项用红色文字+淡红背景突出，hover 用深灰文字+浅灰背景

**Default:**
| Property | Value |
|----------|-------|
| bg | `#ffffff` |
| height | `56px` |
| padding | `0 24px` |

## Interaction Patterns

| State | Style |
|-------|-------|
| Hover | hover 时使用轻柔的颜色变化或阴影增强，避免突兀的跳变。导航项 hover 变为深灰文字+浅灰背景，激活项保持红色高亮。卡片 hover 轻微上浮（translateY -2px）+阴影加深。 |
| Focus | focus 状态使用红色边框（2px solid #fe5555）作为视觉提示，配合外发光效果（rgba(254,85,85,0.1)）。确保键盘导航时焦点始终可见。 |
| Active | active 状态使用更深的颜色或更大的阴影，提供「按下」的反馈感。按钮 active 背景色加深 10%。 |
| Loading | loading 状态使用骨架屏或淡入淡出效果，避免布局跳动。播放按钮 loading 时显示旋转动画。 |
| Transition | 默认 200ms ease-out，快速响应用户操作。结构性变化（展开/收起）使用 300ms ease。 |

## Layout

布局采用 12 列网格系统，主内容区与右侧辅助栏分栏排布。内容区保持舒适的密度——热门推荐区使用 2 行 4 列网格，歌曲列表使用单列宽行。响应式断点覆盖移动端到大屏，确保在手机上单列堆叠，在桌面端充分利用宽度。页面最大宽度 1200px，居中对齐。

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
- 使用红色 (#fe5555) 作为品牌信号色，只在主操作按钮、当前激活态、播放按钮等关键位置使用
- 卡片采用无边框设计，用轻柔阴影 (shadow-sm) 而非边框表达层级
- 保持整体密度为 comfortable，在封面图和列表之间留出足够的呼吸空间
- 使用 Arial 字体保证跨平台一致性，字号不超过 3 级
- 导航激活项用红色文字+淡红背景 (#fe5555 + rgba(254,85,85,0.1)) 突出
- hover 效果使用 200ms ease-out，保持快速反馈
- 播放按钮使用圆形 (border-radius: 9999px) + 白色背景，与红色形成对比
- 输入框使用浅灰背景 (#f8f8f8)，聚焦时变为白色+红色边框

### ❌ Don't
- 不要到处使用红色——如果每个按钮都是红色，它就不再是信号了
- 不要给卡片加粗边框，使用阴影表达层级更现代
- 不要使用超过 4 种字号，保持排版系统简洁
- 不要使用过于弹性的动画效果（如 spring），音乐平台需要流畅而非游戏感
- 不要把内容塞得太满，留白是音乐平台的重要设计语言
- 不要在禁用状态使用品牌色，保持 #9b9b9b 灰色
- 不要使用 linear easing，它会让动画感觉生硬
- 不要给分割线加圆角，保持方正 (border-radius: 0)

### Code Snippets

**创建主操作按钮** — 红色背景、白色文字、小圆角，hover 时背景加深
```css
background: #fe5555; color: #ffffff; border-radius: 4px; height: 36px; padding: 0 16px; font-size: 14px; font-weight: 500; transition: background 200ms ease-out;
```

**创建播放按钮** — 圆形、白色背景、红色图标，hover 时轻微放大+阴影
```css
background: #ffffff; color: #fe5555; border-radius: 9999px; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; transition: transform 200ms ease-out, box-shadow 200ms ease-out;
```

**创建内容卡片** — 无边框、白色背景、轻柔阴影，hover 时上浮
```css
background: #ffffff; border-radius: 12px; padding: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: none; transition: transform 200ms ease-out, box-shadow 200ms ease-out;
```

**创建搜索输入框** — 浅灰背景、内圆角，聚焦时变白+红色边框
```css
background: #f8f8f8; color: #333333; border: 1px solid transparent; border-radius: 8px; height: 36px; padding: 0 12px; font-size: 14px; &:focus { background: #ffffff; border-color: #fe5555; box-shadow: 0 0 0 2px rgba(254,85,85,0.1); }
```

**设置导航激活态** — 红色文字+淡红背景，区分于普通和 hover 状态
```css
color: #fe5555; background: rgba(254,85,85,0.1); border-radius: 4px; padding: 8px 12px;
```
