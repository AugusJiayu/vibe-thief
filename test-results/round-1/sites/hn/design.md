---
schema: "vibe-thief/1.0"
source: "https://news.ycombinator.com"
extracted_at: "2026-06-17T10:38:33.426Z"
confidence: 0.75
generator: "vibe-thief@0.1.0"
mood: "专业,干净,高效"
style_archetype: "light-saas"
---


# Design System: News

## Design Narrative

undefined

**风格关键词**: `实用` `层级` `信号` `紧凑` `清晰`

## Visual Vocabulary

### 色彩哲学
色彩策略的核心是‘信号与环境’。纯白背景#ffffff和浅灰表面#f8f8f8构成了一个干净、中性的环境。唯一的强信号色是橙色#ff6600，它必须稀缺地使用在所有需要用户行动的地方（主按钮、选中态、关键链接）。如果橙色到处都是，它就不再是信号了。文字颜色则形成了清晰的层级：#000000吸引注意，#828282提供上下文，#767676表示不可用。

### 排版哲学
排版系统紧凑而务实。默认使用Verdana，这是一种清晰、易读的无衬线字体，尤其在小字号下表现稳定，符合系统对‘效率’的追求。字号从9.3px到16.7px，倍数关系约为1.25（Major Third），但这不是严格的艺术比例，而是服务于信息密度——在有限空间内，用字号和字重（400 vs 700）来建立清晰的视觉层级。

### 留白哲学
间距系统建立在一个精细的2px基数上，允许高度紧凑的布局。设计理念是‘呼吸在组件之间，而非组件之内’。组件内部（如按钮的padding）使用4-8px的紧凑值，确保元素凝聚。而组件与组件之间则使用16-24px的较大间距，形成清晰的视觉分组，引导用户的视线流动。这种内外节奏的差异是构建可读界面的关键。

### 深度哲学
深度表达策略以边框和浅阴影为主，而非强烈的投影。这是浅色SaaS风格的典型做法：通过非常浅的阴影（shadow-card）和细边框（border-default）来微妙地提升卡片、弹窗等容器的层级，使其从白色背景中浮现，但又不显突兀。圆角适中（8px为主），传递友好感但又不幼稚。整体效果是干净、有层次但不复杂的。

## Design Tokens

### Colors

#### Background Layers（表达页面深度结构）
| Token | Value | Usage |
|-------|-------|-------|
| `bg-page` | `#ffffff` | 页面最底层背景 |
| `bg-surface` | `#f8f8f8` | 卡片、面板、表单区域等次级背景，用于区分内容区块 |

#### Signal Colors（仅用于需要用户注意的地方）
| Token | Value | Usage |
|-------|-------|-------|
| `signal-primary` | `#ff6600` | 主按钮、重要链接、选中状态、需要用户立即注意的关键交互元素 |
| `signal-warning` | `#f86000` | 警告状态提示、需注意但非错误的次级信号 |

#### Text Hierarchy
| Token | Value | Usage |
|-------|-------|-------|
| `text-primary` | `#000000` | 标题、关键数据、正文主文字 |
| `text-secondary` | `#828282` | 副标题、说明性文字、时间戳、标签 |
| `text-disabled` | `#767676` | 禁用状态文字、占位符文本 |

### Typography

#### Font Stack
| Role | Family |
|------|--------|
| Heading | `Verdana, Geneva, sans-serif` |
| Body | `Verdana, Geneva, sans-serif` |
| Code | `monospace` |

#### Type Scale
| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| `text-caption` | `9.33333px` | 400 | 极小的辅助文本、标签 |
| `text-small` | `10.6667px` | 400 | 次要说明文本、表格单元格内容 |
| `text-body` | `13.3333px` | 400 | 默认正文字体大小 |
| `text-heading` | `16.6666px` | 700 | 主要标题、卡片标题、强调文本 |

### Spacing

Base: `2px`

| Token | Value | Usage |
|-------|-------|-------|
| `space-tight` | `2px` | 文本与图标的微调间距 |
| `space-compact` | `4px` | 列表项内、表单元素内、图标与相邻文字 |
| `space-normal` | `8px` | 组件内元素间距（如按钮内图文） |
| `space-relaxed` | `16px` | 组件间、区块间、卡片内边距 |
| `space-section` | `24px` | 主要区块之间的间距 |

### Depth & Hierarchy

#### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | `4px` | 输入框、小按钮、标签 |
| `radius-md` | `8px` | 卡片、对话框、大按钮 |
| `radius-lg` | `12px` | 大型容器或需要柔和感的元素 |

#### Shadows
| Token | Value | Usage |
|-------|-------|-------|
| `shadow-subtle` | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` | 非常轻微的层次提升，如输入框聚焦 |
| `shadow-card` | `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)` | 卡片、弹出菜单、下拉列表 |

#### Borders
| Token | Value | Usage |
|-------|-------|-------|
| `border-default` | `1px solid #e5e5e5` | 输入框、分隔线 |
| `border-focus` | `2px solid #ff6600` | 输入框聚焦状态 |

### Motion

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `motion-fast` | `150ms` | `ease-out` | hover反馈、状态切换（如开关） |
| `motion-normal` | `250ms` | `ease` | 展开/折叠、模态框出现 |
| `motion-slow` | `400ms` | `ease-in-out` | 页面过渡、复杂组件的入场 |

> 动效策略服务于‘高效’的目标。动效必须快速、目的明确，绝不拖沓。最常用的动效是150ms的ease-out，用于为用户的直接操作（如悬停按钮）提供即时、自然的反馈。更复杂的动画（250ms-400ms）仅用于必要的状态转换，如打开面板。整体基调是‘功能驱动’而非‘装饰性’。

## Component Patterns

### Button

核心交互组件，用于触发动作。视觉强调通过背景色而非边框实现。

**Default:**
| Property | Value |
|----------|-------|
| background | `#f8f8f8` |
| color | `#000000` |
| border-radius | `8px` |
| height | `36px` |
| padding | `0 16px` |
| font-weight | `600` |
| border | `none` |

**Hover:**
| Property | Value |
|----------|-------|
| background | `#f0f0f0` |

**Focus:**
| Property | Value |
|----------|-------|
| outline | `2px solid #ff6600` |
| outline-offset | `2px` |

**Active:**
| Property | Value |
|----------|-------|
| background | `#e8e8e8` |

**Disabled:**
| Property | Value |
|----------|-------|
| background | `#f8f8f8` |
| color | `#767676` |
| cursor | `not-allowed` |

**Variants:**
- **Primary**: background: `#ff6600`, color: `#ffffff`, hover_background: `#e65c00`
- **Secondary**: background: `transparent`, border: `1px solid #e5e5e5`, color: `#000000`, hover_background: `#f8f8f8`

### Input

文本输入框，承载用户输入。

**Default:**
| Property | Value |
|----------|-------|
| background | `#ffffff` |
| color | `#000000` |
| border | `1px solid #e5e5e5` |
| border-radius | `4px` |
| height | `36px` |
| padding | `0 12px` |

**Hover:**
| Property | Value |
|----------|-------|
| border_color | `#d4d4d4` |

**Focus:**
| Property | Value |
|----------|-------|
| outline | `2px solid #ff6600` |
| border_color | `#ff6600` |

**Disabled:**
| Property | Value |
|----------|-------|
| background | `#f8f8f8` |
| color | `#767676` |
| border_color | `#f0f0f0` |

### Card

内容容器，用于分组相关信息。

**Default:**
| Property | Value |
|----------|-------|
| background | `#ffffff` |
| border-radius | `8px` |
| padding | `16px` |
| box-shadow | `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)` |

**Hover:**
| Property | Value |
|----------|-------|
| box-shadow | `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)` |

## Interaction Patterns

| State | Style |
|-------|-------|
| Hover | 颜色变深（background 颜色值变深 5-10%）或轻微的阴影提升。 |
| Focus | 使用信号色（橙色）的轮廓线（outline: 2px solid #ff6600）明确标识当前焦点，确保键盘导航的可访问性。 |
| Active | 颜色比hover态再深一级，提供“按下”的反馈感。 |
| Loading | 预期为与背景对比度高的简单动画（如脉冲、骨架屏），但数据未明确。 |
| Transition | 所有颜色和阴影变化都应平滑过渡，使用150ms的ease-out timing function。 |

## Layout

布局采用经典的12列网格系统，最大宽度1200px，保证了内容的可读性和在大屏上的舒适度。24px的网格间隙与组件间距（section token）一致，确保了视觉节奏的统一。响应式断点覆盖了从手机到桌面的常见尺寸，策略是在小屏上堆叠内容，在大屏上展开为多列布局。

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
- 使用背景色层级（#ffffff 和 #f8f8f8）来组织信息结构，而不是依赖阴影。
- 将橙色（#ff6600）仅用于主按钮、当前选中项、关键操作链接等‘信号点’。
- 文本颜色遵循层级：关键信息用#000000，辅助信息用#828282，禁用信息用#767676。
- 组件内部间距（如padding）使用4-8px的紧凑值，组件间间距使用16-24px。
- 为所有可交互元素提供清晰的focus状态，使用橙色outline。
- 动画使用150ms的ease-out用于反馈，250-400ms用于状态转换。

### ❌ Don't
- 不要大面积使用橙色，否则会失去其作为信号色的强调作用。
- 不要使用过于强烈的阴影（如shadow-xl），保持系统干净、扁平的基调。
- 不要在组件内部使用过大的间距（如>16px），这会破坏系统的紧凑感。
- 不要使用纯黑色（#000000）作为背景或阴影颜色，保持柔和感。
- 不要忽略禁用状态的视觉反馈（灰色文本和降低对比度的背景）。
- 不要使用过于花哨或持续的动画，保持交互反馈快速、直接。

### Code Snippets

**创建主按钮 (Primary Button)** — 使用信号色作为背景，白色文字，中等圆角。
```css
background-color: #ff6600; color: #ffffff; border: none; border-radius: 8px; padding: 0 16px; height: 36px; font-weight: 600; cursor: pointer; transition: background-color 150ms ease-out;
```

**创建内容卡片 (Content Card)** — 白色背景，中等圆角，使用系统阴影提升层级。
```css
background-color: #ffffff; border-radius: 8px; padding: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
```

**创建文本输入框 (Text Input)** — 白色背景，细边框，小圆角，聚焦时显示橙色轮廓。
```css
background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 4px; padding: 0 12px; height: 36px; transition: border-color 150ms ease-out, outline-color 150ms ease-out;&:focus { outline: 2px solid #ff6600; border-color: #ff6600; }
```

**设置页面主布局** — 使用最大宽度容器和网格进行内容对齐。
```css
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; } .grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 24px; }
```
