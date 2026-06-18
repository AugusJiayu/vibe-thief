/**
 * 输出层：渲染 DesignSystemDoc → Markdown
 *
 * 生成的 DESIGN.md 结构：
 * 1. 设计感觉
 * 2. Design Tokens（色彩、排版、间距、深度）
 * 3. 页面结构
 * 4. CSS/JS 代码片段
 * 5. 媒体呈现规则
 * 6. Agent 使用指南
 */

import type { DesignSystemDoc } from '../types/design-doc.js';

/** 渲染完整 DESIGN.md */
export function renderDesignDoc(doc: DesignSystemDoc): string {
  const sections = [
    renderFrontmatter(doc),
    renderDesignFeeling(doc),
    renderColors(doc),
    renderTypography(doc),
    renderSpacing(doc),
    renderDepth(doc),
    renderPageStructure(doc),
    renderCSSCode(doc),
    renderJSCode(doc),
    renderMediaPresentation(doc),
    renderAgentGuide(doc),
  ];

  return sections.filter(Boolean).join('\n\n---\n\n');
}

/** YAML frontmatter */
function renderFrontmatter(doc: DesignSystemDoc): string {
  const fm = doc.frontmatter;
  return `---
schema: "${fm.schema}"
source: "${fm.source}"
extracted_at: "${fm.extracted_at}"
confidence: ${fm.confidence}
generator: "${fm.generator}"
mood: "${fm.mood}"
style_archetype: "${fm.style_archetype}"
---`;
}

/** 设计感觉 */
function renderDesignFeeling(doc: DesignSystemDoc): string {
  return `# Design System

## 设计感觉

${doc.design_feeling}`;
}

/** 色彩系统 */
function renderColors(doc: DesignSystemDoc): string {
  const c = doc.colors;
  const parts: string[] = ['## Colors\n'];

  if (c.philosophy) {
    parts.push(`> ${c.philosophy}\n`);
  }

  if (c.background_layers.length > 0) {
    parts.push('### Background Layers');
    parts.push('| Token | Value | Usage |');
    parts.push('|-------|-------|-------|');
    for (const r of c.background_layers) {
      parts.push(`| \`${r.token}\` | \`${r.value}\` | ${r.usage} |`);
    }
    parts.push('');
  }

  if (c.text_hierarchy.length > 0) {
    parts.push('### Text Hierarchy');
    parts.push('| Token | Value | Usage |');
    parts.push('|-------|-------|-------|');
    for (const r of c.text_hierarchy) {
      parts.push(`| \`${r.token}\` | \`${r.value}\` | ${r.usage} |`);
    }
    parts.push('');
  }

  if (c.signal_colors.length > 0) {
    parts.push('### Signal Colors');
    parts.push('| Token | Value | Usage |');
    parts.push('|-------|-------|-------|');
    for (const r of c.signal_colors) {
      parts.push(`| \`${r.token}\` | \`${r.value}\` | ${r.usage} |`);
    }
    parts.push('');
  }

  if (c.border_colors && c.border_colors.length > 0) {
    parts.push('### Border Colors');
    parts.push('| Token | Value | Usage |');
    parts.push('|-------|-------|-------|');
    for (const r of c.border_colors) {
      parts.push(`| \`${r.token}\` | \`${r.value}\` | ${r.usage} |`);
    }
    parts.push('');
  }

  return parts.join('\n');
}

/** 排版系统 */
function renderTypography(doc: DesignSystemDoc): string {
  const t = doc.typography;
  const parts: string[] = ['## Typography\n'];

  if (t.philosophy) {
    parts.push(`> ${t.philosophy}\n`);
  }

  parts.push('### Font Stack');
  parts.push('| Role | Family |');
  parts.push('|------|--------|');
  parts.push(`| Heading | \`${t.font_stack.heading}\` |`);
  parts.push(`| Body | \`${t.font_stack.body}\` |`);
  parts.push(`| Code | \`${t.font_stack.mono}\` |`);
  parts.push('');

  if (t.scale.length > 0) {
    parts.push('### Type Scale');
    parts.push('| Token | Size | Weight | Line Height | Letter Spacing | Usage |');
    parts.push('|-------|------|--------|-------------|----------------|-------|');
    for (const s of t.scale) {
      parts.push(`| \`${s.token}\` | \`${s.size}\` | ${s.weight} | ${s.lineHeight} | ${s.letterSpacing || '-'} | ${s.usage} |`);
    }
    parts.push('');
  }

  return parts.join('\n');
}

/** 间距系统 */
function renderSpacing(doc: DesignSystemDoc): string {
  const s = doc.spacing;
  const parts: string[] = ['## Spacing\n'];

  if (s.philosophy) {
    parts.push(`> ${s.philosophy}\n`);
  }

  parts.push(`Base unit: \`${s.base_unit}\`\n`);

  if (s.scale.length > 0) {
    parts.push('### Scale');
    parts.push('| Token | Value | Usage |');
    parts.push('|-------|-------|-------|');
    for (const v of s.scale) {
      parts.push(`| \`${v.token}\` | ${v.value} | ${v.usage} |`);
    }
    parts.push('');
  }

  return parts.join('\n');
}

/** 深度系统 */
function renderDepth(doc: DesignSystemDoc): string {
  const d = doc.depth;
  const parts: string[] = ['## Depth & Hierarchy\n'];

  if (d.philosophy) {
    parts.push(`> ${d.philosophy}\n`);
  }

  if (d.border_radius.length > 0) {
    parts.push('### Border Radius');
    parts.push('| Token | Value | Usage |');
    parts.push('|-------|-------|-------|');
    for (const r of d.border_radius) {
      parts.push(`| \`${r.token}\` | ${r.value} | ${r.usage} |`);
    }
    parts.push('');
  }

  if (d.shadows.length > 0) {
    parts.push('### Shadows');
    parts.push('| Token | Value | Usage |');
    parts.push('|-------|-------|-------|');
    for (const s of d.shadows) {
      parts.push(`| \`${s.token}\` | ${s.value} | ${s.usage} |`);
    }
    parts.push('');
  }

  if (d.borders.length > 0) {
    parts.push('### Borders');
    parts.push('| Token | Value | Usage |');
    parts.push('|-------|-------|-------|');
    for (const b of d.borders) {
      parts.push(`| \`${b.token}\` | ${b.value} | ${b.usage} |`);
    }
    parts.push('');
  }

  return parts.join('\n');
}

/** 页面结构 */
function renderPageStructure(doc: DesignSystemDoc): string {
  if (!doc.page_structure || doc.page_structure.length === 0) return '';

  const parts: string[] = ['## Page Structure\n'];
  parts.push('页面区块按以下顺序排列：\n');

  for (let i = 0; i < doc.page_structure.length; i++) {
    const sec = doc.page_structure[i];
    parts.push(`### ${i + 1}. ${sec.name}`);
    parts.push(`**用途**: ${sec.purpose}`);
    parts.push(`**包含元素**: ${sec.elements.join('、')}`);
    parts.push(`**布局**: ${sec.layout}`);
    if (sec.notes) {
      parts.push(`**说明**: ${sec.notes}`);
    }
    parts.push('');
  }

  return parts.join('\n');
}

/** CSS 代码片段 */
function renderCSSCode(doc: DesignSystemDoc): string {
  if (!doc.css_code || doc.css_code.length === 0) return '';

  const parts: string[] = ['## CSS Code\n'];
  parts.push('以下 CSS 代码片段可直接复用：\n');

  for (const block of doc.css_code) {
    parts.push(`### ${block.purpose}`);
    parts.push('```css');
    parts.push(block.css);
    parts.push('```\n');
  }

  return parts.join('\n');
}

/** JS 代码片段 */
function renderJSCode(doc: DesignSystemDoc): string {
  if (!doc.js_code || doc.js_code.length === 0) return '';

  const parts: string[] = ['## JS Code\n'];
  parts.push('以下 JS 代码片段用于交互逻辑：\n');

  for (const block of doc.js_code) {
    parts.push(`### ${block.purpose}`);
    parts.push('```javascript');
    parts.push(block.js);
    parts.push('```\n');
  }

  return parts.join('\n');
}

/** 媒体呈现规则 */
function renderMediaPresentation(doc: DesignSystemDoc): string {
  const m = doc.media_presentation;
  if (!m) return '';

  const parts: string[] = ['## Media Presentation\n'];

  parts.push(`### 图片风格\n${m.imageStyle}\n`);
  parts.push(`### 图片容器\n${m.imageContainer}\n`);
  parts.push(`### 视频呈现\n${m.videoStyle}\n`);
  parts.push(`### 图标风格\n${m.iconStyle}\n`);

  if (m.other) {
    parts.push(`### 其他\n${m.other}\n`);
  }

  return parts.join('\n');
}

/** Agent 使用指南 */
function renderAgentGuide(doc: DesignSystemDoc): string {
  const g = doc.agent_guide;
  if (!g) return '';

  const parts: string[] = ['## Agent Guide\n'];

  if (g.do.length > 0) {
    parts.push('### ✅ Do');
    for (const item of g.do) {
      parts.push(`- ${item}`);
    }
    parts.push('');
  }

  if (g.dont.length > 0) {
    parts.push('### ❌ Don\'t');
    for (const item of g.dont) {
      parts.push(`- ${item}`);
    }
    parts.push('');
  }

  return parts.join('\n');
}
