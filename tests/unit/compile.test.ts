import { describe, it, expect } from 'vitest';
import type { CSSExtraction, PixelExtraction, VisionAnalysis } from '../../src/types/extraction.js';
import type { DesignSystemDoc } from '../../src/types/design-doc.js';

describe('compile pipeline types', () => {
  it('should have correct CSSExtraction shape', () => {
    const css: CSSExtraction = {
      colors: {
        raw: [{ value: '#3B82F6', frequency: 10, sources: ['color'] }],
        cssVariables: { '--primary': '#3B82F6' },
      },
      typography: {
        fontFamilies: [{ family: 'Inter', frequency: 5 }],
        fontSizes: [{ size: '16px', frequency: 8, contexts: ['p'] }],
        fontWeights: [{ weight: 400, frequency: 10 }],
        lineHeights: [{ value: '1.5', frequency: 8 }],
      },
      spacing: { values: [{ value: '8px', frequency: 5 }], detectedBaseUnit: '4px' },
      borders: {
        radii: [{ value: '8px', frequency: 5 }],
        widths: [{ value: '1px', frequency: 10 }],
        styles: [{ value: 'solid', frequency: 10 }],
      },
      shadows: { values: [{ value: '0 1px 2px rgba(0,0,0,0.05)', frequency: 3 }] },
      breakpoints: [{ minWidth: '768px', label: 'md' }],
      rawCSSVariables: { '--primary': '#3B82F6' },
    };
    expect(css.colors.raw).toHaveLength(1);
    expect(css.typography.fontFamilies[0].family).toBe('Inter');
  });

  it('should have correct DesignSystemDoc shape', () => {
    const doc: DesignSystemDoc = {
      frontmatter: {
        schema: 'vibe-thief/1.0',
        source: 'https://example.com',
        extracted_at: '2026-06-16',
        confidence: 0.85,
        generator: 'vibe-thief@0.1.0',
        mood: 'professional',
        style_archetype: 'light-saas',
      },
      narrative: {
        philosophy: '简洁专业的设计风格',
        keywords: ['简洁', '专业'],
      },
      colors: {
        background_layers: [{ token: 'bg', value: '#fff', usage: '背景' }],
        signal_colors: [{ token: 'primary', value: '#3B82F6', usage: '主色' }],
        text_hierarchy: [{ token: 'text', value: '#000', usage: '正文' }],
        philosophy: '蓝色为主色调',
      },
      typography: {
        font_stack: { heading: 'Inter', body: 'Inter', mono: 'monospace' },
        scale: [{ token: 'heading', size: '24px', weight: 600, usage: '标题' }],
        philosophy: 'Inter 字体',
      },
      spacing: { base_unit: '4px', scale: [{ token: 's1', value: '4px', usage: '紧凑' }], philosophy: '' },
      depth: { border_radius: [], shadows: [], borders: [], philosophy: '' },
      motion: { tokens: [], philosophy: '' },
      components: [{
        name: 'Button',
        description: '按钮',
        default: { bg: '#3B82F6', color: '#fff' },
        hover: { bg: '#2563EB' },
        variants: [{ name: 'Primary', properties: { bg: '#3B82F6' } }],
      }],
      interactions: { hover_style: '颜色变深', focus_style: 'outline', active_style: '颜色更深', loading_style: 'spinner', transition_speed: '150ms' },
      layout: { max_width: '1200px', breakpoints: [{ name: 'md', value: '768px' }], philosophy: '' },
      agent_guide: {
        do: ['用蓝色做主按钮'],
        dont: ['不要用红色做主按钮'],
        snippets: [{ scenario: '按钮', description: '蓝色按钮', example: 'background: #3B82F6;' }],
      },
    };

    expect(doc.frontmatter.style_archetype).toBe('light-saas');
    expect(doc.narrative.keywords).toContain('简洁');
    expect(doc.colors.background_layers[0].value).toBe('#fff');
    expect(doc.components[0].variants).toHaveLength(1);
    expect(doc.agent_guide.do).toHaveLength(1);
  });
});
