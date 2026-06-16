/**
 * 截图捕获工具
 */
// @ts-nocheck — 部分函数在浏览器环境中执行

import type { Page } from 'playwright';
import { logger } from '../utils/logger.js';

export interface ScreenshotResult {
  /** 首屏截图 */
  viewport: Buffer;
  /** 全页截图 */
  fullPage: Buffer;
  /** 页面标题 */
  title: string;
  /** 页面 URL */
  url: string;
  /** 视口尺寸 */
  viewportSize: { width: number; height: number };
  /** 全页尺寸 */
  fullPageSize: { width: number; height: number };
}

/**
 * 捕获页面截图（首屏 + 全页）
 */
export async function captureScreenshots(page: Page): Promise<ScreenshotResult> {
  logger.info('Capturing screenshots...');

  // 等待页面稳定
  await page.waitForLoadState('networkidle').catch(() => {});

  const title = await page.title();
  const url = page.url();

  // 首屏截图
  const viewport = await page.screenshot({
    type: 'png',
    fullPage: false,
  });

  // 全页截图
  const fullPage = await page.screenshot({
    type: 'png',
    fullPage: true,
  });

  // 获取尺寸
  const viewportSize = page.viewportSize() || { width: 1440, height: 900 };
  const fullPageSize = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
  }));

  logger.info(`Screenshots captured: viewport ${viewportSize.width}x${viewportSize.height}, full page ${fullPageSize.width}x${fullPageSize.height}`);

  return {
    viewport,
    fullPage,
    title,
    url,
    viewportSize,
    fullPageSize,
  };
}

/**
 * 从 Buffer 加载截图到 page（用于截图输入模式）
 */
export async function loadScreenshotToPage(page: Page, screenshotBuffer: Buffer): Promise<void> {
  // 创建一个简单的 HTML 页面来显示截图
  const base64 = screenshotBuffer.toString('base64');
  const html = `<!DOCTYPE html>
<html>
<head><title>Screenshot Analysis</title></head>
<body style="margin:0;padding:0;">
  <img src="data:image/png;base64,${base64}" style="max-width:100%;height:auto;" />
</body>
</html>`;

  await page.setContent(html, { waitUntil: 'load' });
}
