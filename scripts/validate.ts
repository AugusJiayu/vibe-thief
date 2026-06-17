/**
 * 反向验证脚本
 * 读取 DESIGN.md，让 LLM 生成一个 HTML 页面，然后用多模态 LLM 对比视觉相似度
 *
 * 用法: npx tsx scripts/validate.ts <design.md> <original-url>
 */

import { readFile } from 'node:fs/promises';
import { writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { createLLMProvider } from '../src/llm/provider.js';
import type { LLMConfig } from '../src/types/input.js';
import { join } from 'node:path';

interface ValidationResult {
  designMdPath: string;
  originalUrl: string;
  similarityScore: number;  // 0-100
  feedback: string;
  strengths: string[];
  weaknesses: string[];
}

/** 从 DESIGN.md 提取关键 token 信息 */
function extractKeyTokens(designMd: string): string {
  // 提取颜色、字体、间距等关键信息给 LLM 参考
  const lines = designMd.split('\n');
  const keyLines: string[] = [];
  let inImportantSection = false;

  for (const line of lines) {
    // 捕捉关键 section
    if (line.startsWith('## Design Tokens') ||
        line.startsWith('### Colors') ||
        line.startsWith('### Typography') ||
        line.startsWith('### Spacing') ||
        line.startsWith('## Component Patterns') ||
        line.startsWith('## Agent Usage Guide')) {
      inImportantSection = true;
    }
    if (inImportantSection) {
      keyLines.push(line);
    }
    // 在下一个顶级 section 结束
    if (inImportantSection && line.startsWith('## ') && !line.startsWith('## Design Tokens') && !line.startsWith('## Component Patterns') && !line.startsWith('## Agent Usage Guide')) {
      inImportantSection = false;
    }
  }

  return keyLines.join('\n');
}

/** 让 LLM 根据 DESIGN.md 生成 HTML */
async function generateHTML(designMd: string, llmConfig: LLMConfig): Promise<string> {
  const provider = createLLMProvider(llmConfig);
  const keyTokens = extractKeyTokens(designMd);

  const response = await provider.chat([
    {
      role: 'system',
      content: `你是一个前端开发专家。根据提供的 DESIGN.md 设计系统文档，生成一个完整的 HTML 页面。

要求：
1. 页面应该展示这个设计系统的核心视觉特征
2. 包含以下组件：导航栏、标题区域、卡片列表、按钮、输入框
3. 使用内联 CSS（<style> 标签），不要用外部框架
4. 页面内容用中文
5. 严格遵循 DESIGN.md 中定义的 token 值
6. 只输出 HTML 代码，不要任何解释

生成一个 1440x900 视口下看起来最好的页面。`,
    },
    {
      role: 'user',
      content: `以下是设计系统文档：

${designMd}

请根据这个设计系统生成一个完整的 HTML 页面。`,
    },
  ], { temperature: 0.3, maxTokens: 8192 });

  let html = response.content.trim();
  // 确保是完整 HTML
  if (!html.startsWith('<!DOCTYPE') && !html.startsWith('<html')) {
    const match = html.match(/```(?:html)?\n?([\s\S]*?)```/);
    if (match) html = match[1];
  }

  return html;
}

/** 截取原始页面和生成页面的截图 */
async function captureScreenshots(
  originalUrl: string,
  generatedHtml: string,
  outputDir: string
): Promise<{ original: string; generated: string }> {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  try {
    // 截取原始页面
    const page1 = await context.newPage();
    await page1.goto(originalUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page1.waitForTimeout(2000);
    const originalPath = join(outputDir, 'original.png');
    await page1.screenshot({ path: originalPath, fullPage: false });
    await page1.close();

    // 截取生成的页面
    const page2 = await context.newPage();
    await page2.setContent(generatedHtml, { waitUntil: 'load' });
    await page2.waitForTimeout(500);
    const generatedPath = join(outputDir, 'generated.png');
    await page2.screenshot({ path: generatedPath, fullPage: false });
    await page2.close();

    return { original: originalPath, generated: generatedPath };
  } finally {
    await browser.close();
  }
}

/** 用多模态 LLM 对比两张截图的视觉相似度 */
async function compareVisualSimilarity(
  originalPath: string,
  generatedPath: string,
  llmConfig: LLMConfig
): Promise<{ score: number; feedback: string; strengths: string[]; weaknesses: string[] }> {
  const provider = createLLMProvider({
    ...llmConfig,
    model: llmConfig.visionModel || llmConfig.model,
  });

  const { readFile } = await import('node:fs/promises');
  const originalBuffer = await readFile(originalPath);
  const generatedBuffer = await readFile(generatedPath);

  const originalBase64 = originalBuffer.toString('base64');
  const generatedBase64 = generatedBuffer.toString('base64');

  const response = await provider.chat([
    {
      role: 'system',
      content: `你是一个 UI 设计评审专家。你会看到两张截图：
1. 第一张是原始网站的截图
2. 第二张是根据设计系统文档重新生成的页面截图

请从以下维度评估第二张图在多大程度上还原了第一张图的视觉风格：
- 色彩方案（背景色、主色调、文字颜色）
- 排版（字体风格、字号层级）
- 间距和布局（留白、组件间距）
- 组件风格（按钮、卡片、输入框的圆角、阴影、边框）
- 整体氛围（专业感、现代感、密度感）

输出严格 JSON：
{
  "score": 0-100,
  "feedback": "总体评价（50-100字）",
  "strengths": ["还原准确的方面1", "方面2"],
  "weaknesses": ["还原不足的方面1", "方面2"]
}`,
    },
    {
      role: 'user',
      content: [
        { type: 'text', text: '这是原始网站的截图：' },
        { type: 'image_url', image_url: { url: `data:image/png;base64,${originalBase64}`, detail: 'high' } },
        { type: 'text', text: '这是根据设计系统文档生成的页面截图：' },
        { type: 'image_url', image_url: { url: `data:image/png;base64,${generatedBase64}`, detail: 'high' } },
        { type: 'text', text: '请评估视觉相似度，输出 JSON。' },
      ],
    },
  ], { temperature: 0.2, maxTokens: 1024, jsonMode: true });

  try {
    let jsonStr = response.content.trim();
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }
    const result = JSON.parse(jsonStr);
    return {
      score: result.score || 0,
      feedback: result.feedback || '',
      strengths: result.strengths || [],
      weaknesses: result.weaknesses || [],
    };
  } catch {
    return {
      score: 0,
      feedback: 'Failed to parse LLM response',
      strengths: [],
      weaknesses: ['LLM output parsing failed'],
    };
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: npx tsx scripts/validate.ts <design.md> <original-url>');
    process.exit(1);
  }

  const designMdPath = args[0];
  const originalUrl = args[1];

  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('Error: Set ANTHROPIC_API_KEY or OPENAI_API_KEY');
    process.exit(1);
  }

  const llmConfig: LLMConfig = {
    provider: (process.env.LLM_PROVIDER as any) || 'anthropic',
    model: process.env.LLM_MODEL || 'mimo-v2.5-pro',
    visionModel: process.env.LLM_VISION_MODEL || 'mimo-v2.5',
    apiKey,
    baseUrl: process.env.LLM_BASE_URL,
  };

  const outputDir = join(process.cwd(), 'validation-results');
  const { mkdir } = await import('node:fs/promises');
  await mkdir(outputDir, { recursive: true });

  console.log(`📄 Reading DESIGN.md: ${designMdPath}`);
  const designMd = await readFile(designMdPath, 'utf-8');

  console.log(`🎨 Generating HTML from DESIGN.md...`);
  const generatedHtml = await generateHTML(designMd, llmConfig);
  await writeFile(join(outputDir, 'generated.html'), generatedHtml, 'utf-8');
  console.log(`   Saved to ${join(outputDir, 'generated.html')}`);

  console.log(`📸 Capturing screenshots...`);
  const screenshots = await captureScreenshots(originalUrl, generatedHtml, outputDir);
  console.log(`   Original: ${screenshots.original}`);
  console.log(`   Generated: ${screenshots.generated}`);

  console.log(`🔍 Comparing visual similarity...`);
  const comparison = await compareVisualSimilarity(
    screenshots.original,
    screenshots.generated,
    llmConfig
  );

  const result: ValidationResult = {
    designMdPath,
    originalUrl,
    similarityScore: comparison.score,
    feedback: comparison.feedback,
    strengths: comparison.strengths,
    weaknesses: comparison.weaknesses,
  };

  console.log('\n' + '='.repeat(60));
  console.log('VALIDATION RESULT');
  console.log('='.repeat(60));
  console.log(`\nSimilarity Score: ${result.similarityScore}/100`);
  console.log(`\nFeedback: ${result.feedback}`);
  console.log(`\nStrengths:`);
  for (const s of result.strengths) console.log(`  ✅ ${s}`);
  console.log(`\nWeaknesses:`);
  for (const w of result.weaknesses) console.log(`  ❌ ${w}`);

  await writeFile(
    join(outputDir, 'validation.json'),
    JSON.stringify(result, null, 2),
    'utf-8'
  );
  console.log(`\nResults saved to ${join(outputDir, 'validation.json')}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
