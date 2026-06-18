---
schema: "vibe-thief/1.0"
source: "https://www.zhihu.com"
extracted_at: "2026-06-17T15:16:52.978Z"
confidence: 0.85
generator: "vibe-thief@0.1.0"
mood: "专业、友好、现代"
style_archetype: "light-saas"
---


# Design System: Zhihu

## Design Narrative

这是一个面向大众用户的现代化 SaaS 系统，设计目标是平衡专业性与亲和力。它采用浅色主题以提供舒适、清晰的视觉基础，但通过鲜明的品牌色和细腻的交互反馈注入活力与趣味性。核心思想是「清晰的功能层级」和「无干扰的焦点」，让用户能高效完成任务，同时感受到产品的精致与关怀。

**风格关键词**: `专业` `友好` `现代` `清晰` `舒适`

## Visual Vocabulary

### 色彩哲学
色彩策略以「舒适中性」为基础，「精准信号」为引导。大面积使用浅灰和白色背景，营造干净、专注的工作环境。品牌蓝作为唯一的强信号色，严格限制在核心交互上，确保用户注意力不被分散。灰色系统（Gray 1-8）是构建层次和深度的隐形骨架，文字、边框、背景的层次都依赖于这个精确的灰度序列。

### 排版哲学
采用系统字体栈，确保在不同操作系统下都有原生、流畅的显示效果，同时完美支持中英文混排。排版层次清晰，通过固定的字号阶梯（10-24px）而非随意数值来构建视觉节奏。基础字号14px在移动端和桌面端都能提供良好的可读性。字重变化克制，主要依靠字号和颜色（text-hierarchy）来区分信息重要性。

### 留白哲学
以4px为基准单位，构建一个紧凑而有序的空间系统。核心原则是「呼吸在组件之间，而非组件之内」：组件内部（如按钮文字与边缘）使用8-12px保持紧凑感和操作密度；组件之间、区块之间则使用16-32px创造清晰的视觉分组和呼吸感。避免使用偶数之外的奇数间距，保持数学关系的整洁。

### 深度哲学
深度表达极其克制，主要依赖颜色和微妙的边框，而非夸张的阴影。页面背景（#f7f8fa）和卡片表面（#ffffff）的亮度差是构成层级的主要手段。阴影仅用于两种场景：1）表示浮层（如下拉菜单）；2）在交互时提供轻微的物理反馈（hover阴影）。大多数控件没有阴影，只使用1px的细边框来界定范围。

## Design Tokens

### Colors

#### Background Layers（表达页面深度结构）
| Token | Value | Usage |
|-------|-------|-------|
| `bg-page` | `#f7f8fa` | 页面或应用的最底层背景，提供中性、不刺眼的画布 |
| `bg-surface` | `#ffffff` | 卡片、面板、弹窗等容器背景，通过颜色差异与页面背景形成层级 |

#### Signal Colors（仅用于需要用户注意的地方）
| Token | Value | Usage |
|-------|-------|-------|
| `signal-primary` | `#3f45ff` | 品牌色，仅用于主按钮、选中态、关键交互标识和需要用户立即注意的元素。克制使用是其保持力量感的关键。 |
| `signal-success` | `#00c853` | 成功状态、正面反馈（如提交成功、验证通过） |
| `signal-warning` | `#ff976a` | 警告、提示、需用户注意但非错误的状态（如未保存） |
| `signal-error` | `#f44336` | 错误、危险操作（如删除确认、验证失败） |

#### Text Hierarchy
| Token | Value | Usage |
|-------|-------|-------|
| `text-primary` | `#323232` | 主要内容、标题，确保最佳可读性 |
| `text-secondary` | `#969799` | 辅助说明、注释、次要信息，降低视觉干扰 |
| `text-disabled` | `#c8c9cc` | 禁用状态文字，明确表示不可交互 |
| `text-link` | `#576b95` | 可点击的文本链接，与正文区分但不喧宾夺主 |

### Typography

#### Font Stack
| Role | Family |
|------|--------|
| Heading | `system-ui, -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif` |
| Body | `system-ui, -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif` |
| Code | `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` |

#### Type Scale
| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| `text-xs` | `10px` | 400 | 极小标注、角标 |
| `text-sm` | `12px` | 400 | 辅助文字、脚注、时间戳 |
| `text-base` | `14px` | 400 | 正文基准字号，保证长文阅读舒适度 |
| `text-lg` | `16px` | 400 | 强调文字、大段落引导 |
| `text-xl` | `18px` | 400 | 小标题、模块标题 |
| `text-2xl` | `20px` | 600 | 区域标题 |
| `text-3xl` | `24px` | 600 | 页面主标题 |

### Spacing

Base: `4px`

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | `4px` | 最小单位，用于图标与文字、紧邻元素的微调 |
| `space-2` | `8px` | 组件内部间距（如按钮内边距、列表项内间距） |
| `space-3` | `12px` | 组件内部较大间距，或紧凑型列表项间距 |
| `space-4` | `16px` | 标准组件间距、通用内边距 |
| `space-5` | `20px` | 区块内较大分隔 |
| `space-6` | `24px` | 页面区块间的标准间距 |
| `space-8` | `32px` | 大型区块分隔、页面内主要模块间距 |

### Depth & Hierarchy

#### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | `4px` | 按钮、输入框、标签等小型控件 |
| `radius-md` | `8px` | 卡片、面板、模态框等容器 |
| `radius-full` | `999px` | 头像、徽章等需要圆形的元素 |

#### Shadows
| Token | Value | Usage |
|-------|-------|-------|
| `shadow-card` | `0 1px 2px 0 rgba(0,0,0,0.05)` | 卡片默认阴影，仅用于表示可浮起的层级，非常克制 |
| `shadow-hover` | `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)` | 卡片或可交互元素在hover时的提升阴影 |
| `shadow-dropdown` | `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)` | 下拉菜单、弹出层等浮层 |

#### Borders
| Token | Value | Usage |
|-------|-------|-------|
| `border-default` | `1px solid #ebedf0` | 默认边框，用于输入框、分隔线 |
| `border-strong` | `1px solid #dcdee0` | 强调边框，用于容器、激活态 |

### Motion

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `motion-fast` | `200ms` | `ease-out` | hover 反馈、按钮状态切换等即时微交互 |
| `motion-normal` | `300ms` | `ease` | 弹窗展开/关闭、标签页切换等状态转换 |

> 动效追求快速、平滑、有目的。200ms的快速反馈让交互感觉灵敏，300ms的默认时长用于稍大的状态变化。缓动函数强调「ease-out」（进入柔和）和「ease-in」（退出利落），避免线性运动的生硬感。动效是服务于效率的，绝不能成为等待的负担。

## Component Patterns

### Button

核心交互控件，通过变体区分操作重要性。

**Default:**
| Property | Value |
|----------|-------|
| bg | `#f7f8fa` |
| color | `#323232` |
| border-radius | `4px` |
| height | `32px` |
| padding | `0 16px` |
| border | `1px solid #ebedf0` |
| font-size | `14px` |

**Hover:**
| Property | Value |
|----------|-------|
| bg | `#f2f3f5` |
| border-color | `#dcdee0` |

**Focus:**
| Property | Value |
|----------|-------|
| outline | `2px solid rgba(63, 69, 255, 0.3)` |
| outline-offset | `1px` |

**Active:**
| Property | Value |
|----------|-------|
| bg | `#ebedf0` |
| transform | `scale(0.98)` |

**Disabled:**
| Property | Value |
|----------|-------|
| bg | `#f7f8fa` |
| color | `#c8c9cc` |
| border-color | `#f2f3f5` |
| cursor | `not-allowed` |

**Variants:**
- **Primary**: bg: `#3f45ff`, color: `#ffffff`, border: `none`, font-weight: `600`
- **Secondary**: bg: `transparent`, border: `1px solid #3f45ff`, color: `#3f45ff`
- **Danger**: bg: `#f44336`, color: `#ffffff`, border: `none`

### Card

内容容器，通过白色背景与页面背景形成层级。

**Default:**
| Property | Value |
|----------|-------|
| bg | `#ffffff` |
| border-radius | `8px` |
| padding | `16px` |
| box-shadow | `0 1px 2px 0 rgba(0,0,0,0.05)` |
| border | `none` |

**Hover:**
| Property | Value |
|----------|-------|
| box-shadow | `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)` |

### Input

文本输入控件，设计简洁，聚焦状态明确。

**Default:**
| Property | Value |
|----------|-------|
| bg | `#ffffff` |
| border | `1px solid #ebedf0` |
| border-radius | `4px` |
| height | `32px` |
| padding | `0 8px` |
| font-size | `14px` |
| color | `#323232` |

**Hover:**
| Property | Value |
|----------|-------|
| border-color | `#dcdee0` |

**Focus:**
| Property | Value |
|----------|-------|
| border-color | `#3f45ff` |
| box-shadow | `0 0 0 2px rgba(63, 69, 255, 0.1)` |

**Disabled:**
| Property | Value |
|----------|-------|
| bg | `#f7f8fa` |
| color | `#c8c9cc` |
| cursor | `not-allowed` |

**Variants:**
- **Error**: border-color: `#f44336`, focus-shadow: `0 0 0 2px rgba(244, 67, 54, 0.1)`

## Interaction Patterns

| State | Style |
|-------|-------|
| Hover | 通过微妙的背景色变化（灰色系）或边框颜色加深来反馈。卡片类容器可增加阴影强度。变化幅度小，避免视觉跳跃。 |
| Focus | 使用信号蓝的半透明外轮廓或边框高亮，明确标识当前焦点，同时与 hover 状态区分。不使用默认的浏览器蓝色轮廓。 |
| Active | 提供轻微的「按下」反馈，如背景色进一步变深（使用 Gray 2/3）或使用 transform: scale(0.98) 进行微缩放。 |
| Loading | 主按钮在加载时应保持宽度不变，内部显示加载图标或进度条，禁用点击。 |
| Transition | 所有交互状态变化都应在 200ms 内完成，使用 ease-out 缓动，确保流畅且不拖沓。 |

## Layout

采用12列弹性网格系统，配合16px的固定间距，确保内容在各种屏幕宽度下都能有序对齐和重排。最大宽度1000px是为了在宽屏上保持舒适的阅读行长度和视觉焦点。布局策略是「内容驱动，模块化堆叠」，而非复杂的网格嵌套。

| Property | Value |
|----------|-------|
| Max Width | `1000px` |
| Grid Columns | 12 |
| Grid Gap | `16px` |

### Breakpoints
| Name | Min Width |
|------|-----------|
| `sm` | `640px` |
| `md` | `768px` |
| `lg` | `1024px` |
| `xl` | `1280px` |

## Agent Usage Guide

### ✅ Do
- 使用背景色层级（#f7f8fa -> #ffffff）来表达深度，而非依赖阴影。
- 将信号色（#3f45ff）严格限制在主操作按钮、关键选中态和需要立即注意的元素上。
- 始终遵循间距系统（4px倍数），组件内部用8-12px，组件间用16-32px。
- 使用系统字体栈以保证最佳的渲染性能和跨平台一致性。
- 为所有可交互元素（按钮、链接、输入框）定义清晰的 default、hover、focus、active、disabled 状态。
- 在浅色背景下，使用 1px solid #ebedf0 的细边框来界定输入框和容器，保持轻盈感。
- 动效时长选择 200ms（微交互）或 300ms（状态转换），缓动多用 ease-out。
- 圆角遵循规律：小控件 4px，卡片容器 8px，圆形元素 999px。

### ❌ Don't
- 不要在普通容器或卡片上使用超过 8px 的圆角，会破坏现代、专业的视觉感受。
- 不要滥用阴影。只在卡片 hover、浮层（如下拉菜单）和按钮状态反馈时使用轻微的阴影。
- 不要使用黑色（#000000）作为文字或边框颜色，用灰色系统（#323232, #dcdee0）代替，视觉更柔和。
- 不要在非关键操作上使用品牌蓝，避免「紫色疲劳」，削弱其信号作用。
- 不要使用与基础间距系统（4px倍数）不符的奇数值（如 5px, 7px, 9px）作为间距。
- 不要使用花哨或复杂的动画效果，保持动效快速、平滑、有功能性目的。

### Code Snippets

**创建主按钮** — 使用品牌蓝背景，白色文字，无边框，圆角4px，高度32px。
```css
background: #3f45ff; color: #ffffff; border: none; border-radius: 4px; height: 32px; padding: 0 16px; font-weight: 600;
```

**创建内容卡片** — 白色背景，大圆角，使用最轻微的阴影作为默认状态。
```css
background: #ffffff; border-radius: 8px; padding: 16px; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);
```

**创建文本输入框** — 白色背景，浅灰色细边框，聚焦时变为品牌蓝边框加半透明光晕。
```css
background: #ffffff; border: 1px solid #ebedf0; border-radius: 4px; height: 32px; padding: 0 8px; transition: border-color 200ms ease-out; &:focus { border-color: #3f45ff; box-shadow: 0 0 0 2px rgba(63, 69, 255, 0.1); }
```

**设置页面主区域布局** — 限制最大宽度，水平居中，使用12列网格。
```css
max-width: 1000px; margin: 0 auto; padding: 0 16px; display: grid; grid-template-columns: repeat(12, 1fr); gap: 16px;
```
