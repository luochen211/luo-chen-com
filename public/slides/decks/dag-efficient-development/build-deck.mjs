import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const indexPath = join(root, "index.html");
const stylePath = join(root, "deck-styles.css");
const slidesPath = join(root, "slides.html");

let html = readFileSync(indexPath, "utf8");
const styles = readFileSync(stylePath, "utf8").trim();
const slides = readFileSync(slidesPath, "utf8").trim();

html = html.replace(
  "<title>[必填] 替换为 PPT 标题 · Deck Title</title>",
  "<title>如何利用 DAG 完成高效开发 · 落尘</title>",
);

const styleStart = "/* Deck-local Swiss locked additions. */";
const styleEnd = "/* End deck-local Swiss locked additions. */";
if (html.includes(styleStart) && html.includes(styleEnd)) {
  const before = html.slice(0, html.indexOf(styleStart));
  const after = html.slice(html.indexOf(styleEnd) + styleEnd.length);
  html = `${before}${styles}${after}`;
} else if (!html.includes(styleStart)) {
  html = html.replace("</style>", `${styles}\n</style>`);
}

const startMarker = "<!-- ============ 示例:第 1 页";
const endMarker = "\n</div>\n\n<div id=\"nav\">";
const start = html.indexOf(startMarker);
const end = html.indexOf(endMarker, start);

if (start < 0 || end < 0) {
  throw new Error("Could not locate the Guizang example slide block.");
}

html = `${html.slice(0, start)}${slides}\n${html.slice(end)}`;
writeFileSync(indexPath, html);
