import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
await page.goto("http://127.0.0.1:5173/demos/agent-harness/", { waitUntil: "networkidle" });

if (!(await page.locator("#lessonTitle").innerText()).includes("为什么需要 Agent")) {
  throw new Error("first agent lesson is missing from the page");
}
await page.getByRole("button", { name: /买到不踩坑/ }).click();
await page.getByRole("button", { name: /02 Tool.*去查商品信息/ }).click();
await page.locator(".journey-phase-head").filter({ hasText: "03 Tool Result" }).waitFor({ state: "visible", timeout: 10000 });
if (!(await page.locator("#journeyProgress").innerText()).includes("完成条件已满足")) {
  throw new Error("agent task journey did not reach the completion gate");
}
await page.locator(".journey-product").nth(1).click();
if (!(await page.locator("#journeyEvidence").innerText()).includes("为什么选它")) {
  throw new Error("product evidence interaction did not render");
}
await page.getByRole("button", { name: /怎样证明系统可用/ }).click();
if (await page.locator("#experimentTitle").innerText() !== "评测驱动的 A2A 自迭代") {
  throw new Error("lesson 05 did not render");
}

await page.getByRole("button", { name: "运行 A2A 自迭代" }).click();
await page.locator("#policyRunSummary").waitFor({ state: "visible", timeout: 10000 });
await page.waitForFunction(() => document.querySelector("#policyRunSummary")?.textContent.includes("v2 accepted"));

if (await page.locator(".iteration-table .test-status.pass").count() !== 6) {
  throw new Error("not all evaluation cases passed");
}
if (!(await page.locator(".usefulness-contract").innerText()).includes("降低买错概率")) {
  throw new Error("usefulness contract is missing from evaluation workspace");
}
if (!(await page.locator("#a2aHandoff").innerText()).includes("A2A 交接")) {
  throw new Error("A2A handoff was not rendered");
}
if (await page.locator("#a2aTraceList .trace-step").count() !== 8) {
  throw new Error("unexpected A2A trace length");
}
await page.screenshot({ path: "/tmp/agent-harness-a2a.png", fullPage: true });
console.log("UI verified: lesson 05 A2A iteration accepted v2 with 6/6 passing cases");
await browser.close();
