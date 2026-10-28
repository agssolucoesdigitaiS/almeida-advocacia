const { chromium, devices } = require('playwright');
const S = './test-output/'; const U = 'http://localhost:4174/';
const ARGS = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];
(async () => {
  const b = await chromium.launch({ args: ARGS });
  const logs = [];
  const mk = async (name, opts) => { const c = await b.newContext(opts); const p = await c.newPage(); p.on('console', m => { if (['error', 'warning'].includes(m.type())) logs.push(name + ' ' + m.type() + ': ' + m.text().slice(0, 160)); }); p.on('pageerror', e => logs.push(name + ' PAGEERROR: ' + e.message)); return p; };
  const p = await mk('D', { viewport: { width: 1440, height: 900 } });
  await p.goto(U); await p.waitForTimeout(3800);
  await p.getByRole('button', { name: 'Menu' }).click(); await p.waitForTimeout(1500);
  await p.screenshot({ path: S + 'f-menu.jpg', quality: 65 });
  await p.keyboard.press('Tab'); await p.keyboard.press('Escape'); await p.waitForTimeout(1200);
  console.log('menu closed via Esc:', await p.locator('#menu-overlay').count() === 0);
  // area page through hover list
  await p.evaluate(() => document.getElementById('areas').scrollIntoView()); await p.waitForTimeout(1500);
  const link = p.locator('#areas a[href]').nth(1); await link.hover(); await p.waitForTimeout(900);
  await p.screenshot({ path: S + 'f-areas-hover.jpg', quality: 65 });
  await link.click(); await p.waitForTimeout(3000);
  console.log('area:', await p.evaluate(() => location.hash), await p.title());
  await p.screenshot({ path: S + 'f-area.jpg', quality: 65 });
  await p.mouse.wheel(0, 1400); await p.waitForTimeout(1500); await p.screenshot({ path: S + 'f-area2.jpg', quality: 65 });
  // article
  await p.goto(U + '#artigo-inventario-extrajudicial'); await p.waitForTimeout(4000);
  console.log('article:', await p.title(), '| reading:', await p.locator('dd').nth(1).innerText());
  await p.mouse.wheel(0, 1200); await p.waitForTimeout(1500); await p.screenshot({ path: S + 'f-article.jpg', quality: 65 });
  // profile
  await p.goto(U + '#equipe-mariana-almeida'); await p.waitForTimeout(3800); console.log('profile:', await p.title());
  await p.screenshot({ path: S + 'f-profile.jpg', quality: 65 });
  // contact page + form
  await p.goto(U + '#contato'); await p.waitForTimeout(3800); console.log('contact:', await p.title());
  await p.getByRole('button', { name: 'Enviar mensagem' }).click(); await p.waitForTimeout(400);
  console.log('errors:', await p.locator('.err').count(), 'focus:', await p.evaluate(() => document.activeElement.id));
  await p.fill('#page-nome', 'Ana Souza'); await p.fill('#page-email', 'ana@exemplo.com'); await p.fill('#page-assunto', 'Inventário');
  await p.fill('#page-mensagem', 'Gostaria de entender os passos de um inventário em cartório.'); await p.check('#page-consentimento');
  await p.waitForTimeout(2600);
  await p.getByRole('button', { name: 'Enviar mensagem' }).click(); await p.waitForTimeout(800);
  console.log('demo:', await p.locator('[role=status] h3').first().textContent());
  await p.screenshot({ path: S + 'f-contact.jpg', quality: 65 });
  await p.goto(U + '#aviso-legal'); await p.waitForTimeout(3500); console.log('legal:', await p.locator('h1').innerText());
  await p.goto(U + '#artigos'); await p.waitForTimeout(3500); console.log('articles:', await p.title());
  await p.goto(U + '#area-inexistente'); await p.waitForTimeout(3500); console.log('404:', await p.locator('h1').innerText().catch(() => '?'));
  // home drawer + back nav
  await p.goto(U); await p.waitForTimeout(3800);
  await p.evaluate(() => document.getElementById('conteudo').scrollIntoView()); await p.waitForTimeout(1200);
  await p.locator('#conteudo a[href]').nth(1).click(); await p.waitForTimeout(3000);
  console.log('art from grid:', await p.evaluate(() => location.hash));
  await p.goBack(); await p.waitForTimeout(3000); console.log('back:', JSON.stringify(await p.evaluate(() => location.hash)));
  // philosophy screenshot mid
  await p.evaluate(() => { const t = document.querySelector('#filosofia > div.relative'); window.scrollTo(0, t.getBoundingClientRect().top + scrollY + t.offsetHeight * 0.45); }); await p.waitForTimeout(1800);
  await p.screenshot({ path: S + 'f-philo.jpg', quality: 65 });
  // responsive passes
  for (const [name, opts] of [['M', { ...devices['iPhone 13'] }], ['S', { viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true }], ['T', { viewport: { width: 820, height: 1180 }, hasTouch: true }], ['R', { viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' }], ['U', { viewport: { width: 2560, height: 1080 } }]]) {
    const q = await mk(name, opts); await q.goto(U); await q.waitForTimeout(3800);
    const H = await q.evaluate(() => document.documentElement.scrollHeight); let over = 0; const vh = (opts.viewport || { height: 844 }).height; let i = 0;
    for (let y = 0; y < H; y += vh * 1.2, i++) { await q.evaluate(y => window.scrollTo(0, y), y); await q.waitForTimeout(name === 'R' ? 200 : 700); over = Math.max(over, await q.evaluate(() => document.documentElement.scrollWidth - innerWidth)); if (name === 'M' || name === 'R') await q.screenshot({ path: `${S}${name}-${String(i).padStart(2, '0')}.jpg`, quality: 55 }); }
    console.log(name, 'height', H, 'overflow', over);
    if (name === 'M') { await q.evaluate(() => window.scrollTo(0, 0)); await q.waitForTimeout(500); await q.getByRole('button', { name: 'Menu' }).click(); await q.waitForTimeout(1500); await q.screenshot({ path: S + 'M-menu.jpg', quality: 60 }); }
    await q.context().close();
  }
  console.log(logs.join('\n') || 'no console errors/warnings');
  await b.close();
})();
