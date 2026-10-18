import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { dependency } from "./dependencies.mjs";
import { serveExport } from "./static-server.mjs";

// Tests the delivered export, including its assets, at a real hosting subpath.
// No development server, external API, or shared backend is used.
const { chromium, webkit } = dependency("playwright");
const Axe = dependency("@axe-core/playwright").default;
const out = resolve("test/scratch/validation");
await mkdir(out, { recursive: true });
const { server, url } = await serveExport();
const report = {
  passed: [],
  failed: [],
  limitations: [],
  screenshots: [],
  measurements: {},
};
const browsers = [];
let page;

async function check(name, fn) {
  try {
    await fn();
    report.passed.push(name);
    console.log(`PASS ${name}`);
  } catch (error) {
    report.failed.push({ name, error: error.message });
    console.error(`FAIL ${name}: ${error.message}`);
  }
}

async function screenshot(name, options = {}) {
  const file = `${out}/${name}.png`;
  await page.screenshot({ path: file, ...options });
  report.screenshots.push(`test/scratch/validation/${name}.png`);
}

async function testPrimaryFlow(engineName, engine) {
  const browser = await engine.launch({ headless: true });
  browsers.push(browser);
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
    acceptDownloads: true,
  });
  page = await context.newPage();
  const errors = [];
  const external = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  page.on("requestfailed", (request) => {
    if (!request.failure()?.errorText.includes("ABORTED"))
      errors.push(request.failure()?.errorText);
  });
  await page.route("**/*", (route) => {
    const requestURL = route.request().url();
    if (
      requestURL.startsWith(new URL(url).origin) ||
      /^(blob:|data:)/.test(requestURL)
    )
      return route.continue();
    external.push(requestURL);
    return route.abort();
  });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);

  await check(
    `${engineName}: first phone screen contains product and badge action`,
    async () => {
      const title = await page.locator("h1").boundingBox();
      const action = await page
        .getByRole("button", { name: "Make your club badge", exact: true })
        .boundingBox();
      assert.ok(title && action);
      assert.ok(title.y >= 0 && title.y + title.height <= 844);
      assert.ok(action.y >= 0 && action.y + action.height <= 844);
      report.measurements[`${engineName}-phone-cta`] = action;
      await screenshot(`${engineName}-390-first-screen`);
    },
  );

  await check(
    `${engineName}: all local assets load without external requests or browser errors`,
    async () => {
      assert.deepEqual(errors, []);
      assert.deepEqual(external, []);
      assert.equal(
        await page.evaluate(
          () =>
            document.fonts.check('800 68px "Bricolage Grotesque"') &&
            document.fonts.check('600 16px "DM Sans"'),
        ),
        true,
      );
      const share = await page.request.get(new URL("share-card.png", url).href);
      assert.equal(share.status(), 200);
      assert.equal(share.headers()["content-type"], "image/png");
      const html = await readFile("dist/index.html", "utf8");
      assert.match(html, /<title>Big Weenies Unite/);
      for (const tag of ["description", "og:title", "og:image"])
        assert.ok(html.includes(`="${tag}"`));
      assert.ok(
        !/\b(?:src|href)="\/(?!\/)/.test(html),
        "Export URLs must be relative",
      );
    },
  );

  await check(
    `${engineName}: mobile navigation opens, follows an anchor and closes`,
    async () => {
      const toggle = page.getByRole("button", {
        name: "Open navigation",
        exact: true,
      });
      await toggle.click();
      assert.equal(
        await page
          .getByRole("button", { name: "Close navigation" })
          .getAttribute("aria-expanded"),
        "true",
      );
      await page
        .getByRole("navigation", { name: "Mobile navigation" })
        .getByRole("link", { name: "The club", exact: false })
        .click();
      assert.equal(new URL(page.url()).hash, "#the-club");
      assert.equal(
        await page
          .getByRole("navigation", { name: "Mobile navigation" })
          .count(),
        0,
      );
      await page.goto(url, { waitUntil: "networkidle" });
    },
  );

  await check(
    `${engineName}: FAQ disclosure works with the keyboard`,
    async () => {
      const summary = page.locator(".faq-list summary").first();
      await summary.focus();
      await page.keyboard.press("Enter");
      assert.equal(
        await page.locator(".faq-list details").first().getAttribute("open"),
        "",
      );
      assert.equal(
        await page
          .locator(".faq-list details")
          .first()
          .locator("p")
          .isVisible(),
        true,
      );
      await page.keyboard.press("Space");
      assert.equal(
        await page.locator(".faq-list details").first().getAttribute("open"),
        null,
      );
      await page.goto(url, { waitUntil: "networkidle" });
    },
  );

  await check(
    `${engineName}: badge dialog opens, contains focus and returns it on Escape`,
    async () => {
      const trigger = page.getByRole("button", {
        name: "Make your club badge",
        exact: true,
      });
      await trigger.focus();
      await page.keyboard.press("Enter");
      assert.equal(
        await page.locator("dialog").evaluate((el) => el.matches(":modal")),
        true,
      );
      for (let index = 0; index < 10; index++) {
        await page.keyboard.press("Tab");
        assert.equal(
          await page.evaluate(
            () => !!document.activeElement?.closest("dialog"),
          ),
          true,
        );
      }
      await page.keyboard.press("Escape");
      await page.waitForFunction(() => !document.querySelector("dialog").open);
      assert.equal(
        await trigger.evaluate((el) => document.activeElement === el),
        true,
      );
      await trigger.click();
    },
  );

  await check(
    `${engineName}: empty form shows a linked error, focuses the name and recovers`,
    async () => {
      await page
        .getByRole("button", { name: "Download my badge", exact: true })
        .click();
      const input = page.getByRole("textbox", { name: "Your weenie’s name" });
      assert.equal(await input.getAttribute("aria-invalid"), "true");
      assert.equal(
        await input.evaluate((el) => document.activeElement === el),
        true,
      );
      assert.equal(
        await page.locator("#name-error").textContent(),
        "Enter a name to put on your badge.",
      );
      await input.fill("Pickles");
      assert.equal(await input.getAttribute("aria-invalid"), "false");
      assert.equal(await page.locator("#name-error").count(), 0);
    },
  );

  await check(
    `${engineName}: coat and job choices update the named live preview`,
    async () => {
      await page.getByRole("radio", { name: "Midnight", exact: true }).check();
      await page
        .getByRole("combobox", { name: "Choose a job title" })
        .selectOption("Head of snack security");
      const badge = page.locator(".badge-preview > svg");
      assert.equal(
        await badge.getAttribute("aria-label"),
        "Big Weenies Unite badge for Pickles: Head of snack security",
      );
      assert.ok((await badge.innerHTML()).includes("#343235"));
      await screenshot(`${engineName}-390-badge`, { fullPage: false });
    },
  );

  await check(
    `${engineName}: SVG download contains the chosen name, coat and title`,
    async () => {
      const [download] = await Promise.all([
        page.waitForEvent("download"),
        page
          .getByRole("button", { name: "Download my badge", exact: true })
          .click(),
      ]);
      assert.equal(download.suggestedFilename(), "pickles-weenie-badge.svg");
      const file = `${out}/${engineName}-badge.svg`;
      await download.saveAs(file);
      const svg = await readFile(file, "utf8");
      assert.match(svg, /<svg[^>]+xmlns="http:\/\/www.w3.org\/2000\/svg"/);
      assert.match(svg, /Pickles/);
      assert.match(svg, /Head of snack security/);
      assert.match(svg, /#343235/);
      assert.ok(!/<script|<foreignObject|https?:\/\/(?!www.w3.org)/.test(svg));
      assert.equal(
        await page.evaluate(
          (text) =>
            new DOMParser()
              .parseFromString(text, "image/svg+xml")
              .querySelector("parsererror") === null,
          svg,
        ),
        true,
      );
      assert.match(
        await page.getByRole("status").textContent(),
        /Check your downloads/,
      );
      // Verify the standalone downloaded asset really paints, independently of page CSS.
      const image = await context.newPage();
      await image.setContent(
        `<img alt="Downloaded badge" width="600" height="600" src="data:image/svg+xml,${encodeURIComponent(svg)}">`,
      );
      assert.equal(
        await image
          .locator("img")
          .evaluate((el) => el.complete && el.naturalWidth > 0),
        true,
      );
      await image.screenshot({
        path: `${out}/${engineName}-downloaded-badge.png`,
        fullPage: true,
      });
      report.screenshots.push(
        `test/scratch/validation/${engineName}-downloaded-badge.png`,
      );
      await image.close();
    },
  );

  await check(
    `${engineName}: longest allowed wide name remains inside badge`,
    async () => {
      await page
        .getByRole("textbox", { name: "Your weenie’s name" })
        .fill("WWWWWWWWWWWWWWWWWW");
      const bounds = await page
        .locator(".badge-preview > svg > text")
        .nth(1)
        .evaluate((el) => {
          const r = el.getBBox();
          return { x: r.x, right: r.x + r.width };
        });
      assert.ok(bounds.x > 20 && bounds.right < 580, JSON.stringify(bounds));
      report.measurements[`${engineName}-long-name-bounds`] = bounds;
    },
  );

  await check(`${engineName}: form text is escaped in SVG output`, async () => {
    const name = '<img onerror="x">';
    await page.getByRole("textbox", { name: "Your weenie’s name" }).fill(name);
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page
        .getByRole("button", { name: "Download my badge", exact: true })
        .click(),
    ]);
    const file = `${out}/${engineName}-escaped-name.svg`;
    await download.saveAs(file);
    const svg = await readFile(file, "utf8");
    assert.ok(svg.includes('&lt;img onerror="x"&gt;'));
    assert.ok(!svg.includes("<img"));
    await page
      .getByRole("textbox", { name: "Your weenie’s name" })
      .fill("Pickles");
  });

  await check(
    `${engineName}: download failure gives an honest error and retry works`,
    async () => {
      await page.evaluate(() => {
        window.__bwuOriginalCreateURL = URL.createObjectURL;
        URL.createObjectURL = () => {
          throw new Error("Simulated unavailable browser download");
        };
      });
      await page
        .getByRole("button", { name: "Download my badge", exact: true })
        .click();
      assert.equal(
        await page.getByRole("status").textContent(),
        "The download could not start. Please try again.",
      );
      await page.evaluate(() => {
        URL.createObjectURL = window.__bwuOriginalCreateURL;
        delete window.__bwuOriginalCreateURL;
      });
      const [download] = await Promise.all([
        page.waitForEvent("download"),
        page
          .getByRole("button", { name: "Download my badge", exact: true })
          .click(),
      ]);
      assert.equal(download.suggestedFilename(), "pickles-weenie-badge.svg");
      assert.match(
        await page.getByRole("status").textContent(),
        /Check your downloads/,
      );
    },
  );

  await check(
    `${engineName}: automated accessibility scan of the badge dialog`,
    async () => {
      const result = await new Axe({ page }).analyze();
      await writeFile(
        `${out}/${engineName}-axe-dialog.json`,
        JSON.stringify(result, null, 2),
      );
      assert.deepEqual(
        result.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.map((n) => n.target),
        })),
        [],
      );
    },
  );

  await check(
    `${engineName}: close button works and choices last for the current tab`,
    async () => {
      await page
        .getByRole("button", { name: "Close badge maker", exact: true })
        .click();
      assert.equal(await page.locator("dialog").getAttribute("open"), null);
      await page
        .getByRole("button", { name: "Make my weenie badge", exact: true })
        .click();
      assert.equal(
        await page
          .getByRole("textbox", { name: "Your weenie’s name" })
          .inputValue(),
        "Pickles",
      );
      await page
        .getByRole("button", { name: "Close badge maker", exact: true })
        .click();
      await page.reload({ waitUntil: "networkidle" });
      await page
        .getByRole("button", { name: "Make your club badge", exact: true })
        .click();
      assert.equal(
        await page
          .getByRole("textbox", { name: "Your weenie’s name" })
          .inputValue(),
        "",
      );
      assert.equal(await page.evaluate(() => localStorage.length), 0);
      await page
        .getByRole("button", { name: "Close badge maker", exact: true })
        .click();
    },
  );

  await check(
    `${engineName}: reduced motion stops smooth scrolling and transitions`,
    async () => {
      assert.equal(
        await page.evaluate(
          () => getComputedStyle(document.documentElement).scrollBehavior,
        ),
        "auto",
      );
      assert.equal(
        await page
          .locator(".hero-copy .button")
          .evaluate((el) => getComputedStyle(el).transitionDuration),
        "0s",
      );
      assert.equal(
        await page.evaluate(
          () =>
            document.getAnimations().filter((a) => a.playState === "running")
              .length,
        ),
        0,
      );
    },
  );

  for (const [width, height] of [
    [320, 740],
    [390, 844],
    [768, 1024],
    [1024, 768],
    [1440, 1000],
    [1920, 1080],
  ]) {
    await check(
      `${engineName}: responsive export and modal at ${width}px`,
      async () => {
        await page.setViewportSize({ width, height });
        await page.goto(url, { waitUntil: "networkidle" });
        assert.ok(
          await page.evaluate(
            () =>
              document.documentElement.scrollWidth <=
              document.documentElement.clientWidth,
          ),
          "Page overflows horizontally",
        );
        await screenshot(`${engineName}-${width}-full`, { fullPage: true });
        await page
          .getByRole("button", { name: "Make your club badge", exact: true })
          .click();
        assert.equal(
          await page
            .locator("dialog")
            .evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
          true,
          "Dialog overflows horizontally",
        );
        await page
          .getByRole("button", { name: "Download my badge", exact: true })
          .scrollIntoViewIfNeeded();
        const action = await page
          .getByRole("button", { name: "Download my badge", exact: true })
          .boundingBox();
        assert.ok(
          action.y >= 0 && action.y + action.height <= height,
          "Download action is unreachable",
        );
        await page
          .getByRole("button", { name: "Close badge maker", exact: true })
          .click();
      },
    );
  }

  await check(
    `${engineName}: automated accessibility scan of the full page`,
    async () => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(url, { waitUntil: "networkidle" });
      const result = await new Axe({ page }).analyze();
      await writeFile(
        `${out}/${engineName}-axe-page.json`,
        JSON.stringify(result, null, 2),
      );
      assert.deepEqual(
        result.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.map((n) => n.target),
        })),
        [],
      );
    },
  );

  await check(
    `${engineName}: backdrop closes the dialog at desktop width`,
    async () => {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page
        .getByRole("button", { name: "Make your club badge", exact: true })
        .click();
      await page.mouse.click(8, 8);
      assert.equal(await page.locator("dialog").getAttribute("open"), null);
      await page.setViewportSize({ width: 390, height: 844 });
    },
  );

  await check(
    `${engineName}: 200% text enlargement reflows at 390px`,
    async () => {
      await page.evaluate(() => {
        document.documentElement.style.fontSize = "200%";
      });
      assert.ok(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth,
        ),
        "Text enlargement causes horizontal overflow",
      );
      await screenshot(`${engineName}-390-text-200`, { fullPage: true });
      await page.evaluate(() => {
        document.documentElement.style.fontSize = "";
      });
    },
  );

  await check(`${engineName}: final console and resource check`, async () => {
    assert.deepEqual(errors, []);
    assert.deepEqual(external, []);
  });
  await context.close();
  await browser.close();
}

try {
  await testPrimaryFlow("chromium", chromium);
  try {
    await testPrimaryFlow("webkit", webkit);
  } catch (error) {
    report.limitations.push(`WebKit could not run: ${error.message}`);
    console.log(
      "LIMITATION WebKit could not launch; see results.json for the host error.",
    );
  }
} catch (error) {
  report.failed.push({ name: "Validation runtime", error: error.stack });
} finally {
  for (const browser of browsers) await browser.close();
  server.close();
  await writeFile(`${out}/results.json`, JSON.stringify(report, null, 2));
}

console.log(
  `${report.passed.length} passed; ${report.failed.length} failed; ${report.limitations.length} runtime limitations.`,
);
if (report.failed.length) process.exitCode = 1;
