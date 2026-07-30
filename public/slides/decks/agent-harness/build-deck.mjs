import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const deckPath = path.join(root, "index.html");
const slidesPath = path.join(root, "slides.html");

let deck = fs.readFileSync(deckPath, "utf8");
const slides = fs.readFileSync(slidesPath, "utf8").trim();

deck = deck.replace(
  "<title>[必填] 替换为 PPT 标题 · Deck Title</title>",
  "<title>Agent 与 Harness 基础课 · 两小时系统入门</title>",
);

const generatedStart = "<!-- GENERATED_SLIDES_START -->";
const generatedEnd = "<!-- GENERATED_SLIDES_END -->";

if (deck.includes(generatedStart)) {
  const start = deck.indexOf(generatedStart);
  const end = deck.indexOf(generatedEnd) + generatedEnd.length;
  deck =
    deck.slice(0, start) +
    `${generatedStart}\n${slides}\n${generatedEnd}` +
    deck.slice(end);
} else {
  const marker = deck.indexOf("<!-- SLIDES_HERE");
  const deckClose = deck.indexOf("\n</div>\n\n<div id=\"nav\">", marker);
  if (marker < 0 || deckClose < 0) {
    throw new Error("Cannot locate the Guizang slide insertion region.");
  }
  deck =
    deck.slice(0, marker) +
    `${generatedStart}\n${slides}\n${generatedEnd}` +
    deck.slice(deckClose);
}

const qaHook = `<!-- QA_SLIDE_HOOK -->
<script>
  addEventListener("DOMContentLoaded", () => {
    const requested = Number(new URLSearchParams(location.search).get("slide"));
    if (!Number.isFinite(requested) || requested < 1) return;
    if (window.__setLowPowerMode) window.__setLowPowerMode(true, { persist: false });
    setTimeout(() => go(requested - 1), 60);
  });
</script>`;

if (!deck.includes("<!-- QA_SLIDE_HOOK -->")) {
  deck = deck.replace("</body>", `${qaHook}\n</body>`);
}

fs.writeFileSync(deckPath, deck);
