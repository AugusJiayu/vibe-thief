/**
 * 多维度截图采集
 *
 * 从多个角度捕获页面的视觉信息：
 * 1. 多视口：桌面端 + 平板 + 手机
 * 2. 多区域：首屏 + 中部 + 底部
 * 3. 交互状态：hover/focus 按钮和链接
 * 4. CSS 动画信息：transition/keyframes
 */
// @ts-nocheck — extractAnimations 使用 page.evaluate() 在浏览器中执行

import type { Page } from 'playwright';
import { logger } from '../utils/logger.js';

export interface MultiScreenshot {
  /** 视口截图 */
  viewports: Array<{
    name: string;        // 'desktop' | 'tablet' | 'mobile'
    width: number;
    height: number;
    buffer: Buffer;
  }>;
  /** 区域截图 */
  sections: Array<{
    name: string;        // 'hero' | 'mid' | 'footer'
    buffer: Buffer;
  }>;
  /** 交互状态截图 */
  interactions: Array<{
    element: string;     // 'button' | 'link' | 'input'
    state: string;       // 'default' | 'hover' | 'focus'
    buffer: Buffer;
  }>;
  /** CSS 动画信息 */
  animations: AnimationInfo[];
}

export interface AnimationInfo {
  selector: string;
  property: string;      // 'transition' | 'animation'
  value: string;
  duration: string;
  easing: string;
}

/**
 * 多维度截图采集（桌面端：多区域 + 交互状态 + CSS 动画）
 */
export async function captureMultiScreenshots(page: Page): Promise<MultiScreenshot> {
  logger.info('Capturing sections, interactions, and animations...');

  const sections = await captureSections(page);
  const interactions = await captureInteractions(page);
  const animations = await extractAnimations(page);

  logger.info(
    `Multi-screenshot complete: ` +
    `${sections.length} sections, ${interactions.length} interactions, ` +
    `${animations.length} animations`
  );

  return { viewports: [], sections, interactions, animations };
}

/** 多视口截图 */
async function captureViewports(page: Page): Promise<MultiScreenshot['viewports']> {
  const sizes = [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 375, height: 812 },
  ];

  const results: MultiScreenshot['viewports'] = [];
  const originalSize = page.viewportSize();

  for (const size of sizes) {
    try {
      await page.setViewportSize({ width: size.width, height: size.height });
      await page.waitForTimeout(500); // 等待响应式布局调整
      const buffer = await page.screenshot({ type: 'png', fullPage: false });
      results.push({ ...size, buffer });
    } catch (err) {
      logger.warn(`Viewport ${size.name} screenshot failed: ${err}`);
    }
  }

  // 恢复原始视口
  if (originalSize) {
    await page.setViewportSize(originalSize);
  }

  return results;
}

/** 多区域截图（滚动页面捕获不同区域） */
async function captureSections(page: Page): Promise<MultiScreenshot['sections']> {
  const sections: MultiScreenshot['sections'] = [];

  try {
    // 获取页面总高度
    const totalHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const viewportHeight = 900;

    // 首屏
    sections.push({
      name: 'hero',
      buffer: await page.screenshot({ type: 'png', fullPage: false }),
    });

    // 如果页面足够长，截取中部和底部
    if (totalHeight > viewportHeight * 1.5) {
      // 中部
      await page.evaluate((y) => window.scrollTo(0, y), Math.floor(totalHeight * 0.4));
      await page.waitForTimeout(300);
      sections.push({
        name: 'mid',
        buffer: await page.screenshot({ type: 'png', fullPage: false }),
      });
    }

    if (totalHeight > viewportHeight * 2.5) {
      // 底部
      await page.evaluate((y) => window.scrollTo(0, y), totalHeight - viewportHeight);
      await page.waitForTimeout(300);
      sections.push({
        name: 'footer',
        buffer: await page.screenshot({ type: 'png', fullPage: false }),
      });
    }

    // 滚回顶部
    await page.evaluate(() => window.scrollTo(0, 0));
  } catch (err) {
    logger.warn(`Section screenshots failed: ${err}`);
  }

  return sections;
}

/** 交互状态截图 */
async function captureInteractions(page: Page): Promise<MultiScreenshot['interactions']> {
  const interactions: MultiScreenshot['interactions'] = [];

  // 找到页面上第一个可见的按钮和链接
  const targets = [
    { selector: 'button, [role="button"], .btn, [class*="button"]', element: 'button' },
    { selector: 'a[href]', element: 'link' },
    { selector: 'input[type="text"], input[type="email"], input:not([type])', element: 'input' },
  ];

  for (const target of targets) {
    try {
      const el = page.locator(target.selector).first();
      const isVisible = await el.isVisible().catch(() => false);
      if (!isVisible) continue;

      // 滚动到元素可见
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);

      // 默认状态
      interactions.push({
        element: target.element,
        state: 'default',
        buffer: await el.screenshot({ type: 'png' }),
      });

      // Hover 状态
      await el.hover();
      await page.waitForTimeout(300);
      interactions.push({
        element: target.element,
        state: 'hover',
        buffer: await el.screenshot({ type: 'png' }),
      });

      // Focus 状态（仅对 input 有意义）
      if (target.element === 'input') {
        await el.focus();
        await page.waitForTimeout(200);
        interactions.push({
          element: target.element,
          state: 'focus',
          buffer: await el.screenshot({ type: 'png' }),
        });
      }

      // 移开鼠标恢复默认
      await page.mouse.move(0, 0);
      await page.waitForTimeout(100);
    } catch (err) {
      logger.debug(`${target.element} interaction capture failed: ${err}`);
    }
  }

  return interactions;
}

/** 从 CSS 中提取动画信息 */
async function extractAnimations(page: Page): Promise<AnimationInfo[]> {
  return page.evaluate(() => {
    const animations: AnimationInfo[] = [];

    // 遍历所有样式表
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        for (const rule of Array.from(sheet.cssRules || [])) {
          // 提取 transition
          if (rule instanceof CSSStyleRule) {
            const transition = rule.style.transition || rule.style.getPropertyValue('transition');
            if (transition && transition !== 'none' && transition !== 'all 0s ease 0s') {
              const durationMatch = transition.match(/(\d+(?:\.\d+)?(?:ms|s))/);
              const easingMatch = transition.match(/(ease|linear|ease-in|ease-out|ease-in-out|cubic-bezier\([^)]+\))/);
              animations.push({
                selector: rule.selectorText,
                property: 'transition',
                value: transition,
                duration: durationMatch?.[1] || 'unknown',
                easing: easingMatch?.[1] || 'ease',
              });
            }

            // 提取 animation
            const animation = rule.style.animation || rule.style.getPropertyValue('animation');
            if (animation && animation !== 'none') {
              const durationMatch = animation.match(/(\d+(?:\.\d+)?(?:ms|s))/);
              const easingMatch = animation.match(/(ease|linear|ease-in|ease-out|ease-in-out|cubic-bezier\([^)]+\))/);
              animations.push({
                selector: rule.selectorText,
                property: 'animation',
                value: animation,
                duration: durationMatch?.[1] || 'unknown',
                easing: easingMatch?.[1] || 'ease',
              });
            }
          }

          // 提取 @keyframes
          if (rule instanceof CSSKeyframesRule) {
            animations.push({
              selector: `@keyframes ${rule.name}`,
              property: 'keyframe',
              value: `@keyframes ${rule.name}`,
              duration: 'varies',
              easing: 'varies',
            });
          }
        }
      } catch { /* cross-origin */ }
    }

    // 去重（按 selector + property）
    const seen = new Set<string>();
    return animations.filter(a => {
      const key = `${a.selector}|${a.property}|${a.value}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 20); // 最多 20 条
  });
}
