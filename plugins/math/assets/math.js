// Renders a page's math with KaTeX and its mermaid code blocks with Mermaid,
// each loaded only on a page that has something for it. Kite writes the
// settings into window.KiteMath before this runs.
(function () {
  "use strict";

  var config = window.KiteMath || {};
  var settings = config.settings || {};

  var KATEX = "0.18.9";
  var MERMAID = "12.0.0";

  var cdns = {
    jsdelivr: function (pkg, version, file) {
      return "https://cdn.jsdelivr.net/npm/" + pkg + "@" + version + "/" + file;
    },
    unpkg: function (pkg, version, file) {
      return "https://unpkg.com/" + pkg + "@" + version + "/" + file;
    },
    npmmirror: function (pkg, version, file) {
      return "https://registry.npmmirror.com/" + pkg + "/" + version + "/files/" + file;
    },
  };
  var cdn = cdns[settings.cdn] || cdns.jsdelivr;

  function script(src, then) {
    var el = document.createElement("script");
    el.src = src;
    el.onload = then;
    document.head.appendChild(el);
  }

  function stylesheet(href) {
    var el = document.createElement("link");
    el.rel = "stylesheet";
    el.href = href;
    document.head.appendChild(el);
  }

  var media = window.matchMedia("(prefers-color-scheme: dark)");
  function dark() {
    var root = document.documentElement;
    var said = root.getAttribute("data-theme") || root.getAttribute("data-color-scheme");
    if (said === "dark" || root.classList.contains("dark")) return true;
    if (said === "light" || root.classList.contains("light")) return false;
    return media.matches;
  }
  function onDarkChange(then) {
    var was = dark();
    function check() {
      var now = dark();
      if (now !== was) then((was = now));
    }
    new MutationObserver(check).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "data-color-scheme", "class"],
    });
    media.addEventListener("change", check);
  }

  // The plugin's module turns inline math into \( \) and \[ \], which is
  // what is looked for, in text a reader sees.
  function hasInlineMath(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var parent = node.parentElement;
        return parent && parent.closest("script,style,noscript,textarea,pre,code")
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT;
      },
    });
    for (var node = walker.nextNode(); node; node = walker.nextNode()) {
      if (/\\\(|\\\[/.test(node.nodeValue)) return true;
    }
    return false;
  }

  function math() {
    var blocks = document.querySelectorAll("pre > code.language-math");
    var inline = hasInlineMath(document.body);
    if (!blocks.length && !inline) return;
    stylesheet(cdn("katex", KATEX, "dist/katex.min.css"));
    script(cdn("katex", KATEX, "dist/katex.min.js"), function () {
      blocks.forEach(function (code) {
        var box = document.createElement("div");
        box.className = "kite-math";
        box.style.overflowX = "auto";
        window.katex.render(code.textContent, box, { displayMode: true, throwOnError: false });
        code.parentNode.replaceWith(box);
      });
      if (!inline) return;
      script(cdn("katex", KATEX, "dist/contrib/auto-render.min.js"), function () {
        window.renderMathInElement(document.body, {
          delimiters: [
            { left: "\\[", right: "\\]", display: true },
            { left: "\\(", right: "\\)", display: false },
          ],
          ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code", "option"],
          throwOnError: false,
        });
      });
    });
  }

  function diagrams() {
    var blocks = document.querySelectorAll("pre > code.language-mermaid");
    if (!blocks.length) return;
    var boxes = [];
    blocks.forEach(function (code) {
      var box = document.createElement("div");
      box.className = "mermaid kite-diagram";
      box.style.overflowX = "auto";
      box.style.textAlign = "center";
      box.setAttribute("data-source", code.textContent);
      box.textContent = code.textContent;
      code.parentNode.replaceWith(box);
      boxes.push(box);
    });
    script(cdn("mermaid", MERMAID, "dist/mermaid.min.js"), function () {
      function draw() {
        boxes.forEach(function (box) {
          box.removeAttribute("data-processed");
          box.textContent = box.getAttribute("data-source");
        });
        window.mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: dark() ? "dark" : "default",
        });
        window.mermaid.run({ nodes: boxes });
      }
      draw();
      onDarkChange(draw);
    });
  }

  function start() {
    if (settings.math !== false) math();
    if (settings.diagrams !== false) diagrams();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
