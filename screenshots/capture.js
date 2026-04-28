// Puppeteer script — captures screenshots of MemoryJar pages
// Run with: node screenshots/capture.js
import puppeteer from 'puppeteer';
import { mkdir } from 'fs/promises';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname);
const base = process.env.BASE_URL || 'http://localhost:5174';

const shots = [
  { url: '/index.html',   file: '01-home-hero.png',     scrollTo: 0 },
  { url: '/index.html',   file: '02-home-stats.png',    scrollTo: 700 },
  { url: '/index.html',   file: '03-home-features.png', scrollTo: 1400 },
  { url: '/add.html',     file: '04-add-form.png',      scrollTo: 0 },
  { url: '/add.html',     file: '05-add-form-bottom.png', scrollTo: 600 },
  { url: '/jar.html',     file: '06-jar-page.png',      scrollTo: 0 },
  { url: '/wall.html',    file: '07-wall-stats.png',    scrollTo: 0 },
  { url: '/wall.html',    file: '08-wall-grid.png',     scrollTo: 700 },
  { url: '/about.html',   file: '09-about.png',         scrollTo: 0 }
];

const browser = await puppeteer.launch({
  args: ['--no-sandbox']
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 850, deviceScaleFactor: 2 });

await mkdir(outDir, { recursive: true });

for (const s of shots) {
  console.log(`Capturing ${s.file}…`);
  await page.goto(base + s.url, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));
  if (s.scrollTo) await page.evaluate((y) => window.scrollTo(0, y), s.scrollTo);
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: resolve(outDir, s.file), type: 'png' });
}

// Modal screenshot — open a memory and capture
console.log('Capturing 10-jar-modal.png…');
await page.goto(base + '/jar.html', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 500));
await page.click('#shake-btn');
await new Promise(r => setTimeout(r, 900));
await page.screenshot({ path: resolve(outDir, '10-jar-modal.png'), type: 'png' });

// Mobile view
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
console.log('Capturing 11-mobile-home.png…');
await page.goto(base + '/index.html', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: resolve(outDir, '11-mobile-home.png'), type: 'png' });

await browser.close();
console.log('All screenshots saved to', outDir);
