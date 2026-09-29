# 小王日记

用 Kite 写的博客。内容就是 `content/` 里的 Markdown 文件，部署到 Cloudflare Pages。

## 本地写作

```sh
cd blog
kite run
```

浏览器打开 `http://localhost:1717/admin/` 即可写作、上传图片、设置分类标签。

写完后发布并推送：

```sh
kite publish --all --push
```

推送到 GitHub 的 `main` 分支后，Cloudflare Pages 会自动重新构建上线。

## 部署到 Cloudflare Pages（一次性配置）

1. 把本仓库推送到 GitHub。
2. Cloudflare 控制台 → Workers & Pages → Create → Pages → Connect to Git，选中本仓库。
3. 构建设置：
   - Framework preset：**None**
   - Build command：`sh scripts/build.sh`
   - Build output directory：`public`
4. 保存并部署。之后每次推送到 `main` 自动更新。

绑定自己的域名后，在 Cloudflare Pages 的环境变量里加：

- `KITE_SITE_BASEURL` = `https://你的域名/`

## 构建脚本说明

`scripts/build.sh` 会下载固定版本（v0.1.2）的 Kite 并校验 checksum，
再用 `kite build --verify`（构建两次逐字节比对）保证同一内容总是生成同一站点。

## 定时文章

定时文章只有「过了发布时间之后构建过」才会出现。Cloudflare Pages 不会自动定时重建，
需要自建定时任务（Deploy Hook + Worker Cron 定时触发），需要时再配。
