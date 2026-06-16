import { describe, it, expect } from 'vitest';
import { renderMarkdown } from '../../src/pipeline/output.js';
import type { DesignTokens } from '../../src/types/tokens.js';

const mockTokens: DesignTokens = {
  schemaVersion: '1.0',
  source: 'https://example.com',
  extractedAt: '2026-06-16T10:00:00Z',
  confidence: 0.85,
  colors: {
    primary: { value: '#3B82F6', name: 'Blue', usage: '主按钮' },
    secondary: { value: '#1F2937', name: 'Dark', usage: '标题' },
    neutral: [
      { value: '#F9FAFB', usage: '背景' },
      { value: '#6B7280', usage: '辅助文字' },
    ],
    text: {
      primary: { value: '#111827', usage: '正文' },
      secondary: { value: '#6B7280', usage: '辅助' },
    },
    semantic: {
      success: { value: '#10B981', usage: '成功' },
      error: { value: '#EF4444', usage: '错误' },
    },
  },
  typography: {
    fontFamily: { heading: 'Inter', body: 'Inter', mono: 'JetBrains Mono' },
    scale: [
      { name: '2xl', size: '36px', weight: 700, lineHeight: '1.2', usage: '页面标题' },
      { name: 'base', size: '16px', weight: 400, lineHeight: '1.6', usage: '正文' },
    ],
  },
  spacing: {
    baseUnit: '4px',
    scale: [
      { name: '1', value: '4px' },
      { name: '2', value: '8px' },
      { name: '4', value: '16px' },
    ],
  },
  borderRadius: { sm: '4px', md: '8px', lg: '12px', full: '9999px' },
  shadows: { sm: '0 1px 2px rgba(0,0,0,0.05)', md: '0 4px 6px rgba(0,0,0,0.07)' },
  perception: {
    mood: 'professional',
    descriptors: ['clean', 'modern', 'trustworthy'],
    density: 'comfortable',
    contrastLevel: 'medium',
    designPhilosophy: '简洁专业，用蓝色系建立信任感，大量留白营造舒适阅读体验。',
  },
};

describe('renderMarkdown', () => {
  it('should render frontmatter', () => {
    const md = renderMarkdown(mockTokens);
    expect(md).toContain('schema: "vibe-thief/1.0"');
    expect(md).toContain('source: "https://example.com"');
    expect(md).toContain('confidence: 0.85');
  });

  it('should render title from source URL', () => {
    const md = renderMarkdown(mockTokens);
    expect(md).toContain('# Design System: Example');
  });

  it('should render design philosophy', () => {
    const md = renderMarkdown(mockTokens);
    expect(md).toContain('简洁专业');
  });

  it('should render brand colors table', () => {
    const md = renderMarkdown(mockTokens);
    expect(md).toContain('## Colors');
    expect(md).toContain('`color-primary`');
    expect(md).toContain('`#3B82F6`');
    expect(md).toContain('主按钮');
  });

  it('should render typography section', () => {
    const md = renderMarkdown(mockTokens);
    expect(md).toContain('## Typography');
    expect(md).toContain('`Inter`');
    expect(md).toContain('`text-2xl`');
    expect(md).toContain('`36px`');
  });

  it('should render spacing section', () => {
    const md = renderMarkdown(mockTokens);
    expect(md).toContain('## Spacing');
    expect(md).toContain('Base unit: `4px`');
    expect(md).toContain('`space-1`');
    expect(md).toContain('`4px`');
  });

  it('should render border radius', () => {
    const md = renderMarkdown(mockTokens);
    expect(md).toContain('## Border Radius');
    expect(md).toContain('`radius-sm`');
    expect(md).toContain('`4px`');
  });

  it('should render shadows', () => {
    const md = renderMarkdown(mockTokens);
    expect(md).toContain('## Shadows');
    expect(md).toContain('`shadow-sm`');
  });

  it('should render perception analysis', () => {
    const md = renderMarkdown(mockTokens);
    expect(md).toContain('## Perception Analysis');
    expect(md).toContain('professional');
    expect(md).toContain('clean, modern, trustworthy');
  });

  it('should render semantic colors', () => {
    const md = renderMarkdown(mockTokens);
    expect(md).toContain('`color-success`');
    expect(md).toContain('`color-error`');
  });

  it('should handle minimal tokens', () => {
    const minimal: DesignTokens = {
      schemaVersion: '1.0',
      source: 'https://test.com',
      extractedAt: '2026-01-01',
      confidence: 0.5,
      colors: {},
      typography: {},
      spacing: {},
    };
    const md = renderMarkdown(minimal);
    expect(md).toContain('# Design System: Test');
    expect(md).toContain('## Colors');
  });
});
