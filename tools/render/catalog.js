import * as THREE from 'three';
import { M, MX, box, mesh, tree, plant, skyTexture, sunLight, setSeed, rr, rnd, figure, book, bookRow, openBook, folderTex, wallSignTex } from './lib.js';

// Renders demonstrativos da ALMEIDA ADVOCACIA — ambientes corporativos sóbrios, sem símbolos jurídicos clichês.

const look = (cam, p, t) => { cam.position.set(...p); cam.lookAt(...t); };
const fogged = (scene, color, d) => { scene.fog = new THREE.FogExp2(color, d); };

function skyline(scene, z = 60, spread = 160, seed = 3) {
  setSeed(seed);
  const mats = [0x8f938e, 0x7e827d, 0x9da09a, 0x6f736f].map(c => new THREE.MeshStandardMaterial({ color: c, roughness: .8 }));
  for (let i = 0; i < 60; i++) {
    const w = rr(8, 22), d = rr(8, 22), h = rr(20, 110), x = rr(-spread, spread), zz = z + rr(0, 120);
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mats[i % 4]); m.position.set(x, h / 2 - 30, zz); scene.add(m);
  }
}

// sala com uma parede de vidro (lado +z), montantes verticais
function room(scene, { x0, x1, z0, z1, h, floor, wall, ceil, glassSide = 'z1', mullion = 1.6, sideWall }) {
  box(scene, [x0, -.2, z0], [x1, 0, z1], floor, 3);
  box(scene, [x0, h, z0], [x1, h + .3, z1], ceil, 3);
  box(scene, [x0 - .3, 0, z0 - .3], [x1 + .3, h, z0], wall, 3);
  box(scene, [x0 - .3, 0, z0], [x0, h, z1], sideWall || wall, 3);
  if (glassSide === 'z1') {
    box(scene, [x1, 0, z0], [x1 + .3, h, z1], wall, 3);
    const metal = M('metal', { color: 0x151615 });
    for (let x = x0; x <= x1 + .01; x += mullion) box(scene, [x - .04, 0, z1 - .05], [x + .04, h, z1 + .1], metal, 1);
    box(scene, [x0, 0, z1 - .02], [x1, h, z1 + .02], M('glass', { opacity: .1, color: 0xd0d6d4 }), 3, false);
  }
}

function lobby(scene) {
  setSeed(101);
  const nero = MX('nero', { rough: .14 }), wallStone = MX('nero', { key: 'wall', base: [52, 52, 49], vein: [110, 106, 98], rough: .55 });
  const ceil = M('concrete', { tone: .55 });
  room(scene, { x0: -16, x1: 16, z0: -14, z1: 6, h: 9, floor: nero, wall: wallStone, ceil, mullion: 2.4 });
  // brises verticais externos (luz em faixas)
  const fin = M('metal', { color: 0x1a1b1a });
  for (let x = -16; x <= 16; x += 1.5) box(scene, [x, 0, 6.6], [x + .1, 9, 7.1], fin, 1);
  // bloco de recepção monolítico
  box(scene, [-4.5, 0, -6], [4.5, 1.1, -4.4], MX('nero', { key: 'desk', base: [24, 25, 24], vein: [90, 86, 78], rough: .3 }), 2);
  box(scene, [-4.5, 1.1, -6], [4.5, 1.14, -4.4], MX('brushed'), 2);
  // filete de latão na parede de fundo
  box(scene, [-.04, 0, -13.98], [.04, 9, -13.9], MX('brushed'), 1);
  // banco e vegetação
  box(scene, [9, 0, -2], [13, .45, -1], M('wood', { tone: .45, slat: false }), 2);
  plant(scene, 13.5, 0, -10, 2.2); plant(scene, -13.5, 0, -10, 2.4);
  skyline(scene, 40);
}

function meeting(scene) {
  setSeed(102);
  const floor = M('wood', { tone: .42, slat: false }), wall = MX('nero', { key: 'wall2', base: [58, 57, 53], vein: [100, 96, 90], rough: .6 });
  room(scene, { x0: -7, x1: 7, z0: -6, z1: 4, h: 3.2, floor, wall, ceil: M('plaster', { base: [200, 196, 188], key: 'c1' }), mullion: 1.75, sideWall: M('wood', { tone: .5 }) });
  const table = MX('walnut');
  box(scene, [-4, .74, -2.2], [4, .8, -.4], table, 2); box(scene, [-3, 0, -1.5], [-2.6, .74, -1.1], M('metal'), 1); box(scene, [2.6, 0, -1.5], [3, .74, -1.1], M('metal'), 1);
  const chair = MX('leather', { color: 0x2a2420 });
  for (let i = 0; i < 5; i++) for (const s of [-1, 1]) { const x = -3.2 + i * 1.6, z = s < 0 ? -2.75 : .15; box(scene, [x - .26, .42, z - .25], [x + .26, .5, z + .25], chair, 1); box(scene, [x - .26, .5, s < 0 ? z - .27 : z + .19], [x + .26, 1.05, s < 0 ? z - .19 : z + .27], chair, 1); box(scene, [x - .03, 0, z - .03], [x + .03, .42, z + .03], M('metal'), 1); }
  
  
  for (const x of [-2.5, 0, 2.5]) { mesh(scene, new THREE.CylinderGeometry(.5, .5, .04, 48), MX('brushed'), [x, 2.5, -1.3]); const l = new THREE.PointLight(0xffd7a0, 5, 5, 2); l.position.set(x, 2.3, -1.3); scene.add(l); }
  skyline(scene, 30);
}

function desk(scene) {
  setSeed(103);
  box(scene, [-3, -.1, -2], [3, 0, 2], MX('walnut'), 1.4, false);
  paper(scene, -.4, 0, 1, 1.4, .08, MX('paper', { key: 'ps', sign: true }));
  paper(scene, .8, -.2, 1, 1.4, -.12, MX('paper', { key: 'pt' }));
  box(scene, [-2.4, 0, -1.3], [-1.2, .05, .3], MX('leather'), 1);
  const pen = mesh(scene, new THREE.CylinderGeometry(.012, .012, .72, 16), MX('brushed', { color: 0x1d1d1c }), [-.2, .02, .5], [Math.PI / 2, 0, 1.0]);
  mesh(scene, new THREE.CylinderGeometry(.013, .013, .12, 16), MX('brushed'), [-.47, .02, .33], [Math.PI / 2, 0, 1.0]);
  mesh(scene, new THREE.CylinderGeometry(.05, .05, .8, 16), MX('brushed'), [1.9, .4, -1.3]);
  mesh(scene, new THREE.ConeGeometry(.35, .3, 32, 1, true), MX('brushed', { color: 0x1d1d1c }), [1.9, .9, -1.3]);
  mesh(scene, new THREE.CylinderGeometry(.06, .06, .14, 24), M('white', { color: 0xe8e2d6 }), [1.5, .07, .6]);
}
function paper(scene, x, z, w, d, rotY, mat) {
  const g = new THREE.PlaneGeometry(w, d); g.rotateX(-Math.PI / 2);
  const m = new THREE.Mesh(g, mat); m.position.set(x, .004, z); m.rotation.y = rotY; m.receiveShadow = true; scene.add(m); return m;
}
function fixPaperUV(g, x0, x1, z0, z1) {
  const p = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, 1 - (p.getX(i) - x0) / (x1 - x0), 1 - (p.getZ(i) - z0) / (z1 - z0));
  uv.needsUpdate = true;
}

function library(scene) {
  setSeed(104);
  const wood = MX('walnut');
  box(scene, [-8, -.2, -6], [8, 0, 4], M('wood', { tone: .5, slat: false }), 2);
  box(scene, [-8, 3.6, -6], [8, 3.8, 4], M('plaster', { base: [190, 186, 178], key: 'c2' }), 3);
  box(scene, [-8.2, 0, -6.2], [8.2, 3.6, -6], wood, 2);
  const books = MX('books');
  for (let j = 0; j < 5; j++) { box(scene, [-7.5, .25 + j * .68, -5.98], [7.5, .29 + j * .68, -5.55], wood, 1); const b = box(scene, [-7.5, .29 + j * .68, -5.94], [7.5, .82 + j * .68, -5.6], books, 1); b.material = books; }
  for (let i = -7.5; i <= 7.5; i += 2.5) box(scene, [i - .04, 0, -5.98], [i + .04, 3.6, -5.55], wood, 1);
  box(scene, [-2, .74, -2.4], [2, .8, -1], wood, 2); box(scene, [-1.8, 0, -2.2], [-1.6, .74, -1.2], M('metal'), 1); box(scene, [1.6, 0, -2.2], [1.8, .74, -1.2], M('metal'), 1);
  mesh(scene, new THREE.CylinderGeometry(.04, .04, .5, 16), MX('brushed'), [1.3, 1.05, -2]); mesh(scene, new THREE.SphereGeometry(.14, 24, 16), M('emissive', { color: 0xffd6a0, i: 2 }), [1.3, 1.35, -2]);
  const l = new THREE.PointLight(0xffcf96, 6, 6, 2); l.position.set(1.3, 1.3, -2); scene.add(l);
}

function office(scene, { fig = null } = {}) {
  setSeed(105);
  const floor = M('wood', { tone: .45, slat: false }), wall = M('plaster', { base: [92, 90, 84], key: 'w3' });
  room(scene, { x0: -5, x1: 5, z0: -5, z1: 3, h: 3.2, floor, wall, ceil: M('plaster', { base: [180, 176, 168], key: 'c3' }), mullion: 1.25, sideWall: MX('walnut') });
  box(scene, [-1.6, .74, -2.2], [1.6, .79, -1.2], MX('walnut'), 2); box(scene, [-1.5, 0, -2.1], [-1.4, .74, -1.3], M('metal'), 1); box(scene, [1.4, 0, -2.1], [1.5, .74, -1.3], M('metal'), 1);
  
  const ch = MX('leather', { color: 0x221d1a }); box(scene, [-.3, .45, -3.1], [.3, .53, -2.6], ch, 1); box(scene, [-.3, .53, -3.2], [.3, 1.25, -3.1], ch, 1);
  for (let j = 0; j < 3; j++) box(scene, [-4.98, .9 + j * .7, -4.5], [-4.6, .94 + j * .7, -.5], MX('walnut'), 1);
  for (let j = 0; j < 3; j++) box(scene, [-4.97, .94 + j * .7, -4.4], [-4.65, 1.35 + j * .7, -2], MX('books'), 1);
  plant(scene, 4, 0, -4, 1.8);
  if (fig) figure(scene, fig.x, fig.z, fig.r, 1, null);
  skyline(scene, 30);
}

function facade(scene) {
  setSeed(106);
  box(scene, [-60, -.4, -10], [60, 0, 40], M('stone', { base: [120, 118, 112], tile: 10, veins: false, key: 'paving' }), 3);
  const stone = MX('nero', { key: 'fac', base: [70, 69, 64], vein: [120, 116, 108], rough: .6 }), glass = M('glass', { color: 0x2a3433 });
  box(scene, [-14, 0, -12], [14, 46, -2], glass, 3);
  for (let x = -14; x <= 14.01; x += 2) box(scene, [x - .35, 0, -2.2], [x + .35, 46, -1.2], stone, 3);
  for (let y = 0; y <= 46; y += 4) box(scene, [-14, y, -2.2], [14, y + .3, -1.4], stone, 3);
  box(scene, [-16, 0, -12], [-14, 46, -1], stone, 3); box(scene, [14, 0, -12], [16, 46, -1], stone, 3);
  box(scene, [-30, 0, -14], [-17, 30, -2], M('plaster', { base: [110, 108, 102], key: 'nb1' }), 3);
  box(scene, [17, 0, -14], [34, 22, -2], M('plaster', { base: [150, 146, 138], key: 'nb2' }), 3);
  for (const x of [-10, 10]) tree(scene, x, 0, 6, 1.4);
}

function residential(scene) {
  setSeed(107);
  box(scene, [-60, -.4, -10], [60, 0, 40], M('stone', { base: [150, 146, 138], tile: 10, veins: false, key: 'pav2' }), 3);
  const conc = M('concrete', { tone: .9 }), glass = M('glass'), wood = M('wood', { tone: .7 });
  for (let f = 0; f < 9; f++) { const y = f * 3.2; box(scene, [-10, y + 2.9, -6], [10, y + 3.2, 1.6], conc, 3); box(scene, [-9, y, -6], [9, y + 2.9, -5.8], glass, 3); box(scene, [-10, y + 2.9, 1.4], [10, y + 3.9, 1.6], M('glass', { opacity: .3, color: 0xbfcaca }), 2, false); box(scene, [-10, y, -6], [-9, y + 2.9, 1.4], wood, 2); }
  box(scene, [-10, 0, -9], [10, 29, -6], conc, 3);
  for (let i = 0; i < 6; i++) tree(scene, rr(-24, 24), 0, rr(6, 14), rr(1.1, 1.6));
}

function living(scene) {
  setSeed(108);
  room(scene, { x0: -6, x1: 6, z0: -7, z1: 2, h: 3, floor: M('wood', { tone: .7, slat: false }), wall: M('plaster', { base: [214, 206, 192], key: 'lw' }), ceil: M('plaster', { base: [220, 214, 204], key: 'lc' }), mullion: 2 });
  const lin = M('linen', { base: [190, 178, 158], key: 'sofa' });
  box(scene, [-3, 0, -4.4], [1.4, .42, -3.4], lin, 1); box(scene, [-3, .42, -4.4], [1.4, .85, -4.15], lin, 1);
  box(scene, [-2.4, 0, -2.8], [.8, .01, -.6], M('linen', { base: [170, 160, 140], key: 'rug3' }), 1, false);
  mesh(scene, new THREE.CylinderGeometry(.5, .5, .36, 48), MX('walnut'), [-.8, .18, -1.8]);
  mesh(scene, new THREE.CylinderGeometry(.02, .02, 1.5, 12), MX('brushed'), [2.2, .75, -4.2]); mesh(scene, new THREE.SphereGeometry(.2, 24, 16), M('emissive', { color: 0xffd8a8, i: 1.6 }), [2.2, 1.6, -4.2]);
  const l = new THREE.PointLight(0xffcc90, 8, 7, 2); l.position.set(2.2, 1.5, -4.0); scene.add(l);
  plant(scene, -5, 0, -6, 1.6);
  for (let i = 0; i < 6; i++) tree(scene, rr(-30, 30), -8, rr(16, 40), rr(1.4, 2));
}

function workstations(scene) {
  setSeed(109);
  room(scene, { x0: -12, x1: 12, z0: -10, z1: 4, h: 3.2, floor: M('stone', { base: [96, 96, 92], tile: 1, veins: false, key: 'carpet' }), wall: M('plaster', { base: [150, 148, 142], key: 'ww' }), ceil: M('plaster', { base: [196, 194, 188], key: 'wc' }), mullion: 1.5 });
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
    const x = -9 + c * 5, z = -7 + r * 3.4;
    box(scene, [x - 2, .73, z - .5], [x + 2, .77, z + .5], M('white', { color: 0xdedad2 }), 1);
    box(scene, [x - 1.9, 0, z - .4], [x - 1.8, .73, z + .4], M('metal'), 1); box(scene, [x + 1.8, 0, z - .4], [x + 1.9, .73, z + .4], M('metal'), 1);
    box(scene, [x - 2, .77, z - .04], [x + 2, 1.15, z + .04], M('linen', { base: [120, 118, 110], key: 'panel' }), 1);
    for (const d of [-1, 1]) { box(scene, [x + d - .25, .55, z + .55], [x + d + .25, .62, z + 1.0], MX('leather', { color: 0x2c2c2a }), 1); box(scene, [x + d - .04, 0, z + .74], [x + d + .04, .55, z + .82], M('metal'), 1); }
  }
  skyline(scene, 30);
}

function stair(scene) {
  setSeed(110);
  const stone = MX('nero', { key: 'st', base: [64, 63, 58], vein: [130, 126, 116], rough: .45 });
  box(scene, [-10, -.2, -10], [10, 0, 10], stone, 3);
  box(scene, [-10, 0, -10.2], [10, 14, -10], MX('nero', { key: 'stw', base: [44, 44, 41], vein: [96, 92, 86], rough: .6 }), 3);
  for (let i = 0; i < 22; i++) box(scene, [-2, i * .18, -9.9 + 0 + 0], [2, (i + 1) * .18, -9.9 + (22 - i) * .3], stone, 2);
  box(scene, [-2.08, 0, -9.9], [-2, 4.2, -3.2], MX('brushed'), 1);
  box(scene, [10, 0, -10], [10.2, 14, 10], M('concrete', { tone: .5 }), 3);
  box(scene, [-10.2, 0, -10], [-10, 14, 10], M('concrete', { tone: .5 }), 3);
  box(scene, [-10, 14, -3], [10, 14.2, 10], M('concrete', { tone: .5 }), 3);
  // claraboia: fenda de luz
  scene.children.filter(o => o.isMesh && o.position.y > 13).forEach(o => o.visible = true);
}

function brassWall(scene) {
  setSeed(111);
  box(scene, [-6, -1, -.4], [6, 8, 0], MX('nero', { key: 'bw', base: [30, 31, 29], vein: [128, 122, 110], rough: .35 }), 3);
  box(scene, [.6, -1, -.02], [.66, 8, .04], MX('brushed'), 1);
  box(scene, [-6, -1, 0], [6, -.9, 6], MX('nero', { rough: .2 }), 3);
}

function fins(scene) {
  setSeed(112);
  box(scene, [-12, -.2, -6], [12, 0, 6], MX('nero', { rough: .2 }), 3);
  box(scene, [-12, 0, -6.3], [12, 6, -6], M('concrete', { tone: .6 }), 3);
  box(scene, [-12, 6, -6], [12, 6.3, 6], M('concrete', { tone: .5 }), 3);
  for (let x = -12; x < 12; x += .7) box(scene, [x, 0, 5], [x + .14, 6, 6.2], M('metal', { color: 0x151615 }), 1);
}

function contractMacro(scene) {
  setSeed(113);
  box(scene, [-3, -.1, -2], [3, 0, 2], MX('walnut'), 1.2, false);
  paper(scene, 0, 0, 2, 2.8, 0, MX('paper', { key: 'pm', sign: true }));
  mesh(scene, new THREE.CylinderGeometry(.018, .018, 1.1, 24), MX('brushed', { color: 0x1d1d1c }), [.4, .03, .9], [Math.PI / 2, 0, .7]);
  mesh(scene, new THREE.CylinderGeometry(.019, .019, .2, 24), MX('brushed'), [.08, .03, .6], [Math.PI / 2, 0, .7]);
}

// ======================================================================
// CENAS JURÍDICAS — biblioteca de legislação, análise de documentos, reunião
// ======================================================================
function folder(scene, x, z, w, d, rotY, label) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rotY; scene.add(g);
  const body = new THREE.Mesh(new THREE.BoxGeometry(w, .03, d), new THREE.MeshStandardMaterial({ color: '#3a2d22', roughness: .7 })); body.position.y = .015; body.castShadow = true; body.receiveShadow = true; g.add(body);
  const top = new THREE.Mesh(new THREE.PlaneGeometry(w, d).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ map: folderTex(label), roughness: .7 })); top.position.y = .031; top.receiveShadow = true; g.add(top);
  return g;
}
function shelves(scene, x0, x1, z, levels = 6, y0 = .3, gap = .42, seed = 5) {
  const wood = MX('walnut');
  for (let j = 0; j < levels; j++) { box(scene, [x0, y0 + j * gap - .03, z - .3], [x1, y0 + j * gap, z + .02], wood, 1); bookRow(scene, x0 + .03, x1 - .03, y0 + j * gap, z - .14, .27, .36, .24, seed + j); }
  for (let x = x0; x <= x1 + .01; x += (x1 - x0) / Math.max(1, Math.round((x1 - x0) / 1.2))) box(scene, [x - .025, y0 - .3, z - .3], [x + .025, y0 + levels * gap, z + .02], wood, 1);
  box(scene, [x0 - .05, y0 - .3, z - .34], [x1 + .05, y0 + levels * gap + .05, z - .3], wood, 2);
}
function legalLibrary(scene) {
  setSeed(201);
  box(scene, [-6, -.2, -5], [6, 0, 5], M('wood', { tone: .42, slat: false }), 2);
  box(scene, [-6, 3.4, -5], [6, 3.6, 5], M('plaster', { base: [70, 68, 62], key: 'lc2' }), 3);
  box(scene, [-6.2, 0, -5.2], [6.2, 3.4, -5], MX('walnut'), 2);
  shelves(scene, -5.6, 5.6, -4.66, 7, .3, .42, 11);
  // parede da janela à direita, com montantes
  const metal = M('metal', { color: 0x151615 });
  for (let z = -5; z <= 5; z += 1.4) box(scene, [6, 0, z - .04], [6.1, 3.4, z + .04], metal, 1);
  box(scene, [-6.2, 0, -5], [-6, 3.4, 5], MX('walnut'), 2);
  // mesa longa com documentos e código aberto
  const table = MX('walnut');
  box(scene, [-2.6, .74, -1.9], [2.6, .8, -.5], table, 2); box(scene, [-2.4, 0, -1.7], [-2.2, .74, -.7], M('metal'), 1); box(scene, [2.2, 0, -1.7], [2.4, .74, -.7], M('metal'), 1);
  openBook(scene, -.3, .8, -1.2, .8, .55, .08);
  paper(scene, 1.1, -1.15, .42, .6, -.2, MX('paper', { key: 'lib1', title: 'PARECER', highlight: true })).position.y = .805;
  paper(scene, 1.4, -1.3, .42, .6, .15, MX('paper', { key: 'lib2', title: 'CONTRATO SOCIAL' })).position.y = .802;
  book(scene, -1.7, .8, -1.3, .32, .06, .45, 'CÓDIGO CIVIL', '#3b2a22', '', .3, 0).rotation.set(Math.PI / 2, 0, .3);
  mesh(scene, new THREE.CylinderGeometry(.04, .05, .5, 16), MX('brushed'), [2, 1.05, -1.6]); mesh(scene, new THREE.ConeGeometry(.2, .18, 32, 1, true), MX('brushed', { color: 0x1d1d1c }), [2, 1.36, -1.6]);
  const l = new THREE.PointLight(0xffcf96, 7, 5, 2); l.position.set(2, 1.25, -1.5); scene.add(l);
}
function codesCloseup(scene) {
  setSeed(202);
  box(scene, [-2, -.05, -1], [2, 0, .6], MX('walnut'), 1.4);
  box(scene, [-2, -.05, -1.04], [2, 2, -1], MX('walnut'), 1.4);
  const titles = [['CONSTITUIÇÃO FEDERAL', '#1f2a3a'], ['CÓDIGO CIVIL', '#3b2a22'], ['CÓDIGO DE PROCESSO CIVIL', '#4a1f1f'], ['CONSOLIDAÇÃO DAS LEIS DO TRABALHO', '#22302a'], ['CÓDIGO DE DEFESA DO CONSUMIDOR', '#2c2b28'], ['DIREITO DE FAMÍLIA', '#5a4632'], ['TEORIA DOS CONTRATOS', '#1c1d1f'], ['DIREITO EMPRESARIAL', '#3b2a22']];
  let x = -.62; titles.forEach(([t, c], i) => { const w = [.075, .09, .085, .07, .065, .06, .07, .08][i]; const h = [.33, .36, .35, .32, .31, .3, .32, .34][i]; book(scene, x + w / 2, 0, -.7, w, h, .25, t, c, i === 1 ? 'I' : ''); x += w + .004; });
  book(scene, x + .1, 0, -.72, .07, .3, .25, 'JURISPRUDÊNCIA', '#4a1f1f', '', 0, -.28);
}
function listening(scene) {
  setSeed(203);
  room(scene, { x0: -5, x1: 5, z0: -5, z1: 3, h: 3.1, floor: M('wood', { tone: .42, slat: false }), wall: M('plaster', { base: [86, 84, 78], key: 'lw2' }), ceil: M('plaster', { base: [170, 166, 158], key: 'lc3' }), mullion: 1.25, sideWall: MX('walnut') });
  mesh(scene, new THREE.CylinderGeometry(.55, .55, .04, 48), MX('walnut'), [0, .72, -1.2]); mesh(scene, new THREE.CylinderGeometry(.05, .14, .72, 24), M('metal'), [0, .36, -1.2]);
  const ch = MX('leather', { color: 0x2b221c });
  for (const [x, r] of [[-1.15, Math.PI / 2 - .35], [1.15, -Math.PI / 2 + .35]]) {
    const g = new THREE.Group(); g.position.set(x, 0, -1.2); g.rotation.y = r; scene.add(g);
    const parts = [
      [new THREE.BoxGeometry(.72, .14, .66), [0, .42, 0], [0, 0, 0]],
      [new THREE.BoxGeometry(.72, .62, .12), [0, .78, -.3], [-.18, 0, 0]],
      [new THREE.BoxGeometry(.1, .26, .66), [-.36, .6, 0], [0, 0, 0]],
      [new THREE.BoxGeometry(.1, .26, .66), [.36, .6, 0], [0, 0, 0]],
    ];
    parts.forEach(([geo, p, rot]) => { const m = new THREE.Mesh(geo, ch); m.position.set(...p); m.rotation.set(...rot); m.castShadow = true; m.receiveShadow = true; g.add(m); });
    for (const [lx, lz] of [[-.3, -.26], [.3, -.26], [-.3, .26], [.3, .26]]) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(.018, .014, .35, 10), M('metal')); leg.position.set(lx, .175, lz); leg.castShadow = true; g.add(leg); }
  }
  paper(scene, -.15, -1.25, .3, .42, .3, MX('paper', { key: 'note', title: 'ANOTAÇÕES' })).position.y = .745;
  mesh(scene, new THREE.CylinderGeometry(.008, .008, .3, 12), MX('brushed', { color: 0x1d1d1c }), [.18, .75, -1.1], [Math.PI / 2, 0, .8]);
  mesh(scene, new THREE.CylinderGeometry(.045, .04, .1, 24), M('white', { color: 0xe8e2d6 }), [.25, .79, -1.45]);
  for (let j = 0; j < 3; j++) { box(scene, [-4.98, .9 + j * .55, -4.6], [-4.7, .93 + j * .55, -1.8], MX('walnut'), 1); bookRow(scene, -4.95, -4.75, .93 + j * .55, -3.2, .26, .3, .2, 40 + j); }
  plant(scene, 3.8, 0, -4, 1.6);
  skyline(scene, 30);
}
function analysisDesk(scene) {
  setSeed(204);
  box(scene, [-3, -.1, -2], [3, 0, 2], MX('walnut'), 1.4, false);
  openBook(scene, -.75, 0, -.35, 1.1, .78, -.08);
  paper(scene, .75, .15, .7, 1, .18, MX('paper', { key: 'an1', title: 'PETIÇÃO INICIAL', highlight: true }));
  paper(scene, .95, -.35, .7, 1, .32, MX('paper', { key: 'an2', title: 'MEMORIAL' })).position.y = .002;
  mesh(scene, new THREE.CylinderGeometry(.018, .018, .32, 16), new THREE.MeshStandardMaterial({ color: '#e8cf3a', roughness: .5 }), [.35, .03, .65], [Math.PI / 2, 0, .9]);
  mesh(scene, new THREE.CylinderGeometry(.012, .012, .7, 16), MX('brushed', { color: 0x1d1d1c }), [1.55, .02, .7], [Math.PI / 2, 0, -.4]);
  for (let i = 0; i < 3; i++) box(scene, [-.2 + i * .05, .03, -.72], [-.17 + i * .05, .034, -.6], new THREE.MeshStandardMaterial({ color: ['#c9a85a', '#8aa0b0', '#b07a5a'][i] }), 1, false);
  mesh(scene, new THREE.CylinderGeometry(.06, .06, .14, 24), M('white', { color: 0xe8e2d6 }), [-1.7, .07, .6]);
}
function scheduleDesk(scene) {
  setSeed(205);
  box(scene, [-3, -.1, -2], [3, 0, 2], MX('walnut'), 1.4, false);
  const lap = new THREE.Group(); lap.position.set(-.5, 0, -.35); lap.rotation.y = .12; scene.add(lap);
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.1, .025, .75), MX('steel', { color: 0x8a8d8a })); base.position.y = .013; const scr = new THREE.Mesh(new THREE.BoxGeometry(1.1, .7, .02), MX('steel', { color: 0x8a8d8a })); scr.position.set(0, .36, -.38); scr.rotation.x = -.25;
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.02, .62), M('emissive', { color: 0x2b3438, i: .6 })); screen.position.set(0, .36, -.365); screen.rotation.x = -.25;
  [base, scr, screen].forEach(m => { m.castShadow = true; m.receiveShadow = true; lap.add(m); });
  box(scene, [.6, 0, -.1], [1.3, .05, .85], MX('leather', { color: 0x3a2b20 }), 1);
  box(scene, [1.12, .05, -.1], [1.16, .052, .85], new THREE.MeshStandardMaterial({ color: '#c9a85a', roughness: .4, metalness: .6 }), 1, false);
  folder(scene, -1.700, 0.450, 1.000, 0.700, -.1, 'ACOMPANHAMENTO');
  box(scene, [1.6, 0, -.8], [1.8, .012, -.4], M('metal', { color: 0x1d1d1c }), 1);
  mesh(scene, new THREE.CylinderGeometry(.06, .06, .14, 24), M('white', { color: 0xe8e2d6 }), [1.9, .07, .4]);
}
function realEstateDesk(scene) {
  setSeed(206);
  box(scene, [-3, -.1, -2], [3, 0, 2], MX('walnut'), 1.4, false);
  paper(scene, -.3, -.1, 1, 1.4, .06, MX('paper', { key: 'imo', title: 'INSTRUMENTO DE COMPRA E VENDA', sign: true }));
  const keyMat = MX('brushed');
  const ring = mesh(scene, new THREE.TorusGeometry(.09, .012, 12, 40), keyMat, [.75, .012, .45], [Math.PI / 2, 0, 0]);
  for (const [r, l] of [[.5, .32], [-.3, .28]]) { const g = new THREE.Group(); g.position.set(.75, .012, .45); g.rotation.y = r; scene.add(g); const head = new THREE.Mesh(new THREE.CylinderGeometry(.055, .055, .012, 32), keyMat); head.position.set(.15, 0, 0); const shaft = new THREE.Mesh(new THREE.BoxGeometry(l, .01, .03), keyMat); shaft.position.set(.15 + l / 2 + .04, 0, 0); [head, shaft].forEach(m => { m.castShadow = true; g.add(m); }); }
  void ring;
  folder(scene, -1.750, -0.775, 1.100, 0.850, .12, 'MATRÍCULA E CERTIDÕES');
  mesh(scene, new THREE.CylinderGeometry(.012, .012, .7, 16), MX('brushed', { color: 0x1d1d1c }), [.4, .02, .95], [Math.PI / 2, 0, .9]);
}
function familyDesk(scene) {
  setSeed(207);
  box(scene, [-3, -.1, -2], [3, 0, 2], MX('walnut'), 1.4, false);
  folder(scene, -0.450, -0.100, 1.300, 1.000, -.08, 'INVENTÁRIO E PARTILHA');
  paper(scene, .9, -.1, .8, 1.1, .2, MX('paper', { key: 'fam', title: 'ESCRITURA PÚBLICA' }));
  mesh(scene, new THREE.CylinderGeometry(.014, .014, .62, 16), MX('brushed'), [.3, .03, .75], [Math.PI / 2, 0, -.5]);
  book(scene, -1.9, 0, .2, .3, .05, .44, 'SUCESSÕES', '#5a4632').rotation.set(Math.PI / 2, 0, .4);
  mesh(scene, new THREE.CylinderGeometry(.06, .06, .14, 24), M('white', { color: 0xe8e2d6 }), [1.9, .07, -.9]);
}
function laborDesk(scene) {
  setSeed(208);
  box(scene, [-3, -.1, -2], [3, 0, 2], MX('walnut'), 1.4, false);
  paper(scene, -.6, 0, .9, 1.25, -.1, MX('paper', { key: 'lab1', title: 'CONTRATO DE TRABALHO', sign: true }));
  paper(scene, .6, -.2, .9, 1.25, .14, MX('paper', { key: 'lab2', title: 'TERMO DE RESCISÃO', highlight: true }));
  box(scene, [1.4, 0, .5], [1.75, .03, .95], M('metal', { color: 0x2b2b29 }), 1);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) box(scene, [1.44 + i * .075, .03, .62 + j * .075], [1.49 + i * .075, .04, .67 + j * .075], M('white', { color: 0xd8d4cc }), 1, false);
  book(scene, -2, 0, -.6, .32, .07, .46, 'CONSOLIDAÇÃO DAS LEIS DO TRABALHO', '#22302a').rotation.set(Math.PI / 2, 0, .2);
  mesh(scene, new THREE.CylinderGeometry(.012, .012, .7, 16), MX('brushed', { color: 0x1d1d1c }), [0, .02, .85], [Math.PI / 2, 0, 1.2]);
}
function reception(scene) {
  setSeed(209);
  box(scene, [-8, -.2, -6], [8, 0, 4], MX('nero', { rough: .2 }), 3);
  box(scene, [-8, 3.4, -6], [8, 3.6, 4], M('plaster', { base: [60, 58, 54], key: 'rc' }), 3);
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(8, 2), new THREE.MeshStandardMaterial({ map: wallSignTex(), roughness: .6, metalness: .1 })); sign.position.set(0, 2.15, -5.98); scene.add(sign);
  box(scene, [-8, 0, -6.2], [8, 3.4, -6], new THREE.MeshStandardMaterial({ color: '#1d211e', roughness: .7 }), 3);
  box(scene, [-2.4, 0, -3.8], [2.4, 1.05, -3], MX('walnut'), 2); box(scene, [-2.45, 1.05, -3.85], [2.45, 1.09, -2.95], MX('nero', { key: 'top', base: [30, 31, 29], vein: [120, 116, 108], rough: .25 }), 2);
  box(scene, [-7.9, 0, -5], [-7.6, 3.4, 3], MX('walnut'), 2);
  for (const x of [-5.4, -4.4]) { const ch = MX('leather', { color: 0x2a211b }); box(scene, [x - .35, .42, 1], [x + .35, .5, 1.7], ch, 1); box(scene, [x - .35, .5, 1.62], [x + .35, 1.1, 1.72], ch, 1); }
  plant(scene, 6.6, 0, -5, 2.2);
  for (const x of [-3, 0, 3]) { const l = new THREE.PointLight(0xffd6a0, 10, 6, 2); l.position.set(x, 3, -5); scene.add(l); }
}

// ======================================================================
const darkSky = () => skyTexture('#55606a', '#a9aaa2', '#c9c2b2');

export const SCENES = {

  'hero-biblioteca': { fov: 42, build(s, c) { legalLibrary(s); s.background = darkSky(); sunLight(s, [30, 9, 6], 0xffd9a8, 4.6, 10, [0, 0, -2]); s.add(new THREE.HemisphereLight(0xc8d0d4, 0x2a2622, .3)); look(c, [-3.4, 1.45, 1.6], [.8, 1.0, -3.6]); return { exposure: 1.2, envI: .4 }; } },
  'codigos': { fov: 34, w: 1200, h: 1600, build(s, c) { codesCloseup(s); s.background = new THREE.Color(0x141513); sunLight(s, [3, 2.5, 4], 0xffe0b8, 3.4, 3, [0, .15, -.7]); s.add(new THREE.HemisphereLight(0xcfd6d8, 0x1a1612, .25)); look(c, [-.12, .3, .62], [-.24, .17, -.7]); return { exposure: 1, envI: .3 }; } },
  'escuta': { fov: 44, build(s, c) { listening(s); s.background = darkSky(); fogged(s, 0xb8b4a8, .004); sunLight(s, [16, 9, 30], 0xffd6a0, 4, 10); s.add(new THREE.HemisphereLight(0xd0d6d8, 0x2a2622, .35)); look(c, [-2.6, 1.5, -4.2], [.5, .8, -.4]); return { exposure: 1, envI: .4 }; } },
  'analise': { fov: 32, build(s, c) { analysisDesk(s); s.background = new THREE.Color(0x141513); sunLight(s, [-6, 5, 2], 0xffe0b8, 3.4, 4); s.add(new THREE.HemisphereLight(0xcfd6d8, 0x1a1612, .3)); look(c, [.3, 3.6, 2.4], [0, 0, 0]); return { exposure: 1, envI: .3 }; } },
  'acompanhamento': { fov: 32, build(s, c) { scheduleDesk(s); s.background = new THREE.Color(0x141513); sunLight(s, [5, 5, 3], 0xffe0b8, 3.2, 4); s.add(new THREE.HemisphereLight(0xcfd6d8, 0x1a1612, .3)); look(c, [-.2, 3.2, 2.8], [0, 0, 0]); return { exposure: 1, envI: .3 }; } },
  'imobiliario': { fov: 32, build(s, c) { realEstateDesk(s); s.background = new THREE.Color(0x141513); sunLight(s, [-6, 5, 2], 0xffe0b8, 3.4, 4); s.add(new THREE.HemisphereLight(0xcfd6d8, 0x1a1612, .3)); look(c, [.5, 3.3, 2.5], [0, 0, 0]); return { exposure: 1, envI: .3 }; } },
  'familia-docs': { fov: 32, build(s, c) { familyDesk(s); s.background = new THREE.Color(0x141513); sunLight(s, [6, 4, 2], 0xffd0a0, 3.2, 4); s.add(new THREE.HemisphereLight(0xcfd6d8, 0x1a1612, .3)); look(c, [-.3, 3.3, 2.5], [0, 0, 0]); return { exposure: 1, envI: .3 }; } },
  'trabalhista': { fov: 32, build(s, c) { laborDesk(s); s.background = new THREE.Color(0x141513); sunLight(s, [-6, 5, 2], 0xffe0b8, 3.4, 4); s.add(new THREE.HemisphereLight(0xcfd6d8, 0x1a1612, .3)); look(c, [.2, 3.4, 2.5], [0, 0, 0]); return { exposure: 1, envI: .3 }; } },
  'recepcao': { fov: 44, build(s, c) { reception(s); s.background = new THREE.Color(0x101110); s.add(new THREE.HemisphereLight(0xd0d6d8, 0x2a2622, .4)); sunLight(s, [10, 8, 12], 0xffe0b8, 1.4, 10); look(c, [3.2, 1.6, 3.6], [-.4, 1.7, -6]); return { exposure: 1.05, envI: .4 }; } },
  'hero-lobby': { fov: 40, build(s, c) { lobby(s); s.background = darkSky(); fogged(s, 0xb8b4a8, .004); sunLight(s, [26, 14, 40], 0xffd9a8, 5.2, 30); s.add(new THREE.HemisphereLight(0xc8d0d4, 0x2a2622, .25)); look(c, [-13, 1.3, -12], [3, 3.2, 4]); return { exposure: 1.05, envI: .4 }; } },
  'reuniao': { fov: 46, build(s, c) { meeting(s); s.background = darkSky(); fogged(s, 0xb8b4a8, .004); sunLight(s, [-20, 12, 30], 0xffdcb0, 3.6, 12); s.add(new THREE.HemisphereLight(0xd0d6d8, 0x3a3228, .45)); look(c, [6, 1.8, -5.2], [-2, .9, 0]); return { exposure: .95, envI: .45 }; } },
  'mesa-documentos': { fov: 32, build(s, c) { desk(s); s.background = new THREE.Color(0x141513); sunLight(s, [-6, 5, 2], 0xffe0b8, 3.4, 4); s.add(new THREE.HemisphereLight(0xcfd6d8, 0x1a1612, .3)); look(c, [.6, 3.4, 2.6], [-.1, 0, -.1]); return { exposure: .95, envI: .3 }; } },
  'contrato': { fov: 28, build(s, c) { contractMacro(s); s.background = new THREE.Color(0x141513); sunLight(s, [-5, 4, -1], 0xffe0b8, 3.6, 3); s.add(new THREE.HemisphereLight(0xcfd6d8, 0x1a1612, .25)); look(c, [1.4, 1.2, 1.7], [.1, 0, .2]); return { exposure: .95, envI: .3 }; } },
  'biblioteca': { fov: 44, build(s, c) { library(s); s.background = new THREE.Color(0x1a1a18); sunLight(s, [12, 8, 14], 0xffdcb0, 2.2, 10); s.add(new THREE.HemisphereLight(0xd0d6d8, 0x3a3228, .35)); look(c, [4.5, 1.5, 2.6], [-1.5, 1.4, -5]); return { exposure: 1, envI: .35 }; } },
  'escritorio': { fov: 46, build(s, c) { office(s); s.background = darkSky(); fogged(s, 0xb8b4a8, .004); sunLight(s, [20, 10, 30], 0xffd6a0, 4, 10); s.add(new THREE.HemisphereLight(0xd0d6d8, 0x2a2622, .35)); look(c, [-3.8, 1.6, -4.4], [1.5, 1.2, 1.5]); return { exposure: .95, envI: .4 }; } },
  'fachada': { fov: 44, build(s, c) { facade(s); s.background = skyTexture('#3f4b56', '#9b9a92', '#c8b896'); fogged(s, 0xa9a59a, .005); sunLight(s, [30, 22, 30], 0xffcf98, 3.2, 40); s.add(new THREE.HemisphereLight(0xb8c4cc, 0x2a2622, .4)); look(c, [12, 1.6, 26], [0, 22, -4]); return { exposure: .95, envI: .5 }; } },
  'residencial': { fov: 42, build(s, c) { residential(s); s.background = skyTexture('#6f8592', '#c3c1b6', '#d6cdb8'); fogged(s, 0xc8c2b4, .005); sunLight(s, [-26, 24, 30], 0xffe2bc, 3.2, 40); s.add(new THREE.HemisphereLight(0xc8d2d8, 0x3a3228, .45)); look(c, [-18, 1.6, 30], [0, 13, -3]); return { exposure: .95, envI: .45 }; } },
  'familia': { fov: 48, build(s, c) { living(s); s.background = skyTexture('#46505c', '#b39a7c', '#d9b98e'); fogged(s, 0xb9a487, .01); sunLight(s, [18, 6, 30], 0xffb878, 3, 12); s.add(new THREE.HemisphereLight(0xd8d0c4, 0x3a3228, .45)); look(c, [4.6, 1.5, -6.2], [-2, 1, -1]); return { exposure: 1, envI: .45 }; } },
  'trabalho': { fov: 48, build(s, c) { workstations(s); s.background = darkSky(); fogged(s, 0xb8b4a8, .004); sunLight(s, [-20, 14, 30], 0xffe0b8, 3.4, 18); s.add(new THREE.HemisphereLight(0xd0d6d8, 0x3a3228, .5)); look(c, [10.5, 2, -9], [-4, .8, 1]); return { exposure: .95, envI: .45 }; } },
  'escada': { fov: 50, w: 1200, h: 1600, build(s, c) { stair(s); s.background = new THREE.Color(0x111211); sunLight(s, [-6, 40, -12], 0xffe2b8, 6, 16, [0, 0, -6]); const l = new THREE.PointLight(0xffd8a0, 60, 18, 2); l.position.set(0, 12, -6); s.add(l); s.add(new THREE.HemisphereLight(0xc8d0d4, 0x1a1612, .6)); look(c, [3.2, 1.6, 7], [-.5, 3.2, -8]); return { exposure: 1.25, envI: .45 }; } },
  'pedra-latao': { fov: 34, w: 1200, h: 1600, build(s, c) { brassWall(s); s.background = new THREE.Color(0x121312); sunLight(s, [-14, 9, 6], 0xffdcb0, 4, 10); s.add(new THREE.HemisphereLight(0xc8d0d4, 0x1a1612, .2)); look(c, [3.6, 1.2, 6.5], [-.2, 3, 0]); return { exposure: .95, envI: .4 }; } },
  'retrato-1': { fov: 34, w: 1200, h: 1500, build(s, c) { office(s, { fig: { x: 1.4, z: 1.6, r: -.6 } }); s.background = darkSky(); fogged(s, 0xb8b4a8, .004); sunLight(s, [10, 8, 30], 0xffd6a0, 4.4, 10); s.add(new THREE.HemisphereLight(0xd0d6d8, 0x2a2622, .25)); look(c, [-1.2, 1.35, -2.2], [1.3, 1.25, 1.6]); return { exposure: .95, envI: .4, gray: false }; } },
  'retrato-2': { fov: 32, w: 1200, h: 1500, build(s, c) { office(s, { fig: { x: -2.6, z: 2.2, r: .5 } }); s.background = darkSky(); fogged(s, 0xb8b4a8, .004); sunLight(s, [-14, 8, 30], 0xffd6a0, 4.4, 10); s.add(new THREE.HemisphereLight(0xd0d6d8, 0x2a2622, .25)); look(c, [1.4, 1.4, -1.8], [-2.6, 1.3, 2.2]); return { exposure: .95, envI: .4, gray: false }; } },
  'retrato-3': { fov: 34, w: 1200, h: 1500, build(s, c) { meeting(s); figure(s, -4.6, 2.4, 2.4, 1); s.background = darkSky(); fogged(s, 0xb8b4a8, .004); sunLight(s, [-20, 10, 30], 0xffdcb0, 3.8, 12); s.add(new THREE.HemisphereLight(0xd0d6d8, 0x3a3228, .3)); look(c, [-.8, 1.45, -1.4], [-4.6, 1.25, 2.4]); return { exposure: .95, envI: .4, gray: false }; } },
};
