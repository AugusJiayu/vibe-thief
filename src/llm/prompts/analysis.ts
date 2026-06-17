/**
 * 阶段 1 Prompt：结构化分析
 * 将 CSS 硬数据 + 像素数据对齐，输出结构化 JSON
 */

import type { CSSExtraction, PixelExtraction } from '../../types/extraction.js';

export function buildAnalysisPrompt(
  cssData: CSSExtraction,
  pixelData: PixelExtraction | null
): { system: string; user: string } {
  const system = `你是一个设计系统分析专家。你的任务是将从网页提取的原始 CSS 数据和像素分析数据整合为结构化的 Design Token。

规则：
1. 识别主色、辅色、强调色、中性色、背景色、文字色，优先使用 CSS Variables 中的定义
2. 从字号列表中推断 type scale 规律（如 Major Third 1.25, Perfect Fourth 1.333 等）
3. 从间距值列表中推断 spacing base unit 和倍数关系
4. 为每个 token 生成语义名称和用途描述
5. 如果 CSS 数据和像素数据有冲突，以 CSS 数据为准，但在 notes 中标注冲突
6. 你必须且只能输出一个合法的 JSON 对象，不要用 markdown 代码块包裹，第一个字符必须是 {

输出 JSON 结构：
{
  "colors": {
    "primary": { "value": "#hex", "name": "名称", "cssVariable": "--var-name", "usage": "用途" },
    "secondary": { ... },
    "accent": { ... },
    "neutral": [{ "value": "#hex", "name": "名称", "usage": "用途" }],
    "background": { ... },
    "surface": { ... },
    "text": { "primary": { ... }, "secondary": { ... }, "disabled": { ... } },
    "semantic": { "success": { ... }, "warning": { ... }, "error": { ... }, "info": { ... } }
  },
  "typography": {
    "fontFamily": { "heading": "font-name", "body": "font-name", "mono": "font-name" },
    "scale": [{ "name": "xs|sm|base|lg|xl|2xl|...", "size": "16px", "weight": 400, "lineHeight": "1.5", "usage": "用途" }]
  },
  "spacing": {
    "baseUnit": "4px",
    "scale": [{ "name": "1|2|3|4|...", "value": "4px" }]
  },
  "borderRadius": {
    "none": "0", "sm": "4px", "md": "8px", "lg": "12px", "xl": "16px", "full": "9999px"
  },
  "shadows": {
    "sm": "...", "md": "...", "lg": "...", "xl": "..."
  },
  "borders": {
    "thin": "1px", "default": "1px", "thick": "2px"
  },
  "layout": {
    "maxWidth": "1200px", "gridColumns": 12, "gridGap": "24px",
    "breakpoints": [{ "name": "sm", "value": "640px" }]
  },
  "motion": {
    "fast": "150ms", "normal": "250ms", "slow": "400ms",
    "easing": { "default": "ease", "in": "ease-in", "out": "ease-out" }
  },
  "notes": ["任何冲突或不确定的地方"]
}`;

  // 限制数据量，避免 LLM 输出被截断
  const trimmedCSS = {
    ...cssData,
    colors: {
      raw: cssData.colors.raw.slice(0, 15),
      cssVariables: cssData.colors.cssVariables,
    },
    typography: {
      fontFamilies: cssData.typography.fontFamilies.slice(0, 5),
      fontSizes: cssData.typography.fontSizes.slice(0, 10),
      fontWeights: cssData.typography.fontWeights.slice(0, 6),
      lineHeights: cssData.typography.lineHeights.slice(0, 5),
    },
    spacing: {
      values: cssData.spacing.values.slice(0, 10),
      detectedBaseUnit: cssData.spacing.detectedBaseUnit,
    },
    borders: {
      radii: cssData.borders.radii.slice(0, 6),
      widths: cssData.borders.widths.slice(0, 4),
      styles: cssData.borders.styles.slice(0, 3),
    },
    shadows: { values: cssData.shadows.values.slice(0, 5) },
    breakpoints: cssData.breakpoints,
    rawCSSVariables: cssData.rawCSSVariables,
  };

  const user = `以下是提取的原始数据：

【CSS 提取数据】
\`\`\`json
${JSON.stringify(trimmedCSS, null, 2)}
\`\`\`
${pixelData ? `
【像素分析数据】
\`\`\`json
${JSON.stringify(pixelData, null, 2)}
\`\`\`` : '\n（无像素分析数据）'}

请分析以上数据，输出结构化的 Design Token JSON。`;

  return { system, user };
}
