/**
 * 编译层
 * 两阶段 LLM 处理：结构化分析 → 感知融合
 */

import type { CSSExtraction, PixelExtraction, VisionAnalysis } from '../types/extraction.js';
import type { DesignTokens } from '../types/tokens.js';
import type { LLMConfig } from '../types/input.js';
import { createLLMProvider, type LLMMessage } from '../llm/provider.js';
import { buildAnalysisPrompt } from '../llm/prompts/analysis.js';
import { buildGenerationPrompt } from '../llm/prompts/generation.js';
import { logger } from '../utils/logger.js';

export interface CompileResult {
  tokens: DesignTokens;
  llmTokensUsed: number;
  notes: string[];
}

/**
 * 编译层入口
 * 将提取数据编译为最终 DesignTokens
 */
export async function compile(
  cssData: CSSExtraction,
  pixelData: PixelExtraction | null,
  visionData: VisionAnalysis | null,
  llmConfig: LLMConfig,
  language: 'zh' | 'en' = 'zh'
): Promise<CompileResult> {
  let totalTokensUsed = 0;
  const notes: string[] = [];

  // 阶段 1：结构化分析
  logger.info('Stage 1: Structural analysis...');
  const stage1Result = await stage1Analysis(cssData, pixelData, llmConfig);
  totalTokensUsed += stage1Result.tokensUsed;
  notes.push(...(stage1Result.notes || []));

  // 阶段 2：感知融合
  logger.info('Stage 2: Perception fusion...');
  const stage2Result = await stage2Fusion(stage1Result.data, visionData, llmConfig, language);
  totalTokensUsed += stage2Result.tokensUsed;

  // 确保必要字段存在
  const tokens = ensureDefaults(stage2Result.data) as unknown as DesignTokens;

  logger.info(`Compilation complete. LLM tokens used: ${totalTokensUsed}`);

  return {
    tokens: tokens as DesignTokens,
    llmTokensUsed: totalTokensUsed,
    notes,
  };
}

/** 阶段 1：结构化分析 */
async function stage1Analysis(
  cssData: CSSExtraction,
  pixelData: PixelExtraction | null,
  llmConfig: LLMConfig
): Promise<{ data: Record<string, unknown>; tokensUsed: number; notes: string[] }> {
  const provider = createLLMProvider(llmConfig);
  const { system, user } = buildAnalysisPrompt(cssData, pixelData);

  const messages: LLMMessage[] = [
    { role: 'system', content: system },
    { role: 'user', content: user },
  ];

  const response = await provider.chat(messages, {
    temperature: 0.2,
    maxTokens: 8192,
    jsonMode: true,
  });

  try {
    let jsonStr = response.content.trim();
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }
    // 修复可能被截断的 JSON
    if (!jsonStr.endsWith('}')) {
      // 尝试找到最后一个完整的对象闭合
      const lastBrace = jsonStr.lastIndexOf('}');
      if (lastBrace > 0) {
        jsonStr = jsonStr.substring(0, lastBrace + 1);
      }
    }
    const data = JSON.parse(jsonStr);
    return {
      data,
      tokensUsed: response.usage.totalTokens,
      notes: data.notes || [],
    };
  } catch (err) {
    logger.error(`Stage 1 JSON parse failed: ${err}`);
    // 降级：用原始数据构建基础 token
    return {
      data: buildFallbackTokens(cssData),
      tokensUsed: response.usage.totalTokens,
      notes: ['Stage 1 LLM output was not valid JSON, using fallback'],
    };
  }
}

/** 阶段 2：感知融合 */
async function stage2Fusion(
  tokenData: Record<string, unknown>,
  visionData: VisionAnalysis | null,
  llmConfig: LLMConfig,
  language: 'zh' | 'en'
): Promise<{ data: Record<string, unknown>; tokensUsed: number }> {
  const provider = createLLMProvider(llmConfig);
  const { system, user } = buildGenerationPrompt(tokenData, visionData, language);

  const messages: LLMMessage[] = [
    { role: 'system', content: system },
    { role: 'user', content: user },
  ];

  const response = await provider.chat(messages, {
    temperature: 0.5,
    maxTokens: 8192,
    jsonMode: true,
  });

  try {
    let jsonStr = response.content.trim();
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }
    if (!jsonStr.endsWith('}')) {
      const lastBrace = jsonStr.lastIndexOf('}');
      if (lastBrace > 0) {
        jsonStr = jsonStr.substring(0, lastBrace + 1);
      }
    }
    const data = JSON.parse(jsonStr);
    return { data, tokensUsed: response.usage.totalTokens };
  } catch (err) {
    logger.error(`Stage 2 JSON parse failed: ${err}, returning stage 1 data`);
    return { data: tokenData, tokensUsed: response.usage.totalTokens };
  }
}

/** 降级方案：从 CSS 数据构建基础 token */
function buildFallbackTokens(cssData: CSSExtraction): Record<string, unknown> {
  const colors = cssData.colors.raw.slice(0, 10);
  return {
    colors: {
      primary: colors[0] ? { value: colors[0].value, name: 'Primary' } : { value: '#000000' },
      secondary: colors[1] ? { value: colors[1].value, name: 'Secondary' } : { value: '#666666' },
    },
    typography: {
      fontFamily: {
        heading: cssData.typography.fontFamilies[0]?.family || 'sans-serif',
        body: cssData.typography.fontFamilies[0]?.family || 'sans-serif',
        mono: 'monospace',
      },
      scale: cssData.typography.fontSizes.map((fs, i) => ({
        name: `size-${i}`,
        size: fs.size,
        weight: 400,
        lineHeight: '1.5',
      })),
    },
    spacing: {
      baseUnit: cssData.spacing.detectedBaseUnit || '4px',
      scale: cssData.spacing.values.slice(0, 8).map((v, i) => ({
        name: `${i + 1}`,
        value: v.value,
      })),
    },
  };
}

/** 确保必要字段存在 */
function ensureDefaults(data: Record<string, unknown>): Record<string, unknown> {
  if (!data.colors) data.colors = {};
  if (!data.typography) data.typography = {};
  if (!data.spacing) data.spacing = {};
  if (!data.borderRadius) data.borderRadius = {};
  if (!data.shadows) data.shadows = {};
  if (!data.perception) {
    data.perception = {
      mood: 'unknown',
      descriptors: [],
      density: 'comfortable',
      contrastLevel: 'medium',
      designPhilosophy: '',
    };
  }
  return data;
}
