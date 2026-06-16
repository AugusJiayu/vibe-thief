/** 输入源定义 */
export type InputSource =
  | { type: 'url'; url: string }
  | { type: 'screenshot'; filePath: string }
  | { type: 'screenshot'; buffer: Buffer; mimeType: string };

/** LLM Provider 配置 */
export interface LLMConfig {
  provider: 'openai' | 'anthropic' | 'custom';
  model: string;
  /** 视觉分析用的多模态模型（如果不指定，用 model） */
  visionModel?: string;
  apiKey: string;
  baseUrl?: string;
}

/** 浏览器配置 */
export interface BrowserConfig {
  headless?: boolean;
  viewport?: { width: number; height: number };
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle';
  locale?: string;
  /** 使用系统浏览器通道: 'chrome', 'msedge' 等 */
  channel?: 'chrome' | 'msedge' | 'chrome-canary' | 'msedge-canary';
}

/** 输出配置 */
export interface OutputConfig {
  format: 'full' | 'tokens-only' | 'summary';
  includeScreenshots?: boolean;
  language?: 'zh' | 'en';
}

/** 缓存配置 */
export interface CacheConfig {
  enabled: boolean;
  dir: string;
  ttl: number;
}

/** 流水线全局配置 */
export interface PipelineConfig {
  llm: LLMConfig;
  browser?: BrowserConfig;
  output?: OutputConfig;
  cache?: CacheConfig;
}
