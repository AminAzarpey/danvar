import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';

const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const chrome = await launch({
  chromePath: process.env.CHROME_PATH || (existsSync(edge) ? edge : undefined),
  chromeFlags: ['--headless'],
});
try {
  const result = await lighthouse('http://127.0.0.1:3000/en', {
    port: chrome.port,
    output: 'json',
    logLevel: 'error',
  });
  await mkdir('design/quality', { recursive: true });
  await writeFile('design/quality/lighthouse-mobile.json', result.report);
  console.log(
    JSON.stringify(
      Object.fromEntries(
        Object.entries(result.lhr.categories).map(([key, value]) => [
          key,
          Math.round(value.score * 100),
        ])
      ),
      null,
      2
    )
  );
} finally {
  await chrome.kill();
}
