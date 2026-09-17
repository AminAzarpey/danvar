import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
await mkdir('design/screenshots', { recursive: true });
const browser = await chromium.launch({
  headless: true,
  channel: process.env.PLAYWRIGHT_CHANNEL || 'msedge',
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: 'reduce',
  colorScheme: 'light',
});
await context.addInitScript(() => {
  if (!localStorage.getItem('danvar-look'))
    localStorage.setItem('danvar-look', JSON.stringify({ palette: 'sage', mode: 'system' }));
});
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto('http://127.0.0.1:3000/en');
await page.locator('h1').first().waitFor();
await page.evaluate(() => document.fonts.ready);
const ids = ['hello', 'people', 'experience', 'tools', 'idea'];
for (let i = 0; i < 5; i++) {
  await page.locator('.chapters button').nth(i).click();
  await page.waitForTimeout(180);
  await page.screenshot({ path: `design/screenshots/0${i + 1}-${ids[i]}-en.png`, fullPage: true });
  assert.equal(await page.locator('.scene:visible').count(), 1);
}
await page.locator('.chapters button').nth(1).click();
const cards = await page
  .locator('.person')
  .evaluateAll((es) =>
    es.map((e) => ({ x: e.getBoundingClientRect().x, w: e.getBoundingClientRect().width }))
  );
assert(Math.abs(cards[2].x + cards[2].w / 2 - (cards[0].x + cards[4].x + cards[4].w) / 2) < 2);
await page.locator('.center-person').click();
assert(await page.locator('dialog[open]').isVisible());
await page.keyboard.press('Escape');
assert.equal(await page.locator('dialog[open]').count(), 0);
await page.locator('.settings-button').click();
await page.getByRole('button', { name: 'Dark', exact: true }).click();
await page.getByRole('button', { name: 'Mist', exact: true }).click();
await page.screenshot({ path: 'design/screenshots/06-personalization.png', fullPage: true });
await page.keyboard.press('Escape');
assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
await page.reload();
assert.equal(await page.locator('html').getAttribute('data-palette'), 'mist');
await page.locator('.chapters button').nth(4).click();
await page.locator('textarea').fill('A thoughtful multilingual product.');
const download = page.waitForEvent('download');
await page.getByRole('button', { name: 'Save my project brief' }).click();
assert.equal((await download).suggestedFilename(), 'danvar-project-brief.txt');
await page.setViewportSize({ width: 390, height: 844 });
for (const locale of ['fa', 'ar']) {
  await page.goto(`http://127.0.0.1:3000/${locale}`);
  await page.waitForTimeout(300);
  assert.equal(await page.locator('html').getAttribute('dir'), 'rtl');
  for (let i = 0; i < 5; i++) {
    await page.locator('.chapters button').nth(i).click();
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    await page.screenshot({
      path: `design/screenshots/${locale}-0${i + 1}-mobile.png`,
      fullPage: true,
    });
  }
}
assert.deepEqual(errors, []);
const noJs = await browser.newContext({ javaScriptEnabled: false });
const staticPage = await noJs.newPage();
for (const locale of ['en', 'fa', 'ar']) {
  const response = await staticPage.goto(`http://127.0.0.1:3000/${locale}`);
  assert.equal(response.status(), 200);
  assert.equal(await staticPage.locator('html').getAttribute('lang'), locale);
  assert.equal(
    await staticPage.locator('html').getAttribute('dir'),
    locale === 'en' ? 'ltr' : 'rtl'
  );
  assert.equal(await staticPage.locator('.scene:visible').count(), 5);
  assert(await staticPage.locator('meta[name="description"]').getAttribute('content'));
}
assert.equal((await staticPage.goto('http://127.0.0.1:3000/de')).status(), 404);
await noJs.close();
const motionContext = await browser.newContext({ reducedMotion: 'no-preference' });
const motionPage = await motionContext.newPage();
await motionPage.goto('http://127.0.0.1:3000/en');
await motionPage.getByRole('button', { name: 'Pause story' }).waitFor();
await motionPage.waitForTimeout(9000);
assert.equal(await motionPage.locator('.chapters [aria-current]').innerText(), '02\nOur people');
await motionPage.getByRole('button', { name: 'Pause story' }).click();
await motionPage.getByRole('button', { name: 'Play story' }).waitFor();
await motionContext.close();
await browser.close();
console.log(
  'PASS: 5 scenes, 3 languages, mobile overflow, centered Amin, modal keyboard, theme persistence, brief download; 16 screenshots.'
);
