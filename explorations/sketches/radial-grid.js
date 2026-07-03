/**
 * @schema 2.11
 * @input gridType: enum("square", "polar", "hex") = "square"
 */
const W = pencil.width;
const H = pencil.height;
const type = pencil.input.gridType;

const GREY = "#cdd6da1F";
const RED = "#ff5454";
const CYAN = "#39BFC6";
const PEAK = "#7DE8ED";
const DIM = "#39BFC6AA";

const sp = W / 16;
const sx = Math.round(0.375 * W / sp) * sp;
const sy = Math.round(0.4375 * H / sp) * sp;

const rings = [3 * sp, 5 * sp, 7 * sp];
const w = 0.55 * sp;

function litStyle(d) {
  let best = -1, bd = 1e9;
  for (let i = 0; i < rings.length; i++) {
    const diff = Math.abs(d - rings[i]);
    if (diff <= w && diff < bd) { bd = diff; best = i; }
  }
  if (best === -1) return null;
  if (best === 0) return { fill: PEAK, r: 4.4, glow: true };
  if (best === 1) return { fill: CYAN, r: 3.9, glow: false };
  return { fill: DIM, r: 3.4, glow: false };
}

const pts = [];

if (type === "square") {
  for (let y = 0; y <= H + 0.5; y += sp)
    for (let x = 0; x <= W + 0.5; x += sp)
      pts.push({ x, y });
} else if (type === "hex") {
  const rh = sp * 0.866;
  let row = 0;
  for (let y = 0; y <= H + 0.5; y += rh) {
    const off = (row % 2) ? sp / 2 : 0;
    for (let x = off; x <= W + 0.5; x += sp) pts.push({ x, y });
    row++;
  }
} else {
  pts.push({ x: sx, y: sy });
  const maxR = Math.hypot(Math.max(sx, W - sx), Math.max(sy, H - sy));
  for (let k = 1; k * sp <= maxR + 0.5; k++) {
    const rad = k * sp;
    const count = Math.max(6, Math.round((2 * Math.PI * rad) / sp));
    for (let j = 0; j < count; j++) {
      const a = (2 * Math.PI * j) / count;
      const x = sx + rad * Math.cos(a);
      const y = sy + rad * Math.sin(a);
      if (x < -1 || x > W + 1 || y < -1 || y > H + 1) continue;
      pts.push({ x, y });
    }
  }
}

const nodes = [];
for (const p of pts) {
  const d = Math.hypot(p.x - sx, p.y - sy);
  const isSrc = d < 0.4 * sp;
  let fill = GREY, r = 2.7, glow = false;
  if (isSrc) {
    fill = RED; r = 4.2; glow = false;
  } else {
    const lit = litStyle(d);
    if (lit) { fill = lit.fill; r = lit.r; glow = lit.glow; }
  }
  const node = {
    type: "ellipse",
    name: isSrc ? "Source" : "Dot",
    x: p.x - r,
    y: p.y - r,
    width: r * 2,
    height: r * 2,
    fill,
  };
  if (glow) {
    node.effect = { type: "shadow", shadowType: "outer", offset: { x: 0, y: 0 }, blur: 7, spread: 1, color: "#7DE8EDCC" };
  }
  if (isSrc) {
    node.effect = { type: "shadow", shadowType: "outer", offset: { x: 0, y: 0 }, blur: 8, spread: 1, color: "#ff5454AA" };
  }
  nodes.push(node);
}

return nodes;
