#!/bin/bash
# 完整的 SEA 构建和测试脚本
# 注意: 必须使用 Node.js 20.x 版本，Node.js 22.x 的 SEA 功能存在兼容性问题

set -e

echo "🚀 开始 SEA 打包流程..."

# 检查 Node.js 版本
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -ge 22 ]; then
  echo "⚠️  警告: 检测到 Node.js 22+，SEA 功能可能存在兼容性问题"
  echo "建议切换到 Node.js 20: nvm use 20"
  echo "继续构建，但可能失败..."
  sleep 2
elif [ "$NODE_VERSION" -lt 20 ]; then
  echo "⚠️  警告: Node.js 版本过低，建议使用 Node.js 20.x"
fi

echo "当前 Node.js 版本: $(node --version)"

# 步骤 0: 构建前端资源（如果需要）
if [ ! -f "dist/image.html" ] || [ ! -d "dist/public" ]; then
  echo "步骤 0: 构建前端资源 (parcel)..."
  npm run parcel || {
    echo "⚠️  parcel 构建失败，尝试直接复制 public 目录..."
    mkdir -p dist
    cp -r src/public/* dist/public/ 2>/dev/null || true
  }
fi

# 步骤 1: 确保 dist 目录存在
echo "步骤 1: 准备 dist 目录..."
mkdir -p dist
mkdir -p dist/zombie-lord/api/injections
mkdir -p dist/zombie-lord/injections
mkdir -p dist/plugins
mkdir -p dist/wasm
mkdir -p dist/public

# 步骤 2: 复制所有必要的资源文件
echo "步骤 2: 复制资源文件..."
# 复制 zombie-lord 完整目录结构
cp -r src/zombie-lord/api dist/zombie-lord/ 2>/dev/null || true
cp -r src/zombie-lord/injections dist/zombie-lord/ 2>/dev/null || true

# 复制 voodoo 图标到前端约定的 assets/icons 路径
echo "步骤 2.1: 复制 voodoo 图标到 assets/icons..."
mkdir -p dist/voodoo/assets/icons
# 如果 parcel 构建出了 voodoo/node_modules/lucide-static/icons，则同步到 assets/icons
if [ -d "dist/voodoo/node_modules/lucide-static/icons" ]; then
  cp -r dist/voodoo/node_modules/lucide-static/icons/* dist/voodoo/assets/icons/ 2>/dev/null || true
fi

# 复制 plugins 目录
cp -r src/plugins/* dist/plugins/ 2>/dev/null || true

# 复制 wasm 文件
cp node_modules/@dosyago/rainsum/wasm/rain.wasm dist/rain.wasm 2>/dev/null || true

# 复制 @roamhq/wrtc 模块（原生模块需要运行时访问）
echo "步骤 2.2: 复制 @roamhq/wrtc 模块..."
mkdir -p dist/node_modules/@roamhq
cp -r node_modules/@roamhq/wrtc* dist/node_modules/@roamhq/ 2>/dev/null || true
# 确保 .node 文件可执行
find dist/node_modules/@roamhq -name "*.node" -exec chmod +x {} \; 2>/dev/null || true

# 确保 public 目录存在（如果 parcel 没有生成）
if [ ! -d "dist/public" ] || [ -z "$(ls -A dist/public 2>/dev/null)" ]; then
  echo "步骤 2.1: 复制 public 目录..."
  cp -r src/public/* dist/public/ 2>/dev/null || true
fi

# 步骤 3: 使用 esbuild 打包
echo "步骤 3: 使用 esbuild 打包..."
# 使用 ESM 格式（代码中有 top-level await）
./node_modules/.bin/esbuild src/server.js \
  --bundle \
  --platform=node \
  --format=esm \
  --target=node20 \
  --outfile=dist/server-sea.mjs \
  --loader:.node=copy \
  --external:@roamhq/wrtc \
  --banner:js="import { createRequire } from 'module'; import { fileURLToPath } from 'url'; import { dirname } from 'path'; const require = createRequire(import.meta.url); const __filename = fileURLToPath(import.meta.url); const __dirname = dirname(__filename);"

echo "✅ 打包完成！"

# 步骤 4: 生成 SEA blob
echo "步骤 4: 生成 SEA blob..."
node --experimental-sea-config sea-config.json

# 步骤 5: 创建 SEA 二进制文件
echo "步骤 5: 创建 SEA 二进制文件..."
NODE_BINARY=$(which node)
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)

echo "使用 Node.js 版本: $(node --version)"
echo "复制 Node.js 二进制文件..."

# 确保 build 目录存在
mkdir -p build

# 复制 Node.js 二进制文件
cp "$NODE_BINARY" build/browserbox-server-sea

if [[ "$OSTYPE" == "darwin"* ]]; then
  echo "移除现有签名..."
  codesign --remove-signature build/browserbox-server-sea 2>/dev/null || true
  
  # 确保文件可执行
  chmod +x build/browserbox-server-sea
fi

echo "注入 SEA blob..."
# macOS 上应该使用 NODE_SEA 而不是 __NODE_SEA
SENTINEL_FUSE="NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2"

npx postject build/browserbox-server-sea NODE_SEA_BLOB sea-prep.blob \
  --sentinel-fuse "$SENTINEL_FUSE" \
  --macho-segment-name NODE_SEA \
  --overwrite

if [ $? -ne 0 ]; then
  echo "❌ postject 注入失败，尝试使用默认参数..."
  npx postject build/browserbox-server-sea NODE_SEA_BLOB sea-prep.blob \
    --macho-segment-name NODE_SEA \
    --overwrite
fi

if [[ "$OSTYPE" == "darwin"* ]]; then
  echo "重新签名二进制文件..."
  codesign --sign - build/browserbox-server-sea 2>&1 || {
    echo "⚠️  代码签名失败，但继续构建..."
    # 尝试使用 ad-hoc 签名
    codesign --force --sign - build/browserbox-server-sea 2>&1 || true
  }
  
  # 验证签名
  codesign -vvvv build/browserbox-server-sea 2>&1 | head -3 || echo "签名验证失败"
fi

echo ""
echo "✅ SEA 二进制文件已生成: build/browserbox-server-sea"
echo "   文件大小: $(ls -lh build/browserbox-server-sea | awk '{print $5}')"
echo ""

# 步骤 6: 测试二进制文件
echo "步骤 6: 测试二进制文件..."
if [ -f "build/browserbox-server-sea" ]; then
  # 检查文件是否可执行
  if [ -x "build/browserbox-server-sea" ]; then
    echo "✅ 二进制文件可执行"
    
    # 尝试运行一个简单的测试（只检查是否能启动，不实际运行服务器）
    echo "测试二进制文件启动..."
    # macOS 上没有 timeout 命令，使用后台进程方式测试
    APP_PORT=8002 CHROME_PORT=5002 COOKIE_VALUE=testcookie LOGIN_TOKEN=testtoken \
      ./build/browserbox-server-sea > /tmp/sea-test.log 2>&1 &
    TEST_PID=$!
    sleep 2
    if ps -p $TEST_PID > /dev/null 2>&1; then
      echo "✅ 二进制文件成功启动！进程 ID: $TEST_PID"
      echo "前5行输出:"
      head -5 /tmp/sea-test.log 2>/dev/null || echo "无输出"
      kill $TEST_PID 2>/dev/null || true
      wait $TEST_PID 2>/dev/null || true
    else
      EXIT_CODE=$?
      echo "⚠️  二进制文件启动测试失败 (退出码: $EXIT_CODE)"
      echo "错误日志:"
      head -10 /tmp/sea-test.log 2>/dev/null || echo "无日志"
      wait $TEST_PID 2>/dev/null || true
    fi
  else
    echo "⚠️  二进制文件不可执行，尝试修复..."
    chmod +x build/browserbox-server-sea
  fi
else
  echo "❌ 二进制文件未生成"
  exit 1
fi

echo ""
echo "📦 重要提示:"
echo "   - 二进制文件: build/browserbox-server-sea"
echo "   - 资源文件目录: dist/ (必须与二进制文件在同一目录)"
echo "   - 运行时需要保留 dist 目录，因为二进制文件需要访问其中的静态资源"
echo ""
echo "💡 使用方法:"
echo "   1. 将 build/browserbox-server-sea 和 dist/ 目录一起部署"
echo "   2. 在 dist/ 目录的父目录中运行: ./browserbox-server-sea [参数]"
echo ""
echo "🧪 测试命令:"
echo "   APP_PORT=8002 CHROME_PORT=5002 COOKIE_VALUE=testcookie LOGIN_TOKEN=testtoken \\"
echo "   ./build/browserbox-server-sea"
