import { readFile } from "node:fs/promises";
import { dependency } from "./dependencies.mjs";

const { chromium } = dependency("playwright");
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  const font = (
    await readFile("public/fonts/bricolage-latin-800.woff2")
  ).toString("base64");
  const bodyFont = (
    await readFile("public/fonts/dm-sans-latin-variable.woff2")
  ).toString("base64");
  const svg = await readFile("public/share-card.svg", "utf8");
  await page.setContent(
    `<style>body{margin:0}@font-face{font-family:'Bricolage Grotesque';src:url(data:font/woff2;base64,${font});font-weight:800}@font-face{font-family:'DM Sans';src:url(data:font/woff2;base64,${bodyFont});font-weight:400 600}</style>${svg}`,
  );
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: "public/share-card.png" });
  console.log("Generated public/share-card.png (1200 × 630).");
} finally {
  await browser.close();
}
