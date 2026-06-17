/**
 * Playwright 浏览器实例管理器
 * 支持使用系统 Chrome/Edge 或 Playwright 内置 Chromium
 */

import { chromium, type Browser, type BrowserContext, type Page } from 'playwright';
import type { BrowserConfig } from '../types/input.js';
import { logger } from '../utils/logger.js';

export interface BrowserManagerConfig extends BrowserConfig {
  /** 使用系统浏览器通道: 'chrome', 'msedge', 或 undefined (用 Playwright 内置) */
  channel?: 'chrome' | 'msedge' | 'chrome-canary' | 'msedge-canary';
}

const DEFAULT_CONFIG: Required<BrowserManagerConfig> = {
  headless: true,
  viewport: { width: 1440, height: 900 },
  waitUntil: 'domcontentloaded',
  locale: 'zh-CN',
  channel: 'msedge' as any,  // 默认使用 Edge，Chrome 有网络问题
};

export class BrowserManager {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private config: Required<BrowserManagerConfig>;
  private activePages = 0;

  constructor(config?: BrowserManagerConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async launch(): Promise<void> {
    if (this.browser) return;
    logger.info('Launching browser...');

    const launchOptions: Record<string, unknown> = {
      headless: this.config.headless,
    };

    // 如果指定了 channel，使用系统浏览器
    if (this.config.channel) {
      launchOptions.channel = this.config.channel;
      logger.info(`Using system browser: ${this.config.channel}`);
    }

    this.browser = await chromium.launch(launchOptions);
    this.context = await this.browser.newContext({
      viewport: this.config.viewport,
      locale: this.config.locale,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    });
    logger.info('Browser launched');
  }

  async newPage(): Promise<Page> {
    if (!this.context) await this.launch();
    this.activePages++;
    return this.context!.newPage();
  }

  async closePage(page: Page): Promise<void> {
    await page.close();
    this.activePages--;
  }

  async navigateTo(url: string): Promise<Page> {
    const page = await this.newPage();
    logger.info(`Navigating to ${url}`);
    try {
      await page.goto(url, {
        waitUntil: this.config.waitUntil,
        timeout: 60000,
      });
      // 等待额外的渲染时间，让页面完成动态加载
      await page.waitForTimeout(2000);
    } catch (err) {
      logger.error(`Navigation failed: ${err}`);
      await this.closePage(page);
      throw err;
    }
    return page;
  }

  async close(): Promise<void> {
    if (this.context) {
      await this.context.close();
      this.context = null;
    }
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
    logger.info('Browser closed');
  }

  get isActive(): boolean {
    return this.browser !== null;
  }

  get pageCount(): number {
    return this.activePages;
  }
}
