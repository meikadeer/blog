#!/bin/sh
# Cloudflare Pages 构建脚本：
# 下载固定版本的 Kite，用 checksums 校验，然后跑一次可验证的构建。
# 输出目录 public/ 会被 Cloudflare 直接发布。
set -eu

KITE_VERSION=0.1.2

case "$(uname -m)" in
  x86_64 | amd64) arch=amd64 ;;
  aarch64 | arm64) arch=arm64 ;;
  *) echo "no Kite release for $(uname -m)" >&2; exit 1 ;;
esac
os=$(uname -s | tr '[:upper:]' '[:lower:]')
archive="kite_${KITE_VERSION}_${os}_${arch}.tar.gz"
release="https://github.com/kite-plus/kite/releases/download/v${KITE_VERSION}"

bin=$(mktemp -d)
curl -fsSL -o "$bin/$archive" "$release/$archive"
curl -fsSL -o "$bin/checksums.txt" "$release/checksums.txt"
if command -v sha256sum >/dev/null 2>&1; then sum="sha256sum"; else sum="shasum -a 256"; fi
(cd "$bin" && grep "  $archive\$" checksums.txt | $sum -c -)
tar -xzf "$bin/$archive" -C "$bin" kite

# Cloudflare Pages 的预览分支：让 feed 和 sitemap 指向预览地址，
# 而不是正式地址，避免预览站里出现错误的链接。
if [ "${CF_PAGES_BRANCH:-}" != "main" ] && [ -n "${CF_PAGES_URL:-}" ]; then
  export KITE_SITE_BASEURL="https://${CF_PAGES_URL}/"
fi

"$bin/kite" version
"$bin/kite" build --verify
