import fs from "node:fs";

const html = fs.readFileSync(new URL("./slides.html", import.meta.url), "utf8");
const slides = html.match(/<section class="slide[\s\S]*?<\/section>/g) ?? [];

function clean(block) {
  return block
    .replace(/<div class="chrome-min">[\s\S]*?<\/div><\/div>/g, " ")
    .replace(/<canvas[\s\S]*?<\/canvas>/g, " ")
    .replace(/<svg[\s\S]*?<\/svg>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\b\d{1,2}\s*\/\s*37\b/g, " ")
    .replace(
      /\b(?:Agent|Harness|Context|Tools?|Skill|Memory|RAG|State|Model|PART|THE|AND|FUNCTION)\b/gi,
      " ",
    )
    .replace(/[^\p{Script=Han}a-z0-9]+/giu, "")
    .toLowerCase();
}

function shingles(text, size = 3) {
  const result = new Set();
  for (let i = 0; i <= text.length - size; i += 1) {
    result.add(text.slice(i, i + size));
  }
  return result;
}

function jaccard(a, b) {
  let intersection = 0;
  for (const item of a) if (b.has(item)) intersection += 1;
  return intersection / (a.size + b.size - intersection || 1);
}

const normalized = slides.map(clean);
const sets = normalized.map((text) => shingles(text));
const pairs = [];

for (let i = 0; i < slides.length; i += 1) {
  for (let j = i + 1; j < slides.length; j += 1) {
    pairs.push({
      left: i + 1,
      right: j + 1,
      score: jaccard(sets[i], sets[j]),
    });
  }
}

pairs.sort((a, b) => b.score - a.score);

const sentenceOwners = new Map();
slides.forEach((block, index) => {
  const text = block
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ");
  const sentences = text
    .split(/[。；：！？.!?]/)
    .map((item) => item.trim())
    .filter((item) => item.length >= 12)
    .filter((item) => !/^\d{1,2}\s*\/\s*37/.test(item));
  for (const sentence of new Set(sentences)) {
    const owners = sentenceOwners.get(sentence) ?? [];
    owners.push(index + 1);
    sentenceOwners.set(sentence, owners);
  }
});

const repeats = [...sentenceOwners.entries()].filter(([, owners]) => owners.length > 1);
const threshold = 0.24;
const highSimilarity = pairs.filter((pair) => pair.score >= threshold);

console.log(`slides=${slides.length}`);
console.log(`high_similarity_threshold=${threshold}`);
console.log(`high_similarity_pairs=${highSimilarity.length}`);
console.log(`repeated_long_sentences=${repeats.length}`);
console.log("top_pairs=");
for (const pair of pairs.slice(0, 12)) {
  console.log(
    `${String(pair.left).padStart(2, "0")}-${String(pair.right).padStart(2, "0")} ${pair.score.toFixed(3)}`,
  );
}

if (highSimilarity.length > 0 || repeats.length > 0) process.exitCode = 1;

