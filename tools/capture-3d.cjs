const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1920, height: 1200 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('http://localhost:4174/'); await p.waitForTimeout(3500);
  for (const f of [0.08, 0.5, 0.97]) {
    await p.evaluate((f) => { const t = document.querySelector('#experiencia > div.relative'); const top = t.getBoundingClientRect().top + scrollY; window.scrollTo(0, top + (t.offsetHeight - innerHeight) * f); }, f);
    await p.waitForTimeout(5000);
    await p.screenshot({ path: `./test-output/s3d-${f}.jpg`, quality: 70 });
  }
  await p.evaluate(() => { document.querySelectorAll('#experiencia .pointer-events-none, header').forEach(e => e.style.visibility = 'hidden'); });
  await p.waitForTimeout(400);
  await p.locator('#experiencia canvas').screenshot({ path: './test-output/escultura.png' });
  console.log(errs.join('\n') || 'sem erros');
  await b.close();
})();
