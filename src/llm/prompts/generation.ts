/**
 * Stage 2: 设计文档生成
 *
 * 基于 Stage 1 的结构化分析结果，生成完整的 DESIGN.md JSON。
 *
 * 核心原则：
 * - 给 Agent 的是"可执行的设计代码"，不是"描述性语言"
 * - CSS/JS 代码片段可以直接复用
 * - 设计感觉要描述清楚，但不要教 Agent "你是谁"
 */

import type { VisionAnalysis } from '../../types/extraction.js';

/** Stage 2 prompt 入口 */
export function buildGenerationPrompt(
  tokenData: Record<string, unknown>,
  visionData: VisionAnalysis | null,
  language: 'zh' | 'en'
): { system: string; user: string } {
  const system = getSystemPrompt(language);
  const user = buildUserPrompt(tokenData, visionData);
  return { system, user };
}

function getSystemPrompt(lang: string): string {
  if (lang === 'zh') {
    return `你是一个设计系统提取专家。你的任务是将 Stage 1 分析的结构化数据转换为一个高质量的 DESIGN.md 文档。

这个文档的消费者是 AI Coding Agent（如 Cursor），它会根据这个文档来设计 UI。所以文档需要：
1. 描述清楚目标网站的"设计感觉"（不需要教 Agent "你是谁"，只需描述目标网站看起来是什么感觉）
2. 提供精确的 Token 数值（色彩、排版、间距等）
3. 描述页面结构（区块顺序、每块放什么内容）
4. 提供可直接复用的 CSS/JS 代码片段（动画、交互、组件样式）
5. 描述媒体素材的呈现方式（图片/视频怎么展示）

你必须输出一个合法的 JSON 对象，不要输出任何其他文字，不要用 markdown 代码块包裹。

JSON 结构如下：

{
  "design_feeling": "2-4 段话描述目标网站的视觉感受。包括：整体氛围（冷/暖、活泼/沉稳）、色彩情绪、排版节奏感、空间密度感、高级感来源。不要泛泛而谈，要具体描述这个网站独有的设计特征。",

  "colors": {
    "background_layers": [
      {"token": "bg-primary", "value": "#0A0A0A", "usage": "主背景"},
      {"token": "bg-secondary", "value": "#111111", "usage": "卡片/区块背景"}
    ],
    "signal_colors": [
      {"token": "accent", "value": "#5E6AD2", "usage": "按钮、链接、关键数据"}
    ],
    "text_hierarchy": [
      {"token": "text-primary", "value": "#FFFFFF", "usage": "标题"},
      {"token": "text-secondary", "value": "#888888", "usage": "正文/描述"}
    ],
    "border_colors": [
      {"token": "border", "value": "#222222", "usage": "分割线、卡片边框"}
    ],
    "philosophy": "一句话描述色彩使用哲学"
  },

  "typography": {
    "font_stack": {
      "heading": "Inter, system-ui, sans-serif",
      "body": "Inter, system-ui, sans-serif",
      "mono": "JetBrains Mono, monospace"
    },
    "scale": [
      {"token": "display", "size": "64px", "weight": 700, "lineHeight": "1.05", "letterSpacing": "-0.03em", "usage": "Hero 大标题"},
      {"token": "h1", "size": "40px", "weight": 600, "lineHeight": "1.2", "usage": "页面主标题"},
      {"token": "h2", "size": "28px", "weight": 600, "lineHeight": "1.3", "usage": "章节标题"},
      {"token": "body", "size": "16px", "weight": 400, "lineHeight": "1.6", "usage": "正文"},
      {"token": "small", "size": "13px", "weight": 400, "lineHeight": "1.5", "usage": "辅助文字"}
    ],
    "philosophy": "一句话描述排版哲学"
  },

  "spacing": {
    "base_unit": "4px",
    "scale": [
      {"token": "xs", "value": "4px", "usage": "紧凑元素内部"},
      {"token": "sm", "value": "8px", "usage": "元素内部间距"},
      {"token": "md", "value": "16px", "usage": "组件内部"},
      {"token": "lg", "value": "24px", "usage": "组件之间"},
      {"token": "xl", "value": "48px", "usage": "区块内部"},
      {"token": "2xl", "value": "96px", "usage": "区块之间"}
    ],
    "philosophy": "一句话描述间距哲学"
  },

  "depth": {
    "border_radius": [
      {"token": "sm", "value": "4px", "usage": "按钮、输入框"},
      {"token": "md", "value": "8px", "usage": "卡片"},
      {"token": "lg", "value": "16px", "usage": "大容器"}
    ],
    "shadows": [
      {"token": "subtle", "value": "0 1px 3px rgba(0,0,0,0.1)", "usage": "卡片默认"},
      {"token": "elevated", "value": "0 8px 30px rgba(0,0,0,0.12)", "usage": "hover/浮层"}
    ],
    "borders": [
      {"token": "default", "value": "1px solid #222", "usage": "分割线、边框"}
    ],
    "philosophy": "一句话描述深度哲学"
  },

  "page_structure": [
    {
      "name": "Hero",
      "purpose": "第一印象，传达核心价值",
      "elements": ["大标题", "副标题", "CTA 按钮"],
      "layout": "居中单列，全屏高度",
      "notes": "标题 64-80px，下方 48px 间距"
    }
  ],

  "css_code": [
    {
      "purpose": "代码用途描述",
      "css": "完整的 CSS 代码"
    }
  ],

  "js_code": [
    {
      "purpose": "代码用途描述",
      "js": "完整的 JS 代码"
    }
  ],

  "media_presentation": {
    "imageStyle": "图片类型和风格",
    "imageContainer": "图片容器样式",
    "videoStyle": "视频呈现方式",
    "iconStyle": "图标风格"
  },

  "agent_guide": {
    "do": ["应该做的"],
    "dont": ["不应该做的"]
  }
}

注意：
1. "design_feeling" 要具体描述这个网站独有的设计特征，不要写泛泛的套话
2. "css_code" 中的代码要从 Stage 1 提取的 CSS 数据中提炼，包含：@keyframes 动画、hover/focus 交互、组件样式、布局模式。如果 Stage 1 有提取到的 keyframes 和 hover 规则，直接使用或适配后使用
3. "page_structure" 要基于 Stage 1 提取的页面 DOM 结构来描述
4. 所有 CSS 代码中的变量（如 var(--bg-primary)）要和 colors 部分的 token 对应
5. "js_code" 包含交互逻辑，如滚动触发动画、平滑滚动等`;
  }

  return `You are a design system extraction expert. Convert Stage 1 analysis into a DESIGN.md JSON document.

This document is consumed by AI Coding Agents (like Cursor) to design UI. Output a valid JSON object, no markdown code blocks.

The JSON must include: design_feeling, colors, typography, spacing, depth, page_structure, css_code, js_code, media_presentation, agent_guide.

Key rules:
1. "design_feeling": Describe the target site's visual feel (2-4 paragraphs), don't teach the agent "who it is"
2. "css_code": Include reusable CSS snippets for animations, interactions, components, layouts
3. "page_structure": Section order with content elements per section
4. "media_presentation": How images/videos are presented (style, container, treatment)
5. All CSS code should use CSS variables that match the color tokens`;
}

function buildUserPrompt(tokenData: Record<string, unknown>, visionData: VisionAnalysis | null): string {
  // 提取 CSS 代码数据（从 enriched tokenData 中）
  const cssCode = (tokenData as any)._cssCode;
  const pageStructure = (tokenData as any)._pageStructure;

  // 从 tokenData 中移除内部数据，避免传给 LLM
  const cleanTokenData = { ...tokenData };
  delete cleanTokenData._cssCode;
  delete cleanTokenData._pageStructure;

  return `以下是 Stage 1 分析的设计系统数据，请将其转换为完整的 DESIGN.md JSON 文档。

Stage 1 分析结果:
${JSON.stringify(cleanTokenData, null, 2)}

${visionData ? `视觉感知分析:
${JSON.stringify(visionData, null, 2)}` : '（无视觉感知分析数据）'}

${cssCode ? `【CSS 代码级提取 — 用于 css_code 部分】
@keyframes 动画 (${cssCode.keyframes.length} 个):
${cssCode.keyframes.map((k: any) => k.cssText).join('\n')}

Hover 规则 (${cssCode.hoverRules.length} 个):
${JSON.stringify(cssCode.hoverRules.slice(0, 10), null, 2)}

Transition 规则 (${cssCode.transitionRules.length} 个):
${JSON.stringify(cssCode.transitionRules.slice(0, 10), null, 2)}

布局模式 (${cssCode.layoutPatterns.length} 个):
${JSON.stringify(cssCode.layoutPatterns.slice(0, 10), null, 2)}

组件样式 (${cssCode.componentStyles.length} 个):
${JSON.stringify(cssCode.componentStyles.slice(0, 15), null, 2)}
` : ''}

${pageStructure ? `【页面 DOM 结构 — 用于 page_structure 部分】
${JSON.stringify(pageStructure, null, 2)}
` : ''}

重要：
- css_code 部分请基于上面的 CSS 代码级提取来生成，直接使用或适配从目标网站提取的 @keyframes、hover 交互、组件样式
- page_structure 部分请基于上面的页面 DOM 结构来生成
- design_feeling 要具体描述这个网站独有的设计特征`;
}
