/**
 * DESIGN.md 文档结构定义
 *
 * 核心消费者是 AI Coding Agent（如 Cursor）。
 * Agent 需要读取此文档后能设计出与目标网站视觉风格一致的 UI。
 *
 * 结构：
 * 1. Design Feeling — 描述目标网站的视觉感受
 * 2. Tokens — 色彩、排版、间距等基础值
 * 3. Page Structure — 页面区块顺序和每块的内容
 * 4. CSS/JS Code — 动画、交互、组件样式（可直接复用）
 * 5. Media Presentation — 图片/视频的呈现方式
 */

/** 前置元数据 */
export interface DocFrontmatter {
  schema: 'vibe-thief/1.0';
  source: string;
  extracted_at: string;
  confidence: number;
  generator: string;
  mood: string;
  style_archetype: string;
}

/** 风格原型 */
export type StyleArchetype =
  | 'dark-tool'
  | 'light-saas'
  | 'minimal-portfolio'
  | 'enterprise'
  | 'consumer-app'
  | 'news-editorial'
  | 'ecommerce'
  | 'developer-docs'
  | 'playful-brand'
  | 'immersive-landing'
  | 'showcase-gallery'
  | 'startup-landing'
  | string;

/** 色彩角色 */
export interface ColorRole {
  token: string;
  value: string;
  usage: string;
}

/** 色彩系统 */
export interface ColorStrategy {
  /** 背景层级 */
  background_layers: ColorRole[];
  /** 信号色（强调色、状态色） */
  signal_colors: ColorRole[];
  /** 文字层级 */
  text_hierarchy: ColorRole[];
  /** 边框/分割线色 */
  border_colors: ColorRole[];
  /** 色彩使用哲学（一句话） */
  philosophy: string;
}

/** 排版系统 */
export interface TypographyStrategy {
  font_stack: {
    heading: string;
    body: string;
    mono: string;
  };
  /** 字号阶梯（按用途语义化） */
  scale: Array<{
    token: string;
    size: string;
    weight: number;
    lineHeight: string;
    letterSpacing?: string;
    usage: string;
  }>;
  /** 排版哲学（一句话） */
  philosophy: string;
}

/** 间距系统 */
export interface SpacingStrategy {
  base_unit: string;
  scale: Array<{
    token: string;
    value: string;
    usage: string;
  }>;
  philosophy: string;
}

/** 深度系统 */
export interface DepthStrategy {
  border_radius: Array<{ token: string; value: string; usage: string }>;
  shadows: Array<{ token: string; value: string; usage: string }>;
  borders: Array<{ token: string; value: string; usage: string }>;
  philosophy: string;
}

/** 页面区块定义 */
export interface PageSection {
  /** 区块名称（如 "Hero", "Features", "Pricing"） */
  name: string;
  /** 区块用途 */
  purpose: string;
  /** 该区块包含的内容元素 */
  elements: string[];
  /** 布局方式（如 "居中单列", "3列网格", "左文右图交替"） */
  layout: string;
  /** 特殊说明 */
  notes?: string;
}

/** CSS 代码块 */
export interface CSSCodeBlock {
  /** 代码用途描述 */
  purpose: string;
  /** 完整 CSS 代码 */
  css: string;
}

/** JS 代码块 */
export interface JSCodeBlock {
  /** 代码用途描述 */
  purpose: string;
  /** 完整 JS 代码 */
  js: string;
}

/** 媒体呈现规则 */
export interface MediaPresentation {
  /** 图片类型和风格描述 */
  imageStyle: string;
  /** 图片容器样式（圆角、边框、阴影等） */
  imageContainer: string;
  /** 视频呈现方式 */
  videoStyle: string;
  /** 图标风格 */
  iconStyle: string;
  /** 其他媒体说明 */
  other?: string;
}

/** Agent 使用指南 */
export interface AgentGuide {
  do: string[];
  dont: string[];
}

/** 完整的设计文档 */
export interface DesignSystemDoc {
  frontmatter: DocFrontmatter;

  /** 设计感觉：描述目标网站的整体视觉感受（2-4 段话） */
  design_feeling: string;

  /** 色彩系统 */
  colors: ColorStrategy;

  /** 排版系统 */
  typography: TypographyStrategy;

  /** 间距系统 */
  spacing: SpacingStrategy;

  /** 深度系统（阴影、边框、圆角） */
  depth: DepthStrategy;

  /** 页面结构：区块顺序和每块的内容 */
  page_structure: PageSection[];

  /** CSS 代码片段（可直接复用） */
  css_code: CSSCodeBlock[];

  /** JS 代码片段（交互逻辑） */
  js_code: JSCodeBlock[];

  /** 媒体呈现规则 */
  media_presentation: MediaPresentation;

  /** Agent 使用指南 */
  agent_guide: AgentGuide;
}
