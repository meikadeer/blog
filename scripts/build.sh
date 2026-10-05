#!/bin/sh
# Cloudflare Pages 构建脚本：
# 用站点锁定的 Kite 版本（kite.lock + kitew）构建，输出 public/ 由 Cloudflare 发布。
set -eu

# Cloudflare Pages 的预览分支：让 feed 和 sitemap 指向预览地址，
# 而不是正式地址，避免预览站里出现错误的链接。
if [ "${CF_PAGES_BRANCH:-}" != "main" ] && [ -n "${CF_PAGES_URL:-}" ]; then
  export KITE_SITE_BASEURL="https://${CF_PAGES_URL}/"
fi

sh ./kitew build
