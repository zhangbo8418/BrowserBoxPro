// SEA ESM 包装器
// 这个包装器用于在 SEA 中加载 ESM 模块
// SEA 默认以 CommonJS 模式运行，但可以通过动态 import 加载 ESM

import('./dist/server-sea.mjs').catch(err => {
  console.error('Failed to load server module:', err);
  process.exit(1);
});

