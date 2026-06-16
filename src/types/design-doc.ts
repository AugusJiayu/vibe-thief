/**
 * 高质量 DESIGN.md 的数据结构
 * 目标：让 Agent 能理解设计系统的"灵魂"，而不仅仅是 token 数值
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

/** 风格原型（预定义的常见风格） */
export type StyleArchetype =
  | 'dark-tool'         // Linear, Raycast, Arc
  | 'light-saas'        // Notion, Figma, Slack
  | 'minimal-portfolio' // 个人作品集
  | 'enterprise'        // Salesforce, Jira
  | 'consumer-app'      // Spotify, Instagram
  | 'news-editorial'    // NYT, Medium
  | 'ecommerce'         // Shopify, Stripe
  | 'developer-docs'    // Vercel, Tailwind Docs
  | 'playful-brand'     // Stripe, Mailchimp
  | 'startup-landing'   // 典型 SaaS landing page
  | string;

/** 设计叙事 */
export interface DesignNarrative {
  /** 一段话描述这个设计的灵魂（50-150字） */
  philosophy: string;
  /** 3-8 个风格关键词 */
  keywords: string[];
}

/** 色彩策略分组 */
export interface ColorStrategy {
  /** 背景层级（从深到浅 or 从浅到深） */
  background_layers: Array<{
    token: string;
    value: string;
    usage: string;
  }>;
  /** 信号色（强调色、状态色） */
  signal_colors: Array<{
    token: string;
    value: string;
    usage: string;
  }>;
  /** 文字层级 */
  text_hierarchy: Array<{
    token: string;
    value: string;
    usage: string;
  }>;
  /** 色彩使用哲学 */
  philosophy: string;
}

/** 排版策略 */
export interface TypographyStrategy {
  font_stack: {
    heading: string;
    body: string;
    mono: string;
  };
  /** 语义化字号（按用途而非大小） */
  scale: Array<{
    token: string;
    size: string;
    weight: number;
    usage: string;
  }>;
  /** 排版哲学 */
  philosophy: string;
}

/** 间距策略 */
export interface SpacingStrategy {
  base_unit: string;
  /** 语义化间距（按场景而非数值） */
  scale: Array<{
    token: string;
    value: string;
    usage: string;
  }>;
  /** 间距哲学 */
  philosophy: string;
}

/** 视觉层级策略 */
export interface DepthStrategy {
  border_radius: Array<{
    token: string;
    value: string;
    usage: string;
  }>;
  shadows: Array<{
    token: string;
    value: string;
    usage: string;
  }>;
  borders: Array<{
    token: string;
    value: string;
    usage: string;
  }>;
  /** 深度哲学：用什么方式表达层级（阴影 vs 颜色 vs 边框） */
  philosophy: string;
}

/** 运动策略 */
export interface MotionStrategy {
  tokens: Array<{
    token: string;
    duration: string;
    easing: string;
    usage: string;
  }>;
  philosophy: string;
}

/** 组件模式 */
export interface ComponentPattern {
  name: string;
  /** 组件描述 */
  description: string;
  /** 默认态 */
  default: Record<string, string>;
  /** hover 态 */
  hover?: Record<string, string>;
  /** focus 态 */
  focus?: Record<string, string>;
  /** active 态 */
  active?: Record<string, string>;
  /** disabled 态 */
  disabled?: Record<string, string>;
  /** 尺寸变体 */
  sizes?: Array<{
    name: string;
    properties: Record<string, string>;
  }>;
  /** 风格变体 */
  variants?: Array<{
    name: string;
    properties: Record<string, string>;
  }>;
}

/** 交互模式 */
export interface InteractionPatterns {
  hover_style: string;
  focus_style: string;
  active_style: string;
  loading_style: string;
  transition_speed: string;
}

/** Agent 使用指南 */
export interface AgentGuide {
  do: string[];
  dont: string[];
  /** 常见场景的代码片段建议 */
  snippets?: Array<{
    scenario: string;
    description: string;
    example: string;
  }>;
}

/** 布局规则 */
export interface LayoutRules {
  max_width: string;
  grid?: {
    columns: number;
    gap: string;
  };
  breakpoints: Array<{
    name: string;
    value: string;
  }>;
  /** 布局哲学 */
  philosophy: string;
}

/** 完整的设计文档 */
export interface DesignSystemDoc {
  frontmatter: DocFrontmatter;
  narrative: DesignNarrative;
  colors: ColorStrategy;
  typography: TypographyStrategy;
  spacing: SpacingStrategy;
  depth: DepthStrategy;
  motion: MotionStrategy;
  components: ComponentPattern[];
  interactions: InteractionPatterns;
  layout: LayoutRules;
  agent_guide: AgentGuide;
}
