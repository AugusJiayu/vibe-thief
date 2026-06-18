/**
 * LLM Provider 抽象层
 * 统一不同 LLM 的调用接口
 */

import type { LLMConfig } from '../types/input.js';

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | Array<
    | { type: 'text'; text: string }
    | { type: 'image_url'; image_url: { url: string; detail?: 'low' | 'high' | 'auto' } }
  >;
}

export interface LLMResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface LLMProvider {
  /** Provider 名称 */
  name: string;
  /** 发送消息 */
  chat(messages: LLMMessage[], options?: { temperature?: number; maxTokens?: number; jsonMode?: boolean }): Promise<LLMResponse>;
}

/**
 * 创建 LLM Provider 实例
 */
export function createLLMProvider(config: LLMConfig): LLMProvider {
  switch (config.provider) {
    case 'openai':
      return new OpenAIProvider(config);
    case 'anthropic':
      return new AnthropicProvider(config);
    case 'custom':
      return new CustomProvider(config);
    default:
      throw new Error(`Unknown LLM provider: ${config.provider}`);
  }
}

/** OpenAI 兼容 Provider（支持 OpenAI API 及兼容 endpoint） */
class OpenAIProvider implements LLMProvider {
  name = 'openai';
  private config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;
  }

  async chat(
    messages: LLMMessage[],
    options?: { temperature?: number; maxTokens?: number; jsonMode?: boolean }
  ): Promise<LLMResponse> {
    const baseUrl = this.config.baseUrl || 'https://api.openai.com/v1';
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages,
        temperature: options?.temperature ?? 0.3,
        max_tokens: options?.maxTokens ?? 4096,
        ...(options?.jsonMode ? { response_format: { type: 'json_object' } } : {}),
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`OpenAI API error (${response.status}): ${err}`);
    }

    const data = await response.json() as any;
    return {
      content: data.choices[0].message.content,
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
      },
    };
  }
}

/** Anthropic Claude Provider */
class AnthropicProvider implements LLMProvider {
  name = 'anthropic';
  private config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;
  }

  async chat(
    messages: LLMMessage[],
    options?: { temperature?: number; maxTokens?: number; jsonMode?: boolean }
  ): Promise<LLMResponse> {
    let baseUrl = this.config.baseUrl || 'https://api.anthropic.com/v1';
    // 确保 baseUrl 以 /v1 结尾（兼容不带 /v1 的自定义 endpoint）
    if (!baseUrl.endsWith('/v1')) {
      baseUrl = baseUrl.replace(/\/+$/, '') + '/v1';
    }

    // 转换消息格式：Anthropic 不支持 system 在 messages 中
    const systemMsg = messages.find(m => m.role === 'system');
    const nonSystemMsgs = messages.filter(m => m.role !== 'system');

    // 转换 image_url 格式为 Anthropic 原生 image 格式
    const anthropicMessages = nonSystemMsgs.map(m => {
      if (typeof m.content === 'string') {
        return { role: m.role, content: m.content };
      }
      // 数组内容：转换 image_url 为 image
      const convertedContent = (m.content as any[]).map((part: any) => {
        if (part.type === 'image_url' && part.image_url?.url) {
          const url = part.image_url.url;
          // data:image/png;base64,xxx → 提取 base64 和 media_type
          const match = url.match(/^data:(image\/\w+);base64,(.+)$/);
          if (match) {
            return {
              type: 'image',
              source: {
                type: 'base64',
                media_type: match[1],
                data: match[2],
              },
            };
          }
        }
        return part;
      });
      return { role: m.role, content: convertedContent };
    });

    const body: any = {
      model: this.config.model,
      messages: anthropicMessages,
      max_tokens: options?.maxTokens ?? 4096,
      temperature: options?.temperature ?? 0.3,
    };

    if (systemMsg) {
      body.system = typeof systemMsg.content === 'string'
        ? systemMsg.content
        : systemMsg.content.map(c => c.type === 'text' ? c.text : '').join('\n');
    }

    const response = await fetch(`${baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Anthropic API error (${response.status}): ${err}`);
    }

    const data = await response.json() as any;
    // 提取 text 类型的 content block（跳过 thinking 等其他类型）
    const textBlock = data.content.find((c: any) => c.type === 'text') || data.content[0];
    return {
      content: textBlock.text || '',
      usage: {
        promptTokens: data.usage?.input_tokens || 0,
        completionTokens: data.usage?.output_tokens || 0,
        totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
      },
    };
  }
}

/** 自定义 endpoint Provider（OpenAI 兼容格式） */
class CustomProvider extends OpenAIProvider {
  name = 'custom';
}
