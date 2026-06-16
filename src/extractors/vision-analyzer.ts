/**
 * 视觉感知分析器
 * 使用多模态 LLM 分析截图的设计感知
 */

import type { VisionAnalysis } from '../types/extraction.js';
import type { LLMConfig } from '../types/input.js';
import { createLLMProvider, type LLMMessage } from '../llm/provider.js';
import { logger } from '../utils/logger.js';

/**
 * 分析截图的视觉感知
 */
export async function analyzeVision(
  screenshotBuffer: Buffer,
  llmConfig: LLMConfig
): Promise<VisionAnalysis> {
  logger.info('Analyzing screenshot with multimodal LLM...');

  // 使用 visionModel（如果指定），否则用默认 model
  const visionConfig = llmConfig.visionModel
    ? { ...llmConfig, model: llmConfig.visionModel }
    : llmConfig;
  const provider = createLLMProvider(visionConfig);
  const base64 = screenshotBuffer.toString('base64');
  const dataUrl = `data:image/png;base64,${base64}`;

  const messages: LLMMessage[] = [
    {
      role: 'system',
      content: `你是一个 UI 设计感知分析专家。请分析截图中的设计特征，输出 JSON。

分析维度：
1. mood：整体情绪（professional/playful/minimal/bold/elegant 等）和描述词
2. components：按钮、卡片、输入框的圆角/阴影/边框风格
3. layout：密度（sparse/comfortable/compact）、对齐方式、网格感
4. visualWeight：对比度、视觉重点（typography/color/imagery/balanced）
5. interactions：hover 风格、focus 风格、过渡速度

输出严格 JSON，不要包含任何解释文字。confidence 字段表示你对判断的确信度（0-1）。`,
    },
    {
      role: 'user',
      content: [
        {
          type: 'image_url',
          image_url: { url: dataUrl, detail: 'high' },
        },
        {
          type: 'text',
          text: '请分析这个 UI 截图的设计感知特征，输出 JSON。',
        },
      ],
    },
  ];

  const response = await provider.chat(messages, {
    temperature: 0.2,
    maxTokens: 2048,
    jsonMode: true,
  });

  try {
    // 提取 JSON（处理可能的 markdown 代码块包裹）
    let jsonStr = response.content.trim();
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }
    const parsed = JSON.parse(jsonStr);

    // 兼容不同的响应格式
    const result: VisionAnalysis = {
      mood: {
        primary: parsed.mood?.primary || parsed.mood || parsed.Mood || 'unknown',
        descriptors: parsed.mood?.descriptors || parsed.descriptors || [],
      },
      components: parsed.components || parsed.Components || {
        buttons: { borderRadius: 'rounded', shadowType: 'subtle', borderWeight: 'thin' },
        cards: { borderRadius: '8px', shadowType: 'subtle', hasBorder: false },
        inputs: { style: 'outlined', borderRadius: '4px' },
      },
      layout: parsed.layout || parsed.Layout || { density: 'comfortable', alignment: 'left', gridFeeling: 'strict' },
      visualWeight: parsed.visualWeight || parsed.visual_weight || { contrast: 'medium', emphasis: 'balanced' },
      interactions: parsed.interactions || { hoverStyle: 'color change', focusStyle: 'outline', transitionSpeed: 'fast' },
      confidence: parsed.confidence ?? 0.5,
    };

    logger.info(`Vision analysis complete: mood=${result.mood.primary}, confidence=${result.confidence}`);
    return result;
  } catch (err) {
    logger.error(`Failed to parse vision analysis response: ${err}`);
    logger.debug(`Raw response: ${response.content}`);
    // 返回默认值
    return {
      mood: { primary: 'unknown', descriptors: [] },
      components: {
        buttons: { borderRadius: 'rounded', shadowType: 'subtle', borderWeight: 'thin' },
        cards: { borderRadius: '8px', shadowType: 'subtle', hasBorder: false },
        inputs: { style: 'outlined', borderRadius: '4px' },
      },
      layout: { density: 'comfortable', alignment: 'left', gridFeeling: 'strict' },
      visualWeight: { contrast: 'medium', emphasis: 'balanced' },
      interactions: { hoverStyle: 'color change', focusStyle: 'outline', transitionSpeed: 'fast' },
      confidence: 0.1,
    };
  }
}
