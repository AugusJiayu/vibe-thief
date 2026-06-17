/**
 * 批量测试脚本
 * 对多个网站运行完整 pipeline，输出 DESIGN.md 和元数据
 *
 * 用法: npx tsx scripts/test-pipeline.ts
 */

import { extractFromURL } from '../src/pipeline/orchestrator.js';
import type { PipelineConfig } from '../src/types/input.js';
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

// 测试网站列表（选择设计风格各异的网站）
const TEST_SITES = [
  { name: 'linear', url: 'https://linear.app', archetype: 'dark-tool' },
  { name: 'notion', url: 'https://notion.so', archetype: 'light-saas' },
  { name: 'vercel', url: 'https://vercel.com', archetype: 'developer-docs' },
  { name: 'stripe', url: 'https://stripe.com', archetype: 'playful-brand' },
  { name: 'github', url: 'https://github.com', archetype: 'developer-docs' },
  { name: 'spotify', url: 'https://open.spotify.com', archetype: 'consumer-app' },
  { name: 'medium', url: 'https://medium.com', archetype: 'news-editorial' },
  { name: 'figma', url: 'https://figma.com', archetype: 'light-saas' },
  { name: 'tailwind', url: 'https://tailwindcss.com', archetype: 'developer-docs' },
  { name: 'hn', url: 'https://news.ycombinator.com', archetype: 'news-editorial' },
];

interface TestResult {
  name: string;
  url: string;
  expectedArchetype: string;
  detectedArchetype: string;
  confidence: number;
  duration: number;
  llmTokens: number;
  degraded: string[];
  success: boolean;
  error?: string;
}

async function runTest(
  site: typeof TEST_SITES[0],
  config: PipelineConfig,
  outputDir: string
): Promise<TestResult> {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing: ${site.name} (${site.url})`);
  console.log('='.repeat(60));

  const startTime = Date.now();

  try {
    const result = await extractFromURL(site.url, config);

    // 写入 DESIGN.md
    const mdPath = join(outputDir, `${site.name}-design.md`);
    await writeFile(mdPath, result.markdown, 'utf-8');

    // 写入原始数据（调试用）
    const rawPath = join(outputDir, `${site.name}-raw.json`);
    await writeFile(rawPath, JSON.stringify(result.raw, null, 2), 'utf-8');

    // 写入 doc（结构化数据）
    const docPath = join(outputDir, `${site.name}-doc.json`);
    await writeFile(docPath, JSON.stringify(result.doc, null, 2), 'utf-8');

    console.log(`✅ ${site.name}: confidence=${result.meta.confidence}, duration=${result.meta.duration}ms`);

    return {
      name: site.name,
      url: site.url,
      expectedArchetype: site.archetype,
      detectedArchetype: result.doc.frontmatter.style_archetype,
      confidence: result.meta.confidence,
      duration: result.meta.duration,
      llmTokens: result.meta.llmTokensUsed,
      degraded: result.meta.degraded,
      success: true,
    };
  } catch (err) {
    const duration = Date.now() - startTime;
    console.log(`❌ ${site.name}: ${err instanceof Error ? err.message : err}`);

    return {
      name: site.name,
      url: site.url,
      expectedArchetype: site.archetype,
      detectedArchetype: 'unknown',
      confidence: 0,
      duration,
      llmTokens: 0,
      degraded: ['all'],
      success: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

async function main() {
  const outputDir = join(process.cwd(), 'test-results');
  await mkdir(outputDir, { recursive: true });

  // 从环境变量读取配置
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('Error: Set ANTHROPIC_API_KEY or OPENAI_API_KEY');
    process.exit(1);
  }

  const config: PipelineConfig = {
    llm: {
      provider: (process.env.LLM_PROVIDER as any) || 'anthropic',
      model: process.env.LLM_MODEL || 'mimo-v2.5-pro',
      visionModel: process.env.LLM_VISION_MODEL || 'mimo-v2.5',
      apiKey,
      baseUrl: process.env.LLM_BASE_URL,
    },
    browser: {
      headless: true,
      channel: 'chrome' as const,
    },
    output: { format: 'full', language: 'zh' },
  };

  console.log('🚀 Starting batch test...');
  console.log(`Output directory: ${outputDir}`);
  console.log(`Sites to test: ${TEST_SITES.length}`);

  const results: TestResult[] = [];

  for (const site of TEST_SITES) {
    const result = await runTest(site, config, outputDir);
    results.push(result);

    // 写入中间结果（防止中途失败丢失数据）
    await writeFile(
      join(outputDir, 'results.json'),
      JSON.stringify(results, null, 2),
      'utf-8'
    );
  }

  // 输出汇总
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));

  const successCount = results.filter(r => r.success).length;
  const avgConfidence = results.filter(r => r.success).reduce((sum, r) => sum + r.confidence, 0) / successCount;
  const avgDuration = results.filter(r => r.success).reduce((sum, r) => sum + r.duration, 0) / successCount;
  const totalTokens = results.reduce((sum, r) => sum + r.llmTokens, 0);

  console.log(`\nSuccess: ${successCount}/${results.length}`);
  console.log(`Avg Confidence: ${(avgConfidence * 100).toFixed(1)}%`);
  console.log(`Avg Duration: ${(avgDuration / 1000).toFixed(1)}s`);
  console.log(`Total LLM Tokens: ${totalTokens.toLocaleString()}`);

  // 详细结果表
  console.log('\n| Site | Archetype (Expected) | Archetype (Detected) | Confidence | Duration |');
  console.log('|------|---------------------|---------------------|------------|----------|');
  for (const r of results) {
    const status = r.success ? '✅' : '❌';
    const archetypeMatch = r.expectedArchetype === r.detectedArchetype ? '✅' : '⚠️';
    console.log(`| ${status} ${r.name} | ${r.expectedArchetype} | ${r.detectedArchetype} ${archetypeMatch} | ${(r.confidence * 100).toFixed(0)}% | ${(r.duration / 1000).toFixed(1)}s |`);
  }

  // 写入最终结果
  await writeFile(
    join(outputDir, 'results.json'),
    JSON.stringify(results, null, 2),
    'utf-8'
  );
  console.log(`\nResults saved to ${join(outputDir, 'results.json')}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
