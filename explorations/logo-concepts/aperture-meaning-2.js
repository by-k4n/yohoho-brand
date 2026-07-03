/**
 * @schema 2.11
 * @input concept: enum("micpickup", "cursorportal", "private", "shuttersnap", "soundhole") = "micpickup"
 * @input glow: boolean = true
 */

const cyan = "#39BFC6";
const peak = "#7DE8ED";
const red = "#ff5454";

const W = pencil.width;
const H = pencil.height;
const S = Math.min(W, H);
const cx = W / 2;
const cy = H / 2;

const concept = pencil.input.concept;
const glow = pencil.input.glow;
const compact = S < 30;

function rad(d) { return (d * Math.PI) / 180; }
function px(a, r) { return [cx + r * Math.cos(rad(a)), cy - r * Math.sin(rad(a))]; }
function pxo(ox, oy, a, r) { return [ox + r * Math.cos(rad(a)), oy - r * Math.sin(rad(a))]; }
function lerp(a, b, t) { return a + (b - a) * t; }
function dot(name, x, y, d, fill, glowColor, glowBlur, opacity) {
  const n = { type: "ellipse", name, x: x - d / 2, y: y - d / 2, width: d, height: d, fill };
  if (opacity != null) n.opacity = opacity;
  if (glowColor) n.effect = { type: "shadow", shadowType: "outer", offset: { x: 0, y: 0 }, blur: glowBlur, spread: 0, color: glowColor };
  return n;
}

const nodes = [];
const gb = S * 0.05;

function redCore(opts) {
  opts = opts || {};
  const d = opts.d != null ? opts.d : S * 0.105;
  const sealed = opts.sealed;
  const ccx = opts.cx != null ? opts.cx : cx;
  const ccy = opts.cy != null ? opts.cy : cy;
  const o = opts.opacity != null ? opts.opacity : (sealed ? 0.85 : 1);
  if (!sealed) nodes.push(dot("Core Halo", ccx, ccy, d * 2.3, red, null, null, 0.14));
  nodes.push(dot("REC Core", ccx, ccy, d, red, glow && !sealed ? "#ff5454CC" : null, S * 0.07, o));
}

if (concept === "micpickup") {
  // MIC PICKUP-PATTERN — concentric cardioid arcs = a mic's polar field opening toward the speaker.
  const ox = cx;
  const oy = cy + S * 0.13;
  const contours = compact ? [[0.17, 7]] : [[0.10, 8], [0.16, 12], [0.22, 16]];
  const span = 320, startA = 305;
  for (let c = 0; c < contours.length; c++) {
    const cs = contours[c][0], n = contours[c][1];
    for (let i = 0; i < n; i++) {
      const a = startA + i * (span / (n - 1));
      const r = cs * S * (1 + Math.sin(rad(a)));
      const [x, y] = pxo(ox, oy, a, r);
      const am = ((a % 360) + 360) % 360;
      const isPeak = !compact && c === contours.length - 1 && am > 70 && am < 110;
      const d = S * 0.046 * (1 - c * 0.06);
      nodes.push(dot(isPeak ? "Field Peak" : "Field Dot", x, y, isPeak ? d * 1.15 : d, isPeak ? peak : cyan, glow && isPeak ? "#7DE8ED66" : null, gb, 0.92 - c * 0.16));
    }
  }
  redCore({ cy: oy, d: S * 0.095 });
} else if (concept === "cursorportal") {
  // CURSOR PORTAL — an iris opening around a text caret where transcribed words land.
  const R = S * 0.30;
  const n = compact ? 8 : 16;
  const dotD = S * 0.05;
  for (let i = 0; i < n; i++) {
    const a = i * (360 / n);
    const [x, y] = px(a, R);
    const isPeak = !compact && i % 4 === 0;
    nodes.push(dot(isPeak ? "Iris Peak" : "Iris Dot", x, y, isPeak ? dotD * 1.1 : dotD, isPeak ? peak : cyan, glow && isPeak ? "#7DE8ED66" : null, gb));
  }
  if (compact) {
    redCore({ d: S * 0.16 });
  } else {
    for (let k = 0; k < 3; k++) {
      nodes.push(dot("Word In", cx, cy - S * 0.22 + k * S * 0.06, S * 0.032, cyan, null, null, 0.22 + 0.22 * k));
    }
    const cw = S * 0.05, ch = S * 0.26;
    const caret = { type: "rectangle", name: "Caret", x: cx - cw / 2, y: cy - ch / 2, width: cw, height: ch, cornerRadius: cw / 2, fill: red };
    if (glow) caret.effect = { type: "shadow", shadowType: "outer", offset: { x: 0, y: 0 }, blur: S * 0.06, spread: 0, color: "#ff5454AA" };
    nodes.push(caret);
  }
} else if (concept === "private") {
  // PRIVATE / LOCAL — a mostly-closed iris opening only a sliver, the red core sealed inside.
  const Rout = S * 0.30, nout = compact ? 8 : 18;
  const oD = S * 0.05;
  for (let i = 0; i < nout; i++) {
    const a = i * (360 / nout);
    const [x, y] = px(a, Rout);
    nodes.push(dot("Shell Dot", x, y, oD, cyan, null, null, 0.9));
  }
  if (!compact) {
    const Rin = S * 0.155, nin = 14;
    for (let i = 0; i < nin; i++) {
      if (i === 0) continue;
      const a = 90 + i * (360 / nin);
      const [x, y] = px(a, Rin);
      nodes.push(dot("Seal Dot", x, y, S * 0.05, cyan, null, null, 0.55));
    }
    nodes.push(dot("Sliver", cx, cy - S * 0.355, S * 0.026, cyan, null, null, 0.5));
    nodes.push(dot("Sliver", cx, cy - S * 0.41, S * 0.02, cyan, null, null, 0.3));
  }
  redCore({ sealed: true, d: S * 0.075 });
} else if (concept === "shuttersnap") {
  // SHUTTER SNAP — a diaphragm stopping down to capture the spoken moment; red = the captured frame.
  const blades = 6;
  const Rclosed = S * 0.17, Ropen = S * 0.30, rot = 18;
  if (!compact) {
    for (let v = 0; v < blades; v++) {
      const a = v * 60;
      const [x, y] = px(a, Ropen);
      nodes.push(dot("Ghost Vertex", x, y, S * 0.044, cyan, null, null, 0.16));
    }
  }
  const perEdge = compact ? 1 : 3;
  const dotD = S * 0.046;
  for (let v = 0; v < blades; v++) {
    const a1 = v * 60 + rot;
    const a2 = (v + 1) * 60 + rot;
    const [x1, y1] = px(a1, Rclosed);
    const [x2, y2] = px(a2, Rclosed);
    nodes.push(dot("Blade Vertex", x1, y1, dotD * 1.15, peak, glow ? "#7DE8ED55" : null, gb));
    for (let t = 1; t <= perEdge; t++) {
      const f = t / (perEdge + 1);
      nodes.push(dot("Blade Dot", lerp(x1, x2, f), lerp(y1, y2, f), dotD, cyan, null, null, 0.95));
    }
  }
  redCore({ d: S * 0.085 });
} else {
  // SOUND-HOLE / RESONATOR — the aperture as an instrument's sound hole; sound resonating in and out.
  const rings = compact ? [[0.16, 8]] : [[0.13, 10], [0.21, 16], [0.29, 22]];
  for (let c = 0; c < rings.length; c++) {
    const R = rings[c][0] * S, n = rings[c][1];
    for (let i = 0; i < n; i++) {
      const a = i * (360 / n);
      const [x, y] = px(a, R);
      const isPeak = !compact && c === 0 && i % 5 === 0;
      const d = S * 0.042 * (1 - c * 0.12);
      nodes.push(dot(isPeak ? "Rosette Peak" : "Rosette Dot", x, y, isPeak ? d * 1.15 : d, isPeak ? peak : cyan, glow && isPeak ? "#7DE8ED55" : null, gb, 0.92 - c * 0.18));
    }
  }
  redCore({ d: S * 0.1 });
}

return nodes;
