#!/usr/bin/env bash
# Linux 二进制构建脚本
# 用法: ./scripts/linux-build.sh [x64|arm64]
# 如果不指定架构，将自动检测当前系统架构

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 检测架构
detect_arch() {
    local arch=$(uname -m)
    case "$arch" in
        x86_64|amd64)
            echo "x64"
            ;;
        aarch64|arm64)
            echo "arm64"
            ;;
        *)
            echo "x64"  # 默认使用 x64
            ;;
    esac
}

# 获取目标架构
TARGET_ARCH="${1:-$(detect_arch)}"

# 验证架构
if [[ "$TARGET_ARCH" != "x64" && "$TARGET_ARCH" != "arm64" ]]; then
    echo -e "${RED}错误: 不支持的架构 '$TARGET_ARCH'${NC}"
    echo "支持的架构: x64, arm64"
    exit 1
fi

echo -e "${GREEN}开始构建 Linux 二进制文件 (架构: $TARGET_ARCH)${NC}"

# 设置 Node.js 版本（pkg 支持的版本）
NODE_VERSION="18"
PKG_TARGET="node${NODE_VERSION}-linux-${TARGET_ARCH}"

echo -e "${YELLOW}目标平台: $PKG_TARGET${NC}"

# 清理之前的构建
echo -e "${YELLOW}清理之前的构建...${NC}"
npm run clean || true

# 安装依赖
echo -e "${YELLOW}安装依赖...${NC}"
TARGET_ARCH=${TARGET_ARCH} npm install

# 构建前端资源
echo -e "${YELLOW}构建前端资源 (parcel)...${NC}"
npm run parcel

# 构建服务器代码
echo -e "${YELLOW}构建服务器代码 (esbuild)...${NC}"
npm run build

# 检查 dist 目录是否存在
if [ ! -d "dist" ]; then
    echo -e "${RED}错误: dist 目录不存在，请先运行构建步骤${NC}"
    exit 1
fi

# 使用 pkg 打包为二进制
# pkg 会读取 package.json 中的配置（包括 pkg.scripts 和 pkg.assets）
echo -e "${YELLOW}打包为 Linux 二进制文件...${NC}"
npx pkg --compress GZip --targets=${PKG_TARGET} .

# pkg 的输出文件名格式通常是: <package-name>-<platform>-<arch>
# 基于 package.json 的 name 字段，可能是 browserbox-linux-x64 或类似
# 查找 build 目录中生成的 Linux 二进制文件
BINARY_FILE=$(find build/ -name "*linux-${TARGET_ARCH}" -type f 2>/dev/null | head -n 1)

if [ -z "$BINARY_FILE" ]; then
    # 如果没找到，尝试其他可能的命名格式
    BINARY_FILE=$(find build/ -name "*linux*" -type f 2>/dev/null | head -n 1)
fi

if [ -n "$BINARY_FILE" ] && [ -f "$BINARY_FILE" ]; then
    chmod +x "$BINARY_FILE"
    echo -e "${GREEN}✓ 构建成功!${NC}"
    echo -e "${GREEN}二进制文件位置: ${BINARY_FILE}${NC}"
    ls -lh "$BINARY_FILE"
    echo ""
    echo -e "${YELLOW}提示: 可以使用以下命令运行:${NC}"
    echo "  ./${BINARY_FILE}"
else
    echo -e "${YELLOW}警告: 未找到预期的输出文件，列出 build 目录内容:${NC}"
    ls -lh build/ 2>/dev/null || echo "build 目录不存在或为空"
    echo -e "${YELLOW}请检查 pkg 的输出信息以确认文件名${NC}"
fi

