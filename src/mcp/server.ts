/**
 * vibe-thief MCP Server
 * 暴露设计系统提取工具给 IDE Agent
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { extractFromURL, extractFromScreenshot, extractOnly } from '../pipeline/orchestrator.js';
import { extractCSSFromURL } from '../extractors/css-extractor.js';
import type { PipelineConfig, LLMConfig } from '../types/input.js';
import { readFile } from 'node:fs/promises';

const server = new McpServer({
  name: 'vibe-thief',
  version: '0.1.0',
});

/** 从环境变量构建 LLM 配置 */
function getLLMConfig(overrides?: Partial<LLMConfig>): LLMConfig {
  const provider = overrides?.provider || (process.env.LLM_PROVIDER as any) || 'anthropic';
  const model = overrides?.model || process.env.LLM_MODEL || 'mimo-v2.5-pro';
  const visionModel = overrides?.visionModel || process.env.LLM_VISION_MODEL || 'mimo-v2.5';

  return {
    provider,
    model,
    visionModel,
    apiKey: overrides?.apiKey || getApiKeyForProvider(provider),
    baseUrl: overrides?.baseUrl || process.env.LLM_BASE_URL,
  };
}

function getApiKeyForProvider(provider: string): string {
  switch (provider) {
    case 'openai': return process.env.OPENAI_API_KEY || '';
    case 'anthropic': return process.env.ANTHROPIC_API_KEY || '';
    default: return process.env.LLM_API_KEY || '';
  }
}

/** 通用错误处理包装 */
function formatError(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);
  return `Error: ${message}`;
}

// Tool 1: extract_design — 完整提取
server.tool(
  'extract_design',
  '从 URL 或截图提取设计系统，生成 DESIGN.md。输入一个网站 URL 或截图路径，返回结构化的设计 token 数据和 Markdown 文档。需要配置 LLM API Key（OPENAI_API_KEY 或 ANTHROPIC_API_KEY 环境变量）。',
  {
    source: z.string().describe('网站 URL 或本地截图文件路径'),
    sourceType: z.enum(['url', 'screenshot']).optional().describe('输入类型，不填则自动判断'),
    outputFormat: z.enum(['markdown', 'json', 'both']).default('both').describe('输出格式'),
    language: z.enum(['zh', 'en']).default('zh').describe('输出语言'),
  },
  async ({ source, sourceType, outputFormat, language }) => {
    try {
      const isURL = sourceType === 'url' || (!sourceType && (source.startsWith('http://') || source.startsWith('https://')));

      const config: PipelineConfig = {
        llm: getLLMConfig(),
        browser: { headless: true, viewport: { width: 1440, height: 900 } },
        output: { format: 'full', language },
      };

      let result;
      if (isURL) {
        result = await extractFromURL(source, config);
      } else {
        result = await extractFromScreenshot(source, config);
      }

      const outputs: string[] = [];
      if (outputFormat === 'markdown' || outputFormat === 'both') {
        outputs.push(result.markdown);
      }
      if (outputFormat === 'json' || outputFormat === 'both') {
        outputs.push('```json\n' + JSON.stringify(result.doc, null, 2) + '\n```');
      }

      return {
        content: [{ type: 'text' as const, text: outputs.join('\n\n---\n\n') }],
      };
    } catch (err) {
      return {
        content: [{ type: 'text' as const, text: formatError(err) }],
        isError: true,
      };
    }
  }
);

// Tool 2: extract_css_only — 仅 CSS 提取
server.tool(
  'extract_css_only',
  '仅从 URL 提取 CSS 层面的设计数据（颜色、字体、间距等），不调用 LLM。速度快，适合只需要硬数据的场景。',
  {
    url: z.string().describe('网站 URL'),
    viewport: z.string().default('1440x900').describe('浏览器视口尺寸，如 1440x900'),
  },
  async ({ url, viewport }) => {
    try {
      const [w, h] = viewport.split('x').map(Number);
      const cssData = await extractCSSFromURL(url, {
        headless: true,
        viewport: { width: w || 1440, height: h || 900 },
      });

      return {
        content: [{ type: 'text' as const, text: '```json\n' + JSON.stringify(cssData, null, 2) + '\n```' }],
      };
    } catch (err) {
      return {
        content: [{ type: 'text' as const, text: formatError(err) }],
        isError: true,
      };
    }
  }
);

// Tool 3: analyze_screenshot — 纯视觉分析
server.tool(
  'analyze_screenshot',
  '用多模态 LLM 分析截图的设计感知（情绪、风格、组件特征）。需要配置 LLM API Key。',
  {
    imagePath: z.string().describe('截图文件路径'),
  },
  async ({ imagePath }) => {
    try {
      const buffer = await readFile(imagePath);
      const { analyzeVision } = await import('../extractors/vision-analyzer.js');
      const result = await analyzeVision(buffer, getLLMConfig());

      return {
        content: [{ type: 'text' as const, text: '```json\n' + JSON.stringify(result, null, 2) + '\n```' }],
      };
    } catch (err) {
      return {
        content: [{ type: 'text' as const, text: formatError(err) }],
        isError: true,
      };
    }
  }
);

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('vibe-thief MCP server running on stdio');
}

main().catch(err => {
  console.error('Failed to start MCP server:', err);
  process.exit(1);
});
