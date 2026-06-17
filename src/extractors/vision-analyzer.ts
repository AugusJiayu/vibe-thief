/**
 * 视觉感知分析器
 * 使用多模态 LLM 分析截图的设计感知
 */

import type { VisionAnalysis } from '../types/extraction.js';
import type { LLMConfig } from '../types/input.js';
import type { MultiScreenshot } from '../browser/multi-screenshot.js';
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

/**
 * 多维度视觉分析
 * 使用多张截图（多视口、多区域、交互状态）进行更全面的分析
 */
export async function analyzeVisionMulti(
  screenshots: MultiScreenshot,
  llmConfig: LLMConfig
): Promise<VisionAnalysis> {
  logger.info('Analyzing with multi-dimensional screenshots...');

  const visionConfig = llmConfig.visionModel
    ? { ...llmConfig, model: llmConfig.visionModel }
    : llmConfig;
  const provider = createLLMProvider(visionConfig);

  // 构建多图消息
  const imageParts: Array<{ type: 'image_url'; image_url: { url: string; detail: 'high' | 'low' | 'auto' } }> = [];
  const descriptions: string[] = [];

  // 桌面端首屏（最重要）
  const desktop = screenshots.viewports.find(v => v.name === 'desktop');
  if (desktop) {
    imageParts.push({
      type: 'image_url',
      image_url: { url: `data:image/png;base64,${desktop.buffer.toString('base64')}`, detail: 'high' },
    });
    descriptions.push('图1: 桌面端 (1440x900) 首屏');
  }

  // 平板视口
  const tablet = screenshots.viewports.find(v => v.name === 'tablet');
  if (tablet) {
    imageParts.push({
      type: 'image_url',
      image_url: { url: `data:image/png;base64,${tablet.buffer.toString('base64')}`, detail: 'high' },
    });
    descriptions.push('图2: 平板 (768x1024) 响应式布局');
  }

  // 手机视口
  const mobile = screenshots.viewports.find(v => v.name === 'mobile');
  if (mobile) {
    imageParts.push({
      type: 'image_url',
      image_url: { url: `data:image/png;base64,${mobile.buffer.toString('base64')}`, detail: 'high' },
    });
    descriptions.push('图3: 手机 (375x812) 响应式布局');
  }

  // 页面中部
  const mid = screenshots.sections.find(s => s.name === 'mid');
  if (mid) {
    imageParts.push({
      type: 'image_url',
      image_url: { url: `data:image/png;base64,${mid.buffer.toString('base64')}`, detail: 'high' },
    });
    descriptions.push('图4: 页面中部区域');
  }

  // 交互状态（如果有按钮 hover）
  const btnHover = screenshots.interactions.find(i => i.element === 'button' && i.state === 'hover');
  if (btnHover) {
    imageParts.push({
      type: 'image_url',
      image_url: { url: `data:image/png;base64,${btnHover.buffer.toString('base64')}`, detail: 'high' },
    });
    descriptions.push('图5: 按钮 hover 状态');
  }

  // CSS 动画信息作为文本
  let animationText = '';
  if (screenshots.animations.length > 0) {
    animationText = '\n\n【CSS 动画信息】\n' + screenshots.animations
      .map(a => `${a.selector}: ${a.property} = ${a.value} (${a.duration}, ${a.easing})`)
      .join('\n');
  }

  const messages: LLMMessage[] = [
    {
      role: 'system',
      content: `你是一个 UI 设计感知分析专家。你会看到一个网站的多张截图（不同视口、不同区域、交互状态）以及 CSS 动画信息。
请综合分析这些信息，输出 JSON。

分析维度：
1. mood：整体情绪和风格关键词
2. components：按钮、卡片、输入框的圆角/阴影/边框风格
3. layout：密度、对齐、网格感、响应式策略
4. visualWeight：对比度、视觉重点
5. interactions：hover 风格、focus 风格、过渡速度、动画特征

输出严格 JSON，不要用 markdown 代码块包裹：
{"mood":{"primary":"描述","descriptors":["词1","词2"]},"components":{"buttons":{"borderRadius":"sharp|slight|rounded|pill","shadowType":"none|subtle|pronounced","borderWeight":"none|thin|medium"},"cards":{"borderRadius":"值","shadowType":"值","hasBorder":true},"inputs":{"style":"outlined|filled|underlined","borderRadius":"值"}},"layout":{"density":"sparse|comfortable|compact","alignment":"left|center|mixed","gridFeeling":"strict|organic|asymmetric"},"visualWeight":{"contrast":"low|medium|high","emphasis":"typography|color|imagery|balanced"},"interactions":{"hoverStyle":"描述","focusStyle":"描述","transitionSpeed":"instant|fast|smooth|slow"},"confidence":0.8}`,
    },
    {
      role: 'user',
      content: [
        { type: 'text', text: descriptions.join('\n') + animationText + '\n\n请综合分析这些截图的设计特征。' },
        ...imageParts,
      ],
    },
  ];

  try {
    const response = await provider.chat(messages, {
      temperature: 0.2,
      maxTokens: 2048,
    });

    let jsonStr = response.content.trim();
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (jsonMatch) jsonStr = jsonMatch[0];

    const parsed = JSON.parse(jsonStr);

    const result: VisionAnalysis = {
      mood: {
        primary: parsed.mood?.primary || parsed.mood || 'unknown',
        descriptors: parsed.mood?.descriptors || parsed.descriptors || [],
      },
      components: parsed.components || {
        buttons: { borderRadius: 'rounded', shadowType: 'subtle', borderWeight: 'thin' },
        cards: { borderRadius: '8px', shadowType: 'subtle', hasBorder: false },
        inputs: { style: 'outlined', borderRadius: '4px' },
      },
      layout: parsed.layout || { density: 'comfortable', alignment: 'left', gridFeeling: 'strict' },
      visualWeight: parsed.visualWeight || { contrast: 'medium', emphasis: 'balanced' },
      interactions: parsed.interactions || { hoverStyle: 'color change', focusStyle: 'outline', transitionSpeed: 'fast' },
      confidence: parsed.confidence ?? 0.5,
    };

    logger.info(`Multi-vision analysis complete: mood=${result.mood.primary}, confidence=${result.confidence}`);
    return result;
  } catch (err) {
    logger.error(`Multi-vision analysis failed: ${err}`);
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
