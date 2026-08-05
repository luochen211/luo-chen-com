import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const sourceRoot = join(root, "..", "mini-program-ui");
const sourcePath = join(sourceRoot, "index.html");
const slidesPath = join(root, "slides.html");
const stylesPath = join(root, "deck-styles.css");
const outputPath = join(root, "index.html");

let html = readFileSync(sourcePath, "utf8");
const slides = readFileSync(slidesPath, "utf8").trim();
const styles = readFileSync(stylesPath, "utf8").trim();

html = html.replace(
  "<title>如何做出好看的小程序 · Swiss Deck</title>",
  "<title>3 小时做完一个小程序 · 落尘</title>",
);

html = html.replace("</style>", `${styles}\n</style>`);

const courseProgressScript = `<script>
(() => {
  const checkpoints = [0,0,0,0,0,0,0,30,30,30,30,40,55,75,85,90,105,125,135,145,155,155,165,170,175,180,180];
  const sections = [
    [0, 6, '第 1 部分 · 基础与准备'],
    [7, 19, '第 2 部分 · 动手实操'],
    [20, 24, '第 3 部分 · 调整调优'],
    [25, 26, '收尾 · 交付与上线']
  ];
  const getSection = (index) => sections.find(([start, end]) => index >= start && index <= end)?.[2] || '课程导航';
  const render = (index) => {
    const minute = checkpoints[index] ?? 0;
    const remaining = Math.max(0, 180 - minute);
    document.querySelectorAll('.chrome-min .r').forEach((node) => {
      node.innerHTML = '<div class="course-progress"><div class="cp-label">' + getSection(index) + '</div><div class="cp-meta">课程 ' + minute + ' / 180 分钟 · 还剩 ' + remaining + ' 分钟</div><div class="cp-track"><i class="cp-fill" style="width:' + (minute / 180 * 100) + '%"></i></div></div>';
    });
  };
  const originalGo = go;
  go = function(index) { originalGo(index); render(window.__currentSlideIndex || 0); };
  render(window.__currentSlideIndex || 0);
})();
</script>\n`;
html = html.replace("</body>", `${courseProgressScript}</body>`);

const startMarker = "<section class=\"slide accent\" data-layout=\"SWISS-COVER-ASCII\"";
const endMarker = "\n</div>\n\n<div id=\"nav\">";
const start = html.indexOf(startMarker);
const end = html.indexOf(endMarker, start);

if (start < 0 || end < 0) {
  throw new Error("Could not locate the slide block in the Swiss source deck.");
}

html = `${html.slice(0, start)}${slides}\n${html.slice(end)}`;
mkdirSync(join(root, "assets"), { recursive: true });
mkdirSync(join(root, "images"), { recursive: true });
copyFileSync(join(sourceRoot, "assets", "motion.min.js"), join(root, "assets", "motion.min.js"));
writeFileSync(outputPath, html);

console.log(`Built ${outputPath}`);
