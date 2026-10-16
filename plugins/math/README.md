<p align="center">
  <img src="docs/icon.svg" alt="" width="84" height="84">
</p>

<h1 align="center">Math and Diagrams</h1>

<p align="center">
  TeX math and Mermaid diagrams in your Kite posts, written in plain Markdown.
</p>

<p align="center">
  <a href="https://github.com/kite-plus/plugin-math/actions/workflows/ci.yml"><img src="https://github.com/kite-plus/plugin-math/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://github.com/kite-plus/plugin-math/releases/latest"><img src="https://img.shields.io/github/v/release/kite-plus/plugin-math?sort=semver&color=4A77D6" alt="Latest release"></a>
  <a href="https://github.com/kite-plus/kite"><img src="https://img.shields.io/badge/Kite-%E2%89%A5%200.1-4A77D6?logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+PGcgZmlsbD0iI2ZmZiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjUiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0xMCAxNC41IEwyNyAyMSBMMjcgMzAgTDEwIDIzLjUgWiIvPjxwYXRoIGQ9Ik0xMCAzMiBMMjcgMzguNSBMMjcgNDkgTDEwIDQyLjUgWiIvPjxwYXRoIGQ9Ik0zNyAyMSBMNTQgMTQuNSBMNTQgNDIuNSBMMzcgNDkgWiIvPjwvZz48L3N2Zz4=" alt="Kite 0.1 or later"></a>
  <img src="https://img.shields.io/badge/WebAssembly-build%20hook-654FF0?logo=webassembly&logoColor=white" alt="Runs WebAssembly while a site is built">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-Apache%202.0-blue" alt="Apache License 2.0"></a>
</p>

<p align="center">
  English · <a href="README.zh-CN.md">简体中文</a>
</p>

<p align="center">
  <img src="docs/screenshot.webp" alt="A post with typeset formulas, and its flowchart redrawn in dark mode" width="880">
</p>

Math and Diagrams is an official plugin for
[Kite](https://github.com/kite-plus/kite). It typesets TeX with
[KaTeX](https://katex.org) and draws `mermaid` code blocks with
[Mermaid](https://mermaid.js.org), right where you wrote them.

<p>
  <img src="https://img.shields.io/badge/KaTeX-008080" alt="KaTeX">
  <img src="https://img.shields.io/badge/Mermaid-FF3670?logo=mermaid&logoColor=white" alt="Mermaid">
</p>

## Features

- **Math the way you already write it.** `$…$`, `$$…$$`, `\(…\)`, `\[…\]` and
  `math` code blocks.
- **Markdown keeps its hands off your TeX.** Before a page is rendered, the
  plugin's module shields the math from Markdown, so `\\`, `_` and `*` arrive
  exactly as written.
- **Prices stay prices.** `$5 and $10` is not mistaken for math, and code
  spans and code blocks are never touched.
- **Diagrams from text.** A `mermaid` code block becomes a flowchart, a
  sequence diagram, a Gantt chart or anything else Mermaid draws, and is
  drawn again when the page turns dark or light.
- **Only where it is needed.** KaTeX and Mermaid are loaded on the pages that
  have math or a diagram, from jsDelivr, unpkg or npmmirror.

## Writing

````markdown
Inline, $e^{i\pi} + 1 = 0$ or \(x_i\).

$$
\begin{aligned}
\bar{t} &= h \, t_h + (1 - h) \, t_m \\
        &= t_m - h \, (t_m - t_h)
\end{aligned}
$$

```mermaid
flowchart LR
  R[Read] --> C{Cached?}
  C -->|yes| A[Answer]
  C -->|no| D[Disk] --> A
```
````

Inline math opens with a `$` that has no space after it, and closes with a
`$` that has no space before it and no digit after it, which is what keeps
prices out.

## Install

1. Download `math-<version>.zip` from the
   [latest release](https://github.com/kite-plus/plugin-math/releases/latest).
2. In Kite's studio, open **Plugins**, drop the zip on **Upload plugin**, and
   switch it on.

Or from the command line, inside your site:

```sh
kite plugin add math-0.1.0.zip
kite plugin enable math
```

It needs Kite 0.1 or later.

## Settings

| Setting | Default | What it does |
|---|---|---|
| Math | On | Typesets TeX between `$` and `$`, `$$` and `$$`, `\(` and `\)`, `\[` and `\]`, and in `math` code blocks |
| Diagrams | On | Draws `mermaid` code blocks as diagrams |
| Load scripts from | jsDelivr | jsDelivr, unpkg or npmmirror, which is the quicker one from mainland China |

## How it works

Markdown reads TeX as Markdown: `\\` turns into `\`, and a pair of `*` or `_`
turns into emphasis. So before a page is rendered, the plugin's module,
`plugin.wasm`, turns display math into a `math` code block, which Markdown
leaves alone, and escapes the punctuation in inline math, between `\(` and
`\)`. In the reader's browser, `math.js` typesets both and draws the
diagrams. The module runs in Kite's sandbox: no network and no files, only
the page it is handed.

## Development

The module is Go, built for WebAssembly with Go 1.24 or later.

```sh
make test     # the rewriting, on this computer
make build    # plugin.wasm
kite plugin verify .
```

To try it on a site, `kite plugin add /path/to/plugin-math` copies this folder
in, module included.

## Releasing

Set `version` in `plugin.yaml`, commit, and push a tag of the same version,
such as `v0.1.0`. The release workflow tests and builds the module, packs
`dist/math-<version>.zip` without the module's source, and attaches it to a
GitHub release. `make zip` packs the same file locally.

## More official plugins

| Plugin | What it adds |
|---|---|
| [Analytics](https://github.com/kite-plus/plugin-analytics) | Visit counts with Baidu Tongji, Google Analytics, Umami or Plausible |
| [Comments](https://github.com/kite-plus/plugin-comments) | A comment thread under every post, with Giscus, Waline or Twikoo |
| [Search](https://github.com/kite-plus/plugin-search) | Search in the reader's browser, with nothing to run |

## License

[Apache License 2.0](LICENSE).
