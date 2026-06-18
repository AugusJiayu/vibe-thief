---
schema: "vibe-thief/1.0"
source: "https://www.volcengine.com/activity/codingplan"
extracted_at: "2026-06-17T15:30:00.525Z"
confidence: 0.9
generator: "vibe-thief@0.1.0"
mood: "professional, clean, modern"
style_archetype: "light-saas"
---


# Design System: Volcengine

## Design Narrative

这是一个专注于效率和清晰度的科技工具或SaaS产品界面。设计以浅灰色为基底，营造干净、不干扰工作的背景。品牌蓝色作为明确的行动号召，引导用户操作。视觉节奏平衡，通过大号标题和代码/产品演示图形来突出技术实力，同时保持整体布局的舒适与可预测性，服务于专业用户的日常工作流。

**风格关键词**: `专业` `简洁` `现代` `科技` `高效`

## Visual Vocabulary

### 色彩哲学
色彩系统采用“浅底深字，蓝点行动”策略。大面积使用 #f7f8fa 和 #ffffff 背景，创造干净、有层次的“工作台”感。信息通过 #1d2129 到 #86909c 的灰色阶梯传递重要性。唯一的强信号色 #165dff 被严格限制，确保它每次出现都能有效吸引用户注意并引导行动。语义色（成功、警告、错误）用于系统状态反馈，不参与核心布局。

### 排版哲学
采用无衬线字体栈确保跨平台清晰度和现代感。排版层次通过字号和字重（400-700）的对比来建立，行高统一采用 1.5 倍比例以保证最佳可读性。正文基础尺寸为 14px，在屏幕和信息密度之间取得平衡。超大号标题（40px+）用于创造视觉焦点和呼吸感。

### 留白哲学
基于 2px 的倍数系统，提供从微调到宏观布局的精细控制。策略是“呼吸在组件之间，而非之内”：组件内部（如按钮、输入框）使用 8-12px 的紧凑间距保持凝聚力；相邻组件之间使用 16-24px 的间距建立清晰关系；主要的内容区块之间则使用 32-44px 的大间距，创造页面结构的节奏和层次。

### 深度哲学
层级表达遵循“浅底 + 白浮层 + 微妙投影 + 柔和边框”的策略。白色卡片从灰底上浮现（通过 bg-surface 和 shadow-md），输入框等交互元素通过 shadow-sm 暗示可操作性。圆角统一使用中等大小（4-8px），塑造友好、现代的视觉性格。边框主要作为视觉分隔线，颜色非常浅，避免形成视觉噪音。

## Design Tokens

### Colors

#### Background Layers（表达页面深度结构）
| Token | Value | Usage |
|-------|-------|-------|
| `bg-page` | `#f7f8fa` | 主要页面背景，提供干净、不刺眼的基础画布。 |
| `bg-surface` | `#ffffff` | 卡片、面板、模态框等浮动容器的表面，通过白色从灰底中脱颖而出，形成层级。 |

#### Signal Colors（仅用于需要用户注意的地方）
| Token | Value | Usage |
|-------|-------|-------|
| `signal-primary` | `#165dff` | 唯一的行动号召色。只用于需要用户立即点击或关注的元素：主按钮、可操作链接、选中状态、重要通知图标。 |
| `signal-accent` | `#5850f0` | 用于次级强调或特殊标记，如新功能徽章、特定类型的标签，避免与主操作混淆。 |

#### Text Hierarchy
| Token | Value | Usage |
|-------|-------|-------|
| `text-primary` | `#1d2129` | 正文和标题文本，确保在浅色背景上的高可读性。 |
| `text-secondary` | `#41464f` | 辅助性文本、说明文字、图表标签，降低信息层级。 |
| `text-disabled` | `#86909c` | 禁用状态的文本、占位符，明确表示不可交互。 |

### Typography

#### Font Stack
| Role | Family |
|------|--------|
| Heading | `PingFang SC, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif` |
| Body | `PingFang SC, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif` |
| Code | `SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace` |

#### Type Scale
| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| `text-xs` | `12px` | 400 | 脚注、元数据、小标签。 |
| `text-sm` | `14px` | 400 | 正文默认尺寸，用于段落、表单标签、按钮文字。 |
| `text-base` | `16px` | 400 | 需要稍强强调的正文内容，如长篇描述中的重点段落。 |
| `text-lg` | `18px` | 500 | 次级标题、小节标题。 |
| `text-xl` | `20px` | 500 | 卡片标题、重要列表项。 |
| `text-2xl` | `24px` | 600 | 章节标题、区域主标题。 |
| `text-3xl` | `40px` | 600 | 页面主标题，Hero区域大字。 |
| `text-4xl` | `52px` | 700 | 展示性超大标题，用于营销页面或关键数据展示。 |

### Spacing

Base: `2px`

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | `2px` | 极微小的间距，如图标的内边距或元素的紧密连接。 |
| `space-2` | `4px` | 小的内部间距，如输入框内文字与边框的距离。 |
| `space-3` | `8px` | 组件内部的紧凑间距，如按钮内图标与文字的间距。 |
| `space-4` | `16px` | 组件内部的标准呼吸间距，如列表项之间、表单控件组内。 |
| `space-5` | `24px` | 组件之间的默认分隔，如卡片之间、表单组之间。 |
| `space-6` | `32px` | 较大区域的分隔，如标题与内容之间、主要内容区块之间。 |
| `space-7` | `44px` | 页面主要板块之间的大分隔，创造明显的段落感。 |

### Depth & Hierarchy

#### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | `4px` | 小元素，如按钮、输入框、小标签。提供柔和的现代感。 |
| `radius-md` | `8px` | 中等元素，如卡片、弹出框、下拉菜单。平衡圆润与稳重。 |
| `radius-lg` | `12px` | 大型容器或需要更强亲和力的元素。 |
| `radius-full` | `9999px` | 药丸形状，用于特殊标签或头像。 |

#### Shadows
| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` | 非常微妙的阴影，用于输入框、小卡片，提示其可交互性。 |
| `shadow-md` | `0 4px 12px 0 rgba(0, 0, 0, 0.08)` | 中等阴影，用于浮层（下拉菜单、模态框）、悬停状态下的卡片，强调“浮起”层级。 |

#### Borders
| Token | Value | Usage |
|-------|-------|-------|
| `border-default` | `1px solid #e5e6eb` | 默认边框，用于分隔内容（如表格单元格）、定义容器边界（如卡片），提供清晰但不突兀的结构。 |
| `border-strong` | `1px solid #c9cdd4` | 更强的边框，用于强调选中状态、活动输入框。 |

### Motion

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `motion-fast` | `150ms` | `ease-out` | 需要即时反馈的交互：按钮 hover、点击、聚焦状态变化。 |
| `motion-normal` | `250ms` | `ease` | 一般的状态切换、展开/收起动画、页面元素进入。 |
| `motion-slow` | `400ms` | `ease-in-out` | 更复杂、更需要关注的动画：模态框打开、页面过渡、大型图表绘制。 |

> 动效追求“干脆的功能性确认感”。快速动效（150ms）用于提供即时操作反馈，让用户感觉界面响应迅速。常规动效（250ms）用于平滑的状态过渡，引导视觉焦点。所有动效都应有明确目的：要么提供反馈，要么引导注意力，要么维持空间连续性，杜绝装饰性动画。

## Motion Language

### 滚动行为
无特殊滚动行为。标准垂直滚动，无视差效果。

### 交互反馈
按钮 hover 时背景色亮度轻微提高（如主色从 #165dff 变为 #3a7bff）。下拉菜单指示器在 hover 时显示。交互元素获得焦点时通过 2px solid 的半透明蓝色轮廓提供明确指示。

### 页面转场
无页面级转场。页面切换为标准加载。

### 微交互
加载状态使用轻量的进度条或旋转指示器。Toast 通知从屏幕顶部滑入，短暂停留后自动滑出或渐隐。

### 动效性格
> 追求干脆的确认感，速度偏快（150-250ms），缓动曲线偏干脆（ease-out），每个动画都有明确的功能目的，旨在提升操作流畅度而非炫技。

## Visual Language

### 布局哲学
采用结构化布局，主标题居中，正文内容左对齐。Hero区域常采用两栏布局（左侧文案，右侧产品/代码演示图形），通过大面积留白和均衡的图文分布，将用户注意力聚焦于核心价值主张和产品展示。内容区间距一致，创造可预测、舒适的阅读节奏。

### 图像使用
核心视觉元素是“产品功能演示图”或“代码/界面截图”，常置于渐变色或纯色背景之上，用于直观展示技术能力。图片风格现代、干净，避免复杂的环境干扰。

### 图标风格
无明显图标体系。如使用，应为线性或轻量填充风格，保持简洁。

### 信息密度
中等密度。每屏通常承载 2-4 个主要信息单元（如标题、说明、演示图、行动按钮），通过充足的留白（尤其是垂直方向的 60-80px 间距）来确保每个单元都能被清晰感知，避免信息过载。

### 品牌个性
`专业` `高效` `可靠` `现代` `清晰`

## Component Patterns

### Button

用于触发主要操作（如订阅、开始使用）或次要操作（如取消、了解更多）。

**Default:**
| Property | Value |
|----------|-------|
| bg | `#165dff` |
| color | `#ffffff` |
| border-radius | `6px` |
| height | `32px` |
| font-size | `14px` |
| font-weight | `500` |

**Hover:**
| Property | Value |
|----------|-------|
| bg | `#3a7bff` |

**Focus:**
| Property | Value |
|----------|-------|
| outline | `2px solid rgba(22, 93, 255, 0.25)` |

**Variants:**
- **Primary**: background: `#165dff`, color: `#ffffff`
- **Secondary**: background: `transparent`, border: `1px solid #e5e6eb`, color: `#1d2129`

### Input

用于文本输入，如搜索框、表单字段。

**Default:**
| Property | Value |
|----------|-------|
| bg | `#ffffff` |
| border | `1px solid #e5e6eb` |
| border-radius | `8px` |
| height | `36px` |
| font-size | `14px` |

**Hover:**
| Property | Value |
|----------|-------|
| border-color | `#c9cdd4` |

**Focus:**
| Property | Value |
|----------|-------|
| border-color | `#165dff` |
| box-shadow | `0 0 0 2px rgba(22, 93, 255, 0.1)` |

## Interaction Patterns

| State | Style |
|-------|-------|
| Hover | 按钮 hover 时背景色亮度提高。可交互元素（如链接、下拉菜单项）有轻微的颜色或背景变化作为反馈。 |
| Focus | 通过 2px solid 的半透明蓝色轮廓（如 #165dff40）提供明确的键盘焦点指示，确保可访问性。 |
| Active | 按钮 active 时背景色略微变暗或下沉 1px，提供“按下”的物理反馈。 |
| Loading | 使用轻量的旋转（Spinner）图标或进度条，避免使用沉重或全屏的加载动画。 |
| Transition | 默认使用 250ms ease 进行状态切换。 |

## Layout

采用经典的 12 列网格系统，内容最大宽度 1200px 并在页面居中，确保在大屏幕上的可读性和布局一致性。响应式设计确保在移动端（<768px）内容堆叠，提供友好的触控体验。

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
- 严格限制 #165dff 的使用，仅用于主按钮、重要链接和核心操作状态，确保其信号作用。
- 使用 #f7f8fa 作为页面背景，#ffffff 作为卡片等容器的表面，清晰构建视觉层级。
- 保持 1.5 的行高比例，确保所有文本都有舒适的阅读间距。
- 在组件内部使用 8-12px 间距，组件之间使用 16-24px 间距，板块之间使用 32-44px 间距。
- 为所有可交互元素（按钮、链接、输入框）提供明确的 hover 和 focus 状态样式。

### ❌ Don't
- 避免在非操作性元素（如普通图标、装饰性标签）上使用主蓝色 #165dff。
- 避免使用过大的字号（如 >20px）作为正文，破坏既定的阅读节奏和信息层次。
- 避免在单一视图中堆砌过多信息模块，保持中等信息密度和呼吸感。
- 忽略键盘可访问性，所有可交互元素必须有清晰的 focus 状态。
- 使用与整体干脆、快速性格不符的复杂、缓慢的装饰性动画。

### Code Snippets

**创建主按钮** — 使用信号色作为背景，白色文字，中等圆角。
```css
background: #165dff; color: white; border-radius: 6px; height: 32px; padding: 0 16px; font-size: 14px; font-weight: 500; transition: background 150ms ease-out;
```

**创建卡片** — 白色背景，轻微阴影，中等圆角，用于内容容器。
```css
background: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); padding: 24px;
```

**设置页面布局** — 使用 12 列网格，内容区域最大宽度 1200px，页面背景浅灰，表面白色。
```css
max-width: 1200px; margin: 0 auto; padding: 0 24px; background: #f7f8fa;
```
