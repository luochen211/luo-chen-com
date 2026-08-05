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
  const checkpoints = [0,0,2,5,7,9,11,14,17,20,23,26,28,30,30,30,40,55,75,85,90,105,125,135,155,155,160,167,172,175,180,180];
  const sections = [
    [0, 14, 1, '基础与准备', 0, 30],
    [15, 24, 2, '动手实操', 30, 155],
    [25, 31, 3, '调整调优与收尾', 155, 180]
  ];
  const getSection = (index) => sections.find(([start, end]) => index >= start && index <= end) || sections[0];
  const render = (index) => {
    const minute = checkpoints[index] ?? 0;
    const remaining = Math.max(0, 180 - minute);
    const [,, part, name, partStart, partEnd] = getSection(index);
    const partTotal = Math.max(1, partEnd - partStart);
    const partElapsed = Math.min(partTotal, Math.max(0, minute - partStart));
    const finishedParts = partElapsed >= partTotal ? part : part - 1;
    const progress = '<div class="course-progress"><div class="cp-label">第 ' + part + ' / 3 部分 · ' + name + '</div><div class="cp-meta">已完成 ' + finishedParts + ' / 3 个部分 · 本部分 ' + partElapsed + ' / ' + partTotal + ' 分钟</div><div class="cp-part-track"><i class="cp-part-fill" style="width:' + (partElapsed / partTotal * 100) + '%"></i></div><div class="cp-meta cp-total-meta">全程 ' + minute + ' / 180 分钟 · 还剩 ' + remaining + ' 分钟</div><div class="cp-track"><i class="cp-fill" style="width:' + (minute / 180 * 100) + '%"></i></div></div>';
    document.querySelectorAll('.chrome-min .r').forEach((node) => {
      node.innerHTML = progress;
    });
    const totalSlides = document.querySelectorAll('.slide').length;
    document.querySelectorAll('.chrome-min .l').forEach((node) => {
      node.innerHTML = node.innerHTML.replace(/^\\d{2}\\s*\\/\\s*\\d+/, String(index + 1).padStart(2, '0') + ' / ' + totalSlides);
    });
    document.querySelectorAll('.course-progress-floating').forEach((node) => node.remove());
    const activeSlide = document.querySelectorAll('.slide')[index];
    if (activeSlide && !activeSlide.querySelector('.chrome-min')) {
      const floating = document.createElement('aside');
      floating.className = 'course-progress-floating';
      floating.innerHTML = progress;
      activeSlide.appendChild(floating);
    }
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
