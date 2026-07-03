/**
 * @schema 2.11
 * @input field: boolean = false
 * @input glow: boolean = true
 */

// Colors mirror the document variables exactly:
// $cyan, $cyan-peak, $dot-off, $rec-red
const cyan = "#39BFC6";
const peak = "#7DE8ED";
const off = "#cdd6da1F";
const red = "#ff5454";

const W = pencil.width;
const H = pencil.height;
const S = Math.min(W, H);
const cx = W / 2;
const cy = H / 2;
const field = pencil.input.field;
const glow = pencil.input.glow;

function rad(d) { return (d * Math.PI) / 180; }
function px(angle, radius) {
  return [cx + radius * Math.cos(rad(angle)), cy - radius * Math.sin(rad(angle))];
}
function angDist(a, b) {
  let d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}
function dot(name, x, y, d, fill, glowColor, glowBlur, opacity) {
  const n = { type: "ellipse", name, x: x - d / 2, y: y - d / 2, width: d, height: d, fill };
  if (opacity != null) n.opacity = opacity;
  if (glowColor) {
    n.effect = { type: "shadow", shadowType: "outer", offset: { x: 0, y: 0 }, blur: glowBlur, spread: 0, color: glowColor };
  }
  return n;
}

const nodes = [];

// (1) Faint OFF-dot field — scoreboard texture, behind everything
if (field) {
  const sp = S * 0.066;
  const fd = Math.max(1.5, S * 0.022);
  let row = 0;
  for (let yy = sp / 2; yy < H; yy += sp) {
    const stagger = row % 2 ? sp / 2 : 0;
    for (let xx = sp / 2 + stagger; xx < W; xx += sp) {
      const dx = xx - cx, dy = yy - cy;
      if (Math.sqrt(dx * dx + dy * dy) < S * 0.1) continue; // keep core clear
      nodes.push(dot("Off Dot", xx, yy, fd, off));
    }
    row++;
  }
}

// (2) The cyan aperture ring — a dotted iris broken open at the top-right corner
const r = S * 0.36;
const dotD = S * 0.046;
const count = 24;
const gapStart = 14;
const gapEnd = 56; // open arc (the aperture opening)
const mid = (gapStart + gapEnd) / 2;
for (let i = 0; i < count; i++) {
  const a = i * (360 / count);
  if (a > gapStart && a < gapEnd) continue;
  const [x, y] = px(a, r);
  const near = Math.min(angDist(a, gapStart), angDist(a, gapEnd));
  const isPeak = near < 26;
  const d = isPeak ? dotD * 1.12 : dotD;
  nodes.push(dot(
    isPeak ? "Ring Dot Peak" : "Ring Dot",
    x, y, d,
    isPeak ? peak : cyan,
    glow && isPeak ? "#7DE8ED66" : null,
    S * 0.05
  ));
}

// (3) Escaping ping-dots — flying out of the opening, smaller + fainter as they go
const escA = [mid + 1, mid - 6, mid + 8, mid - 1];
const escR = [S * 0.42, S * 0.448, S * 0.47, S * 0.486];
const escD = [dotD * 0.9, dotD * 0.7, dotD * 0.52, dotD * 0.38];
const escO = [1.0, 0.82, 0.62, 0.42];
for (let i = 0; i < escA.length; i++) {
  const [x, y] = px(escA[i], escR[i]);
  nodes.push(dot("Ping Dot", x, y, escD[i], peak, glow ? "#7DE8ED88" : null, S * 0.05, escO[i]));
}

// (4) The red REC core — the only red, glowing at the source
const coreD = S * 0.12;
nodes.push(dot("Core Halo", cx, cy, coreD * 2.4, red, null, null, 0.14));
nodes.push(dot("REC Core", cx, cy, coreD, red, glow ? "#ff5454CC" : null, S * 0.07));

return nodes;
