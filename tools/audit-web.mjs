import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

await mkdir('design/quality', { recursive: true });
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'msedge' });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  reducedMotion: 'reduce',
});
const page = await context.newPage();
const findings = [];
for (const locale of ['en', 'fa', 'ar']) {
  await page.goto(`http://127.0.0.1:3000/${locale}`);
  for (let chapter = 0; chapter < 5; chapter++) {
    await page.locator('.chapters button').nth(chapter).click();
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    findings.push({ locale, chapter, violations: result.violations });
  }
}
await writeFile('design/quality/accessibility.json', JSON.stringify(findings, null, 2));
console.log(
  JSON.stringify(
    findings
      .filter((f) => f.violations.length)
      .map((f) => ({
        locale: f.locale,
        chapter: f.chapter,
        violations: f.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
      })),
    null,
    2
  )
);
await browser.close();
assert(
  findings.every((f) => f.violations.length === 0),
  'Accessibility violations; inspect design/quality/accessibility.json'
);
console.log(
  'PASS: axe WCAG A/AA checks across 15 locale/chapter combinations. Manual review remains necessary.'
);
