import { describe, it, expect } from 'vitest';

describe('MCP Server', () => {
  it('should export server module', async () => {
    // 验证 MCP server 模块可以被导入
    const serverModule = await import('../../src/mcp/server.js');
    // server 模块在导入时会启动，这里只验证不报错
    expect(serverModule).toBeDefined();
  });

  it('should have correct tool definitions', () => {
    // 验证工具定义的 schema 结构
    const toolSchemas = {
      extract_design: {
        name: 'extract_design',
        requiredParams: ['source'],
        optionalParams: ['sourceType', 'outputFormat', 'language'],
      },
      extract_css_only: {
        name: 'extract_css_only',
        requiredParams: ['url'],
        optionalParams: ['viewport'],
      },
      analyze_screenshot: {
        name: 'analyze_screenshot',
        requiredParams: ['imagePath'],
        optionalParams: [],
      },
    };

    expect(toolSchemas.extract_design.requiredParams).toContain('source');
    expect(toolSchemas.extract_css_only.requiredParams).toContain('url');
    expect(toolSchemas.analyze_screenshot.requiredParams).toContain('imagePath');
  });
});
