import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/*
 * PSP-1000 geometry in millimetres, origin at the centre of the device, +y up, +z towards the viewer.
 * Overall size 170 × 74 × 23 mm. The outline and every feature position were traced from a straight-on
 * product photo of a Piano Black PSP-1000 (924 px wide → 5.435 px/mm).
 */

export const DEPTH = 23;
export const FRONT = DEPTH / 2; // z of the flat front face

// Top-left quarter of the outline, from top-centre to left-middle.
const QUARTER: [number, number][] = [
  [0, 37], [-20, 37], [-40, 37], [-56, 37], [-62, 36.95], [-65.6, 36.75], [-67.9, 36.3], [-69.7, 35.5],
  [-71.2, 34.1], [-72.8, 32.3], [-74.6, 30.1], [-76.6, 27.6], [-78.4, 24.9], [-79.9, 22.0], [-81.2, 19.0],
  [-82.3, 15.8], [-83.3, 12.4], [-84.1, 8.8], [-84.6, 5.2], [-84.9, 2.2], [-85, 0],
];

/** Full outline, counter-clockwise, densely resampled with a closed Catmull-Rom spline. */
export function outlinePoints(samples = 260): THREE.Vector2[] {
  const q = QUARTER;
  const tl = q;
  const bl = [...q].reverse().slice(1).map(([x, y]) => [x, -y] as [number, number]);
  const br = q.slice(1).map(([x, y]) => [-x, -y] as [number, number]);
  const tr = [...q].reverse().slice(1, -1).map(([x, y]) => [-x, y] as [number, number]);
  const pts = [...tl, ...bl, ...br, ...tr].map(([x, y]) => new THREE.Vector3(x, y, 0));
  const curve = new THREE.CatmullRomCurve3(pts, true, 'centripetal');
  return curve.getSpacedPoints(samples).slice(0, -1).map((p) => new THREE.Vector2(p.x, p.y));
}

/** Offset a closed CCW polyline: positive = outward. */
export function offsetPolyline(pts: THREE.Vector2[], d: number): THREE.Vector2[] {
  const n = pts.length;
  return pts.map((p, i) => {
    const a = pts[(i - 1 + n) % n];
    const b = pts[(i + 1) % n];
    const t = new THREE.Vector2().subVectors(b, a).normalize();
    const normal = new THREE.Vector2(t.y, -t.x); // outward for CCW
    return p.clone().addScaledVector(normal, d);
  });
}

function smooth(g: THREE.BufferGeometry) {
  g.deleteAttribute('normal');
  g.deleteAttribute('uv');
  const m = mergeVertices(g, 1e-3);
  m.computeVertexNormals();
  return m;
}

/** Main shell: flat front, rounded edges all round. */
export function bodyGeometry() {
  const bevel = 2.2;
  const bevelT = 3.6;
  const depth = DEPTH - bevelT * 2;
  const shape = new THREE.Shape(offsetPolyline(outlinePoints(), -bevel));
  const g = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevelT,
    bevelSize: bevel,
    bevelSegments: 12,
    curveSegments: 1,
    steps: 1,
  });
  g.translate(0, 0, -depth / 2);
  return smooth(g);
}

/**
 * Silver L/R shoulder caps that wrap the top corners. Built from the outline segment between the
 * top edge (x ≈ −55) and the side (y ≈ 29), thickened inwards — thickest at the corner, like the real part.
 */
export function shoulderGeometry(side: 'l' | 'r') {
  const all = outlinePoints(520);
  const inCorner = (p: THREE.Vector2) => p.x < -54.5 && p.y > 28.5;
  // outline runs CCW, so within the corner it goes from the top edge (x ≈ −55) towards the side
  const seg = all.filter(inCorner).sort((a, b) => b.x - a.x);
  const n = seg.length;
  const bevel = 0.7;
  const outer: THREE.Vector2[] = [];
  const inner: THREE.Vector2[] = [];
  seg.forEach((p, i) => {
    const t = i / (n - 1);
    const thick = 2.4 + Math.sin(t * Math.PI) * 2.4 + t * 0.5; // 2.4 at the top end → ~4.8 at the corner → 2.9
    const tan = new THREE.Vector2().subVectors(seg[Math.min(n - 1, i + 1)], seg[Math.max(0, i - 1)]).normalize();
    const inward = new THREE.Vector2(-tan.y, tan.x); // inward normal for a CCW outline
    // the extrude bevel grows the shape by `bevel`, so pre-shrink both edges
    outer.push(p.clone().addScaledVector(inward, bevel - 0.35));
    inner.push(p.clone().addScaledVector(inward, thick - bevel));
  });
  let ring = [...outer, ...inner.reverse()];
  if (side === 'r') ring = ring.map((p) => new THREE.Vector2(-p.x, p.y)); // ExtrudeGeometry fixes the winding
  const depth = 17;
  const g = new THREE.ExtrudeGeometry(new THREE.Shape(ring), {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.9,
    bevelSize: 0.7,
    bevelSegments: 5,
    curveSegments: 1,
  });
  g.translate(0, 0, FRONT + 0.1 - depth - 0.9); // front sits just proud of the face
  return smooth(g);
}

/** Rounded polygon helper (corner radius r). */
function roundedPoly(points: [number, number][], r: number) {
  const s = new THREE.Shape();
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const p = new THREE.Vector2(...points[i]);
    const prev = new THREE.Vector2(...points[(i - 1 + n) % n]);
    const next = new THREE.Vector2(...points[(i + 1) % n]);
    const a = p.clone().add(prev.clone().sub(p).normalize().multiplyScalar(Math.min(r, prev.distanceTo(p) / 2)));
    const b = p.clone().add(next.clone().sub(p).normalize().multiplyScalar(Math.min(r, next.distanceTo(p) / 2)));
    if (i === 0) s.moveTo(a.x, a.y);
    else s.lineTo(a.x, a.y);
    s.quadraticCurveTo(p.x, p.y, b.x, b.y);
  }
  s.closePath();
  return s;
}

/** One d-pad arrow key, pointing up (tip towards −y, i.e. the d-pad centre). 8.0 × 8.4 mm. */
export function dpadKeyGeometry() {
  const w = 7.6;
  const l = 8.0;
  const shape = roundedPoly(
    [
      [-w / 2, l / 2],
      [-w / 2, -l / 2 + 2.9],
      [0, -l / 2],
      [w / 2, -l / 2 + 2.9],
      [w / 2, l / 2],
    ],
    1.4,
  );
  const g = new THREE.ExtrudeGeometry(shape, { depth: 1.1, bevelEnabled: true, bevelThickness: 0.55, bevelSize: 0.5, bevelSegments: 5, curveSegments: 6 });
  return smooth(g);
}

/** Pill-shaped key for the bottom row. */
export function pillGeometry(w: number, h: number) {
  const r = Math.min(h / 2, w / 2) - 0.01;
  const s = new THREE.Shape();
  const x = w / 2 - r;
  s.moveTo(-x, -h / 2);
  s.lineTo(x, -h / 2);
  s.absarc(x, 0, r, -Math.PI / 2, Math.PI / 2, false);
  s.lineTo(-x, h / 2);
  s.absarc(-x, 0, r, Math.PI / 2, (Math.PI * 3) / 2, false);
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.5, bevelEnabled: true, bevelThickness: 0.45, bevelSize: 0.35, bevelSegments: 4, curveSegments: 10 });
  return smooth(g);
}

/** Domed round face button (Ø 8.6 mm). Lathe profile in (radius, height). */
export function faceButtonGeometry() {
  const prof = [
    [0, 2.42], [1.4, 2.41], [2.3, 2.36], [3.1, 2.2], [3.7, 1.95], [4.1, 1.6], [4.3, 1.15], [4.35, 0],
  ].map(([r, z]) => new THREE.Vector2(r, z));
  const g = new THREE.LatheGeometry(prof, 48);
  g.rotateX(Math.PI / 2); // lathe axis y → z
  return g;
}

/** Analog nub: a low, slightly concave disc (Ø 11.2 mm). */
export function nubGeometry() {
  const prof = [
    [0, 1.25], [2.5, 1.3], [4.3, 1.42], [5.2, 1.3], [5.6, 0.85], [5.6, 0],
  ].map(([r, z]) => new THREE.Vector2(r, z));
  const g = new THREE.LatheGeometry(prof, 56);
  g.rotateX(Math.PI / 2);
  return g;
}

/** Rounded square rotated 45° — the plate under the face buttons. */
export function diamondShape(halfDiag: number, r: number) {
  return roundedPoly(
    [
      [0, halfDiag],
      [-halfDiag, 0],
      [0, -halfDiag],
      [halfDiag, 0],
    ],
    r,
  );
}

/* ───────────────────────── Canvas textures ───────────────────────── */

const PX = 10; // px per mm for the face print

function canvas(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

function tex(c: HTMLCanvasElement) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/** Everything printed or moulded flat on the front: labels, logo, LED icons, grille, speakers. */
export function facePrintTexture(ink: string, dark: string) {
  const W = 170 * PX;
  const H = 74 * PX;
  const c = canvas(W, H);
  const g = c.getContext('2d')!;
  const X = (x: number) => (x + 85) * PX;
  const Y = (y: number) => (37 - y) * PX;
  g.fillStyle = ink;
  g.strokeStyle = ink;
  g.textBaseline = 'middle';

  // top grille (perforated strip between the shoulders)
  g.fillStyle = dark;
  for (let x = -53.5; x <= 53.5; x += 0.9) {
    for (let row = 0; row < 3; row++) {
      g.beginPath();
      g.arc(X(x + (row % 2) * 0.45), Y(34.3 - row * 0.55), 0.22 * PX, 0, Math.PI * 2);
      g.fill();
    }
  }

  // speaker grilles under the d-pad and face buttons
  for (const sx of [-55.9, 56.3]) {
    for (let i = -2; i <= 2; i++)
      for (let j = -1; j <= 1; j++) {
        g.beginPath();
        g.arc(X(sx + i * 0.55 + (j % 2 ? 0.27 : 0)), Y(-27.3 + j * 0.5), 0.17 * PX, 0, Math.PI * 2);
        g.fill();
      }
  }

  g.fillStyle = ink;
  g.strokeStyle = ink;
  // POWER / HOLD
  g.font = `600 ${1.55 * PX}px "Space Grotesk", sans-serif`;
  g.textAlign = 'right';
  g.fillText('POWER', X(79.2), Y(-15.5));
  g.fillText('HOLD', X(76.0), Y(-22.0));

  // LED icons (power, WLAN)
  g.lineWidth = 0.18 * PX;
  g.beginPath();
  g.arc(X(-76.6), Y(-14.9), 0.75 * PX, -Math.PI * 0.32, Math.PI * 1.32);
  g.stroke();
  g.beginPath();
  g.moveTo(X(-76.6), Y(-14.0));
  g.lineTo(X(-76.6), Y(-14.9));
  g.stroke();
  for (let i = 1; i <= 3; i++) {
    g.beginPath();
    g.arc(X(-75.6), Y(-22.6), i * 0.45 * PX, -Math.PI * 0.5, -Math.PI * 0.05);
    g.stroke();
  }

  // VOL
  g.textAlign = 'center';
  g.font = `700 ${1.55 * PX}px "Space Grotesk", sans-serif`;
  g.fillText('VOL', X(-29.0), Y(-32.6));

  // PSP logotype, outlined like the real one
  g.save();
  g.translate(X(0.2), Y(-32.6));
  g.transform(1.45, 0, -0.21 * 1.45, 1, 0, 0);
  g.font = `800 ${4.6 * PX}px "NewRodin", "Space Grotesk", sans-serif`;
  g.lineWidth = 0.22 * PX;
  g.strokeText('PSP', 0, 0.2 * PX);
  g.restore();

  // thin rim around the d-pad well (the photo shows a light catch on the lower right)
  g.lineWidth = 0.22 * PX;
  g.globalAlpha = 0.35;
  g.beginPath();
  g.arc(X(-66.1), Y(2.5), 13.1 * PX, -0.2, Math.PI * 0.75);
  g.stroke();
  g.globalAlpha = 1;
  return tex(c);
}

/** Face-button symbol, drawn as a light outline on transparent. */
export function glyphTexture(kind: 'tri' | 'cir' | 'crs' | 'sqr' | 'up', ink: string) {
  const S = 256;
  const c = canvas(S, S);
  const g = c.getContext('2d')!;
  g.strokeStyle = ink;
  g.lineWidth = 14;
  g.lineJoin = 'round';
  g.lineCap = 'round';
  const m = S / 2;
  g.beginPath();
  if (kind === 'tri') {
    g.moveTo(m, m - 62);
    g.lineTo(m + 66, m + 50);
    g.lineTo(m - 66, m + 50);
    g.closePath();
  } else if (kind === 'cir') {
    g.arc(m, m, 58, 0, Math.PI * 2);
  } else if (kind === 'crs') {
    g.moveTo(m - 52, m - 52);
    g.lineTo(m + 52, m + 52);
    g.moveTo(m + 52, m - 52);
    g.lineTo(m - 52, m + 52);
  } else if (kind === 'sqr') {
    g.rect(m - 52, m - 52, 104, 104);
  } else {
    // d-pad arrow: small outlined triangle pointing up
    g.lineWidth = 12;
    g.moveTo(m, m - 46);
    g.lineTo(m + 56, m + 40);
    g.lineTo(m - 56, m + 40);
    g.closePath();
  }
  g.stroke();
  return tex(c);
}

/** Label for a bottom-row key cap. */
export function capLabelTexture(label: string, wmm: number, hmm: number, ink: string) {
  const s = 40; // px per mm
  const c = canvas(Math.round(wmm * s), Math.round(hmm * s));
  const g = c.getContext('2d')!;
  g.fillStyle = ink;
  g.strokeStyle = ink;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  const cx = c.width / 2;
  const cy = c.height / 2;
  if (label === 'display') {
    g.lineWidth = 0.32 * s;
    g.beginPath();
    g.roundRect(cx - 1.35 * s, cy - 0.95 * s, 2.7 * s, 1.9 * s, 0.45 * s);
    g.stroke();
    g.beginPath();
    g.arc(cx, cy, 0.42 * s, 0, Math.PI * 2);
    g.fill();
  } else if (label === 'note') {
    g.font = `700 ${2.6 * s}px "Space Grotesk", sans-serif`;
    g.fillText('♪', cx, cy + 0.1 * s);
  } else {
    g.font = `700 ${(label.length > 1 ? 1.45 : 2.4) * s}px "Space Grotesk", sans-serif`;
    g.fillText(label, cx, cy + 0.08 * s);
  }
  return tex(c);
}

/** Knurled dot pattern for the analog nub top (as a colour/alpha overlay). */
export function knurlTexture() {
  const S = 256;
  const c = canvas(S, S);
  const g = c.getContext('2d')!;
  g.fillStyle = 'rgba(8,9,11,0.9)';
  for (let y = 6; y < S; y += 12) {
    for (let x = 6 + ((y / 12) % 2) * 6; x < S; x += 12) {
      g.beginPath();
      g.arc(x, y, 3.2, 0, Math.PI * 2);
      g.fill();
    }
  }
  const t = tex(c);
  return t;
}
