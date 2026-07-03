/**
 * @schema 2.11
 * @input mode: enum("ring", "ripples", "bloom", "lobe") = "ring"
 * @input cols: number = 15
 * @input rows: number = 15
 * @input pitch: number = 32
 * @input srcCol: number = 4
 * @input srcRow: number = 5
 */
const GREY = "#cdd6da1F";
const CYAN = "#39BFC6";
const PEAK = "#7DE8ED";
const DIM = "#39BFC6AA";
const RED = "#ff5454";
const GLOW = "#39BFC652";

const mode = pencil.input.mode;
const cols = Math.round(pencil.input.cols);
const rows = Math.round(pencil.input.rows);
const P = pencil.input.pitch;
const sc = pencil.input.srcCol;
const sr = pencil.input.srcRow;
const d = P * 0.34;

const cx = (cols - 1) / 2;
const cy = (rows - 1) / 2;
const dir = Math.atan2(cy - sr, cx - sc);

function glow(blur, spread, color) {
  return { type: "shadow", shadowType: "outer", offset: { x: 0, y: 0 }, blur, spread, color };
}

function classify(dd, theta) {
  if (mode === "ring") {
    const R = 5.5, w = 0.72;
    const off = Math.abs(dd - R);
    if (off <= w) return { color: off <= w * 0.42 ? PEAK : CYAN, glow: off <= w * 0.7 };
    return null;
  }
  if (mode === "ripples") {
    const spacing = 3, w = 0.55, N = 4;
    let best = Infinity;
    for (let k = 1; k <= N; k++) best = Math.min(best, Math.abs(dd - k * spacing));
    if (best <= w) return { color: best <= w * 0.42 ? PEAK : CYAN, glow: best <= w * 0.6 };
    return null;
  }
  if (mode === "bloom") {
    const maxR = 9.2;
    if (dd > maxR) return null;
    const b = 1 - dd / maxR;
    let color;
    if (b > 0.66) color = PEAK;
    else if (b > 0.34) color = CYAN;
    else color = DIM;
    return { color, glow: b > 0.5 };
  }
  if (mode === "lobe") {
    const R0 = 4.4, w = 0.85;
    const R = R0 * (1 + 0.6 * Math.cos(theta - dir));
    const off = Math.abs(dd - R);
    if (off <= w) return { color: off <= w * 0.42 ? PEAK : CYAN, glow: off <= w * 0.65 };
    return null;
  }
  return null;
}

const nodes = [];
for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    const px = c * P + (P - d) / 2;
    const py = r * P + (P - d) / 2;
    if (c === sc && r === sr) {
      nodes.push({
        type: "ellipse", name: "source", x: px - 0.5, y: py - 0.5,
        width: d + 1, height: d + 1, fill: RED, effect: glow(7, 1, "#ff545455"),
      });
      continue;
    }
    const dd = Math.sqrt((c - sc) ** 2 + (r - sr) ** 2);
    const theta = Math.atan2(r - sr, c - sc);
    const res = classify(dd, theta);
    if (res) {
      nodes.push({
        type: "ellipse", name: "lit-" + c + "-" + r, x: px, y: py,
        width: d, height: d, fill: res.color,
        effect: res.glow ? glow(8, 1, GLOW) : undefined,
      });
    } else {
      nodes.push({
        type: "ellipse", name: "dot-" + c + "-" + r, x: px, y: py,
        width: d, height: d, fill: GREY,
      });
    }
  }
}
return nodes;
