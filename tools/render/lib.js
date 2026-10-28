// Biblioteca de materiais e primitivas para os renders demonstrativos do ATELIER NÓRD.
// Tudo é procedural: nenhuma fotografia ou textura de terceiros.
import * as THREE from 'three';

// ---------- aleatoriedade determinística ----------
let seed = 7;
export function setSeed(s) { seed = s; }
export function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
export const rr = (a, b) => a + (b - a) * rnd();

// ---------- ruído de valor ----------
function hash(x, y, s) { let h = x * 374761393 + y * 668265263 + s * 2147483647; h = (h ^ (h >> 13)) * 1274126177; return ((h ^ (h >> 16)) >>> 0) / 4294967295; }
function smooth(t) { return t * t * (3 - 2 * t); }
function vnoise(x, y, s) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = smooth(x - xi), yf = smooth(y - yi);
  const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s);
  return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
}
export function fbm(x, y, oct = 5, s = 1) { let v = 0, amp = .5, f = 1; for (let i = 0; i < oct; i++) { v += amp * vnoise(x * f, y * f, s + i); f *= 2; amp *= .5; } return v; }

// ---------- canvas helpers ----------
function cnv(w, h = w) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function pixelFill(c, fn) {
  const ctx = c.getContext('2d'); const img = ctx.createImageData(c.width, c.height); const d = img.data;
  for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) { const [r, g, b] = fn(x, y); const i = (y * c.width + x) * 4; d[i] = r; d[i + 1] = g; d[i + 2] = b; d[i + 3] = 255; }
  ctx.putImageData(img, 0, 0); return c;
}
function tex(c, srgb = true) { const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; if (srgb) t.colorSpace = THREE.SRGBColorSpace; return t; }
function heightToNormal(c, strength = 2) {
  const w = c.width, h = c.height; const src = c.getContext('2d').getImageData(0, 0, w, h).data;
  const out = cnv(w, h); const ctx = out.getContext('2d'); const img = ctx.createImageData(w, h); const d = img.data;
  const H = (x, y) => src[(((y + h) % h) * w + ((x + w) % w)) * 4] / 255;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const dx = (H(x + 1, y) - H(x - 1, y)) * strength, dy = (H(x, y + 1) - H(x, y - 1)) * strength;
    const nz = 1 / Math.sqrt(dx * dx + dy * dy + 1); const i = (y * w + x) * 4;
    d[i] = (-dx * nz * .5 + .5) * 255; d[i + 1] = (dy * nz * .5 + .5) * 255; d[i + 2] = nz * 255; d[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0); return tex(out, false);
}
const clamp = (v) => Math.max(0, Math.min(255, v));

// ---------- texturas ----------
const cache = {};
function once(k, f) { return cache[k] || (cache[k] = f()); }

export function concreteTex(tone = 1) {
  return once('concrete' + tone, () => {
    const S = 512; const hc = cnv(S);
    pixelFill(hc, (x, y) => { const n = fbm(x / 60, y / 60, 5, 3) * .7 + fbm(x / 6, y / 6, 2, 9) * .3; const v = n * 255; return [v, v, v]; });
    const c = cnv(S); const ctx = c.getContext('2d');
    pixelFill(c, (x, y) => {
      const n = fbm(x / 70, y / 70, 5, 3), f = fbm(x / 5, y / 5, 2, 11), st = fbm(x / 200, y / 30, 3, 5);
      let v = 150 + (n - .5) * 60 + (f - .5) * 18 + (st - .5) * 25; v *= tone;
      return [clamp(v * 1.0), clamp(v * .985), clamp(v * .95)];
    });
    // juntas de fôrma e furos de tirante
    ctx.strokeStyle = 'rgba(60,58,54,.35)'; ctx.lineWidth = 1.2;
    for (let y = 0; y <= S; y += S / 2) { ctx.beginPath(); ctx.moveTo(0, y + .5); ctx.lineTo(S, y + .5); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(S * .5, 0); ctx.lineTo(S * .5, S); ctx.stroke();
    ctx.fillStyle = 'rgba(55,52,48,.55)';
    for (let y = S / 8; y < S; y += S / 4) for (let x = S / 8; x < S; x += S / 4) { ctx.beginPath(); ctx.arc(x, y, 2.6, 0, Math.PI * 2); ctx.fill(); }
    return { map: tex(c), normal: heightToNormal(hc, 1.2) };
  });
}
export function woodTex(tone = 1, slat = true) {
  return once('wood' + tone + slat, () => {
    const W = 512, H = 512; const c = cnv(W, H); const n = slat ? 8 : 4;
    pixelFill(c, (x, y) => {
      const plank = Math.floor(x / (W / n)); const px = (x % (W / n)) / (W / n);
      const g = fbm(x / 3 + plank * 40, y / 90, 4, plank + 2); const ring = Math.sin((x / 2.2 + g * 30) + plank) * .5 + .5;
      let v = .55 + (g - .5) * .5 + ring * .12 + (hash(plank, 1, 4) - .5) * .18;
      if (slat && (px < .06 || px > .94)) v *= .35;
      v *= tone; return [clamp(150 * v + 30), clamp(105 * v + 18), clamp(70 * v + 10)];
    });
    const hc = cnv(W, H); pixelFill(hc, (x, y) => { const px = (x % (W / n)) / (W / n); const v = slat && (px < .06 || px > .94) ? 0 : 200 + fbm(x / 3, y / 60, 3, 2) * 55; return [v, v, v]; });
    return { map: tex(c), normal: heightToNormal(hc, slat ? 2.5 : .8) };
  });
}
export function stoneTex(base = [196, 188, 172], tile = 2, veins = true, key = 's') {
  return once('stone' + key, () => {
    const S = 512; const c = cnv(S); const ctx = c.getContext('2d');
    pixelFill(c, (x, y) => {
      const n = fbm(x / 40, y / 40, 5, 21), v2 = veins ? Math.pow(Math.abs(Math.sin(y / 14 + fbm(x / 60, y / 40, 4, 4) * 6)), 30) * .5 : 0;
      const pores = fbm(x / 2.5, y / 2.5, 1, 7) > .82 ? -22 : 0;
      const k = 1 + (n - .5) * .16 - v2 * .1;
      return [clamp(base[0] * k + pores), clamp(base[1] * k + pores), clamp(base[2] * k + pores)];
    });
    ctx.strokeStyle = 'rgba(70,64,56,.45)'; ctx.lineWidth = 1.5;
    for (let i = 0; i <= tile; i++) { const p = i * S / tile; ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, S); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(S, p); ctx.stroke(); }
    return { map: tex(c) };
  });
}
export function grassTex() {
  return once('grass', () => {
    const S = 512; const c = cnv(S);
    pixelFill(c, (x, y) => { const n = fbm(x / 30, y / 30, 5, 31), f = fbm(x / 2, y / 2, 2, 8), stripe = Math.sin(x / 40) * .04; const k = .75 + (n - .5) * .6 + (f - .5) * .3 + stripe; return [clamp(104 * k), clamp(118 * k), clamp(70 * k)]; });
    return { map: tex(c) };
  });
}
export function plasterTex(base = [236, 232, 224], key = 'p') {
  return once('plaster' + key, () => {
    const S = 256; const c = cnv(S);
    pixelFill(c, (x, y) => { const n = fbm(x / 25, y / 25, 4, 41); const k = 1 + (n - .5) * .07; return [clamp(base[0] * k), clamp(base[1] * k), clamp(base[2] * k)]; });
    return { map: tex(c) };
  });
}
export function brickTex() {
  return once('brick', () => {
    const W = 512, H = 512; const c = cnv(W, H); const bh = 32, bw = 96;
    pixelFill(c, (x, y) => {
      const row = Math.floor(y / bh); const off = row % 2 ? bw / 2 : 0; const bx = Math.floor((x + off) / bw);
      const mx = (x + off) % bw, my = y % bh; const mortar = mx < 5 || my < 5;
      if (mortar) { const v = 175 + fbm(x / 4, y / 4, 2, 3) * 30; return [v, v * .96, v * .9]; }
      const t = hash(bx, row, 9); const n = fbm(x / 8, y / 8, 3, 5);
      const k = .75 + t * .35 + (n - .5) * .3; return [clamp(150 * k), clamp(84 * k), clamp(62 * k)];
    });
    return { map: tex(c) };
  });
}
export function paperPlanTex() {
  return once('plan', () => {
    const S = 1024; const c = cnv(S); const ctx = c.getContext('2d');
    ctx.fillStyle = '#f2efe8'; ctx.fillRect(0, 0, S, S);
    ctx.strokeStyle = '#2b2b2a'; ctx.lineWidth = 3;
    const rooms = [[120, 140, 420, 300], [540, 140, 360, 300], [120, 440, 260, 380], [380, 440, 520, 380]];
    rooms.forEach(([x, y, w, h]) => ctx.strokeRect(x, y, w, h));
    ctx.lineWidth = 1; for (let i = 0; i < 40; i++) { ctx.beginPath(); const x = 120 + rnd() * 780, y = 140 + rnd() * 680; ctx.moveTo(x, y); ctx.lineTo(x + rr(-80, 80), y + rr(-4, 4)); ctx.stroke(); }
    ctx.beginPath(); ctx.arc(540, 440, 80, 0, Math.PI / 2); ctx.stroke();
    ctx.font = '22px serif'; ctx.fillStyle = '#555'; ctx.fillText('PLANTA — NÍVEL 01   1:50', 120, 900);
    return { map: tex(c) };
  });
}
export function matTex() {
  return once('mat', () => {
    const S = 512; const c = cnv(S); const ctx = c.getContext('2d');
    ctx.fillStyle = '#3f5148'; ctx.fillRect(0, 0, S, S); ctx.strokeStyle = 'rgba(230,230,220,.35)'; ctx.lineWidth = 1;
    for (let i = 0; i <= S; i += 32) { ctx.beginPath(); ctx.moveTo(i + .5, 0); ctx.lineTo(i + .5, S); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, i + .5); ctx.lineTo(S, i + .5); ctx.stroke(); }
    return { map: tex(c) };
  });
}
export function linenTex(base = [214, 204, 186], key = 'l') {
  return once('linen' + key, () => {
    const S = 256; const c = cnv(S);
    pixelFill(c, (x, y) => { const w = (Math.sin(x * 1.7) + Math.sin(y * 1.9)) * .03; const n = fbm(x / 20, y / 20, 3, 51); const k = .94 + w + (n - .5) * .1; return [clamp(base[0] * k), clamp(base[1] * k), clamp(base[2] * k)]; });
    return { map: tex(c) };
  });
}

// ---------- materiais ----------
function rep(t, sx, sy) { const c = t.clone(); c.needsUpdate = true; c.repeat.set(sx, sy); return c; }
export function M(kind, o = {}) {
  const std = (p) => new THREE.MeshStandardMaterial(p);
  switch (kind) {
    case 'concrete': { const t = concreteTex(o.tone || 1); return std({ map: t.map, normalMap: t.normal, normalScale: new THREE.Vector2(.5, .5), roughness: .92, color: o.color || 0xffffff }); }
    case 'wood': { const t = woodTex(o.tone || 1, o.slat !== false); return std({ map: t.map, normalMap: t.normal, normalScale: new THREE.Vector2(.8, .8), roughness: .72 }); }
    case 'stone': { const t = stoneTex(o.base, o.tile, o.veins, o.key); return std({ map: t.map, roughness: o.rough ?? .6 }); }
    case 'grass': return std({ map: grassTex().map, roughness: 1 });
    case 'plaster': return std({ map: plasterTex(o.base, o.key).map, roughness: .95 });
    case 'brick': return std({ map: brickTex().map, roughness: .95 });
    case 'linen': return std({ map: linenTex(o.base, o.key).map, roughness: 1 });
    case 'plan': return std({ map: paperPlanTex().map, roughness: .9 });
    case 'mat': return std({ map: matTex().map, roughness: .9 });
    case 'glass': return new THREE.MeshPhysicalMaterial({ color: o.color || 0x2e3a3c, roughness: .03, metalness: .35, envMapIntensity: 1.8, transparent: !!o.opacity, opacity: o.opacity ?? 1, clearcoat: 1 });
    case 'water': return new THREE.MeshPhysicalMaterial({ color: 0x2f5f63, roughness: .06, metalness: .1, envMapIntensity: 1.2, clearcoat: 1 });
    case 'metal': return std({ color: o.color || 0x1b1c1b, roughness: .45, metalness: .6 });
    case 'white': return std({ color: o.color || 0xf1eee8, roughness: .85 });
    case 'emissive': return std({ color: 0x000000, emissive: o.color || 0xffc98a, emissiveIntensity: o.i ?? 2.2 });
    case 'leaf': return std({ color: o.color || 0x3d4a33, roughness: .9, flatShading: true });
    case 'sea': return new THREE.MeshPhysicalMaterial({ color: 0x3d6b7a, roughness: .18, metalness: .1, clearcoat: .6 });
    case 'dirt': { const t = stoneTex([168, 150, 122], 1, false, 'dirt'); return std({ map: t.map, roughness: 1 }); }
    default: return std({ color: o.color || 0x888888, roughness: .8 });
  }
}

// mapeamento UV em "box mapping" pelo tamanho real (m)
export function worldUV(g, scale = 3) {
  g = g.index ? g.toNonIndexed() : g; g.computeVertexNormals();
  const p = g.attributes.position, n = g.attributes.normal, uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) {
    const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i));
    let u, v; if (ax >= ay && ax >= az) { u = p.getZ(i); v = p.getY(i); } else if (ay >= az) { u = p.getX(i); v = p.getZ(i); } else { u = p.getX(i); v = p.getY(i); }
    uv[i * 2] = u / scale; uv[i * 2 + 1] = v / scale;
  }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); return g;
}

export function box(scene, [x0, y0, z0], [x1, y1, z1], mat, uvScale = 3, shadow = true) {
  const w = x1 - x0, h = y1 - y0, d = z1 - z0;
  const g = new THREE.BoxGeometry(w, h, d); g.translate(x0 + w / 2, y0 + h / 2, z0 + d / 2);
  const m = new THREE.Mesh(worldUV(g, uvScale), mat); m.castShadow = shadow; m.receiveShadow = true; scene.add(m); return m;
}
export function mesh(scene, geo, mat, pos = [0, 0, 0], rot = [0, 0, 0], uvScale = null) {
  const m = new THREE.Mesh(uvScale ? worldUV(geo, uvScale) : geo, mat); m.position.set(...pos); m.rotation.set(...rot); m.castShadow = true; m.receiveShadow = true; scene.add(m); return m;
}

// ---------- vegetação (estilo maquete refinada) ----------
const leafMats = [0x4a5a3a, 0x56653f, 0x3f4d33, 0x667148].map(c => new THREE.MeshStandardMaterial({ color: c, roughness: .95 }));
const pineMat = new THREE.MeshStandardMaterial({ color: 0x34402f, roughness: .95 });
const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3c30, roughness: 1 });
export function tree(scene, x, y, z, s = 1, kind = 'round') {
  const g = new THREE.Group(); g.position.set(x, y, z); scene.add(g);
  const th = 2.2 * s; const trunk = new THREE.Mesh(new THREE.CylinderGeometry(.08 * s, .14 * s, th, 6), trunkMat); trunk.position.y = th / 2; trunk.castShadow = true; g.add(trunk);
  if (kind === 'pine') {
    for (let i = 0; i < 4; i++) { const r = (1.6 - i * .32) * s, h = 2.4 * s; const c = new THREE.Mesh(new THREE.ConeGeometry(r, h, 18), pineMat); c.position.y = th * .6 + i * 1.15 * s + h / 2; c.castShadow = true; c.receiveShadow = true; g.add(c); }
  } else {
    const n = 14 + Math.floor(rnd() * 8);
    for (let i = 0; i < n; i++) { const r = rr(.45, .95) * s; const m = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 3), leafMats[Math.floor(rnd() * leafMats.length)]); m.position.set(rr(-1.4, 1.4) * s, th + rr(.1, 2) * s, rr(-1.4, 1.4) * s); m.castShadow = true; m.receiveShadow = true; g.add(m); }
  }
  return g;
}
export function shrub(scene, x, y, z, s = 1) {
  const n = 3 + Math.floor(rnd() * 3);
  for (let i = 0; i < n; i++) { const m = new THREE.Mesh(new THREE.IcosahedronGeometry(rr(.35, .6) * s, 3), leafMats[Math.floor(rnd() * 4)]); m.position.set(x + rr(-.5, .5) * s, y + rr(.2, .5) * s, z + rr(-.5, .5) * s); m.castShadow = true; m.receiveShadow = true; scene.add(m); }
}
export function plant(scene, x, y, z, s = 1) {
  mesh(scene, new THREE.CylinderGeometry(.22 * s, .17 * s, .5 * s, 20), M('white', { color: 0xd9d2c4 }), [x, y + .25 * s, z]);
  for (let i = 0; i < 9; i++) { const l = new THREE.Mesh(new THREE.ConeGeometry(.09 * s, rr(.9, 1.5) * s, 4), leafMats[i % 4]); l.position.set(x + rr(-.15, .15) * s, y + .9 * s, z + rr(-.15, .15) * s); l.rotation.set(rr(-.5, .5), rnd() * 3, rr(-.5, .5)); l.castShadow = true; scene.add(l); }
}

// ---------- céu, luz, render ----------
export let lastSky = null;
export function setLastSkyNull() { lastSky = null; }
export function skyTexture(top, mid, bottom, sun = null) {
  lastSky = [top, mid, bottom];
  const c = cnv(64, 512); const ctx = c.getContext('2d'); const g = ctx.createLinearGradient(0, 0, 0, 512);
  g.addColorStop(0, top); g.addColorStop(.62, mid); g.addColorStop(1, bottom); ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 512);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
export function sunLight(scene, pos, color = 0xfff1dc, intensity = 3, extent = 40, target = [0, 0, 0]) {
  const s = new THREE.DirectionalLight(color, intensity); s.position.set(...pos); s.target.position.set(...target); scene.add(s.target);
  s.castShadow = true; s.shadow.mapSize.set(4096, 4096); const c = s.shadow.camera; c.left = c.bottom = -extent; c.right = c.top = extent; c.near = 1; c.far = 300; s.shadow.bias = -.0004; s.shadow.normalBias = .03; s.shadow.radius = 3;
  scene.add(s); return s;
}

// ===================== Almeida Advocacia: materiais adicionais =====================
export function darkStoneTex(key = 'nero', base = [34, 35, 33], vein = [150, 146, 136]) {
  return once('dstone' + key, () => {
    const S = 1024; const c = cnv(S);
    pixelFill(c, (x, y) => {
      const n = fbm(x / 90, y / 90, 5, 61);
      const w = fbm(x / 160 + 9, y / 60, 5, 63);
      const v = Math.pow(1 - Math.min(1, Math.abs(Math.sin((x * .6 + y) / 70 + w * 7)) * 1.0), 26);
      const v2 = Math.pow(1 - Math.min(1, Math.abs(Math.sin((x - y * .4) / 40 + n * 9))), 40) * .5;
      const k = 1 + (n - .5) * .25; const t = Math.min(1, v * .75 + v2 * .5);
      return [clamp(base[0] * k * (1 - t) + vein[0] * t), clamp(base[1] * k * (1 - t) + vein[1] * t), clamp(base[2] * k * (1 - t) + vein[2] * t)];
    });
    return { map: tex(c) };
  });
}
export function brushedTex() {
  return once('brushed', () => {
    const S = 512; const c = cnv(S);
    pixelFill(c, (x, y) => { const n = fbm(x / 400, y / 1.2, 3, 71); const v = 150 + (n - .5) * 60; return [v, v * .97, v * .9]; });
    return { map: tex(c), rough: tex(c, false) };
  });
}
export function paperTextTex(key = 'paper', sign = false, title = 'CONTRATO DE PRESTAÇÃO DE SERVIÇOS', highlight = false) {
  return once('ptext' + key, () => {
    const W = 1024, H = 1448; const c = cnv(W, H); const ctx = c.getContext('2d');
    ctx.fillStyle = '#f3f0e8'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#2a2a28'; ctx.font = 'bold 30px Georgia'; ctx.textAlign = 'center'; ctx.fillText(title, W / 2, 170); ctx.textAlign = 'left';
    ctx.font = '22px Georgia'; ctx.fillText('CLÁUSULA PRIMEIRA — DO OBJETO', 120, 240);
    let y = 280; for (let p = 0; p < 7; p++) { const lines = 4 + Math.floor(rnd() * 4); for (let l = 0; l < lines; l++) { const w = l === lines - 1 ? rr(200, 600) : rr(740, 790); if (highlight && p === 2 && l < 3) { ctx.fillStyle = 'rgba(240,215,80,.55)'; ctx.fillRect(114, y - 8, w + 12, 20); } ctx.fillStyle = 'rgba(40,40,38,.75)'; ctx.fillRect(120, y, w, 7); y += 22; } y += 26; if (p === 3) { ctx.fillStyle = '#2a2a28'; ctx.font = '22px Georgia'; ctx.fillText('CLÁUSULA SEGUNDA — DAS OBRIGAÇÕES', 120, y + 10); y += 50; } if (y > H - 300) break; }
    if (sign) { ctx.fillRect(120, H - 200, 320, 2); ctx.fillRect(580, H - 200, 320, 2); ctx.strokeStyle = '#1f2a44'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(140, H - 210); for (let i = 0; i < 12; i++) ctx.quadraticCurveTo(160 + i * 22, H - 250 + (i % 2) * 50, 170 + i * 22, H - 214); ctx.stroke(); }
    return { map: tex(c) };
  });
}
export function booksTex() {
  return once('books', () => {
    const W = 1024, H = 256; const c = cnv(W, H); const ctx = c.getContext('2d');
    const pal = ['#2b2a26', '#4a3b2c', '#6b5a42', '#1f2a26', '#8a7a5e', '#3a3530', '#5c4a3a', '#b8aa8a', '#262826'];
    let x = 0; while (x < W) { const w = rr(14, 34); ctx.fillStyle = pal[Math.floor(rnd() * pal.length)]; const h = rr(190, 250); ctx.fillRect(x, H - h, w - 2, h); ctx.fillStyle = 'rgba(210,190,140,.5)'; ctx.fillRect(x + 3, H - h + 20, w - 8, 3); ctx.fillRect(x + 3, H - 40, w - 8, 3); x += w; }
    return { map: tex(c) };
  });
}
export function MX(kind, o = {}) {
  const std = (p) => new THREE.MeshStandardMaterial(p);
  switch (kind) {
    case 'nero': return std({ map: darkStoneTex(o.key || 'nero', o.base, o.vein).map, roughness: o.rough ?? .25, metalness: .05, envMapIntensity: 1.2 });
    case 'brushed': { const t = brushedTex(); return std({ map: t.map, roughness: .32, metalness: .9, color: o.color || 0xd8c49a }); }
    case 'steel': { const t = brushedTex(); return std({ map: t.map, roughness: .38, metalness: .85, color: o.color || 0xb9bcb8 }); }
    case 'paper': return std({ map: paperTextTex(o.key, o.sign, o.title, o.highlight).map, roughness: .9 });
    case 'books': return std({ map: booksTex().map, roughness: .85 });
    case 'leather': return std({ color: o.color || 0x3a2b20, roughness: .55 });
    case 'walnut': return M('wood', { tone: .55, slat: false });
    default: return M(kind, o);
  }
}
// figura humana estilizada (silhueta para retratos demonstrativos)
export function figure(scene, x, z, rotY = 0, s = 1, mat = null, pose = 'stand') {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rotY; g.scale.setScalar(s); scene.add(g);
  const m = mat || new THREE.MeshStandardMaterial({ color: 0x1a1b1a, roughness: .7 });
  const add = (geo, p, r = [0, 0, 0]) => { const me = new THREE.Mesh(geo, m); me.position.set(...p); me.rotation.set(...r); me.castShadow = true; me.receiveShadow = true; g.add(me); return me; };
  add(new THREE.CapsuleGeometry(.075, .78, 6, 12), [-.1, .47, 0]); add(new THREE.CapsuleGeometry(.075, .78, 6, 12), [.1, .47, 0]);
  add(new THREE.CapsuleGeometry(.19, .42, 8, 16), [0, 1.18, 0]).scale.set(1.15, 1, .72);
  add(new THREE.CapsuleGeometry(.055, .56, 6, 12), [-.27, 1.12, 0], [0, 0, .08]); add(new THREE.CapsuleGeometry(.055, .56, 6, 12), [.27, 1.12, 0], [0, 0, -.08]);
  add(new THREE.CylinderGeometry(.05, .06, .1, 12), [0, 1.53, 0]);
  add(new THREE.SphereGeometry(.105, 24, 16), [0, 1.66, 0]).scale.set(.9, 1.12, 1);
  return g;
}


// ---------- objetos jurídicos (sem clichês: livros de legislação, documentos, pastas) ----------
const BOOK_COLORS = ['#3b2a22', '#1f2a3a', '#4a1f1f', '#22302a', '#2c2b28', '#5a4632', '#1c1d1f'];
export function spineTex(title, color, vol = '') {
  return once('spine' + title + color + vol, () => {
    const W = 128, H = 640; const c = cnv(W, H); const ctx = c.getContext('2d');
    ctx.fillStyle = color; ctx.fillRect(0, 0, W, H);
    const g = ctx.createLinearGradient(0, 0, W, 0); g.addColorStop(0, 'rgba(0,0,0,.35)'); g.addColorStop(.2, 'rgba(255,255,255,.06)'); g.addColorStop(.8, 'rgba(0,0,0,.05)'); g.addColorStop(1, 'rgba(0,0,0,.4)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#c9ad6e'; ctx.fillRect(10, 60, W - 20, 3); ctx.fillRect(10, 68, W - 20, 1.5); ctx.fillRect(10, H - 90, W - 20, 3); ctx.fillRect(10, H - 82, W - 20, 1.5);
    ctx.save(); ctx.translate(W / 2 + 12, H / 2); ctx.rotate(-Math.PI / 2); ctx.textAlign = 'center'; ctx.font = '600 34px Georgia'; ctx.fillStyle = '#d9bf84';
    let size = 34; while (ctx.measureText(title).width > H - 200 && size > 18) { size -= 2; ctx.font = `600 ${size}px Georgia`; } ctx.fillText(title, 0, 0); ctx.restore();
    if (vol) { ctx.textAlign = 'center'; ctx.font = '600 26px Georgia'; ctx.fillStyle = '#d9bf84'; ctx.fillText(vol, W / 2, H - 40); }
    return tex(c);
  });
}
function pagesTex() {
  return once('pages', () => { const c = cnv(64, 256); pixelFill(c, (x, y) => { const v = 225 + (y % 3 === 0 ? -18 : 0) + (rnd() - .5) * 8; return [v, v * .97, v * .9]; }); return tex(c); });
}
export function book(scene, x, y, z, w, h, d, title, color, vol = '', rotY = 0, lean = 0) {
  const cover = new THREE.MeshStandardMaterial({ color, roughness: .6 });
  const spine = new THREE.MeshStandardMaterial({ map: spineTex(title, color, vol), roughness: .55 });
  const pages = new THREE.MeshStandardMaterial({ map: pagesTex(), roughness: .95 });
  // ordem BoxGeometry: +x, -x, +y, -y, +z, -z  → lombada voltada para +z
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), [cover, cover, pages, pages, spine, pages]);
  m.position.set(x, y + h / 2, z); m.rotation.set(0, rotY, lean); m.castShadow = true; m.receiveShadow = true; scene.add(m); return m;
}
const LEGAL_TITLES = ['CÓDIGO CIVIL', 'CÓDIGO DE PROCESSO CIVIL', 'CONSTITUIÇÃO FEDERAL', 'CONSOLIDAÇÃO DAS LEIS DO TRABALHO', 'CÓDIGO DE DEFESA DO CONSUMIDOR', 'DIREITO DE FAMÍLIA', 'SUCESSÕES', 'DIREITO EMPRESARIAL', 'TEORIA DOS CONTRATOS', 'RESPONSABILIDADE CIVIL', 'DIREITO IMOBILIÁRIO', 'JURISPRUDÊNCIA', 'DIREITO DAS OBRIGAÇÕES', 'PROCESSO DO TRABALHO', 'DIREITOS REAIS', 'LEGISLAÇÃO COMPLEMENTAR'];
export function bookRow(scene, x0, x1, y, z, hMin = .26, hMax = .34, depth = .24, seed = 1) {
  setSeed(seed); let x = x0; let i = 0;
  while (x < x1) {
    const w = rr(.035, .07), h = rr(hMin, hMax); const t = LEGAL_TITLES[Math.floor(rnd() * LEGAL_TITLES.length)];
    const col = BOOK_COLORS[Math.floor(rnd() * BOOK_COLORS.length)]; const vol = rnd() > .6 ? ['I', 'II', 'III', 'IV'][i % 4] : '';
    book(scene, x + w / 2, y, z, w, h, depth, t, col, vol); x += w + .002; i++;
    if (rnd() > .93) x += rr(.05, .15);
  }
}
export function openBook(scene, x, y, z, w = .7, d = .5, rotY = 0) {
  const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = rotY; scene.add(g);
  const pg = (key) => { const c = cnv(512, 720); const ctx = c.getContext('2d'); ctx.fillStyle = '#efe9dc'; ctx.fillRect(0, 0, 512, 720); ctx.fillStyle = 'rgba(40,38,34,.8)'; ctx.font = 'bold 20px Georgia'; ctx.fillText(key === 'l' ? 'Art. 421.' : 'Art. 422.', 50, 80); for (let yy = 110; yy < 660; yy += 18) ctx.fillRect(50, yy, rr(330, 410), 5); return tex(c); };
  for (const [s, k] of [[-1, 'l'], [1, 'r']]) { const geo = new THREE.PlaneGeometry(w / 2, d, 8, 1); const p = geo.attributes.position; for (let i = 0; i < p.count; i++) { const xx = p.getX(i) + w / 4; p.setZ(i, Math.sin((xx / (w / 2)) * Math.PI) * .02); } geo.computeVertexNormals(); geo.rotateX(-Math.PI / 2); const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: pg(k), roughness: .9, side: THREE.DoubleSide })); m.position.set(s * w / 4, .03, 0); if (s < 0) m.scale.x = -1, m.material.map.repeat.x = -1, m.material.map.wrapS = THREE.RepeatWrapping, m.material.map.offset.x = 1; m.receiveShadow = true; g.add(m); }
  const base = new THREE.Mesh(new THREE.BoxGeometry(w + .02, .03, d + .02), new THREE.MeshStandardMaterial({ color: '#3b2a22', roughness: .6 })); base.position.y = .012; base.castShadow = true; base.receiveShadow = true; g.add(base);
  return g;
}
export function folderTex(label) {
  return once('folder' + label, () => { const c = cnv(512, 360); const ctx = c.getContext('2d'); ctx.fillStyle = '#3a2d22'; ctx.fillRect(0, 0, 512, 360); ctx.font = '600 22px Georgia'; const tw = ctx.measureText(label).width; ctx.fillStyle = '#efe9dc'; ctx.fillRect(256 - tw / 2 - 26, 130, tw + 52, 70); ctx.fillStyle = '#2a2a28'; ctx.textAlign = 'center'; ctx.fillText(label, 256, 173); return tex(c); });
}
export function wallSignTex() {
  return once('wallsign', () => {
    const W = 2048, H = 512; const c = cnv(W, H); const ctx = c.getContext('2d'); ctx.fillStyle = '#1d211e'; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = '#d4bb84'; ctx.lineWidth = 7; ctx.lineCap = 'square';
    const mx = W / 2 - 110, my = 120; const A = (ox) => { ctx.beginPath(); ctx.moveTo(ox, my + 200); ctx.lineTo(ox + 70, my); ctx.lineTo(ox + 140, my + 200); ctx.stroke(); };
    A(mx); A(mx + 90); ctx.beginPath(); ctx.moveTo(mx + 30, my + 140); ctx.lineTo(mx + 200, my + 140); ctx.stroke();
    ctx.fillStyle = '#e8dfca'; ctx.font = '300 64px Georgia'; ctx.textAlign = 'center'; ctx.fillText('A L M E I D A   A D V O C A C I A', W / 2, my + 300);
    return tex(c);
  });
}
