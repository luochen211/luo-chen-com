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
copyFileSync(join(sourceRoot, "images", "01-swiss-mini-program-hero.png"), join(root, "images", "01-swiss-mini-program-hero.png"));
copyFileSync(join(sourceRoot, "images", "14-ai-workflow.png"), join(root, "images", "14-ai-workflow.png"));
writeFileSync(outputPath, html);

console.log(`Built ${outputPath}`);
