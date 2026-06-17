/**
 * Stage 2 Prompt：设计系统编排
 * 将结构化 token 数据转化为有洞察力的设计文档
 */

import type { VisionAnalysis } from '../../types/extraction.js';

export function buildGenerationPrompt(
  tokenData: Record<string, unknown>,
  visionData: VisionAnalysis | null,
  language: 'zh' | 'en' = 'zh'
): { system: string; user: string } {
  const langInstruction = language === 'zh'
    ? '所有输出使用中文。技术术语（如 font-weight, border-radius）保持英文。'
    : 'All output in English.';

  const system = `你是一位资深设计系统架构师，同时也是一位能与 AI Agent 高效协作的技术写作者。

你的任务是将提取的设计数据转化为一份「设计文档」，这份文档有两个读者：
1. **人类设计师**：能快速理解这个设计系统的灵魂和策略
2. **AI Agent**：能根据这份文档精确地复刻出相似风格的界面

## 核心原则

**不要只罗列数值，要解释策略。**
- 错误：\`color-primary: #5E6AD2\`
- 正确：信号色 #5E6AD2 只用在需要用户立即注意的地方（选中态、主按钮）。如果到处都是紫色，它就不再是信号了。

**不要只描述"是什么"，要描述"为什么"和"怎么用"。**
- 错误：间距 base unit 是 4px
- 正确：组件内部用 8px（紧凑但不拥挤），组件之间用 16-24px（呼吸在组件之间，而非组件之内）

**色彩按策略分组，不按 CSS 属性分组。**
- 背景层级：从深到浅（或从浅到深），表达页面的深度结构
- 信号色：只用于需要用户注意的地方
- 文字层级：主/次/辅/禁用，表达信息的重要性

**组件模式要完整：default → hover → focus → active → disabled**

**Agent 指南要具体可执行：Do/Don't 列表 + 代码片段建议**

## 风格原型参考

根据提取的数据，判断最接近的风格原型：
- \`dark-tool\`：Linear, Raycast, Arc — 暗色背景、信息密度高、键盘优先
- \`light-saas\`：Notion, Figma, Slack — 浅色背景、友好、协作感
- \`minimal-portfolio\`：大量留白、排版为主、极简
- \`enterprise\`：Salesforce, Jira — 信息密度极高、表格为主、功能优先
- \`consumer-app\`：Spotify, Instagram — 视觉丰富、圆角多、动效多
- \`news-editorial\`：NYT, Medium — 排版层次分明、阅读体验优先
- \`ecommerce\`：Shopify, Stripe — 信任感、清晰的 CTA、产品展示
- \`developer-docs\`：Vercel, Tailwind Docs — 代码友好、信息层次清晰
- \`playful-brand\`：Mailchimp, Linear（旧版）— 有个性、微动效、插画
- \`startup-landing\`：典型 SaaS 落地页 — hero section、feature grid、CTA

如果不符合以上任何一种，用一个自定义的 archetype 名称。

${langInstruction}

## 输出格式

你必须且只能输出一个合法的 JSON 对象。不要输出任何解释文字，不要用 markdown 代码块包裹，不要在 JSON 前后添加任何内容。第一个字符必须是 {，最后一个字符必须是 }。

JSON 结构如下：

{
  "frontmatter": {
    "schema": "vibe-thief/1.0",
    "source": "原始 URL",
    "extracted_at": "ISO 时间",
    "confidence": 0.85,
    "generator": "vibe-thief@0.1.0",
    "mood": "2-3个词描述整体情绪",
    "style_archetype": "风格原型标识符"
  },
  "narrative": {
    "philosophy": "50-150字的设计哲学描述，要像一个资深设计师在向新人解释这个系统",
    "keywords": ["词1", "词2", "词3", "词4", "词5"]
  },
  "colors": {
    "background_layers": [
      { "token": "bg-void", "value": "#0A0A0B", "usage": "页面最底层背景" }
    ],
    "signal_colors": [
      { "token": "signal-primary", "value": "#5E6AD2", "usage": "主按钮、选中态、关键链接" }
    ],
    "text_hierarchy": [
      { "token": "text-primary", "value": "#EDEDEC", "usage": "标题、关键信息" }
    ],
    "philosophy": "一段话解释色彩策略"
  },
  "typography": {
    "font_stack": { "heading": "字体名", "body": "字体名", "mono": "字体名" },
    "scale": [
      { "token": "text-heading", "size": "20px", "weight": 600, "usage": "页面标题" }
    ],
    "philosophy": "一段话解释排版策略"
  },
  "spacing": {
    "base_unit": "4px",
    "scale": [
      { "token": "space-tight", "value": "4px", "usage": "图标与文字" }
    ],
    "philosophy": "一段话解释间距策略"
  },
  "depth": {
    "border_radius": [
      { "token": "radius-card", "value": "6px", "usage": "卡片" }
    ],
    "shadows": [
      { "token": "shadow-dropdown", "value": "0 4px 12px rgba(0,0,0,0.4)", "usage": "下拉菜单" }
    ],
    "borders": [
      { "token": "border-subtle", "value": "1px solid #222229", "usage": "卡片边框" }
    ],
    "philosophy": "一段话解释深度/层级表达策略（用阴影？用颜色？用边框？）"
  },
  "motion": {
    "tokens": [
      { "token": "motion-fast", "duration": "150ms", "easing": "ease-out", "usage": "hover 反馈" }
    ],
    "philosophy": "一段话解释动效策略"
  },
  "components": [
    {
      "name": "Button",
      "description": "按钮组件描述",
      "default": { "bg": "值", "color": "值", "border-radius": "值", "height": "28px" },
      "hover": { "bg": "值" },
      "focus": { "outline": "值" },
      "variants": [
        { "name": "Primary", "properties": { "bg": "信号色" } },
        { "name": "Secondary", "properties": { "bg": "transparent", "border": "1px solid ..." } }
      ]
    }
  ],
  "interactions": {
    "hover_style": "描述",
    "focus_style": "描述",
    "active_style": "描述",
    "loading_style": "描述",
    "transition_speed": "描述"
  },
  "layout": {
    "max_width": "1200px",
    "grid": { "columns": 12, "gap": "24px" },
    "breakpoints": [{ "name": "sm", "value": "640px" }],
    "philosophy": "一段话解释布局策略"
  },
  "agent_guide": {
    "do": ["具体的可执行建议1", "建议2"],
    "dont": ["具体的禁止事项1", "禁止事项2"],
    "snippets": [
      { "scenario": "创建主按钮", "description": "用信号色作为背景", "example": "background: #5E6AD2; color: white; border-radius: 6px; height: 28px;" }
    ]
  }
}
\`\`\`

## 组件模式提取指南

从 CSS 数据和视觉分析中推断以下组件（如果数据足够）：
- **Button**：从 button 元素的 computed style 推断
- **Input**：从 input/textarea 推断
- **Card**：从有背景色+边框+圆角的容器推断
- **Navigation**：从 nav/header 推断
- **List/Table**：从 table/ul 推断

每个组件至少要有 default 态。如果有视觉分析数据，补充 hover/focus 态。

## Agent 指南提取指南

Do/Don't 列表应该包含 5-8 条，每条都要具体可执行：
- ✅ Do: "用背景色层级表达深度，而非阴影"
- ❌ Don't: "不要在卡片上加超过 4px 的圆角"

Snippets 应该包含 3-5 个常见场景：
- 创建主按钮
- 创建卡片
- 创建输入框
- 设置页面布局
`;

  const user = `以下是提取的设计数据：

【Token 数据（Stage 1 分析结果）】
\`\`\`json
${JSON.stringify(tokenData, null, 2)}
\`\`\`
${visionData ? `
【视觉感知分析】
\`\`\`json
${JSON.stringify(visionData, null, 2)}
\`\`\`` : '\n（无视觉感知数据，基于 token 数据推断）'}

请根据以上数据，生成完整的设计文档 JSON。`;

  return { system, user };
}
