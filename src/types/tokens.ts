/** Design Token 类型定义 */

export interface TokenValue {
  value: string;
  name?: string;
  usage?: string;
  cssVariable?: string;
}

export interface DesignTokens {
  schemaVersion: string;
  source: string;
  extractedAt: string;
  confidence: number;

  colors: {
    primary?: TokenValue;
    secondary?: TokenValue;
    accent?: TokenValue;
    neutral?: TokenValue[];
    background?: TokenValue;
    surface?: TokenValue;
    text?: {
      primary?: TokenValue;
      secondary?: TokenValue;
      disabled?: TokenValue;
    };
    semantic?: {
      success?: TokenValue;
      warning?: TokenValue;
      error?: TokenValue;
      info?: TokenValue;
    };
  };

  typography: {
    fontFamily?: {
      heading?: string;
      body?: string;
      mono?: string;
    };
    scale?: Array<{
      name: string;
      size: string;
      weight: number;
      lineHeight: string;
      usage?: string;
    }>;
  };

  spacing: {
    baseUnit?: string;
    scale?: Array<{
      name: string;
      value: string;
      usage?: string;
    }>;
  };

  borderRadius?: Record<string, string>;
  shadows?: Record<string, string>;
  borders?: Record<string, string>;

  layout?: {
    maxWidth?: string;
    gridColumns?: number;
    gridGap?: string;
    breakpoints?: Array<{ name: string; value: string }>;
  };

  motion?: {
    fast?: string;
    normal?: string;
    slow?: string;
    easing?: {
      default?: string;
      in?: string;
      out?: string;
    };
  };

  perception?: {
    mood?: string;
    descriptors?: string[];
    density?: string;
    contrastLevel?: string;
    designPhilosophy?: string;
  };
}
