/**
 * 输出层
 * 将 DesignTokens 渲染为 Markdown
 */

import type { DesignTokens } from '../types/tokens.js';
import { logger } from '../utils/logger.js';

/**
 * 将 DesignTokens 渲染为 DESIGN.md 内容
 */
export function renderMarkdown(tokens: DesignTokens, language: 'zh' | 'en' = 'zh'): string {
  logger.info('Rendering DESIGN.md...');

  const sections: string[] = [];

  // Frontmatter
  sections.push(renderFrontmatter(tokens));

  // 标题
  const siteName = extractSiteName(tokens.source);
  sections.push(`# Design System: ${siteName}\n`);

  // Design Philosophy
  if (tokens.perception?.designPhilosophy) {
    sections.push(`> ${tokens.perception.designPhilosophy}\n`);
  }

  // Colors
  sections.push(renderColors(tokens.colors));

  // Typography
  sections.push(renderTypography(tokens.typography));

  // Spacing
  sections.push(renderSpacing(tokens.spacing));

  // Border Radius
  if (tokens.borderRadius) {
    sections.push(renderBorderRadius(tokens.borderRadius));
  }

  // Shadows
  if (tokens.shadows) {
    sections.push(renderShadows(tokens.shadows));
  }

  // Borders
  if (tokens.borders) {
    sections.push(renderBorders(tokens.borders));
  }

  // Layout
  if (tokens.layout) {
    sections.push(renderLayout(tokens.layout));
  }

  // Motion
  if (tokens.motion) {
    sections.push(renderMotion(tokens.motion));
  }

  // Perception
  if (tokens.perception) {
    sections.push(renderPerception(tokens.perception, language));
  }

  return sections.join('\n');
}

function renderFrontmatter(tokens: DesignTokens): string {
  return `---
schema: "vibe-thief/1.0"
source: "${tokens.source}"
extracted_at: "${tokens.extractedAt}"
confidence: ${tokens.confidence}
generator: "vibe-thief@${tokens.schemaVersion}"
---

`;
}

function renderColors(colors: DesignTokens['colors']): string {
  const lines: string[] = ['## Colors\n'];

  // Brand Colors
  const brandColors = [
    { token: 'color-primary', ...colors.primary },
    { token: 'color-secondary', ...colors.secondary },
    { token: 'color-accent', ...colors.accent },
  ].filter(c => c.value);

  if (brandColors.length > 0) {
    lines.push('### Brand Colors');
    lines.push('| Token | Value | Name | CSS Variable | Usage |');
    lines.push('|-------|-------|------|--------------|-------|');
    for (const c of brandColors) {
      lines.push(`| \`${c.token}\` | \`${c.value}\` | ${c.name || '-'} | ${c.cssVariable ? `\`${c.cssVariable}\`` : '-'} | ${c.usage || '-'} |`);
    }
    lines.push('');
  }

  // Neutral Scale
  if (colors.neutral && colors.neutral.length > 0) {
    lines.push('### Neutral Scale');
    lines.push('| Token | Value | Usage |');
    lines.push('|-------|-------|-------|');
    for (let i = 0; i < colors.neutral.length; i++) {
      const n = colors.neutral[i];
      lines.push(`| \`color-neutral-${(i + 1) * 100}\` | \`${n.value}\` | ${n.usage || '-'} |`);
    }
    lines.push('');
  }

  // Background & Surface
  const bgColors = [
    colors.background && { token: 'color-background', ...colors.background },
    colors.surface && { token: 'color-surface', ...colors.surface },
  ].filter(Boolean);

  if (bgColors.length > 0) {
    lines.push('### Background');
    lines.push('| Token | Value | Usage |');
    lines.push('|-------|-------|-------|');
    for (const c of bgColors) {
      lines.push(`| \`${c!.token}\` | \`${c!.value}\` | ${c!.usage || '-'} |`);
    }
    lines.push('');
  }

  // Text Colors
  if (colors.text) {
    lines.push('### Text Colors');
    lines.push('| Token | Value | Usage |');
    lines.push('|-------|-------|-------|');
    const textColors = [
      colors.text.primary && { token: 'color-text-primary', ...colors.text.primary },
      colors.text.secondary && { token: 'color-text-secondary', ...colors.text.secondary },
      colors.text.disabled && { token: 'color-text-disabled', ...colors.text.disabled },
    ].filter(Boolean);
    for (const c of textColors) {
      lines.push(`| \`${c!.token}\` | \`${c!.value}\` | ${c!.usage || '-'} |`);
    }
    lines.push('');
  }

  // Semantic Colors
  if (colors.semantic) {
    lines.push('### Semantic Colors');
    lines.push('| Token | Value | Usage |');
    lines.push('|-------|-------|-------|');
    for (const [name, val] of Object.entries(colors.semantic)) {
      if (val && typeof val === 'object' && 'value' in val && val.value) {
        const token = val as { value: string; usage?: string };
        lines.push(`| \`color-${name}\` | \`${token.value}\` | ${token.usage || '-'} |`);
      }
    }
    lines.push('');
  }

  return lines.join('\n');
}

function renderTypography(typography: DesignTokens['typography']): string {
  const lines: string[] = ['## Typography\n'];

  // Font Stack
  if (typography.fontFamily) {
    lines.push('### Font Stack');
    lines.push('| Role | Family |');
    lines.push('|------|--------|');
    if (typography.fontFamily.heading) lines.push(`| Heading | \`${typography.fontFamily.heading}\` |`);
    if (typography.fontFamily.body) lines.push(`| Body | \`${typography.fontFamily.body}\` |`);
    if (typography.fontFamily.mono) lines.push(`| Code | \`${typography.fontFamily.mono}\` |`);
    lines.push('');
  }

  // Type Scale
  if (typography.scale && typography.scale.length > 0) {
    lines.push('### Type Scale');
    lines.push('| Token | Size | Weight | Line Height | Usage |');
    lines.push('|-------|------|--------|-------------|-------|');
    for (const s of typography.scale) {
      lines.push(`| \`text-${s.name}\` | \`${s.size}\` | ${s.weight} | ${s.lineHeight} | ${s.usage || '-'} |`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

function renderSpacing(spacing: DesignTokens['spacing']): string {
  const lines: string[] = ['## Spacing\n'];

  if (spacing.baseUnit) {
    lines.push(`Base unit: \`${spacing.baseUnit}\`\n`);
  }

  if (spacing.scale && spacing.scale.length > 0) {
    lines.push('| Token | Value | Usage |');
    lines.push('|-------|-------|-------|');
    for (const s of spacing.scale) {
      lines.push(`| \`space-${s.name}\` | \`${s.value}\` | ${(s as any).usage || '-'} |`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

function renderBorderRadius(borderRadius: Record<string, string>): string {
  const lines: string[] = ['## Border Radius\n'];
  lines.push('| Token | Value |');
  lines.push('|-------|-------|');
  for (const [name, value] of Object.entries(borderRadius)) {
    lines.push(`| \`radius-${name}\` | \`${value}\` |`);
  }
  lines.push('');
  return lines.join('\n');
}

function renderShadows(shadows: Record<string, string>): string {
  const lines: string[] = ['## Shadows\n'];
  lines.push('| Token | Value |');
  lines.push('|-------|-------|');
  for (const [name, value] of Object.entries(shadows)) {
    lines.push(`| \`shadow-${name}\` | \`${value}\` |`);
  }
  lines.push('');
  return lines.join('\n');
}

function renderBorders(borders: Record<string, string>): string {
  const lines: string[] = ['## Borders\n'];
  lines.push('| Token | Value |');
  lines.push('|-------|-------|');
  for (const [name, value] of Object.entries(borders)) {
    lines.push(`| \`border-${name}\` | \`${value}\` |`);
  }
  lines.push('');
  return lines.join('\n');
}

function renderLayout(layout: NonNullable<DesignTokens['layout']>): string {
  const lines: string[] = ['## Layout\n'];
  lines.push('| Property | Value |');
  lines.push('|----------|-------|');
  if (layout.maxWidth) lines.push(`| Max Width | \`${layout.maxWidth}\` |`);
  if (layout.gridColumns) lines.push(`| Grid Columns | ${layout.gridColumns} |`);
  if (layout.gridGap) lines.push(`| Grid Gap | \`${layout.gridGap}\` |`);
  lines.push('');

  if (layout.breakpoints && layout.breakpoints.length > 0) {
    lines.push('### Breakpoints');
    lines.push('| Name | Min Width |');
    lines.push('|------|-----------|');
    for (const bp of layout.breakpoints) {
      lines.push(`| \`${bp.name}\` | \`${bp.value}\` |`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

function renderMotion(motion: NonNullable<DesignTokens['motion']>): string {
  const lines: string[] = ['## Motion\n'];
  lines.push('| Token | Duration | Easing |');
  lines.push('|-------|----------|--------|');
  if (motion.fast) lines.push(`| \`motion-fast\` | \`${motion.fast}\` | ${motion.easing?.out || '-'} |`);
  if (motion.normal) lines.push(`| \`motion-normal\` | \`${motion.normal}\` | ${motion.easing?.default || '-'} |`);
  if (motion.slow) lines.push(`| \`motion-slow\` | \`${motion.slow}\` | ${motion.easing?.in || '-'} |`);
  lines.push('');
  return lines.join('\n');
}

function renderPerception(perception: NonNullable<DesignTokens['perception']>, language: 'zh' | 'en'): string {
  const lines: string[] = ['## Perception Analysis\n'];
  lines.push('| Dimension | Assessment |');
  lines.push('|-----------|------------|');
  lines.push(`| **Mood** | ${[perception.mood, ...(perception.descriptors || [])].join(', ')} |`);
  lines.push(`| **Density** | ${perception.density} |`);
  lines.push(`| **Contrast** | ${perception.contrastLevel} |`);
  lines.push(`| **Design Principle** | ${perception.designPhilosophy} |`);
  lines.push('');
  return lines.join('\n');
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
