/**
 * 输出层：将 DesignSystemDoc 渲染为高质量 DESIGN.md
 */

import type { DesignSystemDoc, ComponentPattern, MotionLanguage, VisualLanguage } from '../types/design-doc.js';
import { logger } from '../utils/logger.js';

/**
 * 将 DesignSystemDoc 渲染为 DESIGN.md
 */
export function renderDesignDoc(doc: DesignSystemDoc): string {
  logger.info('Rendering DESIGN.md...');

  const sections: string[] = [];

  sections.push(renderFrontmatter(doc));
  sections.push(renderTitle(doc));
  sections.push(renderNarrative(doc));
  sections.push(renderVisualVocabulary(doc));
  sections.push(renderColors(doc));
  sections.push(renderTypography(doc));
  sections.push(renderSpacing(doc));
  sections.push(renderDepth(doc));
  sections.push(renderMotion(doc));
  sections.push(renderMotionLanguage(doc.motion_language));
  sections.push(renderVisualLanguage(doc.visual_language));
  sections.push(renderComponents(doc));
  sections.push(renderInteractions(doc));
  sections.push(renderLayout(doc));
  sections.push(renderAgentGuide(doc));

  return sections.join('\n');
}

function renderFrontmatter(doc: DesignSystemDoc): string {
  return `---
schema: "${doc.frontmatter.schema}"
source: "${doc.frontmatter.source}"
extracted_at: "${doc.frontmatter.extracted_at}"
confidence: ${doc.frontmatter.confidence}
generator: "${doc.frontmatter.generator}"
mood: "${doc.frontmatter.mood}"
style_archetype: "${doc.frontmatter.style_archetype}"
---\n`;
}

function renderTitle(doc: DesignSystemDoc): string {
  const siteName = extractSiteName(doc.frontmatter.source);
  return `\n# Design System: ${siteName}\n`;
}

function renderNarrative(doc: DesignSystemDoc): string {
  const lines: string[] = [];
  lines.push('## Design Narrative\n');
  lines.push(doc.narrative.philosophy + '\n');
  if (doc.narrative.keywords.length > 0) {
    lines.push('**风格关键词**: ' + doc.narrative.keywords.map(k => `\`${k}\``).join(' ') + '\n');
  }
  return lines.join('\n');
}

function renderVisualVocabulary(doc: DesignSystemDoc): string {
  const lines: string[] = [];
  lines.push('## Visual Vocabulary\n');

  if (doc.colors.philosophy) {
    lines.push('### 色彩哲学');
    lines.push(doc.colors.philosophy + '\n');
  }

  if (doc.typography.philosophy) {
    lines.push('### 排版哲学');
    lines.push(doc.typography.philosophy + '\n');
  }

  if (doc.spacing.philosophy) {
    lines.push('### 留白哲学');
    lines.push(doc.spacing.philosophy + '\n');
  }

  if (doc.depth.philosophy) {
    lines.push('### 深度哲学');
    lines.push(doc.depth.philosophy + '\n');
  }

  return lines.join('\n');
}

function renderColors(doc: DesignSystemDoc): string {
  const lines: string[] = [];
  lines.push('## Design Tokens\n');
  lines.push('### Colors\n');

  // 背景层级
  if (doc.colors.background_layers.length > 0) {
    lines.push('#### Background Layers（表达页面深度结构）');
    lines.push('| Token | Value | Usage |');
    lines.push('|-------|-------|-------|');
    for (const c of doc.colors.background_layers) {
      lines.push(`| \`${c.token}\` | \`${c.value}\` | ${c.usage} |`);
    }
    lines.push('');
  }

  // 信号色
  if (doc.colors.signal_colors.length > 0) {
    lines.push('#### Signal Colors（仅用于需要用户注意的地方）');
    lines.push('| Token | Value | Usage |');
    lines.push('|-------|-------|-------|');
    for (const c of doc.colors.signal_colors) {
      lines.push(`| \`${c.token}\` | \`${c.value}\` | ${c.usage} |`);
    }
    lines.push('');
  }

  // 文字层级
  if (doc.colors.text_hierarchy.length > 0) {
    lines.push('#### Text Hierarchy');
    lines.push('| Token | Value | Usage |');
    lines.push('|-------|-------|-------|');
    for (const c of doc.colors.text_hierarchy) {
      lines.push(`| \`${c.token}\` | \`${c.value}\` | ${c.usage} |`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

function renderTypography(doc: DesignSystemDoc): string {
  const lines: string[] = [];
  lines.push('### Typography\n');

  // Font Stack
  lines.push('#### Font Stack');
  lines.push('| Role | Family |');
  lines.push('|------|--------|');
  if (doc.typography.font_stack.heading) lines.push(`| Heading | \`${doc.typography.font_stack.heading}\` |`);
  if (doc.typography.font_stack.body) lines.push(`| Body | \`${doc.typography.font_stack.body}\` |`);
  if (doc.typography.font_stack.mono) lines.push(`| Code | \`${doc.typography.font_stack.mono}\` |`);
  lines.push('');

  // Type Scale
  if (doc.typography.scale.length > 0) {
    lines.push('#### Type Scale');
    lines.push('| Token | Size | Weight | Usage |');
    lines.push('|-------|------|--------|-------|');
    for (const s of doc.typography.scale) {
      lines.push(`| \`${s.token}\` | \`${s.size}\` | ${s.weight} | ${s.usage} |`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

function renderSpacing(doc: DesignSystemDoc): string {
  const lines: string[] = [];
  lines.push('### Spacing\n');
  lines.push(`Base: \`${doc.spacing.base_unit}\`\n`);

  if (doc.spacing.scale.length > 0) {
    lines.push('| Token | Value | Usage |');
    lines.push('|-------|-------|-------|');
    for (const s of doc.spacing.scale) {
      lines.push(`| \`${s.token}\` | \`${s.value}\` | ${s.usage} |`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

function renderDepth(doc: DesignSystemDoc): string {
  const lines: string[] = [];
  lines.push('### Depth & Hierarchy\n');

  // Border Radius
  if (doc.depth.border_radius.length > 0) {
    lines.push('#### Border Radius');
    lines.push('| Token | Value | Usage |');
    lines.push('|-------|-------|-------|');
    for (const r of doc.depth.border_radius) {
      lines.push(`| \`${r.token}\` | \`${r.value}\` | ${r.usage} |`);
    }
    lines.push('');
  }

  // Shadows
  if (doc.depth.shadows.length > 0) {
    lines.push('#### Shadows');
    lines.push('| Token | Value | Usage |');
    lines.push('|-------|-------|-------|');
    for (const s of doc.depth.shadows) {
      lines.push(`| \`${s.token}\` | \`${s.value}\` | ${s.usage} |`);
    }
    lines.push('');
  }

  // Borders
  if (doc.depth.borders.length > 0) {
    lines.push('#### Borders');
    lines.push('| Token | Value | Usage |');
    lines.push('|-------|-------|-------|');
    for (const b of doc.depth.borders) {
      lines.push(`| \`${b.token}\` | \`${b.value}\` | ${b.usage} |`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

function renderMotion(doc: DesignSystemDoc): string {
  const lines: string[] = [];
  lines.push('### Motion\n');

  if (doc.motion.tokens.length > 0) {
    lines.push('| Token | Duration | Easing | Usage |');
    lines.push('|-------|----------|--------|-------|');
    for (const m of doc.motion.tokens) {
      lines.push(`| \`${m.token}\` | \`${m.duration}\` | \`${m.easing}\` | ${m.usage} |`);
    }
    lines.push('');
  }

  if (doc.motion.philosophy) {
    lines.push(`> ${doc.motion.philosophy}\n`);
  }

  return lines.join('\n');
}

function renderMotionLanguage(ml: MotionLanguage): string {
  if (!ml) return '';
  const lines: string[] = [];
  lines.push('## Motion Language\n');

  lines.push('### 滚动行为');
  lines.push(ml.scroll_behavior + '\n');

  lines.push('### 交互反馈');
  lines.push(ml.interaction_feedback + '\n');

  lines.push('### 页面转场');
  lines.push(ml.page_transitions + '\n');

  lines.push('### 微交互');
  lines.push(ml.micro_interactions + '\n');

  lines.push('### 动效性格');
  lines.push('> ' + ml.motion_personality + '\n');

  return lines.join('\n');
}

function renderVisualLanguage(vl: VisualLanguage): string {
  if (!vl) return '';
  const lines: string[] = [];
  lines.push('## Visual Language\n');

  lines.push('### 布局哲学');
  lines.push(vl.layout_philosophy + '\n');

  lines.push('### 图像使用');
  lines.push(vl.imagery_style + '\n');

  lines.push('### 图标风格');
  lines.push(vl.icon_style + '\n');

  lines.push('### 信息密度');
  lines.push(vl.information_density + '\n');

  if (vl.brand_personality && vl.brand_personality.length > 0) {
    lines.push('### 品牌个性');
    lines.push(vl.brand_personality.map(p => `\`${p}\``).join(' ') + '\n');
  }

  return lines.join('\n');
}

function renderComponents(doc: DesignSystemDoc): string {
  if (doc.components.length === 0) return '';

  const lines: string[] = [];
  lines.push('## Component Patterns\n');

  for (const comp of doc.components) {
    lines.push(`### ${comp.name}\n`);
    if (comp.description) {
      lines.push(comp.description + '\n');
    }

    // Default 态
    lines.push('**Default:**');
    lines.push(renderPropsTable(comp.default));
    lines.push('');

    // 状态变体
    const states = ['hover', 'focus', 'active', 'disabled'] as const;
    for (const state of states) {
      if (comp[state] && Object.keys(comp[state]!).length > 0) {
        lines.push(`**${state.charAt(0).toUpperCase() + state.slice(1)}:**`);
        lines.push(renderPropsTable(comp[state]!));
        lines.push('');
      }
    }

    // 风格变体
    if (comp.variants && comp.variants.length > 0) {
      lines.push('**Variants:**');
      for (const v of comp.variants) {
        lines.push(`- **${v.name}**: ${renderPropsInline(v.properties)}`);
      }
      lines.push('');
    }
  }

  return lines.join('\n');
}

function renderInteractions(doc: DesignSystemDoc): string {
  const lines: string[] = [];
  lines.push('## Interaction Patterns\n');
  lines.push('| State | Style |');
  lines.push('|-------|-------|');
  lines.push(`| Hover | ${doc.interactions.hover_style} |`);
  lines.push(`| Focus | ${doc.interactions.focus_style} |`);
  lines.push(`| Active | ${doc.interactions.active_style} |`);
  lines.push(`| Loading | ${doc.interactions.loading_style} |`);
  lines.push(`| Transition | ${doc.interactions.transition_speed} |`);
  lines.push('');
  return lines.join('\n');
}

function renderLayout(doc: DesignSystemDoc): string {
  const lines: string[] = [];
  lines.push('## Layout\n');

  if (doc.layout.philosophy) {
    lines.push(doc.layout.philosophy + '\n');
  }

  lines.push('| Property | Value |');
  lines.push('|----------|-------|');
  if (doc.layout.max_width) lines.push(`| Max Width | \`${doc.layout.max_width}\` |`);
  if (doc.layout.grid) {
    lines.push(`| Grid Columns | ${doc.layout.grid.columns} |`);
    lines.push(`| Grid Gap | \`${doc.layout.grid.gap}\` |`);
  }
  lines.push('');

  if (doc.layout.breakpoints.length > 0) {
    lines.push('### Breakpoints');
    lines.push('| Name | Min Width |');
    lines.push('|------|-----------|');
    for (const bp of doc.layout.breakpoints) {
      lines.push(`| \`${bp.name}\` | \`${bp.value}\` |`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

function renderAgentGuide(doc: DesignSystemDoc): string {
  const lines: string[] = [];
  lines.push('## Agent Usage Guide\n');

  // Do
  lines.push('### ✅ Do');
  for (const item of doc.agent_guide.do) {
    lines.push(`- ${item}`);
  }
  lines.push('');

  // Don't
  lines.push('### ❌ Don\'t');
  for (const item of doc.agent_guide.dont) {
    lines.push(`- ${item}`);
  }
  lines.push('');

  // Snippets
  if (doc.agent_guide.snippets && doc.agent_guide.snippets.length > 0) {
    lines.push('### Code Snippets\n');
    for (const snippet of doc.agent_guide.snippets) {
      lines.push(`**${snippet.scenario}** — ${snippet.description}`);
      lines.push('```css');
      lines.push(snippet.example);
      lines.push('```\n');
    }
  }

  return lines.join('\n');
}

// ---- 工具函数 ----

function renderPropsTable(props: Record<string, string>): string {
  const lines = ['| Property | Value |', '|----------|-------|'];
  for (const [key, value] of Object.entries(props)) {
    lines.push(`| ${key} | \`${value}\` |`);
  }
  return lines.join('\n');
}

function renderPropsInline(props: Record<string, string>): string {
  return Object.entries(props)
    .map(([key, value]) => `${key}: \`${value}\``)
    .join(', ');
}

function extractSiteName(source: string): string {
  try {
    const url = new URL(source);
    return url.hostname.replace(/^www\./, '').split('.')[0]
      .charAt(0).toUpperCase() + url.hostname.replace(/^www\./, '').split('.')[0].slice(1);
  } catch {
    return 'Unknown';
  }
}

/**
 * 兼容旧接口：将旧的 DesignTokens 转换为新格式的降级渲染
 * （当 Stage 2 LLM 输出不符合新格式时使用）
 */
export function renderMarkdownLegacy(tokens: Record<string, unknown>, language: 'zh' | 'en' = 'zh'): string {
  logger.warn('Using legacy markdown renderer');

  const source = (tokens.source as string) || 'unknown';
  const siteName = extractSiteName(source);

  const lines: string[] = [];
  lines.push(`# Design System: ${siteName}\n`);

  // 简单的 token 表格输出
  if (tokens.colors) {
    lines.push('## Colors\n');
    lines.push('```json');
    lines.push(JSON.stringify(tokens.colors, null, 2));
    lines.push('```\n');
  }

  if (tokens.typography) {
    lines.push('## Typography\n');
    lines.push('```json');
    lines.push(JSON.stringify(tokens.typography, null, 2));
    lines.push('```\n');
  }

  if (tokens.spacing) {
    lines.push('## Spacing\n');
    lines.push('```json');
    lines.push(JSON.stringify(tokens.spacing, null, 2));
    lines.push('```\n');
  }

  if (tokens.perception) {
    lines.push('## Perception\n');
    lines.push('```json');
    lines.push(JSON.stringify(tokens.perception, null, 2));
    lines.push('```\n');
  }

  return lines.join('\n');
}
