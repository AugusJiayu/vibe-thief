import { describe, it, expect } from 'vitest';
import { renderDesignDoc } from '../../src/pipeline/output.js';
import type { DesignSystemDoc } from '../../src/types/design-doc.js';

const mockDoc: DesignSystemDoc = {
  frontmatter: {
    schema: 'vibe-thief/1.0',
    source: 'https://linear.app',
    extracted_at: '2026-06-16T10:00:00Z',
    confidence: 0.85,
    generator: 'vibe-thief@0.1.0',
    mood: 'precise, focused, engineered',
    style_archetype: 'dark-tool',
  },
  design_feeling: 'Linear 的设计语言是「精密工程师的工具箱」。暗色主题减少长时间工作的眼睛疲劳，紫色作为强调色提供最高效率的视觉定位。整体排版克制，字号对比鲜明，留白精准。',
  colors: {
    background_layers: [
      { token: 'bg-void', value: '#0A0A0B', usage: '页面最底层背景' },
      { token: 'bg-base', value: '#1B1B1F', usage: '主内容区背景' },
      { token: 'bg-raised', value: '#222229', usage: '卡片、侧边栏' },
    ],
    signal_colors: [
      { token: 'signal-primary', value: '#5E6AD2', usage: '主按钮、选中态' },
      { token: 'signal-success', value: '#4ADE80', usage: '成功状态' },
    ],
    text_hierarchy: [
      { token: 'text-primary', value: '#EDEDEC', usage: '标题' },
      { token: 'text-secondary', value: '#ABABAB', usage: '正文' },
      { token: 'text-tertiary', value: '#6B6B76', usage: '辅助信息' },
    ],
    border_colors: [
      { token: 'border-subtle', value: '#222229', usage: '卡片边框' },
    ],
    philosophy: '暗色背景配合中等亮度文字创造「隧道感」，紫色只用在需要用户注意的地方。',
  },
  typography: {
    font_stack: { heading: 'Inter', body: 'Inter', mono: 'JetBrains Mono' },
    scale: [
      { token: 'text-heading', size: '20px', weight: 600, lineHeight: '1.3', usage: '页面标题' },
      { token: 'text-body', size: '14px', weight: 400, lineHeight: '1.5', usage: '正文' },
      { token: 'text-caption', size: '12px', weight: 400, lineHeight: '1.4', usage: '辅助文字' },
    ],
    philosophy: '统一使用 Inter，在小字号下保持极致可读性。',
  },
  spacing: {
    base_unit: '4px',
    scale: [
      { token: 'space-tight', value: '4px', usage: '图标与文字' },
      { token: 'space-component', value: '8px', usage: '组件内部 padding' },
      { token: 'space-section', value: '16px', usage: '区块间距' },
    ],
    philosophy: '组件内部紧凑（8px），组件之间有呼吸感（16-24px）。',
  },
  depth: {
    border_radius: [
      { token: 'radius-input', value: '4px', usage: '输入框' },
      { token: 'radius-card', value: '6px', usage: '卡片' },
    ],
    shadows: [
      { token: 'shadow-dropdown', value: '0 4px 12px rgba(0,0,0,0.4)', usage: '下拉菜单' },
    ],
    borders: [
      { token: 'border-subtle', value: '1px solid #222229', usage: '卡片边框' },
    ],
    philosophy: '几乎不用阴影，层次靠颜色差异和 1px 边框表达。',
  },
  page_structure: [
    {
      name: 'Hero',
      purpose: '第一印象，传达核心价值',
      elements: ['大标题', '副标题', 'CTA 按钮'],
      layout: '居中单列',
    },
    {
      name: 'Features',
      purpose: '展示核心功能',
      elements: ['图标', '功能标题', '功能描述'],
      layout: '3 列网格',
    },
  ],
  css_code: [
    {
      purpose: 'Hero 区域布局',
      css: '.hero {\n  min-height: 100vh;\n  display: flex;\n  align-items: center;\n}',
    },
    {
      purpose: '滚动进入动画',
      css: '@keyframes fadeUp {\n  from { opacity: 0; transform: translateY(30px); }\n  to { opacity: 1; transform: translateY(0); }\n}',
    },
  ],
  js_code: [
    {
      purpose: '滚动触发元素进入',
      js: 'const observer = new IntersectionObserver((entries) => {\n  entries.forEach(entry => {\n    if (entry.isIntersecting) entry.target.classList.add("animate-in");\n  });\n});',
    },
  ],
  media_presentation: {
    imageStyle: '高质量产品截图，纯色背景',
    imageContainer: '圆角 8px，无边框',
    videoStyle: '自动播放、循环、静音',
    iconStyle: '线条图标，线宽 1.5px',
  },
  agent_guide: {
    do: [
      '用背景色层级（bg-void → bg-base → bg-raised）表达深度',
      '信号色只用在需要用户注意的地方',
      '组件保持 28px 高度，紧凑但可点击',
    ],
    dont: [
      '不要用渐变背景',
      '不要用圆角超过 8px 的元素',
      '不要在卡片上加阴影',
    ],
  },
};

describe('renderDesignDoc', () => {
  it('should render frontmatter with all metadata', () => {
    const md = renderDesignDoc(mockDoc);
    expect(md).toContain('schema: "vibe-thief/1.0"');
    expect(md).toContain('source: "https://linear.app"');
    expect(md).toContain('mood: "precise, focused, engineered"');
    expect(md).toContain('style_archetype: "dark-tool"');
  });

  it('should render design feeling', () => {
    const md = renderDesignDoc(mockDoc);
    expect(md).toContain('## 设计感觉');
    expect(md).toContain('精密工程师的工具箱');
  });

  it('should render colors with philosophy', () => {
    const md = renderDesignDoc(mockDoc);
    expect(md).toContain('## Colors');
    expect(md).toContain('Background Layers');
    expect(md).toContain('`bg-void`');
    expect(md).toContain('`#0A0A0B`');
    expect(md).toContain('Signal Colors');
    expect(md).toContain('`signal-primary`');
    expect(md).toContain('Text Hierarchy');
    expect(md).toContain('`text-primary`');
    expect(md).toContain('Border Colors');
    expect(md).toContain('隧道感');
  });

  it('should render typography with scale', () => {
    const md = renderDesignDoc(mockDoc);
    expect(md).toContain('## Typography');
    expect(md).toContain('`Inter`');
    expect(md).toContain('`text-heading`');
    expect(md).toContain('`20px`');
    expect(md).toContain('1.3');
  });

  it('should render spacing with base unit', () => {
    const md = renderDesignDoc(mockDoc);
    expect(md).toContain('## Spacing');
    expect(md).toContain('`4px`');
    expect(md).toContain('`space-tight`');
    expect(md).toContain('图标与文字');
  });

  it('should render depth strategy', () => {
    const md = renderDesignDoc(mockDoc);
    expect(md).toContain('## Depth');
    expect(md).toContain('`radius-input`');
    expect(md).toContain('`shadow-dropdown`');
    expect(md).toContain('`border-subtle`');
  });

  it('should render page structure', () => {
    const md = renderDesignDoc(mockDoc);
    expect(md).toContain('## Page Structure');
    expect(md).toContain('### 1. Hero');
    expect(md).toContain('### 2. Features');
    expect(md).toContain('第一印象');
    expect(md).toContain('3 列网格');
  });

  it('should render CSS code blocks', () => {
    const md = renderDesignDoc(mockDoc);
    expect(md).toContain('## CSS Code');
    expect(md).toContain('### Hero 区域布局');
    expect(md).toContain('min-height: 100vh');
    expect(md).toContain('### 滚动进入动画');
    expect(md).toContain('@keyframes fadeUp');
  });

  it('should render JS code blocks', () => {
    const md = renderDesignDoc(mockDoc);
    expect(md).toContain('## JS Code');
    expect(md).toContain('### 滚动触发元素进入');
    expect(md).toContain('IntersectionObserver');
  });

  it('should render media presentation', () => {
    const md = renderDesignDoc(mockDoc);
    expect(md).toContain('## Media Presentation');
    expect(md).toContain('高质量产品截图');
    expect(md).toContain('圆角 8px');
    expect(md).toContain('线条图标');
  });

  it('should render agent guide', () => {
    const md = renderDesignDoc(mockDoc);
    expect(md).toContain('## Agent Guide');
    expect(md).toContain('### ✅ Do');
    expect(md).toContain('用背景色层级');
    expect(md).toContain("### ❌ Don't");
    expect(md).toContain('不要用渐变背景');
  });

  it('should handle minimal doc', () => {
    const minimal: DesignSystemDoc = {
      frontmatter: {
        schema: 'vibe-thief/1.0',
        source: 'https://test.com',
        extracted_at: '2026-01-01',
        confidence: 0.5,
        generator: 'vibe-thief@0.1.0',
        mood: 'unknown',
        style_archetype: 'custom',
      },
      design_feeling: 'Test feeling',
      colors: { background_layers: [], signal_colors: [], text_hierarchy: [], border_colors: [], philosophy: '' },
      typography: { font_stack: { heading: '', body: '', mono: '' }, scale: [], philosophy: '' },
      spacing: { base_unit: '4px', scale: [], philosophy: '' },
      depth: { border_radius: [], shadows: [], borders: [], philosophy: '' },
      page_structure: [],
      css_code: [],
      js_code: [],
      media_presentation: { imageStyle: '', imageContainer: '', videoStyle: '', iconStyle: '' },
      agent_guide: { do: [], dont: [] },
    };
    const md = renderDesignDoc(minimal);
    expect(md).toContain('## 设计感觉');
    expect(md).toContain('Test feeling');
  });
});
