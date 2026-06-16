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
  narrative: {
    philosophy: 'Linear 的设计语言是「精密工程师的工具箱」。暗色主题减少长时间工作的眼睛疲劳，紫色作为强调色提供最高效率的视觉定位。',
    keywords: ['精密', '高效', '克制', '暗色', '信息密度'],
  },
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
    philosophy: '暗色背景配合中等亮度文字创造「隧道感」，紫色只用在需要用户注意的地方。',
  },
  typography: {
    font_stack: { heading: 'Inter', body: 'Inter', mono: 'JetBrains Mono' },
    scale: [
      { token: 'text-heading', size: '20px', weight: 600, usage: '页面标题' },
      { token: 'text-body', size: '14px', weight: 400, usage: '正文' },
      { token: 'text-caption', size: '12px', weight: 400, usage: '辅助文字' },
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
  motion: {
    tokens: [
      { token: 'motion-fast', duration: '100ms', easing: 'ease-out', usage: 'hover 反馈' },
      { token: 'motion-normal', duration: '200ms', easing: 'ease-in-out', usage: '展开/折叠' },
    ],
    philosophy: '动效克制，只在必要的交互反馈中使用。',
  },
  components: [
    {
      name: 'Button',
      description: '按钮组件，28px 高度，紧凑但可点击。',
      default: { bg: '#5E6AD2', color: '#FFFFFF', 'border-radius': '6px', height: '28px' },
      hover: { bg: '#4F5BC0' },
      focus: { outline: '2px solid #5E6AD2' },
      variants: [
        { name: 'Primary', properties: { bg: '#5E6AD2', color: '#FFFFFF' } },
        { name: 'Secondary', properties: { bg: 'transparent', border: '1px solid #222229', color: '#ABABAB' } },
        { name: 'Ghost', properties: { bg: 'transparent', color: '#ABABAB' } },
      ],
    },
    {
      name: 'Input',
      description: '输入框组件。',
      default: { bg: '#1B1B1F', border: '1px solid #333340', 'border-radius': '4px', height: '28px' },
      focus: { border: '1px solid #5E6AD2' },
    },
  ],
  interactions: {
    hover_style: '背景色微调，无阴影变化',
    focus_style: '2px solid 紫色 outline',
    active_style: '颜色变深 10%',
    loading_style: 'spinner 动画',
    transition_speed: '100ms ease-out',
  },
  layout: {
    max_width: '1200px',
    grid: { columns: 12, gap: '16px' },
    breakpoints: [
      { name: 'sm', value: '640px' },
      { name: 'md', value: '768px' },
      { name: 'lg', value: '1024px' },
    ],
    philosophy: '固定最大宽度，内容居中，响应式断点较少。',
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
    snippets: [
      {
        scenario: '创建主按钮',
        description: '用信号色作为背景',
        example: 'background: #5E6AD2;\ncolor: white;\nborder-radius: 6px;\nheight: 28px;',
      },
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

  it('should render design narrative with keywords', () => {
    const md = renderDesignDoc(mockDoc);
    expect(md).toContain('## Design Narrative');
    expect(md).toContain('精密工程师的工具箱');
    expect(md).toContain('`精密`');
    expect(md).toContain('`高效`');
  });

  it('should render visual vocabulary with philosophies', () => {
    const md = renderDesignDoc(mockDoc);
    expect(md).toContain('## Visual Vocabulary');
    expect(md).toContain('### 色彩哲学');
    expect(md).toContain('隧道感');
    expect(md).toContain('### 排版哲学');
    expect(md).toContain('### 留白哲学');
    expect(md).toContain('### 深度哲学');
  });

  it('should render colors by strategy groups', () => {
    const md = renderDesignDoc(mockDoc);
    expect(md).toContain('### Colors');
    expect(md).toContain('Background Layers');
    expect(md).toContain('`bg-void`');
    expect(md).toContain('`#0A0A0B`');
    expect(md).toContain('Signal Colors');
    expect(md).toContain('`signal-primary`');
    expect(md).toContain('Text Hierarchy');
    expect(md).toContain('`text-primary`');
  });

  it('should render typography with semantic scale', () => {
    const md = renderDesignDoc(mockDoc);
    expect(md).toContain('### Typography');
    expect(md).toContain('`Inter`');
    expect(md).toContain('`text-heading`');
    expect(md).toContain('`20px`');
  });

  it('should render spacing with usage context', () => {
    const md = renderDesignDoc(mockDoc);
    expect(md).toContain('### Spacing');
    expect(md).toContain('Base: `4px`');
    expect(md).toContain('`space-tight`');
    expect(md).toContain('图标与文字');
  });

  it('should render depth strategy', () => {
    const md = renderDesignDoc(mockDoc);
    expect(md).toContain('### Depth & Hierarchy');
    expect(md).toContain('`radius-input`');
    expect(md).toContain('`shadow-dropdown`');
    expect(md).toContain('`border-subtle`');
  });

  it('should render component patterns with states', () => {
    const md = renderDesignDoc(mockDoc);
    expect(md).toContain('## Component Patterns');
    expect(md).toContain('### Button');
    expect(md).toContain('**Default:**');
    expect(md).toContain('**Hover:**');
    expect(md).toContain('**Focus:**');
    expect(md).toContain('**Variants:**');
    expect(md).toContain('Primary');
    expect(md).toContain('Secondary');
    expect(md).toContain('Ghost');
  });

  it('should render interaction patterns', () => {
    const md = renderDesignDoc(mockDoc);
    expect(md).toContain('## Interaction Patterns');
    expect(md).toContain('Hover');
    expect(md).toContain('Focus');
    expect(md).toContain('背景色微调');
  });

  it('should render agent usage guide', () => {
    const md = renderDesignDoc(mockDoc);
    expect(md).toContain('## Agent Usage Guide');
    expect(md).toContain('### ✅ Do');
    expect(md).toContain('用背景色层级');
    expect(md).toContain("### ❌ Don't");
    expect(md).toContain('不要用渐变背景');
    expect(md).toContain('### Code Snippets');
    expect(md).toContain('创建主按钮');
  });

  it('should render layout with breakpoints', () => {
    const md = renderDesignDoc(mockDoc);
    expect(md).toContain('## Layout');
    expect(md).toContain('`1200px`');
    expect(md).toContain('### Breakpoints');
    expect(md).toContain('`sm`');
    expect(md).toContain('`640px`');
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
      narrative: { philosophy: 'Test', keywords: [] },
      colors: { background_layers: [], signal_colors: [], text_hierarchy: [], philosophy: '' },
      typography: { font_stack: { heading: '', body: '', mono: '' }, scale: [], philosophy: '' },
      spacing: { base_unit: '4px', scale: [], philosophy: '' },
      depth: { border_radius: [], shadows: [], borders: [], philosophy: '' },
      motion: { tokens: [], philosophy: '' },
      components: [],
      interactions: { hover_style: '', focus_style: '', active_style: '', loading_style: '', transition_speed: '' },
      layout: { max_width: '', breakpoints: [], philosophy: '' },
      agent_guide: { do: [], dont: [] },
    };
    const md = renderDesignDoc(minimal);
    expect(md).toContain('# Design System: Test');
    expect(md).toContain('## Design Narrative');
  });
});
