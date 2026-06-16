#!/usr/bin/env node
/**
 * vibe-thief CLI
 * 从 URL 或截图提取设计系统，生成 DESIGN.md
 */

import { Command } from 'commander';
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { extractFromURL, extractFromScreenshot, extractOnly } from './pipeline/orchestrator.js';
import { setLogLevel } from './utils/logger.js';
import type { PipelineConfig } from './types/input.js';

const program = new Command();

program
  .name('vibe-thief')
  .description('Good artists copy, great artists steal. Extract design systems from any website.')
  .version('0.1.0');

program
  .argument('[url]', 'Website URL to extract design system from')
  .option('-s, --screenshot <path>', 'Extract from screenshot file instead of URL')
  .option('-o, --output <path>', 'Output file path', 'DESIGN.md')
  .option('--llm <provider>', 'LLM provider: openai / anthropic / custom')
  .option('-m, --model <model>', 'LLM model name (text)')
  .option('--vision-model <model>', 'Multimodal model for vision analysis')
  .option('--api-key <key>', 'LLM API key')
  .option('--base-url <url>', 'Custom LLM endpoint URL')
  .option('-f, --format <format>', 'Output format: md or json', 'md')
  .option('--extract-only', 'Only extract, do not compile (debug mode)')
  .option('-d, --debug', 'Enable debug logging')
  .option('-l, --lang <language>', 'Output language: zh or en', 'zh')
  .option('--viewport <size>', 'Browser viewport size', '1440x900')
  .option('--wait <strategy>', 'Page load strategy: load / domcontentloaded / networkidle', 'domcontentloaded')
  .option('--channel <channel>', 'Use system browser: chrome / msedge (skip Playwright download)')
  .action(async (url: string | undefined, options) => {
    // 配置日志
    if (options.debug) {
      setLogLevel('debug');
    }

    // 验证输入
    if (!url && !options.screenshot) {
      console.error('Error: Please provide a URL or use --screenshot to specify a screenshot file.');
      console.error('Usage: vibe-thief <url> or vibe-thief --screenshot <path>');
      process.exit(1);
    }

    // 读取 LLM 配置
    const llmProvider = options.llm || process.env.LLM_PROVIDER || 'anthropic';
    const llmModel = options.model || process.env.LLM_MODEL || getDefaultModel(llmProvider);
    const llmVisionModel = options.visionModel || process.env.LLM_VISION_MODEL;
    const llmApiKey = options.apiKey || getApiKey(llmProvider);

    // 仅在需要 LLM 时检查 API key
    if (!options.extractOnly && !llmApiKey) {
      console.error(`Error: No API key found for ${llmProvider}.`);
      console.error(`Set ${getEnvKeyName(llmProvider)} environment variable or use --api-key option.`);
      process.exit(1);
    }

    // 解析 viewport
    const [vpWidth, vpHeight] = options.viewport.split('x').map(Number);

    // 构建配置
    const config: PipelineConfig = {
      llm: {
        provider: llmProvider as 'openai' | 'anthropic' | 'custom',
        model: llmModel,
        visionModel: llmVisionModel,
        apiKey: llmApiKey,
        baseUrl: options.baseUrl || process.env.LLM_BASE_URL,
      },
      browser: {
        headless: true,
        viewport: { width: vpWidth || 1440, height: vpHeight || 900 },
        waitUntil: options.wait as 'load' | 'domcontentloaded' | 'networkidle',
        channel: options.channel as 'chrome' | 'msedge' | undefined,
      },
      output: {
        format: 'full',
        language: options.lang as 'zh' | 'en',
      },
    };

    try {
      console.log('🔍 Starting design system extraction...');

      // 调试模式：仅提取，不调用 LLM
      if (options.extractOnly) {
        const source = options.screenshot
          ? { type: 'screenshot' as const, filePath: resolve(options.screenshot) }
          : { type: 'url' as const, url: url! };
        const raw = await extractOnly(source, config);
        console.log('\n📦 Raw extraction data:');
        console.log(JSON.stringify(raw, null, 2));
        return;
      }

      let result;
      if (options.screenshot) {
        result = await extractFromScreenshot(resolve(options.screenshot), config);
      } else {
        result = await extractFromURL(url!, config);
      }

      let outputContent: string;
      if (options.format === 'json') {
        outputContent = JSON.stringify(result.doc, null, 2);
      } else {
        outputContent = result.markdown;
      }

      // 写入文件
      const outputPath = resolve(options.output);
      await mkdir(dirname(outputPath), { recursive: true });
      await writeFile(outputPath, outputContent, 'utf-8');

      // 输出摘要
      console.log(`\n✅ Design system extracted successfully!`);
      console.log(`   📄 Output: ${outputPath}`);
      console.log(`   ⏱  Duration: ${result.meta.duration}ms`);
      console.log(`   🎯 Confidence: ${(result.meta.confidence * 100).toFixed(0)}%`);
      if (result.meta.degraded.length > 0) {
        console.log(`   ⚠️  Degraded: ${result.meta.degraded.join(', ')}`);
      }
      if (result.meta.llmTokensUsed > 0) {
        console.log(`   🔤 LLM tokens: ${result.meta.llmTokensUsed.toLocaleString()}`);
      }
    } catch (err) {
      console.error(`\n❌ Extraction failed: ${err instanceof Error ? err.message : err}`);
      if (options.debug) {
        console.error(err);
      }
      process.exit(1);
    }
  });

function getDefaultModel(provider: string): string {
  switch (provider) {
    case 'openai': return 'gpt-4o';
    case 'anthropic': return 'claude-sonnet-4-20250514';
    default: return 'gpt-4o';
  }
}

function getApiKey(provider: string): string | undefined {
  switch (provider) {
    case 'openai': return process.env.OPENAI_API_KEY;
    case 'anthropic': return process.env.ANTHROPIC_API_KEY;
    default: return process.env.LLM_API_KEY;
  }
}

function getEnvKeyName(provider: string): string {
  switch (provider) {
    case 'openai': return 'OPENAI_API_KEY';
    case 'anthropic': return 'ANTHROPIC_API_KEY';
    default: return 'LLM_API_KEY';
  }
}

program.parse();
