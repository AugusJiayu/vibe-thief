/**
 * 编译层
 * 两阶段 LLM 处理：结构化分析 → 设计文档生成
 */

import type { CSSExtraction, PixelExtraction, VisionAnalysis } from '../types/extraction.js';
import type { DesignSystemDoc } from '../types/design-doc.js';
import type { LLMConfig } from '../types/input.js';
import { createLLMProvider, type LLMMessage } from '../llm/provider.js';
import { buildAnalysisPrompt } from '../llm/prompts/analysis.js';
import { buildGenerationPrompt } from '../llm/prompts/generation.js';
import { logger } from '../utils/logger.js';

export interface CompileResult {
  doc: DesignSystemDoc;
  llmTokensUsed: number;
  notes: string[];
  stage1Success: boolean;
  stage2Success: boolean;
}

/**
 * 编译层入口
 * 将提取数据编译为 DesignSystemDoc
 */
export async function compile(
  cssData: CSSExtraction,
  pixelData: PixelExtraction | null,
  visionData: VisionAnalysis | null,
  llmConfig: LLMConfig,
  source: string,
  language: 'zh' | 'en' = 'zh'
): Promise<CompileResult> {
  let totalTokensUsed = 0;
  const notes: string[] = [];

  // 阶段 1：结构化分析
  logger.info('Stage 1: Structural analysis...');
  const stage1Result = await stage1Analysis(cssData, pixelData, llmConfig);
  totalTokensUsed += stage1Result.tokensUsed;
  notes.push(...(stage1Result.notes || []));
  const stage1Success = !stage1Result.notes?.includes('Stage 1 LLM output was not valid JSON, using fallback');

  // 阶段 2：设计文档生成
  logger.info('Stage 2: Design document generation...');
  const stage2Result = await stage2Generation(stage1Result.data, visionData, llmConfig, source, language);
  totalTokensUsed += stage2Result.tokensUsed;

  logger.info(`Compilation complete. LLM tokens used: ${totalTokensUsed}`);

  return {
    doc: stage2Result.doc,
    llmTokensUsed: totalTokensUsed,
    notes,
    stage1Success,
    stage2Success: true,
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
    if (!jsonStr.endsWith('}')) {
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
    return {
      data: buildFallbackTokens(cssData),
      tokensUsed: response.usage.totalTokens,
      notes: ['Stage 1 LLM output was not valid JSON, using fallback'],
    };
  }
}

/** 阶段 2：设计文档生成 */
async function stage2Generation(
  tokenData: Record<string, unknown>,
  visionData: VisionAnalysis | null,
  llmConfig: LLMConfig,
  source: string,
  language: 'zh' | 'en'
): Promise<{ doc: DesignSystemDoc; tokensUsed: number }> {
  const provider = createLLMProvider(llmConfig);
  const { system, user } = buildGenerationPrompt(tokenData, visionData, language);

  const messages: LLMMessage[] = [
    { role: 'system', content: system },
    { role: 'user', content: user },
  ];

  const response = await provider.chat(messages, {
    temperature: 0.4,
    maxTokens: 12288,
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
    const doc = JSON.parse(jsonStr) as DesignSystemDoc;

    // 确保 frontmatter 元数据正确
    doc.frontmatter = {
      schema: 'vibe-thief/1.0',
      source,
      extracted_at: new Date().toISOString(),
      confidence: doc.frontmatter?.confidence ?? 0.8,
      generator: 'vibe-thief@0.1.0',
      mood: doc.frontmatter?.mood || 'unknown',
      style_archetype: doc.frontmatter?.style_archetype || 'custom',
    };

    return { doc, tokensUsed: response.usage.totalTokens };
  } catch (err) {
    logger.error(`Stage 2 JSON parse failed: ${err}, building fallback doc`);
    return {
      doc: buildFallbackDoc(tokenData, source),
      tokensUsed: response.usage.totalTokens,
    };
  }
}

/** 降级方案：从 Stage 1 数据构建基础 token */
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

/** 降级方案：构建基础 DesignSystemDoc */
function buildFallbackDoc(tokenData: Record<string, unknown>, source: string): DesignSystemDoc {
  const colors = (tokenData.colors as any) || {};
  const typography = (tokenData.typography as any) || {};
  const spacing = (tokenData.spacing as any) || {};

  return {
    frontmatter: {
      schema: 'vibe-thief/1.0',
      source,
      extracted_at: new Date().toISOString(),
      confidence: 0.5,
      generator: 'vibe-thief@0.1.0',
      mood: 'unknown',
      style_archetype: 'custom',
    },
    narrative: {
      philosophy: '（LLM 编译失败，以下是基于 CSS 数据的自动提取结果）',
      keywords: [],
    },
    colors: {
      background_layers: [],
      signal_colors: colors.primary ? [{ token: 'primary', value: colors.primary.value || '#000', usage: '主色' }] : [],
      text_hierarchy: [{ token: 'text', value: '#000000', usage: '正文' }],
      philosophy: '',
    },
    typography: {
      font_stack: {
        heading: typography.fontFamily?.heading || 'sans-serif',
        body: typography.fontFamily?.body || 'sans-serif',
        mono: typography.fontFamily?.mono || 'monospace',
      },
      scale: (typography.scale || []).map((s: any) => ({
        token: s.name || 'text',
        size: s.size || '16px',
        weight: s.weight || 400,
        usage: '',
      })),
      philosophy: '',
    },
    spacing: {
      base_unit: spacing.baseUnit || '4px',
      scale: (spacing.scale || []).map((s: any) => ({
        token: s.name || 'space',
        value: s.value || '8px',
        usage: '',
      })),
      philosophy: '',
    },
    depth: { border_radius: [], shadows: [], borders: [], philosophy: '' },
    motion: { tokens: [], philosophy: '' },
    motion_language: {
      scroll_behavior: '无特殊滚动行为',
      interaction_feedback: '颜色微调 + 轻微位移',
      page_transitions: '无页面级转场',
      micro_interactions: '标准 loading spinner',
      motion_personality: '（LLM 编译失败，无法提取动效语言）',
    },
    visual_language: {
      layout_philosophy: '（LLM 编译失败，无法提取布局哲学）',
      imagery_style: '未知',
      icon_style: '未知',
      information_density: '未知',
      brand_personality: [],
    },
    components: [],
    interactions: {
      hover_style: '颜色微调',
      focus_style: 'outline',
      active_style: '颜色变深',
      loading_style: 'spinner',
      transition_speed: '150ms ease-out',
    },
    layout: { max_width: '1200px', breakpoints: [], philosophy: '' },
    agent_guide: { do: [], dont: [] },
  };
}
