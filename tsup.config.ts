import { defineConfig } from 'tsup';

export default defineConfig([
  // 库入口
  {
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: true,
    sourcemap: true,
    clean: true,
    outDir: 'dist',
    external: ['playwright', 'sharp', 'pngjs'],
  },
  // CLI 入口
  {
    entry: ['src/cli.ts'],
    format: ['esm'],
    outDir: 'dist',
    external: ['playwright', 'sharp', 'pngjs'],
  },
  // MCP Server 入口
  {
    entry: ['src/mcp/server.ts'],
    format: ['esm'],
    outDir: 'dist/mcp',
    external: ['playwright', 'sharp', 'pngjs'],
  },
]);
